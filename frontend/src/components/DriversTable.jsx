import { useState, useEffect } from 'react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || ''

export default function DriversTable() {
  const [drivers, setDrivers] = useState([])
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    Promise.all([
      axios.get(`${API_URL}/drivers`),
      axios.get(`${API_URL}/favorites`)
    ])
      .then(([driversRes, favsRes]) => {
        setDrivers(driversRes.data)
        setFavorites(favsRes.data.map(f => f.driver_number))
      })
      .catch(() => setError('Failed to fetch data'))
      .finally(() => setLoading(false))
  }, [])

  const toggleFavorite = async (driver) => {
    const isFav = favorites.includes(driver.driver_number)
    try {
      if (isFav) {
        await axios.delete(`${API_URL}/favorites/${driver.driver_number}`)
        setFavorites(prev => prev.filter(n => n !== driver.driver_number))
      } else {
        await axios.post(`${API_URL}/favorites`, {
          driver_number: driver.driver_number,
          full_name: driver.full_name,
          team_name: driver.team_name,
          name_acronym: driver.name_acronym
        })
        setFavorites(prev => [...prev, driver.driver_number])
      }
    } catch (err) {
      console.error('Favorite error:', err)
    }
  }

  if (loading) return <div className="loading">Loading drivers...</div>
  if (error) return <div className="error">{error}</div>

  return (
    <div className="table-container">
      <h2>🧑‍🦱 Drivers — 2025 Season</h2>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Acronym</th>
              <th>Team</th>
              <th>Country</th>
              <th>⭐</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map(driver => {
              const isFav = favorites.includes(driver.driver_number)
              return (
                <tr key={driver.driver_number}>
                  <td><span className="driver-number">{driver.driver_number}</span></td>
                  <td>{driver.full_name}</td>
                  <td>{driver.name_acronym}</td>
                  <td>{driver.team_name}</td>
                  <td>{driver.country_code || '—'}</td>
                  <td>
                    <button
                      className={`fav-btn ${isFav ? 'fav-active' : ''}`}
                      onClick={() => toggleFavorite(driver)}
                      title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      {isFav ? '⭐' : '☆'}
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
