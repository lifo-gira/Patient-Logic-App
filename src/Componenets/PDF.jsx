import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import Graphs from './Graphs';

const PDF = () => {
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const handleDownload = async () => {
    setTimeout(() => {
      handlePrint();
    }, 500);
  };

  const datasets = [
    [
      { name: 'Jan', uv: 400, pv: 2400, amt: 2400 },
      { name: 'Feb', uv: 300, pv: 4567, amt: 2400 },
      { name: 'Mar', uv: 200, pv: 1398, amt: 2400 },
      { name: 'Apr', uv: 278, pv: 3908, amt: 2400 },
      { name: 'May', uv: 189, pv: 4800, amt: 2400 },
    ],
    [
      { name: 'Jan', uv: 100, pv: 2000, amt: 2000 },
      { name: 'Feb', uv: 150, pv: 3567, amt: 2000 },
      { name: 'Mar', uv: 250, pv: 1898, amt: 2000 },
      { name: 'Apr', uv: 328, pv: 2908, amt: 2000 },
      { name: 'May', uv: 289, pv: 3800, amt: 2000 },
    ],
    [
      { name: 'Jan', uv: 500, pv: 4400, amt: 4400 },
      { name: 'Feb', uv: 400, pv: 3567, amt: 4400 },
      { name: 'Mar', uv: 300, pv: 1898, amt: 4400 },
      { name: 'Apr', uv: 478, pv: 3908, amt: 4400 },
      { name: 'May', uv: 389, pv: 4800, amt: 4400 },
    ],
    [
      { name: 'Jan', uv: 200, pv: 3400, amt: 3400 },
      { name: 'Feb', uv: 100, pv: 2567, amt: 3400 },
      { name: 'Mar', uv: 50, pv: 1898, amt: 3400 },
      { name: 'Apr', uv: 278, pv: 2908, amt: 3400 },
      { name: 'May', uv: 189, pv: 3800, amt: 3400 },
    ],
    [
      { name: 'Jan', uv: 300, pv: 2400, amt: 2400 },
      { name: 'Feb', uv: 200, pv: 1567, amt: 2400 },
      { name: 'Mar', uv: 100, pv: 989, amt: 2400 },
      { name: 'Apr', uv: 178, pv: 1908, amt: 2400 },
      { name: 'May', uv: 89, pv: 2800, amt: 2400 },
    ],
  ];

  return (
    <div>
      <h1>React PDF Generator</h1>
      <div style={{ display: 'none' }}>
        {/* Render graphs for PDF generation */}
        <Graphs ref={componentRef} isVisible={true} datasets={datasets} />
      </div>

      <div>
        <button onClick={handleDownload}>Download PDF</button>
        <button onClick={handlePrint}>Print PDF</button>
      </div>
    </div>
  );
};

export default PDF;