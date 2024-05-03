const z = require('zod')



// esquema de validaciones con "zod"
const productSchema = z.object({

    marca: z.string({
        invalid_type_error: 'Product brand must be a string',
        required_error: 'Product brand is required'
    }),
    detalles: z.string({
        invalid_type_error: 'Details must be a string',
        required_error: 'Details is required'
    }),
    precio: z.number().min(0).max(10000),
    precioOriginal: z.number().min(0).max(10000),
    categoria: z.string({
        invalid_type_error: 'Category must be a string',
        required_error: 'Category is required'
    }),
    imagenUrl: z.string({
        invalid_type_error: 'ImagenURL must be a string',
        required_error: 'ImagenURL is required'
    }),
    descripcion: z.string({
        invalid_type_error: 'Description must be a string',
        required_error: 'Description is required'
    }),
    stock: z.number().int()

})

// funcion para validar la creacion de un producto POST 
function validateProduct (object) {
    return productSchema.safeParse(object)
}


function validatePartial (object) {
    return productSchema.partial().safeParse(object)
}


module.exports = {
    validateProduct,
    validatePartial
}