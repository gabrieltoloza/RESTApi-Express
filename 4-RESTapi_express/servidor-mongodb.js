import { createApp  } from "./app.js";
import { ProductModel } from "./models/mongo_db/product.js";

createApp({ productModel: ProductModel})