const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');
const BadRequestError = require('../errors/BadRequestError');
const UnauthorizedError = require('../errors/UnauthorizedError');

// module.exports.login = (req, res) => {
//   const { email, password } = req.body;
//   return User.findUserByCredentials(email, password)
//     .then((user) => {
//       const token = jwt.sign({ _id: user._id });
//       res.cookie('jwt', token, { httpOnly: true });
//       res.send({ token });
//     })
//     .catch((err) => {
//       res
//         .status(401)
//         .send({ message: err.message });
//     });
// };

// module.exports.login = (req, res, next) => {
//   const { email, password } = req.body;
//   return User.findUserByCredentials(email, password)
//     .then((user) => {
//       const token = jwt.sign({ _id: user._id }, SECRETKEY, { expiresIn: '7d' });
//       res.status(200).send({ token });
//     })
//     .catch(next);
// };

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user || !password) {
        return next(new UnauthorizedError('Неверный email или пароль.'));
      }
      const token = jwt.sign(
        { _id: user._id },
        'some-secret-key',
        {
          expiresIn: '7d',
        },
      );
      return res.send({ token });
    })
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  const { _id } = req.user;
  User.findById(_id)
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Пользователь не найден.'));
      }
      return res.status(200).send(user);
    })
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        // res.status(404).send('Нет пользователя с таким id');
        // return;
        return next(new NotFoundError('Пользователь не найден.'));
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        // res.status(400).send({ message: `Передан некорректный id: ${err}` });
        // return;
        return next(new BadRequestError('Передан некорректный id'));
      }
      return next(err);
      // res.status(500).send({ message: err.message });
    });
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      if (users.length === 0) {
      //   res.status(404).send({ message: 'Пользователи не найдены' });
      //   return;
        return next(new NotFoundError('Пользователи не найдены.'));
      }
      res.status(200).send(users);
    })
    .catch(next);
  // .catch((err) => res.status(500).send({ message: `Внутренняя ошибка сервера: ${err}` }));
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
      })
      // .then((user) => {
      //   res.status(201).send(user);
      // })
      .catch((err) => {
        if (err.code === 11000) {
          return next(new ConflictError('Пользователь с таким электронным адресом уже зарегистрирован'));
        }
        if (err.name === 'ValidationError') {
          // res.status(400).send({ message: `Ошибка при валидации: ${err}` });
          // return;
          return next(new BadRequestError('Ошибка при валидации'));
        }
        // res.status(500).send({ message: `Внутренняя ошибка сервера: ${err}` });
        return next(err);
      }),
    );
};

module.exports.patchUser = (req, res, next) => {
  const { name, about } = req.body;
  const userId = req.user._id;
  User.findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        // res.status(400).send({ message: `Ошибка при валидации: ${err}` });
        // return;
        return next(new BadRequestError('Ошибка при валидации'));
      }
      // res.status(500).send({ message: `Внутренняя ошибка сервера: ${err}` });
      return next(err);
    });
};

module.exports.patchAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const userId = req.user._id;
  User.findByIdAndUpdate(userId, { avatar }, { new: true })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        // res.status(400).send({ message: `Ошибка при валидации: ${err}` });
        // return;
        return next(new BadRequestError('Ошибка при валидации'));
      }
      // res.status(500).send({ message: `Внутренняя ошибка сервера: ${err}` });
      return next(err);
    });
};
