import Socket from "../../../services/Socket";

export default class SocketClient {
  static _socket;

  static get socket() {
    return this._socket;
  }

  static set socket(socket) {
    this._socket = 
      socket instanceof Socket
      ? socket
      : new Socket(socket);
  }
}
