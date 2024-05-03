import { Router } from "express";
import { ProductsController } from "../controllers/productos.js";

export const productsRouter = Router()





productsRouter.get('/', ProductsController.getAll)
productsRouter.post('/',  ProductsController.createProduct)


productsRouter.get('/:id', ProductsController.getByID)
productsRouter.patch('/:id', ProductsController.updateProduct)
productsRouter.delete('/:id', ProductsController.deleteProduct)




