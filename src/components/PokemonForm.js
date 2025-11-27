import React, { useState, useEffect } from 'react';

export default function PokemonForm({ onAdd, initial, onUpdate, onCancel }) {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const isEditing = !!(initial && initial._id);

  useEffect(() => {
    if (initial) {
      setName(initial.name || '');
      setType(initial.type || '');
      setDescription(initial.description || '');
      setImage(initial.image || '');
    } else {
      // reset when no initial
      setName(''); setType(''); setDescription(''); setImage('');
    }
  }, [initial]);

  const [loading, setLoading] = useState(false);
  async function handleSubmit(e) {
    e.preventDefault();
    const pokemon = { name, type, description, image };
    try {
      setLoading(true);
      // use relative path so CRA proxy works (package.json proxy: http://localhost:8000)
      if (isEditing && initial && initial._id && onUpdate) {
        // do PUT
        const res = await fetch(`/api/pokemons/${initial._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(pokemon),
        });
        const bodyText = await res.text();
        if (!res.ok) {
          try { const json = JSON.parse(bodyText); throw new Error(json.error || bodyText); } catch(e){ throw new Error(bodyText); }
        }
        const saved = bodyText ? JSON.parse(bodyText) : null;
        onUpdate(saved);
        // reset if needed
        if (onCancel) onCancel();
      } else {
        const res = await fetch('/api/pokemons', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(pokemon),
        });
        const bodyText = await res.text();
        if (!res.ok) {
          try { const json = JSON.parse(bodyText); throw new Error(json.error || bodyText); } catch(e){ throw new Error(bodyText); }
        }
        const saved = bodyText ? JSON.parse(bodyText) : null;
        onAdd(saved);
        setName(''); setType(''); setDescription(''); setImage('');
        console.log('Pokémon saved', saved);
      }
    } catch (err) {
      console.error('Error guardando pokemon', err);
      // display a helpful message to the user, including server-provided message when available
      const msg = err && err.message ? err.message : 'No se pudo guardar. Revisa la consola (F12) y backend/log.txt';
      alert(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="pokemon-form" onSubmit={handleSubmit}>
      <h3>Registrar pokémon</h3>
      <label>
        Nombre:
        <input value={name} onChange={e => setName(e.target.value)} required />
      </label>
      <label>
        Tipo:
        <input value={type} onChange={e => setType(e.target.value)} required />
      </label>
      <label>
        Descripción:
        <textarea value={description} onChange={e => setDescription(e.target.value)} />
      </label>
      <label>
        URL imagen:
        <input value={image} onChange={e => setImage(e.target.value)} />
      </label>
      <div style={{display:'flex', gap:'0.5rem'}}>
        <button type="submit" disabled={loading || !name || !type}>{loading ? (isEditing ? 'Guardando...' : 'Guardando...') : (isEditing ? 'Actualizar' : 'Guardar')}</button>
        {isEditing && <button type="button" onClick={() => { if (onCancel) onCancel(); }}>Cancelar</button>}
      </div>
    </form>
  );
}
