import { createApp } from "./app.js";
import { ProductModel } from './models/mysql/product.js'

const servicioDeProductos = createApp({ productModel: ProductModel})