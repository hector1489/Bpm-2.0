import React, { useState, useEffect } from 'react';
import chatbotData from '../../chatbotData.json';

interface ChatMessage {
  user: boolean;
  text: string;
}

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Mensaje inicial del chatbot
    setMessages([
      { user: false, text: '¡Hola! ¿En qué puedo ayudarte hoy?' }
    ]);
  }, []);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSendMessage = () => {
    if (input.trim() === '') return;

    // Añadir el mensaje del usuario
    setMessages((prevMessages) => [
      ...prevMessages,
      { user: true, text: input }
    ]);

    // Buscar una respuesta del chatbot
    const foundResponse = chatbotData.find(
      (item) =>
        item.question.toLowerCase().includes(input.toLowerCase())
    );

    // Añadir la respuesta del chatbot
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        user: false,
        text: foundResponse ? foundResponse.answer : "Lo siento, aun no puedo responder esa pregunta."
      }
    ]);

    // Limpiar el input
    setInput('');
  };

  return (
    <div>
      <div
        className={`chatbot-container ${isOpen ? 'open' : ''}`}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 1000,
          width: '300px',
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        }}
      >
        {isOpen && (
          <div className='chatbot-form'>
            <div className="chatbot-header">
              <span>CBP-bot</span>
            </div>
            <div className="chatbot-body">
              <div className="messages">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`message ${message.user ? 'user' : 'bot'}`}
                  >
                    {message.text}
                  </div>
                ))}
              </div>
              <div className="input-container">
                <input
                  type="text"
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Escribe tu pregunta..."
                />
                <button onClick={handleSendMessage}>Enviar</button>
              </div>
            </div>
          </div>
        )}
      </div>

      <button
        className="chatbot-icon"
        onClick={toggleChatbot}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          backgroundColor: '#0f4b5c',
          color: '#fff',
          borderRadius: '50%',
          padding: '10px',
          fontSize: '20px',
          cursor: 'pointer',
          zIndex: 2000,
        }}
      >
        <i className="fas fa-comments"></i>
      </button>
    </div>
  );
};

export default Chatbot;
