import React, { useState, useEffect } from 'react';
import axios from 'axios';

function MainPage() {
  const [features, setFeatures] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedMagTypes, setSelectedMagTypes] = useState([]); 
  const [perPage, setPerPage] = useState(10);
  const [comment, setComment] = useState(''); 
  const [comments, setComments] = useState({}); // Store comments for each feature
  const [selectedFeatureId, setSelectedFeatureId] = useState(null); 


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
    'Title',
    'Magnitude',
    'Place',
    'Time',
    'External ID',
    'Tsunami Warning',
    'Magnitude Type',
    'Coordinates',
    'URL',
    'Comments'
  ];

  const handleCommentSubmit = async (featureId) => {
    try {
      // Check if the comment is empty
      if (!comment.trim()) {
        alert("Please enter a non-empty comment.");
        return;
      }
    
      // Check if the comment contains a semicolon
      if (comment.includes(';')) {
        alert("Please avoid using semicolons in your comment.");
        return;
      }
      // Send a POST request to add a comment
      await axios.post('http://localhost:3000/eq_features/add_comment', {
        feature_id: featureId,
        body: comment,
      });
      
      // Add the comment to the comments state
      setComments({
        ...comments,
        [featureId]: [...(comments[featureId] || []), comment],
      });

      // Clear the comment input
      setComment('');
      fetchFeatures();
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  const toggleExpand = (featureId) => {
    if (expandedFeatureId === featureId) {
      setExpandedFeatureId(null);
    } else {
      setExpandedFeatureId(featureId);
    }
  };

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
              <React.Fragment key={feature.id}>
              <tr >
                <td>
                  <div style={{ borderRight: '1px solid #ddd', padding: '5px' }}>
                    {feature.attributes.title}
                  </div>
                </td>
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
                <td>
                  <div style={{ borderRight: '1px solid #ddd', padding: '5px' }}>
                    Lon: {feature.attributes.coordinates.longitude}, Lat: {feature.attributes.coordinates.latitude}
                  </div>
                </td>
                <td>
                  <div style={{ borderRight: '1px solid #ddd', padding: '5px' }}>
                  <a href={feature.links.external_url} target="_blank" rel="noopener noreferrer">
                  Link
                  </a>
                  </div>
                </td>
                <td>
                  <button onClick={() => setSelectedFeatureId(feature.id)}>Expand</button>
                </td>
              </tr>
              {selectedFeatureId === feature.id && (
                <tr>
                  <td colSpan="10">
                    {feature.comments ? (
                      <ul>
                        {feature.comments.split(';').map((comment, index) => (
                          <li key={index}>{comment}</li>
                        ))}
                      </ul>
                    ) : (
                      <p>No comments</p>
                    )}
                    <input
                      type="text"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                    <button onClick={() => handleCommentSubmit(feature.id)}>Submit</button>
                  </td>
                </tr>
              )}
            </React.Fragment>
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