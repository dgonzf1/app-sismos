import React, { useState, useEffect } from 'react';
import axios from 'axios';

function MainPage() {
  const [features, setFeatures] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedMagTypes, setSelectedMagTypes] = useState([]); // State for selected mag_types
  const [perPage, setPerPage] = useState(10); // State for per_page limit

  const magTypeOptions = ['md', 'ml', 'ms', 'mw', 'me', 'mi', 'mb', 'mlg']; // Constant mag_types

  const handleFilterChange = (selectedTypes) => {
    setSelectedMagTypes(selectedTypes);
  };

  const handlePerPageChange = (event) => {
    const perPageValue = parseInt(event.target.value);
    if (perPageValue <= 1000 && perPageValue > 4) {
      setPerPage(perPageValue);
    } else {
      alert("The number of elements per page cannot exceed 1000.");
      setPerPage(100);
    }
  };

  const handleMagTypeChange = (event, magType) => {
    const isChecked = event.target.checked;
    if (isChecked) {
      setSelectedMagTypes([...selectedMagTypes, magType]);
    } else {
      setSelectedMagTypes(selectedMagTypes.filter((type) => type !== magType));
    }
  };

  const handlePageChange = (newPage) => {
    // Ensure the new page is within bounds
    const safeNewPage = Math.min(Math.max(newPage, 1), totalPages);
  
    // Update the current page state
    setCurrentPage(safeNewPage);
  
    // Fetch data only if the new page is different from the current page
    if (safeNewPage !== currentPage) {
      fetchFeatures(safeNewPage); 
    }
  };

  const fetchFeatures = async () => {
    const magTypeQueryParam = selectedMagTypes.length > 0 ? `&mag_types=${selectedMagTypes.join(',')}` : '';
    const url = `http://localhost:3000/eq_features?page=${currentPage}&per_page=${perPage}${magTypeQueryParam}`;

    
    try {
      const response = await axios.get(url);
      setFeatures(response.data.data.map((feature) => ({
        ...feature,
        attributes: {
          ...feature.attributes,
          humanReadableTime: new Date(feature.attributes.time).toLocaleString(),
        },
      })));
      
    const totalElements = response.data.pagination.total;
    const totalPages = Math.ceil(totalElements / perPage);
    console.log(totalPages)

    setTotalPages(totalPages);

    // Ensure currentPage doesn't exceed the total number of pages
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
    } catch (error) {
      console.error('Error fetching features:', error);
    }
  };

  useEffect(() => {
  }, [currentPage, selectedMagTypes, perPage]); 

  const featureDetails = [
    'Magnitude',
    'Place',
    'Time',
    'External ID',
    'Tsunami Warning',
    'Magnitude Type',
  ];

  return (
    <div>
      <h1>Earthquake Features</h1>
      <div>
        <label htmlFor="page">Page:</label>
        <input
          type="number"
          id="page"
          min="1"
          value={currentPage}
          onChange={(e) => setCurrentPage(parseInt(e.target.value))}
        />
        <label htmlFor="per-page">Elements per Page:</label>
        <input type="number" id="per-page" min="1" value={perPage} onChange={handlePerPageChange} />
      </div>
      <div>
      <span>Magnitude Types:</span>
      {magTypeOptions.map((magType) => (
        <label key={magType}>
          <input
            type="checkbox"
            value={magType}
            checked={selectedMagTypes.includes(magType)}
            onChange={(e) => handleMagTypeChange(e, magType)}
          />
          {magType}
        </label>
      ))}
    </div>
      <button onClick={() => fetchFeatures()}>Load Data</button>
      <table>
        <thead>
          <tr>
            {featureDetails.map((detail) => (
              <th key={detail}>
                <div>{detail}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {features.length > 0 ? (
            features.map((feature) => (
              <tr key={feature.id}>
                <td>
                  <div style={{ borderRight: '1px solid #ddd', padding: '5px' }}>
                    {feature.attributes.magnitude}
                  </div>
                </td>
                <td>
                  <div style={{ borderRight: '1px solid #ddd', padding: '5px' }}>
                    {feature.attributes.place}
                  </div>
                </td>
                <td>
                  <div style={{ borderRight: '1px solid #ddd', padding: '5px' }}>
                    {feature.attributes.humanReadableTime}
                  </div>
                </td>
                <td>
                  <div style={{ borderRight: '1px solid #ddd', padding: '5px' }}>
                    {feature.attributes.external_id}
                  </div>
                </td>
                <td>
                  <div style={{ borderRight: '1px solid #ddd', padding: '5px' }}>
                    {feature.attributes.tsunami  ? 'Yes' : 'No'}
                  </div>
                </td>
                <td>
                  <div style={{ borderRight: '1px solid #ddd', padding: '5px' }}>
                    {feature.attributes.mag_type}
                  </div>
                </td>
                
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={featureDetails.length}>No features found.</td>
            </tr>
          )}
        </tbody>
      </table>

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