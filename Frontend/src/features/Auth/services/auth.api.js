import axios from "axios"

const Authapi = axios.create({
    baseURL: "http://localhost:5000",
    withCredentials: true
})


export async function register({email, name, password}) {
    const res = await Authapi.post("/api/auth/register", {email, password, name})
    return res.data;
}

export async function login({email, password}) {
    const res = await Authapi.post("/auth/api/login", {email, password})
    return res.data
}

export async function getUserProfile() {
    const res = await Authapi.get("/api/auth/profile")
    return res.data
}