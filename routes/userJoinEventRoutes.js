const express = require('express');
const auth = require('../middleware/auth');
const prisma = require('../utils/Prisma');
const { jointEvent, userLeave, getUserJointEvent, getUserJointEventById } = require('../controller/UserJoinEventController');
const router = express.Router();

router.post('/join', auth, jointEvent)

router.post('/leave', auth, userLeave)

router.get('/', auth, getUserJointEvent)

router.get('/:id', auth, getUserJointEventById)

module.exports = router;
