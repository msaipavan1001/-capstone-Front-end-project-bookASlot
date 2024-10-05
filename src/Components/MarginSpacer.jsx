import React from 'react';

// Accepts a margin prop to customize the spacer
const MarginSpacer = ({ size = 16 }) => {
    return (
        <div style={{ margin: `${size}px` }} />
    );
};
export default MarginSpacer