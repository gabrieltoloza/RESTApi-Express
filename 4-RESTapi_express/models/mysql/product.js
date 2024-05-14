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

        try {

            if (category) {

                const lowerCaseCategoria = category.toLowerCase()
                const [categoria] = await connection.query(
                    'SELECT id, nombre FROM categoria WHERE LOWER(nombre) = ?',
                    [lowerCaseCategoria]
                )
                if (categoria.length === 0 ) return []
    
                const [{ id }] = categoria  //<---  id de la categoria
                console.log("cateogira_id: ", id)
    
                // en base al id de la categoria, se hace la consulta? 
                const [productsFiltered] = await connection.query(
                    `   SELECT BIN_TO_UUID(producto_id), producto.marca, producto.detalles, producto.precio, producto.precioOriginal, imagenUrl, producto.descripcion, producto.stock, categoria_id
                        FROM producto 
                        JOIN producto_categoria ON producto.id = producto_categoria.producto_id 
                        JOIN categoria ON producto_categoria.categoria_id = categoria.id 
                        WHERE categoria.id = ?`, [id]
                )
    
                return productsFiltered
    
            }
    
            const [result] = await connection.query(
                `
                SELECT 
                    bin_to_uuid(producto.id) AS id, 
                    marca, 
                    detalles, 
                    precio, 
                    precioOriginal, 
                    imagenUrl, 
                    descripcion, 
                    stock, 
                    categoria.nombre AS categoria

                FROM producto
                JOIN producto_categoria ON producto_id = producto.id
                JOIN categoria ON producto_categoria.categoria_id = categoria.id
                `
            )
            console.log("Consumo de funcion ")
            return result
            
        } catch (err) {
            console.error("Ocurrio un error al consultar productos: Detalles:  ", err.message)
        }
        
    }


    static async getById ({ id }) {
        
        try {

            const [producto] = await connection.query(
                `SELECT marca, detalles, precio, precioOriginal, imagenUrl, descripcion, stock, BIN_TO_UUID(id) 
                 FROM producto
                 WHERE id = UUID_TO_BIN(?)`, [id]
            )
            
            if (producto.length === 0 ) return null

            return producto[0]
    
        } catch (err) {
            console.error("Ocurrio un error al intentar buscar el producto: Detalles:  ", err.message)
        }
    }


    static async createProduct ({ input }) {
        const [result] = (await connection.query('SELECT UUID() uuid'))[0]
        const uuid = result.uuid
        try {
            const {
                marca,
                detalles,
                precio,
                precioOriginal,
                categoria,
                imagenUrl,
                descripcion,
                stock
            } = input
    
            await connection.query(
                `INSERT INTO producto (id, marca, detalles, precio, precioOriginal, imagenUrl, descripcion, stock)
                VALUES
                    (UUID_TO_BIN(?), ?, ? ,?, ? ,? ,? ,?)`,
                [uuid, marca, detalles, precio, precioOriginal, imagenUrl, descripcion, stock]
            )   
            
            await connection.query(
                `INSERT INTO producto_categoria (producto_id, categoria_id)
                VALUES
                    ((SELECT id FROM producto WHERE marca = ?), (SELECT id FROM categoria WHERE nombre = ?))`,
                [marca, categoria]
            )
            
            const queryNewProduct = await connection.query(
                `SELECT *, BIN_TO_UUID(producto_id)
                FROM producto
                JOIN producto_categoria ON producto.id = producto_categoria.producto_id
                JOIN categoria ON producto_categoria.categoria_id = categoria.id
                WHERE producto.marca = ?;`,
                [marca]
            )
            
            return queryNewProduct[0]
            
        } catch (err) {
            console.error("Ocurrio un error al crear o asociar el nuevo producto. Detalles:  ", err.message)
        }



    }
    

    static async updateProduct ({ id, input }) {
        try {
            let updateValues = []
            let queryParts = [] 
            
            for (let field in input) {
                updateValues.push(input[field])
                queryParts.push(`${field} = ?`)
            }
            updateValues.push(id)

            const [result] = await connection.query(
                `UPDATE producto SET ${queryParts.join(', ')}
                WHERE id = UUID_TO_BIN(?);`,
                [updateValues]
            )

            if (result.affectedRows > 0) {
                console.log("El producto ha sido actualizado con exito")
            } else {
                console.log("No se encontro un producto con ese id")
            }

            const [productUpdate] = await connection.query(
                `SELECT BIN_TO_UUID(producto.id) as id, marca, detalles, precio, precioOriginal, imagenUrl, descripcion, stock, categoria.nombre as categoria
                FROM producto
                JOIN producto_categoria ON producto.id = producto_categoria.producto_id
                JOIN categoria ON producto_categoria.categoria_id = categoria.id
                WHERE producto.id = UUID_TO_BIN(?)`,
                id
            )
            if (productUpdate.length === 0 ) return null
            
            return [productUpdate]

        } catch(err) {
            console.error("Ocurrio un problema al intentar actualizar los datos, Detalles:  ", err.message)

        }

    }
  


    static async deleteProduct ({id}) {
        try {
            const [deleteProduct] = await connection.query(
                `DELETE FROM producto 
                WHERE id = UUID_TO_BIN(?)`,
                id
            )
            console.log(deleteProduct)

            if (deleteProduct.affectedRows === 1) return true
           
        } catch (err) {
            console.error("Ocurrio un error al intentar borrar el producto. Detalles:  ", err.message)
            return false
        }

    }
}

