import React from 'react';
import { Link } from 'react-router-dom';
import { BsArrowRight } from 'react-icons/bs';
import ProductCard from './ProductCard';
import medicinesData from '../../data/medicinesData';


const TopProducts = () => {

    return (
        <div id="latest-products">
            <div className="wrapper products_wrapper">
                {
                    medicinesData.slice(0, 7).map(item => (
                        <ProductCard
                            key={item.id}
                            {...item}
                        />
                    ))
                }
                <div className="card products_card browse_card">
                    <Link to="/all-medicines">
                        Browse All <br /> Medicines <BsArrowRight />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default TopProducts;