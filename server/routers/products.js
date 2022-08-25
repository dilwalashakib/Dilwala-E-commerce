const router = require("express").Router();
const { getProductBySlug, getProductById, getAllProduct, getByCategory, getBySearch } = require("../controllers/productController.js");

router.get('/category', getByCategory);

router.get("/search", getBySearch)

router.get("/", getAllProduct);

router.get("/slug/:slugname", getProductBySlug);

router.get("/:id", getProductById);




module.exports = router;