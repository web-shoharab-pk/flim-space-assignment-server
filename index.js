const express = require('express');
const app = express();
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();
const ObjectID = require('mongodb').ObjectID
const port = process.env.PORT || 5500;

app.use(express.json());
app.use(cors());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qkzne.mongodb.net/folder?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {

  const collection = client.db("FilmSpace").collection("products");
  const cart = client.db("FilmSpace").collection("cart");
  app.get('/', (req, res) => {
    res.send('Hello World!') 
  })

  app.post('/addProduct', (req, res) => {
    const product = req.body; 
    collection.insertOne(product)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  })

  app.get('/allProducts', (req, res) => {
    collection.find({})
      .toArray((err, products) => {
        res.send(products)
      })
  })

  app.get('/loadSinglePd/:id', (req, res) => { 
    collection.find({_id: ObjectID(req.params.id)})
    .toArray((err, singlePd) => {
      res.send(singlePd) 
    })
  })

  app.post('/productAddToCart', (req, res) => {
    const product = req.body;
    cart.insertOne(product)
    .then(result => { 
      res.send(result.insertedCount > 0)
    })
  })

  app.get('/cartProduct', (req, res) => {
    cart.find({})
    .toArray((err, products) => {
      res.send(products)
    })
  })

});




app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})