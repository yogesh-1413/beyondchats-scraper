import React from "react";
import { Link } from "react-router-dom";

function PageNotFound() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">    
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-xl text-gray-600">Page Not Found</p>
        <Link to="/" className="mt-6 text-blue-500 hover:underline">Go to Home</Link>
    </div>
  );
}   
export default PageNotFound;