export const host = 'http://localhost:5004';
export const loginRoute = `${host}/api/auth/login`;
export const registerRoute = `${host}/api/auth/register`;
export const logoutRoute = `${host}/api/auth/logout`;
export const allUsersRoute = `${host}/api/auth/allusers`;
export const allGroupsRoute = `${host}/api/auth/allgroups`;
export const sendMessageRoute = `${host}/api/messages/addmsg`;
export const recieveMessageRoute = `${host}/api/messages/getmsg`;
export const sendGroupMessageRoute = `${host}/api/messages/addmsggroup`;
export const recieveGroupMessageRoute = `${host}/api/messages/getmsggroup`;
export const setAvatarRoute = `${host}/api/auth/setavatar`;
export const changeNicknameRoute = `${host}/api/auth/updatenickname`;
export const createGroupRoute = `${host}/api/messages/createGroup`;
