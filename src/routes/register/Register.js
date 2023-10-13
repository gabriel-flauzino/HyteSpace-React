import { useState } from 'react'
import './Register.css'

import socket from '../../services/Socket';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate()

  let [ username, setUsername ] = useState('');
  let [ nickname, setNickname ] = useState('');
  let [ password, setPassword ] = useState('');
  let [ confirmPassword, setConfirmPassword ] = useState('');
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

    if (password !== confirmPassword) {
      setIsSubmiting(false)
      return setError('As senhas não coincidem.');
    }

    socket.emit("register", { username, nickname, password }, d => {
      if (d.err) {
        let errMsg;

        switch (d.errType) {
          case "FIELDS_NOT_FILLED": errMsg = "Todos os campos devem ser preenchidos."; break;
          case "USERNAME_INVALID": errMsg = "O nome de usuário é inválido."; break;
          case "USERNAME_IN_USE": errMsg = "O nome de usuário inserido já está em uso."; break;
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
        <h1 className="tabTitle">Registrar uma conta</h1>
        <div className="loginFields">
          <div className="loginField input required">
            <span className="fieldName">Nome de usuário</span>
            <input 
            type="text" 
            className="fieldInput" 
            disabled={isSubmiting}
            onKeyDown={ e => e.key === "Enter" && focusNext() }
            onChange={ (e) => !/[^a-zA-Z0-9_.]/.test(e.target.value) ? setUsername(e.target.value) : (e.target.value.length > username.length ? e.target.value = username : undefined) }
            />
          </div>
          <div className="loginField input">
            <span className="fieldName">Apelido</span>
            <input 
            type="text" 
            className="fieldInput" 
            disabled={isSubmiting}
            onKeyDown={ e => e.key === "Enter" && focusNext() }
            onChange={ (e) => setNickname(e.target.value) }
            />
          </div>
          <div className="loginField input required">
            <span className="fieldName">Senha</span>
            <input 
            type="password" 
            className="fieldInput" 
            disabled={isSubmiting}
            onKeyDown={ e => e.key === "Enter" && focusNext() }
            onChange={ (e) => setPassword(e.target.value) }
            />
          </div>
          <div className="loginField input required">
            <span className="fieldName">Confirmar senha</span>
            <input 
            type="password" 
            className="fieldInput" 
            disabled={isSubmiting}
            onKeyDown={ e => e.key === "Enter" && focusNext() }
            onChange={ (e) => setConfirmPassword(e.target.value) }
            />
          </div>
        </div>
        <div className="tabBottom">
          <span className="errorMessage">
            { error !== '' && error }
          </span>
          <button 
          className="registerButton"
          onClick={() => navigate("/login")}
          >
          Entrar em uma conta
          </button>
          { !isSubmiting ? 
            username.trim() !== '' && password.trim() !== '' && confirmPassword.trim() !== '' ? (
              <button className="submitLogin" onClick={loginSubmitHandler}>Registrar</button>
            ) : (
              <button className="submitLogin" disabled>Registrar</button>
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