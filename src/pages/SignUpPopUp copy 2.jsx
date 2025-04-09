import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useFormik } from "formik";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import CustomInput from "../components/ReusableComponent/CustomInput";
import CustomButton from "../components/ReusableComponent/CustomButton";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { auth, db } from "../firebase"; // Import Firestore and Firebase Auth
import { doc, setDoc, serverTimestamp } from "firebase/firestore"; // For writing user data to Firestore

// Validation Schema using Yup
const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required')
});

const SignModal = ({ closeModal, switchToSignUp }) => {
  const navigate = useNavigate();
  const modalRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [verificationStatus, setVerificationStatus] = useState(""); // Track verification status

  // Function to wait for email verification and handle Firestore updates
  const waitForEmailVerification = async (user) => {
    try {
      const interval = setInterval(async () => {
        await user.reload(); // Reload user to check email verification status
        if (user.emailVerified) {
          clearInterval(interval); // Stop polling once verified
          setVerificationStatus("Email successfully verified!");
          
          // Add user data to Firestore with the user's UID
          const userRef = doc(db, "users", user.uid);
          await setDoc(userRef, {
            email: user.email,
            createdAt: serverTimestamp(), // Save creation time
            uid: user.uid, // Store UID to track the user in Firestore
          });

          setSuccessMessage("User added to Firestore!");
          navigate("/");  // Redirect user after successful email verification
        } else {
          setVerificationStatus("Your email is not verified yet. Please check your inbox!");
        }
      }, 5000); // Poll every 5 seconds
    } catch (error) {
      console.error("Error checking email verification:", error);
      setVerificationStatus("Error verifying your email. Please try again.");
    }
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setErrorMessage("");
      setSuccessMessage("");
      setVerificationStatus(""); // Reset verification status when form is submitted
      setLoading(true);

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
        const user = userCredential.user;

        if (user) {
          await sendEmailVerification(user);
          setSuccessMessage("Verification email sent! Please check your inbox.");

          const userRef = doc(db, "users", user.uid);
          await setDoc(userRef, {
            uid: user.uid,      
            email: user.email,   
            createdAt: serverTimestamp(), 
          });

          setSuccessMessage("User added to Firestore!");

          // Wait for email verification before proceeding
          waitForEmailVerification(user);
        } else {
          setErrorMessage("Failed to get a valid user object.");
        }
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setLoading(false);
      }
    },
  });

  // Close modal if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        closeModal();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closeModal]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-600 bg-opacity-50">
      <motion.div
        ref={modalRef}
        className="relative p-6 bg-white rounded-lg shadow-md w-96"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.3 }}
      >
        <button
          onClick={closeModal}
          className="absolute text-gray-500 top-2 right-2 hover:text-gray-800"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <h2 className="mb-4 text-xl font-bold">SignUp</h2>

        <form onSubmit={formik.handleSubmit}>
          <div className="mb-4">
            <CustomInput
              placeholder="Enter your email"
              value={formik.values.email}
              onChange={formik.handleChange("email")}
              onBlur={formik.handleBlur("email")}
              error={formik.touched.email && formik.errors.email}
            />
            <CustomInput
              placeholder="Enter your password"
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange("password")}
              onBlur={formik.handleBlur("password")}
              error={formik.touched.password && formik.errors.password}
            />
          </div>

          <CustomButton
            type="submit"
            btntitle={loading ? "Signing Up..." : "Sign Up"}
            disabled={loading}
          />

          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          {successMessage && <p className="text-green-500">{successMessage}</p>}
          {verificationStatus && <p className="text-yellow-500">{verificationStatus}</p>}
        </form>
      </motion.div>
    </div>
  );
};

export default SignModal;
