import React from 'react';

interface ChaseLogoProps {
  size?: number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

const ChaseLogo: React.FC<ChaseLogoProps> = ({ 
  size = 40, 
  color = '#117aca',
  className = '',
  style = {}
}) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      <path d="M55,45 L55,0 L70,0 L100,30 L100,45 Z" fill={color} />
      <path d="M55,55 L100,55 L100,70 L70,100 L55,100 Z" fill={color} />
      <path d="M45,55 L45,100 L30,100 L0,70 L0,55 Z" fill={color} />
      <path d="M45,45 L0,45 L0,30 L30,0 L45,0 Z" fill={color} />
    </svg>
  );
};

export default ChaseLogo;
