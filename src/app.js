const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/user/userRoutes');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());
app.use('/users', userRoutes);

app.listen(PORT, () => {
  console.log(`Servidor iniciado en el Puerto: ${PORT}`);
});