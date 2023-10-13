import { useEffect, useState } from "react";
import { FaRegHeart, FaHeart, FaRegCommentAlt } from "react-icons/fa";
import { BiSolidUser } from 'react-icons/bi';

import refreshFeed from '../services/refreshFeed'
import parseDatestamp from "../services/parseDatestamp";
import SocketClient from "../services/socket";

function Feed({ user }) {
  const [feedPosts, setFeedPosts] = useState(null)
  const [feedLoading, setFeedLoading] = useState(true);

  useEffect(() => {
    (async function () {
      while (SocketClient.socket?.socket == null) await new Promise(res => setTimeout(res, 100));

      SocketClient.socket.socket.on('updateFeed', async () => {
        setFeedLoading(true);
        setFeedPosts(await refreshFeed())
        setFeedLoading(false);
      })

      setFeedPosts(await refreshFeed());
      setFeedLoading(false);
    })()
  }, [])

  return (
    <div className="feedBox">
      {
        feedLoading && (
          <div className="feedLoading">
            <div className="spinningDisk"></div>
          </div>
        )
      }

      {
        feedPosts != null && (!feedPosts.length
          ? (
            <div className="emptyFeedContainer">
              <div className="emptyFeedBox">
                <span className="emptyFeedMessage">Não há postagens.</span>
              </div>
            </div>
          )
          : (
            <div className="postsContainer">
              {feedPosts.map(x => (
                <div key={x.uuid} className="feedPost">
                  <div className="avatarBox">
                    <BiSolidUser size="100%" color="#55585e" />
                  </div>
                  <div className="postBox">
                    <div className="postTop">
                      <div className="authorBox">
                        <span className="authorNickname">{x.author?.nickname}</span>
                        <span className="authorUsername">@{x.author?.username}</span>
                      </div>
                      <span className="postDatestamp">{parseDatestamp(x.createdTimestamp)}</span>
                    </div>
                    <div className="contentBox" dangerouslySetInnerHTML={{ __html: x.content }}></div>
                    <div className="postToolbox">
                      <div className="postTool">
                        <button className='postToolButton' id="likePostButton" onClick={e => setFeedPosts(feedPosts.map(y => {
                          if (y.uuid !== x.uuid) return y;
                          if (y.likes.includes(user.uuid)) {
                            y.likes = y.likes.filter(u => u !== user.uuid)
                            SocketClient.socket.socket.emit('unlikePost', SocketClient.socket.auth, y.uuid, console.log)
                          } else {
                            y.likes.push(user.uuid)
                            SocketClient.socket.socket.emit('likePost', SocketClient.socket.auth, y.uuid, console.log)
                          }
                          return y;
                        }))}>
                          {
                            !x.likes.includes(user.uuid)
                              ? <FaRegHeart className='postToolIcon' size={22} color='#fff' />
                              : <FaHeart className='postToolIcon' size={22} color='rgb(255, 68, 68)' />
                          }
                        </button>
                        <span className='postToolLabel'>{x.likes.length || 0}</span>
                      </div>
                      <div className="postTool">
                        <button className='postToolButton' id="commentsSectionButton">
                          <FaRegCommentAlt className='postToolIcon' size={22} color='#fff' />
                        </button>
                        <span className='postToolLabel'>{x.comments || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )
      }
    </div>
  )
}

export default Feed;