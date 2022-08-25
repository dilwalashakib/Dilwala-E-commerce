import React, { useContext, useEffect, useReducer } from "react";
import Loading from "../components/Loading";
import {useNavigate} from "react-router-dom";
import { Store } from "../Store";
import axios from "axios";
import {Helmet} from "react-helmet-async";
import classes from "../Styles/OrderHistory.module.css";

const reducer = (state, action) => {
    switch(action.type) {
        case "REQUEST":
            return {...state, loading: true};
        case "SUCCESS":
            return {...state, order: action.payload, loading: false};
        case "ERROR":
            return {...state, error: action.payload, loading : false };
        default:
            return state;
    }
}

function OrderHistory() {
    const navigate = useNavigate();
    const {state:ctxState, dispatch:ctxDispatch} = useContext(Store);
    const {userInfo} = ctxState;
    const [{loading, order, error}, dispatch] = useReducer(reducer, {
        loading: true,
        error: '',
        order: {},
    });
    useEffect(() => {
        if(!userInfo) {
            navigate("/signin");
        }
        const fetchData = async() => {
            try{
                dispatch({type: "REQUEST"});
                const {data} = await axios.get(`/api/order/all`, {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`
                    }
                });
                console.log(data);
                dispatch({type: "SUCCESS", payload: data});
            } catch(err) {
                dispatch({type: "ERROR", payload: err});
            }
        }
        fetchData();
    }, [navigate, userInfo]);
    
    return (
        <div className={classes.orderHistoryContainer}>
            {loading ? <Loading /> : (
                <div>
                    <Helmet>
                        <title>Order History</title>
                    </Helmet>
                    <h1>Order History</h1>
                    <table className={classes.table}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>DATE</th>
                                <th>TOTAL</th>
                                <th>PAID</th>
                                <th>DELIVERED</th>
                                <th>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.map((items) => (
                                <tr key={items._id}>
                                    <td>{items._id}</td>
                                    <td>{items.createAt}</td>
                                    <td>{items.totalPrice.toFixed(2)}</td>
                                    <td>{items.isPaid ? items.paidAt.substring(0, 10) : "No"}</td>
                                    <td>{items.isDelivered ? items.deliveredAt.substring(0, 10) : "No"}</td>
                                    <td>
                                        <button onClick={() => navigate(`/order/${items._id}`)}>Details</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

export default OrderHistory;