require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(cors()); // configurar origem se quiser: cors({ origin: 'https://meu-site.vercel.app' })
app.use(express.json());

const pool = mysql.createPool(process.env.DATABASE_URL /* ex: mysql://user:pass@host:port/db */);

app.get('/', (req, res) => res.json({ ok: true }));

// LOGIN
app.post('/api/usuarios/login', async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha)
        return res.status(400).json({ error: 'faltam dados' });

    try {
        const [rows] = await pool.query(
            'SELECT id, nome, email FROM usuarios WHERE email = ? AND senha = ?',
            [email, senha]
        );

        if (rows.length === 0)
            return res.status(401).json({ error: 'credenciais inválidas' });

        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'erro no banco' });
    }
});

// BUSCAR USUÁRIO
app.get('/api/usuarios/:id', async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT id, nome, email FROM usuarios WHERE id = ?',
            [req.params.id]
        );

        if (rows.length === 0)
            return res.status(404).json({ error: 'usuário não encontrado' });

        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'erro no banco' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('API rodando na porta', PORT));