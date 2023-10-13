import parseMarkdown from "./parseMarkdown";
import SocketClient from "./socket";

export default async function refreshFeed() {
  return await new Promise(resolve => {
    SocketClient.socket.socket.emit('fetchFeed', SocketClient.socket.auth, 1, d => {
      if (d.err) return resolve(d);
      d.feed = d.feed.map(x => {
        x.content = parseMarkdown(x.content)
        return x;
      })
      resolve(d.feed)
    })
  });
}