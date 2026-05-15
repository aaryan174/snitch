import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const Protected = ({ children, role }) => {
    const user = useSelector((state) => state.auth.user)
    const loading = useSelector((state) => state.auth.loading)

    if (loading) {
        return <div>Loading....</div>
    }

    if (!user) {
        return <Navigate to="/login" />
    }
    
    // If a specific role is required, and user doesn't have it, redirect.
    // Sellers usually shouldn't be completely blocked from basic routes, 
    // but if we explicitly asked for a role, enforce it.
    if (role && user.role !== role) {
        return <Navigate to="/" />
    }
    
    return children
}

export default Protected
