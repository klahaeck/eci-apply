// import { NextRequest } from 'next/server';

let aesKey = null;
const getAesKey = async (secret) => {
  if ( aesKey === null ) throw TypeError('aesKey is null');
  return await aesKey;
}

const initAesKey = async (secret) => {
  const baseKey = await crypto.subtle.importKey(
    'raw',
    Buffer.from(secret),
    'HKDF',
    false,
    ['deriveKey']
  );
  return crypto.subtle.deriveKey(
    {
      name: 'HKDF',
      hash: 'SHA-256',
      info: Buffer.from('JWE CEK'),
      salt: Buffer.alloc(32, 0) // '' is also fine
    },
    baseKey,
    {
      name: 'AES-GCM', 
      length: 256 
    },
    true,
    ['encrypt', 'decrypt']
  )
}

const getDecryptionParameters = async (jwe, secret) => {
  // https://github.com/panva/jose/blob/v2.0.5/lib/jwe/decrypt.js
  let [prot, _, iv, ciphertext, tag] = jwe.split('.');  // line 81
  const aad = Buffer.from(prot || '');                  // adapted from line 173 (rename var for later)
  iv = Buffer.from(iv, 'base64');                       // adapted from line 177
  tag = Buffer.from(tag, 'base64');                     // adapted from line 180
  ciphertext = Buffer.from(ciphertext, 'base64');       // adapted from line 183
  const cek = await getAesKey(secret);                  // SubtleCrypto compatable key, replacing jose.JWK
  return { cek, iv, tag, ciphertext, aad }
}

const decrypt = async ({ cek, iv, tag, ciphertext, aad }) => {
  return await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: iv,
      tagLength: tag.byteLength * 8,
      additionalData: aad
    },
    cek,
    Buffer.concat([ciphertext, tag])
  );
}

const getSessionObjectFromJwe = async (jwe, secret) => {
  let params = await getDecryptionParameters(jwe, secret);
  let sessionStrBuffer = await decrypt(params);
  let session = JSON.parse(Buffer.from(sessionStrBuffer).toString());
  return session;
}

const getAuth0Cookie = (req) => {
  for ( let [key, value] of Object.entries(req.cookies) ){
    if (key.startsWith('appSession')){
      return value;
    }
  }
  return null;
} 

export const getSessionFactory = (secret) => async (req) => {
  try {
    const jwe = getAuth0Cookie(req);
    if ( jwe === null ) {
      throw TypeError('Auth0Cookie (appSession) is null')
    }
    return await getSessionObjectFromJwe(jwe, secret)
  } catch (error) {
    console.error(error);
    return null;
  }
}

aesKey = initAesKey(process.env.AUTH0_SECRET)
export const getSession = getSessionFactory(process.env.AUTH0_SECRET);