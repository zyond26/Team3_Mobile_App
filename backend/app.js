const express = require('express');
const cors = require('cors');
const { poolConnect, sql, pool } = require('./src/config/db');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/products', async (req, res) => {
  await poolConnect;
  const result = await pool.request().query('SELECT * FROM Product');
  res.json(result.recordset);
});

app.listen(3000, () => console.log('API chạy tại http://localhost:3000'));
