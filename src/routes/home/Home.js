import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { BiSolidUser, BiSolidPaperPlane } from 'react-icons/bi';
import { IoMdSend } from "react-icons/io";

import './Home.css';
import socket from './../../services/socket';

function Home() {
  const navigate = useNavigate()

  const [dataLoaded, setDataLoaded] = useState(false)
  const [user, setUser] = useState(null)
  const [friendships, setFriendships] = useState(null)
  const [feedPosts, setFeedPosts] = useState(null)
  const [selectedType, setSelectedType] = useState("global");
  const [auth] = useState(localStorage.getItem('token'))

  let currentHours;

  // authentication
  useEffect(() => {
    console.log('auth validator:', auth);
    if (!auth) navigate("/login");

    socket.emit('loginWithToken', { token: auth }, d => {
      if (d.err) {
        // auth is invalid
        navigate('/login') // takes user to the login page
      } else {
        // auth is ok
        setUser(d.user)
        loadData().then(() => setDataLoaded(true)); // loads data

        socket.on('updateUser', refreshUser)
        socket.on('updateFriendships', refreshFriendships)
        socket.on('updateFeed', refreshFeed)
      }
    })
  }, [])

  async function loadData() {
    let [
      lastUser,
      lastFriendships,
      lastFeed
    ] = await Promise.all([
      refreshUser(), // user data
      refreshFriendships(), // friendships
      refreshFeed(), // posts
    ])

    console.log(lastUser)
    console.log(lastFriendships)
    console.log(lastFeed)

    setUser(lastUser)
    setFriendships(lastFriendships)
    setFeedPosts(lastFeed)
  }

  async function refreshUser() {
    return await new Promise(resolve => {
      socket.emit('fetchUser', auth, undefined, d => {
        if (d.err) return resolve(d);
        resolve(d.user)
      })
    });
  }

  async function refreshFriendships() {
    return await new Promise(resolve => {
      socket.emit('fetchFriendships', auth, undefined, d => {
        if (d.err) return resolve(d);
        resolve(d.friendships)
      })
    });
  }

  async function refreshFeed() {
    return await new Promise(resolve => {
      socket.emit('fetchFeed', auth, d => {
        if (d.err) return resolve(d);
        resolve(d.feed)
      })
    });
  }

  function autoResizeTextbox(e) {
    let scroll = e.target.scrollTop
    e.target.style.height = 0;
    let maxHeight = window.innerWidth > 950 ? 500 : 250
    if (e.target.scrollHeight >= maxHeight) e.target.style.height = (maxHeight + 6) + "px";
    else if (e.target.scrollHeight <= 150) e.target.style.height = "150px";
    else e.target.style.height = (e.target.scrollHeight + 6) + "px";
    e.target.scrollTop = scroll
  }

  let i = 0;

  return (
    <div className={"container home" + (!dataLoaded ? " disableScroll" : "")}>
      <div className={"appLoadingScreen" + (dataLoaded ? " fadeout" : "")}>
        <div className="spinningDisk"></div>
      </div>
      <div className="content">
        <nav className='navbar'>
          <div className="navStart">

          </div>
          <div className="navMiddle">

          </div>
          <div className="navEnd">

          </div>
        </nav>
        <main className="main">
          <h1 className='greeting'>
            {
              // "boa dia", "boa tarde", "boa noite" logic"

              ((currentHours = new Date().getHours()) >= 18 && currentHours <= 23) || (currentHours >= 0 && currentHours < 6)
                ? 'Boa noite'
                : currentHours >= 6 && currentHours < 13
                  ? 'Bom dia'
                  : 'Boa tarde'
            }, {user?.nickname}!
          </h1>
          <div className="friendsContainer">
            <div className="friendsContainerLabel">Seus amigos</div>
            <div className="friendsBox">
              {
                // loading friendships with live updating
                friendships?.[0] ? (
                  <div className="friendsList">
                    {friendships.map(x => {
                      return (
                        <div className="friendUser" key={i++}>
                          <div className="friendAvatar">
                            <BiSolidUser className="friendIcon" size={50} color="#55585e" />
                          </div>
                          <div className="friendLabels">
                            <span className="friendNickname">{x.user?.nickname}</span>
                            <span className="friendUsername">@{x.user?.username}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="friendsEmptyContainer">
                    <div className="friendsEmptyBox">
                      <BiSolidPaperPlane className='friendsEmptyIcon' size={50} color="#fff" />
                      <span className="friendsEmptyMessage">Não há amigos :(</span>
                    </div>
                  </div>
                )
              }
            </div>
          </div>
          <div className="contentContainer">
            <div className="sidebar left"></div>
            <div className="feedContainer">
              <div className="createPostContainer">
                <div className="createPostBox top">
                  <div className="cpUserInfoBox">
                    <div className="cpAvatar"><BiSolidUser className="friendIcon" size="100%" color="#55585e" /></div>
                    <div className="cpUserNamesBox">
                      <span className="cpNickname">{user?.nickname}</span>
                      <span className="cpUsername">@{user?.username}</span>
                    </div>
                  </div>
                  <div className="cpPreferencesBox">
                    <div className="cpPostType">
                      <select name="postType" id="postTypeSelect" onChange={e => setSelectedType(e.target.value)}>
                        <option value="global" selected>Global</option>
                        <option value="private">Privado</option>
                      </select>
                    </div>
                    <span className='cpPrefDescription'>{selectedType == "global" ? "Todo mundo poderá visualizar" : "Apenas seus amigos poderão visualizar"}</span>
                  </div>
                </div>
                <div className="createPostBox inputsArea">
                  <textarea name="postContent" id="postContentInput" placeholder="Escreva uma postagem..." onChange={autoResizeTextbox}></textarea>
                  <button id="submitPost"><IoMdSend size={25} color='#e7e7e7' /></button>
                </div>
                <div className="createPostBox markdownToolbox">
                  <button className='mdTool' id="markdownBoldTool"><strong>B</strong></button>
                  <button className='mdTool' id="markdownUnderlineTool"><u>N</u></button>
                  <button className='mdTool' id="markdownItalicTool"><i>I</i></button>
                  <button className='mdTool' id="markdownStrokeTool"><s>S</s></button>
                  <button className='mdTool' id="markdownH1Tool"><strong>h1</strong></button>
                  <button className='mdTool' id="markdownH2Tool"><strong>h2</strong></button>
                </div>
              </div>
              <div className="feedBox">
                {
                  feedPosts === null
                    ? (
                      <div className="feedLoading">
                        <div className="spinningDisk"></div>
                      </div>
                    )
                    : !feedPosts.length
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
                            <div className="feedPost">
                              <div className="avatarBox">
                                <BiSolidUser className="friendIcon" size={50} color="#fff" />
                              </div>
                              <div className="postBox">
                                <div className="authorBox">

                                </div>
                                <div className="contentBox"></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )
                }
              </div>
            </div>
            <div className="sidebar right"></div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Home;
