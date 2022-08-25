import React, { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import Input from "../components/Input";
import classes from "../Styles/SignIn.module.css";
import { Store } from "../Store";

function SignUp() {
    const {state: ctxState, dispatch: ctxDispatch} = useContext(Store);
    const {userInfo} = ctxState;
    const navigate = useNavigate();
    const {search} = useLocation();
    const UrlParse = new URLSearchParams(search).get('redirect');
    const redirect = UrlParse ? UrlParse : '/';
    const [state, setState] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    })
    const {name, email, password, confirmPassword} = state;
    const changeHandler = (e) => {
        setState({
            ...state,
            [e.target.id]: e.target.value
        })
    }
    const submitHandler = async(e) => {
        e.preventDefault();
        if(password !== confirmPassword) {
            toast.error("Password Doesn't Match");
            return;
        }
        try {
            if(name && email && password && confirmPassword) {
                const {data} = await axios.post(`/api/user/signup`, {
                    name,
                    email,
                    password,
                    confirmPassword
                });
                ctxDispatch({type: "USER_SIGNIN", payload: data});
                localStorage.setItem("userInfo", JSON.stringify(data));
                navigate(redirect);
            } else {
                toast.error("Please Provide All Values");
            }
        } catch(err) {
            toast.error(err.message);
        }
    }
    useEffect(() => {
        if(userInfo) {
            navigate(redirect);
        }
    }, [userInfo, navigate, redirect]);
    return (
        <form onSubmit={submitHandler} className={classes.form}>
            <ToastContainer position="bottom-center" limit={1} />
            <div className={classes.formContainer}>
                <div className={classes.formGroup}>
                    <h1 style={{textAlign: "center"}}>Sign Up</h1>
                    <Helmet>
                        <title>Sign Up</title>
                    </Helmet>

                    <Input value={name} fn={changeHandler} text="Name" type="text" placeholder="Name" id="name" />

                    <Input value={email} fn={changeHandler} text="Email" type="email" placeholder="Email" id="email" />

                    <Input value={password} fn={changeHandler} text="Password" type="password" placeholder="Password" id="password" />

                    <Input value={confirmPassword} fn={changeHandler} text="Confirm Password" type="password" placeholder="Confirm Password" id="confirmPassword" />

                    <button className={classes.btn} type="submit">Sign Up</button>
                    <div className={classes.linkStyle}>
                        <span>Already Have an Account? </span>
                        <Link to={`/signin?redirect=${redirect}`}> Sign In</Link>
                    </div>
                </div>
            </div>
        </form>
    )
}

export default SignUp;