const router = require('express').Router();

const {
  getUserValidation, patchUserValidation, patchAvatarValidation,
} = require('../middlewares/validations');

const {
  getUsers, getUser, patchUser, patchAvatar, getCurrentUser,
} = require('../controllers/users');

router.get('/', getUsers);

router.get('/me', getCurrentUser);

router.get('/:userId', getUserValidation, getUser);

router.patch('/me', patchUserValidation, patchUser);

router.patch('/me/avatar', patchAvatarValidation, patchAvatar);

module.exports = router;
