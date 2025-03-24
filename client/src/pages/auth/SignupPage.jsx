import React from "react";
import SignupForm from "../../components/auth/SignupForm";
import { Link } from "react-router-dom";
import SideInfo from "../../components/auth/SideInfo";

const SignupPage = () => {
  return (
    <div className="min-h-screen flex bg-white">
      <SideInfo />
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-4 sm:px-6 lg:px-16 xl:px-24">
        <div className="max-w-md w-full mx-auto">
          <div className="lg:hidden mb-6">
            <div className="flex justify-center">
              <div className="flex items-center space-x-2">
                <svg
                  className="w-8 h-8 text-blue-600"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z" />
                </svg>
                <h1 className="text-xl font-bold text-gray-900">EMS Pro</h1>
              </div>
            </div>
          </div>

          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Create an account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Join EMS Pro and start managing your team efficiently
            </p>
          </div>

          <div className="mt-8">
            <SignupForm />

            <div className="mt-6">
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 text-center">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} EMS Pro. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
