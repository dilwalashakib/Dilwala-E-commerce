import React from "react";
import classes from "../Styles/Input.module.css";

function Input({value, fn, text, type, placeholder, id}) {
    return (
        <div className={classes.inputGroup}>
            <label htmlFor={id}>{text}</label>
            <input onChange={fn} value={value} type={type} placeholder={placeholder} id={id} />
        </div>
        
    )
}

export default Input;