const mongoose = require('mongoose');
const { create } = require('./User');
const Message = require('./Message');

const ChatGroupSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        users: {
            type: Array,
            default: [],
            ref: 'User',
        },
        messages: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Message',
            },
        ],
        createdAt: {
            type: Date,
            default: new Date(),
        },
    },
    {
        toJSON: {
            virtuals: true,
            transform: function (doc, ret) {
                // Remove _id and __v fields from the JSON representation
                delete ret._id;
                delete ret.__v;
            },
        },
        toObject: { virtuals: true },
    },
);

// Update users for all messages when a new user joins the chat group
ChatGroupSchema.pre('save', async function (next) {
    try {
        console.log(`Updating users in messages for chat group ${this.name}`);
        const chatGroup = this;
        if (chatGroup.isNew) {
            // Update users in all messages
            await Message.updateMany({ _id: { $in: chatGroup.messages } }, { $set: { users: chatGroup.users } });
        }
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model('ChatGroup', ChatGroupSchema);
