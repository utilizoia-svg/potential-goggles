import React, { useState, useEffect } from 'react';
import '../styles/AlbumCarousel.css';

function AlbumCarousel({ albums, onSelectAlbum }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    if (!autoPlay) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % albums.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [autoPlay, albums.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + albums.length) % albums.length);
    setAutoPlay(false);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % albums.length);
    setAutoPlay(false);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setAutoPlay(false);
  };

  if (albums.length === 0) return null;

  return (
    <div className="carousel-section">
      <h2>Destacados</h2>
      <div className="carousel-container">
        <button className="carousel-btn prev-btn" onClick={goToPrevious}>
          ◀
        </button>

        <div className="carousel-wrapper">
          {albums.map((album, index) => (
            <div
              key={album._id}
              className={`carousel-slide ${index === currentIndex ? 'active' : ''}`}
              style={{
                transform: `translateX(${(index - currentIndex) * 100}%)`,
              }}
            >
              <div
                className="carousel-album-art"
                onClick={() => onSelectAlbum(album)}
                style={(() => {
                  const img = album.image;
                  if (!img) return {};
                  if (img.startsWith && (img.startsWith('http') || img.startsWith('data:'))) {
                    return { backgroundImage: `url(${img})`, backgroundSize: 'cover', backgroundPosition: 'center' };
                  }
                  return { background: img };
                })()}
              >
                <div className="carousel-overlay">
                  <button className="play-large">▶</button>
                </div>
              </div>
              <div className="carousel-info">
                <h3>{album.title}</h3>
                <p>{album.artist}</p>
                <p className="description">{album.description}</p>
              </div>
            </div>
          ))}
        </div>

        <button className="carousel-btn next-btn" onClick={goToNext}>
          ▶
        </button>
      </div>

      <div className="carousel-dots">
        {albums.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>

      <button 
        className="auto-play-btn"
        onClick={() => setAutoPlay(!autoPlay)}
      >
        {autoPlay ? '⏸ Pausar' : '▶ Reproducir'}
      </button>
    </div>
  );
}

export default AlbumCarousel;
