import { FC, useContext, useEffect, useRef, useState } from "react";
import { CurrentTrackContext } from "~/context/CurrentTrackContext";
import Pause from "~/icons/Pause";
import Play from "~/icons/Play";

//TODO - noticed that the play/pause isn't always right when switching tracks

const AudioPlayer: FC = () => {
  const { currentTrack } = useContext(CurrentTrackContext);
  const audioRef = useRef<HTMLMediaElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setPlaying = () => setIsPlaying(true);
    const setPaused = () => setIsPlaying(false);
    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration || 0);

    audio.addEventListener("play", setPlaying);
    audio.addEventListener("pause", setPaused);
    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);

    // Cleanup function to remove event listeners
    return () => {
      audio.removeEventListener("play", setPlaying);
      audio.removeEventListener("pause", setPaused);
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
    };
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        const audio = audioRef.current;
        if (audio) {
          setCurrentTime(audio.currentTime);
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isPlaying]);

  const formatTime = (seconds: number) => {
    const rounded = Math.floor(seconds);
    const minutes = Math.floor(rounded / 60);
    const remainingSeconds = rounded % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <div className="flex flex-row items-center gap-4">
      <audio ref={audioRef} src={currentTrack} hidden autoPlay>
        <track kind="captions" />
      </audio>
      <button className="btn btn-primary text-white" onClick={togglePlayPause}>
        {isPlaying ? <Pause /> : <Play />}
      </button>
      <div className="flex flex-row gap-2">
        <span>{formatTime(currentTime)}</span>
        <input
          className="range range-primary"
          type="range"
          value={currentTime}
          step="1"
          min="0"
          max={duration}
          onChange={(e) => {
            const audio = audioRef.current;
            if (audio) {
              audio.currentTime = Number(e.target.value);
              setCurrentTime(audio.currentTime);
            }
          }}
        />
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
};

export default AudioPlayer;
