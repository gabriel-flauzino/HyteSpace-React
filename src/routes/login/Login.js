import { useState } from 'react'
import './Login.css'

import socket from '../../services/Socket';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate()

  let [ username, setUsername ] = useState('');
  let [ password, setPassword ] = useState('');
  let [ isSubmiting, setIsSubmiting ] = useState(false);
  let [ error, setError ] = useState('');

  function focusNext() {
    const inputs = Array.from(document.querySelectorAll('.loginField > input'))
    const idx = inputs.indexOf(document.activeElement) + 1
    if (idx === inputs.length) {
      document.activeElement.blur()
      document.querySelector('.submitLogin').click()
    } else {
      inputs[idx].focus()      
    }
  }

  function loginSubmitHandler() {
    setError('');
    setIsSubmiting(true);

    socket.emit("login", { username, password }, d => {
      if (d.err) {
        let errMsg;

        switch (d.errType) {
          case "FIELDS_NOT_FILLED": errMsg = "Todos os campos devem ser preenchidos."; break;
          case "USERNAME_INCORRECT": errMsg = "Este usuário não existe."; break;
          case "PASSWORD_INCORRECT": errMsg = "A senha está incorreta."; break;
          default: errMsg = "Um erro desconhecido ocorreu. Código do erro: " + d.errType 
        }
        setIsSubmiting(false)
        return setError(errMsg)
      }
      localStorage.setItem("token", d.user.token)
      navigate("/app")
    })
  }

  return (
  <div className="container login">
    <div className="loginTabs">
      <div className="loginTab">
        <h1 className="tabTitle">Entrar na conta</h1>
        <div className="loginFields">
          <div className="loginField input required">
            <span className="fieldName">Nome de usuário</span>
            <input 
            type="text" 
            className="fieldInput" 
            disabled={isSubmiting}
            onKeyDown={ e => e.key === "Enter" && focusNext() }
            onChange={ (e) => setUsername(e.target.value) }
            />
          </div>
          <div className="loginField input required">
            <span className="fieldName">Senha</span>
            <input 
            type="text" 
            className="fieldInput" 
            disabled={isSubmiting}
            onKeyDown={ e => e.key === "Enter" && focusNext() }
            onChange={ (e) => setPassword(e.target.value) }
            />
          </div>
        </div>
        <div className="tabBottom">
          <span className="errorMessage">
            { error !== '' && error }
          </span>
          <button 
          className="registerButton"
          onClick={() => navigate("/register")}
          >
          Cadastrar uma conta nova
          </button>
          { !isSubmiting ? 
            username.trim() !== '' && password.trim() !== '' ? (
              <button className="submitLogin" onClick={loginSubmitHandler}>Entrar</button>
            ) : (
              <button className="submitLogin" disabled>Entrar</button>
          ) : (
            <button className="submitLogin" disabled><div className="spinningDisk"></div></button>
          )
          }
        </div>
      </div>
    </div>
  </div>
);
}

export default Login;