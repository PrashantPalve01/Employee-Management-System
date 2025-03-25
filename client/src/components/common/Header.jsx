import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/actions/authActions";

const Header = () => {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  const isActive = (path) => {
    return location.pathname === path
      ? "text-blue-600 font-semibold border-b-2 border-blue-600"
      : "text-gray-600 hover:text-blue-600 hover:border-b-2 hover:border-blue-600";
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/dashboard"
            className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition duration-300"
          >
            EMS
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            <Link
              to="/dashboard"
              className={`${isActive(
                "/dashboard"
              )} transition duration-300 px-2`}
            >
              Dashboard
            </Link>
            <Link
              to="/employees"
              className={`${isActive(
                "/employees"
              )} transition duration-300 px-2`}
            >
              Employees
            </Link>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center space-x-2 focus:outline-none"
              >
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-medium">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <span className="text-gray-700 hover:text-blue-600 transition duration-300">
                  {user?.name || "User"}
                </span>
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 mt-4 w-48 bg-white rounded-lg shadow-xl border border-gray-100 z-20">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-lg transition duration-300"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
