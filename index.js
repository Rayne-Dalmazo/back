require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(cors()); // configurar origem se quiser: cors({ origin: 'https://meu-site.vercel.app' })
app.use(express.json());

const pool = mysql.createPool(process.env.DATABASE_URL /* ex: mysql://user:pass@host:port/db */);

app.get('/', (req, res) => res.json({ ok: true }));

// Exemplo: cadastrar usuário
app.post('/api/register', async (req, res) => {
  const { nome, email, senha } = req.body;
  if (!nome || !email || !senha) return res.status(400).json({ error: 'faltam dados' });

  try {
    const [result] = await pool.query(
      'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)',
      [nome, email, senha] // hash de senha em produção!
    );
    res.json({ id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'erro no banco' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('API rodando na porta', PORT));