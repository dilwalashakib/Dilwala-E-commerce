import React from "react";
import { Link } from "react-router-dom";
import Rating from "../components/Rating";
import Loading from "../components/Loading";
import classes from "../Styles/Products.module.css";
import { Store } from "../Store";
import { useContext } from "react";
import axios from "axios";

function ProductsPage({products, loading, heading}) {
    const {state:ctxState, dispatch:ctxDispatch} = useContext(Store);
    const {cartItems} = ctxState.cart;

    const addToCartButton = (product) => {
        const currentProduct = cartItems.find((item) => item._id === product._id);
        let quantity = currentProduct ? currentProduct.quantity : 0;
        
        return product.countInStock === 0 || product.countInStock <= quantity;
    }

    const addToCartHandler = async(value) => {
        const existItem = cartItems.find((item) => item._id === value._id);
        const quantity = existItem ? existItem.quantity + 1 : 1;
        let {data} = await axios.get(`/api/product/${value._id}`);
        if(data.countInStock < quantity) {
            window.alert("Product Not Available");
            return;
        } else {
            ctxDispatch({type: "ADD_CART_ITEM", payload: {...value, quantity}});
        }
    }
    
    return(
        <div className={classes.productContainer}>
            <h1>{heading}</h1>
            {loading ? <Loading /> : <div className={classes.products}>
                {products.map((product) => (<div className={classes.product} key={product._id}>
                <Link to={`/products/${product.slug}`}>
                    <img src={product.image} alt={product.name} />
                </Link>
                <div className={classes.productInfo}>
                    <Link to={`/products/${product.slug}`}>
                        <p>{product.name}</p>
                    </Link>
                    <p><b>${product.price}</b></p>
                    <Rating rating={product.rating} reviews={product.numReviews} />
                    
                    { addToCartButton(product) ? <button className={classes.disable}>Out Of Stock</button> : <button onClick={() => addToCartHandler(product)}>Add To Cart</button>}
                </div>
            </div>))}
        </div>}
        </div>
    )
}

export default ProductsPage;