import React, { useContext, useEffect, useReducer } from "react";
import {Helmet} from "react-helmet-async";
import classes from "../Styles/Product.module.css";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import Rating from "../components/Rating";
import Loading from "../components/Loading";
import {Store} from "../Store";

const reducer = (state, action) => {
    switch(action.type) {
        case "FETCH_REQUEST":
            return {...state, loading: true};
        case "FETCH_SUCCESS":
            return {...state, product: action.payload, loading: false};
        case "FETCH_ERROR":
            return {...state, error: action.payload};
        default:
            return state;
    }
}
const initialValue = {
    product: [],
    loading: true,
    error: ""
}

function Product() {
    const navigate = useNavigate();
    let {slug} = useParams();
    const [{product, loading}, dispatch] = useReducer(reducer, initialValue);
    useEffect(() => {
        const fetchData = async() => {
            try {
                dispatch({type: "FETCH_REQUEST"});
                const {data} = await axios.get(`/api/product/slug/${slug}`);
                dispatch({type: "FETCH_SUCCESS", payload: data});
            } catch(err) {
                dispatch({type: "FETCH_ERROR", payload: err});
            }
        }
        fetchData();
    }, [slug]);
    const {state, dispatch: ctxDispatch} = useContext(Store);
    const {cart} = state;
    const addToCartHandler = async() => {
        const existItem = cart.cartItems.find((item) => item._id === product._id);
        const quantity = existItem ? existItem.quantity + 1 : 1;

        let {data} = await axios.get(`/api/product/${product._id}`);

        if(data.countInStock < quantity) {
            window.alert("Product Not Available");
            return;
        }
        ctxDispatch({type: "ADD_CART_ITEM", payload: {...product, quantity}});

        navigate("/cart");
    }

    return (
        <Layout>
            {loading ? <Loading /> : <div className={classes.productContainer}>
                <div className={classes.imgContainer}>
                    <img src={product.image} alt={product.name} />
                </div>
                <div className={classes.textContainer}>
                    <Helmet>
                        <title>{product.name}</title>
                    </Helmet>
                    <h1>{product.name}</h1>
                    <Rating rating={product.rating} reviews={product.numReviews} />
                    <span>${product.price}</span>
                    <p>{product.description}</p>
                </div>
                <div className={classes.cardContainer}>
                    <p><span>Price</span> ${product.price}</p>
                    {product.countInStock > 0 ? <p>Status <span style={{color: "green", fontWeight: "bold", fontSize: "1.1rem"}}>InStock</span></p> : <p>Status <span style={{color: "red", fontWeight: "bold", fontSize: "1.1rem"}}>Unavilable</span></p>}

                    <button onClick={addToCartHandler}>Add To Cart</button>
                </div>
            </div>}
        </Layout>
    )
    
}

export default Product;