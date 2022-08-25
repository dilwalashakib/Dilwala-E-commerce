import React, { useContext, useEffect, useState } from "react";
import Input from "../components/Input";
import classes from "../Styles/SignIn.module.css";
import {Helmet} from "react-helmet-async";
import { ToastContainer, toast } from 'react-toastify';
import {Link, useLocation, useNavigate} from "react-router-dom";
import axios from "axios";
import { Store } from "../Store";

function SignIn() {
    let navigate = useNavigate();
    let {search} = useLocation();
    let redirectUrl = new URLSearchParams(search).get("redirect");
    let redirect = redirectUrl ? redirectUrl : "/";

    const [value, setValue] = useState({email: "", password: ""});
    const {state, dispatch: ctxDispatch} = useContext(Store);
    const {userInfo} = state;
    console.log(userInfo);
    const changeHandler = (event) => {
        setValue({
            ...value,
            [event.target.id] : event.target.value
        })
    }
    const submitHandler = async(e) => {
        e.preventDefault();
        try {
            const {email, password} = value;
            if(email && password) {
                const { data } = await axios.post("/api/user/login", {
                    email,
                    password
                });
                ctxDispatch({type: "USER_SIGNIN", payload: data});
                localStorage.setItem("userInfo", JSON.stringify(data));
                navigate(redirect || '/');
            } else {
                toast.error("Invalid Email or Password");
            }
        } catch(err) {
            toast.error("Invalid Email or Password");
        }
    }
    useEffect(() => {
        if(userInfo) {
            navigate(redirect);
        }
    }, [navigate, userInfo, redirect]);
    const {email, password} = value;
    return (
        <form onSubmit={submitHandler} className={classes.form}>
            <ToastContainer position="bottom-center" limit={1} />
            <div className={classes.formContainer}>
                <div className={classes.formGroup}>
                    <h1 style={{textAlign: "center"}}>Sign In</h1>
                    <Helmet>
                        <title>Sign In</title>
                    </Helmet>
                    <Input value={email} fn={changeHandler} text="Email" type="email" placeholder="Email" id="email" />
                    <Input value={password} fn={changeHandler} text="Password" type="password" placeholder="Password" id="password" />
                    <button className={classes.btn} type="submit">Sign In</button>
                    <div className={classes.linkStyle}>
                        <span>New Customer? </span>
                        <Link to={`/signup?redirect=${redirect}`}>Create your account </Link>
                    </div>
                </div>
            </div>
        </form>
    )
}

export default SignIn;