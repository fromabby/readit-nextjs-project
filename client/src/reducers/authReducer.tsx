export const authReducer = (state, { type, payload }) => {
    switch (type) {
        case 'LOGIN_REQUEST':
        case 'LOAD_USER_REQUEST':
            return {
                loading: true,
                isAuthenticated: false,
                user: {}
            }

        case 'LOGIN_SUCCESS':
        case 'LOAD_USER_SUCCESS':
            return {
                ...state,
                loading: false,
                isAuthenticated: true,
                user: payload
            }

        case 'LOGIN_FAIL':
        case 'LOAD_USER_FAIL':
            return {
                ...state,
                loading: false,
                isAuthenticated: false
            }

        case 'LOGOUT': {
            return {
                ...state,
                isAuthenticated: false,
                user: null
            }
        }

        default:
            return state
    }
}
