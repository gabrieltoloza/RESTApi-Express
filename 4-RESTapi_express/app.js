import express, { json } from 'express'
import { productsRouter } from './routes/products.js'
import {corsMiddleware} from './middleware/cors.js'

const app = express()


app.use(json()) // <-- Middleware de Express, multiples funciones. LEER MAS
app.use(corsMiddleware())  // <---- Middleware hecho con cors para validar el protocolo CORS
app.disable('x-powered-by') // deshabilitar el header X-Powered-By : Express (buena practica de seguridad)

// router
app.use('/products', productsRouter)



// Gestion de error 404 para la app general
app.use((req, res) => {
    res.status(404).json(
        {Hi: "How are you? To list all products( http://localhost:3000/products ). To list by id ( http://localhost:3000/products/1) - [from 1 to 15]. By categoria: (http://localhost:3000/products?category=aceites ). Create, update and delete are disabled so as not to use database. Ask for authorization!"}
    )
})


const PORT = process.env.PORT ?? 3000

app.listen(PORT, () => {
    console.log(`Server listening on port http://localhost:${PORT}`)
})