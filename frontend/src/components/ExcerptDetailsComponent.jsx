import React, { useState, useEffect } from 'react'
import CustomAudioPlayer from '../components/AudioPlayerComponent.jsx'
import { useNavigate } from 'react-router-dom'
import { useAuth, useProfile } from '../contexts/AuthContext.jsx'
import { Bookmark, X as XIcon } from 'lucide-react'

export default function ExcerptDetails({ excerpt, onProgressUpdate, readOnly = false, showClose = false, onClose }) {
    const navigate = useNavigate()
    const { user, token } = useAuth()
    const { refreshProfile } = useProfile()
    const [completed, setCompleted] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [favorited, setFavorited] = useState(false)
    const [favoriteLoading, setFavoriteLoading] = useState(false)

    const VITE_BACKEND_BASE_URL=  import.meta.env.VITE_BACKEND_BASE_URL;

    useEffect(() => {
        if (user && excerpt) {
            fetchCompletionStatus()
            fetchFavoriteStatus()
        }
    }, [user, excerpt])

    const fetchCompletionStatus = async () => {
        try {
            const res = await fetch(`${VITE_BACKEND_BASE_URL}/api/progress/${excerpt.slug}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            if (res.ok) {
                const data = await res.json()
                setCompleted(data.completed || false)
            }
        } catch (err) {
            console.error('Failed to fetch completion status:', err)
        }
    }

    const fetchFavoriteStatus = async () => {
        try {
            const res = await fetch(`${VITE_BACKEND_BASE_URL}/api/auth/me/favorites`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            if (res.ok) {
                const data = await res.json()
                setFavorited(data.includes(excerpt.slug))
            }
        } catch (err) {
            console.error('Failed to fetch favorite status:', err)
        }
    }

    const handlePractice = async () => {
        if (!user) {
            navigate('/login')
            return
        }
        setLoading(true)
        setError('')
        try {
            const res = await fetch(`${VITE_BACKEND_BASE_URL}/api/progress`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ 
                    excerptSlug: excerpt.slug, 
                    completed: !completed 
                })
            })
            if (!res.ok) throw new Error('Failed to update practice status')
            setCompleted(!completed)

            if (onProgressUpdate) {
                onProgressUpdate()
            }
            refreshProfile()
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleFavorite = async () => {
        if (!user) {
            navigate('/login')
            return
        }
        setFavoriteLoading(true)
        try {
            const res = await fetch(`${VITE_BACKEND_BASE_URL}/api/auth/me/favorites`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ excerptSlug: excerpt.slug })
            })
            if (res.ok) {
                const data = await res.json()
                setFavorited(data.includes(excerpt.slug))
                refreshProfile()
            }
        } catch (err) {
            console.error('Failed to fetch favorite status:', err)
        } finally {
            setFavoriteLoading(false)
        }
    }

    return (
        <section className="bg-white border border-gray-100 p-6 rounded-lg shadow space-y-6 relative">
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-serif font-bold text-gray-800">
                    {excerpt.title}
                </h2>
                <div className="flex items-center space-x-2">
                    {user && (
                        <button
                            className="text-yellow-500 hover:text-yellow-700 transition"
                            onClick={handleFavorite}
                            disabled={favoriteLoading}
                            aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
                        >
                            <Bookmark className="w-7 h-7" fill={favorited ? 'currentColor' : 'none'} strokeWidth={favorited ? 0 : 2} />
                        </button>
                    )}
                    {showClose && onClose && (
                        <button
                            className="ml-1 text-gray-400 hover:text-gray-700 transition"
                            onClick={onClose}
                            aria-label="Close"
                        >
                            <XIcon className="w-7 h-7" />
                        </button>
                    )}
                </div>
            </div>
            <p className="text-gray-600 mb-2">
                {excerpt.composer} • {excerpt.work}
            </p>

            <div className="flex flex-wrap gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    excerpt.difficulty === 1 ? 'bg-green-200 text-green-800' :
                    excerpt.difficulty === 2 ? 'bg-blue-200 text-blue-800' :
                    excerpt.difficulty === 3 ? 'bg-yellow-200 text-yellow-800' :
                    excerpt.difficulty === 4 ? 'bg-orange-200 text-orange-800' :
                    'bg-red-200 text-red-800'
                }`}>
                    Level {excerpt.difficulty}
                </span>
                <span className="px-3 py-1 border rounded-full text-sm text-gray-600">
                    {excerpt.key}
                </span>
                {excerpt.tags.map((tag, idx) => (
                    <span
                        key={idx}
                        className="px-3 py-1 border rounded-full text-sm text-gray-600"
                    >
                        {tag}
                    </span>
                ))}
            </div>

            <p className="text-sm text-gray-700">
                Measures: {excerpt.measureStart}–{excerpt.measureEnd}
            </p>

            <div className="bg-yellow-50 border-2 border-dashed border-yellow-300 p-6 rounded text-center">
                <p className="text-yellow-700 font-medium mb-4">🎵 Sheet Music</p>
                <img
                    src={excerpt.sheetMusicURL}
                    alt={`${excerpt.title} Sheet Music`}
                    className="mx-auto max-h-80 w-full object-contain rounded-md border border-yellow-200"
                />
            </div>

            <CustomAudioPlayer src={excerpt.audioURL} />

            {!readOnly && (
                <button
                    className={`w-full py-2 rounded transition font-semibold ${completed ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-yellow-600 text-white hover:bg-yellow-700'} ${loading ? 'opacity-60' : ''}`}
                    onClick={handlePractice}
                    disabled={loading}
                >
                    {loading ? 'Saving...' : completed ? 'Completed' : 'Mark as Practiced'}
                </button>
            )}
            {error && <div className="text-red-600 text-sm text-center mt-2">{error}</div>}
        </section>
    )
}