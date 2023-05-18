import React, { useContext } from 'react';
import { TbTrash } from 'react-icons/tb';
import { Link } from 'react-router-dom';
import cartContext from '../../contexts/cart/cartContext';
import QuantityBox from './QuantityBox';


const CartItem = (props) => {

    const { id, images, title, price, quantity } = props;

    const { removeItem } = useContext(cartContext);

    return (
        <>
            <div className="cart_item">
                <figure className="cart_item_img">
                    <Link to={`/all-medicines/medicine-details/${id}`}>
                        <img src={images[0]} alt="product-img" />
                    </Link>
                </figure>
                <div className="cart_item_info">
                    <div className="cart_item_head">
                        <h4 className="cart_item_title">
                            <Link to={`/all-medicines/medicine-details/${id}`}><span>{title}</span> <br />Pharmaceuticals</Link>
                        </h4>
                        <div className="cart_item_del">
                            <span onClick={() => removeItem(id)}>
                                <TbTrash />
                            </span>
                            <div className="tooltip">Remove Item</div>
                        </div>
                    </div>

                    <h2 className="cart_item_price">
                        ₹ {price} /-&nbsp;
                    </h2>

                    <QuantityBox itemId={id} itemQuantity={quantity} />
                </div>
            </div>
        </>
    );
};

export default CartItem;