import React, { useState } from 'react';
import '../styles/AlbumView.css';
import AddSongModal from './AddSongModal';

function AlbumView({ album, onBack, user, onLogout }) {
  const [liked, setLiked] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [showAddSong, setShowAddSong] = useState(false);
  const [songs, setSongs] = useState([
    { id: 1, title: 'Intro Mágico', duration: '3:45' },
    { id: 2, title: 'Entre Sueños', duration: '4:12' },
    { id: 3, title: 'Luna Llena', duration: '3:58' },
    { id: 4, title: 'Sinfonía Nocturna', duration: '4:35' },
    { id: 5, title: 'Echo del Infinito', duration: '4:02' },
    { id: 6, title: 'Despertar', duration: '3:50' },
    { id: 7, title: 'Viaje Astral', duration: '4:28' },
    { id: 8, title: 'Reflejo', duration: '3:40' },
    { id: 9, title: 'Horizonte', duration: '4:15' },
    { id: 10, title: 'Conclusión Eterna', duration: '4:05' },
  ]);

  const playNext = () => {
    setCurrentSongIndex((prev) => (prev + 1) % songs.length);
  };

  const playPrevious = () => {
    setCurrentSongIndex((prev) => (prev - 1 + songs.length) % songs.length);
  };

  const downloadAlbum = () => {
    alert(`Descargando álbum: ${album.title}`);
  };

  const shareAlbum = () => {
    const text = `¡Escucha "${album.title}" de ${album.artist} en MusicHub!`;
    if (navigator.share) {
      navigator.share({
        title: album.title,
        text: text,
        url: window.location.href,
      });
    } else {
      alert(text);
    }
  };

  const handleAddSong = (newSong) => {
    const song = {
      id: Math.max(...songs.map(s => s.id), 0) + 1,
      title: newSong.title,
      duration: newSong.duration,
      imageUrl: newSong.imageUrl || null,
    };
    setSongs([...songs, song]);
    setShowAddSong(false);
  };

  return (
    <div className="album-view">
      <header className="album-header">
        <button className="back-btn" onClick={onBack}>← Atrás</button>
        <h1>MusicHub</h1>
        <div className="header-controls">
          <span className="user-badge">👤 {user?.name}</span>
          <button onClick={onLogout} className="logout-btn-small">Salir</button>
        </div>
      </header>

      <div className="album-view-content">
          <div className="album-left">
          <div className="album-cover" style={(() => {
            const img = album.image;
            if (!img) return {};
            if (img.startsWith && (img.startsWith('http') || img.startsWith('data:'))) {
              return { backgroundImage: `url(${img})`, backgroundSize: 'cover', backgroundPosition: 'center' };
            }
            return { background: img };
          })()}>
            <div className="cover-overlay">
              <button className="play-large-btn">▶</button>
            </div>
          </div>

          <div className="album-meta">
            <h2>{album.title}</h2>
            <p className="artist">{album.artist}</p>
            <p className="year">Año: {album.year}</p>
            <p className="songs-count">Canciones: {songs.length}</p>
          </div>

          <div className="album-actions">
            <button 
              className={`action-btn like-btn ${liked ? 'liked' : ''}`}
              onClick={() => setLiked(!liked)}
            >
              {liked ? '❤️' : '🤍'} {liked ? 'Gustó' : 'Me gusta'}
            </button>
            <button className="action-btn" onClick={downloadAlbum}>
              ⬇️ Descargar
            </button>
            <button className="action-btn" onClick={shareAlbum}>
              📤 Compartir
            </button>
            <button className="action-btn" onClick={() => setShowAddSong(true)}>
              ➕ Agregar Canción
            </button>
          </div>
        </div>

        <div className="album-right">
          <h3>Lista de canciones ({songs.length})</h3>
          
          <div className="current-song">
            <h4>Reproduciendo ahora:</h4>
            <p className="current-title">{songs[currentSongIndex].title}</p>
            <div className="player-controls">
              <button onClick={playPrevious} className="player-btn">⏮</button>
              <button className="player-btn play-btn">▶</button>
              <button onClick={playNext} className="player-btn">⏭</button>
            </div>
            <div className="progress-bar">
              <div className="progress" style={{ width: '45%' }}></div>
            </div>
            <div className="time-info">
              <span>2:10</span>
              <span>{songs[currentSongIndex].duration}</span>
            </div>
          </div>

          <div className="songs-list">
            {songs.map((song, index) => (
              <div
                key={song.id}
                className={`song-item ${index === currentSongIndex ? 'active' : ''}`}
                onClick={() => setCurrentSongIndex(index)}
              >
                <span className="song-number">{index + 1}</span>
                <span className="song-title">{song.title}</span>
                <span className="song-duration">{song.duration}</span>
                {song.imageUrl && (
                  <a 
                    href={song.imageUrl} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="song-link"
                    title="Abrir enlace en navegador"
                  >
                    🔗
                  </a>
                )}
                <button className="song-action">⋮</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="album-footer">
        <p>© 2023 MusicHub. Todos los derechos reservados.</p>
      </div>
      {showAddSong && (
        <AddSongModal
          onClose={() => setShowAddSong(false)}
          onAddSong={handleAddSong}
        />
      )}
    </div>
  );
}

export default AlbumView;
