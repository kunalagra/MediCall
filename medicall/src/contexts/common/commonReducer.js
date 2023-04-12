const commonReducer = (state, action) => {
    switch (action.type) {

        case 'TOGGLE_FORM':
            return {
                ...state,
                isFormOpen: action.payload.toggle
            };


        case 'SET_FORM_USER_INFO':
            return {
                ...state,
                formUserInfo: action.payload.info
            };

        case 'USER_LOGOUT':
            return {
                ...state,
                formUserInfo: {
                    username: "",
                    usertype: "",
                    gender: "",
                    phone: "",
                    email: "",
                    passwd: "" 
                }
            };



        default:
            return state;
    }
};

export default commonReducer;