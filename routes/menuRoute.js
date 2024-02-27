import express from "express";
import { Menu } from "../models/menu.js";
const router = express.Router();

// router.post('/', async (req, res) => {
//     try {
//         if(
//             !req.body.title || !req.body.description || !req.body.type || !req.body.cuisine || !req.body.ingredients || !req.body.price_in_rupees
//         ){
//             return res.status(400).send({ message: "Send all required fields"});
//         }
//         const newMenu = {
//             title : req.body.title,
//             type : req.body.type,
//             cuisine : req.body.cuisine,
//             description : req.body.description,
//             ingredients : req.body.ingredients,
//             calorie_count : req.body.calorie_count,
//             price_in_rupees : req.body.price_in_rupees,
//             image : req.body.image,
//         }
//         const menu = await Menu.create(newMenu);
//         return res.status(201).send(menu);
//     } catch (error) {
//         console.log(error);
//         res.status(500).send({message: error.message});
//     }
//     });

router.post('/', async (req, res) => {
    try {
        if (!Array.isArray(req.body) || req.body.length === 0) {
            return res.status(400).send({ message: 'Send a non-empty array of menu items' });
        }
        const missingFields = req.body.some((menuItem) => (
            !menuItem.title ||
            !menuItem.type ||
            !menuItem.cuisine ||
            !menuItem.description ||
            !menuItem.ingredients ||
            !menuItem.price_in_rupees
        ));

        if (missingFields) {
            return res.status(400).send({ message: 'Send all required fields in each menu item' });
        }

        const newMenus = req.body.map((menuItem) => ({
            title: menuItem.title,
            type: menuItem.type,
            cuisine: menuItem.cuisine,
            description: menuItem.description,
            ingredients: menuItem.ingredients,
            calorie_count: menuItem.calorie_count,
            price_in_rupees: menuItem.price_in_rupees,
            image: menuItem.image,
        }));

        const createdMenus = await Menu.insertMany(newMenus);

        return res.status(201).send(createdMenus);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: error.message });
    }
});

    //route to get all books
    router.get('/',async (req,res) => {
        try {
            const menu = await Menu.find({});
            return res.status(200).json({
                count:menu.length,
                data:menu
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({message: error.message});
        }
    });

    router.get('/:foodType', async (req, res) => {
        try {
            const { foodType } = req.params;
    
            let menu;
            if (foodType) {
                // Filter menu items by the specified food type
                menu = await Menu.find({ type: foodType });
            } else {
                return res.status(400).json({ message: 'Food type parameter is missing' });
            }
    
            return res.status(200).json({
                count: menu.length,
                data: menu
            });
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: error.message });
        }
    });
    
    

    export default router;