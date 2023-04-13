import React, { useContext } from 'react';
import filtersContext from '../../contexts/filters/filterContext';


const FilterBarOptions = () => {

    const {
        sortedValue,
        setSortedValue,
        handlePrice,
        selectedPrice: { price, minPrice, maxPrice },
        mobFilterBar: { isMobSortVisible, isMobFilterVisible },
        handleMobSortVisibility,
        handleMobFilterVisibility,
        handleClearFilters,
    } = useContext(filtersContext);

    const sortMenu = [
        {
            id: 1,
            title: "Latest",
        },
        {
            id: 2,
            title: "Price(Lowest First)",
        },
        {
            id: 3,
            title: "Price(Highest First)"
        },
    ];


    return (
        <>
            {/*===== Clear-Filters btn =====*/}
            {
                (sortedValue) && (
                    <div className="clear_filter_btn">
                        <button
                            type="button"
                            className="btn"
                            onClick={handleClearFilters}
                        >
                            Clear Filters
                        </button>
                    </div>
                )
            }

            {/*===== Sort-menu =====*/}
            <div className={`sort_options ${isMobSortVisible ? 'show' : ''}`}>
                <div className="sort_head">
                    <h3 className="title">Sort By</h3>
                    <button
                        type="button"
                        className="close_btn"
                        onClick={() => handleMobSortVisibility(false)}
                    >
                        &times;
                    </button>
                </div>

                <div className="separator"></div>

                <ul className="sort_menu">
                    {
                        sortMenu.map(item => {
                            const { id, title } = item;
                            return (
                                <li
                                    key={id}
                                    className={sortedValue === title ? 'active' : ''}
                                    onClick={() => setSortedValue(title)}
                                >
                                    {title}
                                </li>
                            );
                        })
                    }
                </ul>
            </div>

            {/*===== Filter-menu =====*/}
            <div className={`filter_options ${isMobFilterVisible ? 'show' : ''}`}>
                <div className="filter_head">
                    <h3 className="title">Filter By</h3>
                    <button
                        type="button"
                        className="close_btn"
                        onClick={() => handleMobFilterVisibility(false)}
                    >
                        &times;
                    </button>
                </div>

                <div className="separator"></div>

                {/* Filter by Price */}
                <div className="filter_block">
                    <h4>Price</h4>
                    <div className="price_filter">
                        <p>₹ {price}</p>
                        <input
                            type="range"
                            min={minPrice}
                            max={maxPrice}
                            value={price}
                            onChange={handlePrice}
                        />
                    </div>
                </div>

            </div>
        </>
    );
};

export default FilterBarOptions;