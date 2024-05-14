import React, { useState, useEffect } from 'react';

function Input({ value, onChange, onKeyPress }) {
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const placeholderText = ' Enter location ...';
  const typingSpeed = 300; // Adjust the typing speed (milliseconds per letter)
  const displayDuration = 3000; // Display duration after all letters are typed

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentLetterIndex((prevIndex) => {
        if (prevIndex < placeholderText.length - 1) {
          return prevIndex + 1; // Move to the next letter
        } else {
          setTimeout(() => {
            setCurrentLetterIndex(0); // Start over after display duration
          }, displayDuration);
          return prevIndex; // Keep the index at the end
        }
      });
    }, typingSpeed);

    // Clean up
    return () => clearInterval(timer);
  }, []); // No dependencies, so it runs once when the component mounts

  const animatedPlaceholder = placeholderText.slice(0, currentLetterIndex);

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