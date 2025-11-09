import { useState } from 'react'
import './LoginLanding.css'

function LoginLanding({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()

    const success = onLogin(username.trim(), password)

    if (success) {
      setError('')
      setUsername('')
      setPassword('')
    } else {
      setError('Usuario o contraseña incorrectos. Inténtalo nuevamente.')
    }
  }

  const handleUsernameChange = (event) => {
    setUsername(event.target.value)
    if (error) {
      setError('')
    }
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
    if (error) {
      setError('')
    }
  }

  return (
    <div className="login-landing">
      <div className="login-card">
        <div className="login-card__brand">
          <span className="login-card__mark" />
          <h1>Intranet Bodega</h1>
          <p>Ingresa con tus credenciales para continuar.</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label className="login-form__field">
            <span>Usuario</span>
            <input
              type="text"
              value={username}
              onChange={handleUsernameChange}
              placeholder="admin"
              autoComplete="username"
              required
            />
          </label>

          <label className="login-form__field">
            <span>Contraseña</span>
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="******"
              autoComplete="current-password"
              required
            />
          </label>

          {error ? <p className="login-form__error">{error}</p> : null}

          <button type="submit" className="button button--primary login-form__submit">
            Ingresar
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginLanding
