export const isAdmin = (user) => user['https://midwayart.org/roles'].includes('vaf_admin');
export const isJuror = (user) => user['https://midwayart.org/roles'].includes('vaf_juror');
