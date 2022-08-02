const express = require("express");
const cors = require("cors");

require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;

const app = express();
const corsConfig = {
  origin: true,
  credentials: true,
};

app.use(cors(corsConfig));
app.use(express.json());
app.options("*", cors(corsConfig));

const uri = `mongodb+srv://${process.env.DATABASE_NAME}:${process.env.DATABASE_KEY}@cluster0.nusvb.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    await client.connect();
    const fruitCollection = client.db("freshFruit").collection("fruit");
    app.post("/fruits", async (req, res) => {
      const fruits = req.body;
      const result = await fruitCollection.insertOne(fruits);
      res.send(result);
    });
    app.get("/fruit/:email", async (req, res) => {
      const email = req.params.email;
      const filter = {email: email}
      const cursor = fruitCollection.find(filter);
      const fruits = await cursor.toArray();
      res.send(fruits);
    });
  } finally {
  }
};
run().catch(console.dir);
// testing localhost 5000
app.get("/", (req, res) => {
  res.send("hello world");
});
app.listen(port, () => {
  console.log("listening to port", port);
});
