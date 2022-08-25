import React, { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import CheckBox from "../components/CheckBox";
import CheckOutSteps from "../components/CheckOutSteps";
import { Store } from "../Store";
import classes from "../Styles/Payment.module.css";

function Payment() {
    const navigate = useNavigate();
    const {state: ctxState, dispatch: ctxDispatch} = useContext(Store);
    const {shippingAddress, paymentMethod} = ctxState.cart;
    
    const [paymentMethodName, setPaymentMethodName] = useState(paymentMethod || "PayPal");
    const changeHandler = (e) => {
        setPaymentMethodName(e.target.id);        
    }
    const submitHandler = (e) => {
        e.preventDefault();
        ctxDispatch({type: "SAVE_PAYMENT_METHOD", payload: paymentMethodName});
        localStorage.setItem("paymentMethod", paymentMethodName);
        navigate('/placeorder');
    }
    useEffect(() => {
        if(!shippingAddress.address) {
            navigate('/shipping');
        }
    }, [shippingAddress, navigate]);
    return (
        <div className={classes.paymentContainer}>
            <Helmet>
                <title>Payment Method</title>
            </Helmet>
            <CheckOutSteps step1 step2 step3 />
            <form onSubmit={submitHandler} className={classes.formContainer}>
                <CheckBox checked={paymentMethodName === "PayPal"} fn={changeHandler} type="checkbox" text="PayPal" id="PayPal" />
                <CheckBox checked={paymentMethodName === "Stripe"} fn={changeHandler} type="checkbox" text="Stripe" id="Stripe" />
                <button className={classes.btn}>Continue</button>
            </form>
        </div>
    )
}

export default Payment;