import { Router } from "express";
import { OrdersController } from "../controllers/orders.js";

export const orderRouter = Router()


orderRouter.get('/', OrdersController.getAll)
orderRouter.post('/', OrdersController.createOrder)

orderRouter.get('/:id', OrdersController.getById)
orderRouter.patch('/:orderId/users/:userId', OrdersController.updateOrder)