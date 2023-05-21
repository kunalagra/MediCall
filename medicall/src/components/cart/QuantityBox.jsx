import React, { useContext } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa';
import cartContext from '../../contexts/cart/cartContext';
import httpClient from '../../httpClient';


const QuantityBox = (props) => {

    const { itemId, itemQuantity } = props;

    const { incrementItem, decrementItem } = useContext(cartContext);

    const increment = (itemId) => {
        httpClient.post('/increase_quantity', {email: localStorage.getItem("email"), id: itemId})
    }

    const decrement = (itemId) => {
        httpClient.post('/decrease_quantity', {email: localStorage.getItem("email"), id: itemId})
    }


    return (
        <>
            <div className="quantity_box">
                <button
                    type="button"
                    onClick={() => {decrementItem(itemId), decrement(itemId)}}
                    disabled={itemQuantity===1}
                >
                    <FaMinus />
                </button>
                <span className="quantity_count">
                    {itemQuantity}
                </span>
                <button
                    type="button"
                    onClick={() =>{ incrementItem(itemId), increment(itemId)}}
                    disabled={itemQuantity===10}
                >
                    <FaPlus />
                </button>
            </div>
        </>
    );
};

export default QuantityBox;