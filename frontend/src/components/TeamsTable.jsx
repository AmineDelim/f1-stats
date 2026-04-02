import { useState, useEffect } from 'react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || ''

export default function TeamsTable() {
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    axios.get(`${API_URL}/teams`)
      .then(res => setTeams(res.data))
      .catch(() => setError('Failed to fetch teams'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="loading">Loading teams...</div>
  if (error) return <div className="error">{error}</div>

  return (
    <div className="table-container">
      <h2>🏁 Teams — 2025 Season</h2>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Team</th>
              <th>Drivers</th>
            </tr>
          </thead>
          <tbody>
            {teams.map(team => (
              <tr key={team.team_name}>
                <td>
                  <span
                    className="team-color"
                    style={{ backgroundColor: `#${team.team_colour}` }}
                  />
                  {team.team_name}
                </td>
                <td>
                  {team.drivers.map(d => (
                    <span key={d.driver_number} style={{ marginRight: '1rem' }}>
                      <span className="driver-number">{d.driver_number}</span>
                      {' '}{d.name_acronym}
                    </span>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
