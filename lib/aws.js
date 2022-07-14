import fs from 'fs';
import slugify from 'slugify';
const aws = require('aws-sdk');

aws.config.update({
  accessKeyId: process.env.THIS_AWS_ACCESS_KEY,
  secretAccessKey: process.env.THIS_AWS_SECRET_KEY,
  region: process.env.THIS_AWS_REGION,
  signatureVersion: 'v4',
});

const s3 = new aws.S3();

export const upload = async (date, file) => {
  // const base64Data = new Buffer.from(dataURL.replace(/^data:image\/\w+;base64,/, ''), 'base64');
  // const type = dataURL.split(';')[0].split('/')[1];

  const fileContent = fs.readFileSync(file.filepath);
  
  const params = {
    Bucket: process.env.THIS_AWS_BUCKET_NAME,
    Key: `${date.getTime()}-${slugify(file.originalFilename)}`,
    Body: fileContent,
    // ContentEncoding: 'base64',
    ContentType: file.mimetype,
    ACL: 'public-read'
  }; 

  let location, key;
  try {
    const { Location, Key } = await s3.upload(params).promise();
    location = Location;
    key = Key;
    return { location, key };
  } catch (error) {
    console.error(error);
    throw Error(error);
  }
};

export const deleteFile = (key) =>{
  const params = {
    Bucket: process.env.THIS_AWS_BUCKET_NAME,
    Key: key
  };
  s3.deleteObject(params, (error, data) => {
    if (error) {
      throw Error(error);
    }
    return data;
  });
};