import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup"; // Yup for validation
import CustomInput from "../components/ReusableComponent/CustomInput";
import CustomButton from "../components/ReusableComponent/CustomButton";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const LoginModal = ({ closeModal }) => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Formik form validation schema using Yup
  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email address").required("Email is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  });

  // Formik hook for managing form state and validation
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setErrorMessage(""); 
      setSuccessMessage(""); 

      try {
        const auth = getAuth();
        const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
        const user = userCredential.user;

        if (user) {
          if (user.emailVerified) {
            setSuccessMessage("Login successful!");
           closeModal();
          } else {
            setErrorMessage("Please verify your email address before logging in.");
          }
        }
      } catch (error) {
        setErrorMessage(error.message); 
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (e.target === e.currentTarget) {
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

        <h2 className="mb-4 text-xl font-bold">Login</h2>

        <form onSubmit={formik.handleSubmit}>
          <div className="mb-4">
            <CustomInput
              type="email"
              placeholder="Enter your email"
              value={formik.values.email}
              onChange={formik.handleChange("email")}
              onBlur={formik.handleBlur("email")}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500">{formik.errors.email}</p>
            )}

            <CustomInput
              type="password"
              placeholder="Enter your password"
              value={formik.values.password}
              onChange={formik.handleChange("password")}
              onBlur={formik.handleBlur("password")}
            />
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500">{formik.errors.password}</p>
            )}
          </div>

          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          {successMessage && <p className="text-green-500">{successMessage}</p>}

          <CustomButton
            type="submit"
            btntitle={loading ? "Logging in..." : "Login"}
            disabled={loading}
          />
        </form>


      </motion.div>
    </div>
  );
};

export default LoginModal;
