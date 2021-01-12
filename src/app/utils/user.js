const users = [];
const usersrooms = [];
const socket = [];

function JoinUsersPhool(id,name, socketid) {
  const user = {id,name, socketid};
  users.push(user);
  // console.log('userJoinCityPhool users -> ', users);
  return user;
}

function getUserFromPhool(id) {
  console.log('getUserFromPhool users -> ', id);
  const index = users.findIndex(u => u.id === id);
  if( index !== -1) {
    return users[index];
  }
}

function userJoinRoom(id,name,roomname, roomid) {
  const user = {id,name,roomname,roomid}
  usersrooms.push(user);
  // console.log('userJoinRoom usersrooms -> ', user);
  return user;
}

function getPhoolUsers() {
  return users;
}

function getCurrentUserInRoom(id,roomid) {
  // console.log('getCurrentUserInRoom -> ', id,room);
  return usersrooms.filter(u => u.id === id && u.roomid === roomid);
}

function userLeaveRoom(id,room) {
  console.log('userLeaveRoom -> id,chatid', id, room);
  const index = usersrooms.findIndex(u => u.id === id && u.roomid === room);

  if (index !== -1) {
    return usersrooms.splice(index,1)[0];
  }
}

function userLeaveSite(id) {
  console.log('userLeaveSite -> ', id);
  const index = users.findIndex(u => u.id === id);

  if (index !== -1) {
    return users.splice(index,1)[0];
  }
}

module.exports = {
  JoinUsersPhool,
  userJoinRoom,
  userLeaveRoom,
  userLeaveSite,
  getPhoolUsers,
  getCurrentUserInRoom,
  getUserFromPhool
}
