const express = require('express');
const cors = require('cors');
const app = express()
require('dotenv').config()

const port = process.env.PORT || 5001
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// middleware 
app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nb52s.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const movieCollection = client.db('movieDB').collection('movie')

    app.post('/movie', async(req, res)=>{
        const newMovie = req.body
        console.log(newMovie)
        const result = await movieCollection.insertOne(newMovie)
        res.send(result)
    })


    app.get('/movie', async(req, res)=>{
        const cursor = movieCollection.find().sort({ rating: -1 }).limit(6)
        const result = await cursor.toArray();
        res.send(result)
    })

    app.get('/movie/:id', async(req, res)=>{
        const id = req.params.id
        const query = { _id: new ObjectId(id)}
        const result = await movieCollection.findOne(query)
        res.send(result)
    })










    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res)=>{
    res.send('Movies server is running')
})

app.listen(port, ()=>{
    console.log(`Movie server is running on port: ${port}`)
})