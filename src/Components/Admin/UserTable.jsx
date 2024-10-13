import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { styled } from '@mui/system';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";
 
// Styled components for the table cells
const StyledTableCell = styled(TableCell)({
  fontWeight: 'bold',
  fontSize: '16px',
  color: '#424242',
  backgroundColor: '#f5f5f5',
});
 
// Styled components for the table rows
const StyledTableRow = styled(TableRow)({
  '&:nth-of-type(odd)': {
    backgroundColor: '#f9f9f9',
  },
  '&:hover': {
    backgroundColor: '#e0f7fa',
    cursor: 'pointer',
  },
});
 
// Button styles
const StyledButton = styled(Button)({
  marginLeft: '10px',
});
 
const UserTable = ({ users }) => {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [editData, setEditData] = useState({
    name: '',
    userName: '',
    aadhaarCard: '',
    password: '',
    contactNumber: '',
    address: '',
    pincode: '',
  });
  const { isOpen, onOpenChange } = useDisclosure();

  
 
  // Fetch user details for editing
  const fetchUserDetails = async (userId) => {
    try {
      const response = await fetch(`https://localhost:5002/api/users/${userId}`);
      if (!response.ok) throw new Error("Failed to fetch user details");
      const data = await response.json();
      setEditData({
        name: data.name || '',
        userName: data.userName || '',
        aadhaarCard: data.aadhaarCard || '',
        password: data.password || '',
        contactNumber: data.contactNumber || '',
        address: data.address || '',
        pincode: data.pincode || '',
      });
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };
 
  // Open the edit modal
  const handleEditClick = async (userId) => {
    setSelectedUserId(userId);
    await fetchUserDetails(userId);
    onOpenChange(true); // Open the modal
  };
 
  // Save the edited user
  const handleSaveEdit = async () => {
    const payload = {userId: selectedUserId};
    for (const key in editData) {
      if (editData[key] !== "") {
        payload[key.charAt(0).toUpperCase() + key.slice(1)] = editData[key];
      }
    }
    try {
      const response = await fetch(`https://localhost:5002/api/users`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload), // Send the data as JSON
      });
 
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to edit the user");
      }
 
      onOpenChange(false); // Close the modal
      window.location.reload(); // Refresh the page (optional)
    } catch (error) {
      console.error("Error editing user:", error);
      alert("An error occurred while saving the user. Please try again.");
    }
  };
 
  // Delete a user
  const handleDeleteClick = async (userId) => {
    try {
      const response = await fetch(`https://localhost:5002/api/users/${userId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete the user");
      alert('User deleted successfully.');
      window.location.reload(); // Refresh the page (optional)
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };
 
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };
 
  return (
    <>
      <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: '12px' }}>
        <Table>
          <TableHead>
            <StyledTableRow>
              <StyledTableCell align="center">User ID</StyledTableCell>
              <StyledTableCell align="center">Name</StyledTableCell>
              <StyledTableCell align="center">Username</StyledTableCell>
              <StyledTableCell align="center">Aadhaar Card</StyledTableCell>
              <StyledTableCell align="center">Password</StyledTableCell>
              <StyledTableCell align="center">Contact Number</StyledTableCell>
              <StyledTableCell align="center">Address</StyledTableCell>
              <StyledTableCell align="center">Pincode</StyledTableCell>
              <StyledTableCell align="center">Actions</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {users.length > 0 ? (
              users.map((user) => (
                <StyledTableRow key={user.userId}>
                  <TableCell align="center">{user.userId}</TableCell>
                  <TableCell align="center">{user.name}</TableCell>
                  <TableCell align="center">{user.userName}</TableCell>
                  <TableCell align="center">{user.aadhaarCard}</TableCell>
                  <TableCell align="center">{user.password}</TableCell>
                  <TableCell align="center">{user.contactNumber}</TableCell>
                  <TableCell align="center">{user.address}</TableCell>
                  <TableCell align="center">{user.pincode}</TableCell>
                  <TableCell align="center">
                    <StyledButton variant="contained" color="primary" size="small" onClick={() => handleEditClick(user.userId)}>
                      Edit
                    </StyledButton>
                    <StyledButton variant="contained" color="secondary" size="small" onClick={() => handleDeleteClick(user.userId)}>
                      Delete
                    </StyledButton>
                  </TableCell>
                </StyledTableRow>
              ))
            ) : (
              <StyledTableRow>
                <TableCell colSpan={9} align="center">
                  No users available
                </TableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
 
      {/* Modal for editing user */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Edit User</ModalHeader>
              <ModalBody>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={editData.name || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 mb-2 border border-gray-300 rounded"
                />
                <input
                  type="text"
                  name="userName"
                  placeholder="Username"
                  value={editData.userName || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 mb-2 border border-gray-300 rounded"
                />
                <input
                  type="number"
                  name="aadhaarCard"
                  placeholder="Aadhaar Card"
                  value={editData.aadhaarCard || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 mb-2 border border-gray-300 rounded"
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={editData.password || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 mb-2 border border-gray-300 rounded"
                />
                <input
                  type="number"
                  name="contactNumber"
                  placeholder="Contact Number"
                  value={editData.contactNumber || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 mb-2 border border-gray-300 rounded"
                />
                <input
                  type="text"
                  name="address"
                  placeholder="Address"
                  value={editData.address || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 mb-2 border border-gray-300 rounded"
                />
                <input
                  type="number"
                  name="pincode"
                  placeholder="Pincode"
                  value={editData.pincode || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 mb-2 border border-gray-300 rounded"
                />
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onClick={handleSaveEdit}>
                  Save Changes
                </Button>
                <Button color="secondary" onClick={onClose}>
                  Cancel
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
 
export default UserTable;