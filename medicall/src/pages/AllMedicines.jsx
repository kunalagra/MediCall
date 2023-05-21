import React, { useContext, useEffect } from 'react';
import { BsExclamationCircle } from 'react-icons/bs';
import useDocTitle from '../hooks/useDocTitle';
import FilterBar from '../components/medicines/FilterBar';
import ProductCard from '../components/medicines/ProductCard';
import filtersContext from '../contexts/filters/filterContext';
import EmptyView from '../components/common/EmptyView';
import SearchBar from '../components/common/SearchBar';
import { useNavigate } from 'react-router-dom';
import Preloader from "../components/common/Preloader";
import commonContext from "../contexts/common/commonContext";
import useScrollDisable from "../hooks/useScrollDisable";


const AllMedicines = () => {

    const { isLoading, toggleLoading } = useContext(commonContext);

    useDocTitle('All Medicines');

    const navigate = useNavigate(); 
    const userNotExists = localStorage.getItem("usertype")===undefined || localStorage.getItem("usertype")===null;

    useEffect(() => {
        if(userNotExists) {
            navigate("/");
        } else {
            toggleLoading(true);
            setTimeout(() => toggleLoading(false), 2000);
        }
        //eslint-disable-next-line
    }, []);

    useScrollDisable(isLoading);

    const { allProducts } = useContext(filtersContext);

    if(isLoading) {
        return <Preloader />;
    };

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