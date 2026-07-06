const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

let venditeTotali = 1523;

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/menu', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'data', 'menu.json'));
});

app.get('/api/vendite', (req, res) => {
    res.json({ vendite: venditeTotali });
});

app.post('/api/vendite', (req, res) => {
    const { quantita } = req.body;
    venditeTotali += quantita;
    res.json({ vendite: venditeTotali });
});

app.listen(PORT, () => {
    console.log(`Server avviato su http://localhost:${PORT}`);
});
