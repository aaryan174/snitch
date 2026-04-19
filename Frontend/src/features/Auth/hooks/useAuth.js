import { setUser, setError,setLoading } from "../state/auth.slice.js";
import { register } from "../services/auth.api.js";
import {useDispatch} from "react-redux"

export const useAuth = () =>{
    const dispatch = useDispatch();
    async function handleRegister({email, name, password}) {
        const data = await register({email, password, name})
        dispatch(setUser(data.user))
    }


    return {handleRegister}
}