import React from "react";
import { IoLogoFacebook, IoLogoInstagram, IoLogoTwitter } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <footer>
      <div className="bg-black text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Menu Section */}
            <div>
              <h3 className="  justify-center flex text-lg font-semibold uppercase text-gray-200 mb-4">
                Menu
              </h3>
              <ul className="text-white font-medium">
                {[
                  { name: "About", sectionId: "about" },
                  { name: "Contact", sectionId: "contact" },
                  { name: "Services", sectionId: "services" },
                  { name: "Privacy Policy", sectionId: "privacypolicy" },
                ].map((link) => (
                  <li className="mb-2" key={link.name}>
                    <a
                      href={`#${link.sectionId}`} // Updated to reference sectionId with a hash
                      className="justify-center flex hover:underline cursor-pointer text-sm md:text-base"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social Media Section */}
            <div className="">
              <h3 className="flex items-center justify-center  text-lg font-semibold uppercase text-gray-200 mb-4">
                Follow Us
              </h3>
              <div className="flex justify-center space-x-4">
                <div>
                  <a
                    href="https://www.facebook.com/your-channel"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-yellow-500"
                  >
                    <IoLogoFacebook size={24} />
                    <span className="sr-only">Facebook</span>
                  </a>
                </div>
                <div>
                  <a
                    href="https://www.instagram.com/your-channel"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-yellow-500"
                  >
                    <IoLogoInstagram size={24} />
                    <span className="sr-only">Instagram</span>
                  </a>
                </div>
                <div>
                  <a
                    href="https://www.twitter.com/your-channel"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-yellow-500"
                  >
                    <IoLogoTwitter size={24} />
                    <span className="sr-only">Twitter</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Us Section */}
            <div className="">
              <h3 className="flex justify-center text-lg font-semibold uppercase text-gray-200 md:mb-4">
                Contact Us
              </h3>
              <ul className=" my-4 space-y-2 text-sm md:text-base">
                <div className="flex justify-center">
                  <li
                    className="cursor-pointer"
                    onClick={() => window.open("tel:(+91)9919497477", "_self")}
                  >
                    <span>📞 (+91) 9919497477</span>
                  </li>
                </div>
                <div className="flex justify-center">
                  <li
                    className="cursor-pointer"
                    onClick={() =>
                      window.open("mailto:info@autocar.com", "_self")
                    }
                  >
                    <span>✉️carwting123@gmail.com</span>
                  </li>
                </div>
                <div className="flex justify-center">
                  <li
                    className="cursor-pointer"
                    onClick={() =>
                      window.open(
                        "https://www.google.com/maps/place/880+N+Santa+Monica+St,+Los+Angeles,+CA,+90012",
                        "_blank"
                      )
                    }
                  >
                    <span>
                      📍 880 N Santa Monica St, Los Angeles, CA, 90012
                    </span>
                  </li>
                </div>
              </ul>
            </div>
          </div>
        </div>
        <div className="text-center mt-8 text-gray-500 text-xs sm:text-sm">
          © 2024 Your Company Name. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
