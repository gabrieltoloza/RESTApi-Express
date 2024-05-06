import { createApp } from "./app.js";
import { ProductModel } from './models/mysql/product.js'

createApp({ productModel: ProductModel})