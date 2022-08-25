import React, { useContext } from "react";
import { Store } from "../Store";
import classes from "../Styles/Cart.module.css";
import {Helmet} from "react-helmet-async";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
import Layout from "../components/Layout";

function Cart() {
    const navigate = useNavigate();
    const {state, dispatch:ctxDispatch} = useContext(Store);
    const {cartItems} = state.cart;
    const length = cartItems.length !== 0;
    const updateCartHandler = async(items, quantity) => {
        const {data} = await axios.get(`/api/product/${items._id}`);
        if(data.countInStock < quantity) {
            window.alert("Product Not Available !!!");
            return;
        } else {
            ctxDispatch({type: "ADD_CART_ITEM", payload: {...items, quantity}});
        }
    }
    const removeHandler = (items) => {
        ctxDispatch({type: "REMOVE_ITEM", payload: {...items}});
    }
    const checkOutHandler = () => {
        navigate("/signin?redirect=/shipping");
    }
    return (
        <Layout>
            <div className={classes.cartContainer}>
            <Helmet>
                <title>Shopping Cart</title>
            </Helmet>
            <h2>Shopping Cart</h2>
            {length ? (<div className={classes.itemsContainer}>
                <div className={classes.cart}>
                {cartItems.map((items) => (
                    <div key={items._id} className={classes.innerCart}>
                        <div className={classes.imageArea}>
                            <img src={items.image} alt=
                            {items.name} />
                            <Link to={`/products/${items.slug}`}>{items.name}</Link>
                        </div>
                        <div className={classes.plusMinus}>
                            {items.quantity === 1 ? " " : <i onClick={() => updateCartHandler(items, items.quantity - 1)} className="fas fa-minus-circle"></i>}
                            <span style={{fontSize: "1.3rem"}}>{items.quantity}</span>
                            {items.quantity === items.countInStock ? " " : <i onClick={() => updateCartHandler(items, items.quantity + 1)} className="fas fa-plus-circle"></i>}
                        </div>
                        <div className={classes.lastArea}>
                            <p>${items.price}</p>
                            <p>
                                <i onClick={() => removeHandler(items)} className="fas fa-remove"></i>
                            </p>
                        </div>
                    </div>))} </div>

                <div className={classes.totalContainer}>
                    <h3>
                        Subtotal ( {cartItems.reduce((acc, value) => acc + value.quantity, 0)} {" "} Items ) : ${
                            cartItems.reduce((acc, val) => acc + val.price * val.quantity, 0)
                        }
                    </h3>
                    {cartItems.length > 0 ? <div className={classes.btn}>
                        <button onClick={checkOutHandler}>proceed to checkout</button>
                    </div> : ""}
                </div>
            </div>) : (<div>
                <h2>Cart Is Empty!!</h2>
                <Link to="/">Go Product Page</Link>
            </div>)}
            </div>
        </Layout>
    )
}

export default Cart;