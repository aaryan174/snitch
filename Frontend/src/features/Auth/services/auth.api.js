import axios from "axios"

const Authapi = axios.create({
    baseURL: "/api/auth",
    withCredentials: true
})


export async function register({email, name, password, isSeller}) {
    const res = await Authapi.post("/register", {email, password, name, isSeller})
    return res.data;
}

export async function login({email, password}) {
    const res = await Authapi.post("/login", {email, password})
    return res.data;
}

export async function getUserProfile() {
    const res = await Authapi.get("/profile")
    return res.data;
}

export async function logout() {
    const res = await Authapi.post("/logout")
    return res.data;
}