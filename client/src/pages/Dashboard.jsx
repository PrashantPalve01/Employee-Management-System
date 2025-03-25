import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Users, Building2, UserPlus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getEmployees } from "../redux/actions/employeeActions";

const StatCard = ({ icon, title, value, color }) => (
  <div className="bg-white shadow-md rounded-lg p-6 flex items-center space-x-4 hover:shadow-lg transition duration-300">
    <div className={`p-3 rounded-full ${color} bg-opacity-10`}>{icon}</div>
    <div>
      <p className="text-sm text-gray-500 font-medium">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Adjust this selector based on your actual reducer structure
  const {
    employees = [],
    totalEmployees = 0,
    loading,
    error,
  } = useSelector((state) => state.employee || {});

  const [stats, setStats] = useState([]);

  useEffect(() => {
    dispatch(
      getEmployees({
        page: 1,
        limit: 10,
        search: "",
      })
    );
  }, [dispatch]);

  useEffect(() => {
    if (employees && employees.length > 0) {
      const departmentGroups = employees.reduce((acc, employee) => {
        const dept = employee.department || "Unassigned";
        acc[dept] = (acc[dept] || 0) + 1;
        return acc;
      }, {});

      setStats([
        {
          icon: <Users className="text-blue-600" size={24} />,
          title: "Total Employees",
          value: totalEmployees || employees.length,
          color: "bg-blue-600",
        },
        {
          icon: <Building2 className="text-green-600" size={24} />,
          title: "Departments",
          value: Object.keys(departmentGroups).length,
          color: "bg-green-600",
        },
      ]);
    }
  }, [employees, totalEmployees]);

  const quickActions = [
    {
      title: "Manage Employees",
      description: "View and manage employee records",
      link: "/employees",
      icon: <Users className="text-blue-600" size={24} />,
    },
    {
      title: "Add New Employee",
      description: "Add a new employee to the system",
      link: "/employees/add-edit",
      icon: <UserPlus className="text-green-600" size={24} />,
      onClick: () => navigate("/employees/add-edit"),
    },
  ];

  const handleAddEmployee = () => {
    navigate("/employees/add-edit");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white shadow-md rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Error Loading Dashboard
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() =>
              dispatch(
                getEmployees({
                  page: 1,
                  limit: 10,
                  search: "",
                })
              )
            }
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Dashboard Overview
            </h1>
            <p className="text-gray-600">
              Quick insights into your Employee Management System
            </p>
          </div>
          <button
            onClick={handleAddEmployee}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            <UserPlus className="w-5 h-5" />
            <span>Add Employee</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              icon={stat.icon}
              title={stat.title}
              value={stat.value}
              color={stat.color}
            />
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quickActions.map((action, index) => (
              <Link
                to={action.link}
                key={index}
                onClick={action.onClick}
                className="border border-gray-200 rounded-lg p-6 flex items-center space-x-4 hover:shadow-md hover:border-blue-200 transition duration-300 group"
              >
                <div className="p-3 rounded-full bg-gray-100">
                  {action.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-500">{action.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
