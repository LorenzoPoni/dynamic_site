const express = require('express');
const { Pool } = require('pg');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

pool.query(`
  CREATE TABLE IF NOT EXISTS vendite (
    id SERIAL PRIMARY KEY,
    count INTEGER DEFAULT 0
  )
`).then(() => {
  pool.query('SELECT count FROM vendite WHERE id = 1').then(result => {
    if (result.rows.length === 0) {
      pool.query('INSERT INTO vendite (id, count) VALUES (1, 1523)');
    }
  });
}).catch(err => console.error('Errore creazione tabella:', err));

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/menu', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'data', 'menu.json'));
});

app.get('/api/vendite', async (req, res) => {
  try {
    const result = await pool.query('SELECT count FROM vendite WHERE id = 1');
    res.json({ vendite: result.rows[0]?.count || 0 });
  } catch (err) {
    res.json({ vendite: 0 });
  }
});

app.post('/api/vendite', async (req, res) => {
  const { quantita } = req.body;
  try {
    await pool.query('UPDATE vendite SET count = count + $1 WHERE id = 1', [quantita]);
    const result = await pool.query('SELECT count FROM vendite WHERE id = 1');
    res.json({ vendite: result.rows[0]?.count || 0 });
  } catch (err) {
    res.json({ vendite: 0 });
  }
});

app.listen(PORT, () => {
  console.log(`Server avviato su http://localhost:${PORT}`);
});
