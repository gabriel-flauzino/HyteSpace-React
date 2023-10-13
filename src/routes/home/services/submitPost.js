import parseMarkdown from "./parseMarkdown";
import SocketClient from "./socket";

export default async function submitPost({ content }) {
  return new Promise(resolve => {
    SocketClient.socket.socket.emit("createFeedPost", SocketClient.socket.auth, { content }, async d => {
      if (d.err) return resolve(d);
      d.feedPost.content = parseMarkdown(d.feedPost.content)
      resolve(d.feedPost)
    });
  })
}