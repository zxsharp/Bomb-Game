import {memo} from 'react';
import '../App.css'

const GameButton = memo(({ color, onPress, isPressed }) => (
  <div className="button-container">
    <button
      className={`button ${color} ${isPressed ? 'pressed' : ''}`}
      onClick={() => onPress(color)}
    >
      <div className="button-top"></div>
      <div className="button-shadow"></div>
    </button>
    <div className={`button-base ${color}`}></div>
  </div>
));

const Wire = memo(({ color, isCut, onCut }) => (
  <div
    className={`wire ${color} ${isCut ? 'cut' : ''}`}
    onClick={() => onCut(color)}
  />
));

const Timer = memo(({ time }) => (
  <div className="timer">
    {`${Math.floor(time / 60)}:${(time % 60).toString().padStart(2, '0')}`}
  </div>
));

const ProgressBar = memo(({ pressedButtons, wiresCut }) => {
  const totalSteps = 3;
  const completedSteps = wiresCut.length;
  const activeButtons = Object.values(pressedButtons).filter(Boolean).length;

  return (
    <div className="progress-container">
      <div className="progress-bar">
        {[...Array(totalSteps)].map((_, index) => (
          <div 
            key={index} 
            className={`progress-step ${
              index < completedSteps ? 'completed' : 
              index < activeButtons ? 'active' : ''
            }`}
          >
            {index < completedSteps ? '✓' : 
             index < activeButtons ? '!' : 
             index + 1}
          </div>
        ))}
        <div 
          className="progress-fill" 
          style={{ width: `${(completedSteps / totalSteps) * 100}%` }}
        ></div>
      </div>
    </div>
  );
});


export { GameButton, Wire, Timer, ProgressBar };
