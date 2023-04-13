import React from 'react';
import { Link } from 'react-router-dom';

const EmptyView = (props) => {

    const { msg, link, btnText } = props;

    return (
        <>
            <div className="empty_view_wrapper">
                <div className="empty_view_img">
                    <img src='empty-cart.png' alt="empty-cart" />
                </div>
                <h2>{msg}</h2>
                <div className='empty_msg'>
                    <p>Looks like you have not added anything in your cart.</p>
                    <p>Go ahead and explore latest medicines.</p>
                </div>
                {
                    link && (
                        <Link to={link} className="btn start_shopping_btn">
                            {btnText}
                        </Link>
                    )
                }
            </div>
        </>
    );
};

export default EmptyView;