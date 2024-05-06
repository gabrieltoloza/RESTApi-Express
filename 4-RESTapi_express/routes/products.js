import { Router } from "express";
import { ProductController } from "../controllers/productos.js";


export const createProductRouter = ({ productModel }) => {
    const productsRouter = Router()
    
    const productController = new ProductController ({ productModel })
    productsRouter.get('/', productController.getAll)           // <-- GET
    productsRouter.post('/',  productController.createProduct)      // <-- POST
    
    productsRouter.get('/:id', productController.getByID)          // <-- GET by ID
    productsRouter.patch('/:id', productController.updateProduct)      // <-- PATCH
    productsRouter.delete('/:id', productController.deleteProduct)     // <-- DELETE

    return productsRouter
}




