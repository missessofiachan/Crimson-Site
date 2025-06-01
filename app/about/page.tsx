'use client';

import Link from 'next/link';
import styles from './About.module.css';

export default function AboutPage() {
  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>About Crimson E-Commerce</h1>
          <p className={styles.subtitle}>
            Your premier destination for quality products and exceptional service
          </p>
        </div>
      </div>

      <div className={styles.content}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Our Story</h2>
          <p className={styles.text}>
            Founded with a passion for bringing high-quality products to customers across Australia,
            Crimson E-Commerce has grown from a small startup to a trusted online retailer. We
            believe in the power of technology to create meaningful connections between businesses
            and customers.
          </p>
          <p className={styles.text}>
            Our journey began with a simple mission: to provide an exceptional online shopping
            experience that combines quality products, competitive prices, and outstanding customer
            service. Today, we continue to innovate and evolve, always putting our customers first.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Our Mission</h2>
          <div className={styles.missionGrid}>
            <div className={styles.missionCard}>
              <div className={styles.missionIcon}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className={styles.missionTitle}>Quality Products</h3>
              <p className={styles.missionText}>
                We carefully curate our product selection to ensure every item meets our high
                standards for quality and value.
              </p>
            </div>

            <div className={styles.missionCard}>
              <div className={styles.missionIcon}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.58-5.84a14.927 14.927 0 01-5.84-2.58m0 0A14.926 14.926 0 008.41 9.632M3.75 18.75l7.5-7.5 7.5 7.5-7.5 7.5-7.5-7.5z"
                  />
                </svg>
              </div>
              <h3 className={styles.missionTitle}>Fast Delivery</h3>
              <p className={styles.missionText}>
                With our efficient logistics network, we ensure your orders reach you quickly and
                safely across Australia.
              </p>
            </div>

            <div className={styles.missionCard}>
              <div className={styles.missionIcon}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                  />
                </svg>
              </div>
              <h3 className={styles.missionTitle}>Customer Support</h3>
              <p className={styles.missionText}>
                Our dedicated support team is always ready to help with any questions or concerns
                you may have.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Technology & Innovation</h2>
          <p className={styles.text}>
            Built with modern web technologies including Next.js, React, and advanced analytics, our
            platform provides a seamless shopping experience across all devices. We continuously
            invest in new technologies to improve our service and stay ahead of industry trends.
          </p>

          <div className={styles.techStack}>
            <div className={styles.techItem}>
              <span className={styles.techName}>Next.js</span>
              <span className={styles.techDescription}>React Framework</span>
            </div>
            <div className={styles.techItem}>
              <span className={styles.techName}>TypeScript</span>
              <span className={styles.techDescription}>Type Safety</span>
            </div>
            <div className={styles.techItem}>
              <span className={styles.techName}>Google Analytics</span>
              <span className={styles.techDescription}>Data Insights</span>
            </div>
            <div className={styles.techItem}>
              <span className={styles.techName}>Tailwind CSS</span>
              <span className={styles.techDescription}>Modern Styling</span>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Open Source & Community</h2>
          <p className={styles.text}>
            We believe in the power of open source software and community collaboration. Our
            platform is built with open source technologies, and we're committed to giving back to
            the developer community.
          </p>

          <div className={styles.githubSection}>
            <div className={styles.githubContent}>
              <div className={styles.githubIcon}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </div>
              <div className={styles.githubText}>
                <h3 className={styles.githubTitle}>View Our Code</h3>
                <p className={styles.githubDescription}>
                  Check out our source code, contribute to the project, or learn from our
                  implementation.
                </p>
                <a
                  href="https://github.com/missessofiachan/Crimson-Site"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.githubButton}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  View on GitHub
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Get in Touch</h2>
          <p className={styles.text}>
            Have questions about our products or services? We'd love to hear from you. Our team is
            always ready to help and provide the support you need.
          </p>

          <div className={styles.contactGrid}>
            <Link href="/contact" className={styles.contactCard}>
              <div className={styles.contactIcon}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                  />
                </svg>
              </div>
              <span>Contact Us</span>
            </Link>

            <Link href="/faq" className={styles.contactCard}>
              <div className={styles.contactIcon}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
                  />
                </svg>
              </div>
              <span>FAQ</span>
            </Link>

            <Link href="/chat" className={styles.contactCard}>
              <div className={styles.contactIcon}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
                  />
                </svg>
              </div>
              <span>Live Chat</span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
