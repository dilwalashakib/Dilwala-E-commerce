import React from "react";
import classes from "../Styles/CheckBox.module.css";

function CheckBox({type, text,id, checked, fn}) {
    return (
        <div className={classes.checkboxContainer}>
            <input checked={checked} onChange={fn} type={type} id={id} />
            <span className={classes.myInput}></span>
            <label checked={checked} onChange={fn} htmlFor={id}>{text}</label>
        </div>
    )
}

export default CheckBox;