const mongoose = require('mongoose');
const plm = require("passport-local-mongoose");
mongoose.connect(process.env.DATABASE_URL);

const userSchema = mongoose.Schema({
    username:String,
    email:String,
    contact:Number,
    name:String,
    password:String,
    profileimage:String,
    boards:{
        type:Array,
        default:[]
    },
    posts:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"post"
        }
    ]
});

userSchema.plugin(plm);

module.exports = mongoose.model("user",userSchema);
