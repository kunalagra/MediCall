import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { IoMdCheckmark } from 'react-icons/io';
import useDocTitle from '../hooks/useDocTitle';
import useActive from '../hooks/useActive';
import cartContext from '../contexts/cart/cartContext';
import medicinesData from '../data/medicinesData';
import MedicineSummary from '../components/medicines/MedicineSummary';
import { useNavigate } from 'react-router-dom';
import Preloader from "../components/common/Preloader";
import commonContext from "../contexts/common/commonContext";
import useScrollDisable from "../hooks/useScrollDisable";


const MedicineDetails = () => {

    useDocTitle('Medicine Details');

    const navigate = useNavigate(); 

    const { handleActive, activeClass } = useActive(0);

    const { addItem } = useContext(cartContext);

    const { isLoading, toggleLoading } = useContext(commonContext);

    const { productId } = useParams();

    // here the 'id' received has 'string-type', so converting it to a 'Number'
    const prodId = parseInt(productId);

    // showing the Product based on the received 'id'
    const product = medicinesData.find(item => item.id === prodId);

    const { images, title, price } = product;

    const [previewImg, setPreviewImg] = useState(images[0]);

    let allImages = [...images];

    if(images.length < 4) {
        for(let i=0; i < 4-images.length; i++) {
            allImages.push(images[0]);
        }
    }

    const [btnActive, setBtnActive] = useState(false);


    // handling Add-to-cart
    const handleAddItem = () => {
        setBtnActive(true);
        addItem(product);

        setTimeout(() => setBtnActive(false), 3000);
    };


    // setting the very-first image on re-render
    useEffect(() => {
        setPreviewImg(images[0]);
        handleActive(0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [images]);


    // handling Preview image
    const handlePreviewImg = (i) => {
        setPreviewImg(allImages[i]);
        handleActive(i);
    };

    useEffect(() => {
        toggleLoading(true);
        setTimeout(() => toggleLoading(false), 1500);
        //eslint-disable-next-line
    }, []);

    useScrollDisable(isLoading);

    if(isLoading) {
        return <Preloader />;
    }


    return (
        <>
            <section id="product_details" className="section">

                <div className='navigation_btns'>
                    <div className='navigation_btn' onClick={() => navigate("/buy-medicines")}>
                        Back to store
                    </div>
                    <div className='navigation_btn' onClick={() => navigate("/all-medicines")}>
                        Browse all products
                    </div>
                </div>

                <div className="container">
                    <div className="wrapper prod_details_wrapper">

                        {/*=== Product Details Left-content ===*/}
                        <div className="prod_details_left_col">
                            <div className="prod_details_tabs">
                                {
                                    allImages.map((img, i) => (
                                        <div
                                            key={i}
                                            className={`tabs_item ${activeClass(i)}`}
                                            onClick={() => handlePreviewImg(i)}
                                        >
                                            <img src={img} alt="product-img" />
                                        </div>
                                    ))
                                }
                            </div>
                            <figure className="prod_details_img">
                                <img src={previewImg} alt="product-img" />
                            </figure>
                        </div>

                        {/*=== Product Details Right-content ===*/}
                        <div className="prod_details_right_col">
                            <h1 className="prod_details_title">{title}</h1>
                            <h4 className="prod_details_info">Pharmaceuticals</h4>

                            <div className="separator"></div>

                            <div className="prod_details_price">
                                <div className="price_box">
                                    <h2 className="price">
                                       ₹ {price} /- &nbsp;
                                    </h2>
                                    <span className="tax_txt">(Inclusive of all taxes)</span>
                                </div>

                                <div className="badge">
                                    <span><IoMdCheckmark /> In Stock</span>
                                </div>
                            </div>

                            <div className="separator"></div>

                            <div className="prod_details_buy_btn">
                                <button
                                    type="button"
                                    className="btn"
                                    onClick={() => {
                                        localStorage.setItem("totalPrice", price);
                                        navigate("/checkout");
                                    }}
                                >
                                    Buy now
                                </button>
                                <button
                                    type="button"
                                    className={`btn add_to_cart_btn ${btnActive && "active"}`}
                                    onClick={handleAddItem}
                                >
                                    {btnActive ? 'Added' : 'Add to cart'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <MedicineSummary {...product} />

        </>
    );
};

export default MedicineDetails;