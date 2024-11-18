import React from 'react';
import './Tooltip.css'; // Ensure this path points to where you added the CSS

const Tooltip = ({ children, content, position = 'top' }:any) => {
  return (
    <div className={`tooltip ${position}`}>
      {children}
      <span className="tooltiptext">
        {typeof content === 'string' ? (
          content
        ) : (
          content // Can be any JSX, including images
        )}
      </span>
    </div>
  );
};

export default Tooltip;
