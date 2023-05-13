import React from "react";
import { createContext, useEffect, useReducer } from 'react';
import filtersReducer from './filterReducer';
import medicinesData from '../../data/medicinesData';

// Filters-Context
const filtersContext = createContext();


// Initial State
const initialState = {
    allProducts: [],
    sortedValue: null,
    selectedPrice: {
        price: 0,
        minPrice: 0,
        maxPrice: 0
    },
    mobFilterBar: {
        isMobSortVisible: false,
        isMobFilterVisible: false,
    },
};


// Filters-Provider Component
const FiltersProvider = ({ children }) => {

    const [state, dispatch] = useReducer(filtersReducer, initialState);


    /* Loading All Products on the initial render */
    useEffect(() => {

        // making a shallow copy of the original products data, because we should never mutate the orginal data.
        const products = [...medicinesData];

        // finding the Max and Min Price, & setting them into the state.
        const priceArr = products.map(item => item.price);
        const minPrice = Math.min(...priceArr);
        const maxPrice = Math.max(...priceArr);

        dispatch({
            type: 'LOAD_ALL_PRODUCTS',
            payload: { products, minPrice, maxPrice }
        });

    }, []);


    /* function for applying Filters - (sorting & filtering) */
    const applyFilters = () => {

        let updatedProducts = [...medicinesData];

        /*==== Sorting ====*/
        if (state.sortedValue) {
            switch (state.sortedValue) {
                case 'Latest':
                    updatedProducts = updatedProducts.slice(0, 6).map(item => item);
                    break;

                case 'Price(Lowest First)':
                    updatedProducts = updatedProducts.sort((a, b) => a.price - b.price);
                    break;

                case 'Price(Highest First)':
                    updatedProducts = updatedProducts.sort((a, b) => b.price - a.price);
                    break;

                default:
                    throw new Error('Wrong Option Selected');
            }
        }
        
        /*==== Filtering ====*/
        
        // filter by Price
        if (state.selectedPrice) {
            updatedProducts = updatedProducts.filter(item => {
                return item.price <= state.selectedPrice.price;
            });
        }
        
        dispatch({
            type: 'FILTERED_PRODUCTS',
            payload: { updatedProducts }
        });
    };

    useEffect(() => {
        applyFilters();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.sortedValue, state.selectedPrice]);



    // Dispatched Actions
    const setSortedValue = (sortValue) => {
        return dispatch({
            type: 'SET_SORTED_VALUE',
            payload: { sortValue }
        });
    };

    const handlePrice = (event) => {
        const value = event.target.value;

        return dispatch({
            type: 'HANDLE_PRICE',
            payload: { value }
        });
    };

    const handleMobSortVisibility = (toggle) => {
        return dispatch({
            type: 'MOB_SORT_VISIBILITY',
            payload: { toggle }
        });
    };

    const handleMobFilterVisibility = (toggle) => {
        return dispatch({
            type: 'MOB_FILTER_VISIBILITY',
            payload: { toggle }
        });
    };

    const handleClearFilters = () => {
        return dispatch({
            type: 'CLEAR_FILTERS'
        });
    };

    const setFilteredProducts = ( updatedProducts ) => {
        dispatch({
            type: 'FILTERED_PRODUCTS',
            payload: { updatedProducts }
        });
    }


    // Context values
    const values = {
        ...state,
        setSortedValue,
        handlePrice,
        handleMobSortVisibility,
        handleMobFilterVisibility,
        handleClearFilters,
        setFilteredProducts
    };


    return (
        <filtersContext.Provider value={values}>
            {children}
        </filtersContext.Provider>
    );
};

export default filtersContext;
export { FiltersProvider };