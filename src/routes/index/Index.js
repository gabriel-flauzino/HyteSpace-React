import './Index.css'
import { FaTools } from 'react-icons/fa'
import { PiNoteBlank, PiCalculator, PiBrowser } from 'react-icons/pi'
import { CiMobile3 } from 'react-icons/ci'
import { FiMonitor } from 'react-icons/fi'
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom'

const RevealOnScroll = ({ children, className }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const scrollObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        scrollObserver.unobserve(entry.target);
      }
    });

    scrollObserver.observe(ref.current);

    return () => {
      if (ref.current) {
        scrollObserver.unobserve(ref.current);
      }
    };
  }, []);

  const styles = {
    opacity: isVisible ? "1" : "0",
    transform: isVisible ? "translateY(0)" : "translateY(50px)",
    transition: '300ms ease-in-out',
    trasitionProperty: 'opacity, transform'
  };

  return (
    <div ref={ref} style={styles} className={className}>
      {children}
    </div>
  );
};

function Index() {
  let navigate = useNavigate()

  let [ clicked, setClicked ] = new useState(false)

  function joinButtonHandler() {
    setClicked(true)
    document.body.classList.add('disableScroll')
    setTimeout(() => {
      navigate('/app')
      setTimeout(() => document.body.classList.remove('disableScroll'), 100)
    }, 1000);
  }

  return (
    <div className="container index">
      <div className="content">
        <header className="contentHeader">
          <div className="headerChild logoAndSubtitle">
            <h1 className="logo headerLogo">HYTE<span className="logo-colored">SPACE</span></h1>
            <span className='subtitle'>O seu espaço. Em um único lugar.</span>
          </div>
          <div className="headerChild buttonsRow">
            <button className="joinButton" onClick={joinButtonHandler}>Entrar</button>
          </div>
          <div className={clicked ? "fillScreenAnim clicked" : "fillScreenAnim"}></div>
        </header>
        <main className="contentSections">
          <section className="aboutSection" id="#about">
            <RevealOnScroll className='sectionTitle'>O que é o HyteSpace?</RevealOnScroll>
            <div className="sectionContent">
              <RevealOnScroll className="sectionChild sectionText">
                <span>
                  <p>O <b>HYTESPACE</b> é uma plataforma de multiplas funcionalidades, envolvendo todo tipo de rede social. Converse no bate-papo, crie posts, escreva notas, personalize, jogue com seus amigos.</p>
                  <p>O principal objetivo dessa plataforma é criar um <b>espaço virtual</b>, onde você e seus amigos possam se conectar e fazer qualquer atividade juntos.</p>
                </span>
              </RevealOnScroll>
              <RevealOnScroll className="sectionChild sectionFigure">
                <div className="figureSpaceHome">
                  <div className="spheresRowLine"></div>
                  <div className="spheresRow">
                    <div className="sphere"></div>
                    <div className="sphere"></div>
                    <div className="sphere"></div>
                    <div className="sphere"></div>
                    <div className="sphere"></div>
                    <div className="sphere"></div>
                  </div>
                  <div className="contentShapes">
                    <div className="sideRect"></div>
                    <div className="middleContent">
                      <div className="post">
                        <div className="authorInfo">
                          <div className="roundPic"></div>
                          <div className="nameLine textType3"></div>
                        </div>
                        <div className="postContent">
                          <div className="postText">
                            <div className="textLine textType1"></div>
                            <div className="textLine textType2"></div>
                          </div>
                          <div className="postAttachment"></div>
                        </div>
                      </div>
                      <div className="post">
                        <div className="authorInfo">
                          <div className="roundPic"></div>
                          <div className="nameLine textType4"></div>
                        </div>
                        <div className="postContent">
                          <div className="postText">
                            <div className="textLine textType2"></div>
                            <div className="textLine textType3"></div>
                          </div>
                        </div>
                      </div>
                      <div className="post">
                        <div className="authorInfo">
                          <div className="roundPic"></div>
                          <div className="nameLine textType5"></div>
                        </div>
                        <div className="postContent">
                          <div className="postText">
                            <div className="textLine textType6"></div>
                            <div className="textLine textType7"></div>
                            <div className="textLine textType4"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="sideRect"></div>
                  </div>
                </div>
              </RevealOnScroll>
            </div>
          </section>
          <section className="chatSection" id="chat">
            <RevealOnScroll className="sectionTitle">Bate-papo em tempo real</RevealOnScroll>
            <div className="sectionContent">
              <RevealOnScroll className="sectionChild sectionText">
                <span>
                  <p>Converse com seus amigos em tempo real. Sem atrasos.</p>
                </span>
              </RevealOnScroll>
              <RevealOnScroll className="sectionChild sectionFigure">
                <div className="figureChat">
                  <div className="messageRow">
                    <div className="messageAuthorPic"></div>
                    <div className="message">
                      <div className="msgTriangle"></div>
                      <div className="messageContent"></div>
                    </div>
                  </div>
                  <div className="messageRow sender">
                    <div className="messageAuthorPic"></div>
                    <div className="message">
                      <div className="msgTriangle"></div>
                      <div className="messageContent"></div>
                    </div>
                  </div>
                  <div className="messageRow">
                    <div className="messageAuthorPic"></div>
                    <div className="message">
                      <div className="msgTriangle"></div>
                      <div className="messageContent"></div>
                    </div>
                  </div>
                  <div className="messageRow sender">
                    <div className="messageAuthorPic"></div>
                    <div className="message">
                      <div className="msgTriangle"></div>
                      <div className="messageContent"></div>
                    </div>
                  </div>
                  <div className="messageRow">
                    <div className="messageAuthorPic"></div>
                    <div className="message">
                      <div className="msgTriangle"></div>
                      <div className="messageContent"></div>
                    </div>
                  </div>
                  <div className="messageRow sender">
                    <div className="messageAuthorPic"></div>
                    <div className="message">
                      <div className="msgTriangle"></div>
                      <div className="messageContent"></div>
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
            </div>
          </section>
          <section className="toolsSection" id="tools">
            <RevealOnScroll className="sectionTitle">Ferramentas úteis</RevealOnScroll>
            <div className="sectionContent">
              <RevealOnScroll className="sectionChild sectionText">
                <span>
                  <p>Todo tipo de ferramenta para auxiliar seu trabalho.</p>
                </span>
              </RevealOnScroll>
              <RevealOnScroll className="sectionChild sectionFigure">
                <div className="figureTools">
                  <div className="toolIcon startIcon">
                    <PiNoteBlank size="100%" color='#676a75' />
                  </div>
                  <div className="toolIcon middleIcon">
                    <FaTools size="100%" color="#575963" />
                  </div>
                  <div className="toolIcon endIcon">
                    <PiCalculator size="100%" color="#676a75" />
                  </div>
                </div>
              </RevealOnScroll>
            </div>
          </section>
          <section className="gamesSection" id="games">
            <RevealOnScroll className="sectionTitle">E o melhor: jogos!</RevealOnScroll>
            <div className="sectionContent">
              <RevealOnScroll className="sectionChild sectionText">
                <span>
                  <p>Se conecte online com seus amigos nos jogos mais incríveis e divertidos!</p>
                  <p>E a melhor parte é que você pode jogar tanto do seu computador, como do seu celular ou navegador.</p>
                </span>
              </RevealOnScroll>
              <RevealOnScroll className="sectionChild sectionFigure">
                <div className="figureGames">
                  <FiMonitor className='figMonitor' size={100} color="#fff" />
                  <CiMobile3 className='figMobile' size={100} color="#fff" strokeWidth={0.5} />
                  <PiBrowser className='figBrowser' size={100} color="#fff" />
                </div>
              </RevealOnScroll>
            </div>
          </section>
        </main>
        <footer>
          <h1 className="logo footerLogo">HYTESPACE</h1>
          <p>&copy; Todos os direitos reservados.</p>
        </footer>
      </div>
    </div>
  )
}

export default Index;