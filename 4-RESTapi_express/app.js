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
    res.status(404).send('<h1>Error 404 jaja</h1>')
})


const PORT = process.env.PORT ?? 3000

app.listen(PORT, () => {
    console.log(`Server listening on port http://localhost:${PORT}`)
})