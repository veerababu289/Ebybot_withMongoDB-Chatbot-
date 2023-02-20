
const mongoose = require('mongoose')

const Authdata = mongoose.Schema({
    name:{
        type:String,
        required:true
       },
    email:{
        type:String,
        required:true
       },
   password:{
        type:String,
        required:true
       },
   cart:[{
         type:Object
        }
    ],
    order:[{
        type:Object
       }]
 
})

module.exports = mongoose.model('Authdata',Authdata);