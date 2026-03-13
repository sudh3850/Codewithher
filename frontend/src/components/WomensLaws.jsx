import React from 'react';

const WomensLaws = () => {
  return (
    <div>
      <h2 style={{ marginBottom: '1rem' }}>Women's Legal Rights & Protections</h2>
      
      <div className="card" style={{ borderColor: '#ef4444', backgroundColor: '#fef2f2' }}>
        <h3 style={{ color: '#ef4444' }}>Emergency Helplines</h3>
        <ul style={{ listStyleType: 'none', padding: 0, marginTop: '0.5rem' }}>
          <li style={{ padding: '0.5rem 0', fontWeight: 'bold' }}>📞 Women Helpline - 1091</li>
          <li style={{ padding: '0.5rem 0', fontWeight: 'bold' }}>📞 Women Emergency - 181</li>
          <li style={{ padding: '0.5rem 0', fontWeight: 'bold' }}>📞 Police - 100</li>
          <li style={{ padding: '0.5rem 0', fontWeight: 'bold' }}>📞 National Commission for Women - 7827170170</li>
        </ul>
      </div>

      <div className="card">
        <h3>Domestic Violence Act 2005</h3>
        <p>Protects women from physical, emotional, sexual, and economic abuse by a partner or family member residing in the same household. Offers the right to secure housing and protection orders.</p>
      </div>

      <div className="card">
        <h3>IPC Section 354</h3>
        <p><strong>Assault or criminal force to woman with intent to outrage her modesty.</strong> Carries a penalty covering imprisonment and fines if someone uses criminal force against a woman intending to outrage her modesty.</p>
      </div>

      <div className="card">
        <h3>IPC Section 509</h3>
        <p><strong>Word, gesture or act intended to insult the modesty of a woman.</strong> Penalizes anyone who intentionally insults a woman's modesty using words, sounds, gestures, or exhibits, including violating her privacy.</p>
      </div>

      <div className="card">
        <h3>Sexual Harassment of Women at Workplace Act 2013</h3>
        <p>Also known as the POSH Act. It mandates employers to provide a safe, secure, and enabling environment free from sexual harassment at workplaces. Every employer must constitute an Internal Complaints Committee (ICC).</p>
      </div>

      <div className="card">
        <h3>IPC Section 354D</h3>
        <p><strong>Stalking.</strong> Criminalizes following a woman, contacting or attempting to contact her repeatedly despite clear indication of disinterest, or secretly monitoring her use of the internet or email.</p>
      </div>

      <div style={{ height: '2rem' }}></div>
    </div>
  );
};

export default WomensLaws;
