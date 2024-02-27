import mongoose from "mongoose"
var Schema = mongoose.Schema;
const navSchema = new Schema({
    navId:{
        type: Number,
        required: true
    },
    nav:{
        type: String,
        required: true
    },
    url:{
        type: String,
        required: true
    },
},
{
    timestamps: true,
}
);


export const Nav = mongoose.model('nav',navSchema);