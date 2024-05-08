const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

const userRoutes = require('./api/routes/userRoutes');
app.use('/users', userRoutes);

app.listen(PORT, () => {
  console.log(`Servidor iniciado en el Puerto: ${PORT}`);
});