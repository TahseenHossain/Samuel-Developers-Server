const express = require("express");
const app = express();
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const port = process.env.PORT || 5000;
const { ObjectId } = require("mongodb");

//const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

//middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qb7mmsc.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    //await client.connect();

    const userCollection = client.db("samuelDevelopersDB").collection("user");
    const propertiesCollection = client.db("samuelDevelopersDB").collection("properties");
    const servicesCollection = client.db("samuelDevelopersDB").collection("services");
    const testimonialsCollection = client.db("samuelDevelopersDB").collection("testimonials");
    const workSheetCollection = client.db("samuelDevelopersDB").collection("workSheet");
    const payCollection = client.db("samuelDevelopersDB").collection("pay");

    app.post("/jwt", async (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1h",
      });
      res.send({ token });
    });

    app.get("/properties", async (req, res) => {
      const result = await propertiesCollection.find().toArray();
      res.send(result);
    });

    app.get("/services", async (req, res) => {
      const result = await servicesCollection.find().toArray();
      res.send(result);
    });

    app.get("/testimonials", async (req, res) => {
      const result = await testimonialsCollection.find().toArray();
      res.send(result);
    });

    app.get("/user", async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    });

    app.get("/user", async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    });

    app.get("/workSheet", async (req, res) => {
      const result = await workSheetCollection.find().toArray();
      res.send(result);
    });

    app.get("/pay", async (req, res) => {
      const result = await payCollection.find().toArray();
      res.send(result);
    });

    app.get("/pay/:email", async (req, res) => {
      const result = await payCollection.find().toArray();
      res.send(result);
    });
    
    app.post("/user", async (req, res) => {
      const user = req.body;
      const query = { email: user.email };
      const existingUser = await userCollection.findOne(query);
      if (existingUser) {
        return res.send({ message: "user already exists", insertedId: null });
      }
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    app.delete("/user/:id", async (req, res) => {
      const userId = req.params.id;
      const query = { _id: new ObjectId(userId) };
      const result = await userCollection.deleteOne(query);
      res.send(result);
    });

    app.patch('/user/role/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updateUser = req.body;
 
      const updateDoc = {
        $set: {
          role: updateUser.role,
        },
      };
    
      const result = await userCollection.updateOne(filter, updateDoc);
    });

    app.patch('/user/verified/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updateUser = req.body;
    
      const updateDoc = {
        $set: {
          verified: updateUser.verified,
        },
      };
    
      const result = await userCollection.updateOne(filter, updateDoc);
    });

    app.post('/workSheet', async(req, res) => {
      const newElements = req.body;
      const result = await workSheetCollection.insertOne(newElements);
      res.send(result);
  })


  app.post('/pay', async(req, res) => {
    const newElements = req.body;
    const result = await payCollection.insertOne(newElements);
    res.send(result);
})
    

    // Send a ping to confirm a successful connection
    //await client.db("admin").command({ ping: 1 });
    // console.log(
    //   "Pinged your deployment. You successfully connected to MongoDB!"
    // );
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Samuel Developers server is running");
});

app.listen(port, () => {
  console.log(`Samuel Developers is running on port: ${port}`);
});
