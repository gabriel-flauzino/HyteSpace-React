import { useEffect, useState } from "react";
import { AiOutlineEyeInvisible } from "react-icons/ai";
import { IoMdSend } from "react-icons/io";
import { PiCodeBlockBold } from "react-icons/pi";
import { BiSolidUser, BiCodeAlt } from 'react-icons/bi';

import submitPost from "../services/submitPost";

function CreatePost({ user }) {
  const [selectedType, setSelectedType] = useState("global");
  const [content, setContent] = useState("");

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

    while (str.indexOf('\n') !== -1) {
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
      default:
        console.log("Invalid markdownToolID");
      break;
    }

    input.selectionStart = start;
    input.selectionEnd = end;
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

  return (
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
              setContent(e.target.value)
            }
          }
          onKeyDown={
            e => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                submitPost({ content, selectedType })
                document.getElementById('postContentInput').value = ""
              }

              if (e.ctrlKey) {
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
                  default: break;
                }

                if (id) {
                  e.preventDefault()
                  markupInput({ currentTarget: { id } })
                }
              }
            }
          }
        ></textarea>
        <button id="submitPost" onClick={
          e => {
            submitPost({ content, selectedType })
            document.getElementById('postContentInput').value = ""
          }
        }><IoMdSend size={25} color='#e7e7e7' /></button>
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
  )
}

export default CreatePost;