import { useState } from 'react'
import './Login.css'

function Login() {
  let [ username, setUsername ] = useState('');
  let [ password, setPassword ] = useState('');
  let [ isSubmiting, setIsSubmiting ] = useState(false);
  let [ error, setError ] = useState('');

  function focusNext() {
    console.log('focusing next')
    const inputs = Array.from(document.querySelectorAll('.loginField > input'))
    const idx = inputs.indexOf(document.activeElement) + 1
    if (idx == inputs.length) {
      document.activeElement.blur()
      document.querySelector('.submitLogin').click()
    } else {
      inputs[idx].focus()      
    }
  }

  function loginSubmitHandler() {
    setError('');
    setIsSubmiting(true);

    setTimeout(() => {
      setIsSubmiting(false)
      setError('invalido muito invalid invalido muito invalid invalido muito invalid')
    }, 2000)
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
          { !isSubmiting ? (
            <button className="submitLogin" onClick={loginSubmitHandler}>Entrar</button>
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