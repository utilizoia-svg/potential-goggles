import React from 'react';

export default function PokemonCard({ p, onEdit, onDelete, onClick }) {
  return (
    <article className="pokemon-card" aria-label={`Tarjeta de ${p.name}`} onClick={() => onClick && onClick(p)}>
      <div className="card-left">
        <div className="image-wrapper">
          <img src={p.image || '/logo192.png'} alt={p.name} />
        </div>
      </div>
      <div className="card-main">
        <div className="card-header">
          <h4 className="card-title">{p.name}</h4>
          <span className="type-badge">{p.type}</span>
        </div>
        <p className="card-description">{p.description}</p>
        <div className="card-footer">
          <small className="created">{p.createdAt ? new Date(p.createdAt).toLocaleString() : ''}</small>
          <div className="card-actions">
            <button className="btn-edit" onClick={(e) => { e.stopPropagation(); onEdit && onEdit(p); }} aria-label={`Editar ${p.name}`}>✏️</button>
            <button className="btn-delete" onClick={(e) => { e.stopPropagation(); onDelete && onDelete(p); }} aria-label={`Eliminar ${p.name}`}>🗑️</button>
          </div>
        </div>
      </div>
    </article>
  );
}
