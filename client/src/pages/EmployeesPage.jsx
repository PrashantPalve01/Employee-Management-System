import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getEmployees, deleteEmployee } from "../redux/actions/employeeActions";
import { Eye, Edit2, Trash2, UserCheck, UserX, UserMinus } from "lucide-react";

const EmployeesPage = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const dispatch = useDispatch();
  const { loading, employees, totalEmployees, error } = useSelector(
    (state) => state.employee
  );

  const perPage = 10;
  const totalPages = Math.ceil(totalEmployees / perPage);

  useEffect(() => {
    dispatch(getEmployees({ page: currentPage, search, limit: perPage }));
  }, [dispatch, currentPage, search]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    dispatch(getEmployees({ page: 1, search, limit: perPage }));
  };

  const handleDeleteClick = (id) => {
    setConfirmDelete(id);
  };

  const handleConfirmDelete = () => {
    if (confirmDelete) {
      dispatch(deleteEmployee(confirmDelete));
      setConfirmDelete(null);
      dispatch(getEmployees({ page: currentPage, search, limit: perPage }));
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <UserCheck className="text-green-500 w-5 h-5" />;
      case "on leave":
        return <UserMinus className="text-yellow-500 w-5 h-5" />;
      case "terminated":
        return <UserX className="text-red-500 w-5 h-5" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight text-gray-900">
              Employees
            </h1>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              {/* Existing search form and other components remain the same */}

              {/* Employee Table */}
              {!loading && employees?.length > 0 && (
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Employee
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Position
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Department
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {employees.map((employee) => (
                        <tr
                          key={employee._id}
                          className="hover:bg-gray-50 transition duration-150"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                {employee.profileImage ? (
                                  <img
                                    className="h-10 w-10 rounded-full object-cover"
                                    src={`${`http://localhost:5000`}/${
                                      employee.profileImage
                                    }`}
                                    alt={employee.name}
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = "/default-avatar.png";
                                    }}
                                  />
                                ) : (
                                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                    <span className="text-blue-600 font-semibold">
                                      {employee.name.charAt(0).toUpperCase()}
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {employee.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  ID: {employee.employeeId}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {employee.position}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {employee.department}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(employee.status)}
                              <span className="text-sm capitalize text-gray-700">
                                {employee.status}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {employee.email}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="flex justify-end space-x-3">
                              <Link
                                to={`/employees/${employee._id}`}
                                className="text-blue-500 hover:text-blue-700 transition duration-300"
                                title="View"
                              >
                                <Eye className="w-5 h-5" />
                              </Link>
                              <Link
                                to={`/employees/edit/${employee._id}`}
                                className="text-green-500 hover:text-green-700 transition duration-300"
                                title="Edit"
                              >
                                <Edit2 className="w-5 h-5" />
                              </Link>
                              <button
                                onClick={() => handleDeleteClick(employee._id)}
                                className="text-red-500 hover:text-red-700 transition duration-300"
                                title="Delete"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EmployeesPage;
