import React, { useState, useRef, useEffect } from 'react';

const AudioRecorder = ({ onRecordingStart, onRecordingStop }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);

  useEffect(() => {
    return () => {
      // Cleanup
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const setupAudioAnalysis = (stream) => {
    try {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      analyserRef.current.fftSize = 256;
    } catch (error) {
      console.warn('Audio analysis not supported:', error);
    }
  };

  const updateAudioLevel = () => {
    if (!analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);

    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      sum += dataArray[i];
    }
    const average = sum / dataArray.length;
    setAudioLevel(Math.min(100, (average / 256) * 200));
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        } 
      });
      
      setupAudioAnalysis(stream);

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { 
          type: 'audio/wav' 
        });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        if (onRecordingStop) {
          onRecordingStop(audioUrl);
        }
        
        // Cleanup
        stream.getTracks().forEach(track => track.stop());
        if (audioContextRef.current) {
          audioContextRef.current.close();
        }
      };

      mediaRecorder.start(100); // Collect data every 100ms
      setIsRecording(true);
      if (onRecordingStart) onRecordingStart();

      // Timer and audio level updates
      let time = 0;
      timerRef.current = setInterval(() => {
        time++;
        setRecordingTime(time);
        updateAudioLevel();
      }, 1000);

    } catch (error) {
      console.error('Recording error:', error);
      alert('Microphone access nahi mila! Permission check karein.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setAudioLevel(0);
      clearInterval(timerRef.current);
      setRecordingTime(0);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="audio-recorder">
      <h3>🎤 Audio Recording</h3>
      
      {isRecording && (
        <div className="recording-display">
          <div className="recording-indicator">
            <div className="pulse-dot"></div>
            <span>Recording... {formatTime(recordingTime)}</span>
          </div>
          
          <div className="audio-level">
            <div 
              className="level-bar" 
              style={{ width: `${audioLevel}%` }}
            ></div>
          </div>
          
          <div className="recording-tip">
            🎙️ Bolna shuru karein! Pet aapki aawaz copy karega
          </div>
        </div>
      )}
      
      <div className="recorder-controls">
        {!isRecording ? (
          <button 
            onClick={startRecording}
            className="btn btn-record recording-pulse"
          >
            🎤 Record Start
          </button>
        ) : (
          <button 
            onClick={stopRecording}
            className="btn btn-stop"
          >
            ⏹️ Record Stop
          </button>
        )}
      </div>
      
      {!isRecording && (
        <div className="recording-tips">
          <h4>Tips:</h4>
          <ul>
            <li>• Clear aur loud bolein</li>
            <li>• Background noise kam karein</li>
            <li>• 30 seconds tak record kar sakte hain</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
