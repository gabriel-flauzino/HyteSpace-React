import { useState } from "react";
import { CgClose } from "react-icons/cg"
import { LuCircle } from "react-icons/lu"
import "./Game.css";

function Game() {
  const [gameState, setGameState] = useState([
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
  ]);
  const [player, setPlayer] = useState(1);
  const [gameFinished, setGameFinished] = useState(false);

  function posicaoClicado(i, j) {
    if (gameState[i][j] || gameFinished) return;

    let newState = gameState;
    newState[i][j] = player;
    setGameState(newState);

    if (player === 1) {
      setPlayer(2);
    } else {
      setPlayer(1);
    }

    let winner = verificarGanhador()

    if (winner) {
      setGameFinished(true);
      alert(`${winner === 1 ? 'X' : 'Bolinha'} ganhou o jogo`);
    }
  }

  function verificarGanhador() {
    let players = [1, 2];

    let winner = 0;

    for (const player of players) {
      if (
        gameState.some(x => x.every(y => y === player)) ||
        [0, 1, 2].some(j => gameState[0][j] == player && gameState[1][j] == player && gameState[2][j] == player) ||
        (gameState[0][0] == player && gameState[1][1] == player && gameState[2][2] == player) ||
        (gameState[0][2] == player && gameState[1][1] == player && gameState[2][0] == player)
      ) {
        winner = player;
      }
    }

    return winner;
  }

  return (
    <div className="container game">
      <h1>Jogo da Velha</h1>
      <div className={"tictactoe" + (gameFinished ? " disabled" : "")}>
        {gameState.map((x, i) => {
          return (
            <div className="row">
              {x.map((y, j) => {
                return (
                  <div
                    className={"col" + (y !== 0 || gameFinished ? " blocked" : "")}
                    id={`ttc-${i}-${j}`}
                    onClick={e => y === 0 && !gameFinished && posicaoClicado(i, j)}
                  >{y !== 0 && (y === 1 ? <CgClose className="posIcon x-pos" color="#ff5959" /> : <LuCircle className="posIcon circle-pos" color="#5962ff" />)}</div>
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  );
}

export default Game;