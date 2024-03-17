import React from 'react';

interface DocumentsIconProps {
  color: string;
}

const DocumentsIcon: React.FC<DocumentsIconProps> = ({ color }) => {
  return (
    <svg
      fill={color}
      height="100%"
      width="100%"
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>
        <polygon points="324.267,119.467 324.267,0 153.6,0 153.6,102.4 153.6,409.6 358.4,409.6 443.733,409.6 443.733,119.467" />
      </g>
      <g>
        <polygon points="358.4,0 358.4,85.333 443.733,85.333" />
      </g>
      <g>
        <polygon points="119.467,443.733 119.467,102.4 68.267,102.4 68.267,512 358.4,512 358.4,443.733" />
      </g>
    </svg>
  );
};

export default DocumentsIcon;
