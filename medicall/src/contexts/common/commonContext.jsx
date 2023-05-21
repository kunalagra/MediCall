import React from "react";
import { createContext, useReducer } from 'react';
import commonReducer from './commonReducer';

// Common-Context
const commonContext = createContext();

// Initial State
const initialState = {
    isFormOpen: false,
    searchResults: [],
    isFeedbackOpen: false,
    isProfileOpen: false,
    isLoading: false
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

    const toggleProfile = (toggle) => {
        return dispatch({
            type: 'TOGGLE_PROFILE',
            payload: { toggle }
        });
    };

    const toggleFeedback = (toggle) => {
        return dispatch({
            type: 'TOGGLE_FEEDBACK',
            payload: { toggle }
        });
    };

    const toggleLoading = (toggle) => {
        return dispatch({
            type: 'TOGGLE_LOADING',
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
        setSearchResults,
        toggleFeedback,
        toggleProfile,
        toggleLoading
    };

    return (
        <commonContext.Provider value={values}>
            {children}
        </commonContext.Provider>
    );
};

export default commonContext;
export { CommonProvider };