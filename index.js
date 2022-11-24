const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();

//midlleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.x4kttba.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run(){
        try{
            const categorieName = client.db('car_corner').collection('categorie_name');
            app.get('/categorieName', async(req, res)=>{
                const query ={};
                const options = await categorieName.find(query).toArray();
                res.send(options);
            });

            const advertisementItemsCollection = client.db('car_corner').collection('/advertisementItems');
            app.get('/advertisementItems', async(req, res)=>{
                const query ={};
                const options = await advertisementItemsCollection.find(query).toArray();
                res.send(options);
            });

            const allCategories = client.db('car_corner').collection('all_categories');
            app.get('/allCategories/:id', async(req,res)=>{
                const id = req.params.id;
                const query ={ctegorieId:id};
                console.log(query);
                const result = await allCategories.find(query).toArray();
                res.send(result);
            })
        }
        finally{

        }
}
run().catch(console.log())



app.get('/' ,async(req, res)=>{
    res.send('car server is running')
});

app.listen(port, ()=> console.log(`server runing on ${port}`));