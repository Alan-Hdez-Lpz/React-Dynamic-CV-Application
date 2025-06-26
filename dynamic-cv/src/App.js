// App.js
import React, { useState } from 'react';
import Header from './components/Header';
import CVForm from './components/CVForm';
import CVPreview from './components/CVPreview';
import './styles.css';

const defaultCVData = {
  name: '',
  email: '',
  phone: '',
  address: '',
  education: [],
  experience: [],
  skills: [],
};

function App() {
  const [cvData, setCvData] = useState(() => {
    const saved = localStorage.getItem('cvData');
    return saved ? JSON.parse(saved) : defaultCVData;
  });

  const saveCV = () => {
    localStorage.setItem('cvData', JSON.stringify(cvData));
    alert('CV saved to localStorage ✅');
  };

  const resetCV = () => {
    localStorage.removeItem('cvData');
    setCvData(defaultCVData);
    alert('CV has been reset');
  };

  return (
    <div className="App">
      <Header />
      <div className="main-container">
        <CVForm
          cvData={cvData}
          setCvData={setCvData}
          onSave={saveCV}
          onReset={resetCV}
        />
        <CVPreview
          cvData={cvData}
          setCvData={setCvData}
        />
      </div>
    </div>
  );
}

export default App;
