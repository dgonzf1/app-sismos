import React, { useState, useEffect } from 'react';
import axios from 'axios';

function MainPage() {
  const [features, setFeatures] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`http://localhost:3000/eq_features`);
      setFeatures(response.data.data);
      setTotalPages(response.data.pagination.total);
    };

    fetchData();
  }, [currentPage]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <h1>Earthquake Features</h1>
      {features.length > 0 ? (
        <ul>
          {features.map((feature) => (
            <li key={feature.id}>
              <p>Magnitude: {feature.attributes.magnitude}</p>
              <p>Place: {feature.attributes.place}</p>
              <p>Time: {feature.attributes.time}</p>
              <p>External ID: {feature.attributes.external_id}</p>
              <p>Tsunami Warning: {feature.attributes.tsunami ? 'Yes' : 'No'}</p>
              <p>Magnitude Type: {feature.attributes.mag_type}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No features found.</p>
      )}

      {totalPages > 1 && (
        <div>
          <button disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>
            Previous Page
          </button>
          <button disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)}>
            Next Page
          </button>
        </div>
      )}
    </div>
  );
}

export default MainPage;