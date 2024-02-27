import express from "express";
import { BrowseMenu } from "../models/browseMenu.js"; 
const router = express.Router();

router.post('/', async (req, res) => {
    try {
        if(
            !req.body.title || !req.body.description || !req.body.image || !req.body.path
        ){
            return res.status(400).send({ message: "Send all required fields"});
        }
        const newBrowseMenu = {
            title : req.body.title,
            description : req.body.description,
            image : req.body.image,
            path : req.body.path
        }
        const browseMenu = await BrowseMenu.create(newBrowseMenu);
        return res.status(201).send(browseMenu);
    } catch (error) {
        console.log(error);
        res.status(500).send({message: error.message});
    }
    });
    
    //route to get all books
    router.get('/',async (req,res) => {
        try {
            const browseMenu = await BrowseMenu.find({});
            return res.status(200).json({
                count:browseMenu.length,
                data:browseMenu
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({message: error.message});
        }
    })

    export default router;