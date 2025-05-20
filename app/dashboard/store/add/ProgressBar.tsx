'use client';

import styles from './AddStore.module.css';
import React from 'react';

interface ProgressBarProps {
  progress: number;
}

export function ProgressBar({ progress }: ProgressBarProps) {
  // Round the progress to the nearest 10
  const roundedProgress = Math.floor(progress / 10) * 10;
  // Get the appropriate CSS class based on the progress value
  const progressClass = styles[`progress${roundedProgress}`];
  
  return (
    <div className={styles.progressBar}>
      <div className={`${styles.progressFill} ${progressClass}`}></div>
    </div>
  );
}
