# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts
## Backend and full stack usage

This repo includes a Node.js backend located at `backend/` that connects to MongoDB (optional) and exposes `GET` and `POST` endpoints for pokemons.

Start the backend (Windows PowerShell):

```powershell
cd backend
npm install
# Create .env from .env.example when using MongoDB
copy .env.example .env
node server.js
```

Or run the helper `start-dev.ps1` (Windows PowerShell) to start both frontend and backend:

```powershell
.\start-dev.ps1
```
```

Start the frontend (from project root):

```powershell
npm install
npm start
```

The frontend communicates with the backend at `http://localhost:8000/api/pokemons` or using proxy via `package.json`.
If saving a Pokémon falla, revisa la consola del navegador (F12) y `backend/log.txt`.

Prueba manual GET/POST con curl:
```powershell
curl http://localhost:8000/api/pokemons

curl -H "Content-Type: application/json" -X POST http://localhost:8000/api/pokemons -d "{\"name\":\"Testmon\",\"type\":\"Normal\",\"description\":\"Prueba\"}"
```

Si obtienes un error 400/500, revisa `backend/log.txt` para ver si el backend devolvió un mensaje detallado.

Checklist para depuración rápido:
- ¿Está el backend corriendo? (por defecto `http://localhost:8000`) - si no, arranca con `node server.js` desde la carpeta `backend` o `npm --prefix backend run start`.
- ¿Instalaste dependencias Node con `npm install` en `backend/`?
- Revisa `backend/log.txt` para ver las POSTs que llegan y errores.
- Revisa la consola del navegador para mensajes de error fetch/JSON.
- Si usas MongoDB local, asegúrate de que el servicio está activo y que `MONGO_URI` en `.env` apunta a la dirección correcta.


In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
