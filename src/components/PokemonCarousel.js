import React, { useEffect, useState, useRef } from 'react';

export default function PokemonCarousel({ pokemons, interval = 3000, initialIndex = 0, onIndexChange }) {
  const [index, setIndex] = useState(initialIndex);
  const timeoutRef = useRef(null);

  // Set up autoplay using functional update to avoid stale index
  useEffect(() => {
    if (!pokemons || pokemons.length === 0) return;
    timeoutRef.current = setInterval(() => {
      setIndex(prev => {
        const ni = (prev + 1) % pokemons.length;
        onIndexChange && onIndexChange(ni);
        return ni;
      });
    }, interval);
    return () => clearInterval(timeoutRef.current);
  }, [pokemons, interval, onIndexChange]);

  // Ensure hooks run in the same order: update index when initialIndex changes
  useEffect(()=>{
    setIndex(initialIndex);
    if (onIndexChange) onIndexChange(initialIndex);
  }, [initialIndex, onIndexChange]);

  // If pokemons array changes such that the current index is out-of-range,
  // reset the index to 0 to keep things consistent. This effect must run
  // unconditionally (hooks must run in the same order) so place it before
  // any early return.
  useEffect(() => {
    setIndex(prev => (pokemons && pokemons.length ? Math.min(prev, pokemons.length - 1) : 0));
  }, [pokemons]);

  // Ensure we don't try to render without pokemons
  if (!pokemons || pokemons.length === 0) return null;

  const p = pokemons[index];
  return (
    <div className="carousel">
      <div className="carousel-card">
        <div className="carousel-left">
          <img src={p.image || '/logo192.png'} alt={p.name} />
        </div>
        <div className="carousel-main">
          <h3>{p.name}</h3>
          <p className="type">{p.type}</p>
          <p className="carousel-description">{p.description}</p>
          <p className="carousel-created">{p.createdAt ? new Date(p.createdAt).toLocaleString(): ''}</p>
        </div>
        <div className="carousel-actions">
          <button onClick={() => { const ni = (index - 1 + pokemons.length) % pokemons.length; setIndex(ni); onIndexChange && onIndexChange(ni); }}>Prev</button>
          <button onClick={() => { const ni = (index + 1) % pokemons.length; setIndex(ni); onIndexChange && onIndexChange(ni); }}>Next</button>
        </div>
      </div>
      <div className="carousel-indicators">
        {pokemons.map((_, i) => (
          <span key={i} className={i === index ? 'active' : ''} onClick={() => { setIndex(i); onIndexChange && onIndexChange(i); }}></span>
        ))}
      </div>
    </div>
  );
}
