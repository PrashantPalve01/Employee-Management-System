const express = require("express");
const employeeRoutes = express.Router();
const auth = require("../middleware/auth");
const { upload } = require("../config/cloudinary");
const {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} = require("../controllers/employeeController");

employeeRoutes.get("/", auth, getEmployees);

employeeRoutes.get("/:id", auth, getEmployeeById);

employeeRoutes.post("/", auth, upload.single("profilePicture"), createEmployee);

employeeRoutes.put(
  "/:id",
  auth,
  upload.single("profilePicture"),
  updateEmployee
);

employeeRoutes.delete("/:id", auth, deleteEmployee);

module.exports = employeeRoutes;
