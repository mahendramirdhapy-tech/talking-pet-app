import { useState, useEffect } from 'react';
import * as faceapi from 'face-api.js';

export const useFaceDetection = () => {
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [faceData, setFaceData] = useState(null);

  useEffect(() => {
    const loadModels = async () => {
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
          faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        ]);
        setModelsLoaded(true);
      } catch (error) {
        console.error('Error loading face detection models:', error);
        setModelsLoaded(false);
      }
    };

    loadModels();
  }, []);

  const detectFace = async (videoElement) => {
    if (!modelsLoaded || !videoElement) return null;

    try {
      const detection = await faceapi
        .detectSingleFace(videoElement, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks();

      if (detection) {
        const { x, y, width, height } = detection.detection.box;
        const newFaceData = {
          x: (x / videoElement.videoWidth) * 100,
          y: (y / videoElement.videoHeight) * 100,
          width: (width / videoElement.videoWidth) * 100,
          height: (height / videoElement.videoHeight) * 100
        };
        setFaceData(newFaceData);
        return newFaceData;
      }
      
      setFaceData(null);
      return null;
    } catch (error) {
      console.error('Face detection error:', error);
      return null;
    }
  };

  return { modelsLoaded, faceData, detectFace };
};
