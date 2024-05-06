import { MongoClient, ServerApiVersion } from 'mongodb';
import { randomUUID } from 'node:crypto'

const uri = "mongodb+srv://Vtoxic30:germancitoquerido@toxicblood.rsyvfsi.mongodb.net/?retryWrites=true&w=majority&appName=ToxicBlood";




// Crear un MongoClient con un objeto MongoClientOptions para establecer la versión Estable de la API
export const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});



async function run() {
  try {

    // Conectar el cliente al servidor (opcional a partir de v4.7)
    await client.connect();
    // Enviar un ping para confirmar una conexión exitosa
    await client.db("atlas_db").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

  } finally {
    // Asegura que el cliente se cerrará cuando termine/error
    await client.close();
  }
}
run().catch(console.dir);




export class ProductModel {

    static async getAll ({categoria}) {

        try {
            await client.connect()
            const collection = client.db('atlas_db').collection('products')

            let products;
            if (categoria) {
                products = await collection.find({categoria: categoria}).toArray()
            } else {
                products = await collection.find({}).toArray()
            }
            return products

        } catch (err) {
            console.error("Ocurrio un error al querer recuperar los datos:  ", err.message)

        } finally {
            await client.close()

        }
    }


    static async getById ({ id }) {
        
        try {

            await client.connect()
            const collection = client.db('atlas_db').collection('products')

            const product = await collection.findOne({ id: Number(id) })
            return product

        } catch (err) {
            console.error("Ocurrio un error al querer recuperar el producto:  ",err.message)

        } finally {
            
        }
    }


    static async createProduct ({ input }) {

        try {

            await client.connect()
            const collection = client.db('atlas_db').collection('products')
            
            const newProduct = {
                id : randomUUID(),          // <--  No es buena practica usar el spread operator, pero en este caso estamos validando antes
                ...input,                   //       los datos por lo que no dejara pasar campos que no hayan sido sanitizados
            }                        
                                
            const result = await collection.insertOne(newProduct)
            return result
                                
        } catch (err) {
            console.error("Ocurrio un error al intentar crear un nuevo producto:  ", err.message)

        } finally {
            await client.close()
        }
    }
    

    static async updateProduct ({ id, input }) {
        
        try {
            await client.connect()
            const collection = client.db('mongo_db').collection('products')
            
            console.log(typeof id)

            const result = await collection.updateOne(
                { id: id },
                {$set: input }
            )

            if (result.matchedCount === 0) return false
    
            const updateProduct = await collection.findOne({ id: id})
            return updateProduct
        } catch (err) {
            console.error(`Ocurrio un error al intentar actualizar el producto. Detalles: ${err}`)
        }
    }
  


    static async deleteProduct ({id}) {

        try {

            await client.connect()
            const collection = client.db('atlas_db').collection('products')
    
            const result = await collection.deleteOne({id : id})
            console.log(result)
            if ( result.deletedCount === 0 ) return false
            return true

        } catch (err) {
            console.error(`Ocurrio un problema al intentar borrar el producto. Detalles:  ${err.message}`)
        }

    }
}

await client.close()
