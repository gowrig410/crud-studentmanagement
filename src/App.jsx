import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Import the CSS
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the toast CSS

const App = () => {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const [editingStudent, setEditingStudent] = useState(null);

  // Fetch students from the API
  useEffect(() => {
    const fetchStudents = async () => {
      const response = await axios.get('http://localhost:3000/students');
      setStudents(response.data);
    };
    fetchStudents();
  }, []);

  // Validation check
  const validateForm = () => {
    if (!name || !age || !email) {
      toast.error("All fields are required!", {
        position: "top-right",
        autoClose: 3000,
      });
      return false;
    }
    return true;
  };

  // Add a new student
  const addStudent = async () => {
    if (!validateForm()) return; // If validation fails, stop the process
    const newStudent = { name, age, email };
    const response = await axios.post('http://localhost:3000/students', newStudent);
    setStudents([...students, response.data]);
    clearForm();
    toast.success("Student added successfully!", {
      position: "top-right",
      autoClose: 3000,
    });
  };

  // Delete a student
  const deleteStudent = async (id) => {
    await axios.delete(`http://localhost:3000/students/${id}`);
    setStudents(students.filter(student => student.id !== id));
    toast.success("Student deleted successfully!", {
      position: "top-right",
      autoClose: 3000,
    });
  };

  // Update student details
  const updateStudent = async () => {
    if (!validateForm()) return; // If validation fails, stop the process
    const updatedStudent = { ...editingStudent, name, age, email };
    const response = await axios.put(`http://localhost:3000/students/${editingStudent.id}`, updatedStudent);
    setStudents(students.map(student => (student.id === editingStudent.id ? response.data : student)));
    setEditingStudent(null);
    clearForm();
    toast.success("Student updated successfully!", {
      position: "top-right",
      autoClose: 3000,
    });
  };

  // Edit a student (pre-fill form)
  const editStudent = (student) => {
    setName(student.name);
    setAge(student.age);
    setEmail(student.email);
    setEditingStudent(student);
  };

  // Clear form fields
  const clearForm = () => {
    setName('');
    setAge('');
    setEmail('');
    setEditingStudent(null);
  };

  return (
    <div className="app">
      {/* Toast Container */}
      <ToastContainer />

      {/* Header */}
      <header className="app-header">
        <h1>Student Management System</h1>
      </header>

      {/* Main Content */}
      <main>
        {/* Form Card */}
        <div className="card form-card">
          <h2>{editingStudent ? "Edit Student" : "Add Student"}</h2>
          <div className="form">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="number"
              placeholder="Age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {editingStudent ? (
              <button onClick={updateStudent} className="btn btn-update">Update Student</button>
            ) : (
              <button onClick={addStudent} className="btn btn-add">Add Student</button>
            )}
          </div>
        </div>

        {/* Student List Card */}
        <div className="card student-list-card">
          <h2>Student List</h2>
          <ul>
            {students.map((student) => (
              <li key={student.id} className="student-item">
                {student.name} (Age: {student.age}) - {student.email}
                <div className="actions">
                  <button onClick={() => editStudent(student)} className="btn btn-edit">Edit</button>
                  <button onClick={() => deleteStudent(student.id)} className="btn btn-delete">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>© 2024 Student Management App</p>
      </footer>
    </div>
  );
};

export default App;
