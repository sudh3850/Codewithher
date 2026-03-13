import React, { useEffect, useState, useRef } from 'react';
import { TriggerDetector } from '../utils/triggerDetection';
import { captureAudio, captureVideo } from '../utils/mediaCapture';
import { getIncidents, saveIncident } from '../utils/incidentStore';

const EmergencyOverlay = ({ userConfig, notifiedContacts, onCancel, incidentId }) => {
  const [audioStatus, setAudioStatus] = useState('');
  const [videoStatus, setVideoStatus] = useState('');

  
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    
    // Quick Escape Mode: Shake during emergency to hide UI instantly
    const detector = new TriggerDetector((type) => {
      if (type === 'shake_gesture') {
        onCancel();
      }
    });
    
    detector.startShakeDetection();

    const startRecording = async () => {
      if (!userConfig?.features?.audioRecording) return;
      
      try {
        setAudioStatus('🎙️ Recording audio (60s)...');
        
        // Start audio capture (60 seconds)
        const audioPromise = captureAudio(60000);
        
        // Start video capture (5 seconds snapshot) right after audio starts
        setVideoStatus('📹 Recording video snapshot (5s)...');
        const videoPromise = captureVideo(5000);

        videoPromise.then(videoData => {
            if (!mounted.current) return;
            setVideoStatus('✅ Video saved securely.');
            appendEvidenceToIncident(incidentId, 'videoEvidence', videoData);
        }).catch(err => {
            if (mounted.current) setVideoStatus('❌ Video access denied/failed.');
        });
        
        audioPromise.then(audioData => {
            if (!mounted.current) return;
            setAudioStatus('✅ Audio saved securely.');
            appendEvidenceToIncident(incidentId, 'audioEvidence', audioData);
        }).catch(err => {
            if (mounted.current) setAudioStatus('❌ Audio access denied/failed.');
        });
        
      } catch (e) {
        console.error('Media capture failed to start:', e);
      }
    };

    startRecording();

    return () => {
      detector.stopShakeDetection();
      mounted.current = false;
    };
  }, [onCancel, userConfig, incidentId]);

  const appendEvidenceToIncident = (id, key, data) => {
    try {
      const incidents = getIncidents();
      const incident = incidents.find(i => i.id === id);
      if (incident) {
        incident[key] = data;
        saveIncident(incident);
      }
    } catch (e) {
      console.error('Failed to append evidence', e);
    }
  };

  return (
    <div className="emergency-overlay" style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
      backgroundColor: 'rgba(220, 38, 38, 0.95)', 
      color: 'white', zIndex: 9999, 
      display: 'flex', flexDirection: 'column', 
      justifyContent: 'center', alignItems: 'center', padding: '2rem'
    }}>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'white' }}>🚨 EMERGENCY ACTIVATED 🚨</h2>
      <p style={{ marginBottom: '0.5rem' }}>Location captured. Contacts notified.</p>
      
      {audioStatus && <p style={{ marginBottom: '0.2rem', fontWeight: 'bold' }}>{audioStatus}</p>}
      {videoStatus && <p style={{ marginBottom: '1rem', fontWeight: 'bold' }}>{videoStatus}</p>}
      
      <div style={{ marginTop: '1rem', width: '100%', textAlign: 'left', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px' }}>
        <h3 style={{ color: 'white', fontSize: '1.2rem', marginBottom: '0.5rem' }}>Alert sent to:</h3>
        {notifiedContacts.length > 0 ? (
          <ul style={{ paddingLeft: '1rem', marginTop: '0.5rem' }}>
            {notifiedContacts.map((c, i) => (
              <li key={i}>{c.name} ({c.phone})</li>
            ))}
          </ul>
        ) : (
          <p>No contacts configured.</p>
        )}
      </div>
      <p style={{ marginTop: '3rem', fontSize: '0.9rem', opacity: 0.8, textAlign: 'center' }}>
        <em>Quick Escape: Shake device to hide this screen instantly</em>
      </p>
    </div>
  );
};

export default EmergencyOverlay;
