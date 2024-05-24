const express = require('express');
const productController = require('../../controllers/product/productController');

const router = express.Router();

// Ruta para obtener todos los productos
router.get('/', productController.getAllProducts);

// Ruta para crear un nuevo producto
router.post('/', productController.createProduct);

// Ruta para actualizar un producto existente
router.put('/:productCode', productController.updateProduct);

// Ruta para eliminar un producto existente
router.delete('/:productCode', productController.deleteProduct);

module.exports = router;