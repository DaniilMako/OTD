import React, { useState } from 'react';

const ImageUpload = () => {
  const [file, setFile] = useState(null);
  const [invertedImage, setInvertedImage] = useState('');

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('http://localhost:8000/invert-image', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const blob = await response.blob();
      setInvertedImage(URL.createObjectURL(blob));
    }
  };

  return (
    <div>
      <h2>Загрузите изображение для инверсии</h2>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button onClick={handleUpload}>Инвертировать</button>

      {invertedImage && (
        <div>
          <h3>Инвертированное изображение:</h3>
          <img
            src={invertedImage}
            alt="Inverted"
            style={{ maxWidth: '100%', border: '2px solid #ccc' }}
          />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
