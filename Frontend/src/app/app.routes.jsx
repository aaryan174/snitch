import {createBrowserRouter} from "react-router-dom"
import Register from "../features/Auth/pages/Register.jsx"
import Login from "../features/Auth/pages/Login.jsx"
import CreateProduct from "../features/product/pages/CreateProduct.jsx"

export const routes = createBrowserRouter([
    {
        path: "/",
        element: <h1>home</h1>
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/product/create",
        element: <CreateProduct />
    }
])