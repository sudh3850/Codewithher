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
    <div className="card" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
      <h2>Secret Setup</h2>
      <p>Set a discreet passcode to trigger emergency mode from the calculator.</p>

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

      <div className="input-group">
        <label className="input-label">Enter Secret PIN</label>
        <input 
          type="number"
          className="text-input" 
          placeholder="e.g. 1234"
          value={config.trigger.value}
          onChange={(e) => setConfig({ ...config, trigger: { type: 'passcode', value: e.target.value } })}
        />
      </div>

      <button className="btn" onClick={() => setStep(2)}>Next Step</button>
    </div>
  );

  const renderStep2 = () => (
    <div className="card" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
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
        <button className="btn" onClick={handleComplete}>Complete Setup</button>
      </div>
    </div>
  );

  return (
    <div className="app-container" style={{ 
      padding: '2rem 1rem', 
      justifyContent: 'center',
      backgroundImage: "url('/bg-image.png')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh',
      width: '100%'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem', backgroundColor: 'rgba(255, 255, 255, 0.9)', padding: '1rem', borderRadius: '12px' }}>
        <h1 style={{ margin: 0, paddingBottom: '0.5rem' }}>SafeNest Setup</h1>
        <p>Step {step} of 2</p>
      </div>
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
    </div>
  );
};

export default Onboarding;
