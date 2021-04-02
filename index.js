const express = require('express')
const app = express()
const cors=require('cors');
const MongoClient = require('mongodb').MongoClient;
const bodyParser=require('body-parser');
const { ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5055;
app.use(cors());
app.use(bodyParser.json());
app.get('/', (req, res) => {
  res.send('Hello World!')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fob1y.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productCollection = client.db("bookShop").collection("products");
  const itemCollection = client.db("items").collection("item");
  // perform actions on the collection object
  console.log('database connected')
//   client.close();
    app.post('/addProduct',(req,res) => {
        const products=req.body;
         
        productCollection.insertOne(products)
        .then(result =>{
            console.log(result)
            res.send(result.insertedCount)
        })
    })
    app.get('/products',(req,res)=>{
        productCollection.find({})
        .toArray((err,documents)=>{
            res.send(documents)
        })
    })
    app.delete('/deleteProduct/:id',(req,res)=>{
        productCollection.deleteOne({_id:ObjectId(req.params.id)})
        .then(result=> console.log(result))
    })

    app.get('/getProduct/:id',(req,res)=>{
        productCollection.find({_id:ObjectId(req.params.id)})
        .toArray((err,documents)=>{
            res.send(documents)
        })
    })


    app.get(`/products/:id`, (req, res) => {
        const id = req.params.id
        productCollection.find({_id: ObjectId(id)})
            .toArray((err, items) => {
                res.send(items)
            })
    })

    app.post('/itemOrders', (req, res) => {
        itemCollection.insertOne(req.body)
        .then(result => console.log(result))
    })


    app.get('/getItemOrder', (req, res) => {
        const email = req.query.email;
        console.log(email)
        itemCollection.find({email: email})
            .toArray((err, items) => {
                res.send(items)
            })
    })

});


app.listen(process.env.PORT || port)