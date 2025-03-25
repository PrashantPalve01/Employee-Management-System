import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { getEmployees, deleteEmployee } from "../redux/actions/employeeActions";
import {
  UserPlus,
  Eye,
  Edit2,
  Trash2,
  UserCheck,
  UserX,
  UserMinus,
  Search,
} from "lucide-react";
import debounce from "lodash/debounce";

const EmployeesPage = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    loading = false,
    employees = [],
    totalEmployees = 0,
    error = null,
  } = useSelector((state) => state.employee || {});

  const perPage = 10;
  const totalPages = Math.ceil(totalEmployees / perPage);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((searchTerm, page = 1) => {
      dispatch(
        getEmployees({
          page,
          search: searchTerm,
          limit: perPage,
        })
      );
    }, 500),
    [dispatch]
  );

  useEffect(() => {
    if (search.trim()) {
      debouncedSearch(search, 1);
    } else {
      dispatch(
        getEmployees({
          page: 1,
          search: "",
          limit: perPage,
        })
      );
    }

    return () => {
      debouncedSearch.cancel();
    };
  }, [search, dispatch, debouncedSearch]);

  useEffect(() => {
    dispatch(
      getEmployees({
        page: currentPage,
        search,
        limit: perPage,
      })
    );
  }, [dispatch, currentPage]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    debouncedSearch(search, 1);
  };

  const handleSearchChange = (e) => {
    const searchTerm = e.target.value;
    setSearch(searchTerm);
  };

  const handleAddEmployee = () => {
    try {
      navigate("/employees/add-edit");
    } catch (error) {
      console.error("Navigation error:", error);
      window.location.href = "/employees/add";
    }
  };

  const handleDeleteClick = (id) => {
    setConfirmDelete(id);
  };

  const handleConfirmDelete = () => {
    if (confirmDelete) {
      dispatch(deleteEmployee(confirmDelete))
        .then(() => {
          dispatch(
            getEmployees({
              page: currentPage,
              search,
              limit: perPage,
            })
          );
          setConfirmDelete(null);
        })
        .catch((error) => {
          console.error("Delete failed:", error);
          // Show error toast or notification
        });
    }
  };

  const getStatusIcon = (status) => {
    const statusIcons = {
      active: <UserCheck className="text-green-600 w-5 h-5" />,
      "on leave": <UserMinus className="text-yellow-600 w-5 h-5" />,
      terminated: <UserX className="text-red-600 w-5 h-5" />,
    };
    return statusIcons[status] || null;
  };

  const renderProfileImage = (employee) => {
    if (employee.profileImage) {
      const imageUrl =
        employee.profileImage.url ||
        employee.profileImage.path ||
        employee.profileImage;

      return (
        <img
          className="h-12 w-12 rounded-full object-cover border-2 border-gray-200"
          src={imageUrl}
          alt={employee.name}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/default-avatar.png";
          }}
        />
      );
    }

    return (
      <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center border-2 border-blue-200">
        <span className="text-blue-700 font-bold text-lg">
          {employee.name ? employee.name.charAt(0).toUpperCase() : "?"}
        </span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900">Employees</h1>
          <button
            onClick={handleAddEmployee}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            <UserPlus className="w-5 h-5" />
            <span>Add Employee</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center">
                <Search className="text-gray-400 w-5 h-5" />
              </div>
              <input
                type="text"
                placeholder="Search employees by name, email, or department..."
                value={search}
                onChange={handleSearchChange}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>
          </form>
        </div>

        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <p className="text-red-700">{error}</p>
            </div>
          ) : employees.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No employees found</p>
              <button
                onClick={handleAddEmployee}
                className="flex mx-auto items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
              >
                <UserPlus className="w-5 h-5" />
                <span>Add First Employee</span>
              </button>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  {[
                    "Employee",
                    "Position",
                    "Department",
                    "Status",
                    "Email",
                    "Actions",
                  ].map((header) => (
                    <th
                      key={header}
                      className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {employees.map((employee) => (
                  <tr
                    key={employee._id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4">
                        {renderProfileImage(employee)}
                        <div>
                          <div className="font-semibold text-gray-900">
                            {employee.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {employee.employeeId || "N/A"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {employee.position}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {employee.department}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(employee.status)}
                        <span className="capitalize text-gray-700">
                          {employee.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {employee.email}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-3">
                        <Link
                          to={`/employees/${employee._id}`}
                          className="text-blue-500 hover:text-blue-700 transition"
                          title="View Details"
                        >
                          <Eye className="w-5 h-5" />
                        </Link>
                        <Link
                          to={`/employees/add-edit/${employee._id}`}
                          className="text-green-500 hover:text-green-700 transition"
                          title="Edit Employee"
                        >
                          <Edit2 className="w-5 h-5" />
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(employee._id)}
                          className="text-red-500 hover:text-red-700 transition"
                          title="Delete Employee"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6 space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white border rounded-lg disabled:opacity-50 hover:bg-gray-100"
            >
              Previous
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-4 py-2 rounded-lg ${
                  currentPage === index + 1
                    ? "bg-blue-600 text-white"
                    : "bg-white border hover:bg-gray-100"
                }`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-white border rounded-lg disabled:opacity-50 hover:bg-gray-100"
            >
              Next
            </button>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {confirmDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full">
              <div className="flex items-center space-x-4 mb-4">
                <div className="bg-red-100 p-3 rounded-full">
                  <Trash2 className="text-red-600 w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  Confirm Deletion
                </h2>
              </div>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this employee? This action
                cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeesPage;
