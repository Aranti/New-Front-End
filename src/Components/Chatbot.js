import React, { useState } from 'react';
import axios from 'axios';
import { baseUrl } from '../shared/baseUrl';
import HeaderComponent from './HeaderComponent';

function Chatbot() {
  const [inputText, setInputText] = useState('');
  const [responses, setResponses] = useState([]);

  const handleInputChange = (e) => setInputText(e.target.value);

  const handleSend = async () => {
    try {
      const response = await axios.post(baseUrl+'/api/chat', { text: inputText });
      setResponses([...responses, { text: inputText, isUser: true }, { text: response.data.reply, isUser: false, graphUrl: response.data.graphUrl }]);
      setInputText('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <>
    <HeaderComponent isOverview={false} />
    <div>
      <div>
        {responses.map((res, idx) => (
          <div key={idx}>
            <p>{res.isUser ? 'You: ' : 'Bot: '}{res.text}</p>
            {res.graphUrl && <img src={res.graphUrl} alt="Graph" />}
          </div>
        ))}
      </div>
      <input type="text" value={inputText} onChange={handleInputChange} />
      <button onClick={handleSend}>Send</button>
    </div>
    </>
  );
}

export default Chatbot;