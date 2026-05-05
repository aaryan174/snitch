import React from 'react'
import { RouterProvider } from 'react-router-dom'
import {routes} from "./app/app.routes.jsx"
import { useAuth } from './features/Auth/hooks/useAuth.js'
import { useEffect } from 'react'

const App = () => {
  const {handleUserProfile} = useAuth();

  useEffect(()=>{
    handleUserProfile()
  },[])
  return (
    <>
    <RouterProvider router={routes} />
    </>
  )
}

export default App
