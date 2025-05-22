import React, { useEffect, useRef } from 'react';

export default function VideoAutoplayPage() {
  const videoRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // No extra logic needed for autoplay, handled by URL params
  }, []);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', background: '#000' }}>
      <iframe
        ref={videoRef}
        width="800"
        height="450"
        src="https://www.youtube.com/embed/rdzThMp5lso?autoplay=1&mute=1"
        title="dugodoo"
        frameBorder="0"
        allow="autoplay; encrypted-media"
        allowFullScreen
        style={{ borderRadius: '12px', boxShadow: '0 4px 24px rgba(0,0,0,0.4)' }}
      ></iframe>
    </div>
  );
}
