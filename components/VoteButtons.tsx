import React from 'react';
import { VoteOption } from '../types';

interface VoteButtonsProps {
  proposalId: string;
  currentVote?: VoteOption;
  onVote: (vote: VoteOption) => void;
  disabled: boolean;
}

const VoteButtons: React.FC<VoteButtonsProps> = ({ currentVote, onVote, disabled }) => {
  const getButtonClass = (option: VoteOption) => {
    let baseClass = "btn w-full sm:w-auto text-base-content"; // DaisyUI base button
    if (disabled) {
      return `${baseClass} btn-disabled`;
    }
    
    // Active (selected) vote
    if (currentVote === option) {
      switch (option) {
        case VoteOption.FOR: return `${baseClass} btn-success`; // Green for 'For'
        case VoteOption.AGAINST: return `${baseClass} btn-error`; // Red for 'Against'
        case VoteOption.ABSTAIN: return `${baseClass} btn-info`;  // Blue for 'Abstain'
      }
    }
    
    // Default (unselected) styles
    // Using outline for unselected makes current selection more prominent
    switch (option) {
      case VoteOption.FOR: return `${baseClass} btn-outline btn-success hover:btn-success hover:text-success-content`;
      case VoteOption.AGAINST: return `${baseClass} btn-outline btn-error hover:btn-error hover:text-error-content`;
      case VoteOption.ABSTAIN: return `${baseClass} btn-outline btn-info hover:btn-info hover:text-info-content`;
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <button
        onClick={() => onVote(VoteOption.FOR)}
        className={getButtonClass(VoteOption.FOR)}
        disabled={disabled}
        aria-pressed={currentVote === VoteOption.FOR}
      >
        Vote For
      </button>
      <button
        onClick={() => onVote(VoteOption.AGAINST)}
        className={getButtonClass(VoteOption.AGAINST)}
        disabled={disabled}
        aria-pressed={currentVote === VoteOption.AGAINST}
      >
        Vote Against
      </button>
      <button
        onClick={() => onVote(VoteOption.ABSTAIN)}
        className={getButtonClass(VoteOption.ABSTAIN)}
        disabled={disabled}
        aria-pressed={currentVote === VoteOption.ABSTAIN}
      >
        Abstain
      </button>
    </div>
  );
};

export default VoteButtons;