import {createBrowserRouter} from "react-router-dom"
import Register from "../features/Auth/pages/Register.jsx"

export const routes = createBrowserRouter([
    {
        path: "/",
        element: <h1>home</h1>
    },
    {
        path: "/register",
        element: <Register />
    }
])