const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {
  ValidationError,
  DocumentNotFoundError,
  CastError,
} = require('mongoose').Error;

const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');
const BadRequestError = require('../errors/BadRequestError');

const { NODE_ENV, JWT_SECRET } = process.env;

function patchUserInfo(req, res, userId, info, next) {
  User.findByIdAndUpdate(userId, { info }, { new: true, runValidators: true })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err instanceof ValidationError) {
        next(new BadRequestError('Ошибка при валидации'));
      } else {
        next(err);
      }
    });
}

function getAnyUser(req, res, id, next) {
  User.findById(id)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err instanceof DocumentNotFoundError) {
        next(new NotFoundError('Пользователь не найден'));
      } else if (err instanceof CastError) {
        next(new BadRequestError('Передан некорректный id'));
      } else {
        next(err);
      }
    });
}

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key',
        {
          expiresIn: '7d',
        },
      );
      res.status(200).send({ token });
    })
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  const { _id } = req.user;
  return getAnyUser(req, res, _id, next);
};

module.exports.getUser = (req, res, next) => {
  const { userId } = req.params;
  return getAnyUser(req, res, userId, next);
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => { res.status(200).send(users); })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
      email: req.body.email,
      password: hash,
    })
      .then(({
        name, about, avatar, email, _id, createdAt,
      }) => {
        res.status(201).send(
          {
            data: {
              name, about, avatar, email, _id, createdAt,
            },
          },
        );
      }))
    .catch((err) => {
      if (err instanceof ValidationError) {
        next(new BadRequestError('Ошибка при валидации'));
      } else if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким электронным адресом уже зарегистрирован'));
      } else {
        next(err);
      }
    });
};

module.exports.patchUser = (req, res, next) => {
  const { name, about } = req.body;
  const userId = req.user._id;
  return patchUserInfo(userId, { name, about }, { new: true, runValidators: true }, next);
};

module.exports.patchAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const userId = req.user._id;
  return patchUserInfo(userId, { avatar }, { new: true }, next);
};
