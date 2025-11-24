import React, { useRef, useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';

const Camera = ({ onFaceDetect, onCameraActive }) => {
  const videoRef = useRef();
  const canvasRef = useRef();
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);

  // Load face-api.js models
  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = '/models';
        
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        ]);
        
        setModelsLoaded(true);
        console.log('Face detection models loaded successfully');
      } catch (error) {
        console.error('Error loading models:', error);
        // Fallback to basic detection if models fail to load
        setModelsLoaded(false);
      }
    };

    loadModels();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        } 
      });
      
      videoRef.current.srcObject = stream;
      setIsCameraOn(true);
      onCameraActive(true);
      
      // Start face detection once video is playing
      videoRef.current.onplaying = () => {
        startFaceDetection();
      };
      
    } catch (error) {
      console.error('Camera access error:', error);
      alert('Camera access nahi mila! Permission check karein.');
    }
  };

  const startFaceDetection = () => {
    if (!modelsLoaded) {
      startBasicFaceDetection();
      return;
    }

    const detectFaces = async () => {
      if (!videoRef.current || videoRef.current.paused) return;

      try {
        const detections = await faceapi
          .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks();

        if (detections.length > 0) {
          const mainFace = detections[0];
          const canvas = canvasRef.current;
          
          // Calculate face position percentage
          const relativeX = (mainFace.detection.box.x / videoRef.current.videoWidth) * 100;
          const relativeY = (mainFace.detection.box.y / videoRef.current.videoHeight) * 100;
          
          onFaceDetect({
            x: Math.max(10, Math.min(90, relativeX)),
            y: Math.max(10, Math.min(90, relativeY))
          });
        }
      } catch (error) {
        console.error('Face detection error:', error);
        // Fallback to basic detection
        startBasicFaceDetection();
        return;
      }

      requestAnimationFrame(detectFaces);
    };

    detectFaces();
  };

  const startBasicFaceDetection = () => {
    const detectFace = () => {
      if (!videoRef.current || videoRef.current.paused) return;
      
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      // Canvas setup
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Simple brightness-based face detection
      const faceData = detectSimpleFace(ctx, canvas.width, canvas.height);
      if (faceData) {
        onFaceDetect(faceData);
      }
      
      requestAnimationFrame(detectFace);
    };
    
    detectFace();
  };

  const detectSimpleFace = (ctx, width, height) => {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    
    let totalX = 0, totalY = 0, brightPixels = 0;
    
    // Detect bright areas (simple face detection)
    for (let y = 0; y < height; y += 8) {
      for (let x = 0; x < width; x += 8) {
        const i = (y * width + x) * 4;
        const brightness = (data[i] + data[i+1] + data[i+2]) / 3;
        
        if (brightness > 160) {
          totalX += x;
          totalY += y;
          brightPixels++;
        }
      }
    }
    
    if (brightPixels > 100) {
      return {
        x: (totalX / brightPixels / width) * 100,
        y: (totalY / brightPixels / height) * 100
      };
    }
    
    return null;
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraOn(false);
    onCameraActive(false);
  };

  return (
    <div className="camera-container">
      <div className="camera-box">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline
          muted
          className="camera-video"
        />
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        
        {!isCameraOn && (
          <div className="camera-placeholder">
            <div className="placeholder-content">
              <div className="camera-icon">📷</div>
              <p>Camera start karein pet ke saath khelne ke liye!</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="camera-controls">
        {!isCameraOn ? (
          <button 
            onClick={startCamera}
            className="btn btn-start"
            disabled={!modelsLoaded && modelsLoaded !== false}
          >
            {modelsLoaded === false ? 'Loading...' : '📷 Camera Start Karein'}
          </button>
        ) : (
          <button 
            onClick={stopCamera}
            className="btn btn-stop"
          >
            ⏹️ Camera Band Karein
          </button>
        )}
      </div>
      
      {modelsLoaded === false && (
        <div className="model-warning">
          <small>Advanced face detection load nahi ho paayi. Basic detection use ho rahi hai.</small>
        </div>
      )}
    </div>
  );
};

export default Camera;
