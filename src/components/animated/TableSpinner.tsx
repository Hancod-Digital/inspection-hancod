
const TableSpinner: React.FC = () => {
    const loaderStyle: React.CSSProperties = {
      display: 'inline-block',
      width: '80px',
      height: '80px',
      position: 'relative',
    };
  
    const loaderAfterStyle: React.CSSProperties = {
      content: '""',
      display: 'block',
      width: '30px',
      height: '30px',
      margin: '18px',
      borderRadius: '50%',
      border: '3.4px solid hsl(350, 55%, 38%)',
      borderColor: 'hsl(350, 55%, 38%) transparent hsl(350, 55%, 38%) transparent',
      animation: 'lds-dual-ring 0.7s linear infinite',
    };
  
    return (
      <section className="w-[55%] flex justify-center items-center"> 
        <div style={loaderStyle}>
          <div style={loaderAfterStyle} className='border-primary'></div>
        </div>
        <style>
          {`
            @keyframes lds-dual-ring {
              0% {
                transform: rotate(0deg);
              }
              100% {
                transform: rotate(360deg);
              }
            }
          `}
        </style>
      </section>
    );
  };
  
export default TableSpinner;
