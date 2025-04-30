import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEdit, FaTrash, FaPlus, FaSearch } from "react-icons/fa";
import { useForm } from "react-hook-form";

const App = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentStudentId, setCurrentStudentId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm();

  const fetchStudents = async () => {
    try {
      const response = await axios.get("http://localhost:5010/students");
      setStudents(response.data);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to fetch students");
      setLoading(false);
    }
  };

  const openAddModal = () => {
    reset();
    setCurrentStudentId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (student) => {
    setValue("name", student.name);
    setValue("email", student.email);
    setValue("age", student.age);
    setCurrentStudentId(student.id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const onSubmit = async (data) => {
    try {
      if (currentStudentId) {
        await axios.put(
          `http://localhost:5010/students/${currentStudentId}`,
          data
        );
        toast.success("Student updated successfully");
      } else {
        await axios.post("http://localhost:5010/students", data);
        toast.success("Student added successfully");
      }
      fetchStudents();
      closeModal();
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };
  const openDeleteDialog = (id) => {
    setCurrentStudentId(id);
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5010/students/${currentStudentId}`);
      toast.success("Student deleted successfully");
      fetchStudents();
      closeDeleteDialog();
    } catch (error) {
      toast.error("Failed to delete student");
    }
  };

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredStudents.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );
  const totalPages = Math.ceil(filteredStudents.length / recordsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div className="container mt-4">
      {/* Header and controls */}
      <h1 className="text-center mb-4">Student Management</h1>

      <div className="d-flex justify-content-between mb-4">
        <button onClick={openAddModal} className="btn btn-primary">
          <FaPlus className="me-2" />
          Add New Student
        </button>

        <div className="input-group" style={{ width: "300px" }}>
          <span className="input-group-text">
            <FaSearch />
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : currentRecords.length === 0 ? (
        <div className="alert alert-info">No students found</div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Age</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentRecords.map((student, index) => (
                  <tr key={student.id}>
                    <td>{(currentPage - 1) * recordsPerPage + index + 1}</td>
                    <td>{student.name}</td>
                    <td>{student.email}</td>
                    <td>{student.age}</td>
                    <td>
                      <button
                        onClick={() => openEditModal(student)}
                        className="btn btn-sm btn-outline-primary me-2"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => openDeleteDialog(student.id)}
                        className="btn btn-sm btn-outline-danger"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <nav className="mt-4">
              <ul className="pagination justify-content-center">
                <li
                  className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => paginate(currentPage - 1)}
                  >
                    Previous
                  </button>
                </li>

                {[...Array(totalPages).keys()].map((number) => (
                  <li
                    key={number + 1}
                    className={`page-item ${
                      currentPage === number + 1 ? "active" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => paginate(number + 1)}
                    >
                      {number + 1}
                    </button>
                  </li>
                ))}

                <li
                  className={`page-item ${
                    currentPage === totalPages ? "disabled" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => paginate(currentPage + 1)}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </>
      )}

      {isModalOpen && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {currentStudentId ? "Edit Student" : "Add New Student"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                  aria-label="Close"
                ></button>
              </div>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.name ? "is-invalid" : ""
                      }`}
                      {...register("name", { required: "Name is required" })}
                    />
                    {errors.name && (
                      <div className="invalid-feedback">
                        {errors.name.message}
                      </div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className={`form-control ${
                        errors.email ? "is-invalid" : ""
                      }`}
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address",
                        },
                      })}
                    />
                    {errors.email && (
                      <div className="invalid-feedback">
                        {errors.email.message}
                      </div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Age</label>
                    <input
                      type="number"
                      className={`form-control ${
                        errors.age ? "is-invalid" : ""
                      }`}
                      {...register("age", {
                        required: "Age is required",
                        min: {
                          value: 1,
                          message: "Age must be at least 1",
                        },
                        max: {
                          value: 120,
                          message: "Age must be less than 120",
                        },
                      })}
                    />
                    {errors.age && (
                      <div className="invalid-feedback">
                        {errors.age.message}
                      </div>
                    )}
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {currentStudentId ? "Update" : "Save"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {isDeleteDialogOpen && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Deletion</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeDeleteDialog}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  Are you sure you want to delete this student? This action
                  cannot be undone.
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeDeleteDialog}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
