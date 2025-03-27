import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { GameButton, Wire, Timer, ProgressBar } from './components/allComponents';
import createGameSounds from './sounds';
import './App.css';

//initialize sounds
const { playSound, startTicking, stopTicking } = createGameSounds();

const BombGame = () => {
  const [time, setTime] = useState(60); // 5 minutes in seconds
  const [isExploded, setIsExploded] = useState(false);
  const [isDefused, setIsDefused] = useState(false);
  const [gameState, setGameState] = useState({
    wiresCut: [],
    pressedButtons: {
      blue: false,
      yellow: false,
      green: false
    }
  });
  const [isSoundEnabled, setSoundEnabled] = useState(false);

  // Available colors (removed red)
  const wires = useMemo(() => ['blue', 'red', 'yellow', 'green'], []);
  const buttons = useMemo(() => ['blue', 'yellow', 'green'], []);


  // Timer effect
  useEffect(() => {
    if (!isExploded && !isDefused) {
      // Start ticking when the game starts
      if (isSoundEnabled) {
        startTicking();
      }

      const timer = setInterval(() => {
        setTime(prevTime => {
          if (prevTime <= 1) {
            if (isSoundEnabled) {
              stopTicking();
              playSound('explosion');
            }
            setIsExploded(true);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => {
        clearInterval(timer);
        stopTicking();
      };
    }
    return () => stopTicking();
  }, [isExploded, isDefused, isSoundEnabled]);

  // Handle wire cut
  const handleWireCut = useCallback((wire) => {
    if (isExploded || isDefused) return;

    setGameState(prev => {
      if (!prev.pressedButtons[wire] || wire === 'red') {
        if (isSoundEnabled) {
          stopTicking();
          playSound('explosion');
        }
        setIsExploded(true);
        return prev;
      }

      if (prev.wiresCut.includes(wire)) {
        return prev;
      }

      if (isSoundEnabled) {
        playSound('wireCut');
      }

      const newWiresCut = [...prev.wiresCut, wire];

      const allPressedButtonsWiresCut = Object.entries(prev.pressedButtons).every(
        ([color, isPressed]) => !isPressed || newWiresCut.includes(color)
      );

      const onlyPressedButtonsWiresCut = newWiresCut.every(
        color => prev.pressedButtons[color]
      );

      if (allPressedButtonsWiresCut && 
          onlyPressedButtonsWiresCut && 
          Object.values(prev.pressedButtons).filter(Boolean).length === 3) {
        if (isSoundEnabled) {
          stopTicking();
          setTimeout(() => playSound('victory'), 500);
        }
        setIsDefused(true);
      }

      return {
        ...prev,
        wiresCut: newWiresCut
      };
    });
  }, [isExploded, isDefused, isSoundEnabled]);


  const handleButtonPress = useCallback((color) => {
    if (isExploded || isDefused) return;

    setGameState(prev => {
      const newState = !prev.pressedButtons[color];
      if (isSoundEnabled) {
        playSound(newState ? 'buttonPress' : 'buttonRelease');
      }
      return {
        ...prev,
        pressedButtons: {
          ...prev.pressedButtons,
          [color]: newState
        }
      };
    });
  }, [isExploded, isDefused, isSoundEnabled]);


  const handleSoundToggle = useCallback(() => {
    setSoundEnabled(prev => {
      if (!prev) {
        if (!isExploded && !isDefused) {
          startTicking();
        }
      } else {
        stopTicking();
      }
      return !prev;
    });
  }, [isExploded, isDefused]);


  const gameMessage = useMemo(() => {
    if (isExploded) return <div className="message">BOOM! Game Over!</div>;
    if (isDefused) return <div className="message">Bomb Defused! You Win!</div>;
    return null;
  }, [isExploded, isDefused]);


  const resetGame = useCallback(() => {
    setTime(60);
    setIsExploded(false);
    setIsDefused(false);
    setGameState({
      wiresCut: [],
      pressedButtons: {
        blue: false,
        yellow: false,
        green: false
      }
    });
    if (isSoundEnabled) {
      startTicking();
    }
  }, [isSoundEnabled]);


  return (
    <div className="game-wrapper">
      <div className="bomb-container">
        <div className={`bomb ${isExploded ? 'exploded' : ''} ${isDefused ? 'defused' : ''}`}>
          <div className="sound-toggle">
            <button 
              className={`sound-button ${isSoundEnabled ? 'enabled' : 'disabled'}`}
              onClick={handleSoundToggle}
            >
              {isSoundEnabled ? '🔊' : '🔈'}
            </button>
          </div>

          <Timer time={time} />
          
          <div className="wires-container">
            {wires.map((wire) => (
              <Wire
                key={wire}
                color={wire}
                isCut={gameState.wiresCut.includes(wire)}
                onCut={handleWireCut}
              />
            ))}
          </div>
          
          
          <div className="buttons-container">
            {buttons.map((color) => (
              <GameButton
                key={color}
                color={color}
                onPress={handleButtonPress}
                isPressed={gameState.pressedButtons[color]}
              />
            ))}
          </div>

          <ProgressBar 
            pressedButtons={gameState.pressedButtons}
            wiresCut={gameState.wiresCut}
          />

          {(isExploded || isDefused) && (
            <div className="game-over-overlay">
              <div className="game-over-content">
                <h2>{isExploded ? 'BOOM! Game Over!' : 'Bomb Defused! You Win!'}</h2>
                <button className="retry-button" onClick={resetGame}>
                  Try Again
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>  
  );
};

export default React.memo(BombGame);