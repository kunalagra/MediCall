import { createContext, useReducer } from 'react';
import commonReducer from './commonReducer';

// Common-Context
const commonContext = createContext();

// Initial State
const initialState = {
    isFormOpen: false,
    formUserInfo: {
        username: localStorage.getItem("username")? localStorage.getItem("username") : "abc",
        usertype: localStorage.getItem("usertype")? localStorage.getItem("usertype") : "",
        gender: localStorage.getItem("gender")? localStorage.getItem("gender") : "",
        phone: localStorage.getItem("phone")? localStorage.getItem("phone") : "",
        email: localStorage.getItem("email")? localStorage.getItem("email") : "",
        passwd: localStorage.getItem("passwd")? localStorage.getItem("passwd") : "",
        specialization: localStorage.getItem("specialization")? localStorage.getItem("specialization") : ""
    },
    searchResults: []
};

// Common-Provider Component
const CommonProvider = ({ children }) => {

    const [state, dispatch] = useReducer(commonReducer, initialState);

    // Form actions
    const toggleForm = (toggle) => {
        return dispatch({
            type: 'TOGGLE_FORM',
            payload: { toggle }
        });
    };

    const setFormUserInfo = (info) => {
        return dispatch({
            type: 'SET_FORM_USER_INFO',
            payload: { info }
        });
    };

    const userLogout = () => {
        return dispatch({
            type: 'USER_LOGOUT'
        });
    };

    const setSearchResults = (results) => {
        return dispatch({
            type: 'SET_SEARCH_RESULTS',
            payload: { results }
        });
    };

    // Context values
    const values = {
        ...state,
        toggleForm,
        setFormUserInfo,
        userLogout,
        setSearchResults
    };

    return (
        <commonContext.Provider value={values}>
            {children}
        </commonContext.Provider>
    );
};

export default commonContext;
export { CommonProvider };