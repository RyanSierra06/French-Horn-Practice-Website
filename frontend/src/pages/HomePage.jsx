import React from 'react'
import { Link } from 'react-router-dom'
import { Headphones, Calendar, User, Music, Target, BookOpen, Trophy } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext.jsx'

export default function HomePage() {
    const { user } = useAuth()

    return (
        <div className="min-h-screen bg-yellow-50">
            <main className="max-w-6xl mx-auto p-6 space-y-12 pt-24">
                <section className="text-center space-y-6">
                    <div className="flex justify-center mb-6">
                        <div className="w-20 h-20 rounded-full bg-yellow-200 flex items-center justify-center shadow-lg">
                            <img
                                src="/122355-200.png"
                                alt="French Horn Icon"
                                className="w-12 h-12 object-contain"
                                draggable={false}
                            />
                        </div>
                    </div>
                    <h1 className="text-5xl font-serif font-bold text-gray-800 leading-tight">
                        33 Days of French Horn
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Master the greatest orchestral excerpts in just 33 days.
                        A structured practice program designed for High School, College, and Professional French horn players.
                    </p>
                    <div className="flex justify-center space-x-4 pt-4">
                        <Link 
                            to="/today" 
                            className="flex items-center space-x-2 px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition shadow-md"
                        >
                            <Headphones className="w-5 h-5" />
                            <span>Start Practicing</span>
                        </Link>
                        {!user && (
                            <Link 
                                to="/register" 
                                className="flex items-center space-x-2 px-6 py-3 bg-white text-yellow-700 border-2 border-yellow-600 rounded-lg hover:bg-yellow-50 transition shadow-md"
                            >
                                <User className="w-5 h-5" />
                                <span>Create Account</span>
                            </Link>
                        )}
                    </div>
                </section>

                <section className="space-y-8">
                    <h2 className="text-3xl font-serif font-bold text-gray-800 text-center">
                        What You'll Get
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="bg-white p-6 rounded-lg shadow-md border border-yellow-100 hover:transform hover:scale-105 hover:shadow-xl transition-all duration-300 ease-in-out cursor-pointer">
                            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                                <Music className="w-6 h-6 text-yellow-700" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">33 Essential Excerpts</h3>
                            <p className="text-gray-600">
                                A carefully curated selection of frequently requested orchestral excerpts,
                                from Bach to Strauss.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md border border-yellow-100 hover:transform hover:scale-105 hover:shadow-xl transition-all duration-300 ease-in-out cursor-pointer">
                            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                                <Target className="w-6 h-6 text-yellow-700" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Daily Practice Structure</h3>
                            <p className="text-gray-600">
                                One excerpt per day with high quality sheet music and audio recordings built for success.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md border border-yellow-100 hover:transform hover:scale-105 hover:shadow-xl transition-all duration-300 ease-in-out cursor-pointer">
                            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                                <Calendar className="w-6 h-6 text-yellow-700" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Progress Tracking</h3>
                            <p className="text-gray-600">
                                Monitor your daily progress, mark completed excerpts, and track your practice streak.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md border border-yellow-100 hover:transform hover:scale-105 hover:shadow-xl transition-all duration-300 ease-in-out cursor-pointer">
                            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                                <BookOpen className="w-6 h-6 text-yellow-700" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Detailed Resources</h3>
                            <p className="text-gray-600">
                                Professional audio recordings and legible sheet music, all with different keys, time signatures, and tempos.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md border border-yellow-100 hover:transform hover:scale-105 hover:shadow-xl transition-all duration-300 ease-in-out cursor-pointer">
                            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                                <Trophy className="w-6 h-6 text-yellow-700" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">The Goal</h3>
                            <p className="text-gray-600">
                                Don't spend forever choosing what to practice, just log in and find a new excerpt you'll soon fall in love with.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md border border-yellow-100 hover:transform hover:scale-105 hover:shadow-xl transition-all duration-300 ease-in-out cursor-pointer">
                            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                                <User className="w-6 h-6 text-yellow-700" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Personalized Experience</h3>
                            <p className="text-gray-600">
                                Create an account to save your progress, bookmark favorite excerpts, and access past excerpts.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="bg-white rounded-lg shadow-md border border-yellow-100 p-8">
                    <h2 className="text-3xl font-serif font-bold text-gray-800 text-center mb-8">
                        How It Works
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 bg-yellow-600 text-white rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                                1
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800">Start Your Journey</h3>
                            <p className="text-gray-600">
                                Begin with today's excerpt. Each day features a new piece from the orchestral repertoire.
                            </p>
                        </div>
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 bg-yellow-600 text-white rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                                2
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800">Practice Daily</h3>
                            <p className="text-gray-600">
                                Use the provided sheet music and audio recordings to practice each excerpt thoroughly.
                            </p>
                        </div>
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 bg-yellow-600 text-white rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                                3
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800">Track Progress</h3>
                            <p className="text-gray-600">
                                Mark excerpts as completed, build your streak, and watch your skills improve over 33 days.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="text-center space-y-6 bg-yellow-100 rounded-lg p-8">
                    <h2 className="text-3xl font-serif font-bold text-gray-800">
                        Ready to Master the French Horn?
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Create an account today, start tracking your progress, and enjoy playing through classical music you'll soon fall in love with.
                    </p>
                    <div className="flex justify-center space-x-4">
                        <Link 
                            to="/today" 
                            className="flex items-center space-x-2 px-8 py-4 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition shadow-lg text-lg font-semibold"
                        >
                            <Headphones className="w-6 h-6" />
                            <span>Begin Today's Practice</span>
                        </Link>
                        {!user && (
                            <Link 
                                to="/register" 
                                className="flex items-center space-x-2 px-8 py-4 bg-white text-yellow-700 border-2 border-yellow-600 rounded-lg hover:bg-yellow-50 transition shadow-lg text-lg font-semibold"
                            >
                                <User className="w-6 h-6" />
                                <span>Create Free Account</span>
                            </Link>
                        )}
                    </div>
                </section>
            </main>
        </div>
    )
}
