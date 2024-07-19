import React, { useState } from 'react';

const App = () => {
  const [file, setFile] = useState(null);
  const [transcript, setTranscript] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleButtonClick = async () => {
    if (!file) {
      alert('Please select a file first.');
      return;
    }
    setLoading(true);

    const formData = new FormData();
    formData.append('audio', file);

    try {
      const response = await fetch('https://voice-to-text-kf7y.onrender.com/transcribe', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      // check response
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setLoading(false);
      setTranscript(data?.transcription);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="app-container">
      <h1>Voice to Text Converter</h1>
      <input type="file" accept="audio/*" onChange={handleFileChange} />
      <button onClick={handleButtonClick} disabled={loading}>
        {loading ? 'Converting...' : 'Convert into Text'}
      </button>
      <textarea value={transcript} readOnly />
    </div>
  );
};

export default App;
