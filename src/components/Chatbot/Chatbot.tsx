import { useState, useEffect } from 'react';
import chatbotData from '../../chatbotData.json';
import './Chatbot.css'

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
      >
        {isOpen && (
          <div className='chatbot-form'>
            <div className="chatbot-header">
              <span>CBP-bot</span>
              <i className="fa-solid fa-robot"></i>
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
              <div className="chatbot-input-container">
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
      >
        <i className="fas fa-comments"></i>
      </button>
    </div>
  );
};

export default Chatbot;
