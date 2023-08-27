const router = require('express').Router();
const {
  deleteCardValidation, createCardValidation, likeCardValidation, dislikeCardValidation,
} = require('../middlewares/validations');

const {
  getCards, deleteCard, createCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/', getCards);

router.delete('/:cardId', deleteCardValidation, deleteCard);

router.post('/', createCardValidation, createCard);

router.put('/:cardId/likes', likeCardValidation, likeCard);

router.delete('/:cardId/likes', dislikeCardValidation, dislikeCard);

module.exports = router;
