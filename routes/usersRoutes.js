const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../middleware/auth');
const UserController = require('../controller/UserController');

router.get('/', UserController.getAllUsers);
router.get('/me', auth, UserController.getUserByToken);
router.get('/:userId', UserController.getUserById);
router.delete('/', auth, UserController.deleteUserProfile);
router.put('/', [auth, [check('name', 'Name is required').not().isEmpty()]], UserController.updateProfileByAuth);
router.put('/password', auth, UserController.changePassword);

module.exports = router;
