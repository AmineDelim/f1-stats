import { useState, useEffect } from 'react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || ''

export default function FavoritesTable() {
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchFavorites = () => {
    axios.get(`${API_URL}/favorites`)
      .then(res => setFavorites(res.data))
      .catch(() => setError('Failed to fetch favorites'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchFavorites()
  }, [])

  const removeFavorite = async (driver_number) => {
    try {
      await axios.delete(`${API_URL}/favorites/${driver_number}`)
      setFavorites(prev => prev.filter(f => f.driver_number !== driver_number))
    } catch (err) {
      console.error('Remove error:', err)
    }
  }

  if (loading) return <div className="loading">Loading favorites...</div>
  if (error) return <div className="error">{error}</div>

  return (
    <div className="table-container">
      <h2>⭐ My Favorite Drivers</h2>
      {favorites.length === 0 ? (
        <div className="empty">
          No favorites yet — go to Drivers tab and click ☆ to add some !
        </div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Acronym</th>
                <th>Team</th>
                <th>Added</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {favorites.map(fav => (
                <tr key={fav.driver_number}>
                  <td><span className="driver-number">{fav.driver_number}</span></td>
                  <td>{fav.full_name}</td>
                  <td>{fav.name_acronym}</td>
                  <td>{fav.team_name}</td>
                  <td>{new Date(fav.created_at).toLocaleDateString('fr-FR')}</td>
                  <td>
                    <button
                      className="fav-btn fav-active"
                      onClick={() => removeFavorite(fav.driver_number)}
                    >
                      ⭐
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
