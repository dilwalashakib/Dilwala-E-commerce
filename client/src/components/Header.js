import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Store } from "../Store";
import classes from "../Styles/Header.module.css";
import {ToastContainer, toast} from "react-toastify";
import axios from "axios";
import SearchBox from "./SearchBox";


function Header() {
  const navigate = useNavigate();
    const {state, dispatch: ctxDispatch} = useContext(Store);
    const {cart, userInfo} = state;

    const [sideBarIsOpen, setSideBarIsOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    useEffect(() => {
      const fetchData = async() => {
        try {
          const {data} = await axios.get(`/api/product/category`);
          setCategories(data);
        } catch(err) {
          toast.error(err.message);
        }
      }
      fetchData();
    }, []);

    const signoutHandler = () => {
      ctxDispatch({type: "USER_SIGNOUT"});
      localStorage.removeItem('userInfo');
      localStorage.removeItem("shippingAddress");
      localStorage.removeItem("paymentMethod");
      navigate('/');
    }
    return (
        <header>
          {sideBarIsOpen && <div className={classes.sideBar}>
            <h2>Categories</h2>
            {categories.map((category) => (
              <div key={category} className={classes.category}>
                <Link className={classes.categoryLink} to={`/search?category=${category}`}>{category}</Link>
              </div>
            ))}
          </div>}
          <div className={sideBarIsOpen ? `${classes.headerContainer} ${classes.active}` : classes.headerContainer}>
            <div className={classes.logo}>
              {sideBarIsOpen ? (<i onClick={() => setSideBarIsOpen(!sideBarIsOpen)} className="fa-solid fa-xmark"></i>) : (<i onClick={() => setSideBarIsOpen(!sideBarIsOpen)} className="fa-solid fa-bars"></i>)}
              <span><Link to="/">DILWALA</Link></span>
              <SearchBox />
            </div>
            
            <div className={classes.profileArea}>
              <div className={classes.cart}>
                <Link to='/cart'>CART {cart.cartItems.length > 0 &&(<span>{cart.cartItems.reduce((acc, val) => acc + val.quantity, 0)}</span>)}</Link>
              </div>
              {userInfo ? (
                <div className={classes.profile}>
                  <ul>
                    <li>
                      <Link to='/'>{userInfo.name} <i className="fa-solid fa-circle-chevron-down"></i> 
                      </Link>
                      <ul className={classes.dropdown}>
                        <li><Link to="/profile">Profile</Link></li>
                        <li><Link to="/orderhistory">Order History</Link></li>
                        <li onClick={signoutHandler}>
                          <Link to="/">Sign out</Link>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </div>
              ) : (
                <div className={classes.signin}>
                  <Link to="/signin">Sign In</Link>
                </div>

              )}
            </div>
            
          </div>
          
        </header>
    )
}

export default Header;