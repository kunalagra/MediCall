import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import cartContext from '../../contexts/cart/cartContext';
import useActive from '../../hooks/useActive';
import { useNavigate } from 'react-router-dom';


const ProductCard = (props) => {

    const { id, images, title, price } = props;

    const { addItem, placeOrder } = useContext(cartContext);
    const { active, handleActive, activeClass } = useActive(false);
    const navigate = useNavigate();


    // handling Add-to-cart
    const handleAddItem = () => {
        const item = { ...props };
        addItem(item);

        handleActive(id);

        setTimeout(() => {
            handleActive(false);
        }, 3000);
    };

    return (
        <>
            <div className="card products_card">
                <figure className="products_img">
                    <Link to={`/all-medicines/medicine-details/${id}`}>
                        <img src={images[0]} alt="product-img" />
                    </Link>
                </figure>
                <div className="products_details">
                    <h3 className="products_title">
                        <Link to={`/all-medicines/medicine-details/${id}`}>{title}</Link>
                    </h3>
                    {/* <h5 className="products_info">{info}</h5> */}
                    <div className="separator"></div>
                    <h2 className="products_price">
                        ₹ {price} /- &nbsp;
                    </h2>
                    <button
                        type="button"
                        className="btn products_btn"
                        onClick={() => {
                            localStorage.setItem("totalPrice", price);
                            const order = { ...props, quantity: 1 };
                            placeOrder(order);
                            navigate("/checkout");
                        }}
                    >
                        Buy now
                    </button>
                    <button
                        type="button"
                        className={`btn products_btn ${activeClass(id)} add_to_cart_btn`}
                        onClick={handleAddItem}
                    >
                        {active ? 'Added' : 'Add to cart'}
                    </button>
                </div>
            </div>
        </>
    );
};

export default ProductCard;