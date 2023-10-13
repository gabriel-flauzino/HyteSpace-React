import SocketClient from "./socket";

export default async function refreshUser() {
  return await new Promise(resolve => {
    SocketClient.socket.socket.emit('fetchUser', SocketClient.socket.auth, undefined, d => {
      if (d.err) return resolve(d);
      resolve(d.user)
    })
  });
}