import { io } from "socket.io-client";

class Socket {
  constructor(auth) {
    const socket = io('https://hychat.paebukoa.repl.co');

    if (!auth) {
      this.socket = socket;
    } else {
      socket.emit('loginWithToken', { token: auth }, d => {
        if (d.err) {
          this.err = d.err;
          this.errType = d.errType;
        } else {
          this.user = d.user;
          this.auth = auth;
        }
        
        this.socket = socket;
      })
    }
  }

  err = false;
  errType = null;
  user = null;
  auth = null;
}

export default Socket;

