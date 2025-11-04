import React from 'react';

const APIDocumentation = () => {
  return (
    <div style={{ width: '100%', height: '100vh', margin: 0, padding: 0 }}>
      <iframe
        src="http://localhost:8000/redoc"
        title="API Documentation"
        style={{ width: '100%', height: '100%', border: 'none' }}
      />
    </div>
  );
};

export default APIDocumentation;
