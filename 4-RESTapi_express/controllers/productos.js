import { validateProduct, validatePartialProduct } from '../schema_validation.js'





export class ProductController {
    // usamos un constructor para inyectar que modelo usar
    constructor ({ productModel }) {
        this.productModel = productModel
    }

    
    getAll = async (req, res) => {
        const { category } = req.query
        const products = await this.productModel.getAll({ category })
        res.json(products)
    }

    getByID = async (req, res) => {
        const { id } = req.params 
        const product = await this.productModel.getById({ id })
        if (product === null) return res.status(404).json({ message : "Producto no encontrado "})
        return res.json(product)
    }

    createProduct = async (req, res) => {
        const result = validateProduct(req.body)  // <--- funcion importada para validar los campos con libreria 'zod'
        if (result.error) {
            return res.status(400).json({error: JSON.parse(result.error.message)})
        }
        const newProduct = await this.productModel.createProduct({ input : result.data })
        // console.log(newProduct)
        res.status(201).json(newProduct)
    }

    updateProduct = async (req, res) => {
        const result = validatePartialProduct(req.body)
        if (!result.success) return res.status(404).json({ error: JSON.parse(result.error.message) })
    
        const {id} = req.params
        const updateProduct = await this.productModel.updateProduct({ id, input: result.data })
        
        return res.json(updateProduct)
    }


    deleteProduct = async (req, res) => {
        const {id} = req.params
        const result = await this.productModel.deleteProduct({ id })
    
        if (result === false) return res.status(404).json({ message: "No se pudo eliminar el producto" })
        
        return res.status(200).json({ message: "Producto eliminado con exito" })
    }

    
}