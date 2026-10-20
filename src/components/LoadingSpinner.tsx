import React from 'react';
import { LuxuryWatchPreloader } from './LuxuryWatchPreloader';

interface LoadingSpinnerProps {
  onComplete?: () => void;
  minDuration?: number;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = (props) => {
  return <LuxuryWatchPreloader {...props} />;
};

export { LuxuryWatchPreloader };
