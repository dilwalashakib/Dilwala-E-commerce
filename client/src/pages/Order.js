import React, { useContext, useEffect, useReducer } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {PayPalButtons, usePayPalScriptReducer} from "@paypal/react-paypal-js";
import classes from "../Styles/Order.module.css";
import Layout from "../components/Layout";
import Loading from "../components/Loading";
import { Store } from "../Store";
import axios from "axios";
import {Helmet} from "react-helmet-async";


const reduce = (state, action) => {
    switch(action.type) {
        case "REQUEST":
            return {...state, loading: true}
        case "SUCCESS":
            return {...state, loading: false, order: action.payload};
        case "ERROR":
            return {...state, loading: false, error: action.payload};
        default:
            return state;
    }
}

function Order() {
    const navigate = useNavigate();
    const {state: ctxState, dispatch: ctxDispatch} = useContext(Store);
    const {userInfo} = ctxState;
    const [state, dispatch] = useReducer(reduce, {
        loading: true,
        order: {},
        error: ""
    });
    const {loading, order, error} = state;
    const {id: orderId} = useParams();
    useEffect(() => {
        const fetchData = async() => {
            try {
                dispatch({type: "REQUEST"});
                const {data} = await axios.get(`/api/order/${orderId}`, {
                    headers: { authorization: `Bearer ${userInfo.token}`}
                });

                dispatch({type: "SUCCESS", payload: data});
            } catch(err) {
                dispatch({type: "ERROR", payload: err});
            }
        }
        if(!userInfo) {
            navigate('/signin');
        }
        if(!order._id || (order._id && order._id !== orderId)) {
            fetchData();
        }
    }, [userInfo, navigate, orderId, order._id]);
    return (
        <Layout>
            {loading ? <Loading /> : (
                <div className={classes.orderContainer}>
                    <Helmet>
                        <title>Order {orderId}</title>
                    </Helmet>
                    <h1>Order {orderId}</h1>
                    <div className={classes.innerContainer}>
                        <div className={classes.orderLeft}>
                            <div className={classes.inner}>
                                <h2>Shipping</h2>
                                <p>
                                    <strong>Name: </strong>
                                    <span> {order.shippingAddress.fullName}</span>
                                </p>
                                <p>
                                    <strong>Address: </strong>
                                    <span>{order.shippingAddress.postalCode}</span>
                                    <span>, {order.shippingAddress.address}</span>
                                    <span>, {order.shippingAddress.city}</span>
                                    <span>, {order.shippingAddress.country}</span>
                                </p>
                                <div className={classes.delivered}>
                                    {order.isDelivered ? <p>Delivered</p> : <p>Not Delivered</p>}
                                </div>
                            </div>

                            <div className={classes.inner}>
                                <h2>Payment</h2>
                                <p>
                                    <strong>Method: </strong>
                                    <span> {order.paymentMethod}</span>
                                </p>
                                <div className={classes.paid}>
                                    {order.isPaid ? <p>Paid</p> : <p>Not Paid</p>}
                                </div>
                            </div>

                            <div className={classes.inner}>
                                <h2>Items</h2>
                                <div>
                                    {order.orderItems.map((items) => (
                                        <div key={items.slug} className={classes.itemsContainer}>
                                            <div className={classes.firstArea}>
                                                <img src={items.image} alt={items.name} />
                                                <span>{items.name}</span>
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
                                
                            </div>
                        </div>
                        <div className={classes.orderRight}>
                            <div>
                                <div className={classes.item}>
                                    <h1>Order Summery</h1>
                                </div>
                                <div className={classes.item}>
                                    <span>items</span>
                                    <span>${order.itemsPrice}</span>
                                </div>
                                <div className={classes.item}>
                                    <span>Shipping</span>
                                    <span>${order.shippingPrice}</span>
                                </div>
                                <div className={classes.item}>
                                    <span>Tax</span>
                                    <span>${order.taxPrice}</span>
                                </div>
                                <div className={classes.item}>
                                    <span>Order Total</span>
                                    <span>${order.totalPrice}</span>
                                </div>
                            </div>
                            <PayPalButtons />
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    )
}

export default Order;