const express = require('express');

const UserController = require('../controllers/UserController');

const router = express.Router();

router.get('/', UserController.getUsers);
router.get('/:userId(\\d+)', UserController.getUserById);
router.post('/new', UserController.createNewUser);
router.post('/auth', UserController.auth);
router.post('/2fa', UserController.twoFactorAuth);
router.post('/logout', UserController.logout);
router.delete('/:userId(\\d+)', UserController.deleteUser);

module.exports = router;
