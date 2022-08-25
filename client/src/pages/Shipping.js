import React, { useContext, useEffect, useState } from "react";
import Input from "../components/Input";
import Layout from "../components/Layout";
import classes from "../Styles/Shipping.module.css";
import {Helmet} from "react-helmet-async";
import { Store } from "../Store";
import { useNavigate } from "react-router-dom";
import CheckOutSteps from "../components/CheckOutSteps";
import {ToastContainer, toast} from 'react-toastify';

function Shipping() {
    const navigate = useNavigate();
    const {state:ctxState, dispatch: ctxDispatch} = useContext(Store);
    const {userInfo} = ctxState;
    const {shippingAddress} = ctxState.cart;
    const [state, setState] = useState({
        fullName: shippingAddress.fullName || '',
        address: shippingAddress.address || '',
        city: shippingAddress.city || '',
        postalCode: shippingAddress.postalCode || '',
        country: shippingAddress.country || ''
    });
    const {fullName, address, city, postalCode, country} = state;
    const handler = (e) => {
        setState({
            ...state,
            [e.target.id] : e.target.value
        });
    }
    const submitHandler = (e) => {
        e.preventDefault();

        if(fullName && address && city && postalCode && country) {
            ctxDispatch({type: "SAVE_SHIPPING_ADDRESS", payload: {fullName, address, city, postalCode, country}});

            localStorage.setItem("shippingAddress", JSON.stringify({fullName, address, city, postalCode, country}));

            navigate('/payment');
        } else {
            toast.error("Please Provide All Value");
        }
    }
    useEffect(() => {
        if(!userInfo) {
            navigate('/signin?redirect=/shipping');
        }
    }, [userInfo, navigate]);
    return (<Layout>
        
            <div className={classes.shipping}>
                <Helmet>
                    <title>Shipping Address</title>
                </Helmet>
                <CheckOutSteps step1 step2 />
                <ToastContainer position="bottom-center" limit={1} />
                <div className={classes.shippingContainer}>
                    <h1>Shipping Address</h1>
                    <form onSubmit={submitHandler}>
                        <Input value={fullName} fn={handler} id="fullName" text="Full Name" type='text' placeholder="Full Name" />

                        <Input value={address} fn={handler} id="address" text="Address" type="text" placeholder="Address" />

                        <Input value={city} fn={handler} id="city" text="City" type='text' placeholder="City" />

                        <Input value={postalCode} fn={handler} id="postalCode" text="Postal Code" type="number" placeholder="Postal Code" />

                        <Input value={country} fn={handler} id="country" text="Country" type='text' placeholder="Country" />
                        <button className={classes.btn} type="submit">Continue</button>
                    </form>
                </div>
                
            </div>
        </Layout>)
}

export default Shipping;