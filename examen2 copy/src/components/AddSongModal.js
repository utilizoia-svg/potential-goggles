import React, { useState } from 'react';
import '../styles/AddSongModal.css';

function AddSongModal({ onClose, onAddSong }) {
  const [formData, setFormData] = useState({
    title: '',
    duration: '',
    imageUrl: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.title && formData.duration) {
      onAddSong(formData);
      setFormData({ title: '', duration: '', imageUrl: '' });
    }
  };

  return (
    <div className="add-song-modal-overlay" onClick={onClose}>
      <div className="add-song-modal" onClick={(e) => e.stopPropagation()}>
        <div className="add-song-modal-header">
          <h2>➕ Agregar Canción</h2>
          <button className="add-song-close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="add-song-form">
          <div className="form-group">
            <label htmlFor="title">Título de la Canción</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Ej: Intro Mágico"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="duration">Duración (ej: 3:45)</label>
            <input
              type="text"
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="Ej: 3:45"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="imageUrl">URL de Imagen (Opcional)</label>
            <input
              type="url"
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://ejemplo.com/imagen.jpg"
            />
            {formData.imageUrl && (
              <div className="image-preview">
                <img src={formData.imageUrl} alt="Vista previa" />
              </div>
            )}
          </div>

          <div className="add-song-actions">
            <button type="submit" className="btn-add">✓ Agregar Canción</button>
            <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddSongModal;
