const Product = require("../models/productModel");
const PAGE_SIZE = 3;

const getBySearch = async(req, res) => {
    try {
        const {query} = req;
        const pageSize = query.pageSize || PAGE_SIZE;
        const page = query.page || 1;
        const category = query.category || "";
        const brand = query.brand || "";
        const price = query.price || "";
        const rating = query.rating || "";
        const order = query.order || "";
        const searchQuery = query.query || "";

        const queryFilter = searchQuery && searchQuery !== "all" ? {
            name : {
                $regex: searchQuery,
                $options: "i" // case insensitive
            }
        } : {};
        
        const categoryFilter = category && category !== "all" ? { category } : {}
        
        const ratingFilter = rating && rating !== "all" ? {
            rating: {
                $gte: Number(rating)
            }
        } : {};

        const priceFilter = price && price !== "all" ? {
            price: {
                $gte: Number(price.split("-")[0]),
                $lte: Number(price.split('-')[1])
            }
        } : {};

        const sortOrder =
        order === "featured" ? {featured: -1} :
        order === "lowest" ? {price: 1} : 
        order === 'highest' ? {price: -1} : 
        order === "toprated" ? {rating: -1} : 
        order === "newest" ? {createAt: -1} : 
        {_id : -1};
 
        const products = await Product.find({
            ...queryFilter,
            ...categoryFilter,
            ...priceFilter,          
            ...ratingFilter
        })
        .sort(sortOrder)
        .skip(pageSize * (page - 1))
        .limit(pageSize);

        const countProducts = await Product.countDocuments({
            ...queryFilter,
            ...categoryFilter,
            ...priceFilter,
            ...ratingFilter
        });
        res.send({
            products,
            countProducts,
            page,
            pages : Math.ceil(countProducts / pageSize)
        });    
    } catch(err) {
        res.status(500).json(err); 
    }
}

const getByCategory = async(req, res) => {
    try {
        const category = await Product.find().distinct('category');
        res.send(category);
    } catch(err) {
        res.status(500).json(err); 
    }
}

const getAllProduct = async(req, res) => {
    try {
        let data = await Product.find();
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json(err);
    }
}


const getProductBySlug = async(req, res) => {
    try {
        const {slugname} = req.params;
        const findData = await Product.findOne({slug: slugname});
        if(findData) {
            res.status(200).json(findData);
        } else {
            res.status(500).json({error: "NO DATA FOUND!!!"});
        }
    } catch(err) {
        res.status(500).json(err);
    }
}

const getProductById = async(req, res) => {
    try {
        let {id} = req.params;
        let data = await Product.findById(id);
        if(data) {
            res.status(200).json(data);
        } else {
            res.status(200).json({error: "No Data Found!!!"});
        }
    } catch(err) {
        res.status(500).json(err);
    }
}


module.exports = {
    getAllProduct,
    getProductBySlug,
    getProductById,
    getByCategory,
    getBySearch

}