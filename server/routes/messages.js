const {
    addMessage,
    getMessages,
    editMessage,
    deleteMessage,
    addChatGroup,
    getMessagesChatGroups,
    addMessageChatGroups,
} = require('../controllers/message');
const router = require('express').Router();

router.post('/addmsg', addMessage);
router.post('/getmsg', getMessages);
router.put('/editmsg', editMessage);
router.post('/deletemsg', deleteMessage);
router.post('/createGroup', addChatGroup);
router.post('/addmsggroup', addMessageChatGroups);
router.post('/getmsggroup', getMessagesChatGroups);

module.exports = router;
