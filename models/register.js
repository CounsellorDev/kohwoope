const mongoose = require("mongoose")
const {Schema} = mongoose


const userSchema = new Schema({
    // registration
    fullName:{
        type: String,
        required: true,
    },
    userName:{
        type: String,
        required: true,
        unique: true,
    },
    email:{
        type: String,
        required: true
    },
    phoneNumber:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true,
    }, 
    referralCode:{
        type: String,
        // required: false,
    },
    usertype: {
        type:String,
        default:'user'
        
    }
})
const User = mongoose.model('User', userSchema)
module.exports = User;