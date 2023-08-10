const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

module.exports = (req, res, next) => {
  // достаём авторизационный заголовок
  const { authorization } = req.headers;

  // убеждаемся, что он есть или начинается с Bearer
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError('Необходима авторизация.');
  }

  // извлечём токен
  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    // попытаемся верифицировать токен
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    // отправим ошибку, если не получилось
    throw new UnauthorizedError('Необходима авторизация.');
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};






// require('dotenv').config();

// const { SECRETKEY = 'JWT_SECRET' } = process.env;

// const jsonwebtoken = require('jsonwebtoken');

// const UnauthorizedError = require('../errors/UnauthorizedError');

// module.exports = (req, res, next) => {
//   const { jwt } = req.cookies;

//   if (!jwt) {
//     return next(new UnauthorizedError('Необходима авторизация'));
//   }

//   let payload;
//   try {
//     payload = jsonwebtoken.verify(jwt, SECRETKEY);
//   } catch (err) {
//     return next(new UnauthorizedError('Необходима авторизация'));
//   }

//   req.user = {
//     _id: payload._id,
//   };
//   return next();
// };

