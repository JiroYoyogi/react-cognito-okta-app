// server.js (ESM形式)
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/complete-logout', (req, res) => {
  console.log('SAMLResponse received:', req.body);

  const redirectTo = isProduction
    ? '/callback-logout'
    : 'http://localhost:5173/callback-logout';

  res.redirect(302, redirectTo);
});

// ExpressでReactアプリを配信する
if (isProduction) {
  const distPath = path.join(__dirname, 'dist');
  app.use(express.static("dist"));
  app.get('/', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
