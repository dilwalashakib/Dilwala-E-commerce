import React, { useContext, useEffect, useReducer } from "react";
import CheckOutSteps from "../components/CheckOutSteps";
import classes from "../Styles/PlaceOrder.module.css";
import {Helmet} from "react-helmet-async";
import { Store } from "../Store";
import {toast, ToastContainer} from "react-toastify";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
import Loading from "../components/Loading";

const reduce = (state, action) => {
    switch(action.type) {
        case "CREATE_REQUEST":
            return {...state, loading: true}
        case "SUCCESS":
            return {...state, loading: false}
        case "FAIL":
            return {...state, loading: false}
        default:
            return state
    }
}

function PlaceOrder() {
    const navigate = useNavigate();

    const [{loading}, dispatch] = useReducer(reduce, {
        loading: false
    })
    const {state: ctxState, dispatch: ctxDispatch} = useContext(Store);
    const {shippingAddress, paymentMethod, cartItems} = ctxState.cart;
    console.log(ctxState.cart.cartItems);
    const roundTwo = (num) => {
        return Math.round(num * 100 + Number.EPSILON) / 100;
    }
    ctxState.cart.itemsPrice = roundTwo(
        cartItems.reduce((acc, val) => acc + val.quantity * val.price, 0)
    )
    ctxState.cart.shippingPrice = ctxState.cart.itemsPrice > 100 ? roundTwo(0) : roundTwo(10);

    ctxState.cart.taxPrice = roundTwo(0.15 * ctxState.cart.itemsPrice);

    ctxState.cart.totalPrice = ctxState.cart.itemsPrice + ctxState.cart.shippingPrice + ctxState.cart.taxPrice;

    useEffect(() => {
        if(!paymentMethod) {
            navigate('/payment');
        }
    }, [navigate, paymentMethod]);
    const orderHandler = async () => {
        try {
            dispatch({type: "CREATE_REQUEST"});
            const {data} = await axios.post("/api/order/create", {
                orderItems: ctxState.cart.cartItems,
                shippingAddress: ctxState.cart.shippingAddress,
                paymentMethod: ctxState.cart.paymentMethod,
                itemsPrice: ctxState.cart.itemsPrice,
                shippingPrice: ctxState.cart.shippingPrice,
                taxPrice: ctxState.cart.taxPrice,
                totalPrice: ctxState.cart.totalPrice
            }, {
                headers: {
                    authorization: `Bearer ${ctxState.userInfo.token}`
                }
            });
            ctxDispatch({type: "CLEAR_CART"});
            dispatch({type: "SUCCESS"});
            localStorage.removeItem("cartItems");
            navigate('/');
            navigate(`/order/${data.data._id}`);
        } catch(err) {
            dispatch({type: "FAIL"});
            toast.error(err.message)
        }
    }
    return (
        <div className={classes.placeOrderContainer}>
            <CheckOutSteps step1 step2 step3 step4 />
            <Helmet>
                <title>Preview Order</title>
            </Helmet>
            <h1>Preview Order</h1>
            <div className={classes.innerContainer}>
                <div className={classes.orderLeft}>
                    <div className={classes.inner}>
                        <h2>Shipping</h2>
                        <p>
                            <strong>Name: </strong>
                            <span> {shippingAddress.fullName}</span>
                        </p>
                        <p>
                            <strong>Address: </strong>
                            <span>, {shippingAddress.postalCode}</span>
                            <span>, {shippingAddress.address}</span>
                            <span>, {shippingAddress.city}</span>
                            <span>, {shippingAddress.country}</span>
                        </p>
                        <Link to='/shipping'>Edit</Link>
                    </div>

                    <div className={classes.inner}>
                        <h2>Payment</h2>
                        <p>
                            <strong>Method: </strong>
                            <span> {paymentMethod}</span>
                        </p>
                        
                        <Link to='/payment'>Edit</Link>
                    </div>

                    <div className={classes.inner}>
                        <h2>Items</h2>
                        <div>
                            {cartItems.map((items) => (
                                <div key={items.slug} className={classes.itemsContainer}>
                                    <div className={classes.firstArea}>
                                        <img src={items.image} alt={items.name} />
                                        <p>
                                            <Link to={`/products/${items.slug}`}>{items.name}</Link>
                                        </p>
                                    </div>
                                    <div className={classes.middleArea}>
                                        <span>{items.quantity}</span>
                                    </div>
                                    <div className={classes.lastArea}>
                                        <p>${items.price}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Link to={`/cart`}>Edit</Link>
                        
                    </div>
                </div>
                <div className={classes.orderRight}>
                <ToastContainer limit={1} position="bottom-center" />
                    <div>
                        <div className={classes.item}>
                            <h1>Order Summery</h1>
                        </div>
                        <div className={classes.item}>
                            <span>items</span>
                            <span>${ctxState.cart.itemsPrice}</span>
                        </div>
                        <div className={classes.item}>
                            <span>Shipping</span>
                            <span>${ctxState.cart.shippingPrice}</span>
                        </div>
                        <div className={classes.item}>
                            <span>Tax</span>
                            <span>${ctxState.cart.taxPrice}</span>
                        </div>
                        <div className={classes.item}>
                            <span>Order Total</span>
                            <span>${ctxState.cart.totalPrice}</span>
                        </div>
                        <button onClick={orderHandler} className={classes.btn}>Process Order</button>

                        {loading && <Loading />}
                    </div>
                    
                </div>
            </div>
        </div>
    )
}

export default PlaceOrder;