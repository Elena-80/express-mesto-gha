const Card = require('../models/card');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        // return res.status(404).send({ message: 'Карточка не найдена.' });
        return next(new NotFoundError('Карточка не найдена.'));
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Передан некорректный id'));
      }
      return next(err);
      // res.status(500).send({ message: `Внутренняя ошибка сервера: ${err}` });
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        // return res.status(404).send({ message: 'Карточка не найдена.' });
        return next(new NotFoundError('Карточка не найдена.'));
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        // res.status(400).send({ message: `Передан некорректный id: ${err}` });
        // return;
        return next(new BadRequestError('Передан некорректный id'));
      }
      // res.status(500).send({ message: `Внутренняя ошибка сервера: ${err}` });
      return next(err);
    });
};

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch(next);
  // .catch((err) => {
  //   res.status(500).send({ message: `Внутренняя ошибка сервера: ${err}` });
  // });
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => {
      res.status(201).send(card);
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

// module.exports.deleteCard = (req, res) => {
//   const id = req.params.cardId;
//   // const userId = req.card.owner;

//   Card.findByIdAndRemove(id)
//     .then((card) => {
//       if (!card) {
//         res.status(404).send({ message: 'Нет карточки с таким id' });
//         return;
//       }
//       res.status(200).send(card);
//     })
//     .catch((err) => {
//       if (err.name === 'CastError') {
//         res.status(400).send({ message: `Передан некорректный id: ${err}` });
//         return;
//       }
//       res.status(500).send({ message: `Внутренняя ошибка сервера: ${err}` });
//     });
// };

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const { _id } = req.user;
  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена.');
      }
      if (card.owner.valueOf() !== _id) {
        throw new ForbiddenError('Нельзя удалить чужую карточку!');
      }
      Card.findByIdAndRemove(cardId)
        .then((deletedCard) => res.status(200).send(deletedCard))
        .catch(next);
    })
    .catch(next);
};
