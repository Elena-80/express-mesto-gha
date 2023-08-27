require('dotenv').config();

const { JWT_SECRET } = process.env;
const { PORT = '3000' } = process.env;
const { DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

module.exports = {
  JWT_SECRET,
  PORT,
  DB_URL,
};
