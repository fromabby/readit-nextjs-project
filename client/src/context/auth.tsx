import { createContext, useContext, useReducer, useEffect } from 'react'
import { User } from '../types'
import { authReducer } from '../reducers/authReducer'
import axios from 'axios'

interface State {
    loading: boolean
    isAuthenticated: boolean
    user: User | undefined
}

const StateContext = createContext<State>({
    loading: false,
    isAuthenticated: false,
    user: null
})

const DispatchContext = createContext(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [auth, defaultDispatch] = useReducer(authReducer, {
        user: null,
        isAuthenticated: false,
        loading: true
    })

    const dispatch = (type: string, payload?: any) =>
        defaultDispatch({ type, payload })

    useEffect(() => {
        const loadUser = async () => {
            try {
                dispatch('LOAD_USER_REQUEST')
                const { data } = await axios.get('/auth/me')

                dispatch('LOAD_USER_SUCCESS', data)
            } catch (error) {
                dispatch('LOAD_USER_FAIL', error.response.data)
            }
        }

        loadUser()
    }, [])

    return (
        <DispatchContext.Provider value={dispatch}>
            <StateContext.Provider value={auth}>
                {children}
            </StateContext.Provider>
        </DispatchContext.Provider>
    )
}

export const useAuthState = () => useContext(StateContext)
export const useAuthDispatch = () => useContext(DispatchContext)
