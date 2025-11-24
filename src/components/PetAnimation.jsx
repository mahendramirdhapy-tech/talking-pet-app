import React from 'react';

const PetAnimation = ({ position, isTalking, petType = 'cat' }) => {
  const petStyle = {
    left: `${position.x}%`,
    top: `${position.y}%`,
    transform: `translate(-50%, -50%)`,
    filter: isTalking ? 'drop-shadow(0 0 10px #ff0066)' : 'none',
    animation: isTalking ? 'talk 0.2s infinite alternate' : 'none'
  };

  const renderPet = () => {
    const baseProps = {
      width: "120",
      height: "120",
      viewBox: "0 0 100 100"
    };

    switch (petType) {
      case 'dog':
        return (
          <svg {...baseProps}>
            {/* Dog Body */}
            <ellipse cx="50" cy="60" rx="35" ry="25" fill="#8B4513" />
            
            {/* Dog Head */}
            <circle cx="50" cy="40" r="25" fill="#8B4513" />
            
            {/* Ears */}
            <ellipse cx="35" cy="25" rx="8" ry="12" fill="#5D4037" />
            <ellipse cx="65" cy="25" rx="8" ry="12" fill="#5D4037" />
            
            {/* Eyes */}
            <circle cx="42" cy="35" r="4" fill="#333" />
            <circle cx="58" cy="35" r="4" fill="#333" />
            
            {/* Nose */}
            <circle cx="50" cy="45" r="3" fill="#333" />
            
            {/* Mouth */}
            <path 
              d={`M 45 50 Q 50 ${isTalking ? '60' : '55'} 55 50`} 
              stroke="#333" 
              strokeWidth="2" 
              fill="none" 
            />
            
            {/* Tongue when talking */}
            {isTalking && (
              <ellipse cx="50" cy="58" rx="4" ry="3" fill="#ff6666" />
            )}
          </svg>
        );

      case 'bear':
        return (
          <svg {...baseProps}>
            {/* Bear Body */}
            <circle cx="50" cy="60" r="30" fill="#795548" />
            
            {/* Bear Head */}
            <circle cx="50" cy="35" r="25" fill="#795548" />
            
            {/* Ears */}
            <circle cx="35" cy="20" r="8" fill="#5D4037" />
            <circle cx="65" cy="20" r="8" fill="#5D4037" />
            
            {/* Eyes */}
            <circle cx="42" cy="30" r="3" fill="#333" />
            <circle cx="58" cy="30" r="3" fill="#333" />
            
            {/* Nose */}
            <ellipse cx="50" cy="40" rx="4" ry="3" fill="#333" />
            
            {/* Mouth */}
            <path 
              d={`M 46 45 Q 50 ${isTalking ? '52' : '48'} 54 45`} 
              stroke="#333" 
              strokeWidth="2" 
              fill="none" 
            />
          </svg>
        );

      default: // cat
        return (
          <svg {...baseProps}>
            {/* Cat Body */}
            <ellipse cx="50" cy="65" rx="25" ry="20" fill="#ff9966" />
            
            {/* Cat Head */}
            <circle cx="50" cy="45" r="22" fill="#ff9966" />
            
            {/* Ears */}
            <polygon points="35,25 45,35 30,35" fill="#ff9966" />
            <polygon points="65,25 70,35 55,35" fill="#ff9966" />
            
            {/* Inner Ears */}
            <polygon points="37,28 42,34 33,34" fill="#ff6666" />
            <polygon points="63,28 67,34 58,34" fill="#ff6666" />
            
            {/* Eyes */}
            <ellipse cx="42" cy="40" rx="3" ry="4" fill="#333" />
            <ellipse cx="58" cy="40" rx="3" ry="4" fill="#333" />
            
            {/* Nose */}
            <polygon points="50,47 47,50 53,50" fill="#ff6666" />
            
            {/* Mouth */}
            <path 
              d={`M 47 52 Q 50 ${isTalking ? '60' : '55'} 53 52`} 
              stroke="#333" 
              strokeWidth="1.5" 
              fill="none" 
            />
            
            {/* Whiskers */}
            <line x1="30" y1="45" x2="40" y2="47" stroke="#333" strokeWidth="1" />
            <line x1="30" y1="50" x2="40" y2="50" stroke="#333" strokeWidth="1" />
            <line x1="30" y1="55" x2="40" y2="53" stroke="#333" strokeWidth="1" />
            <line x1="70" y1="45" x2="60" y2="47" stroke="#333" strokeWidth="1" />
            <line x1="70" y1="50" x2="60" y2="50" stroke="#333" strokeWidth="1" />
            <line x1="70" y1="55" x2="60" y2="53" stroke="#333" strokeWidth="1" />
          </svg>
        );
    }
  };

  const petNames = {
    cat: 'Billi',
    dog: 'Kutta',
    bear: 'Bhalu'
  };

  return (
    <div className="pet-animation" style={petStyle}>
      <div className="pet-svg">
        {renderPet()}
      </div>
      <div className="pet-name-tag">
        {petNames[petType]}
        {isTalking && <span className="talking-dot"> 🔊</span>}
      </div>
    </div>
  );
};

export default PetAnimation;
