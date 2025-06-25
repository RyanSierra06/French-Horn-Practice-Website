import React from 'react'
import { format } from 'date-fns'

export default function HomePage() {
    const today = new Date()
    const excerpt = {
        title: "Scheherazade",
        composer: "Rimsky-Korsakov",
        work: "Festival at Baghdad",
        difficulty: 4,
        key: "E major",
        time: "4/4",
        measures: "234–253",
        tempo: "Allegro molto (♩=168)"
    }
    const progress = {
        completed: 8,
        currentDay: 11,
        streak: 2,
        bestStreak: 4,
        percent: 73
    }

    return (
        <main className="max-w-3xl mx-auto p-6 space-y-8">
            {/* Header */}
            <header className="text-center">
                <h1 className="text-3xl font-serif font-bold">Day {progress.currentDay} • {format(today, 'EEEE, MMMM do')}</h1>
                <p className="text-gray-600 mt-1">Your daily French horn excerpt</p>
            </header>

            {/* Progress Card */}
            <section className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg shadow">
                <h2 className="font-semibold mb-4">Your Progress</h2>
                <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                        <p className="text-sm text-gray-600">Completed</p>
                        <p className="text-xl font-bold text-yellow-700">{progress.completed}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Best Streak</p>
                        <p className="text-xl font-bold text-yellow-700">{progress.bestStreak}</p>
                    </div>
                </div>
                <div className="mt-4 bg-yellow-100 h-2 rounded">
                    <div className="bg-yellow-600 h-2 rounded" style={{ width: `${progress.percent}%` }} />
                </div>
                <p className="text-right text-sm text-yellow-800 mt-1">{progress.percent}%</p>
            </section>

            {/* Excerpt Card */}
            <section className="bg-white border border-gray-100 p-6 rounded-lg shadow">
                <h2 className="text-2xl font-serif font-bold">{excerpt.title}</h2>
                <p className="text-gray-600 mb-4">{excerpt.composer} • {excerpt.work}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-3 py-1 bg-yellow-200 text-yellow-800 rounded-full text-sm">Level {excerpt.difficulty}</span>
                    <span className="px-3 py-1 border rounded-full text-sm text-gray-600">{excerpt.key}</span>
                    <span className="px-3 py-1 border rounded-full text-sm text-gray-600">{excerpt.time}</span>
                </div>

                <p className="text-sm text-gray-700 mb-4">{excerpt.tempo}</p>
                <p className="text-sm text-gray-700 mb-6">Measures: {excerpt.measures}</p>

                <div className="bg-yellow-50 border-2 border-dashed border-yellow-300 p-8 rounded text-center mb-6">
                    <p className="text-yellow-700 font-medium">🎵 Sheet Music</p>
                    <p className="text-xs text-gray-500 mt-1">{excerpt.measures}</p>
                </div>

                <button className="w-full py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition">
                    Mark as Practiced
                </button>
            </section>

            {/* Practice Tips */}
            <section className="bg-green-50 border border-green-200 p-6 rounded-lg">
                <h3 className="font-semibold mb-3">Practice Tips</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                    <li>Start slow to ensure accuracy</li>
                    <li>Focus on breath support and tone</li>
                    <li>Break difficult passages into sections</li>
                    <li>Record yourself to track progress</li>
                    <li>Mark as completed when satisfied</li>
                </ul>
            </section>
        </main>
    )
}
