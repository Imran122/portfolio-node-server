const express = require('express')
const { MongoClient } = require('mongodb');
const app = express()
require('dotenv').config()
const cors = require('cors')
const port = process.env.PORT || 5000

//configure midleware cors
app.use(cors());
app.use(express.json());
//single data loading by objectId
const ObjectId = require('mongodb').ObjectId;
//connect to db
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uvy8c.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



async function run() {
    try {
        await client.connect();
        const database = client.db('portfolioDb');
        const projectCollection = database.collection('portfolioProject');
        //colection for insert place order data

        //GET APi to get data 
        app.get('/projects', async (req, res) => {
            const cursor = projectCollection.find({});
            const projects = await cursor.toArray();
            res.send(projects)
        });
        //API for single data load
        app.get('/projects/:id', async (req, res) => {
            const id = req.params.id;

            const query = { _id: ObjectId(id) };

            const project = await projectCollection.findOne(query);
            res.json(project);
        });





        console.log('db connected');
    } finally {

        //await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
