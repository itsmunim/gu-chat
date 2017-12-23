var config = {
  MONGO_HOST: 'localhost',
  MONGO_DB: 'guchatservice',
  PASSWORD_HASH_SALT: 10,
  TOKEN_SECRET: process.env.TOKEN_SECRET || '063HJODV3EPNEOG4B0WMEMSZ66XGKP71',
};

module.exports = config;
