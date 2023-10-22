import { useState } from "react";
import { Markdown } from "../../classes/Markdown";
import { CodeHighlighter } from "../../classes/CodeHighlighter";

import "../home/Markdown.css";
import "./CodeStyles.css"

let markdown = new Markdown();
let highlighter = new CodeHighlighter();

function Devtests() {
  const [testeValue, setTesteValue] = useState('')

  function updateValue(e) {
    setTesteValue(markdown.parse(e.target.value))
  } 

  return (
    <div className="container devtests" style={ { margin: "10px" } }>
      <span>Insira texto:</span>
      <textarea
        style={ { padding: "10px", background: "transparent", color: "white", resize: "none", width: "100%", minHeight: "100px", margin: "10px 0 30px", border: "1px solid white", font: "inherit" } }
        placeholder="Escreva um texto..."
        id="teste"
        cols="30"
        rows="10"
        onKeyDown={updateValue}
        onKeyUp={updateValue}
      ></textarea>
      <span>Resultado:</span>
      <div style={ { padding: "10px", border: "1px solid white", minHeight: "100px", margin: "10px 0 50px" } } id="resultado" dangerouslySetInnerHTML={{ __html: testeValue }}></div>
      <span>Texto cru:</span>
      <div style={ { padding: "10px", border: "1px solid white", minHeight: "100px", margin: "10px 0 50px" } } id="resultado" dangerouslySetInnerHTML={{ __html: highlighter.parse(testeValue) }}></div>
    </div>
  )
}

export default Devtests;