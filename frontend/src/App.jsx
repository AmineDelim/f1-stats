import { useState } from 'react'
import DriversTable from './components/DriversTable'
import RacesTable from './components/RacesTable'
import TeamsTable from './components/TeamsTable'
import FavoritesTable from './components/FavoritesTable'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('drivers')

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1>🏎️ F1 Stats Platform</h1>
          <p>Live Formula 1 Statistics</p>
        </div>
      </header>

      <nav className="nav">
        <button
          className={activeTab === 'drivers' ? 'active' : ''}
          onClick={() => setActiveTab('drivers')}
        >
          🧑‍🦱 Drivers
        </button>
        <button
          className={activeTab === 'teams' ? 'active' : ''}
          onClick={() => setActiveTab('teams')}
        >
          🏁 Teams
        </button>
        <button
          className={activeTab === 'races' ? 'active' : ''}
          onClick={() => setActiveTab('races')}
        >
          🗓️ Races
        </button>
        <button
          className={activeTab === 'favorites' ? 'active' : ''}
          onClick={() => setActiveTab('favorites')}
        >
          ⭐ Favorites
        </button>
      </nav>

      <main className="main">
        {activeTab === 'drivers' && <DriversTable />}
        {activeTab === 'teams' && <TeamsTable />}
        {activeTab === 'races' && <RacesTable />}
        {activeTab === 'favorites' && <FavoritesTable />}
      </main>

      <footer className="footer">
        <p>Data provided by OpenF1 API — Microservices Architecture</p>
      </footer>
    </div>
  )
}

export default App
