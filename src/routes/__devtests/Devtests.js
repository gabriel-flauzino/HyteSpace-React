import { useEffect, useState } from "react";

import "../home/Markdown.css";
import "./CodeStyles.css"
import "./Devtests.css";

function Devtests() {

  useEffect(() => {
    (async function() {
      let canvas, pointer, colorfulField, colorField, weightField;

      do {
        canvas = document.getElementById('canvas');
        pointer = document.getElementById('pointer');
        colorfulField = document.getElementById('colorful')
        colorField = document.getElementById('color')
        weightField = document.getElementById('weight')
        await new Promise(res => setTimeout(res, 10))
      } while([
          canvas,
          pointer, 
          colorfulField,
          colorField, 
          weightField
        ].includes(null));

      const ctx = canvas.getContext('2d');
      const position = { x: 0, y: 0 }
      let colors = [[255, 0, 0], [255, 128, 0], [255, 255, 0], [128, 255, 0], [0, 255, 0], [0, 255, 128], [0, 255, 255], [0, 128, 255], [0, 0, 255], [128, 0, 255], [255, 0, 255], [255, 0, 128]]
      let inUseColors = [colors.shift(), colors.shift()]
      let percentage = 100;
      let length = 250;
      let decrement = percentage / length;
      let i = percentage;

      // drawing events
      window.addEventListener('mousemove', draw);
      window.addEventListener('touchmove', e => {
        e.clientX = e.touches[0].clientX;
        e.clientY = e.touches[0].clientY;
        draw(e, true);
      })
      window.addEventListener('mousedown', setPosition);
      window.addEventListener('touchstart', e => {
        e.clientX = e.touches[0].clientX;
        e.clientY = e.touches[0].clientY;
        setPosition(e);
      })

      // pointer events
      window.addEventListener('mousemove', updateCursor);
      window.addEventListener('touchmove', e => {
        e.clientX = e.touches[0].clientX;
        e.clientY = e.touches[0].clientY;
        updateCursor(e);
      })

      function draw(e, touch = false) {
        if (e.buttons !== 1 && !touch) return;

        console.log(colorfulField.checked)

        let color = colorfulField.checked ? currentColor() : colorField.value;
        let rgb = colorfulField.checked ? `rgb(${color[0]}, ${color[1]}, ${color[2]})` : color;
        
        ctx.beginPath();
        ctx.strokeStyle = rgb;
        ctx.lineWidth = weightField.value;
        ctx.lineCap = 'round';

        ctx.moveTo(position.x, position.y);
        setPosition(e);
        ctx.lineTo(position.x, position.y);

        ctx.stroke();
        ctx.closePath();
      }

      function setPosition(e) {
        let canvasPos = canvas.getBoundingClientRect()
        position.x = e.clientX - canvasPos.left;
        position.y = e.clientY - canvasPos.top;
      }

      function currentColor(mustDecrement = true) {
        if (i <= 0) {
          i = percentage;
          colors.push(inUseColors.shift())
          inUseColors.push(colors.shift())
        }

        let color1 = inUseColors[0].map(x => x * i / percentage)
        let color2 = inUseColors[1].map(x => x * Math.abs(percentage - i) / percentage)
        if (mustDecrement) i -= decrement;
        
        return [
          color1[0] + color2[0],
          color1[1] + color2[1],
          color1[2] + color2[2]
        ]
      }

      function updateCursor(e) {
        let drawingColor = colorfulField.checked ? currentColor(false) : colorField.value;
        let rgb = colorfulField.checked ? `rgb(${drawingColor[0]}, ${drawingColor[1]}, ${drawingColor[2]})` : drawingColor;

        pointer.style.left = e.clientX - (pointer.clientWidth / 2) + 'px';
        pointer.style.top = e.clientY - (pointer.clientHeight / 2) + 'px';

        pointer.style.width = weightField.value + 'px';
        pointer.style.height = weightField.value + 'px';

        pointer.style.background = rgb;
      }
    })()
  }, [])

  return (
    <div className="container devtests" style={ { margin: "10px" } }>
      {/* <span>Insira texto:</span>
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
      <div style={ { padding: "10px", border: "1px solid white", minHeight: "100px", margin: "10px 0 50px" } } id="resultado" dangerouslySetInnerHTML={{ __html: highlighter.parse(testeValue) }}></div> */}
      <div id="drawArea">
        <canvas id="canvas" width={1000} height={800}></canvas>
        <div id="pointer">
          <div className="aimLine top"></div>
          <div className="aimLine left"></div>
          <div className="aimLine right"></div>
          <div className="aimLine bottom"></div>
        </div>
      </div>
      <div className="tools">
        <div className="tool">
          <span>Ativar colorido: </span>
          <input type="checkbox" id="colorful" defaultChecked/>
        </div>
        <div className="tool">
          <span>Selecionar cor: </span>
          <input type="color" id="color"/>
        </div>
        <div className="tool">
          <span>Definir tamanho da linha: </span>
          <input type="number" id="weight" defaultValue={10}/>
        </div>
      </div>
    </div>
  )
}

export default Devtests;