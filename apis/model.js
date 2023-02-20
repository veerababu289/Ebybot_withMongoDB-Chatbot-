
const mongoose = require('mongoose')

const Items = mongoose.Schema({
    id:{
        type:String,
        required:true
       },
   item:{
        type:String,
        required:true
       },   
   cost:{
         type:String,
         required:true
        },
   availability:{
         type:Object
         },
   image:{
         type:String
         }
})

module.exports = mongoose.model('Items',Items);