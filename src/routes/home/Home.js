import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { BiSolidUser, BiSolidPaperPlane, BiCodeAlt } from 'react-icons/bi';
import { FaRegHeart, FaHeart, FaRegCommentAlt } from "react-icons/fa";
import { AiOutlineEyeInvisible } from "react-icons/ai";
import { IoMdSend } from "react-icons/io";
import { PiCodeBlockBold } from "react-icons/pi";
import { Markdown } from "../../classes/Markdown";
import { setConfig, sanitize } from "dompurify";

import './Home.css';
import './Markdown.css';
import socket from './../../services/socket';

const markdown = new Markdown()

setConfig({
  ALLOWED_TAGS: ['b', 'i', 'u', 'code', 'h1', 'h2', 'h3', 's', 'div', 'spoiler', 'a', 'br', 'span', 'sup', 'target'],
  ALLOWED_ATTR: ['href', 'class', 'target']
});

function Home() {
  const navigate = useNavigate()

  const [dataLoaded, setDataLoaded] = useState(false);
  const [user, setUser] = useState(null);
  const [friendships, setFriendships] = useState(null);
  const [feedPosts, setFeedPosts] = useState(null);
  const [selectedType, setSelectedType] = useState("global");
  const [auth] = useState(localStorage.getItem('token'));

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

        socket.on('updateUser', async () => setUser(await refreshUser()))
        socket.on('updateFriendships', async () => setFriendships(await refreshFriendships()))
        socket.on('updateFeed', async () => setFeedPosts(await refreshFeed()))
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
      socket.emit('fetchFeed', auth, 1, d => {
        if (d.err) return resolve(d);
        d.feed.sort((a, b) => b.createdTimestamp - a.createdTimestamp)
        d.feed = d.feed.map(x => {
          x.content = parseMarkdown(x.content)
          return x;
        })
        resolve(d.feed)
      })
    });
  }

  async function submitPost() {
    socket.emit("createFeedPost", auth, { content: document.getElementById("postContentInput").value }, async d => {
      if (d.err) return;
      d.feedPost.content = parseMarkdown(d.feedPost.content)
      setFeedPosts([d.feedPost, ...feedPosts])
    });
    document.getElementById("postContentInput").value = "";
  }

  async function markupInput(e) {
    let input = document.getElementById("postContentInput")

    if (input !== document.activeElement) input.focus()

    let start = input.selectionStart;
    let end = input.selectionEnd;

    let before = input.value.slice(0, start)
    let selection = input.value.slice(start, end)
    let after = input.value.slice(end)

    let linePositions = [-1]
    let str = input.value

    while (str.indexOf('\n') != -1) {
      linePositions.push(str.indexOf('\n'))
      str = str.replace('\n', ' ')
    }

    let line = linePositions.find((x, i) => start > x && start <= (linePositions[i + 1] || start)) + 1

    switch (e.currentTarget.id) {
      case "markdownBoldTool":
        input.value = before + "**" + selection + "**" + after
        start += 2
        end += 2
        break;
      case "markdownUnderlineTool":
        input.value = before + "_" + selection + "_" + after
        start += 1
        end += 1
        break;
      case "markdownItalicTool":
        input.value = before + "*" + selection + "*" + after
        start += 1
        end += 1
        break;
      case "markdownStrikethroughTool":
        input.value = before + "~~" + selection + "~~" + after
        start += 2
        end += 2
        break;
      case "markdownH1Tool":
        before = input.value.slice(0, line)
        after = input.value.slice(line)

        if (after.startsWith("#")) {
          if (after.startsWith("# ")) {
            start -= 2
            end -= 2
          } else {
            start -= 1
            end -= 1
          }
          after = after.replace(/#\s?/, "")
        }
        else {
          after = "# " + after;
          start += 2
          end += 2
        }

        input.value = before + after
        break;
      case "markdownH2Tool":
        before = input.value.slice(0, line)
        after = input.value.slice(line)

        if (after.startsWith("##")) {
          if (after.startsWith("## ")) {
            start -= 3
            end -= 3
          } else {
            start -= 2
            end -= 2
          }
          after = after.replace(/##\s?/, "")
        }
        else {
          after = "## " + after;
          start += 3
          end += 3
        }

        input.value = before + after
        break;
      case "markdownH3Tool":
        before = input.value.slice(0, line)
        after = input.value.slice(line)

        if (after.startsWith("###")) {
          if (after.startsWith("### ")) {
            start -= 4
            end -= 4
          } else {
            start -= 3
            end -= 3
          }
          after = after.replace(/###\s?/, "")
        }
        else {
          after = "### " + after;
          start += 4
          end += 4
        }

        input.value = before + after
        break;
      case "markdownSpoilerTool":
        input.value = before + "||" + selection + "||" + after
        start += 2
        end += 2
        break;
      case "markdownInlineCodeTool":
        input.value = before + "`" + selection + "`" + after
        start += 1
        end += 1
        break;
      case "markdownCodeBlockTool":
        input.value = (before.endsWith("\n") || before === "" ? before : before + "\n") + "```\n" + selection + "\n```" + (after.startsWith("\n") || after === "" ? after : "\n" + after)
        start += 4 + !(before.endsWith("\n") || before === "")
        end += 4 + !(after.startsWith("\n") || after === "")
        break;
    }

    input.selectionStart = start;
    input.selectionEnd = end;
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
              <div className="createPostContainer">
                <div className="createPostBox top">
                  <div className="cpUserInfoBox">
                    <div className="cpAvatar"><BiSolidUser size="100%" color="#55585e" /></div>
                    <div className="cpUserNamesBox">
                      <span className="cpNickname">{user?.nickname}</span>
                      <span className="cpUsername">@{user?.username}</span>
                    </div>
                  </div>
                  <div className="cpPreferencesBox">
                    <div className="cpPostType">
                      <select name="postType" defaultValue="global" id="postTypeSelect" onChange={e => setSelectedType(e.target.value)}>
                        <option value="global">Global</option>
                        <option value="private">Privado</option>
                      </select>
                    </div>
                    <span className='cpPrefDescription'>{selectedType === "global" ? "Todo mundo poderá visualizar" : "Apenas seus amigos poderão visualizar"}</span>
                  </div>
                </div>
                <div className="createPostBox inputsArea">
                  <textarea
                    name="postContent"
                    id="postContentInput"
                    placeholder="Escreva uma postagem..."
                    onChange={
                      e => {
                        autoResizeTextbox(e)
                      }
                    }
                    onKeyDown={
                      e => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault()
                          submitPost()
                        }

                        if (e.ctrlKey) {
                          console.log('ctrl key')
                          console.log(e.key)

                          let id;

                          switch (e.key) {
                            case 'b': id = "markdownBoldTool"; break;
                            case 'u': id = "markdownUnderlineTool"; break;
                            case 'i': id = "markdownItalicTool"; break;
                            case 's': id = "markdownStrikethroughTool"; break;
                            case '1': id = "markdownH1Tool"; break;
                            case '2': id = "markdownH2Tool"; break;
                            case '3': id = "markdownH3Tool"; break;
                            case 'o': id = "markdownSpoilerTool"; break;
                          }

                          console.log(id)

                          if (id) {
                            e.preventDefault()
                            markupInput({ currentTarget: { id } })
                          }
                        }
                      }
                    }
                  ></textarea>
                  <button id="submitPost" onClick={submitPost}><IoMdSend size={25} color='#e7e7e7' /></button>
                </div>
                <div className="createPostBox markdownToolbox">
                  <button title='negrito (CTRL + B)' onClick={markupInput} onMouseDown={e => e.preventDefault()} className='mdTool' id="markdownBoldTool"><strong>B</strong></button>
                  <button title='sublinhado (CTRL + U)' onClick={markupInput} onMouseDown={e => e.preventDefault()} className='mdTool' id="markdownUnderlineTool"><u>N</u></button>
                  <button title='italico (CTRL + I)' onClick={markupInput} onMouseDown={e => e.preventDefault()} className='mdTool' id="markdownItalicTool"><i>I</i></button>
                  <button title='riscado (CTRL + S)' onClick={markupInput} onMouseDown={e => e.preventDefault()} className='mdTool' id="markdownStrikethroughTool"><s>S</s></button>
                  <button title='título (CTRL + 1)' onClick={markupInput} onMouseDown={e => e.preventDefault()} className='mdTool' id="markdownH1Tool"><strong>h1</strong></button>
                  <button title='subtítulo (CTRL + 2)' onClick={markupInput} onMouseDown={e => e.preventDefault()} className='mdTool' id="markdownH2Tool"><strong>h2</strong></button>
                  <button title='sub-subtítulo (CTRL + 3)' onClick={markupInput} onMouseDown={e => e.preventDefault()} className='mdTool' id="markdownH3Tool"><strong>h3</strong></button>
                  <button title='spoiler (CTRL + O)' onClick={markupInput} onMouseDown={e => e.preventDefault()} className='mdTool' id="markdownSpoilerTool"><AiOutlineEyeInvisible size={22} color="#fff" /></button>
                  <button title='código em linha' onClick={markupInput} onMouseDown={e => e.preventDefault()} className='mdTool' id="markdownInlineCodeTool"><BiCodeAlt size={22} color="#fff" /></button>
                  <button title='bloco de código' onClick={markupInput} onMouseDown={e => e.preventDefault()} className='mdTool' id="markdownCodeBlockTool"><PiCodeBlockBold size={22} color="#fff" /></button>
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
                                        socket.emit('unlikePost', auth, y.uuid, console.log)
                                      } else {
                                        y.likes.push(user.uuid)
                                        socket.emit('likePost', auth, y.uuid, console.log)
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

function parseMarkdown(str) {
  return sanitize(markdown.parse(str))
}

function parseDatestamp(timestamp) {
  let tdy = new Date().toLocaleString("pt-BR", {
    dateStyle: "short"
  })
  let ytdy = new Date(Date.now() - (1000 * 60 * 60 * 24)).toLocaleString('pt-BR', {
    dateStyle: "short"
  })
  let befYtdy = new Date(Date.now() - (1000 * 60 * 60 * 24 * 2)).toLocaleString('pt-BR', {
    dateStyle: "short"
  })
  let tmrw = new Date(Date.now() + (1000 * 60 * 60 * 24)).toLocaleString('pt-BR', {
    dateStyle: "short"
  })
  let date = new Date(timestamp).toLocaleString('pt-BR', {
    dateStyle: 'short'
  })
  let time = new Date(timestamp).toLocaleString("pt-BR", {
    timeStyle: 'short'
  })

  return (date === tdy
    ? 'Hoje'
    : date === ytdy
      ? 'Ontem'
      : date === befYtdy
        ? 'Anteontem'
        : date === tmrw
          ? 'Amanhã'
          : date) + ', ' + time
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

export default Home;