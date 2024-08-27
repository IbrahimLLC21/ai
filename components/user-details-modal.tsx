import React, { useState, CSSProperties } from "react";
import Modal from "react-modal";

// Ensure Modal is correctly bound to the app
Modal.setAppElement("body");

// Define the type for the component props
interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (details: { name: string; position: string; company: string }) => void;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [company, setCompany] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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
            <label htmlFor="name" style={labelStyle}>Name</label>
            <input
              id="name" // Added id attribute to input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name" // Added autocomplete attribute
              style={inputStyle}
            />
          </div>
          <div>
            <label htmlFor="position" style={labelStyle}>Position</label>
            <input
              id="position" // Added id attribute to input
              type="text"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              required
              autoComplete="off" // No autocomplete for position field
              style={inputStyle}
            />
          </div>
          <div>
            <label htmlFor="company" style={labelStyle}>Company</label>
            <input
              id="company" // Added id attribute to input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
              autoComplete="organization" // Added autocomplete attribute
              style={inputStyle}
            />
          </div>
          <button type="submit" style={buttonStyle}>Submit</button>
        </form>
      </div>
    </Modal>
  );
};

const customStyles: ReactModal.Styles = {
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

const inputStyle: CSSProperties = {
  width: '100%',
  padding: '8px',
  margin: '4px 0 10px',
  boxSizing: 'border-box',
  borderRadius: '4px',
  border: '1px solid #ccc',
};

const buttonStyle: CSSProperties = {
  backgroundColor: '#6D28D9', // Matching button color to conversation page
  color: '#fff',
  padding: '10px',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};

const labelStyle: CSSProperties = {
  display: 'block',
  fontWeight: 'bold',
  marginBottom: '4px',
};

export default UserDetailsModal;
