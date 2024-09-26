import { MongoClient, ServerApiVersion } from 'mongodb'
import dotenv from 'dotenv'

dotenv.config()

const uri = process.env.MONGODB_URI

const Client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
})

async function connection() {
  try {
    await Client.connect()
    await Client.db("admin").command({ ping: 1 })
    console.log("Pinged your deployment. You successfully connected to MongoDB!")
  } catch (error) {
    console.error("Connection failed", error)
  }
}

export { connection, Client }