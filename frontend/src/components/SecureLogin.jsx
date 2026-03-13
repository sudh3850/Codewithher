import React, { useState } from 'react';
import { verifyPasscode, hashPasscode } from '../utils/securityEncryption';
import { captureSelfie } from '../utils/mediaCapture';
import { saveSecurityEvent } from '../utils/incidentStore';
import { Lock } from 'lucide-react';

const SecureLogin = ({ expectedHash, onAuthenticated, onCancel }) => {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);

  const handleLogin = async () => {
    // If the user hasn't set up the new passcode yet (old localStorage), default to '0000'
    const targetHash = expectedHash || hashPasscode('0000');
    
    if (verifyPasscode(passcode, targetHash)) {
      setError('');
      setAttempts(0);
      onAuthenticated();
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setError('Incorrect passcode');
      setPasscode('');

      // Intruder Selfie Trap
      if (newAttempts >= 1) {
        try {
          const selfie = await captureSelfie();
          saveSecurityEvent({
            type: 'Unauthorized Access Attempt',
            description: `Failed login attempts: ${newAttempts}`,
            ...selfie
          });
        } catch (e) {
          console.error("Selfie capture failed", e);
          saveSecurityEvent({
            type: 'Unauthorized Access Attempt',
            description: `Failed login attempts: ${newAttempts}. (Camera access denied)`
          });
        }
      }
    }
  };

  return (
    <div className="card" style={{ maxWidth: '400px', margin: '2rem auto', textAlign: 'center' }}>
      <Lock size={48} style={{ margin: '0 auto 1rem', color: '#3b82f6' }} />
      <h2 style={{ marginBottom: '1rem' }}>Secure Area</h2>
      <p style={{ marginBottom: '1.5rem', color: '#64748b' }}>Enter your secure passcode to access sensitive data.</p>
      
      <div className="input-group">
        <input 
          type="password" 
          value={passcode}
          onChange={(e) => setPasscode(e.target.value)}
          placeholder="Enter Passcode"
          className="text-input"
          style={{ textAlign: 'center', letterSpacing: '0.2rem', fontSize: '1.2rem' }}
        />
      </div>
      
      {error && <p style={{ color: '#ef4444', marginBottom: '1rem' }}>{error}</p>}
      
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <button className="btn btn-outline" onClick={onCancel}>Cancel</button>
        <button className="btn" onClick={handleLogin}>Unlock</button>
      </div>
    </div>
  );
};

export default SecureLogin;
