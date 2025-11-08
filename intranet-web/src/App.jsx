import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  return (
    <div style={{ fontFamily: "sans-serif", padding: "20px" }}>
      <h1>Intranet Corporativa</h1>
      <p>Bienvenido/a a la intranet.</p>

      <section>
        <h2>Noticias internas</h2>
        <ul>
          <li>Actualización de políticas internas</li>
          <li>Nuevos ingresos al equipo</li>
        </ul>
      </section>
    </div>
  );
}

export default App;
