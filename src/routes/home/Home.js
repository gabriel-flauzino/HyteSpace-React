import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { BiSolidUser, BiSolidPaperPlane } from 'react-icons/bi';

import './Home.css';
import './Markdown.css';
import refreshFeed from "./services/refreshFeed";
import refreshFriendships from "./services/refreshFriendships";
import refreshUser from "./services/refreshUser";

import CreatePost from "./components/CreatePost";
import Feed from "./components/Feed";
import SocketClient from './services/socket';

function Home() {
  const navigate = useNavigate()

  const [dataLoaded, setDataLoaded] = useState(false);
  const [user, setUser] = useState(null);
  const [friendships, setFriendships] = useState(null);

  let currentHours;

  // authentication
  useEffect(() => {
    (async function () {
      let auth = localStorage.getItem('token');

      console.log('auth validator:', auth);
      if (!auth) navigate("/login");
      SocketClient.socket = auth;

      while (SocketClient.socket?.socket == null) await new Promise(res => setTimeout(res, 100));

      await loadData();
      setDataLoaded(true);
    })()
  }, [])

  async function loadData() {
    let [
      user,
      friendships
    ] = await Promise.all([
      refreshUser(), // user data
      refreshFriendships(), // friendships
    ]);

    setUser(user);
    setFriendships(friendships);
  }

  window.onclick = (e) => {
    if (e.target.classList.contains('markdown-spoiler') && e.target.classList.contains('hidden')) {
      console.log(e.target.children[0])
      e.target.children[0].classList.remove('hidden-spoiler-text')
      e.target.classList.remove('hidden')
    }
  }

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
                        <div className="friendUser" key={x.user?.uuid}>
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
              <CreatePost user={user} />
              <Feed user={user} />
            </div>
            <div className="sidebar right"></div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Home;