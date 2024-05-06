import { createApp } from "./app.js";
import { ProductModel } from "./models/local-file-system/product.js";


createApp({ productModel: ProductModel })