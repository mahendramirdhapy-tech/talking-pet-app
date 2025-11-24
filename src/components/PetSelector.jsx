import React from 'react';

const PetSelector = ({ selectedPet, onPetSelect }) => {
  const pets = [
    {
      id: 'cat',
      name: 'Billi',
      emoji: '🐱',
      color: '#ff9966'
    },
    {
      id: 'dog', 
      name: 'Kutta',
      emoji: '🐶',
      color: '#8B4513'
    },
    {
      id: 'bear',
      name: 'Bhalu',
      emoji: '🐻',
      color: '#795548'
    }
  ];

  return (
    <div className="pet-selection">
      <h3>Apna Pet Chunein:</h3>
      <div className="pet-options">
        {pets.map(pet => (
          <div
            key={pet.id}
            className={`pet-option ${selectedPet === pet.id ? 'selected' : ''}`}
            onClick={() => onPetSelect(pet.id)}
            style={{
              borderColor: selectedPet === pet.id ? pet.color : 'transparent'
            }}
          >
            <div className="pet-emoji" style={{ fontSize: '3rem' }}>
              {pet.emoji}
            </div>
            <div className="pet-label">{pet.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PetSelector;
