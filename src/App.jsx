import React, { useState } from 'react';

const App = () => {
  const [file, setFile] = useState(null);
  const [transcript, setTranscript] = useState('');
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("")

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const handleButtonClick = async () => {
    if (!file) {
      alert('Please select a file first.');
      return;
    }
    if (!['hi-IN', 'en-US'].includes(language)) {
      alert('Please select a supported language.');
      return;
    }
    setLoading(true);

    const formData = new FormData();
    formData.append('audio', file);
    formData.append('language', language);

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

  const handleSpeakClick = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(transcript);
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Sorry, your browser does not support speech synthesis.');
    }
  };

  return (
    <div className="app-container">
      <h1>Speech to Text Converter</h1>
      <p>Upload an audio file to convert it into text.</p>
      <div className="inner-content">
        <div className="input-btn-container">
          <div className="selectFile">
            <label>Select a file:</label>
            <input type="file" accept="audio/*" onChange={handleFileChange} />
          </div>
          <div className="selectLanguage">
            <label>Select language of Audio file:</label>
            <select value={language} onChange={handleLanguageChange}>
              <option value="hi-IN">Hindi</option>
              <option value="en-US">English</option>
            </select>
          </div>
          <div className="btnContainer">
            <button onClick={handleButtonClick} disabled={loading}>
              {loading ? 'Converting...' : 'Convert into Text'}
            </button>
          </div>
          <button onClick={handleSpeakClick} disabled={!transcript}>
            Speak Text
          </button>
        </div>
        <textarea value={transcript} readOnly />
      </div>
    </div>
  );
};

export default App;
