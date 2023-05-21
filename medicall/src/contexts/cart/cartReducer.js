const cartReducer = (state, action) => {
    switch (action.type) {

        case 'SET_CART_ITEMS':
            return {
                ...state,
                cartItems: action.payload.cartItems
            };

        case 'ADD_TO_CART':
            const newItemId = action.payload.item.id;
            const itemExist = state.cartItems.some(item => item.id === newItemId);

            let updatedCartItems = null;

            if (itemExist) {
                updatedCartItems = state.cartItems.map(item => {
                    if (item.id === newItemId) {
                        return {
                            ...item,
                            quantity: item.quantity + 1
                        };
                    }
                    return item;
                });
            } else {
                updatedCartItems = [...state.cartItems, {...action.payload.item, quantity: 1}];
            }

            return {
                ...state,
                cartItems: updatedCartItems
            };

        case 'PLACE_ORDER':
            return {
                ...state,
                orders: [...state.orders, action.payload.order]
            };

        case 'CLEAR_ORDERS':
            return {
                ...state,
                orders: []
            };

        case 'REMOVE_FROM_CART':
            return {
                ...state,
                cartItems: state.cartItems.filter(item => item.id !== action.payload.itemId)
            };


        case 'INCREMENT_ITEM':
            return {
                ...state,
                cartItems: state.cartItems.map(item => {
                    if (item.id === action.payload.itemId) {
                        return {
                            ...item,
                            quantity: item.quantity + 1
                        };
                    }
                    return item;
                })
            };


        case 'DECREMENT_ITEM':
            return {
                ...state,
                cartItems: state.cartItems.map(item => {
                    if (item.id === action.payload.itemId) {
                        return {
                            ...item,
                            quantity: item.quantity - 1
                        };
                    }
                    return item;
                }).filter(item => item.quantity !== 0)
            };

        case 'CLEAR_CART':
            return { ...state, cartItems: [] }

        default:
            return state;
    }
};

export default cartReducer;