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
    "win/loss":{
        type: Number,
        validate:{validator: (value)=>{return typeof value === "number"}},
        default: 0
    }
}, {collection: "users"});

const user = mongoose.model('user', userSchema);
export default user