const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();

//midlleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.x4kttba.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
function jwtVerify(req, res, next){
    const authHeader = req.headers.authorization;
    if(!authHeader){
        return res.status(401).send('unauthorized access')
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN, function(err, decoded){
        if(err){
            return res.status(403).send({message: 'forbidden acces'})
        }
        req.decoded = decoded;
        next();
    })
}
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
            app.get('/myProducts/:email', jwtVerify, async(req,res)=>{
                const email = req.params.email;
                // console.log(email);
                const decodedEmail = req.decoded.email;
                if(email !== decodedEmail){
                    return res.status(403).send({message: 'forbidden access'})
                }
                const cursur = {SellerEmail: email};
                // console.log(cursur);
                const result = await allCategories.find(cursur).toArray();
                res.send(result);
            })

            app.get('/mybookings/:email', jwtVerify, async(req,res)=>{
                const email = req.params.email;
                // console.log(email);
                const decodedEmail = req.decoded.email;
                if(email !== decodedEmail){
                    return res.status(403).send({message: 'forbidden access'})
                }
                const cursur = {BuyerEmail: email};
                // console.log(cursur);
                const result = await bookingCollection.find(cursur).toArray();
                res.send(result);
            })

            
            app.get('/advertisment', async(req, res)=>{
                const query ={ ADstatus: "Advertised"};
                // console.log(query);
                const options = await allCategories.find(query).toArray();
                res.send(options);
            });

            // app.get('/mybookings/:email', async(req, res)=>{
            //     const email = req.params.email;
            //     const query = {email: email};
            //     const result = await usersCollection.findOne(query);
            //     res.send({isAdmin: result?.role === 'Admin'})
            // })
            app.get('/users/admin/:email', async(req, res)=>{
                const email = req.params.email;
                const query = {email: email};
                const result = await usersCollection.findOne(query);
                res.send({isAdmin: result?.role === 'Admin'})
            })
            app.get('/users/seller/:email', async(req, res)=>{
                const email = req.params.email;
                const query = {email: email};
                const result = await usersCollection.findOne(query);
                res.send({isSeller: result?.role === 'Seller'})
            })
            app.get('/users/buyer/:email', async(req, res)=>{
                const email = req.params.email;
                const query = {email: email};
                const result = await usersCollection.findOne(query);
                res.send({isBuyer: result?.role === 'Buyer'})
            })

            app.get('/allusers', async(req,res)=>{
                const query = { role: "Buyer"}
                const result = await usersCollection.find(query).toArray();
                res.send(result)
            })

            app.get('/allsellers', async(req,res)=>{
                const query = { role: "Seller"}
                const result = await usersCollection.find(query).toArray();
                res.send(result)
            })

            // app.get("/allCategories", (req, res)=>{
            //     res.send(req.query);
            //   })

            const usersCollection = client.db('car_corner').collection('users');
            app.post('/users', async(req, res)=>{
                const user = req.body;
                const result = await usersCollection.insertOne(user)
            });

            // jwt

            app.get('/jwt', async(req, res)=>{
                const email = req.query.email;
                const query = { email: email};
                console.log(query);
                const result = await usersCollection.findOne(query);
                if(result){
                    const token = jwt.sign({email}, process.env.ACCESS_TOKEN, {expiresIn: '7d'});
                    return res.send({accessToken: token})
                }
                res.status(403).send({accessToken: 'not found'})
            })

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
                    imgURL:booking.imgURL,
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

           


            app.put('/allCategories/advertisment/:id', async(req, res)=>{
                const id = req.params.id;
                console.log(id);
                const filter = {_id: ObjectId(id)};
                const option = { upsert: true};
                const updatedDoc = {
                    $set: {
                        ADstatus: 'Advertised'
                    }
                }
                const result = await allCategories.updateOne(filter, updatedDoc, option);
                res.send(result);
            })

            // make verify
            app.put('/allCategories/makeverify/:email', async(req, res)=>{
                const email = req.params.email;
                console.log(email);
                const filter = {SellerEmail: email};
                const option = { upsert: true};
                const updatedDoc = {
                    $set: {
                        Verifystatus: 'Verify'
                    }
                }
                const user = await allCategories.findOne(filter)
                if(!user){
                    return res.status(404).send({message: 'seller dont have any product'})
                }
                else{
                    const result = await allCategories.updateMany(filter, updatedDoc, option);
                    return res.send(result)
                }
                
            })

             // delete product
            app.delete('/allCategories/delete/:id', jwtVerify, async (req, res) => {
                const id = req.params.id;
                console.log(id);
                const filter = { _id: ObjectId(id) };
                const result = await allCategories.deleteOne(filter);
                res.send(result);
            })

            // delete user
            app.delete('/users/deleteUsers/:email', jwtVerify, async (req, res) => {
                const email = req.params.email;
                const filter = { email: email };
                const result = await usersCollection.deleteOne(filter);
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