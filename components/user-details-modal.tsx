import React, { useState } from "react";
import Modal from "react-modal";

// Ensure Modal is correctly bound to the app
Modal.setAppElement("body");

const UserDetailsModal = ({ isOpen, onClose, onSubmit }) => {
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [company, setCompany] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && position && company) {
      onSubmit({ name, position, company });
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="User Details Modal"
      style={customStyles}
    >
      <div style={{ padding: "20px" }}>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <div>
            <label style={labelStyle}>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Position</label>
            <input
              type="text"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              required
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Company</label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
              style={inputStyle}
            />
          </div>
          <button type="submit" style={buttonStyle}>Submit</button>
        </form>
      </div>
    </Modal>
  );
};

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    padding: '20px',
    borderRadius: '8px',
    width: '300px',
  },
};

const inputStyle = {
  width: '100%',
  padding: '8px',
  margin: '4px 0 10px',
  boxSizing: 'border-box',
  borderRadius: '4px',
  border: '1px solid #ccc',
};

const buttonStyle = {
  backgroundColor: '#6D28D9', // Matching button color to conversation page
  color: '#fff',
  padding: '10px',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};

const labelStyle = {
  display: 'block',
  fontWeight: 'bold',
  marginBottom: '4px',
};

export default UserDetailsModal;
