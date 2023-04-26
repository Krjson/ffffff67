const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

async function connectToMongoDB() {
    try {
        const uri = process.env.MONGODB_URI;
        const client = new MongoClient(uri, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        });
        await client.connect();
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
        return uri;
    } catch (err) {
        console.error(err);
    }
}

module.exports = connectToMongoDB;
