const commonReducer = (state, action) => {
    switch (action.type) {

        case 'TOGGLE_FORM':
            return {
                ...state,
                isFormOpen: action.payload.toggle
            };

        case 'TOGGLE_FEEDBACK':
            return {
                ...state,
                isFeedbackOpen: action.payload.toggle
            };

        case 'TOGGLE_PROFILE':
            return {
                ...state,
                isProfileOpen: action.payload.toggle
            };

        case 'TOGGLE_LOADING':
            return {
                ...state,
                isLoading: action.payload.toggle
            };


        case 'SET_FORM_USER_INFO':
            localStorage.setItem("username", action.payload.info.username);
            localStorage.setItem("usertype", action.payload.info.usertype);
            localStorage.setItem("gender", action.payload.info.gender);
            localStorage.setItem("phone", action.payload.info.phone);
            localStorage.setItem("email", action.payload.info.email);
            localStorage.setItem("passwd", action.payload.info.passwd);
            localStorage.setItem("specialization", action.payload.info.specialization);
            localStorage.setItem("age", action.payload.info.age);
            localStorage.setItem("fee", action.payload.info.fee);
            localStorage.setItem("verified", action.payload.info.verified);
            return state;

        case 'USER_LOGOUT':
            localStorage.clear();
            return state;


        case 'SET_SEARCH_RESULTS':
            return {
                ...state,
                searchResults: action.payload.results
            };


        default:
            return state;
    }
};

export default commonReducer;