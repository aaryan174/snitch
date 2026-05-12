import { createBrowserRouter } from "react-router-dom"
import Register from "../features/Auth/pages/Register.jsx"
import Login from "../features/Auth/pages/Login.jsx"
import CreateProduct from "../features/product/pages/CreateProduct.jsx"
import Protected from "../components/protected/Protected.jsx"
import DashBoard from "../features/product/pages/DashBoard.jsx"
import SellerLayout from "../components/layout/SellerLayout.jsx"
import Home from "../features/product/pages/Home.jsx"
import OneProduct from "../features/User/Pages/OneProduct.jsx"
import SellerProductDetail from "../features/product/pages/SellerProductDetail.jsx"
import CreateVariant from "../features/product/pages/CreateVariant.jsx"
import Cart from "../features/cart/pages/Cart.jsx"

export const routes = createBrowserRouter([
    {
        path: "/",
        element: <Home />
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
        path: "/product",
        element: <Protected role="seller"><SellerLayout /></Protected>,
        children: [
            {
                path: "create",
                element: <CreateProduct />
            },
            {
                path: "Dashboard",
                element: <DashBoard />
            },
            {
                path: "detail/:productId",
                element: <SellerProductDetail />
            },
            {
                path: "detail/:productId/create-variant",
                element: <CreateVariant />
            }

        ]
    },
    {
        path: "/Product/:productId",
        element: <OneProduct />
    },
    {
        path: "/cart",
        element: <Protected><Cart /></Protected>
    }
])