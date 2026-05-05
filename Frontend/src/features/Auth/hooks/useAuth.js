import { setUser, setError, setLoading } from "../state/auth.slice.js";
import { register, login, getUserProfile } from "../services/auth.api.js";
import { useDispatch } from "react-redux"

export const useAuth = () => {
    const dispatch = useDispatch();

    async function handleRegister({ email, name, password, isSeller = false }) {
        const data = await register({ email, password, name, isSeller })
        dispatch(setUser(data.user))
        return data.user
    }

    async function handleLogin({ email, password }) {
        const data = await login({ email, password })
        dispatch(setUser(data.user))
        return data.user
    }

    async function handleUserProfile() {
        try {
        dispatch(setLoading(true))
        const data = await getUserProfile()
        dispatch(setUser(data.user))
        } catch (error) {
            console.log(error)
        } finally{
            dispatch(setLoading(false))
        }
       
    }


    return { handleRegister, handleLogin, handleUserProfile}
}