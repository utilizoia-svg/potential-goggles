# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

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

## Deploying / Hosting

- Build the project for production:

```powershell
npm run build
```

- The production-ready files are in the `build/` folder. Upload the contents of `build/` to your hosting provider (Vercel, Netlify, Surge, nginx, S3, etc.) or use your own static-server.

- If your backend lives on a different origin (domain/port), set the API base URL with an environment variable before building. For example, in a Unix-like shell:

```bash
REACT_APP_API_URL=https://api.example.com npm run build
```

On Netlify, Vercel or similar you can set environment variables in the site settings.

- By default the app will call `GET /api/albums`. If your backend is served from the same origin, no extra configuration is needed. If not, provide `REACT_APP_API_URL` at build time.

### Deploying to Netlify

1. Connect the repository on Netlify by clicking "New site from Git" and connect your Git provider.
2. In the Build settings, set:
	- Build command: `npm run compile`
	- Publish directory: `build`
3. Add environment variables in Netlify site settings (optional):
	- `REACT_APP_API_URL` — if your backend is served elsewhere.
4. If you're using Netlify CLI, you can run locally in your project:
	```powershell
	npm install
	npm run compile
	npm run netlify:deploy
	```
	You'll need to login with `npx netlify-cli login` and set the site with `npx netlify-cli link` or pass `--site` with `--prod`.

Because we added `public/_redirects` and `netlify.toml` to the repo, Netlify will handle SPA routing and build automatically via the settings above.

---

If you want me to add a `deploy` script for a specific provider (e.g. GitHub Pages or Netlify CLI), tell me which provider and I can add it for you.

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
