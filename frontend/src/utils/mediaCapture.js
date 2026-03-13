/**
 * Media Capture Utilities for the SafeNest MVP.
 * Handles recording audio, video, and capturing intruder selfies.
 * Converts blobs to data URLs for easier LocalStorage persistence.
 */

const blobToDataURL = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

// 1. Automatic Audio Evidence Capture
export const captureAudio = async (durationMs = 60000) => {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error('Audio capture not supported in this browser.');
  }

  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const mediaRecorder = new MediaRecorder(stream);
  const audioChunks = [];

  return new Promise((resolve) => {
    mediaRecorder.addEventListener('dataavailable', (event) => {
      audioChunks.push(event.data);
    });

    mediaRecorder.addEventListener('stop', async () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
      // Stop all tracks to release the microphone
      stream.getTracks().forEach((track) => track.stop());
      
      const fileRef = await blobToDataURL(audioBlob);
      resolve({
        timestamp: new Date().toISOString(),
        duration: durationMs,
        fileRef,
        type: 'audio/webm'
      });
    });

    mediaRecorder.start();
    
    // Auto-stop after duration
    setTimeout(() => {
      if (mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
      }
    }, durationMs);
  });
};

// 2. Quick Video Snapshot
export const captureVideo = async (durationMs = 5000) => {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error('Video capture not supported in this browser.');
  }

  // Use front camera ('user') for evidence
  const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: true });
  const mediaRecorder = new MediaRecorder(stream);
  const videoChunks = [];

  return new Promise((resolve) => {
    mediaRecorder.addEventListener('dataavailable', (event) => {
      videoChunks.push(event.data);
    });

    mediaRecorder.addEventListener('stop', async () => {
      const videoBlob = new Blob(videoChunks, { type: 'video/webm' });
      // Stop all tracks to release camera/mic
      stream.getTracks().forEach((track) => track.stop());
      
      const fileRef = await blobToDataURL(videoBlob);
      resolve({
        timestamp: new Date().toISOString(),
        fileName: `video_evidence_${Date.now()}.webm`,
        fileRef,
        type: 'video/webm'
      });
    });

    mediaRecorder.start();

    // Auto-stop after duration
    setTimeout(() => {
      if (mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
      }
    }, durationMs);
  });
};

// 3. Intruder Selfie Protection
export const captureSelfie = async () => {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error('Camera not supported in this browser.');
  }

  return new Promise(async (resolve, reject) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      const video = document.createElement('video');
      video.srcObject = stream;
      
      // Need to wait for video to load metadata to get dimensions
      video.onloadedmetadata = () => {
        video.play();
        
        // Take snapshot after a brief delay to allow camera exposure to adjust
        setTimeout(() => {
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          
          const imageRef = canvas.toDataURL('image/jpeg', 0.8);
          
          // Stop tracks and clean up
          stream.getTracks().forEach(track => track.stop());
          
          resolve({
            timestamp: new Date().toISOString(),
            imageRef,
            type: 'image/jpeg'
          });
        }, 500);
      };
    } catch (err) {
      console.error("Failed to capture selfie", err);
      reject(err);
    }
  });
};
