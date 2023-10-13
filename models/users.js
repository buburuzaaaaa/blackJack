import bcrypt from "bcrypt";
import mongoose from "mongoose";
const { Schema } = mongoose;


const userSchema = new Schema({
    "name": {
        type: String,
        validate:{validator: (value)=>{return typeof value === "string"}},
        required: true,
        trim: true
    },
    "password": {
        type: String,
        validate:{validator: (value)=>{return typeof value === "string"}},
        required: true,
        trim: true
    },
    "email": {
        type: String,
        validate:{validator: (value)=>{return typeof value === "string"}},
        required: true,
        trim: true
    },
    "win":{
        type: Number,
        validate:{validator: (value)=>{return typeof value === "number"}},
        default: 0
    },
    "loss":{
        type: Number,
        validate:{validator: (value)=>{return typeof value === "number"}},
        default: 0
    },
}, {collection: "users"});

userSchema.methods.validPassword = function (password) {
  return bcrypt.compare(password, this.password);
};

const user = mongoose.model('user', userSchema);
export default user