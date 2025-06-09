 // app/[locale]/not-found.tsx

import React from 'react';
import Link from 'next/link'; // Import Link for navigation
import { Metadata } from 'next'; // Optional: for custom metadata

export const metadata: Metadata = {
  title: 'Page Not Found',
  description: 'The page you requested could not be found.',
};

export default function NotFoundPage() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      textAlign: 'center',
      padding: '20px',
      backgroundColor: '#f8f8f8',
      color: '#333'
    }}>
      <h1 style={{ fontSize: '4em', margin: '0' }}>404</h1>
      <h2 style={{ fontSize: '1.5em', margin: '10px 0 20px' }}>Page Not Found</h2>
      <p style={{ fontSize: '1.1em', marginBottom: '30px' }}>
        We couldn't find the page you're looking for.
      </p>
      <Link href="/" style={{
        display: 'inline-block',
        backgroundColor: '#6200EE',
        color: 'white',
        padding: '12px 25px',
        borderRadius: '8px',
        textDecoration: 'none',
        fontSize: '1.1em',
        transition: 'background-color 0.3s ease'
      }}>
        Return to Homepage
      </Link>
    </div>
  );
}