import React from 'react';

interface VideosIconProps {
  color: string;
}

const VideosIcon: React.FC<VideosIconProps> = ({ color }) => {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="24" height="24" fill="none" />
      <path
        d="M5 18H15C16.1046 18 17 17.1046 17 16V8.57143V8C17 6.89543 16.1046 6 15 6H5C3.89543 6 3 6.89543 3 8V16C3 17.1046 3.89543 18 5 18Z"
        stroke={color}
      />
      <circle cx="6.5" cy="9.5" r="2" stroke={color} />
      <path d="M17 10L21 7V17L17 14" stroke={color} />
    </svg>
  );
};

export default VideosIcon;
