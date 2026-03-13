import React, { useState, useEffect, useCallback } from 'react';
import { TriggerDetector } from '../utils/triggerDetection';

const HiddenHome = ({ onTrigger, triggerConfig }) => {
  const [mode, setMode] = useState('notes'); // 'notes' or 'calculator'
  const [calcDisplay, setCalcDisplay] = useState('');
  const [noteText, setNoteText] = useState('');
  
  useEffect(() => {
    // Initialize passive triggers (shake/tap)
    const detector = new TriggerDetector(onTrigger);
    
    if (triggerConfig.type === 'shake') {
      detector.startShakeDetection();
    }

    return () => {
      detector.stopShakeDetection();
    };
  }, [onTrigger, triggerConfig]);

  // Handle hidden tap trigger anywhere on screen
  const handleScreenTap = useCallback(() => {
    if (triggerConfig.type === 'tap_pattern') {
      // Create a static instance or use window to track taps
      if (!window.__triggerDetector) {
        window.__triggerDetector = new TriggerDetector(onTrigger);
      }
      window.__triggerDetector.handleTap();
    }
  }, [onTrigger, triggerConfig]);

  // Calculator Logic
  const handleCalcClick = (val) => {
    const newVal = calcDisplay + val;
    setCalcDisplay(newVal);

    // Check for passcode trigger
    if (triggerConfig.type === 'passcode' && newVal === triggerConfig.value) {
      onTrigger('passcode_entered');
      setCalcDisplay('');
    }
  };

  const handleCalcClear = () => setCalcDisplay('');
  
  const handleCalcEval = () => {
    try {
      // basic eval for realistic calculator MVP
      setCalcDisplay(eval(calcDisplay).toString()); 
    } catch(e) {
      setCalcDisplay('Error');
    }
  };

  return (
    <div onClick={handleScreenTap} style={{ height: '100%', position: 'relative' }}>
      {/* Hidden DEV demo button */}
      <div 
        onClick={(e) => { e.stopPropagation(); onTrigger('demo_manual_trigger'); }}
        style={{
          position: 'absolute',
          top: 0,
          left: '45%',
          width: '40px',
          height: '20px',
          background: 'transparent',
          zIndex: 100
        }}
        title="Hidden Demo Trigger"
      />

      <div style={{ paddingBottom: '1rem', borderBottom: '1px solid #e2e8f0', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>{mode === 'notes' ? 'Quick Notes' : 'Calculator'}</h2>
        <button 
          onClick={() => setMode(mode === 'notes' ? 'calculator' : 'notes')}
          style={{ background: 'transparent', border: '1px solid #ccc', padding: '0.25rem 0.5rem', borderRadius: '4px' }}
        >
          Switch to {mode === 'notes' ? 'Calc' : 'Notes'}
        </button>
      </div>

      {mode === 'calculator' ? (
        <div>
          <input readOnly value={calcDisplay} className="calc-display" />
          <div className="calculator-grid">
            {['7','8','9','/'].map(n => <button key={n} className="calc-btn" onClick={() => handleCalcClick(n)}>{n}</button>)}
            {['4','5','6','*'].map(n => <button key={n} className="calc-btn" onClick={() => handleCalcClick(n)}>{n}</button>)}
            {['1','2','3','-'].map(n => <button key={n} className="calc-btn" onClick={() => handleCalcClick(n)}>{n}</button>)}
            <button className="calc-btn" onClick={handleCalcClear}>C</button>
            <button className="calc-btn" onClick={() => handleCalcClick('0')}>0</button>
            <button className="calc-btn" onClick={handleCalcEval}>=</button>
            <button className="calc-btn" onClick={() => handleCalcClick('+')}>+</button>
          </div>
        </div>
      ) : (
        <textarea 
          className="notes-editor"
          placeholder="Type your notes here..."
          value={noteText}
          onChange={e => setNoteText(e.target.value)}
        />
      )}
    </div>
  );
};

export default HiddenHome;
