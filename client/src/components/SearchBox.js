import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import classes from "../Styles/SearchBox.module.css";


function SearchBox() {
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const changeHandler = (e) => {
        setQuery(e.target.value);
    }
    const submitHandler = (e) => {
        e.preventDefault();
        navigate(query ? `/search?category=${query}` : "/search");
    }
    return(
        <form onSubmit={submitHandler} className={classes.search}>
            <input type='text' value={query} onChange={changeHandler} placeholder="Search Product..." />
            <button><i className="fas fa-search"></i></button> 
        </form>
    )
}

export default SearchBox;