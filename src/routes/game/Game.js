import { useEffect, useState } from "react";
import { CgClose } from "react-icons/cg"
import { LuCircle } from "react-icons/lu"
import { BsSlashLg } from "react-icons/bs";
import "./Game.css";

function Game() {
  const [estadoJogo, setEstadoJogo] = useState(bigJogoDaVelha());
  const [jogador, setJogador] = useState(1);
  const [jogoRolando, setJogoRolando] = useState(true);
  const [posObrigatoria, setPosObrigatoria] = useState([null, null]);

  function bigJogoDaVelha() {
    return [
      [jogoDaVelha(), jogoDaVelha(), jogoDaVelha()],
      [jogoDaVelha(), jogoDaVelha(), jogoDaVelha()],
      [jogoDaVelha(), jogoDaVelha(), jogoDaVelha()]
    ];
  }

  function jogoDaVelha() {
    let novoJogo = [
      [novaPos(), novaPos(), novaPos()],
      [novaPos(), novaPos(), novaPos()],
      [novaPos(), novaPos(), novaPos()]
    ];

    novoJogo.dominado = 0;

    return novoJogo;
  }

  function novaPos() {
    return {
      dominado: 0
    }
  }

  function posicaoClicado(x, y, i, j) {
    if (estadoJogo[x][y].dominado || estadoJogo[x][y][i][j].dominado || (x != posObrigatoria[0] && posObrigatoria[0] != null) || (y != posObrigatoria[1] && posObrigatoria[1] != null) || !jogoRolando) return;

    if (jogador === 1) {
      setJogador(2);
    } else {
      setJogador(1);
    }

    let novoEstado = estadoJogo;
    novoEstado[x][y][i][j].dominado = jogador

    let ganhador = verificarGanhador(novoEstado[x][y])

    if (!ganhador && estadoJogo[x][y].every(x => x.every(y => y.dominado))) {
      novoEstado[x][y].dominado = 3;
    } else if (ganhador) {
      novoEstado[x][y].dominado = ganhador;
    }

    if (novoEstado[i][j].dominado) {
      setPosObrigatoria([null, null])
    } else {
      setPosObrigatoria([i, j])
    }

    setEstadoJogo(novoEstado);

    let bigGanhador = verificarGanhador(estadoJogo)

    if (!bigGanhador && estadoJogo.every(x => x.every(y => y.dominado))) {
      setJogoRolando(false);
      alert("Velha! O jogo empatou.")
    } else if (bigGanhador) {
      setJogoRolando(false);
      alert((bigGanhador === 1 ? "X" : "Bolinha") + " ganhou o jogo.")
    }

    console.log(estadoJogo, posObrigatoria)
  }

  function verificarGanhador(game) {
    let jogadores = [1, 2];
    let ganhador = 0;

    for (const jogador of jogadores) {
      if (
        game.some(x => x.every(y => [jogador, 3].includes(y.dominado)) && !x.every(y => y === 3)) ||
        [0, 1, 2].some(j => [jogador, 3].includes(game[0][j].dominado) && [jogador, 3].includes(game[1][j].dominado) && [jogador, 3].includes(game[2][j].dominado)) ||
        ([jogador, 3].includes(game[0][0].dominado) && [jogador, 3].includes(game[1][1].dominado) && [jogador, 3].includes(game[2][2].dominado)) ||
        ([jogador, 3].includes(game[0][2].dominado) && [jogador, 3].includes(game[1][1].dominado) && [jogador, 3].includes(game[2][0].dominado))
      ) {
        ganhador = jogador;
      }
    }

    return ganhador;
  }

  return (
    <div className={"container game" + (!jogoRolando ? " disabled" : jogador === 1 ? " x-color" : " circle-color")}>
      <div className="gameBox">
        <div id="jogodavelha" className={"tictactoe" + (!jogoRolando ? " disabled" : jogador === 1 ? " x-color" : " circle-color")}>
          {
            estadoJogo.map((a, x) => {
              return (
                <div className="bigrow">
                  {
                    a.map((b, y) => {
                      return (
                        <div className={
                          "bigcol" +
                          (
                            b.dominado !== 0
                              ? " dominado"
                              : (x === posObrigatoria[0] || posObrigatoria[0] == null) && (y === posObrigatoria[1] || posObrigatoria[1] == null)
                                ? " ativo"
                                : ""
                          )
                        }>
                          {
                            b.map((c, i) => {
                              return (
                                <div className="row">
                                  {
                                    c.map((d, j) => {
                                      return (
                                        <div
                                          className={"col" + (d.dominado !== 0 || !jogoRolando ? " dominado" : "")}
                                          onClick={e => d.dominado === 0 && jogoRolando && posicaoClicado(x, y, i, j)}
                                        >{d.dominado !== 0 && (d.dominado === 1 ? <CgClose className="posIcon x-pos" color="#ba3c3c" /> : <LuCircle className="posIcon circle-pos" color="#5962ff" />)}</div>
                                      )
                                    })
                                  }
                                </div>
                              )
                            })
                          }
                          {b.dominado !== 0 && (b.dominado === 1
                            ? <CgClose className="bigPosIcon x-pos" color="#ba3c3c" />
                            : b.dominado === 2
                              ? <LuCircle className="bigPosIcon circle-pos" color="#5962ff" />
                              : (
                                <div class="bigPosIcon tieDiv">
                                  <CgClose className="tie x-pos" color="#ba3c3c" />
                                  <BsSlashLg className="tie slash-pos" color="#d9d9d9" />
                                  <LuCircle className="tie circle-pos" color="#5962ff" />
                                </div>
                              ))}
                        </div>
                      )
                    })
                  }
                </div>
              )
            })
          }
        </div>
        {
          !jogoRolando 
          && (
            <div>
              <button id="botaoJogarLocal">Jogar Local</button>
              <button id="botaoJogarOnline">Jogar Online</button>
            </div>
          )
          /* : (
            
          ) */
        }
      </div>
    </div>
  );
}

export default Game;