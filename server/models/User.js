const mongoose = require("mongoose");


const Schema = mongoose.Schema;
const UserSchema = new Schema({
    username:{
        type:String,
        required: true,
        //ensures uniquenesss of the username
        unique: true
    },
    password:{
        type:String,
        required: true
    }
});



const User = mongoose.model('User',UserSchema);


module.exports = User;