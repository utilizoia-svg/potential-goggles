# Backend Node.js API - `poke`

Este backend es un servidor Node.js con Express que expone los endpoints:

- GET /api/pokemons  -> lista de pokemons
- POST /api/pokemons -> crea un pokemon (JSON body: name, type, description, image)
 - PUT /api/pokemons/:id -> actualiza un pokemon
 - DELETE /api/pokemons/:id -> elimina un pokemon

El servidor intentará conectar a MongoDB si la variable de entorno `MONGO_URI` está presente; de lo contrario, usará un archivo JSON `pokemons.json` como persistencia de fallback.

Requisitos:
- Node.js 16+ (o compatible)
- MongoDB (opcional, para conexión real) o usar fallback JSON

Instalación y uso (Windows PowerShell):

```powershell
cd backend
npm install
# Para arrancar el servidor
npm start
# Para seed de ejemplo (insertará en Mongo si hay MONGO_URI, o en pokemons.json)
npm run seed
```

Por defecto corre en `http://localhost:8000`.

Health y troubleshooting
-------------------------
- Ruta de salud: `GET /api/health` — devuelve `{ ok: true }` si el backend está escuchando.
- Si el frontend reporta `ECONNREFUSED`:
	- Revisa que el backend esté corriendo en el puerto 8000: `cd backend` y `node server.js`.
	- Revisa `backend/log.txt` para ver errores o fallos de conexión con Mongo.
	- Si usas `start-dev.ps1`, el script intentará arrancar backend y frontend y comprobar la ruta `/api/health`.

Comandos útiles:
```powershell
# Ver logs en tiempo real
Get-Content .\log.txt -Wait

# Comprobar salud
Invoke-RestMethod -Method Get -Uri http://127.0.0.1:8000/api/health

# Comprobar si el puerto 8000 responde
Test-NetConnection -ComputerName 127.0.0.1 -Port 8000
```

Si quieres forzar MongoDB, crea un archivo `.env` con: `MONGO_URI` y `MONGO_DB` y reinicia el servidor.
# Backend PHP API - `poke`

Este backend es un ejemplo simple con PHP que expone endpoints en:

- GET /api/pokemons  -> lista de pokemons
- POST /api/pokemons -> crea un pokemon (JSON body: name, type, description, image)

Requisitos:
- PHP 7.4+ con `ext-mongodb` o usar la librería `mongodb/mongodb` con Composer.
- MongoDB (local o Atlas)

Instalación rápida (Windows - Powershell):

```powershell
cd backend
# Instala dependencias php via composer
composer install
# Crea .env con tus datos (ver .env.example)
copy .env.example .env
# Edita .env y ajusta MONGO_URI y MONGO_DB si es necesario
php -S localhost:8000 router.php -t .

Para añadir datos de ejemplo execute (después de `composer install` y crear `.env`):

```powershell
php seed.php
```

```

Si usas Docker, puedes levantar un contenedor MongoDB y conectar con `mongodb://mongo:27017`.

Notas:
- Asegúrate de que la librería `mongodb/mongodb` esté instalada (composer). Si falta la extensión `ext-mongodb`, instala la extensión o usa la lib.
- El backend envía CORS para permitir solicitudes desde `localhost:3000` (React dev server) o cualquier origen en `*`.

Debug:
- Para ver los requests y errores, revisa `backend/log.txt`.
- Si una petición POST falla, revisa el log y la salida de la consola del backend (ejecutar `php -S ...` en la terminal): 
	- El archivo `log.txt` se crea en `backend/` y contiene líneas con timestamp y los POST bodies o errores.
- Fallback: Si `composer install` no se ejecutó o no hay extensión MongoDB, el backend usará un archivo JSON `backend/pokemons.json` para persistir los pokémons. Esto permite seguir con dev incluso sin MongoDB.
	- Para ver el log en tiempo real (PowerShell):
		```powershell
		Get-Content .\log.txt -Wait
		```
