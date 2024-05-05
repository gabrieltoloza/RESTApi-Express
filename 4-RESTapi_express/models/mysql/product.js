import mysql from 'mysql2/promise'

const config = {
    user: 'root',
    password: 'Germancitoquerido@2024',
    host: 'localhost',
    port: '3306',
    database: 'productosdb'
}

const connection = await mysql.createConnection(config)



export class ProductsModels{

    static async getAll ({category}) {
        // la consulta devuelve una tupla con dos indices, resultado e informacion.

        if (category) {

            const lowerCaseCategoria = category.toLowerCase()
            const [categoria] = await connection.query(
                'SELECT id, nombre FROM categoria WHERE LOWER(nombre) = ?',
                [lowerCaseCategoria]
            )
            if (categoria.length === 0 ) return []

            const [{ id }] = categoria  //<---  id de la categoria
            console.log("cateogira_id: ", id)


            const [productsFiltered] = await connection.query(
                `   SELECT * 
                    FROM producto 
                    JOIN producto_categoria ON producto.id = producto_categoria.producto_id 
                    JOIN categoria ON producto_categoria.categoria_id = categoria.id 
                    WHERE categoria.id = ?`, [id]
            )
            
            return productsFiltered

        }

        const [result] = await connection.query(
            'SELECT marca, detalles, precio, precioOriginal, imagenUrl, descripcion, stock, BIN_TO_UUID(id) FROM producto;'
        )
        return result
        
    }


    static async getById ({ id }) {
        

    }


    static async createProduct ({ input }) {


    }
    

    static async updateProduct ({ id, input }) {
        

    }
  


    static async deleteProduct ({id}) {


    }
}
