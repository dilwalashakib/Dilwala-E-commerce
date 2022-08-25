const Order = require("../models/orderModel");
const isVerify = require("../utils/verify");

const router = require("express").Router();

router.get("/all", isVerify, async(req, res) => {
    try {
        const data = await Order.find({user: req.user.id});
        res.status(200).json(data);
    } catch(err) {
        res.status(500).json({error: err.message});
    }
})

router.post('/create', isVerify, async(req, res) => {
    try {
        const {orderItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, taxPrice, totalPrice} = req.body;
        const order = new Order({
            orderItems: orderItems.map((val) => ({...val, product: val._id})),
            shippingAddress,
            paymentMethod,
            itemsPrice,
            shippingPrice,
            taxPrice,
            totalPrice,
            user: req.user.id
        });
        const data = await order.save();
        res.status(201).json({message: "Successfully Created", data});
    } catch(err) {
        res.status(500).json(err.message);
    }
});

router.get("/:id", async(req, res) => {
    try {
        const {id} = req.params;
        const data = await Order.findById(id);
        if(data) {
            res.status(200).json(data);
        } else {
            res.status(500).json({message: "Data Not Found"});
        }
    } catch(err) {
        res.status(500).json({error: err.message});
    }
});


module.exports = router;