const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.unwiq.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const widDemoCollection = client.db("widDemo").collection("studentoDemo");

    // Auth api

    app.get("/students", async (req, res) => {
      const query = {};
      const cursor = widDemoCollection.find(query);
      const students = await cursor.toArray();
      res.send(students);
    });

    app.post("/students", async (req, res) => {
      const data = req.body;
      const result = await widDemoCollection.insertOne(data);
      res.send(result);
    });

    app.put("/students/:uid", async (req, res) => {
      const uid = req.params.uid;
      const filter = { _id: ObjectId(uid) };
      const updateDoc = {
        $set: {
          name: req.body.name,
          stdClass: req.body.stdClass,
          score: req.body.score,
        },
      };
      const result = await widDemoCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    app.delete("/students/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await widDemoCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello From Toolmarket");
});

app.listen(port, () => {
  console.log(`Wid Demo app listening on port ${port}`);
});
