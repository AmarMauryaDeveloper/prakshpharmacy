import React, { useEffect, useState } from 'react';

const Admincontacts = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMore, setShowMore] = useState({}); // Store showMore state for each row

  useEffect(() => {
    const fetchContacts = () => {
      const mockContacts = [
        {
          id: 1,
          name: 'John Doe',
          phoneNumber: '123-456-7890',
          email: 'johndoe@example.com',
          message: 'Hello, I am interested in your services. Could you please provide more details about the packages and pricing?',
        },
        {
          id: 2,
          name: 'Jane Smith',
          phoneNumber: '987-654-3210',
          email: 'janesmith@example.com',
          message: 'I would like to know more about the refund policy. Could you get back to me at your earliest convenience?',
        },
        // Add more mock contacts if necessary
      ];

      setRows(mockContacts);
      setLoading(false);
    };

    fetchContacts();
  }, []);

  const toggleShowMore = (id) => {
    setShowMore(prev => ({ ...prev, [id]: !prev[id] })); // Toggle the showMore state for the specific row
  };

  return (
    <div className="container p-4 mx-auto">
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <table className="min-w-full overflow-hidden bg-white border border-gray-200 rounded-lg shadow-md">
          <thead>
            <tr className="text-white bg-gray-800">
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Phone Number</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Message</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(row => {
              const message = row.message; // Assuming 'message' is the field name

              return (
                <tr key={row.id} className="hover:bg-gray-100">
                  <td className="px-4 py-2 border-b border-gray-200">{row.name}</td>
                  <td className="px-4 py-2 border-b border-gray-200">{row.phoneNumber}</td>
                  <td className="px-4 py-2 border-b border-gray-200">{row.email}</td>
                  <td className="px-4 py-2 border-b border-gray-200">
                    {showMore[row.id] ? message : `${message.substring(0, 50)}...`}
                    {message.length > 50 && (
                      <button
                        onClick={() => toggleShowMore(row.id)}
                        className="ml-2 text-blue-500 hover:underline"
                      >
                        {showMore[row.id] ? "Show Less" : "Show More"}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Admincontacts;
