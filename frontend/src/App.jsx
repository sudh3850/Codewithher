import React, { useState, useEffect } from 'react';
import Onboarding from './components/Onboarding.jsx';
import HiddenHome from './components/HiddenHome.jsx';
import IncidentLog from './components/IncidentLog.jsx';
import SafetyMap from './components/SafetyMap.jsx';
import Settings from './components/Settings.jsx';
import WomensLaws from './components/WomensLaws.jsx';
import { getCurrentLocation } from './utils/locationService.js';
import { saveIncident, getIncidents, saveSecurityEvent } from './utils/incidentStore.js';
import { getContacts } from './utils/contactStore.js';
import { checkDangerWarning } from './utils/dangerZoneService.js';
import EmergencyOverlay from './components/EmergencyOverlay.jsx';
import SecureLogin from './components/SecureLogin.jsx';
import { Map, List, Settings as SettingsIcon, Home, Book } from 'lucide-react';

const App = () => {
  const [isConfigured, setIsConfigured] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [userConfig, setUserConfig] = useState(null);
  const [notifiedContacts, setNotifiedContacts] = useState([]);
  const [dangerWarning, setDangerWarning] = useState(null);
  const [lastKeyPressTime, setLastKeyPressTime] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const config = localStorage.getItem('safenest_config');
    if (config) {
      setUserConfig(JSON.parse(config));
      setIsConfigured(true);
    }
  }, []);

  // Panic Screen Lock (Double Power Button Simulation)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key.toLowerCase() === 'p') {
        const now = Date.now();
        if (now - lastKeyPressTime < 400) { 
          // Switch to fake notes app instantly
          setEmergencyMode(false);
          setIsAuthenticated(false);
          setActiveTab('home');
        }
        setLastKeyPressTime(now);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lastKeyPressTime]);

  // Periodic Danger Zone Checking
  useEffect(() => {
    const checkLocation = async () => {
      if (!isConfigured || emergencyMode) return;
      try {
        const loc = await getCurrentLocation();
        const warning = checkDangerWarning(loc.lat, loc.lng);
        setDangerWarning(warning);
      } catch (e) {
        // Optional location trace ignored
      }
    };
    
    // Check initially and then every 15 seconds
    if (isConfigured) checkLocation();
    const interval = setInterval(checkLocation, 15000);
    return () => clearInterval(interval);
  }, [isConfigured, emergencyMode]);

  // Failsafe: Log if app closed during emergency
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (emergencyMode) {
        saveSecurityEvent({
          type: 'Emergency Interrupted',
          description: 'The application was closed while Emergency Mode was active. Evidence collection may be incomplete.'
        });
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [emergencyMode]);

  const handleConfigComplete = (config) => {
    localStorage.setItem('safenest_config', JSON.stringify(config));
    setUserConfig(config);
    setIsConfigured(true);
  };

  const triggerEmergency = async (triggerType) => {
    if (emergencyMode) return;
    setEmergencyMode(true);
    
    const timestamp = new Date().toISOString();
    const incidentRecord = {
      id: Date.now(),
      timestamp,
      triggerType,
      location: null,
      recordingIndicator: false,
    };

    let locUrl = 'Unknown';
    try {
      const loc = await getCurrentLocation();
      incidentRecord.location = loc;
      locUrl = `https://maps.google.com/?q=${loc.lat},${loc.lng}`;
    } catch (e) {
      console.warn('Could not fetch location', e);
    }

    if (userConfig?.features?.audioRecording) {
      incidentRecord.recordingIndicator = true;
    }

    // Save incident to local storage (Base64 encoded via incidentStore)
    saveIncident(incidentRecord);

    // Alert simulation
    const contacts = getContacts();
    setNotifiedContacts(contacts);
    
    if (contacts.length > 0) {
      const alertMessage = `🚨 Emergency Alert\n\nUser may be in danger.\n\nLocation:\n${locUrl}\n\nTrigger:\n${triggerType}\n\nTime: ${timestamp}`;
      console.log('--- SMS SIMULATION ---');
      console.log(alertMessage);
      console.log('SENT TO:', contacts.map(c => c.name).join(', '));
      
      // Haptic Feedback for physical confirmation of alert sent
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([200, 100, 200, 100, 200]);
      }
    }

    // Auto-hide after 8 seconds (if user doesn't quick escape)
    setTimeout(() => {
      setEmergencyMode(prev => prev ? false : prev);
    }, 8000); 
  };

  if (!isConfigured) return <Onboarding onComplete={handleConfigComplete} />;

  return (
    <div className="app-container">
      {dangerWarning && !emergencyMode && (
        <div style={{ backgroundColor: '#f59e0b', color: 'white', padding: '0.75rem', textAlign: 'center', fontWeight: 'bold' }}>
          ⚠️ Warning: This area reported multiple incidents. Stay alert. {/* (${dangerWarning.name}) */}
        </div>
      )}

      {emergencyMode && (
        <EmergencyOverlay 
          userConfig={userConfig}
          notifiedContacts={notifiedContacts}
          onCancel={() => {
            setEmergencyMode(false);
            setIsAuthenticated(false);
            setActiveTab('home'); // Quick escape goes to Home component
          }}
        />
      )}

      <div className="content-area">
        {activeTab === 'home' && <HiddenHome onTrigger={triggerEmergency} triggerConfig={userConfig.trigger} />}
        {activeTab === 'map' && <SafetyMap />}
        {activeTab === 'laws' && <WomensLaws />}
        
        {/* Secure Areas */}
        {(activeTab === 'incidents' || activeTab === 'settings') && !isAuthenticated && (
          <SecureLogin 
            expectedHash={userConfig.security?.passcodeHash} 
            onAuthenticated={() => setIsAuthenticated(true)}
            onCancel={() => setActiveTab('home')}
          />
        )}
        {activeTab === 'incidents' && isAuthenticated && <IncidentLog />}
        {activeTab === 'settings' && isAuthenticated && <Settings config={userConfig} onUpdate={handleConfigComplete} />}
      </div>

      <nav className="bottom-nav">
        <button className={`nav-item ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>
          <Home className="nav-icon" size={24} />
          <span style={{ fontSize: '0.75rem' }}>Home</span>
        </button>
        <button className={`nav-item ${activeTab === 'incidents' ? 'active' : ''}`} onClick={() => setActiveTab('incidents')}>
          <List className="nav-icon" size={24} />
          <span style={{ fontSize: '0.75rem' }}>Log</span>
        </button>
        <button className={`nav-item ${activeTab === 'map' ? 'active' : ''}`} onClick={() => setActiveTab('map')}>
          <Map className="nav-icon" size={24} />
          <span style={{ fontSize: '0.75rem' }}>Map</span>
        </button>
        <button className={`nav-item ${activeTab === 'laws' ? 'active' : ''}`} onClick={() => setActiveTab('laws')}>
          <Book className="nav-icon" size={24} />
          <span style={{ fontSize: '0.75rem' }}>Laws</span>
        </button>
        <button className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
          <SettingsIcon className="nav-icon" size={24} />
          <span style={{ fontSize: '0.75rem' }}>Settings</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
