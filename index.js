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

            const advertisementItemsCollection = client.db('car_corner').collection('advertisementItems');
            app.get('/advertisementItems', async(req, res)=>{
                const query ={};
                const options = await advertisementItemsCollection.find(query).toArray();
                res.send(options);
            });

            const allCategories = client.db('car_corner').collection('all_categories');
            app.get('/allCategories/:id', async(req,res)=>{
                const id = req.params.id;
                const query ={categorie_id:id};
                // console.log(query);
                const result = await allCategories.find(query).toArray();
                res.send(result);
            })
            app.get('/myProducts/:email', async(req,res)=>{
                const email = req.params.email;
                // console.log(email);
                const cursur ={SellerEmail: email};
                // console.log(cursur);
                const result = await allCategories.find(cursur).toArray();
                res.send(result);
            })

            // app.get("/allCategories", (req, res)=>{
            //     res.send(req.query);
            //   })

            app.post('/allCategories', async(req, res)=>{
                const product = req.body;
                console.log(product);
                const query = {
                    imgURL: product.imgURL,
                    Condition: product.Condition,
                    Number: product.Number,
                    Location: product.Location,
                    categorie_id: product.categorie_id,
                    Description: product.Description,
                    YearOfPurchase: product.YearOfPurchase,
                    CarName: product.CarName,
                    CarPrice: product.CarPrice,
                    SellerName: product.SellerName,
                    SellerEmail: product.SellerEmail,
                    date: product.date,
                }
                const result = await allCategories.insertOne(query);
                res.send(result)
            })

            const bookingCollection = client.db('car_corner').collection('bookingsCollection');
            app.post('/bookings', async(req, res)=>{
                const booking = req.body;
                console.log(booking);
                const query = {
                    CarName:booking.CarName,
                     CarPrice:booking.CarPrice,
                     Condition:booking.Condition,
                     BuyerEmail:booking.BuyerEmail,
                     BuyerName:booking.BuyerName,
                     BuyerPhone:booking.BuyerPhone,
                     Location:booking.Location,
                }
                const result = await bookingCollection.insertOne(query);
                res.send(result)
            })

            app.post('/advertisementItems', async(req, res)=>{
                const query ={};
                const options = await advertisementItemsCollection.find(query).toArray();
                res.send(options);
            });
        }
        finally{

        }
}
run().catch(console.log())



app.get('/' ,async(req, res)=>{
    res.send('car server is running')
});

app.listen(port, ()=> console.log(`server runing on ${port}`));