import React, { useState, useEffect } from 'react';

function Timer({ onSessionComplete }) {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isWorkSession, setIsWorkSession] = useState(true);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      const intervalId = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearInterval(intervalId);
    } else if (timeLeft === 0) {
      onSessionComplete();
      if (Notification.permission === 'granted') {
        new Notification('Pomodoro Timer', {
          body: 'Time is up! Please switch back to PomoBeats to reset the timer.',
        });
      } else {
        alert('Time is up! Please switch back to the Pomobeats to reset the timer.');
      }
      setIsRunning(false);
    }
  }, [isRunning, timeLeft, onSessionComplete]);

  const startTimer = () => {
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setTimeLeft(isWorkSession ? 25 * 60 : 5 * 60);
    setIsRunning(false);
  };

  const toggleSession = () => {
    setIsWorkSession(!isWorkSession);
    setTimeLeft(!isWorkSession ? 25 * 60 : 5 * 60);
    setIsRunning(false);
  };

  return (
    <div>
      <h2>{isWorkSession ? 'Work Session' : 'Break Session'} Timer</h2>
      <span>{Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</span>
      <button onClick={startTimer}>Start</button>
      <button onClick={pauseTimer}>Pause</button>
      <button onClick={resetTimer}>Reset</button>
      <button onClick={toggleSession}>Switch to {isWorkSession ? 'Break' : 'Work'}</button>
    </div>
  );
}

export default Timer;