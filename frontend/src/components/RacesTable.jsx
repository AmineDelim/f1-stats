import { useState, useEffect } from 'react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || ''

export default function RacesTable() {
  const [races, setRaces] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    axios.get(`${API_URL}/races`)
      .then(res => setRaces(res.data))
      .catch(() => setError('Failed to fetch races'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="loading">Loading races...</div>
  if (error) return <div className="error">{error}</div>

  return (
    <div className="table-container">
      <h2>🗓️ Races — 2024 Season</h2>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Round</th>
              <th>Circuit</th>
              <th>Country</th>
              <th>Date</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            {races.map((race, index) => (
              <tr key={race.session_key}>
                <td>{index + 1}</td>
                <td>{race.circuit_short_name}</td>
                <td>{race.country_name}</td>
                <td>{new Date(race.date_start).toLocaleDateString('fr-FR')}</td>
                <td>{race.session_name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
