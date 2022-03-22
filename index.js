const express = require('express')
const res = require('express/lib/response')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
app.use(methodOverride('_method'))
app.use(express.static('public'));


const Product = require('./models/product')
const { redirect } = require('express/lib/response')

mongoose.connect('mongodb://127.0.0.1:27017/farm5', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!")
        console.log(err)
    })




app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }));


app.listen(3000, ()=>{
    console.log("APP is listening on port 3000")
})

//new
app.get("/products/new", (req, res)=>{
    //const product = new Product.find()
    res.render("products/new")
})

//create post
app.post("/products", async (req, res)=>{
    const product = new Product(req.body)
    await product.save()
    res.redirect(`/products/${product._id}`)

})

//show
app.get("/products/:id", async (req, res)=>{
    const {id} = req.params
    const product = await Product.findById(id)
   //res.send(`show ${product}`)
    res.render("products/show" , {product})
})


//update- get
app.get("/products/:id/update", async (req, res)=>{
    const {id} = req.params
    const product = await Product.findById(id)
   //res.send(`update ${product}`)
    res.render("products/update", {product})
})

//update- put
app.put("/products/:id", async (req, res)=>{
    const {id} = req.params
    const product = await Product.findByIdAndUpdate(id, req.body)
    res.redirect(`/products/${product.id}`)
    //res.send(`update and show ${product}`)

    //res.render("products/new")
})

//delete
app.delete("/products/:id", async(req, res)=>{
    const {id} = req.params
    const product = await Product.findByIdAndDelete(id)
    res.redirect("/products")
   

})

//products
app.get("/products", async(req, res)=>{
    const products = await Product.find({})
    res.render("products/index", {products})

})
