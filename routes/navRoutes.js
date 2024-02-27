import express from "express";
import { Nav } from "../models/navModel.js";
const router = express.Router();

router.post('/', async (req, res) => {
    try {
        if(
            !req.body.nav || !req.body.navId || !req.body.url
        ){
            return res.status(400).send({ message: "Send all required fields"});
        }
        const newNav = {
            nav : req.body.nav,
            navId : req.body.navId,
            url : req.body.url,
        }
        const nav = await Nav.create(newNav);
        return res.status(201).send(nav);
    } catch (error) {
        console.log(error);
        res.status(500).send({message: error.message});
    }
    });
    
    //route to get all books
    router.get('/',async (req,res) => {
        try {
            const nav = await Nav.find({});
            return res.status(200).json({
                count:nav.length,
                data:nav
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({message: error.message});
        }
    })

    export default router;