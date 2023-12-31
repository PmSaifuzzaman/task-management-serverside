const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000

// middleware
app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ublbqgg.mongodb.net/?retryWrites=true&w=majority`;

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

        const tasksCollection = client.db("taskManagementDB").collection("tasks");


        // post api
        app.post("/tasks", async (req, res) => {
            const task = req.body;
            const result = await tasksCollection.insertOne(task);
            res.send(result);
        });
        // get all my tasks
        app.get("/myTasks/:email", async (req, res) => {
            const email = req.params.email;
            const result = await tasksCollection.find({ email:email }).toArray();
            res.send(result);
        });


        // todo status catagory api
        app.get("/toDo/:email", async (req, res) => {
            const email = req.params.email;

            const result = await tasksCollection.find({ email:email, status: "to-do" }).toArray();
            res.send(result);
        });
        // ongoing status category api
        app.get("/ongoing/:email", async (req, res) => {
            const email = req.params.email;

            const result = await tasksCollection.find({ email:email, status: "ongoing" }).toArray();
            res.send(result);
        });
        // completed status category api
        app.get("/completed/:email", async (req, res) => {
            const email = req.params.email;

            const result = await tasksCollection.find({ email:email, status: "completed" }).toArray();
            res.send(result);
        });


        // Delete from my tasks
        app.delete("/task/:id", async (req, res) => {
            const id = req.params.id;
            const result = await tasksCollection.deleteOne({ _id: new ObjectId(id) });
            res.send(result);
            });


        // Update food 
        app.put('/myTask/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updatedTask = req.body;
            const newUpdatedTask = {
                $set: {
                    title: updatedTask.title,
                    description: updatedTask.description,
                    deadline: updatedTask.deadline,
                    status: updatedTask.status,
                    priority: updatedTask.priority,
                    email: updatedTask.email,
                    
                }
            }
            const result = await tasksCollection.updateOne(filter, newUpdatedTask, options)
            res.send(result)
        })

        // GET one task
        app.get('/myTask/:id', async (req, res) => {
            const id = req.params.id;
            const result = await tasksCollection.findOne({ _id: new ObjectId(id) });
            res.send(result);
        });







        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();
        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Task management Server is Running')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})