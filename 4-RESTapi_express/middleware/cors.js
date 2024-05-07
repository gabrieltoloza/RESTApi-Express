import cors from 'cors'


// Array que contiene los origins permitidos para definir en CORS
const ACCEPTED_ORIGINS = [
    'http://localhost:8080',
    'http://localhost:3000',
    'http://127.0.0.1:5500',
    'file:///C:/Users/Usuario/Workspace/Node/Api%20con%20Node%20y%20Express/4-RESTapi_express/index.html'
]



export const corsMiddleware = ({acceptedOrigins = ACCEPTED_ORIGINS} = {}) => cors({

    origin: (origin, callback) => {
        
        if (acceptedOrigins.includes(origin)) {
            return callback(null, true)
        }

        if (!origin) {
            return callback(null, true)
        }

        return callback(new Error('Solicitud no permitida por CORS'), false)
    }
})