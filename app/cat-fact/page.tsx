'use client';
import React, { useEffect, useState } from 'react';
import styles from './CatFact.module.css';

export default function CatFactPage() {
  const [fact, setFact] = useState('');
  const [catImg, setCatImg] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      
      
      const factRes = await fetch('https://catfact.ninja/fact');
      const factData = await factRes.json();
      setFact(factData.fact);

      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <div className={styles['catfact-container']}>
      <h2>🐱 Cat Fact</h2>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <p className={styles['catfact-fact']}>{fact}</p>
        </>
      )}
    </div>
  );
}