# Reporte Técnico – Despliegue en Netlify

Fecha: 27/11/2025
Proyecto: examen2 (subdirectorio `examen2` en repo `potential-goggles`)

## 1) Resumen
Este documento detalla las herramientas utilizadas, la secuencia de configuración, la secuencia de publicación y las pruebas realizadas para desplegar la aplicación web (frontend) del proyecto `examen2` en Netlify. Adicionalmente incluye pasos para verificar el correcto funcionamiento de la app y del endpoint de backend.

---

## 2) Listado de herramientas
- Node.js (recomendado v18+). Verificar con: `node -v`
- npm (incluido con Node.js). Verificar con: `npm -v`
- Git (control de versiones). Verificar con: `git --version`
- Netlify CLI (opcional para despliegues desde local): `npx netlify-cli` o `npm i -g netlify-cli`
- Netlify (hosting). Interfaz web para configurar repos y variables de entorno.
- Axios (librería HTTP usada por la app) — dependencias en `package.json`.
- Create React App (react-scripts). La app está basada en CRA.
- Editor/IDE (VS Code, etc.)

---

## 3) Cambios / configuración realizados (resumen)
- Frontend:
  - `examen2/src/components/Home.js`:
    - `fetchAlbums` fue memoizado con `useCallback` y pasa a usar `REACT_APP_API_URL` si existe. Esto evita warnings de dependencias del hook y permite que la app consuma un backend remoto configurando la variable en Netlify.
  - `examen2/package.json`:
    - Añadido `homepage: "."` para rutas relativas durante el deployment estático.
    - Añadido `compile` script para `npm run build`.
    - Añadido script `netlify:deploy` para deploy por CLI: `npx netlify-cli deploy --prod --dir=build`.
    - Añadido `netlify-cli` como devDependency.
  - Añadido `examen2/public/_redirects` con `/* /index.html 200` para habilitar SPA fallback en Netlify.
- Netlify:
  - Añadido `netlify.toml` en la raíz con configuración para construir `examen2` (comando `npm --prefix examen2 run compile`, publish directory `examen2/build`).
  - También existe un `netlify.toml` dentro de `examen2` si se necesita una configuración local aislada.
- Git:
  - Se limpió `node_modules` del repo y se añadió `.gitignore` recursivo para `node_modules/`.
  - Se creó una rama `poke-only` para subir solamente el contenido de `U4/poke` a un repo diferente (tarea anterior). Para este `examen2` se mantuvo en el subdirectorio `examen2`.

---

## 4) Secuencia de configuración (local / de preparación)
1. Clona el repo (si no está local):
   ```powershell
   git clone https://github.com/utilizoia-svg/potential-goggles.git
   cd potential-goggles
   ```
2. Si vas a trabajar solo con `examen2` como subproyecto, entra en la carpeta:
   ```powershell
   cd examen2
   ```
3. Instala dependencias:
   ```powershell
   npm install
   ```
4. Entorno (opcional): define variable `REACT_APP_API_URL` para apuntar al backend si no usas el proxy local:
   - En Windows (PowerShell):
     ```powershell
     $Env:REACT_APP_API_URL="https://api.example.com"
     npm run compile
     ```
   - En UNIX/macOS:
     ```bash
     REACT_APP_API_URL=https://api.example.com npm run compile
     ```
5. Build local:
   ```powershell
   npm run compile
   ```
   - Esto genera la carpeta `examen2/build` con la versión lista para producción.
6. Verificar la build localmente (opcional):
   - Instala `serve` si quieres: `npm i -g serve`.
   - Luego:
     ```powershell
     serve -s build
     # Abre http://localhost:3000
     ```

---

## 5) Secuencia de publicación en Netlify (UI)
1. Accede a Netlify y haz "New site from Git".
2. Selecciona tu proveedor (GitHub) y conecta el repo `utilizoia-svg/potential-goggles`.
3. En Build settings de Netlify:
   - Base directory: `examen2` (si quieres que Netlify muestre que la app está en `examen2`)
   - Build command: `npm --prefix examen2 run compile` (o `npm run compile` si seleccionas la carpeta `examen2` en la UI)
   - Publish directory: `examen2/build`
4. En Netlify site settings → Environment → Add variable: `REACT_APP_API_URL` (si tu backend está en otro dominio). Además añade otras variables necesarias (API keys, etc.), asegurándote de no subir secretos al repo.
5. Guardar y click Deploy. Netlify realizará el build y publicará el contenido de `examen2/build`.

Publicación alternativa via CLI (opcional):
1. Instala y loguea con Netlify CLI:
   ```powershell
   npm install -g netlify-cli
   npx netlify-cli login
   cd examen2
   npm install
   npm run compile
   npx netlify-cli deploy --prod --dir=build
   ```
   - Para conectar con una site existente, usa `npx netlify-cli link`.

---

## 6) Secuencia de publicación en Netlify (resumen de comandos)
- Instalar dependencias (si hace falta):
  ```powershell
  npm --prefix examen2 install
  ```
- Crear build:
  ```powershell
  npm --prefix examen2 run compile
  ```
- Desplegar con CLI (opcional):
  ```powershell
  npx netlify-cli deploy --prod --dir=examen2/build
  ```

---

## 7) Pruebas del funcionamiento y verificación
**Antes del deploy (local):**
- Verificar que el frontend corre en desarrollo:
  ```powershell
  cd examen2
  npm start
  ```
  Visita `http://localhost:3000` y utiliza la UI para comprobar búsqueda, carousel, selección de album.
- Verificar `fetchAlbums` funciona:
  - Si el proxy está configurado en `package.json`, las llamadas a `/api/albums` apuntan a `localhost:5000` (o puerto del backend). Ejecuta el backend (PHP o Node) y revisa que `GET /api/albums` devuelva JSON.
  - Si usas `REACT_APP_API_URL`, ejecuta: `REACT_APP_API_URL=http://localhost:5000 npm start` o ajustar en Netlify.
- Pruebas unitarias:
  ```powershell
  cd examen2
  npm test
  ```

**Después del build / deploy (en Netlify):**
1. Verificar el estado del deploy en Netlify Dashboard (logs de build, errores, warnings).
2. Abrir la URL del sitio provista por Netlify (por ejemplo: `https://<sitio>.netlify.app`).
3. Comprobar rutas internas y SPA fallback: navegar a rutas que normalmente no cargan en index y confirmar que carga.
4. Verificar que la app pueda consumir la API (si `REACT_APP_API_URL` configurado): comprobar en DevTools → Network que las peticiones a `GET /api/albums` retornan 200 + datos.
5. Comprobar que la web muestra los álbumes (por defecto usa fallback `getDefaultAlbums()` si no encuentra la API).
6. Verificar logs de Netlify si ocurre algún error en build o durante el deploy.

**Checks con cURL**
- Verificar que la web está sirviendo correctamente:
  ```bash
  curl -I https://<sitio>.netlify.app
  ```
  Debe devolver `HTTP/2 200` (o 304) y cabeceras estándar.
- Si el backend está en la misma URL: comprobar `GET`:
  ```bash
  curl https://<sitio>.netlify.app/api/albums
  ```
  - O si el backend está en otro dominio asegúrate de que el CORS esté permitido.

---

## 8) Pruebas End-to-End (recomendadas)
- Pruebas rápidas con `Playwright` o `Cypress` (no añadidas en el repo por defecto):
  - Test de carga de la página principal
  - Test de búsqueda: introducir texto y comprobar filteredAlbums
  - Test de selección de álbum y verificar `AlbumView`
  - Test de navegación SPA: accesos directos a rutas internas

---

## 9) Troubleshooting (problemas y soluciones aplicadas durante el proceso)
- Problema: `Permission denied (publickey)` al hacer `git push` por SSH.
  - Solución: Usar URL HTTPS para el remote origin y empujar con `https://` o configurar SSH agregando la clave pública a GitHub. Se usó HTTPS para los pushes y Netlify build.
- Problema: `node_modules` añadidos al repo y archivos grandes.
  - Solución: Añadí `node_modules/` al `.gitignore` recursivo y eliminé del index `git rm -r --cached node_modules` para limpiar el historial de archivos innecesarios.
- Problema: warning de `useEffect` con dependencia `fetchAlbums` en `Home.js`.
  - Solución: useCallback para `fetchAlbums` y `useEffect` con dependencia `fetchAlbums` (evitando rerenders y warnings). Además se usa `REACT_APP_API_URL` para apuntar al backend.

---

## 10) Checklist de verificación final
- [x] `examen2` build corre localmente: `npm run compile` sin errores.
- [x] `examen2/build` contiene `index.html` y los assets minificados.
- [x] `examen2/netlify.toml` y `examen2/public/_redirects` presentes en el repo.
- [x] Variables de entorno para API definidas en Netlify si el backend no está en la misma URL.
- [x] Endpoint `GET /api/albums` disponible o fallback `getDefaultAlbums` muestra algo de contenido.
- [x] Verificado deploy en Netlify desde UI o con `netlify-cli`.

---

## 11) Futuros pasos sugeridos
- Integrar tests E2E vía `Cypress` o `Playwright` y configurarlos en CI para ejecutarse antes del deploy.
- Crear pipeline CI (GitHub Actions) para ejecutar `npm --prefix examen2 install`, `npm --prefix examen2 run compile`, y `npx netlify-cli deploy` con un token de Netlify (o dejar que Netlify UI haga el build tras push).
- Si el backend debe ser desplegado en la misma pila, crear un hosting para `examen2/backend_php` (ej: Render, VPS, Azure Web Apps) y configurar `REACT_APP_API_URL` apuntando al dominio final.

---

Si quieres, puedo:
- Añadir un `deploy` por GitHub Actions para automatizar el build y deploy en Netlify.
- Configurar tests E2E con `Cypress` para validar el flujo principal (búsqueda, selección, muestra de álbumes).
- Preparar una guía rápida para desplegar el backend `backend_php` (hosting recomendado y pasos).

Indícame si deseas que continúe con cualquiera de estos siguientes pasos (por ejemplo, automatizar con GitHub Actions). ¡Listo para seguir! 
