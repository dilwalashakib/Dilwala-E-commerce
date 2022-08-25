import {createContext, useReducer} from "react";
export const Store = createContext();

const initialState = {
    userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null,
    cart: {
        shippingAddress: localStorage.getItem("shippingAddress") ? JSON.parse(localStorage.getItem("shippingAddress")) : {},

        paymentMethod: localStorage.getItem("paymentMethod") ? localStorage.getItem("paymentMethod") : "",
        
        cartItems : localStorage.getItem("cartItems") ? JSON.parse(localStorage.getItem("cartItems")) : []
    }
}
const reducer = (state, action) => {
    switch(action.type) {
        case "ADD_CART_ITEM":
            const newItem = action.payload;
            const existItem = state.cart.cartItems.find((item) => item._id === newItem._id);
            const cartItem = existItem ? state.cart.cartItems.map((item) => item._id === existItem._id ? newItem : item) : [...state.cart.cartItems, newItem];
            
            localStorage.setItem("cartItems", JSON.stringify(cartItem));
            return {...state, cart: {...state.cart, cartItems: cartItem}};
        case "REMOVE_ITEM":
            const remove = state.cart.cartItems.filter((item) => item._id !== action.payload._id);
            localStorage.setItem("cartItems", JSON.stringify(remove));
            return {...state, cart: {...state.cart, cartItems: remove}}
        case "USER_SIGNIN":
            return {...state, userInfo: action.payload};
        case "USER_SIGNOUT":
            return {...state, userInfo: null, cart: {cartItems: [], shippingAddress: {}}};
        case "SAVE_SHIPPING_ADDRESS": 
            return {...state, cart: {...state.cart, shippingAddress: action.payload}}
        case "SAVE_PAYMENT_METHOD": 
            return {...state, cart: {...state.cart, paymentMethod : action.payload}}
        case "CLEAR_CART":
            return {...state, cart: {...state.cart, cartItems: []}}
        default:
            return state;
    }
}

function StoreProvider({children}) {
    const [state, dispatch] = useReducer(reducer, initialState);
    return <Store.Provider value={{state, dispatch}}>{children}</Store.Provider>
}
let s = {
    Providerrr,
    consummmer
}
export default StoreProvider;