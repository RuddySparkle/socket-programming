const Messages = require('../models/Message');
const ChatGroup = require('../models/ChatGroup');
const mongoose = require('mongoose');

module.exports.getMessages = async (req, res, next) => {
    try {
        const { from, to } = req.body;

        const messages = await Messages.find({
            $or: [{ users: [from, to] }, { users: [to, from] }],
        }).sort({ createdAt: 1 });

        const projectedMessages = messages.map((msg) => {
            return {
                fromSelf: msg.sender.toString() === from,
                message: {
                    text: msg.message.text,
                    username: msg.message.username,
                    time: msg.message.time,
                },
                edited: msg.edited,
                _id: msg._id,
                sender: msg.sender,
            };
        });
        res.json(projectedMessages);
    } catch (ex) {
        next(ex);
    }
};

module.exports.addMessage = async (req, res, next) => {
    try {
        const { from, to, message, time, username } = req.body;
        const data = await Messages.create({
            message: { text: message, time: time, username: username },
            users: [from, to],
            sender: from,
        });

        if (data) return res.json({ msg: 'Message added successfully.', data: data.id });
        else return res.json({ msg: 'Failed to add message to the database' });
    } catch (ex) {
        next(ex);
    }
};

module.exports.editMessage = async (req, res, next) => {
    try {
        const { messageId, message } = req.body;
        const data = await Messages.findByIdAndUpdate(
            messageId,
            { $set: { 'message.text': message, edited: true } },
            { new: true },
        );
        if (data) return res.json({ msg: 'Message edited successfully.', data: data.id });
        else return res.status(400).json({ msg: 'Failed to edit message' });
    } catch (ex) {
        next(ex);
    }
};

module.exports.addChatGroup = async (req, res, next) => {
    try {
        const { chatName, users } = req.body;

        // Check if the chat group already exists
        let chatGroup = await ChatGroup.findOne({ name: chatName });

        if (chatGroup) {
            // If the chat group exists, check if the user is already a member
            const user = users[0];
            if (chatGroup.users.includes(user)) {
                return res.json(chatGroup); // User already exists in the chat group
            } else {
                // Add the user to the chat group
                chatGroup.users.push(user);
                await chatGroup.save();
                return res.json(chatGroup); // Return the updated chat group
            }
        } else {
            // If the chat group does not exist, create a new chat group
            const newChatGroup = await ChatGroup.create({
                name: chatName,
                users,
            });
            return res.json(newChatGroup); // Return the newly created chat group
        }
    } catch (ex) {
        next(ex);
    }
};

module.exports.getMessagesChatGroups = async (req, res, next) => {
    try {
        const { chatName, user } = req.body;
        console.log(chatName);
        const chatGroup = await ChatGroup.findOne({ name: chatName }).populate({
            path: 'messages',
            select: ['_id', 'message', 'sender', 'edited'],
        });

        console.log(chatGroup);

        if (!chatGroup) {
            return res.status(400).json({ success: 'false', msg: 'Chat group does not exist' });
        }

        if (chatGroup.messages.length !== 0) {
            const messages = chatGroup.messages.map((msg) => ({
                ...msg.toObject(),
                fromSelf: msg.sender.toString() === user,
            }));

            return res.json(messages);
        } else {
            return res.json([]);
        }
    } catch (ex) {
        next(ex);
    }
};

module.exports.addMessageChatGroups = async (req, res, next) => {
    try {
        const { chatName, message, sender, time, username } = req.body;
        const chatGroup = await ChatGroup.find({ name: chatName });
        if (chatGroup.length === 0) {
            return res.status(400).json({ success: 'false', msg: 'Chat group does not exist' });
        }
        // Add message to messages database
        const data = await Messages.create({
            message: { text: message, time: time, username: username },
            users: chatGroup[0].users,
            sender: sender,
        });
        const updatedChatGroup = await ChatGroup.findOneAndUpdate(
            { name: chatName },
            {
                $push: {
                    messages: data._id,
                },
            },
            { new: true },
        );
        res.json(updatedChatGroup);
    } catch (ex) {
        next(ex);
    }
};

module.exports.editMessageChatGroups = async (req, res, next) => {
    try {
        const { chatName, message, sender, time } = req.body;
        const chatGroup = await ChatGroup.find({ name: chatName });
        if (chatGroup.length === 0) {
            return res.status(400).json({ success: 'false', msg: 'Chat group does not exist' });
        }
        const updatedChatGroup = await ChatGroup.findOneAndUpdate(
            { name: chatName, 'messages.sender': sender, 'messages.message.time': time },
            { $set: { 'messages.$.message.text': message } },
            { new: true },
        );
        res.json(updatedChatGroup);
    } catch (ex) {
        next(ex);
    }
};
