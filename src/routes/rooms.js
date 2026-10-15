const express = require('express');
const router = express.Router();
const { createRoom, getRooms, getRoomById, getRoomMessages, createDM } = require('../controllers/roomController');
const auth = require('../middleware/auth');



router.post('/', auth, createRoom);
router.post("/dm", auth, createDM);
router.get('/', auth, getRooms);
router.get('/:id', auth, getRoomById);
router.get('/:id/messages', auth, getRoomMessages);




module.exports = router;