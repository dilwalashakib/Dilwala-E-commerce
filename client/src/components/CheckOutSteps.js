import React from "react";
import classes from "../Styles/CheckOutSteps.module.css";

function CheckOutSteps({step1, step2, step3, step4}) {
    return (
        <div className={classes.stepContainer}>
            <div className={step1 ? `${classes.active}` : ""}>Sign In</div>
            <div className={step2 ? `${classes.active}` : ""}>Shipping</div>
            <div className={step3 ? `${classes.active}` : ""}>Payment</div>
            <div className={step4 ? `${classes.active}` : ""}>Place Order</div>
        </div>
    )
}

export default CheckOutSteps;