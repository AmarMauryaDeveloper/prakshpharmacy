// AddressForm.jsx
import React, { useState } from 'react';

const AddressForm = ({ addresses, setAddresses }) => {
  const [newAddress, setNewAddress] = useState("");
  const [selectedAddress, setSelectedAddress] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newAddress.trim() === "") return;

    setAddresses([...addresses, { id: Date.now(), address: newAddress }]);
    setNewAddress("");
  };

  const handleSelect = (addressId) => {
    setSelectedAddress(addressId);
  };

  return (
    <div className="container">
      <h2>Enter Your Address</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newAddress}
          onChange={(e) => setNewAddress(e.target.value)}
          placeholder="Enter Address"
        />
        <button type="submit">Add Address</button>
      </form>

      <h3>Saved Addresses</h3>
      <ul>
        {addresses.map((address) => (
          <li
            key={address.id}
            onClick={() => handleSelect(address.id)}
            style={{
              cursor: 'pointer',
              backgroundColor: selectedAddress === address.id ? '#e0e0e0' : 'transparent',
            }}
          >
            {address.address}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AddressForm;
