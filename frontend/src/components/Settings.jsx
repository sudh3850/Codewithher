import React, { useState, useEffect } from 'react';
import { getContacts, deleteContact, addContact } from '../utils/contactStore.js';
import { hashPasscode } from '../utils/securityEncryption.js';

const Settings = ({ config, onUpdate }) => {
  const [contacts, setContacts] = useState([]);
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [newPasscode, setNewPasscode] = useState('');

  useEffect(() => {
    setContacts(getContacts());
  }, []);

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all data and setup?")) {
      localStorage.removeItem('safenest_config');
      localStorage.removeItem('safenest_incidents');
      localStorage.removeItem('safenest_contacts');
      window.location.reload();
    }
  };

  const handleAddContact = () => {
    if (contactName && contactPhone && contactEmail) {
      const newContact = { name: contactName, phone: contactPhone, email: contactEmail };
      addContact(newContact);
      setContacts(getContacts());
      setContactName('');
      setContactPhone('');
      setContactEmail('');
    }
  };

  const handleDeleteContact = (emailOrPhone) => {
    deleteContact(emailOrPhone);
    setContacts(getContacts());
  };

  return (
    <div>
      <h2 style={{ marginBottom: '1rem' }}>Settings</h2>
      
      <div className="card">
        <h3>Current Configuration</h3>
        <p><strong>Trigger:</strong> {config.trigger.type.replace('_', ' ')}</p>
        <p><strong>Location Sharing:</strong> {config.features.locationSharing ? 'Enabled' : 'Disabled'}</p>
        <p><strong>Audio Recording:</strong> {config.features.audioRecording ? 'Enabled' : 'Disabled'}</p>
      </div>

      <div className="card">
        <h3>Trusted Contacts</h3>
        {contacts.map((c, i) => (
          <div key={i} style={{ padding: '0.5rem 0', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong>{c.name}</strong><br/>
              <span style={{fontSize: '0.85rem', color: '#64748b'}}>📞 {c.phone} | ✉️ {c.email}</span>
            </div>
            <button className="btn btn-danger" style={{ padding: '0.25rem 0.5rem', width: 'auto' }} onClick={() => handleDeleteContact(c.phone)}>Delete</button>
          </div>
        ))}
        {contacts.length === 0 && <p style={{ marginTop: '0.5rem' }}>No contacts configured.</p>}
        
        <div className="input-group" style={{ marginTop: '1rem' }}>
          <h4>Add New Contact</h4>
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
      </div>

      <div className="card" style={{ marginTop: '1rem' }}>
        <h3>App Security</h3>
        <p style={{fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem'}}>Update the passcode required to access sensitive evidence and settings.</p>
        <div className="input-group">
          <input 
            type="number" 
            placeholder="New App Passcode" 
            className="text-input" 
            value={newPasscode}
            onChange={(e) => setNewPasscode(e.target.value)}
          />
          <button 
            className="btn btn-outline" 
            onClick={() => {
              if (newPasscode) {
                const updatedConfig = { 
                  ...config, 
                  security: { ...config.security, passcodeHash: hashPasscode(newPasscode) } 
                };
                onUpdate(updatedConfig);
                setNewPasscode('');
                alert('Passcode updated!');
              }
            }}
          >
            Update Passcode
          </button>
        </div>
      </div>

      <button className="btn btn-danger" onClick={handleReset} style={{ marginTop: '2rem' }}>
        Reset Setup & Delete Data
      </button>
    </div>
  );
};

export default Settings;
