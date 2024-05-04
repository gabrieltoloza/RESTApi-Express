import { Router } from "express";
import { ProductsController } from "../controllers/productos.js";

export const productsRouter = Router()




productsRouter.get('/', ProductsController.getAll)           // <-- GET

productsRouter.post('/',  ProductsController.createProduct)      // <-- POST

productsRouter.get('/:id', ProductsController.getByID)          // <-- GET by ID

productsRouter.patch('/:id', ProductsController.updateProduct)      // <-- PATCH

productsRouter.delete('/:id', ProductsController.deleteProduct)     // <-- DELETE




