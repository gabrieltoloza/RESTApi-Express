import { ProductsModels } from "../models/product.js"
import { validateProduct, validatePartialProduct } from '../schema_validation.js'

export class ProductsController {
    static async getAll (req, res) {
        const { categoria } = req.query
        const products = await ProductsModels.getAll({categoria})
        res.json(products)
    }

    static async getByID (req, res) {
        const { id } = req.params 
        const product = await ProductsModels.getById({ id })
        if (product) return res.json(product)
        res.status(404).send('<h1>Product not found</h1>')
    }

    static async createProduct (req, res) {
        const result = validateProduct(req.body)  // <--- funcion importada para validar los campos con libreria 'zod'
    
        if (result.error) {
            return res.status(400).json({error: JSON.parse(result.error.message)})
        }
        const newProduct = await ProductsModels.createProduct({input : result.data})
        
        res.status(201).json(newProduct)
    }

    static async updateProduct (req, res) {
        const result = validatePartialProduct(req.body)
        if (!result.success) return res.status(404).json({ error: JSON.parse(result.error.message) })
    
        const {id} = req.params
        const updateProduct = await ProductsModels.updateProduct({ id, input: result.data})
        
        return res.json(updateProduct)
    }


    static async deleteProduct (req, res) {
        const {id} = req.params
        const result = await ProductsModels.deleteProduct({ id })
    
        if (result === false) return res.status(404).json({message: "Product not found"})
        
        return res.status(200).json({message: "Producto eliminado con exito"})
    }
}