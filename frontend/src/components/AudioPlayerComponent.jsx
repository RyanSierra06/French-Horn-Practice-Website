import React, { useRef, useState, useEffect } from 'react'
import { Play, Pause, Volume2, VolumeX } from 'lucide-react'

export default function CustomAudioPlayer({ src }) {
    const audioRef = useRef(null)
    const progressRef = useRef(null)
    const volumeRef = useRef(null)
    const containerRef = useRef(null)

    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [volume, setVolume] = useState(1)

    const [progressHovered, setProgressHovered] = useState(false)
    const [progressDragging, setProgressDragging] = useState(false)
    const [showVolumeSlider, setShowVolumeSlider] = useState(false)
    const [volumeDragging, setVolumeDragging] = useState(false)

    const togglePlay = () => {
        if (!audioRef.current) return
        isPlaying ? audioRef.current.pause() : audioRef.current.play()
        setIsPlaying(!isPlaying)
    }

    useEffect(() => {
        const audio = audioRef.current
        if (!audio) return

        audio.volume = volume

        const onLoaded = () => setDuration(audio.duration)
        const onTimeUpdate = () => {
            if (!progressDragging) setCurrentTime(audio.currentTime)
        }
        const onEnded = () => {
            setIsPlaying(false)
        }

        audio.addEventListener('loadedmetadata', onLoaded)
        audio.addEventListener('timeupdate', onTimeUpdate)
        audio.addEventListener('ended', onEnded)

        return () => {
            audio.removeEventListener('loadedmetadata', onLoaded)
            audio.removeEventListener('timeupdate', onTimeUpdate)
            audio.removeEventListener('ended', onEnded)
        }
    }, [volume, progressDragging])

    const fmt = secs => {
        const m = Math.floor(secs / 60)
        const s = Math.floor(secs % 60).toString().padStart(2, '0')
        return `${m}:${s}`
    }

    const setCurrentTimeByPos = clientX => {
        if (!progressRef.current) return
        const { left, width } = progressRef.current.getBoundingClientRect()
        let pct = (clientX - left) / width
        pct = Math.max(0, Math.min(1, pct))
        const newTime = pct * duration
        audioRef.current.currentTime = newTime
        setCurrentTime(newTime)
    }
    const onProgressMouseDown = e => { e.preventDefault(); setProgressDragging(true); setCurrentTimeByPos(e.clientX) }
    const onProgressMouseMove = e => progressDragging && setCurrentTimeByPos(e.clientX)
    const onProgressMouseUp = () => setProgressDragging(false)

    useEffect(() => {
        if (progressDragging) {
            window.addEventListener('mousemove', onProgressMouseMove)
            window.addEventListener('mouseup', onProgressMouseUp)
            document.body.style.userSelect = 'none'
        } else {
            window.removeEventListener('mousemove', onProgressMouseMove)
            window.removeEventListener('mouseup', onProgressMouseUp)
            document.body.style.userSelect = 'auto'
        }
        return () => {
            window.removeEventListener('mousemove', onProgressMouseMove)
            window.removeEventListener('mouseup', onProgressMouseUp)
            document.body.style.userSelect = 'auto'
        }
    }, [progressDragging])

    const setVolByPos = clientY => {
        if (!volumeRef.current) return
        const { top, height } = volumeRef.current.getBoundingClientRect()
        let pct = 1 - (clientY - top) / height
        pct = Math.max(0, Math.min(1, pct))
        audioRef.current.volume = pct
        setVolume(pct)
    }
    const handleVolMouseDown = e => { e.preventDefault(); setVolumeDragging(true); setVolByPos(e.clientY) }
    const handleVolMouseMove = e => volumeDragging && setVolByPos(e.clientY)
    const endVolumeDrag = () => {
        setVolumeDragging(false)
        setShowVolumeSlider(false)
    }

    useEffect(() => {
        if (volumeDragging) {
            window.addEventListener('mousemove', handleVolMouseMove)
            window.addEventListener('mouseup', endVolumeDrag)
            document.body.style.userSelect = 'none'
        } else {
            window.removeEventListener('mousemove', handleVolMouseMove)
            window.removeEventListener('mouseup', endVolumeDrag)
            document.body.style.userSelect = 'auto'
        }
        return () => {
            window.removeEventListener('mousemove', handleVolMouseMove)
            window.removeEventListener('mouseup', endVolumeDrag)
            document.body.style.userSelect = 'auto'
        }
    }, [volumeDragging])

    const toggleVolumeSlider = () => setShowVolumeSlider(v => !v)

    useEffect(() => {
        const handleClickOutside = e => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setShowVolumeSlider(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div ref={containerRef} className="bg-yellow-100 border border-yellow-300 rounded-md p-4 mb-6 relative select-none">
            <audio ref={audioRef} src={src} preload="metadata" />
            <div className="flex items-center space-x-4">
                <button
                    onClick={togglePlay}
                    className="w-10 h-10 flex items-center justify-center bg-yellow-600 text-white rounded-full hover:bg-yellow-700 transition"
                >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </button>

                <div className="flex flex-col flex-1 cursor-pointer select-none">
                    <div
                        ref={progressRef}
                        className="h-2 bg-yellow-300 rounded-full relative"
                        onClick={e => !progressDragging && setCurrentTimeByPos(e.clientX)}
                        onMouseEnter={() => setProgressHovered(true)}
                        onMouseLeave={() => setProgressHovered(false)}
                        onMouseDown={onProgressMouseDown}
                    >
                        <div
                            className="h-2 bg-yellow-600 rounded-full"
                            style={{ width: duration ? `${(currentTime / duration) * 100}%` : '0%' }}
                        />
                        {(progressHovered || progressDragging) && (
                            <div
                                className="absolute top-1/2 w-3 h-3 bg-yellow-800 rounded-full"
                                style={{
                                    left: duration ? `${(currentTime / duration) * 100}%` : '0%',
                                    transform: 'translate(-50%, -50%)',
                                    pointerEvents: 'none',
                                }}
                            />
                        )}
                    </div>
                    <div className="flex justify-between text-xs text-gray-600 mt-1 select-text">
                        <span>{fmt(currentTime)}</span>
                        <span>{fmt(duration)}</span>
                    </div>
                </div>

                <div className="relative">
                    <button
                        onClick={toggleVolumeSlider}
                        className="w-10 h-10 flex items-center justify-center text-yellow-600 hover:text-yellow-800 transition"
                    >
                        {volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </button>
                    {showVolumeSlider && (
                        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 flex items-end">
                            <div
                                ref={volumeRef}
                                className="w-2 h-24 bg-yellow-300 rounded-full cursor-pointer relative"
                                onMouseDown={handleVolMouseDown}
                            >
                                <div
                                    className="w-2 bg-yellow-600 rounded-full absolute bottom-0"
                                    style={{ height: `${volume * 100}%` }}
                                />
                                {(showVolumeSlider || volumeDragging) && (
                                    <div
                                        className="absolute w-3 h-3 bg-yellow-800 rounded-full"
                                        style={{
                                            bottom: `calc(${volume * 100}% - 6px)`,
                                            left: '50%',
                                            transform: 'translate(-50%, 0)',
                                        }}
                                    />
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
