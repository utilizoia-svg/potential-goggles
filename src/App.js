import './App.css';
import { useEffect, useState } from 'react';
import PokemonForm from './components/PokemonForm';
import PokemonCard from './components/PokemonCard';
import PokemonCarousel from './components/PokemonCarousel';

function App() {
  const [pokemons, setPokemons] = useState([]);
  const [editingPokemon, setEditingPokemon] = useState(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [loadError, setLoadError] = useState(null);
  const [font, setFont] = useState(localStorage.getItem('font') || 'Arial');
  const [accent, setAccent] = useState(localStorage.getItem('accent') || '#ffcc00');
  const [textColor, setTextColor] = useState(localStorage.getItem('textColor') || '#ffffff');
  const [cardColor, setCardColor] = useState(localStorage.getItem('cardColor') || '#111111');

  useEffect(() => {
    // Use relative path so CRA proxy forwards to backend server
    fetch('/api/pokemons')
      .then(r => {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(data => setPokemons(data))
      .catch(e => { console.error('Error cargando pokemons', e); setLoadError(e.message); });
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty('--accent', accent);
    document.body.style.fontFamily = font;
    document.documentElement.style.setProperty('--text-color', textColor);
    document.documentElement.style.setProperty('--card-bg', cardColor);
    document.body.style.color = textColor;
    localStorage.setItem('font', font);
    localStorage.setItem('accent', accent);
    localStorage.setItem('textColor', textColor);
    localStorage.setItem('cardColor', cardColor);
  }, [font, accent, textColor, cardColor]);

  function addPokemon(pokemon) {
    // include in state
    setPokemons(prev => [pokemon, ...prev]);
  }

  function updatePokemon(updated) {
    setPokemons(prev => prev.map(p => (p._id === updated._id ? updated : p)));
    setEditingPokemon(null);
  }

  function deletePokemon(id) {
    setPokemons(prev => prev.filter(p => p._id !== id));
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Poke Registro</h1>
        <div className="settings">
          <label>
            Fuente:
            <select value={font} onChange={e => setFont(e.target.value)}>
              <option>Arial</option>
              <option>"Comic Sans MS"</option>
              <option>"Courier New"</option>
              <option>"Georgia"</option>
              <option>"Roboto"</option>
            </select>
          </label>
          <label>
            Color:
            <input type="color" value={accent} onChange={e => setAccent(e.target.value)} />
          </label>
          <label>
            Color texto:
            <input type="color" value={textColor} onChange={e => setTextColor(e.target.value)} />
          </label>
          <label>
            Color tarjetas:
            <input type="color" value={cardColor} onChange={e => setCardColor(e.target.value)} />
          </label>
        </div>
      </header>

      <main className="main-content">
        <section className="left">
          <PokemonForm onAdd={addPokemon} initial={editingPokemon} onUpdate={updatePokemon} onCancel={() => setEditingPokemon(null)} />
        </section>
        <section className="right">
          {loadError && <div className="error">Error cargando pokemons: {loadError}. Revisa backend/log.txt</div>}
          <PokemonCarousel pokemons={pokemons} interval={3500} initialIndex={carouselIndex} onIndexChange={(i)=>setCarouselIndex(i)} />
          <div className="cards-grid">
            {pokemons.length === 0 && <p>No hay Pokémons registrados aún.</p>}
            {pokemons.map(p => (
              <PokemonCard p={p} key={p._id || p.name} onClick={(p)=>{
                    // set the carousel index to this pokemon
                    const idx = pokemons.findIndex(x => x._id === p._id);
                    if (idx !== -1) setCarouselIndex(idx);
                  }} onEdit={(p)=>setEditingPokemon(p)} onDelete={async(p)=>{
                if (!window.confirm(`Eliminar ${p.name}?`)) return;
                try {
                  const res = await fetch(`/api/pokemons/${p._id}`, { method: 'DELETE' });
                  if (!res.ok) { const t = await res.text(); throw new Error(t); }
                  deletePokemon(p._id);
                } catch (e) { console.error('Delete failed', e); alert('No se pudo eliminar; revisa la consola y backend/log.txt') }
              }} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
