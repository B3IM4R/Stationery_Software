const bcrypt = require('bcrypt');
const db = require('../config/database');

exports.createUser = async (req, res) => {
  try {
    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Insertar el nuevo usuario en la base de datos
    const sql = 'INSERT INTO users (name, lastname, identification, username, password) VALUES (?, ?, ?, ?, ?)';
    const values = [req.body.name, req.body.lastname, req.body.identification, req.body.username, hashedPassword];
    
    db.query(sql, values, (err, result) => {
      if (err) {
        console.error('Error al crear usuario: ', err);
        res.status(500).send('Error al crear usuario');
        return;
      }
      // Obtener el ID del usuario recién insertado
      const userId = result.insertId;

      // Consultar la base de datos para obtener el usuario recién insertado
      db.query('SELECT * FROM users WHERE id = ?', userId, (err, rows) => {
        if (err) {
          console.error('Error al obtener el usuario creado: ', err);
          res.status(500).send('Error al obtener el usuario creado');
          return;
        }
        const newUser = rows[0];
        res.status(201).send(newUser);
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al crear usuario');
  }
};

// Función para obtener todos los usuarios de la base de datos
exports.getUsers = (req, res) => {
  // Consultar todos los usuarios en la base de datos
  db.query('SELECT * FROM users', (err, rows) => {
    if (err) {
      console.error('Error al obtener usuarios: ', err);
      res.status(500).send('Error al obtener usuarios');
      return;
    }
    res.status(200).json(rows);
  });
};