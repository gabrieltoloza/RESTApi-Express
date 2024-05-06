import { readJson } from '../../utils.js'
import { randomUUID } from 'node:crypto'

const products = readJson('./productos.json')




export class ProductModel {

    static async getAll ({ categoria }) {
        if(categoria) {
            return products.filter(product => product.categoria.toLowerCase() === categoria.toLowerCase())
         }
         return products
    }


    static async getById ({ id }) {
        const product = products.find((prod) => prod.id === Number(id))
        return product
    }

    
    static async createProduct ({ input }) {

        const newProduct = {
            id : randomUUID(),          // <--  No es buena practica usar el spread operator, pero en este caso estamos validando antes
            ...input,                   //       los datos por lo que no dejara pasar campos que no hayan sido sanitizados
        }                        
                                        //  al guardar la respuesta de la request en una variable estamos cambiando el estado,
        products.push(newProduct)  //<--//  esto no cumple con los principios REST, deberian validarse y guardarlo en una 
                                        //  base de datos haciendolo persistente. Al guardarlo en un array estamos "mutando"
                                        //  el estado de la request
        return newProduct
    }


    static async deleteProduct ({id}) {
        const productIndex = products.findIndex(produc => produc.id === Number(id))

        if (productIndex === - 1) return false
        
        products.splice(productIndex, 1)
        return true
    }


    static async updateProduct ({ id, input }) {
        
        const productIndex = products.findIndex(product => product.id === Number(id))

        if (productIndex < 0) return false

        products[productIndex] = {
            ...products[productIndex],
            ...input
        }
        
        return products[productIndex]
    }

}