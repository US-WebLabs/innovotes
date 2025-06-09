import React from 'react';

interface LoadingSpinnerProps {
  large?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ large = false }) => {
  const sizeClass = large ? 'loading-lg' : 'loading-md'; // DaisyUI sizes

  return (
    <span className={`loading loading-spinner text-primary ${sizeClass}`}></span>
  );
};

export default LoadingSpinner;