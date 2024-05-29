const bcrypt = require("bcrypt");
const db = require("../../config/database");

exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Consultar la base de datos para encontrar el usuario por username
    const sql = "SELECT * FROM users WHERE username = ?";
    db.query(sql, [username], async (err, rows) => {
      if (err) {
        console.error("Error al Buscar el Usuario: ", err);
        res.status(500).send("Error al Buscar el Usuario");
        return;
      }

      if (rows.length === 0) {
        res.status(400).send("Usuario No Encontrado");
        return;
      }

      const user = rows[0];

      // Comparar la contraseña proporcionada con la almacenada en la base de datos
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        res.status(400).send("Contraseña Incorrecta");
        return;
      }

      // Autenticación exitosa
      res.status(200).json({
        message: "Inicio de Sesión Exitoso!",
        user: {
          name: user.name, // Asegúrate de que estos campos existan en tu tabla de usuarios
          lastname: user.lastname,
        },
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al Iniciar Sesión");
  }
};
