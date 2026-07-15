const express = require('express');
const router = express.Router();
const { createRoom, getRooms, getRoomById, getRoomMessages, createDM, getDMs } = require('../controllers/roomController');
const auth = require('../middleware/auth');



router.post('/', auth, createRoom);
router.get('/', auth, getRooms);

router.post("/dm", auth, createDM);

router.get("/dm", auth, getDMs);

router.get('/:id', auth, getRoomById);
router.get('/:id/messages', auth, getRoomMessages);




module.exports = router;