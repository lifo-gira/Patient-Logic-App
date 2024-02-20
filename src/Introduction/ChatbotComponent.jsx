import React, { useState, useEffect } from 'react';

import Sendmsg from '../assets/sendmsg.png';
import Robot from '../assets/robo.png';

const ChatbotComponent = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [defaultQuestions, setDefaultQuestions] = useState([
    'hello',
    'how are you',
    'your name',
    'what do you do',
    'where are you from',
    'programming languages',
    'thank you',
    'bye',
    'goodbye',
  ]);

  const toggleChatbot = () => {
    setIsVisible(!isVisible);
  };

  const handleClose = () => {
    setIsVisible(false);
    setMessages([]);
    setInput('');
  };

  const handleInput = (e) => {
    setInput(e.target.value);
  };

  const handleDefaultQuestionClick = (question) => {
    // Simulate submitting the default question
    handleBotResponse(question);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() !== '') {
      // Add user input to messages array
      const userMessage = { type: 'user', text: input };
      setMessages((prevMessages) => [...prevMessages, userMessage]);

      setInput('');

      // Simulate bot response after a short delay
      setTimeout(() => {
        handleBotResponse(input);
      }, 500);
    }
  };

  const handleBotResponse = (userInput) => {
    const botResponse = { type: 'bot', text: getBotResponse(userInput) };
    setMessages((prevMessages) => [...prevMessages, botResponse]);

    if (defaultQuestions.includes(userInput)) {
      const defaultQuestionMessages = defaultQuestions.map((question, index) => ({
        type: 'dbot',
        text: (
          <button
            key={index}
            className="text-blue-500 cursor-pointer text-right"
            onClick={() => handleDefaultQuestionClick(question)}
          >
            {question}
          </button>
        ),
      }));
      setMessages((prevMessages) => [...prevMessages, ...defaultQuestionMessages]);
    }

    if (
      botResponse.text.toLowerCase().includes('thank you') ||
      botResponse.text.toLowerCase().includes('bye') ||
      botResponse.text.toLowerCase().includes('goodbye')
    ) {
      setTimeout(() => {
        handleClose();
      }, 1500);
    }
  };

  const getBotResponse = (userInput) => {
    const lowerInput = userInput.toLowerCase();

    if (lowerInput.includes('hello')) {
      return 'Hello! How can I assist you today?';
    } else if (lowerInput.includes('how are you')) {
      return 'I am just a computer program, but I appreciate your concern!';
    } else if (lowerInput.includes('your name')) {
      return "I'm just a chatbot, so I don't have a personal name.";
    } else if (lowerInput.includes('what do you do')) {
      return 'I am here to help answer your questions.';
    } else if (lowerInput.includes('where are you from')) {
      return 'I exist in the digital realm, so I do not have a physical location.';
    } else if (lowerInput.includes('programming languages')) {
      return 'I am built using JavaScript and React.js.';
    } else if (lowerInput.includes('thank you')) {
      return 'You are welcome! If you have more questions, feel free to ask.';
    } else if (lowerInput.includes('bye') || lowerInput.includes('goodbye')) {
      return 'Goodbye! Have a great day!';
    } else {
      return "I'm sorry, I didn't understand that. Can you please ask another question?";
    }
  };

  useEffect(() => {
    // Display default questions when the chatbot is opened
    
    if (isVisible && messages.length === 0) {
      const defaultQuestionMessages = defaultQuestions.map((question, index) => ({
        type: 'dbot',
        text: (
          <button
            key={index}
            className="text-blue-500 cursor-pointer text-right"
            onClick={() => handleDefaultQuestionClick(question)}
          >
            {question}
          </button>
        ),
      }));
      setMessages([...defaultQuestionMessages]);
    }
  }, [isVisible, messages, defaultQuestions]);

  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => {
      const windowWidth = window.innerWidth;
      setScreenWidth(window.innerWidth);
    };

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Initial check
    handleResize();

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${!isVisible ? 'animate-blink' :screenWidth<900 && screenWidth>=720?'w-5/6':screenWidth<720?"w-full pl-8" :'w-2/6'}`}>
      {!isVisible && (
        <button
          onClick={toggleChatbot}
          className="p-3 bg-blue-500 text-white rounded-full focus:outline-none"
        >
          <img src={Robot} alt="" className="w-8 h-8" />
        </button>
      )}

      {isVisible && (
        <div className="flex flex-col w-full mx-auto p-4 border rounded-2xl shadow bg-white">
          <div className="flex justify-between mb-2">
            <div>Med Bot - I am here to help you</div>
            <button
              onClick={handleClose}
              className="p-1 h-8 w-8 bg-red-500 text-white rounded-full focus:outline-none"
            >
              X
            </button>
          </div>
          <div className="flex-grow overflow-y-auto h-96">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 mr-4 ml-2 flex ${
                  message.type === 'bot' ? 'justify-start' : 'justify-end'
                }`}
              >
                <div
                  className={`p-2 rounded ${
                    message.type === 'bot' ? 'bg-blue-100' : 'bg-gray-200'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="flex mt-4">
            <input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={handleInput}
              className="flex-grow p-2 border rounded-2xl  mr-2"
            />
            <button type="submit">
              <img src={Sendmsg} alt="" className="w-6 h-6 my-auto" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatbotComponent;
