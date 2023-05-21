import React, { createContext, useReducer } from 'react';
import cartReducer from './cartReducer';

// Cart-Context
const cartContext = createContext();

// Initial State
const initialState = {
    cartItems: [],
    orders: [],
};

// Cart-Provider Component
const CartProvider = ({ children }) => {

    const [state, dispatch] = useReducer(cartReducer, initialState);

    // Dispatched Actions
    const setCartItems = (cartItems) => {
        return dispatch({
            type: 'SET_CART_ITEMS',
            payload: { cartItems }
        });
    };

    const addItem = (item) => {
        return dispatch({
            type: 'ADD_TO_CART',
            payload: { item }
        });
    };

    const removeItem = (itemId) => {
        return dispatch({
            type: 'REMOVE_FROM_CART',
            payload: { itemId }
        });
    };

    const incrementItem = (itemId) => {
        return dispatch({
            type: 'INCREMENT_ITEM',
            payload: { itemId }
        });
    };

    const decrementItem = (itemId) => {
        return dispatch({
            type: 'DECREMENT_ITEM',
            payload: { itemId }
        });
    };

    const clearCart = () => {
        return dispatch({
            type: 'CLEAR_CART'
        })
    }

    const placeOrder = (order) => {
        return dispatch({
            type: 'PLACE_ORDER',
            payload: { order }
        });
    };

    const clearOrders = () => {
        return dispatch({
            type: 'CLEAR_ORDERS'
        });
    };

    // Context values
    const values = {
        ...state,
        addItem,
        removeItem,
        incrementItem,
        decrementItem,
        clearCart,
        placeOrder,
        clearOrders,
        setCartItems,
    };

    return (
        <cartContext.Provider value={values}>
            {children}
        </cartContext.Provider>
    );
};


export default cartContext;
export { CartProvider };