import React, { useContext, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import commonContext from '../../contexts/common/commonContext';
import medicinesData from '../../data/medicinesData';
import { AiOutlineSearch } from 'react-icons/ai';
import filtersContext from '../../contexts/filters/filterContext';
import useOutsideClose from '../../hooks/useOutsideClose';


const SearchBar = () => {

    const { searchResults, setSearchResults } = useContext(commonContext);
    const { setFilteredProducts } = useContext(filtersContext);
    const [curSearch, setCurSearch] = useState("");

    const searchRef = useRef();

    // closing the SearchBar
    const closeSearch = () => {
        setSearchResults([]);
        setCurSearch("");
    };

    useOutsideClose(searchRef, closeSearch);

    // handling Search
    const handleSearching = (e) => {
        setCurSearch(e.target.value);

        const searchedTerm = e.target.value.toLowerCase().trim();

        const updatedSearchResults = medicinesData.filter(item => item.title.toLowerCase().includes(searchedTerm));

        searchedTerm === '' ? setSearchResults([]) : setSearchResults(updatedSearchResults);
    };


    return (
        <>
            <div id="searchbar">
                <div className="searchbar_content" ref={searchRef}>
                    <div className="search_box">
                        <input
                            type="search"
                            className="input_field"
                            placeholder="Search for product..."
                            onChange={handleSearching}
                            value={curSearch}
                        />
                        <button
                            type="button"
                            className="btn"
                            disabled={searchResults.length === 0}
                            onClick={() => {
                                setFilteredProducts(searchResults);
                                closeSearch();
                            }}
                        >
                            <AiOutlineSearch />
                        </button>
                    </div>

                    {
                        searchResults.length !== 0 && (
                            <div className="search_results">
                                {
                                    searchResults.map(item => {
                                        const { id, title } = item;
                                        return (
                                            <Link
                                                to={`/all-medicines/medicine-details/${id}`}
                                                onClick={closeSearch}
                                                key={id}
                                            >
                                                {title}
                                            </Link>
                                        );
                                    })
                                }
                            </div>
                        )
                    }
                </div>
            </div>
        </>
    );
};

export default SearchBar;