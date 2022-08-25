import { Helmet } from "react-helmet-async";
import Layout from "../components/Layout";
import React, { useEffect, useReducer } from "react";
import axios from "axios";
import ProductsPage from "./Products";


const reducer = (state, action) => {
    switch(action.type) {
        case "FETCH_REQUEST":
            return {...state, loading: true};
        case "FETCH_SUCCESS":
            return {...state, products: action.payload, loading: false};
        case "FETCH_FAIL":
            return {...state, loading: false, error: action.payload};
        default:
            return {...state}
    }
}

function Home() {
    const [state, dispatch] = useReducer(reducer, {
        products: [],
        loading: true,
        error: ''
    });
    const {loading, products} = state;
   
    useEffect(() => {
        (async() => {
            try {
                dispatch({type: "FETCH_REQUEST"});
                let {data} = await axios.get("/api/product");
                dispatch({type: "FETCH_SUCCESS", payload: data });
            } catch(err) {
                dispatch({type: "FETCH_FAIL", payload: err});
            }
        })();
    }, []);
   
    return(
        <Layout>
            <Helmet>
                <title>Dilwala Product Home Page</title>
            </Helmet>
            <ProductsPage products={products} loading={loading}  heading="Featured Products" />
        </Layout>
    )
}

export default Home;