import React, { useState } from 'react';
import { saveContacts, getContacts } from '../utils/contactStore.js';
import { hashPasscode } from '../utils/securityEncryption.js';

const Onboarding = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState({
    security: {
      passcodeHash: '', // Set by the user to secure the App
    },
    trigger: {
      type: 'passcode',
      value: '1234'
    },
    features: {
      locationSharing: true,
      audioRecording: false
    }
  });

  const [rawPasscode, setRawPasscode] = useState('');

  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contacts, setLocalContacts] = useState(getContacts());

  const handleAddContact = () => {
    if (contactName && contactPhone && contactEmail) {
      const newContact = { name: contactName, phone: contactPhone, email: contactEmail };
      const updatedContacts = [...contacts, newContact];
      setLocalContacts(updatedContacts);
      saveContacts(updatedContacts); // Store in local helper
      
      setContactName('');
      setContactPhone('');
      setContactEmail('');
    }
  };

  const handleComplete = () => {
    // Before completing, hash the secure passcode for storage
    const finalConfig = {
      ...config,
      security: {
        passcodeHash: hashPasscode(rawPasscode || '0000') // Default to 0000 if empty
      }
    };
    onComplete(finalConfig);
  };

  const renderStep1 = () => (
    <div className="card">
      <h2>Secret Trigger Setup</h2>
      <p>Choose how you will silently trigger an emergency alert.</p>
      
      <div className="input-group">
        <label className="input-label">Trigger Type</label>
        <select 
          className="text-input"
          value={config.trigger.type}
          onChange={(e) => setConfig({ ...config, trigger: { ...config.trigger, type: e.target.value } })}
        >
          <option value="passcode">Secret Passcode (Calculator)</option>
          <option value="shake">Shake Device</option>
          <option value="tap_pattern">Hidden Tap Pattern (5 taps)</option>
        </select>
      </div>

      <div className="input-group" style={{ marginTop: '1rem', borderTop: '1px solid #e2e8f0', paddingTop: '1rem'}}>
        <label className="input-label">App Access Passcode</label>
        <p style={{fontSize: '0.8rem', color: '#64748b', marginBottom: '0.5rem'}}>
          Required to access your evidence and settings. If someone enters it wrong, we take their photo.
        </p>
        <input 
          type="number"
          className="text-input" 
          placeholder="e.g. 0000"
          value={rawPasscode}
          onChange={(e) => setRawPasscode(e.target.value)}
        />
      </div>

      {config.trigger.type === 'passcode' && (
        <div className="input-group">
          <label className="input-label">Enter Secret PIN</label>
          <input 
            type="number"
            className="text-input" 
            value={config.trigger.value}
            onChange={(e) => setConfig({ ...config, trigger: { ...config.trigger, value: e.target.value } })}
          />
        </div>
      )}

      <button className="btn" onClick={() => setStep(2)}>Next Step</button>
    </div>
  );

  const renderStep2 = () => (
    <div className="card">
      <h2>Trusted Contacts</h2>
      <p>Who should receive your alert and location?</p>
      
      {contacts.map((c, i) => (
        <div key={i} style={{ padding: '0.5rem', border: '1px solid #e2e8f0', marginBottom: '0.5rem', borderRadius: '4px' }}>
          <strong>{c.name}</strong><br />
          📞 {c.phone} <br />
          ✉️ {c.email}
        </div>
      ))}

      <div className="input-group" style={{ marginTop: '1rem' }}>
        <input 
          placeholder="Name" 
          className="text-input"
          value={contactName}
          onChange={(e) => setContactName(e.target.value)}
        />
        <input 
          placeholder="Phone Number" 
          className="text-input"
          type="tel"
          value={contactPhone}
          onChange={(e) => setContactPhone(e.target.value)}
        />
        <input 
          placeholder="Email Address" 
          className="text-input"
          type="email"
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
        />
        <button className="btn btn-outline" onClick={handleAddContact}>Add Contact</button>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <button className="btn btn-outline" onClick={() => setStep(1)}>Back</button>
        <button className="btn" onClick={() => setStep(3)}>Next Step</button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="card">
      <h2>Privacy & Features</h2>
      <p>Enable additional safety features.</p>
      
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input 
            type="checkbox" 
            checked={config.features.locationSharing}
            onChange={(e) => setConfig({ ...config, features: { ...config.features, locationSharing: e.target.checked } })}
          />
          Share precise location in alerts
        </label>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input 
            type="checkbox" 
            checked={config.features.audioRecording}
            onChange={(e) => setConfig({ ...config, features: { ...config.features, audioRecording: e.target.checked } })}
          />
          Record audio during emergency
        </label>
      </div>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <button className="btn btn-outline" onClick={() => setStep(2)}>Back</button>
        <button className="btn" onClick={handleComplete}>Complete Setup</button>
      </div>
    </div>
  );

  return (
    <div className="app-container" style={{ padding: '2rem 1rem', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1>SafeNest Setup</h1>
        <p>Step {step} of 3</p>
      </div>
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
    </div>
  );
};

export default Onboarding;
