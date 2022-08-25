import React, { useEffect, useReducer, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import classes from "../Styles/Search.module.css";
import {Helmet} from "react-helmet-async";
import axios from 'axios';
import Rating from "../components/Rating";
import ProductsPage from "./Products";
import Layout from "../components/Layout";

const reducer = (state, action) => {
    switch(action.type) {
        case "REQUEST":
            return {...state, loading: true};
        case "SUCCESS":
            return {
                ...state,
                products: action.payload.products,
                pages: action.payload.pages,
                page: action.payload.page,
                countProducts: action.payload.countProducts,
                loading: false
            };
        case "ERROR":
            return {...state, loading: false, error: action.payload.error};
        default:
            return state;
    }
}
const prices = [
    {
        name: "$1 to $50",
        value: `1-50`
    },
    {
        name: "$51 to $200",
        value: `51-200`
    },
    {
        name: "$201 to $1000",
        value: `201-1000`
    }
]
const ratings = [
    {
        name: "4stars & up",
        rating: 4
    },
    {
        name: "3stars & up",
        rating: 3
    },
    {
        name: "2stars & up",
        rating: 2
    },
    {
        name: "1stars & up",
        rating: 1
    }
]


function Search() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [{loading, error, products, pages, countProducts}, dispatch] = useReducer(reducer, {
        loading: false,
        error: '',
        products: []
    });
    console.log(pages);
   
    const { search } = useLocation();
    const urlParams = new URLSearchParams(search);
    const category = urlParams.get("category") || "all";
    const query = urlParams.get("query") || "all";
    const price = urlParams.get("price") || "all";
    const rating = urlParams.get("rating") || "all";
    const order = urlParams.get("order") || "all";
    const page = urlParams.get("page") || 1;

    useEffect(() =>{
        const fetchData = async() => {
            try{
                const {data:categoryData} = await axios.get(`/api/product/category`);
                setCategories(categoryData);
                
                const {data} = await axios.get(`/api/product/search?page=${page}&query=${query}&category=${category}&price=${price}&rating=${rating}&order=${order}`);
                
                dispatch({type: "SUCCESS", payload: data});
                
            } catch(err) {
                console.log(err);
                dispatch({type: "ERROR", payload: err});
            }
        }
        fetchData();
    }, [category, query, price, rating, order, page]);

    const getFilterUrl = (filter) => {
        const filterCategory = filter.category || category;
        const filterPage = filter.page || page;
        const filterPrice = filter.price || price;
        const filterQuery = filter.query || query;
        const filterRating = filter.rating || rating;
        const filterOrder = filter.order || order;
        return `/search?category=${filterCategory}&page=${filterPage}&price=${filterPrice}&query=${filterQuery}&rating=${filterRating}&order=${filterOrder}`
    }
    return (
        <Layout>
            <div className={classes.searchContainer}>
            <Helmet>
                <title>Search Product</title>
            </Helmet>
            <div className={classes.leftSide}>
                <div>
                    <h2>Department</h2>
                    <ul>
                        <li>
                            <Link className={"all" === category ? `${classes.textBold}`: ""} to={getFilterUrl({category: 'all'})}>any</Link>
                        </li>
                        {categories.map((val) => (
                            <li key={val}>
                                <Link className={val === category ? classes.textBold : ''} to={getFilterUrl({category: val})}>
                                    {val}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h2>Prices</h2>
                    <ul>
                        <li>
                            <Link className={price === "all" ? classes.textBold : ""} to={getFilterUrl({price: "all"})}>Any</Link>
                        </li>
                        {prices.map((p) => (
                            <li key={p.value}>
                                <Link to={getFilterUrl({price: p.value})} className={p.value === price ? classes.textBold : ""}>{p.name}</Link>
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h2>Customer Avg Reviews</h2>
                    <ul>
                        {ratings.map((r) => (
                            <li key={r.name}>
                                <Link to={getFilterUrl({rating: r.rating})} className={`${r.rating}` === rating ? classes.textBold : ""}>
                                    <Rating rating={r.rating} caption={`& up`} />
                                    
                                </Link>
                            </li>
                        ))}
                        <li>
                            <Link to={getFilterUrl({rating: "all"})} className={rating === "all" ? classes.textBold : ""}>
                                <Rating caption={`& up`} rating={0} />
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>

            <div className={classes.RightSide}>
               <div className={classes.topArea}>
                    <div className={classes.leftTopArea}>
                        {countProducts === 0 ? "NO" : countProducts} Result
                        {query !== "all" && ` : ${query}`}
                        {category !== "all" && ` : ${category}`}
                        {price !== "all" && ` : price ${price}`}
                        {rating !== "all" && ` : Rating ${rating} & up`}

                        {query !== "all" || category !== "all" || price !== "all" || rating !== "all" ? (
                            <button className={classes.btn} onClick={() => navigate("/search")}>
                                <i className="fas fa-times-circle"></i>
                            </button>
                        ) : (
                            null
                        )}

                    </div>
                    <div className={classes.sortArea}>
                        Sort By {" "}
                        <select value={order} onChange={(e) => navigate(getFilterUrl({order : e.target.value}))}>
                            <option value='newest'>Newest Arrivals</option>
                            <option value="lowest">Price: Low To High</option>
                            <option value='highest'>Price: High To Low</option>
                            <option value='toprated'>Avg. Customer Reviews</option>
                        </select>
                    </div>
               </div>
                <div>
                    {products.length === 0 && (<h2>No Product</h2>)}
                </div>
                <div className={classes.product}>
                    <ProductsPage products={products} heading="Search Product" />
                </div>
                <div>
                    {[...Array(pages).keys()].map((val) => (
                        <Link key={val+1} className={classes.pagination} to={getFilterUrl({page: val+1})}>

                            <button className={Number(page) === val+1? classes.textBold : ""}>
                                {val + 1}
                            </button>

                        </Link>
                    ))}
                </div>
            </div>
            </div>
        </Layout>
    )
}

export default Search;