import { useEffect, useState } from "react";
const DashboardAdmin = () => {
const [currentDateTime, setCurrentDateTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer); 
  }, []);
  return (
    <div className="flex-grow-1 p-4">
        <div className="card bg-success ">
          <div className="card-body text-start">
          <div className="text-white">
            <h1 className="card-title">Welcome to Admin Dashboard</h1>
          </div>
          <p className="text-white"><strong>Date:</strong> {currentDateTime.toLocaleDateString()}</p>
          <p className="text-white"><strong>Time:</strong> {currentDateTime.toLocaleTimeString()}</p>
        </div>
        </div>
        </div>
  );
};

export default DashboardAdmin;
