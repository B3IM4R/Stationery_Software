const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'b9qbrwfkawsr6be91l3y-mysql.services.clever-cloud.com',
  user: 'uzitcpk4d4iqpilo',
  password: '0YHxXu8N1EfDSLAJxIW7',
  database: 'b9qbrwfkawsr6be91l3y'
});

connection.connect((err) => {
  if (err) {
    console.error('Error al conectarse con la base de datos:', err);
    return;
  }
  console.log('Conectado a la Base de Datos');
});

module.exports = connection;