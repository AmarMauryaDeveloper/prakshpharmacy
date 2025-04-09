import React from 'react';
import { Link } from 'react-router-dom';

const Cart = ({ cart, setCart }) => {
  const removeFromCart = (id) => {
    const updatedCart = cart.filter((product) => product.id !== id);
    setCart(updatedCart);
  };

  const clearCart = () => {
    setCart([]);
  };

  const calculateTotal = () => {
    const subtotal = cart.reduce((acc, product) => acc + (parseFloat(product.price) || 0), 0);
    const tax = subtotal * 0.10;
    const deliveryCharge = 5; 

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
    <div className="container px-4 mx-auto my-5 sm:px-6 lg:px-8">
      {cart.length === 0 ? (
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-semibold text-gray-800">Your Cart is Empty</h1>
          <Link to="/" className="px-6 py-2 text-white rounded-lg btn bg-greenbutten">
            Continue Shopping...
          </Link>
        </div>
      ) : (
        <div>
          <ul className="space-y-4">
            {cart.map((product) => (
              <li key={product.id} className="flex items-center p-4 bg-white rounded-lg shadow-md">
                <img
                  src={product.imgSrc}
                  alt={product.title}
                  className="object-cover w-20 h-20 mr-4 rounded-lg"
                />
                <div className="flex-1">
                  <h5 className="text-lg font-semibold text-gray-900">{product.title}</h5>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-semibold text-gray-700">{product.price} ₹</span>
                    <button
                      onClick={() => removeFromCart(product.id)} // Remove from cart
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {cart.length !== 0 && (
        <div className="mt-6">
          <div className="flex flex-col justify-between mb-6 sm:flex-row">
            <div className="flex flex-col text-left">
              <h5 className="text-lg font-semibold text-gray-700">Order Summary</h5>
              <div className="mt-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{subtotal} ₹</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (10%):</span>
                  <span>{tax.toFixed(2)} ₹</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charge:</span>
                  <span>{deliveryCharge} ₹</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col text-right">
              <h5 className="text-lg font-semibold text-gray-700">Total</h5>
              <div className="flex justify-between">
                <span>Total Amount:</span>
                <span className="text-xl font-bold text-green-500">{total.toFixed(2)} ₹</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link to="/checkout" state={{ cart }} className="w-full sm:w-auto">
              <button className="w-full px-6 py-3 rounded-lg shadow-lg sm:w-auto btn btn-warning">
                Proceed to Checkout
              </button>
            </Link>
            <button
              onClick={clearCart}
              className="w-full px-6 py-3 rounded-lg shadow-lg sm:w-auto btn btn-danger"
            >
              Clear Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
