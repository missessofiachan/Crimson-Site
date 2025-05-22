'use client';
import React, { useEffect, useRef } from 'react';
import styles from './dugodoo.module.css';

export default function VideoAutoplayPage() {
  const videoRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // No extra logic needed for autoplay, handled by URL params
  }, []);

  return (
    <div className={styles.dugodooContainer}>
      <div>
        <div className={styles.dugodooTitle}>DUGGA DOO</div>
        <iframe
          ref={videoRef}
          width="800"
          height="450"
          src="https://www.youtube.com/embed/rdzThMp5lso?autoplay=1"
          title="dugodoo"
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
          className={styles.dugodooIframe}
        ></iframe>
      </div>
    </div>
  );
}
