import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [images, setImages] = useState([]); // State to hold image data
  const [loading, setLoading] = useState(true); // State to show loading

  // Function to fetch images from the API
  const fetchImages = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=10'); // Fetch 10 Pokémon
      const data = response.data.results;

      // Map through the results to fetch images
      const imagesWithDetails = await Promise.all(
        data.map(async (pokemon) => {
          const pokemonDetails = await axios.get(pokemon.url);
          return {
            name: pokemon.name,
            image: pokemonDetails.data.sprites.front_default, // Fetch sprite image
          };
        })
      );

      setImages(imagesWithDetails);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching images:', error);
      setLoading(false);
    }
  };

  // Fetch images on component mount
  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <div
      style={{
        textAlign: 'center',
        padding: '20px',
        backgroundColor: '#f4f4f9', // Light grayish-blue background for the entire app
        minHeight: '100vh',
      }}
    >
      <h1 style={{ color: '#333', marginBottom: '20px' }}>Pokémon Images</h1>
      {loading && <p>Loading...</p>}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)', // Four cards per row
          gap: '20px', // Space between the cards
          justifyContent: 'center',
          padding: '10px',
        }}
      >
        {images.map((img, index) => (
          <div
            key={index}
            style={{
              border: '2px solid #4CAF50', // Green border for the card
              borderRadius: '10px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden',
              backgroundColor: '#fff', // White background for the card
            }}
          >
            {/* Box for Image */}
            <div
              style={{
                backgroundColor: '#f0f8ff', // Light blue background
                padding: '10px',
                textAlign: 'center',
              }}
            >
              <img
                src={img.image}
                alt={img.name}
                style={{ width: '100px', height: '100px', objectFit: 'contain' }}
              />
            </div>

            {/* Box for Name */}
            <div
              style={{
                backgroundColor: '#ffe4b5', // Light orange background
                padding: '10px',
                textAlign: 'center',
              }}
            >
              <p
                style={{
                  margin: '0',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  color: '#333',
                }}
              >
                {img.name}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
