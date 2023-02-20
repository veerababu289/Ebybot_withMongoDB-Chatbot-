const express = require('express')
const mongoose = require('mongoose')
const Items = require('./model')
const authdatas = require('./authmodel')
const app = express()
app.use(express.json())

mongoose.connect('mongodb+srv://veerababu:12345@cluster0.gwkcyhq.mongodb.net/?retryWrites=true&w=majority').then(
    () => console.log('db connected..')).catch(err => console.log(err))

app.post('/postitems', (req, res) => {

    try {
        data = req.body
        Items.insertMany(data, function (err, data) {
            if (err) {
                console.log(err)
            }
            else {
                res.json(data)
            }
        })
    }
    catch (err) {
        console.log(err)
    }
})

app.get('/getitems', async (req, res) => {
    try {
        var items = await Items.find()

        res.json(items)
    }
    catch (err) {
        console.log(err.message)
    }
})


app.post('/postauth', (req, res) => {

    try {
        data = req.body
        authdatas.insertMany(data, function (err, data) {
            if (err) {
                console.log(err)
            }
            else {
                res.json(data)
            }
        })
    }
    catch (err) {
        console.log(err)
    }
})

app.get('/getauth', async (req, res) => {
    try {
        var Authdata = await authdatas.find()

        res.json(Authdata)
    }
    catch (err) {
        console.log(err.message)
    }
})

app.put('/updatecart', async (req, res) => {
    try {

        await authdatas.updateOne(
            { email: req.body.email },
            {
                $addToSet: { cart: req.body.cart }
            }
        )
        res.json('cart updated')
    }
    catch (err) {
        console.log(err)
    }
})

app.put('/updateorders', async (req, res) => {
    try {

        await authdatas.updateOne(
            { email: req.body.email },
            {
                $addToSet: { order: req.body.cart }
            }
        )
        res.json('orders updated')
    }
    catch (err) {
        console.log(err)
    }
})


app.put('/deletecart', async (req, res) => {
    try {

        await authdatas.updateOne(
            { email: req.body.email },
            {
                $pull: { cart: { id: "itemsCard" } }
            }
        )
        res.json('cart delete')
    }
    catch (err) {
        console.log(err)
    }
})


app.put('/deleteoneincart', async (req, res) => {
    try {

        await authdatas.updateOne(
            { email: req.body.email },
            {
                $pull: { cart: { materialId: req.body.name } }
            }
        )
        res.json('one item deleted in cart')
    }
    catch (err) {
        console.log(err)
    }
})


app.put('/updatequantity', async (req, res) => {
    try {

        await authdatas.updateOne(
            { email: req.body.email,"cart.name":req.body.item },
            { $set: { "cart.$.quantity" : req.body.quantity } }
         )
        res.json('quantity upda')
    }
    catch (err) {
        console.log(err)
    }
})





app.listen(8080, () => console.log('server...'))

// db.survey.updateMany(
//     { },
//     { $pull: { results: { score: 8 , item: "B" } } }
//   )