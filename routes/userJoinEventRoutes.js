const express = require('express');
const auth = require('../middleware/auth');
const prisma = require('../utils/Prisma');
const { jointEvent, userLeave, getUserJointEvent, getUserJointEventById, getPostsByRecentJoin } = require('../controller/UserJoinEventController');
const router = express.Router();

router.post('/:eventId/join', auth, jointEvent)

router.delete('/:eventId/leave', auth, userLeave)

router.get('/', auth, getUserJointEvent)

router.get('/:userId', auth, getPostsByRecentJoin)

module.exports = router;
