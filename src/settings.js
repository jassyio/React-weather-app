// Settings.js
import React, { useState } from 'react';

function Settings({ onClose, changeLanguage }) {
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  const handleLanguageChange = (event) => {
    const language = event.target.value;
    setSelectedLanguage(language);
    changeLanguage(language);
  };

  return (
    <div className="settings-modal">
      <h2>Settings</h2>
      <label>
        Select Language:
        <select value={selectedLanguage} onChange={handleLanguageChange}>
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
          {/* Add more languages as needed */}
        </select>
      </label>
      <button onClick={onClose}>Close</button>
    </div>
  );
}

export default Settings;
