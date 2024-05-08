const bcrypt = require('bcrypt');

let users = [];

exports.createUser = async (req, res ) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = {
        name: req.body.name,
        password: hashedPassword
    };
    users.push(newUser);
    res.status(201).send(newUser);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al crear usuario');
    }
}

exports.getUsers = (req, res) => {
    try {
      res.status(200).json(users);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al obtener usuarios');
    }
  };
  