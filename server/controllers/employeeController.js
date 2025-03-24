const Employee = require("../models/Employee");
const { cloudinary } = require("../config/cloudinary.js");

exports.getEmployees = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skipIndex = (page - 1) * limit;

  const searchQuery = {};

  if (req.query.search) {
    searchQuery.$text = { $search: req.query.search };
  }

  if (req.query.department) {
    searchQuery.department = req.query.department;
  }

  if (req.query.status) {
    searchQuery.status = req.query.status;
  }

  // Only fetch employees created by the current user if not admin
  if (req.user.role !== "admin") {
    searchQuery.createdBy = req.user.id;
  }

  const totalEmployees = await Employee.countDocuments(searchQuery);
  const employees = await Employee.find(searchQuery)
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skipIndex);

  res.status(200).json({
    success: true,
    count: employees.length,
    totalEmployees,
    totalPages: Math.ceil(totalEmployees / limit),
    currentPage: page,
    data: employees,
  });
};

exports.getEmployeeById = async (req, res) => {
  const employee = await Employee.findById(req.params.id);

  if (!employee) {
    return res.status(404).json({
      success: false,
      message: "Employee not found",
    });
  }

  if (
    req.user.role !== "admin" &&
    employee.createdBy.toString() !== req.user.id
  ) {
    return res.status(403).json({
      success: false,
      message: "You do not have permission to view this employee",
    });
  }

  res.status(200).json({
    success: true,
    data: employee,
  });
};

exports.createEmployee = async (req, res) => {
  const {
    name,
    email,
    phone,
    position,
    department,
    hireDate,
    salary,
    address,
    status,
    emergencyContact,
  } = req.body;

  let profileImage = {
    public_id: "employees/default",
    url: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
  };

  if (req.file) {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "employees",
      width: 250,
      height: 250,
      crop: "fill",
    });

    profileImage = {
      public_id: result.public_id,
      url: result.secure_url,
    };
  }

  const employee = await Employee.create({
    name,
    email,
    phone,
    position,
    department,
    hireDate: hireDate || Date.now(),
    salary,
    profileImage,
    address,
    status,
    emergencyContact,
    createdBy: req.user.id,
  });

  res.status(201).json({
    success: true,
    data: employee,
  });
};

exports.updateEmployee = async (req, res) => {
  let employee = await Employee.findById(req.params.id);

  if (!employee) {
    return res.status(404).json({
      success: false,
      message: "Employee not found",
    });
  }

  if (
    req.user.role !== "admin" &&
    employee.createdBy.toString() !== req.user.id
  ) {
    return res.status(403).json({
      success: false,
      message: "You do not have permission to update this employee",
    });
  }

  const {
    name,
    email,
    phone,
    position,
    department,
    hireDate,
    salary,
    address,
    status,
    emergencyContact,
  } = req.body;

  if (req.file) {
    if (employee.profileImage && employee.profileImage.public_id) {
      await cloudinary.uploader.destroy(employee.profileImage.public_id);
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "employees",
      width: 250,
      height: 250,
      crop: "fill",
    });

    req.body.profileImage = {
      public_id: result.public_id,
      url: result.secure_url,
    };
  }

  employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: employee,
  });
};

exports.deleteEmployee = async (req, res) => {
  const employee = await Employee.findById(req.params.id);

  if (!employee) {
    return res.status(404).json({
      success: false,
      message: "Employee not found",
    });
  }

  if (
    req.user.role !== "admin" &&
    employee.createdBy.toString() !== req.user.id
  ) {
    return res.status(403).json({
      success: false,
      message: "You do not have permission to delete this employee",
    });
  }

  if (employee.profileImage && employee.profileImage.public_id) {
    await cloudinary.uploader.destroy(employee.profileImage.public_id);
  }

  await employee.deleteOne();

  res.status(200).json({
    success: true,
    message: "Employee deleted successfully",
  });
};

exports.getDepartments = async (req, res) => {
  const departments = await Employee.distinct("department");

  res.status(200).json({
    success: true,
    data: departments,
  });
};
