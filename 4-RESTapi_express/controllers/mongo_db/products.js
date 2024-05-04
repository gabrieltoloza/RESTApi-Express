
import { validateProduct, validatePartialProduct } from '../schema_validation.js'
import { ProductsModelsMongo } from '../models/mongo_db/product.js'

export class ProductsController {

    static async getAllforMongo (req, res) {
        const { categoria } = req.query
        const products = await ProductsModelsMongo.getAllforMongo({categoria})
        return res.json(products)
        
    }

    static async getByIDforMongo (req, res) {
        const { id } = req.params
        const product = await ProductsModelsMongo.getByIdforMongo({id})
        if (product) return res.json(product)
        return res.status(400).send("<h1>Product not found</h1>")
    }

    static async createProductforMongo (req, res) {
        const result = validateProduct(req.body)
        if (result.error) {
            return res.send(400).json({message: JSON.parse(result.error.message)})
        }
        const newProduct = await ProductsModelsMongo.createProductforMongo({ input: result.data})
        return res.status(200).json(newProduct)
    }


    static async updatedProductForMongo (req, res) {
        const result = validatePartialProduct(req.body)

        if (!result.success) return send(400).json({error: JSON.parse(result.error.message)})

        const { id } = req.params
        
        const updateProduct = await ProductsModelsMongo.updateProductforMongo({id: Number(id), input: result.data})
        return res.json(updateProduct)
    }

    
    static async deleteProductForMongo (req, res) {
        const { id } = req.params
        const result = await ProductsModelsMongo.deleteProductforMongo({ id :Number(id) })

        if (result === false) return res.status(404).json({message: "Product not found"})
        return res.status(200).json({ message: "Producto eliminado con exito" })
    }
    
}