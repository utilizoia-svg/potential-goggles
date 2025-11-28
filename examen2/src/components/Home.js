import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import '../styles/Home.css';
import AlbumCarousel from './AlbumCarousel';
import AlbumView from './AlbumView';
import SettingsModal from './SettingsModal';

function Home({ user, onLogout }) {
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [currentUser, setCurrentUser] = useState(user);

  const getDefaultAlbums = () => [
    {
      _id: '1',
      title: 'Midnight Dreams',
      artist: 'Luna Echo',
      year: 2023,
      songs: 12,
      // Spotify (favicon) used as artwork
      image: 'https://open.spotify.com/favicon.ico',
      description: 'Un viaje etéreo a través de noches mágicas y sueños infinitos.'
    },
    {
      _id: '2',
      title: 'Urban Pulse',
      artist: 'City Rhythms',
      year: 2023,
      songs: 14,
      // Genius favicon used as artwork
      image: 'https://genius.com/favicon.ico',
      description: 'La energía del la ciudad capturada en cada beat.'
    },
    {
      _id: '3',
      title: 'Serenity',
      artist: 'Peaceful Waves',
      year: 2023,
      songs: 10,
      // Tidal favicon used as artwork
      image: 'https://tidal.com/favicon.ico',
      description: 'Música relajante para momentos de calma y reflexión.'
    }
  ];

  const API_BASE = process.env.REACT_APP_API_URL || '';

  const fetchAlbums = useCallback(async () => {
    setLoading(true);
    try {
      const base = API_BASE ? API_BASE.replace(/\/$/, '') : '';
      const url = base ? `${base}/api/albums` : '/api/albums';
      const response = await axios.get(url);
      setAlbums(response.data);
    } catch (err) {
      console.error('Error fetching albums:', err);
      setAlbums(getDefaultAlbums());
    } finally {
      setLoading(false);
    }
  }, [API_BASE]);

  useEffect(() => {
    fetchAlbums();
  }, [fetchAlbums]);

  

  const filteredAlbums = albums.filter(album =>
    album.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    album.artist.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // helper: soporta strings que sean gradientes (background) o URLs de imagen
  const coverStyle = (img) => {
    if (!img) return {};
    try {
      const isUrl = img.startsWith('http') || img.startsWith('data:');
      if (isUrl) {
        return { backgroundImage: `url(${img})`, backgroundSize: 'cover', backgroundPosition: 'center' };
      }
    } catch (e) {
      // si img no tiene startsWith o falla, caeremos al background
    }
    return { background: img };
  };

  const handleSettingsSave = (updatedData) => {
    const updated = { ...currentUser, ...updatedData };
    setCurrentUser(updated);
    localStorage.setItem('user', JSON.stringify(updated));
    setShowSettings(false);
  };

  if (selectedAlbum) {
    return (
      <AlbumView 
        album={selectedAlbum} 
        onBack={() => setSelectedAlbum(null)}
        user={user}
        onLogout={onLogout}
      />
    );
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>🎶 MusicHub</h2>
        </div>
        <ul className="sidebar-menu">
          <li className="active">🏠 Inicio</li>
          <li>🔍 Buscar</li>
          <li>📚 Tu biblioteca</li>
          <li>❤️ Favoritos</li>
          <li>🔔 Notificaciones</li>
        </ul>
        <div className="sidebar-footer">
          <p className="user-info">👤 {currentUser?.name}</p>
          <button onClick={onLogout} className="logout-btn">Cerrar Sesión</button>
        </div>
      </aside>

      <main className="main">
        <header className="header">
          <div className="header-content">
            <input
              type="text"
              placeholder="Buscar álbumes, artistas..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="header-controls">
              <button className="header-btn" onClick={() => setShowSettings(true)}>⚙️ Configuración</button>
            </div>
          </div>
        </header>

        <section className="content">
          <div className="content-header">
            <h1>Bienvenido a tu música, {currentUser?.name?.split(' ')[0]}</h1>
            <p>Explora nuestros mejores álbumes</p>
          </div>

          {loading ? (
            <div className="loading">Cargando álbumes...</div>
          ) : (
            <>
              {filteredAlbums.length > 0 ? (
                <>
                  <AlbumCarousel 
                    albums={filteredAlbums.slice(0, 3)} 
                    onSelectAlbum={setSelectedAlbum}
                  />
                  
                  <div className="albums-section">
                    <h2>Todos los álbumes</h2>
                    <div className="album-grid">
                      {filteredAlbums.map((album) => (
                        <div
                          key={album._id}
                          className="album-card"
                          onClick={() => setSelectedAlbum(album)}
                        >
                          <div className="album-art" style={coverStyle(album.image)}>
                            <div className="play-btn">▶️</div>
                          </div>
                          <div className="album-info">
                            <h3>{album.title}</h3>
                            <p>{album.artist}</p>
                            <span className="album-year">{album.year}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="no-results">
                  No se encontraron álbumes
                </div>
              )}
            </>
          )}
        </section>
      </main>
      {showSettings && (
        <SettingsModal
          user={currentUser}
          onClose={() => setShowSettings(false)}
          onSave={handleSettingsSave}
        />
      )}
    </div>
  );
}

export default Home;
