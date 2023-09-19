import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { BiSolidUser, BiSolidPaperPlane } from 'react-icons/bi';

import './Home.css';
import socket from './../../services/socket';

function Home() {
  const navigate = useNavigate()

  const [dataLoaded, setDataLoaded] = useState(false)
  const [user, setUser] = useState(null)
  const [friendships, setFriendships] = useState(null)
  const [feedPosts, setFeedPosts] = useState(null)
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
          <div className="contentContainer">
            <div className="leftSidebar"></div>
            <div className="feedContainer">
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
                      { feedPosts.map(x => (
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
                      )) }
                    </div>
                  )
              }
            </div>
            <div className="rightSidebar"></div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Home;
