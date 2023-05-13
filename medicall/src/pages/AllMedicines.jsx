import React, { useContext, useEffect } from 'react';
import { BsExclamationCircle } from 'react-icons/bs';
import useDocTitle from '../hooks/useDocTitle';
import FilterBar from '../components/medicines/FilterBar';
import ProductCard from '../components/medicines/ProductCard';
import filtersContext from '../contexts/filters/filterContext';
import EmptyView from '../components/common/EmptyView';
import SearchBar from '../components/common/SearchBar';
import { useNavigate } from 'react-router-dom';


const AllMedicines = () => {

    useDocTitle('All Medicines');

    const navigate = useNavigate(); 
    const userNotExists = localStorage.getItem("usertype")===undefined || localStorage.getItem("usertype")===null;

    useEffect(() => {
        if(userNotExists) {
            navigate("/");
        }
        //eslint-disable-next-line
    }, []);

    const { allProducts } = useContext(filtersContext);

    return (
        <>
            <section id="search-bar">
                <SearchBar />
            </section>
            <section id="all_products" className="section">
                <FilterBar />

                <div className="container">
                    {
                        allProducts.length > 0 ? (
                            <div className="wrapper products_wrapper">
                                {
                                    allProducts.map(item => (
                                        <ProductCard
                                            key={item.id}
                                            {...item}
                                        />
                                    ))
                                }
                            </div>
                        ) : (
                            <EmptyView
                                icon={<BsExclamationCircle />}
                                msg="No Results Found"
                            />
                        )
                    }
                </div>
            </section>
        </>
    );
};

export default AllMedicines;