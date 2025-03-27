const createGameSounds = () => {
    const sounds = {
      buttonPress: new Audio('/sounds/button-press.mp3'),
      buttonRelease: new Audio('/sounds/button-press.mp3'),
      wireCut: new Audio('/sounds/wire-cut.mp3'),
      explosion: new Audio('/sounds/explosion.mp3'),
      victory: new Audio('/sounds/victory.mp3')
    };
  
    // Create a single tick sound instance that can loop
    const tickSound = new Audio('/sounds/tick.mp3');
    tickSound.loop = true; // Enable looping for continuous ticking
  
    // Function to play sound with error handling
    const playSound = (soundName) => {
      try {
        const sound = sounds[soundName];
        if (sound) {
          sound.currentTime = 0;
          sound.play().catch(error => console.log('Sound play failed:', error));
        }
      } catch (error) {
        console.log('Sound error:', error);
      }
    };
  
    // Function to start ticking
    const startTicking = () => {
      tickSound.play().catch(error => console.log('Tick sound failed:', error));
    };
  
    // Function to stop ticking
    const stopTicking = () => {
      tickSound.pause();
      tickSound.currentTime = 0;
    };
  
    return { playSound, startTicking, stopTicking };
  };
  
  export default createGameSounds;