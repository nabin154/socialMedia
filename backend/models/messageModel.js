const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    chatId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat', required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String },
    imageUrl: { type: Boolean, default: false },

},
    {
        timestamps: true,
    });

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;