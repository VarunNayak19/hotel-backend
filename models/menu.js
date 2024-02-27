import mongoose from "mongoose"
var Schema = mongoose.Schema;
const menuSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    type:{
        type: String,
        required: true
    },
    cuisine:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    ingredients:{
        type: Array,
        required: true
    },
    calorie_count:{
        type: Number,
        required: false
    },
    price_in_rupees:{
        type: Number,
        required: true
    },
    image:{
        type: String,
        required: false
    },
},
{
    timestamps: true,
}
);


export const Menu = mongoose.model('menu',menuSchema);