import mysql from 'mysql2/promise'
import { validateId } from '../../schema_validation.js'

const config = {
    user: 'root',
    password: 'Germancitoquerido@2024',
    host: 'localhost',
    port: '3306',
    database: 'productosdb'
}

const connection = await mysql.createConnection(config)


export class OrderModel {

    static async getAll() {
        try {
            const [allOrders] = await connection.query(
                `
                SELECT 
                usuario.nombre, 
                usuario.apellido, 
                usuario.dni, 
                pedido.id AS pedido_id, 
                GROUP_CONCAT(producto.marca) AS productos,
                factura.fecha,
                factura.total
                    
                FROM factura
                JOIN pedido ON pedido.id = factura.pedido_id
                JOIN usuario ON usuario.id = pedido.usuario_id
                JOIN pedido_producto ON pedido_producto.pedido_id = pedido.id
                JOIN producto ON pedido_producto.producto_id = producto.id
                GROUP BY pedido.id, factura.fecha, factura.total;
              `
            )

            return allOrders

        } catch (err) {
            console.log("Ocurrio un error al consultar los datos. Detalles:  ", err.message)
        }

    }

    static async getById ({ id }) {
        
        try {
            console.log(id)
            const [userId] = await connection.query(
                `SELECT 
                usuario.nombre, 
                usuario.apellido, 
                usuario.dni, 
                pedido.id AS pedido_id, 
                GROUP_CONCAT(producto.marca) AS productos,
                factura.fecha,
                factura.total
                    
                FROM factura
                JOIN pedido ON pedido.id = factura.pedido_id
                JOIN usuario ON usuario.id = pedido.usuario_id
                JOIN pedido_producto ON pedido_producto.pedido_id = pedido.id
                JOIN producto ON pedido_producto.producto_id = producto.id
                WHERE usuario.id = UUID_TO_BIN( ? )
                GROUP BY pedido.id, factura.fecha, factura.total;`,
                [id]
            )

            if (userId.length === 0) return false

            return userId
        } catch (err) {
            console.log("Ocurrio un error al intentar consultar datos. Detalles: ", err.message)
        }
    }

    
    
    static async createOrder ({ input }) {
        try {
            const { userId, productos } = input
            console.log(userId)
            console.log(productos)
            // creando nuevo pedido
            const [result, extra1] = await connection.query(
                `
                INSERT INTO pedido (usuario_id)
                VALUES 
                    ( (SELECT id FROM usuario WHERE id = UUID_TO_BIN(?)) );
                `,
                [userId]

            )
            if(result.length === 0 ) return false
            
            console.log("Create, insertOrder: ",extra1) // <- log para consola

            const [newIdOrder] = await connection.query(
                `
                SELECT id
                FROM pedido
                ORDER BY id
                `
            )

            const lastIndex = newIdOrder.length - 1
            console.log(newIdOrder[lastIndex].id)

            //creando nuevo pedido
            for(const producto of productos) {
                try {
                    const [newOrderInsert, extra] = await connection.query(
                        `
                        INSERT INTO pedido_producto (pedido_id, producto_id)
                        VALUES
                            (?, (SELECT id FROM producto WHERE marca = ?))
                        `,
                       [newIdOrder[lastIndex].id, producto]
                    )
                    console.log("Create, pedido_producto:  ",extra) // <- log para consola
                } catch (err) {
                    console.error("Ocurrio un error al intentar crear la factura en la iteracion. Detalles: ", err.message)
                    return;
                }
            }

            // Nueva factura
            try {
                const [newInvoice, extra] = await connection.query(
                    `
                    INSERT INTO factura (pedido_id, fecha, total) 
                    VALUES
                        ( ?, NOW(), (SELECT SUM(producto.precio) FROM usuario JOIN pedido ON usuario.id = pedido.usuario_id JOIN pedido_producto ON pedido_producto.pedido_id = pedido.id JOIN producto ON pedido_producto.producto_id = producto.id WHERE pedido.id = ?) )
                    `,
                    [newIdOrder[lastIndex].id, newIdOrder[lastIndex].id]
                )
                console.log("Create, factura:  ",extra) // <- log para consola
            } catch (err) {
                console.error("Error en la creacion de la factura. Detalles: ", err.message)
            }

            const [insertInvoiceOrder] = await connection.query(
                `
                INSERT INTO factura_consulta
                SELECT 
                    usuario.id,
                    usuario.nombre, 
                    usuario.apellido, 
                    usuario.dni, 
                    pedido.id AS pedido_id, 
                    GROUP_CONCAT(producto.marca) AS productos,
                    factura.fecha,
                    factura.total
                    
                FROM factura
                JOIN pedido ON pedido.id = factura.pedido_id
                JOIN usuario ON usuario.id = pedido.usuario_id
                JOIN pedido_producto ON pedido_producto.pedido_id = pedido.id
                JOIN producto ON pedido_producto.producto_id = producto.id
                WHERE usuario.id = UUID_TO_BIN(?) AND pedido.id = ?
                GROUP BY pedido.id, factura.fecha, factura.total;
                `,
                [userId, newIdOrder[lastIndex].id]
            )
            
            
            console.log(insertInvoiceOrder)
            if (insertInvoiceOrder.affectedRows === 0 ) return false
            
            const [newInvoiceOrder] = await connection.query(
                `
                 SELECT 
                      bin_to_uuid(id),
                      nombre,
                      apellido,
                      dni,
                      pedido_id,
                      productos,
                      fecha,
                      total
                      
                 FROM factura_consulta
                 WHERE pedido_id = ?; 
                `,
                [newIdOrder[lastIndex].id]
            )

            return newInvoiceOrder

        } catch (err) {

            console.error("Ocurrio un problema al intentar crear un pedido. Detalles:  ", err.message)
            return false
        }
    }

    static async updateOrder({ input }) {
        try {
            
            const {
                nombre,
                apellido,
                dni
            } = input

        } catch (err) {

        }
    }

}