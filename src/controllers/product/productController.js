const db = require('../../config/database');

// Función para obtener todos los productos
exports.getAllProducts = (req, res) => {
  db.query('SELECT * FROM products', (err, rows) => {
    if (err) {
      console.error('Error al obtener productos: ', err);
      res.status(500).send('Error al obtener productos');
      return;
    }
    res.status(200).json(rows);
  });
};

// Función para obtener un producto por su código
exports.getProductByCode = (req, res) => {
    const productCode = req.params.productCode;

    db.query('SELECT * FROM products WHERE productCode = ?', [productCode], (err, rows) => {
        if (err) {
            console.error('Error al obtener el producto:', err);
            res.status(500).send('Error al obtener el producto');
            return;
        }

        if (rows.length === 0) {
            res.status(404).send('Producto no encontrado');
            return;
        }

        const product = rows[0];
        res.status(200).json(product);
    });
};

// Función para crear un nuevo producto
exports.createProduct = (req, res) => {
  const { productCode, name, price, quantityAvailable } = req.body;
  const sql = 'INSERT INTO products (productCode, name, price, quantityAvailable) VALUES (?, ?, ?, ?)';
  const values = [productCode, name, price, quantityAvailable];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error al crear producto: ', err);
      res.status(500).send('Error al crear producto');
      return;
    }

    // Obtener el producto recién insertado
    db.query('SELECT * FROM products WHERE productCode = ?', [productCode], (err, rows) => {
      if (err) {
        console.error('Error al obtener el producto creado: ', err);
        res.status(500).send('Error al obtener el producto creado');
        return;
      }
      const newProduct = rows[0];
      res.status(201).send(newProduct);
    });
  });
};

// Función para actualizar un producto existente
exports.updateProduct = (req, res) => {
  const productCode = req.params.productCode;
  const { name, price, quantityAvailable } = req.body;

  // Construir dinámicamente la consulta SQL
  let sql = 'UPDATE products SET';
  const values = [];
  
  if (name !== undefined) {
    sql += ' name = ?,';
    values.push(name);
  }
  if (price !== undefined) {
    sql += ' price = ?,';
    values.push(price);
  }
  if (quantityAvailable !== undefined) {
    sql += ' quantityAvailable = ?,';
    values.push(quantityAvailable);
  }

  // Eliminar la coma final y agregar la cláusula WHERE
  sql = sql.slice(0, -1) + ' WHERE productCode = ?';
  values.push(productCode);

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error al actualizar producto: ', err);
      res.status(500).send('Error al actualizar producto');
      return;
    }

    if (result.affectedRows === 0) {
      res.status(404).send('Producto no encontrado');
      return;
    }

    // Obtener el producto actualizado
    db.query('SELECT * FROM products WHERE productCode = ?', [productCode], (err, rows) => {
      if (err) {
        console.error('Error al obtener el producto actualizado: ', err);
        res.status(500).send('Error al obtener el producto actualizado');
        return;
      }
      const updatedProduct = rows[0];
      res.status(200).send(updatedProduct);
    });
  });
};

// Función para eliminar un producto existente
exports.deleteProduct = (req, res) => {
  const productCode = req.params.productCode;

  const deleteSql = 'DELETE FROM products WHERE productCode = ?';
  db.query(deleteSql, [productCode], (err, result) => {
    if (err) {
      console.error('Error al eliminar producto: ', err);
      res.status(500).send('Error al eliminar producto');
      return;
    }

    if (result.affectedRows === 0) {
      res.status(404).send('Producto no encontrado');
      return;
    }

    // Reiniciar el id de los productos
    const resetIdSql1 = 'SET @autoid := 0';
    const resetIdSql2 = 'UPDATE products SET id = @autoid := (@autoid + 1)';
    const resetIdSql3 = 'ALTER TABLE products AUTO_INCREMENT = 1';

    db.query(resetIdSql1, (err) => {
      if (err) {
        console.error('Error al reiniciar variable de auto-incremento: ', err);
        res.status(500).send('Error al reiniciar variable de auto-incremento');
        return;
      }

      db.query(resetIdSql2, (err) => {
        if (err) {
          console.error('Error al actualizar IDs de productos: ', err);
          res.status(500).send('Error al actualizar IDs de productos');
          return;
        }

        db.query(resetIdSql3, (err) => {
          if (err) {
            console.error('Error al reiniciar AUTO_INCREMENT: ', err);
            res.status(500).send('Error al reiniciar AUTO_INCREMENT');
            return;
          }

          res.status(200).send('Producto eliminado y ID reiniciado');
        });
      });
    });
  });
};