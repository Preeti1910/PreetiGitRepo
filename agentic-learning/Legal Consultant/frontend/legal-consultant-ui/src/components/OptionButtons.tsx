import React from 'react';
import { ChatOption } from '../types';
import './OptionButtons.css';

interface OptionButtonsProps {
  options: ChatOption[];
  onSelect: (option: ChatOption) => void;
  disabled: boolean;
}

const OptionButtons: React.FC<OptionButtonsProps> = ({ options, onSelect, disabled }) => {
  if (options.length === 0) return null;

  return (
    <div className="option-buttons">
      {options.map((option, index) => (
        <button
          key={`${option.value}-${index}`}
          className="option-btn"
          onClick={() => onSelect(option)}
          disabled={disabled}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default OptionButtons;
