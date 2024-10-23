import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from '@mui/material';
import { styled } from '@mui/system';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@nextui-org/react';

// Custom styled components for table
const StyledTableCell = styled(TableCell)({
  fontWeight: 'bold',
  fontSize: '16px',
  color: '#424242',
  backgroundColor: '#f5f5f5',
});

const StyledTableRow = styled(TableRow)({
  '&:nth-of-type(odd)': {
    backgroundColor: '#f9f9f9',
  },
  '&:hover': {
    backgroundColor: '#e0f7fa',
    cursor: 'pointer',
  },
});

// Mapping object for status values
const statusMapping = {
  0: 'Pending',
  1: 'Completed',
  2: 'Cancelled',
};

const TransactionTable = () => {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);
  const { isOpen, onOpenChange } = useDisclosure();
  const [selectedTransactionId, setSelectedTransactionId] = useState(null);
  const [editData, setEditData] = useState({
    propertyId: '',
    buyerId: '',
    brokerId: '',
    transactionDate: '',
    amount: '',
    status: 0, // Default to Pending (0)
  });

  // Fetch transactions on component load
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch('https://localhost:5010/api/transactions');
        if (!response.ok) throw new Error(`Error fetching transactions: ${response.statusText}`);
        const data = await response.json();
        setTransactions(data);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchTransactions();
  }, []);

  // Fetch transaction details for editing
  const fetchTransactionDetails = async (transactionId) => {
    try {
      const response = await fetch(`https://localhost:5010/api/transactions/${transactionId}`);
      if (!response.ok) throw new Error('Failed to fetch transaction details');
      const data = await response.json();
      setEditData({
        propertyId: data.propertyId,
        buyerId: data.buyerId,
        brokerId: data.brokerId,
        transactionDate: data.transactionDate.split('T')[0],
        amount: data.amount,
        status: data.status, // Keep status as a number (0, 1, 2)
      });
    } catch (error) {
      console.error('Error fetching transaction details:', error);
    }
  };

  // Handle edit click and open the modal
  const handleEditClick = async (transactionId) => {
    setSelectedTransactionId(transactionId);
    await fetchTransactionDetails(transactionId);
    onOpenChange(true); // Open the modal
  };

  // Save the edited transaction
  const handleSaveEdit = async () => {
    try {
      const response = await fetch(`https://localhost:5010/api/transactions/${selectedTransactionId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editData), // Send the edited data as JSON
      });

      if (!response.ok) throw new Error('Failed to edit the transaction');

      // Check if the status is completed and update the property status
      if (editData.status === 1) {
        await updatePropertyStatus(editData.propertyId);
      }

      setTransactions((prevTransactions) =>
        prevTransactions.map((transaction) =>
          transaction.transactionId === selectedTransactionId ? { ...transaction, ...editData } : transaction
        )
      );
      onOpenChange(false); // Close the modal
    } catch (error) {
      console.error('Error editing transaction:', error);
      alert('An error occurred while saving the transaction. Please try again.');
    }
  };

  // Function to update the property status based on the property type
  const updatePropertyStatus = async (propertyId) => {
    try {
      // Fetch property details to determine the type
      const response = await fetch(`https://localhost:5010/api/property/${propertyId}`);
      if (!response.ok) throw new Error('Failed to fetch property details');

      const propertyData = await response.json();
      console.log('Fetched property data:', propertyData); // Log property data for debugging

      // Determine new status based on property type
      const newStatus = propertyData.PropertyStatus === 'Sale' ? 'Sold' : 'Rented'; // Assuming 'type' is either 'Sale' or 'Rent'
      console.log('New property status:', newStatus); // Log new status for debugging

      // Create FormData object to send the new status
      const formData = new FormData();
      formData.append('status', newStatus); // Append status to FormData

      // Update the property status
      const patchResponse = await fetch(`https://localhost:5010/api/Property/${propertyId}`, {
        method: 'PATCH',
        body: formData, // Send the FormData
      });

      if (!patchResponse.ok) {
        const errorResponse = await patchResponse.json();
        throw new Error(`Failed to update property status: ${errorResponse.message}`);
      }

      alert('Property status updated successfully.');
    } catch (error) {
      console.error('Error updating property status:', error);
    }
  };

  // Delete transaction
  const handleDeleteClick = async (transactionId) => {
    try {
      const response = await fetch(`https://localhost:5010/api/transactions/${transactionId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete the transaction');
      setTransactions(transactions.filter((transaction) => transaction.transactionId !== transactionId));
      alert('Transaction deleted successfully.');
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  // Handle input changes in the edit form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: name === 'status' ? parseInt(value) : value }));
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: '12px' }}>
        <Table>
          <TableHead>
            <StyledTableRow>
              <StyledTableCell align="center">Transaction ID</StyledTableCell>
              <StyledTableCell align="center">Property ID</StyledTableCell>
              <StyledTableCell align="center">Buyer ID</StyledTableCell>
              <StyledTableCell align="center">Broker ID</StyledTableCell>
              <StyledTableCell align="center">Transaction Date</StyledTableCell>
              <StyledTableCell align="center">Amount</StyledTableCell>
              <StyledTableCell align="center">Status</StyledTableCell>
              <StyledTableCell align="center">Actions</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {transactions.length > 0 ? (
              transactions.map((transaction) => (
                <StyledTableRow key={transaction.transactionId}>
                  <TableCell align="center">{transaction.transactionId}</TableCell>
                  <TableCell align="center">{transaction.propertyId}</TableCell>
                  <TableCell align="center">{transaction.buyerId}</TableCell>
                  <TableCell align="center">{transaction.brokerId}</TableCell>
                  <TableCell align="center">{transaction.transactionDate.split('T')[0]}</TableCell>
                  <TableCell align="center">{transaction.amount}</TableCell>
                  <TableCell align="center">{statusMapping[transaction.status] || 'Unknown'}</TableCell> {/* Displaying status */}
                  <TableCell align="center">
                    <Button variant="contained" color="primary" onClick={() => handleEditClick(transaction.transactionId)}>
                      Edit
                    </Button>
                    <Button variant="contained" color="secondary" onClick={() => handleDeleteClick(transaction.transactionId)} style={{ marginLeft: '5px' }}>
                      Delete
                    </Button>
                  </TableCell>
                </StyledTableRow>
              ))
            ) : (
              <StyledTableRow>
                <TableCell colSpan={8} align="center">
                  No transactions available
                </TableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Transaction Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Edit Transaction</ModalHeader>
              <ModalBody>
                <input
                  type="number"
                  name="propertyId"
                  placeholder="Property ID"
                  value={editData.propertyId || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border"
                />
                <input
                  type="number"
                  name="buyerId"
                  placeholder="Buyer ID"
                  value={editData.buyerId || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border"
                />
                <input
                  type="number"
                  name="brokerId"
                  placeholder="Broker ID"
                  value={editData.brokerId || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border"
                />
                <input
                  type="date"
                  name="transactionDate"
                  placeholder="Transaction Date"
                  value={editData.transactionDate || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border"
                />
                <input
                  type="number"
                  name="amount"
                  placeholder="Amount"
                  value={editData.amount || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border"
                />
                <select name="status" value={editData.status} onChange={handleInputChange} className="w-full p-2 border">
                  <option value={0}>Pending</option>
                  <option value={1}>Completed</option>
                  <option value={2}>Cancelled</option>
                </select>
              </ModalBody>
              <ModalFooter>
                <Button onClick={handleSaveEdit}>Save</Button>
                <Button onClick={onClose}>Cancel</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default TransactionTable;
