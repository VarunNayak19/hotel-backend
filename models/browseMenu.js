import mongoose from "mongoose"
var Schema = mongoose.Schema;
const browseMenuSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    image:{
        type: String,
        required: true
    },
    path:{
        type: String,
        required: true
    }
},
{
    timestamps: true,
}
);


export const BrowseMenu = mongoose.model('browseMenu',browseMenuSchema);