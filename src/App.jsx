import React, { useState, useCallback } from 'react';
import Camera from './components/Camera';
import AudioRecorder from './components/AudioRecorder';
import PetAnimation from './components/PetAnimation';
import PetSelector from './components/PetSelector';
import './App.css';

function App() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState('');
  const [facePosition, setFacePosition] = useState({ x: 50, y: 50 });
  const [selectedPet, setSelectedPet] = useState('cat');
  const [isCameraActive, setIsCameraActive] = useState(false);

  const handleFaceDetect = useCallback((position) => {
    if (position) {
      setFacePosition(position);
    }
  }, []);

  const handleRecordingStart = useCallback(() => {
    setIsRecording(true);
  }, []);

  const handleRecordingStop = useCallback((url) => {
    setIsRecording(false);
    setAudioUrl(url);
  }, []);

  return (
    <div className="App">
      <header className="app-header">
        <h1>🎤 Bolne Wala Pet 🐾</h1>
        <p>Apna pet banayein aur use bolwaayein!</p>
      </header>

      <div className="app-container">
        {/* Pet Selection */}
        <PetSelector 
          selectedPet={selectedPet} 
          onPetSelect={setSelectedPet} 
        />

        {/* Main Content */}
        <div className="main-content">
          {/* Camera Section */}
          <div className="camera-section">
            <Camera 
              onFaceDetect={handleFaceDetect}
              onCameraActive={setIsCameraActive}
            />
            
            {/* Pet Animation Overlay */}
            {isCameraActive && (
              <PetAnimation 
                position={facePosition}
                isTalking={isRecording}
                petType={selectedPet}
              />
            )}
          </div>

          {/* Controls Section */}
          <div className="controls-section">
            <AudioRecorder 
              onRecordingStart={handleRecordingStart}
              onRecordingStop={handleRecordingStop}
            />
            
            {audioUrl && (
              <div className="audio-player">
                <h3>🎵 Recorded Audio</h3>
                <audio controls src={audioUrl} className="audio-element" />
                <div className="audio-actions">
                  <a href={audioUrl} download="my-pet-talking.wav" className="download-btn">
                    📥 Download Audio
                  </a>
                  <button 
                    onClick={() => navigator.share?.({ 
                      files: [new File([audioUrl], 'pet-talking.wav')] 
                    })} 
                    className="share-btn"
                  >
                    📤 Share
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="instructions">
          <h3>How to Use:</h3>
          <ol>
            <li>1. Pet select karein</li>
            <li>2. Camera allow karein</li>
            <li>3. Record button dabayein aur bolein</li>
            <li>4. Apna pet aapki aawaz mein bolega!</li>
          </ol>
        </div>
      </div>

      <footer className="app-footer">
        <p>Made with ❤️ using React + Vercel</p>
      </footer>
    </div>
  );
}

export default App;
