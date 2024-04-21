const mongoose = require('mongoose');

const MessageSchema = mongoose.Schema(
    {
        message: {
            username: { type: String, required: true },
            text: { type: String, required: true },
            time: { type: String, required: true },
        },
        users: Array,
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        edited: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    },
);

// Cascade delete messages that contain in chatGroup
MessageSchema.pre('remove', async function (next) {
    console.log(`Messages being removed from chatGroup ${this._id}`);
    await this.model('ChatGroup').updateMany(
        { messages: this._id },
        { $pull: { messages: this._id } },
        { multi: true },
    );
    next();
});

module.exports = mongoose.model('Message', MessageSchema);
