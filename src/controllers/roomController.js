const Room = require('../models/Room');
const Message = require('../models/Message');

const createRoom = async (req, res) =>{
    try{
        const {name, description, isPrivate} = req.body;

        if(!name?.trim()){
            return res.status(400).json({error: 'Room name is required'});
        }

        const room = await Room.create({
            name: name.trim(),
            description: description?.trim(),
            isPrivate: isPrivate === true,
            createdBy : req.user._id, //from token
        })

        const populated = await Room.findById(room._id)
        .populate('createdBy', 'username displayName')

        res.status(201).json(populated);
    } catch (error) {
        console.error('Error creating room:', error);
        return res.status(500).json({error: 'Error occurred while creating room'});
    }
}

const getRooms = async (req, res) =>{
    try{
        const rooms = await Room.find()
        .populate('createdBy', 'username displayName')
        .sort({ createdAt: -1 })
        .lean(); // to not return the id to return the populate

        res.json(rooms);
    } catch (error) {
        console.error('Error getting rooms:', error);
        return res.status(500).json({error: 'Error occurred while getting rooms'});
    }
}

const getRoomById = async (req, res) =>{
    try{
        const room = await Room.findById(req.params.id)
        .populate('createdBy', 'username displayName')
        .lean();

        if(!room){
            return res.status(404).json({error: 'Room not found'});
        }

        res.json(room);
    } catch (error) {
        console.error('Error getting room:', error);
        return res.status(500).json({error: 'Error occurred while getting room'});
    }
}
const getRoomMessages = async(req, res) =>{
    try{
        const {roomId} = req.params;
        const limit = Math.min(parseInt(req.query.limit) || 50, 100)
        const skip = parseInt(req.query.skip) || 0;

        const messages = await Message.find({room: roomId})
        .sort({createdAt: -1})
        .skip(skip)
        .limit(limit)
        .populate('user', 'username displayName')
        .lean();

        res.json(messages);
    } catch (error) {
        console.error('Error getting room messages:', error);
        return res.status(500).json({error: 'Error occurred while getting room messages'});
    }
}

//direct messages(DM)
const createDM = async (req, res) => {
    try {
        const { receiverId } = req.body;

        if (!receiverId) {
            return res.status(400).json({
                error: "Receiver is required"
            });
        }

        if (receiverId === req.user._id.toString()) {
            return res.status(400).json({
                error: "You can't chat with yourself"
            });
        }

        // Check if a DM already exists
        let room = await Room.findOne({
            type: "dm",
            members: {
              $all: [req.user._id, receiverId],
              $size: 2
            }
        }).populate("members", "username displayName avatar");

        if (room) {
            return res.json(room);
        }

        // Create new DM room
        room = await Room.create({
            type: "dm",
            name: `DM-${req.user._id}-${receiverId}`,
            isPrivate: true,
            createdBy: req.user._id,
            members: [
                req.user._id,
                receiverId
            ]
        });

        room = await Room.findById(room._id)
            .populate("members", "username displayName avatar");

        res.status(201).json(room);

    } catch (err) {
        console.error(err);

        res.status(500).json({
            error: "Server Error"
        });
    }
};

const getDMs = async (req, res) => {

    try {

        const rooms = await Room.find({
            type: "dm",
            members: req.user._id
        })
        .populate("members", "username displayName avatar")
        .sort({ updatedAt: -1 })
        .lean();

        res.json(rooms);

    } catch (err) {

        res.status(500).json({
            error: "Server Error"
        });

    }

};


module.exports = {
    createRoom,
    getRooms,
    getRoomById,
    getRoomMessages,
    createDM,
    getDMs
}