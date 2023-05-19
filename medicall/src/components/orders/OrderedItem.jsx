import React, { useContext } from 'react';
import { Link } from 'react-router-dom';


const OrderedItem = (props) => {

    const { id, images, title, price, quantity,Ordered_on } = props;
    return (
        <>
            <div className="ordered_item">
                <figure className="ordered_item_img">
                    <Link to={`/all-medicines/medicine-details/${id}`}>
                        <img src={images[0]} alt="product-img" />
                    </Link>
                </figure>
                <div className="ordered_item_info">
                    <div className="ordered_item_head">
                        <h4 className="ordered_item_title">
                            <Link to={`/all-medicines/medicine-details/${id}`}><span>{title}</span> <br />Pharmaceuticals</Link>
                        </h4>
                    </div>

                    <h2 className="ordered_item_price">
                        ₹ {price} /-&nbsp;
                    </h2>

                    <h3 className='ordered_item_detail'>Quantity: {quantity}</h3>
                    <h3 className='ordered_item_detail'>Ordered on: {Ordered_on}</h3>
                </div>
            </div>
        </>
    );
};

export default OrderedItem;