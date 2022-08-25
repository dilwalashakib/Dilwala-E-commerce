import React, { useContext, useEffect, useReducer, useState } from "react"
import Input from "../components/Input";
import { Store } from "../Store";
import classes from "../Styles/UserProfile.module.css";
import {ToastContainer, toast} from "react-toastify";
import axios from "axios";
import {Helmet} from "react-helmet-async";
import Loading from "../components/Loading";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";

const reducer = (state, action) => {
    switch(action.type) {
        case "REQUEST":
            return {...state, loadingUpdate : true}
        case "SUCCESS":
            return {...state, loadingUpdate: false};
        case "ERROR":
            return {...state, loadingUpdate: false};
        default:
            return state;
    }
}

function UserProfile() {
    const navigate = useNavigate();
    const {state: ctxState, dispatch: ctxDispatch} = useContext(Store);
    const {userInfo} = ctxState;
    console.log(userInfo);
    const [{loadingUpdate}, dispatch] = useReducer(reducer, {
        loadingUpdate : false,
    })
    
    const [state, setState] = useState({
        name: userInfo ? userInfo.name : "",
        email: userInfo ? userInfo.email : "",
        password: '',
        confirmPassword: ''
    });
    const {name, email, password, confirmPassword} = state;
    useEffect(() => {
        if(!userInfo) {
            navigate("/signin");
        }
    }, [navigate, userInfo]);

    const inputHandler = (e) => {
        setState({
            ...state,
            [e.target.id]: e.target.value
        })
    };

    const submitHandler = async(e) => {
        e.preventDefault();
        if(password !== confirmPassword) {
            toast.error("Password Doesn't Match");
        }
        try {
            dispatch({type: "REQUEST"});
            const {data} = await axios.put(`/api/user/profile`, {
                name,
                email,
                password,
                confirmPassword
            },
            {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`
                }
            });
            console.log(data);
            ctxDispatch({type: "USER_SIGNIN", payload: data});
            localStorage.setItem("userInfo", JSON.stringify(data));
            dispatch({type: "SUCCESS"});
            toast.success("User Updated Successfully");
        } catch(err) {
            dispatch({type: "ERROR"});
            toast.error(err.message);
        }
    }
    return (
        <Layout>
            {loadingUpdate ? <Loading /> : (
            <div className={classes.profileContainer}>
            <h1>User Profile</h1>
            <Helmet>
                <title>
                    User Profile
                </title>
            </Helmet>
            <div className={classes.inputContainer}>
                <ToastContainer limit={1} position='bottom-center' />
                <form onSubmit={submitHandler}>
                    <Input fn={inputHandler} value={name} id="name" text="Name" type='text' placeholder="Name" />
                    <Input fn={inputHandler} value={email} id="email" text="Email" type="email" placeholder="Email" />
                    <Input fn={inputHandler} value={password} id="password" text="Password" type='password' placeholder="Password" />
                    <Input fn={inputHandler} value={confirmPassword} id="confirmPassword" text="Confirm Password" type='password' placeholder="ConfirmPassword" />
                
                    <button className={classes.btn}>Update</button>
                </form>
            </div>
            
            </div>
        )}
        </Layout>
    )
}

export default UserProfile;