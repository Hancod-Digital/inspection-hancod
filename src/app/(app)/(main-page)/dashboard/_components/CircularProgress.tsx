import React from 'react';

const CircularProgress = ({ value, label }:{value:number,label:string}) => (
   
    <CircularComponent number={value} label={label + (value === 1 ? '' : 's')} />
   
);

export default CircularProgress;


const CircularComponent: React.FC<{ number: number; label: string }> = ({ number, label }) => {
  return (
//     <div className="outer-border">
//     <div className="outer-circle">
//       <div className="middle-border">
//         <div className="middle-circle"></div>
//       </div>
//     </div>
//   </div>
<div className="gradient-wrapper">
<div id="maincircle">
    <div className="inner-gradient-wrapper ">
      <div id="innercircle" className='flex flex-col justify-center items-center'>
         <div className='text-primary font-bold text-4xl'>
            {number}
         </div>
         <div className='text-black '>
            {label}
         </div>
      </div>
    </div>
  </div>
</div>
  );
};
