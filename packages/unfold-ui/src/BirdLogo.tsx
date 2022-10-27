import React from 'react';

export const BirdLogo = (): JSX.Element => (
  <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
    <style>{`
    .beak,
    .back,
    .wing-inner{
      fill: #5BCDF4;
    }
    .stomach-neck,
    .wing-tip,
    .wing {
      fill: #2488FF;
    }
  `}</style>
    <path
      className="beak"
      d="M410.455,7.048l92.686,94.281c1.519,1.545,0.529,4.161-1.633,4.312l-203.935,14.29L410.455,7.048z"
    />
    <path
      className="back"
      d="M216.118,201.384L76.802,509.007c-0.967,2.136,1.752,4.018,3.41,2.36l316.491-316.491L410.455,7.048 L216.118,201.384z"
    />
    <path
      className="stomach-neck"
      d="M358.275,59.228l-8.73,119.239L76.801,509.007c-0.967,2.136,1.752,4.018,3.41,2.36l316.491-316.491 L410.455,7.048L358.275,59.228z"
    />
    <path
      className="wing-tip"
      d="M9.245,0.001l174.048,5.652L384.61,206.969l-85.52,85.52L8.446,1.845 C7.754,1.152,8.266-0.031,9.245,0.001z"
    />
    <path className="wing-inner" d="M183.294,5.652 L234.733,356.845 L384.61,206.969 Z" />
    <path
      className="wing"
      d="M183.294,5.652l11.677,79.726l100.326,100.326c20.012,20.012,20.012,52.458,0,72.47l-65.433,65.433 l4.868,33.237L384.61,206.968L183.294,5.652z"
    />
  </svg>
);
