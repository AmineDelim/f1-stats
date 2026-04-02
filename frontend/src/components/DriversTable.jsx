import { useState, useEffect } from 'react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || ''

export default function DriversTable() {
  const [drivers, setDrivers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    axios.get(`${API_URL}/drivers`)
      .then(res => setDrivers(res.data))
      .catch(() => setError('Failed to fetch drivers'))
      .finally(() => setLoading(false))
  }, [])

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
            </tr>
          </thead>
          <tbody>
            {drivers.map(driver => (
              <tr key={driver.driver_number}>
                <td><span className="driver-number">{driver.driver_number}</span></td>
                <td>{driver.full_name}</td>
                <td>{driver.name_acronym}</td>
                <td>{driver.team_name}</td>
                <td>{driver.country_code || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
