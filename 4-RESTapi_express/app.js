const products = require('./productos.json')
const crypto = require('node:crypto')
const express = require('express')
const { validateProduct, validatePartial } = require('./schema_validation')
const app = express()
const cors = require('cors')

app.use(express.json()) // <-- Middleware de Express, multiples funciones. LEER MAS 

app.disable('x-powered-by') // deshabilitar el header X-Powered-By : Express

// Array que contiene los origins permitidos para el CORS
const ACCEPTED_ORIGINS = [
    'http://localhost:8080',
    'http://localhost:3000',
    'http://127.0.0.1:5500',
    'file:///C:/Users/Usuario/Workspace/Node/Api%20con%20Node%20y%20Express/4-RESTapi_express/index.html'
]



// GET global
app.get('/', (req,res) => {
    res.json({"message": "Mi api rest"})
})




//  Los recursos que sean productos seran identificados como /products
app.get('/products', (request, response) => {
    const origin = request.header('origin')

    if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
        response.header('Access-Control-Allow-Origin', origin)

    }
    response.json(products)
})





// Verbo GET para traer para filtrar la consulta con "query params"
app.get('/products/category', (req,res) => {
    const { categoria } = req.query

    if (categoria) {
        const queryCategory = products.filter(product => product.categoria.toLowerCase() === categoria.toLowerCase()) 
        return res.json(queryCategory)
    }
})





// Vervo GET para filtrar la consulta por id
app.get('/products/:id', (req, res) => {
    const { id } = req.params // traemos el parametro dinamico a una constante
    
    const product = products.find((prod) => prod.id === Number(id))
    if (product) return res.json(product)

    res.status(404).send('<h1>Product not found</h1>')
})






// Verbo POST para crear un nuevo producto, le agregamos un nuevo id con el modulo crypto: randomUUID()
app.post('/products', (req, res) => {

    // funcion importada para validar los campos con modulo zod
    const result = validateProduct(req.body)
    if (result.error) {
        return res.status(400).json({error: JSON.parse(result.error.message)})
    }
    // creando el nuevo producto con datos validados
    const newProduct = {
        id : crypto.randomUUID(),
        ...result.data,      // <--  No es buena practica usar el spread operator, pero en este caso estamos validando antes 
    }                        //       los datos por lo que no dejara pasar campos que no hayan sido sanitizados

                                       //  al guardar la respuesta de la request en una variable estamos cambiando el estado,
                                       //  esto no cumple con los principios REST, deberian validarse y guardarlo en una 
    products.push(newProduct)   //<--  //  base de datos haciendolo persistente. Al guardarlo en un array estamos "mutando"
                                       //  el estado de la request

    res.status(201).json(newProduct)
})


app.patch('/products/:id', (req, res) => {
    
    const result = validatePartial(req.body)
    
    const {id} = req.params
    const productIndex = products.findIndex(product => product.id === Number(id))

    if (!result.success) return res.status(404).json({message: 'Product not found (PATH)'})
    if (productIndex < 0) return res.status(404).json({message: 'Product not found (PATH)'})

    const updateProduct = {
        ...products[productIndex],
        ...result.data
    }
    products[productIndex] = updateProduct

    return res.json(updateProduct)
})


app.delete('/products/:id', (req, res) => {
    const origin = req.header('origin')
    if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
        res.header('Access-Control-Allow-Origin', origin)
    }

    const {id} = req.params
    const productIndex = products.findIndex(produc => produc.id === Number(id))

    if (productIndex < 0) return res.status(404).json({message: "Product not found"})
    
    products.splice(productIndex, 1)

    return res.status(200).json({message: "Producto eliminado con exito"})
})


app.options('/products/:id', (req, res) => {
    const origin = req.header('origin')

    if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
        res.header('Access-Control-Allow-Origin', origin)
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    }
    res.sendStatus(200)
})

// Gestion de error 404 para la app general
app.use((req, res) => {
    res.status(404).send('<h1>Error 404 jaja</h1>')
})



// Creamos un puerto que sera consumido por una variable de entorno, sino utilizara el 3000
const PORT = process.env.PORT ?? 3000

app.listen(PORT, () => {
    console.log(`Server listening on port http://localhost:${PORT}`)
})