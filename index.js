const express = require('express');
const app = express();
const cors = require('cors')
const { MongoClient } = require('mongodb');
const port = process.env.PORT || 5000;
const ObjectId = require('mongodb').ObjectId;

app.use(cors())
app.use(express.json())

// GduCA2gn4SCy18Jt
const uri = "mongodb+srv://products:1LiOQ39dnSsr0hpj@cluster0.eyncv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.get("/", (req, res) =>{
    res.send("Welcome to server site.")
})

async function run(){
    try{
    await client.connect()
    const db = client.db("businessProducts")
    const col = db.collection('products')
   
    app.post('/addProduct',async(req, res)=>{
        const products = req.body.body
        const result = await col.insertOne(products)
        res.send(result)  
    })

    app.get('/products',async (req, res) => {
        const result = col.find({})
        const products = await result.toArray();
        res.send(products);
        
    })

    app.delete('/product/:id', async(req, res)=>{
        const params = req.params.id
        const id = ObjectId(params)
        const result = await col.deleteOne({_id: id})
        res.send(result)
    })

    app.get('/update/:id',async (req, res) =>{
        const params = req.params.id
        const id = ObjectId(params)
        const result = await col.findOne({_id: id})
        console.log(result);
        res.send(result)
        
    })

    app.put('/updateInfo/:id',async (req,res) =>{
        const params = req.params.id;
        const id = {_id: ObjectId(params)}
        const updatedInfo = req.body.body
        const updateDoc = {
            $set: {
              name: updatedInfo.name,
              price: updatedInfo.price,
              category: updatedInfo.category
            },
          };
        const result =await col.updateOne(id, updateDoc)
        res.send(result)
        
    })
    
    
    }
    catch(err){console.log(err)
        }
}
run()

app.listen(port)