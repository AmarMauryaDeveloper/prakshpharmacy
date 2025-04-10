import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BsFillCartCheckFill } from "react-icons/bs";
import LoginModal from "../pages/LoginPopUp";
import SignUpPopUp from "../pages/SignUpPopUp";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "../firebase"; // Make sure db is imported from firebase.js
import { doc, getDoc } from "firebase/firestore";
import logo from "../assets/logo.png";
// ... imports remain unchanged
const Navbar = ({ setData, cart }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isSignUpModalOpen, setSignUpModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser && currentUser.emailVerified) {
        setUser(currentUser);
        try {
          const userRef = doc(db, "users", currentUser.uid);
          const userSnap = await getDoc(userRef);
          setIsAdmin(userSnap.exists() && userSnap.data().isAdmin === true);
        } catch (err) {
          console.error("Error checking admin status:", err);
        }
      } else {
        setUser(null);
        setIsAdmin(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/search/${searchTerm}`);
    setSearchTerm("");
    closeMenu();
  };

  const toggleLoginModal = () => {
    setLoginModalOpen(!isLoginModalOpen);
    closeMenu();
  };
  const toggleSignUpModal = () => {
    setSignUpModalOpen(!isSignUpModalOpen);
    closeMenu();
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setIsAdmin(false);
      closeMenu();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-50 shadow-md">
        <div className="relative flex items-center justify-between w-full p-4 bg-maincolor">
          <Link
            to={"/"}
            className="text-2xl font-bold text-white"
            onClick={closeMenu}
          >
            <img src={logo} alt="pp" className="h-10" />
          </Link>

          <button
            className="absolute block text-white right-3 md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          <div className="hidden space-x-4 md:flex items-center">
            <Link to={"/showblogs"} className="text-2xl font-bold text-white">
              Blog
            </Link>
            {!user ? (
              <>
                <button
                  onClick={toggleLoginModal}
                  className="px-4 py-2 bg-white rounded-md text-maincolor hover:bg-blue-600"
                >
                  Login
                </button>
                <button
                  onClick={toggleSignUpModal}
                  className="px-4 py-2 bg-white rounded-md text-maincolor hover:bg-blue-600"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <>
                <span className="font-bold text-white">{user.email}</span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-white rounded-md text-maincolor hover:bg-blue-600"
                >
                  Logout
                </button>
                <button
                  onClick={() => {
                    navigate("/myorderspage");
                    closeMenu();
                  }}
                  className="px-4 py-2 bg-white rounded-md text-maincolor hover:bg-blue-600"
                >
                  My Orders
                </button>
                {isAdmin && (
                  <button
                    onClick={() => {
                      navigate("/admin");
                      closeMenu();
                    }}
                    className="px-4 py-2 bg-white rounded-md text-maincolor hover:bg-blue-600"
                  >
                    Admin
                  </button>
                )}
              </>
            )}

            <Link to={"/cart"} className="relative ml-auto" onClick={closeMenu}>
              <button
                type="button"
                className="relative p-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
              >
                <BsFillCartCheckFill style={{ fontSize: "1.5rem" }} />
                <span className="absolute top-0 right-0 px-2 py-1 text-xs text-white bg-red-500 rounded-full translate-x-1/2 -translate-y-1/2">
                  {cart.length}
                </span>
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Menu */}
      <div
        className={`${
          isMenuOpen
            ? "translate-y-0 opacity-100"
            : "translate-y-full opacity-0 pointer-events-none"
        } transition-all duration-300 ease-in-out fixed z-10 inset-x-0 bottom-0 bg-maincolor sm:hidden`}
      >
        {" "}
        <Link
          to={"/showblogs"}
          className="text-xl font-bold flex justify-center text-white"
        >
          Blog
        </Link>
        <div className="flex flex-col items-center p-4">
          {!user ? (
            <>
              <button
                onClick={toggleLoginModal}
                className="px-4 py-2 mb-4 bg-white rounded-md text-maincolor hover:bg-blue-600"
              >
                Login
              </button>
              <button
                onClick={toggleSignUpModal}
                className="px-4 py-2 bg-white rounded-md text-maincolor hover:bg-blue-600"
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              <span className="mb-4 font-bold text-white">{user.email}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 mb-4 bg-white rounded-md text-maincolor hover:bg-blue-600"
              >
                Logout
              </button>
              <button
                onClick={() => {
                  navigate("/myorderspage");
                  closeMenu();
                }}
                className="px-4 py-2 mb-4 bg-white rounded-md text-maincolor hover:bg-blue-600"
              >
                My Orders
              </button>
              {isAdmin && (
                <button
                  onClick={() => {
                    navigate("/admin");
                    closeMenu();
                  }}
                  className="px-4 py-2 mb-4 bg-white rounded-md text-maincolor hover:bg-blue-600"
                >
                  Admin
                </button>
              )}

              <Link
                to={"/cart"}
                className="relative ml-auto mt-2"
                onClick={closeMenu}
              >
                <button
                  type="button"
                  className="relative p-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
                >
                  <BsFillCartCheckFill style={{ fontSize: "1.5rem" }} />
                  <span className="absolute top-0 right-0 px-2 py-1 text-xs text-white bg-red-500 rounded-full translate-x-1/2 -translate-y-1/2">
                    {cart.length}
                  </span>
                </button>
              </Link>
            </>
          )}
        </div>
      </div>

      {isLoginModalOpen && (
        <LoginModal
          closeModal={toggleLoginModal}
          switchToSignUp={() => {
            toggleLoginModal();
            toggleSignUpModal();
          }}
        />
      )}
      {isSignUpModalOpen && (
        <SignUpPopUp
          closeModal={toggleSignUpModal}
          switchToLogin={() => {
            toggleSignUpModal();
            toggleLoginModal();
          }}
        />
      )}
    </>
  );
};

export default Navbar;
