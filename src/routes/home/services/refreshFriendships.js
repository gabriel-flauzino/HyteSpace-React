import SocketClient from "./socket";

export default async function refreshFriendships() {
  return await new Promise(resolve => {
    SocketClient.socket.socket.emit('fetchFriendships', SocketClient.socket.auth, undefined, d => {
      if (d.err) return resolve(d);
      resolve(d.friendships)
    })
  });
}