const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

require("dotenv").config();

app.use(cors());
app.use(express.json());

//mongoDB

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.8l4usvv.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const postsCollection = client.db("social-site").collection("social-post");
    const userCollection = client.db("social-site").collection("users");

    //sending post on DB
    app.post("/posts", async (req, res) => {
      const posts = req.body;
      const result = await postsCollection.insertOne(posts);
      res.send(result);
    });

    // app.post('/users', async(req,res) =>{
    //     const user = req.body;
    //     const result = await userCollection.insertOne(user);
    //     res.send(result)
    // })

    // app.delete('/users', async(req,res) =>{
    //     const result = userCollection.deleteMany({});
    //     res.send(result)
    //   })

    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = userCollection.insertOne(user);
      res.send(result);
    });

    app.get("/users", async (req, res) => {
      const query = {};
      const users = await userCollection.find(query).toArray();
      res.send(users);
    });

    //   app.get('/users/about/:email', async (req,res) =>{
    //     const email = req.params.email;
    //     console.log(email)
    //     const query ={email: email}
    //     const user = await userCollection.findOne(query);
    //     res.send(user)
    //   })

    // Rana update something here
    app.get("/usersQueryEmail/", async (req, res) => {
      const emailQuery = req.query.email;
      const query = { email: emailQuery };
      const user = await userCollection.find(query).toArray();
      console.log(user);
      res.send(user);
    });

    // Rana update something here
    app.put("/usersQueryEmail/", async (req, res) => {
      const emailQuery = req.query.email;
      const query = { email: emailQuery };
      const post = req.body;
      const option = { upsert: true };
      const updatedPost = {
        $set: {
          name: post.name,
          // not need the email
          university: post.university,
          address: post.address,
        },
      };
      const result = await userCollection.updateOne(query, updatedPost, option);
      res.send(result);
    });

    // app.get('/usersEmail', async (req,res) =>{
    //     const userEmail = req.query.email;
    //     console.log(userEmail)
    //     const query = {email: userEmail};
    //     const user = await userCollection.findOne(query);
    //     console.log(user)
    //     res.send(user)
    // })

    app.get("/users", async (req, res) => {
      const query = {};
      const result = await userCollection.find(query).toArray();
      res.send(result);
    });

    // app.get('/users/about/:email', async (req,res) =>{
    //     const emailId = req.query.email;
    //     const query = {email: emailId}
    //     const result = await userCollection.findOne(query)
    //     res.send(result)
    // })

    //getting posts from DB

    app.get("/posts", async (req, res) => {
      const posts = await postsCollection
        .find({}, { _id: 1 })
        .sort({ _id: 1 })
        .toArray();
      res.send(posts);
    });

    app.put("/posts/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const post = req.body;
      const option = { upsert: true };
      const updatedPost = {
        $set: {
          userName: post.userName,
          comment: post.comment,
          like: post.like,
        },
      };
      const result = await postsCollection.updateOne(
        filter,
        updatedPost,
        option
      );
      res.send(result);
    });

    // app.put('/users/',async (req,res) =>{
    //     const id = req.params.id;
    //     const filter = { _id: ObjectId(id)};
    //     const post = req.body;
    //     const option = {upsert:true}
    //     const updatedPost = {
    //         $set: {
    //             name: post.name,
    //             email:post.email,
    //             university:post.university,
    //             address: post.address
    //         }
    //     }
    //     const result = await userCollection.updateOne(filter,updatedPost,option);
    //     res.send(result)
    // })

    app.get("/trending", async (req, res) => {
      const trending = await postsCollection
        .find()
        .limit(3)
        .sort({ like: -1 })
        .toArray();
      res.send(trending);
    });

    app.get("/posts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const post = await postsCollection.findOne(query);
      res.send(post);
    });
  } catch {}
}
run().catch(error => console.log(error));

app.get("/", (req, res) => {
  res.send("Social Server Running");
});

app.listen(port, () => {
  console.log(`social server running on port ${port}`);
});
