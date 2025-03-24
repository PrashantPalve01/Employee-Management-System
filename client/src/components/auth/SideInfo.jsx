import React from "react";

const SideInfo = () => {
  return (
    <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-r from-blue-700 to-indigo-800 p-12 flex-col justify-center">
      <div>
        <div className="flex items-center space-x-3">
          <svg
            className="w-10 h-10 text-white"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z" />
          </svg>
          <h1 className="text-2xl text-center font-bold text-white">EMS</h1>
        </div>

        <div className="mt-12">
          <h2 className="text-4xl font-bold text-white">
            Employee Management System
          </h2>
          <p className="mt-4 text-lg text-blue-100">
            Transform how you manage your workforce with our comprehensive
            solution
          </p>
        </div>
      </div>

      <div className="mt-12">
        <p className="text-blue-100 text-sm">
          Trusted by over 1,000+ companies worldwide
        </p>
      </div>
    </div>
  );
};

export default SideInfo;
