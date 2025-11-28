Instrucciones para el backend PHP (modo demo local)

Este backend fue simplificado para funcionar sin dependencias externas (MongoDB / Composer). Ahora usa archivos JSON en la carpeta `backend_php` para guardar usuarios y álbumes.

Archivos de datos:
- `data_users.json` — usuarios (creado automáticamente cuando se registra/loguea alguien)
- `data_albums.json` — álbumes (se crea/semilla automáticamente con valores por defecto si está vacío)

Cómo ejecutar (PHP integrado):

```powershell
php -S localhost:5000 -t .
```

Luego, en otra terminal, desde la carpeta `examen2` puedes iniciar el frontend:

```powershell
npm install
npm start
```

Rutas disponibles (demo):
- `GET /api/health` — salud del backend
- `POST /api/auth/register` — registra un usuario (sólo `name` es necesario; email/password se generan si faltan)
- `POST /api/auth/login` — inicia sesión (acepta casi cualquier dato y crea usuario si no existe)
- `GET /api/albums` — lista álbumes (semilla incluida)

Notas:
- El almacenamiento es simple y pensado para demos locales. No use este backend en producción.
- Si prefieres volver a MongoDB, restaura las versiones anteriores de `db.php` y `index.php` y ejecuta `composer install`.
