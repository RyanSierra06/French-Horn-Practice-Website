import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'

export default function RegisterPage() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const { user, login } = useAuth()

    const VITE_BACKEND_BASE_URL =  import.meta.env.VITE_BACKEND_BASE_URL;

    if (user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-yellow-50">
                <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
                    <h2 className="text-2xl font-semibold mb-6 text-gray-800">You are already registered and logged in.</h2>
                    <button
                        className="mt-4 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition"
                        onClick={() => navigate('/profile')}
                    >
                        Go to Profile
                    </button>
                </div>
            </div>
        )
    }

    const handleSubmit = async e => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            const res = await fetch(`${VITE_BACKEND_BASE_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: name, email, password })
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Registration failed')
            login(data.user, data.token)
            navigate('/profile')
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-yellow-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">
                    Create an Account
                </h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
                            placeholder="Your Name"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
                            placeholder="you@example.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
                            placeholder="••••••••"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <div className="text-red-600 text-sm text-center">{error}</div>}
                    <button
                        type="submit"
                        className="w-full py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition disabled:opacity-60"
                        disabled={loading}
                    >
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                </form>
                <div className="mt-4 text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <a href="/login" className="text-yellow-700 hover:underline">Log In</a>
                </div>
            </div>
        </div>
    )
}
