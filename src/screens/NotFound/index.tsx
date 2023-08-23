import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold text-MainHeading mb-8">404 - Page Not Found</h1>
      <p className="text-SubHeading text-lg mb-8">Sorry, the page you are looking for could not be found.</p>
      <button onClick={() => navigate(-1)} className="w-24 text-white font-Pm text-[14px] bg-gradientDarkBlue py-2 rounded-[6px] self-center focus:outline-none disabled:opacity-60">
        Go Back
      </button>
    </div>
  );
};

export default NotFound;
