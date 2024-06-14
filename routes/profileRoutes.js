const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../middleware/auth');
const UserController = require('../controller/UserController');

// @route    GET api/profile
// @desc     Get all profiles
// @access   Private

// GET profile
router.get('/', auth, UserController.getProfileUsers);

router.get('/me', auth, UserController.getUserByToken);

router.get('/:id', auth, UserController.getProfileById);
router.post('/', [auth, [check('name', 'Name is required').not().isEmpty()]], UserController.updateProfileByAuth);

router.delete('/:id', auth, UserController.deleteProfile);

module.exports = router;
