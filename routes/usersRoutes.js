const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../middleware/auth');
const UserController = require('../controller/UserController');

router.get('/', UserController.getAllUsers);
router.get('/me', auth, UserController.getUserByToken);
router.get('/:id', UserController.getUserById);
router.post('/', [auth, [check('name', 'Name is required').not().isEmpty()]], UserController.updateUserProfile);
router.delete('/:id', auth, UserController.deleteUserProfile);

module.exports = router;
