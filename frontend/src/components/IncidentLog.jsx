import React, { useState, useEffect } from 'react';
import { getIncidents, getSecurityEvents } from '../utils/incidentStore';

const IncidentLog = () => {
  const [logs, setLogs] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const incidents = getIncidents().map(i => ({ ...i, logType: 'incident' }));
    const security = getSecurityEvents().map(s => ({ ...s, logType: 'security', id: s.id || Date.now() + Math.random() }));
    
    // Merge and sort descending
    const merged = [...incidents, ...security].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    setLogs(merged);
  }, []);

  if (logs.length === 0) {
    return (
      <div style={{ textAlign: 'center', marginTop: '3rem', color: '#64748b' }}>
        <p>No incidents or security events recorded.</p>
      </div>
    );
  }

  const [fullScreenImage, setFullScreenImage] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const renderEvidence = (log) => {
    return (
      <div style={{ marginTop: '1rem', borderTop: '1px solid #e2e8f0', paddingTop: '1rem', textAlign: 'left' }}>
        <h4 style={{ marginBottom: '0.5rem' }}>Attached Evidence</h4>
        {log.audioEvidence && (
          <div style={{ marginBottom: '1rem' }}>
            <p><strong>Audio Recording ({Math.round(log.audioEvidence.duration / 1000)}s)</strong></p>
            <audio controls src={log.audioEvidence.fileRef} style={{ width: '100%', outline: 'none' }}></audio>
          </div>
        )}
        {log.videoEvidence && (
          <div style={{ marginBottom: '1rem' }}>
            <p><strong>Video Snapshot</strong></p>
            <video controls src={log.videoEvidence.fileRef} style={{ width: '100%', borderRadius: '4px', maxWidth: '300px' }}></video>
          </div>
        )}
        {log.imageRef && (
          <div style={{ marginBottom: '1rem' }}>
            <p><strong>Intruder Selfie Active</strong></p>
            <img 
              src={log.imageRef} 
              alt="Intruder capture" 
              style={{ width: '100%', borderRadius: '4px', maxWidth: '300px', cursor: 'pointer', border: '1px solid #e2e8f0' }} 
              onClick={(e) => {
                e.stopPropagation();
                setFullScreenImage(log.imageRef);
              }}
            />
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>Captured: {new Date(log.timestamp).toLocaleString()}</div>
          </div>
        )}
        {!log.audioEvidence && !log.videoEvidence && !log.imageRef && (
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>⚠ No media attached to this event.</p>
        )}
      </div>
    );
  };

  return (
    <div>
      <h2 style={{ marginBottom: '1rem' }}>Security Timeline</h2>
      {logs.map((log) => {
        const isIncident = log.logType === 'incident';
        const isExpanded = expandedId === log.id;
        
        return (
          <div 
            key={log.id} 
            className="card log-item" 
            style={{ 
              cursor: 'pointer',
              borderLeft: isIncident ? '4px solid #ef4444' : '4px solid #eab308'
            }}
            onClick={() => toggleExpand(log.id)}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: 'bold' }}>{new Date(log.timestamp).toLocaleString()}</span>
              {isIncident ? (
                <span style={{ color: '#ef4444', textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: 'bold' }}>
                  {log.triggerType.replace('_', ' ')}
                </span>
              ) : (
                <span style={{ color: '#eab308', textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: 'bold' }}>
                  SECURITY EVENT
                </span>
              )}
            </div>
            
            {isIncident ? (
              <>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '4px', backgroundColor: '#fee2e2', color: '#991b1b', fontWeight: 'bold' }}>
                    {log.triggerType === 'phone_drop_throw' ? '📱 Drop/Throw Detected' : '🚨 Emergency Trigger'}
                  </span>
                </div>
                
                <p style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                  📍 {log.location ? 
                      <a href={`https://maps.google.com/?q=${log.location.lat},${log.location.lng}`} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}>View Map</a> 
                      : 'Unavailable'}
                </p>
                
                <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '0.5rem', padding: '0.5rem', backgroundColor: '#f8fafc', borderRadius: '4px' }}>
                  <strong>Evidence Collected:</strong>{' '}
                  {log.audioEvidence || log.videoEvidence || log.imageRef ? (
                    <span>
                      {log.audioEvidence && '🎤 Audio | '}
                      {log.videoEvidence && '📹 Video | '}
                      {log.imageRef && '📷 Photo'}
                    </span>
                  ) : (
                    <span style={{ color: '#d97706' }}>⚠ No evidence captured</span>
                  )}
                </div>
              </>
            ) : (
              <>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '4px', backgroundColor: '#fef3c7', color: '#b45309', fontWeight: 'bold' }}>
                    🔒 {log.type === 'Unauthorized Access Attempt' ? 'Unauthorized Access Attempt' : log.type}
                  </span>
                </div>
                {log.description && <p style={{ fontSize: '0.9rem', marginBottom: '0.25rem', color: '#64748b' }}>{log.description}</p>}
                
                <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '0.5rem', padding: '0.5rem', backgroundColor: '#f8fafc', borderRadius: '4px' }}>
                  <strong>Evidence Collected:</strong>{' '}
                  {log.imageRef ? (
                    <span>📷 Intruder Photo</span>
                  ) : (
                    <span style={{ color: '#d97706' }}>⚠ No photo captured</span>
                  )}
                </div>
              </>
            )}

            {isExpanded && renderEvidence(log)}
            
            <div style={{ textAlign: 'center', marginTop: '0.5rem', opacity: 0.5, fontSize: '0.8rem' }}>
              {isExpanded ? '▲ Hide Details' : '▼ View Evidence'}
            </div>
          </div>
        );
      })}

      {/* Full Screen Image Modal */}
      {fullScreenImage && (
        <div 
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.9)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '1rem'
          }}
          onClick={() => setFullScreenImage(null)}
        >
          <img 
            src={fullScreenImage} 
            alt="Intruder capture full screen" 
            style={{ maxWidth: '100%', maxHeight: '80vh', borderRadius: '8px', border: '2px solid white' }} 
          />
          <button 
            className="btn btn-outline" 
            style={{ color: 'white', borderColor: 'white', marginTop: '1rem' }}
            onClick={(e) => {
              e.stopPropagation();
              setFullScreenImage(null);
            }}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default IncidentLog;
