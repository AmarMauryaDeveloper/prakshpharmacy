import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { auth, db, doc, getDoc, updateDoc, arrayUnion, collection, addDoc } from "../firebase"; // Firebase imports

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [newAddress, setNewAddress] = useState({
    name: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    phone: "",
  });
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [isAddingNewAddressForm, setIsAddingNewAddressForm] = useState(false); // State for toggling address form
  const [cart, setCart] = useState(location.state?.cart || []); 

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      navigate("/login");
    } else {
      setUser(currentUser);
      fetchUserAddresses(currentUser.uid);
    }
  }, [navigate]);

  const fetchUserAddresses = async (uid) => {
    try {
      const userRef = doc(db, "users", uid);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const userAddresses = userDoc.data().addresses || [];
        setAddresses(userAddresses);
        const userSelectedAddress = userDoc.data().selectedAddress;
        if (userSelectedAddress) {
          setSelectedAddress(userSelectedAddress);
        }
      }
    } catch (error) {
      console.error("Error fetching user addresses:", error);
    }
  };

  const handleAddressInputChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prevAddress) => ({ ...prevAddress, [name]: value }));
  };

  const handleAddNewAddress = async () => {
    if (
      !newAddress.name ||
      !newAddress.street ||
      !newAddress.city ||
      !newAddress.state ||
      !newAddress.postalCode ||
      !newAddress.phone
    ) {
      alert("Please fill out all fields");
      return;
    }

    const userRef = doc(db, "users", user.uid);
    const newAddressWithSelected = { ...newAddress, isSelected: false };

    try {
      // Update the user document in Firestore with the new address
      await updateDoc(userRef, {
        addresses: arrayUnion(newAddressWithSelected),
      });

      setAddresses((prevAddresses) => [...prevAddresses, newAddressWithSelected]);
      setIsAddingNewAddressForm(false); // Close the form after adding the address
    } catch (error) {
      console.error("Error adding address:", error);
    }
  };

  const handleSelectAddress = (address) => {
    setSelectedAddress(address);
    const updatedAddresses = addresses.map((addr) =>
      addr === address
        ? { ...addr, isSelected: true }
        : { ...addr, isSelected: false }
    );
    setAddresses(updatedAddresses);

    // Update the user document in Firestore to set the selected address
    const userRef = doc(db, "users", user.uid);
    updateDoc(userRef, {
      selectedAddress: address,
      addresses: updatedAddresses, // Make sure the updated list is saved
    });
  };

  const handleCreateOrder = async () => {
    if (!selectedAddress) {
      alert("Please select an address to proceed");
      return;
    }

    const orderData = {
      userId: user.uid,
      cart,
      selectedAddress,
      totalAmount: total.toFixed(2),
      status: "Live",
      createdAt: new Date(),
    };

    try {
      const ordersRef = collection(db, "orders");
      await addDoc(ordersRef, orderData);
      navigate("/");  // Navigate to homepage after order creation
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

  const calculateTotal = () => {
    const subtotal = cart.reduce(
      (acc, product) => acc + (parseFloat(product.price) || 0),
      0
    );
    const tax = subtotal * 0.1; // 10% tax
    const deliveryCharge = 5; // Flat delivery charge
    const total = subtotal + tax + deliveryCharge;

    return {
      subtotal: isNaN(subtotal) ? 0 : subtotal,
      tax: isNaN(tax) ? 0 : tax,
      deliveryCharge: isNaN(deliveryCharge) ? 0 : deliveryCharge,
      total: isNaN(total) ? 0 : total,
    };
  };

  const { subtotal, tax, deliveryCharge, total } = calculateTotal();

  return (
    <div className="container px-4 py-8 mx-auto">
      <h2 className="mb-5 text-2xl font-semibold text-gray-800">Checkout</h2>
      {!user ? (
        <div>Please log in to proceed to checkout</div>
      ) : (
        <div>
          <div className="mb-5">
            <h4 className="mb-4 text-xl font-semibold">Your Selected Address</h4>
            {selectedAddress ? (
              <div className="p-4 mb-4 bg-gray-100 rounded-md shadow-md">
                <p className="text-lg font-semibold">{selectedAddress.name}</p>
                <p>{selectedAddress.street}</p>
                <p>
                  {selectedAddress.city}, {selectedAddress.state}{" "}
                  {selectedAddress.postalCode}
                </p>
                <p>{selectedAddress.phone}</p>
                <button
                  onClick={() => setIsAddingAddress(true)}
                  className="px-4 py-2 mt-2 text-white bg-blue-500 rounded-md"
                >
                  Change Address
                </button>
              </div>
            ) : (
              <div>
                <p>No address selected. Please choose one or add a new address.</p>
                {/* Display 'Add Address' button if no address is selected */}
                <button
                  onClick={() => setIsAddingAddress(true)}
                  className="px-6 py-2 mt-4 text-white bg-green-500 rounded-md"
                >
                  Add Address
                </button>
              </div>
            )}
          </div>

          {/* Show Cart Items */}
          <div className="mb-5">
            <h4 className="mb-4 text-xl font-semibold">Your Cart</h4>
            {cart.length > 0 ? (
              <div className="mb-4">
                {cart.map((product) => (
                  <div
                    key={product.id}
                    className="flex flex-col justify-between pb-4 mb-4 border-b sm:flex-row"
                  >
                    <div className="flex flex-col sm:flex-row">
                      <img
                        src={product.imgSrc || "/path/to/fallback-image.jpg"}
                        alt={product.title}
                        className="object-cover w-20 h-20 mb-2 sm:mb-0 sm:mr-4"
                      />
                      <div>
                        <p className="font-semibold">{product.title}</p>
                        <p>{product.description}</p>
                      </div>
                    </div>
                    <span className="text-lg font-semibold">{product.price} ₹</span>
                  </div>
                ))}
                <div className="flex justify-between text-lg font-semibold">
                  <span>Subtotal:</span>
                  <span>{subtotal} ₹</span>
                </div>
                <div className="flex justify-between text-lg font-semibold">
                  <span>Tax (10%):</span>
                  <span>{tax.toFixed(2)} ₹</span>
                </div>
                <div className="flex justify-between text-lg font-semibold">
                  <span>Delivery Charge:</span>
                  <span>{deliveryCharge} ₹</span>
                </div>
                <div className="flex justify-between pt-4 text-lg font-semibold border-t">
                  <span>Total:</span>
                  <span>{total.toFixed(2)} ₹</span>
                </div>
              </div>
            ) : (
              <p>Your cart is empty.</p>
            )}
          </div>

          {/* Address Form Modal */}
          {isAddingAddress && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-50">
              <div className="w-full max-w-md p-6 bg-white rounded-md shadow-md">
                <h4 className="mb-4 text-lg font-semibold">Add or Select Address</h4>
                {isAddingNewAddressForm ? (
                  <div className="mb-4">
                    <h5 className="text-lg font-semibold">New Address</h5>
                    <form onSubmit={(e) => e.preventDefault()}>
                      <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={newAddress.name}
                        onChange={handleAddressInputChange}
                        className="w-full p-2 mb-3 border"
                      />
                      <input
                        type="text"
                        name="street"
                        placeholder="Street Address"
                        value={newAddress.street}
                        onChange={handleAddressInputChange}
                        className="w-full p-2 mb-3 border"
                      />
                      <input
                        type="text"
                        name="city"
                        placeholder="City"
                        value={newAddress.city}
                        onChange={handleAddressInputChange}
                        className="w-full p-2 mb-3 border"
                      />
                      <input
                        type="text"
                        name="state"
                        placeholder="State"
                        value={newAddress.state}
                        onChange={handleAddressInputChange}
                        className="w-full p-2 mb-3 border"
                      />
                      <input
                        type="text"
                        name="postalCode"
                        placeholder="Postal Code"
                        value={newAddress.postalCode}
                        onChange={handleAddressInputChange}
                        className="w-full p-2 mb-3 border"
                      />
                      <input
                        type="text"
                        name="phone"
                        placeholder="Phone Number"
                        value={newAddress.phone}
                        onChange={handleAddressInputChange}
                        className="w-full p-2 mb-3 border"
                      />
                      <button
                        onClick={handleAddNewAddress}
                        className="w-full px-6 py-2 text-white bg-green-500 rounded-md"
                      >
                        Save Address
                      </button>
                    </form>
                    <button
                      onClick={() => setIsAddingNewAddressForm(false)}
                      className="w-full px-6 py-2 mt-3 text-white bg-gray-500 rounded-md"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="mb-4">
                    <h5 className="text-lg font-semibold">Your Addresses</h5>
                    {addresses.length > 0 ? (
                      <ul>
                        {addresses.map((address, index) => (
                          <li
                            key={index}
                            className="p-2 mb-2 bg-gray-100 rounded-md cursor-pointer hover:bg-gray-200"
                            onClick={() => handleSelectAddress(address)}
                          >
                            <p className="font-semibold">{address.name}</p>
                            <p>{address.street}</p>
                            <p>{address.city}, {address.state}</p>
                            {address.isSelected && (
                              <span className="text-sm text-green-500">Selected</span>
                            )}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No addresses available.</p>
                    )}
                    <button
                      onClick={() => setIsAddingNewAddressForm(true)} 
                      className="w-full px-6 py-2 mt-4 text-white bg-blue-500 rounded-md"
                    >
                      Add a New Address
                    </button>
                    <button
                      onClick={() => setIsAddingAddress(false)}
                      className="w-full px-6 py-2 mt-4 text-white bg-gray-500 rounded-md"
                    >
                      Close
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Checkout Button */}
          <button
            onClick={handleCreateOrder}
            className="px-6 py-2 mt-5 text-white bg-yellow-500 rounded-md"
          >
            Place Order
          </button>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
