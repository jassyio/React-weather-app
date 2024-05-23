import React, { useState, useEffect } from 'react';

function Input({ value, onChange, onKeyPress, placeholder }) {
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const typingSpeed = 300; // Adjust the typing speed (milliseconds per letter)
  const erasingSpeed = 300; // Adjust the erasing speed (milliseconds per letter)
  const displayDuration = 3000; // Display duration after all letters are typed

  useEffect(() => {
    const typeOrErase = () => {
      if (isTyping) {
        if (currentLetterIndex < placeholder.length) {
          setCurrentLetterIndex(currentLetterIndex + 1);
        } else {
          setIsTyping(false);
          setTimeout(() => {
            setIsTyping(false);
          }, displayDuration);
        }
      } else {
        if (currentLetterIndex > 0) {
          setCurrentLetterIndex(currentLetterIndex - 1);
        } else {
          setIsTyping(true);
        }
      }
    };

    const timer = setTimeout(typeOrErase, isTyping ? typingSpeed : erasingSpeed);

    return () => clearTimeout(timer);
  }, [currentLetterIndex, isTyping, typingSpeed, erasingSpeed, displayDuration, placeholder]);

  const animatedPlaceholder = placeholder.slice(0, currentLetterIndex);

  return (
    <input
      value={value}
      onChange={onChange}
      onKeyPress={onKeyPress}
      placeholder={animatedPlaceholder}
      type="text"
    />
  );
}

export default Input;
