const Employee = require("../models/Employee");
const { cloudinary } = require("../config/cloudinary.js");

exports.getEmployees = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skipIndex = (page - 1) * limit;

    const searchQuery = {
      createdBy: req.user.id,
    };

    if (req.query.search) {
      searchQuery.$text = { $search: req.query.search };
    }

    if (req.query.department) {
      searchQuery.department = req.query.department;
    }

    if (req.query.status) {
      searchQuery.status = req.query.status;
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
  } catch (error) {
    console.error("Error in getEmployees:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching employees",
      error: error.message,
    });
  }
};

exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findOne({
      _id: req.params.id,
      createdBy: req.user.id,
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found or you do not have permission",
      });
    }

    res.status(200).json({
      success: true,
      data: employee,
    });
  } catch (error) {
    console.error("Error in getEmployeeById:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching employee",
      error: error.message,
    });
  }
};

exports.createEmployee = async (req, res) => {
  try {
    const address = req.body.address
      ? typeof req.body.address === "string"
        ? JSON.parse(req.body.address)
        : req.body.address
      : {};

    const emergencyContact = req.body.emergencyContact
      ? typeof req.body.emergencyContact === "string"
        ? JSON.parse(req.body.emergencyContact)
        : req.body.emergencyContact
      : {};

    let profileImage = {
      public_id: "employees/default",
      url: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
    };

    if (req.file) {
      const pathParts = req.file.path.split("/");
      const publicIdWithExtension = pathParts[pathParts.length - 1];
      const publicId = publicIdWithExtension.split(".")[0];

      profileImage = {
        public_id: `employee_profiles/${publicId}`,
        url: req.file.path,
      };
    }

    const employee = await Employee.create({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      position: req.body.position,
      department: req.body.department,
      hireDate: req.body.hireDate || Date.now(),
      salary: req.body.salary || null,
      profileImage,
      address,
      status: req.body.status,
      emergencyContact,
      createdBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      data: employee,
    });
  } catch (error) {
    console.error("Detailed Error in createEmployee:", error);
    res.status(500).json({
      success: false,
      message: "Server error while creating employee",
      error: error.message,
    });
  }
};

exports.updateEmployee = async (req, res) => {
  try {
    let employee = await Employee.findOne({
      _id: req.params.id,
      createdBy: req.user.id, // Ensure the employee belongs to the current user
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found or you do not have permission",
      });
    }

    // Prepare update data
    const updateData = { ...req.body };

    // Handle nested objects (address and emergencyContact)
    if (req.body.address) {
      updateData.address =
        typeof req.body.address === "string"
          ? JSON.parse(req.body.address)
          : req.body.address;
    }

    if (req.body.emergencyContact) {
      updateData.emergencyContact =
        typeof req.body.emergencyContact === "string"
          ? JSON.parse(req.body.emergencyContact)
          : req.body.emergencyContact;
    }

    // Handle profile image upload
    if (req.file) {
      try {
        // Delete existing image from Cloudinary if it exists
        if (employee.profileImage && employee.profileImage.public_id) {
          await cloudinary.uploader.destroy(employee.profileImage.public_id);
        }

        // Upload new image
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "employees",
          width: 250,
          height: 250,
          crop: "fill",
        });

        // Update profileImage in the update data
        updateData.profileImage = {
          public_id: result.public_id,
          url: result.secure_url,
        };
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        return res.status(500).json({
          success: false,
          message: "Error uploading profile image",
          error: uploadError.message,
        });
      }
    }

    // Perform the update
    employee = await Employee.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: employee,
    });
  } catch (error) {
    console.error("Error in updateEmployee:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating employee",
      error: error.message,
    });
  }
};

exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findOne({
      _id: req.params.id,
      createdBy: req.user.id, // Ensure the employee belongs to the current user
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found or you do not have permission",
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
  } catch (error) {
    console.error("Error in deleteEmployee:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting employee",
      error: error.message,
    });
  }
};
