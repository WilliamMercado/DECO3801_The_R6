import React, { useState, useEffect } from "react";
import "../styles/Search.css";
import "../styles/Button.css"; 

export default function Search() {
    const [userId, setUserId] = useState(null); // Store the user's ID
    const [images, setImages] = useState([]); // Stores the search result images
    const [visibleImages, setVisibleImages] = useState(9); // Controls the number of images displayed
    const [searchQuery, setSearchQuery] = useState(''); // Stores the current search input
    const [previousSearchQueries, setPreviousSearchQueries] = useState([]); // Stores past search queries
    const [filteredSearchQueries, setFilteredSearchQueries] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null); // Stores the image selected by the user
    const [loading, setLoading] = useState(false); // Show or hide a loading indicator during searches
    const [savedImages, setSavedImages] = useState(new Set()); // Stores images that have been saved/bookmarked
    const [showSearchHistory, setShowSearchHistory] = useState(1); // Controls whether the search history is visible
    const baseUrl = 'http://127.0.0.1:5000'; // Define the base URL for the backend API requests
    
    useEffect(() => {
        const id = localStorage.getItem('userId');
        setUserId(id);
    
        if (id) {
            fetchSavedImages(id);
            fetchPreviousSearchQueries(id); // Fetch previous search queries on load
        } else {
            // Clear previous search queries when user logs out
            setPreviousSearchQueries([]);
            setUserId('');
        }
    }, [userId]);
    

    // Fetch previous search queries for the user
    const fetchPreviousSearchQueries = async (id) => {
        try {
            const response = await fetch(`${baseUrl}/backend/search_text/get/user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_id: id }),
            });

            if (response.ok) {
                const queries = await response.json();
                setPreviousSearchQueries(queries.map(q => q.s_text_query)); // Map the queries to display
            } else {
                console.error('Failed to fetch search queries');
            }
        } catch (error) {
            console.error('Error fetching search queries:', error);
        }
    };

    // Handles when a previous search is clicked
    const handlePreviousSearchClick = (text) => {
        setSearchQuery(text);// Move the clicked text into the search bar
        setShowSearchHistory(false);
    };

    // Fetch saved images for the user from the backend
    const fetchSavedImages = async (id) => {
        try {
            const response = await fetch(`${baseUrl}/backend/saved_image/get/user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_id: id }),
            });
            if (response.ok) {
                const savedImageArray = await response.json();
                const savedImageSet = new Set(savedImageArray.map(image => image.sd_image_path));
                setSavedImages(savedImageSet);
            } else {
                console.error('Failed to fetch saved images');
            }
        } catch (error) {
            console.error('Error fetching saved images:', error);
        }
    };

    // Function to load more images
    const loadMore = () => {
        setVisibleImages(prevVisible => prevVisible + 9);
    };

    // Updates the search query state when the user types in the input field
    const handleInputChange = (event) => {
        setSearchQuery(event.target.value);

    };

    // Show the dropdown when the search input is focused
    const handleSearchFocus = (event) => {
        // Filter the previous search queries that match the current input
        const filteredQueries = previousSearchQueries
            .filter(query => query.toLowerCase().includes(event.target.value.toLowerCase()))
        setFilteredSearchQueries(filteredQueries);
        setShowSearchHistory(true);// Show the dropdown on focus
    };

    // Hide the dropdown when the search input loses focus
    const handleSearchBlur = () => {
        setTimeout(() => setShowSearchHistory(false), 150); // Delay to allow click on dropdown items
    };

    // Handles when a search delete button is clicked
    const handleSearchDelete = (queryToDelete) => {
        const updatedQueries = previousSearchQueries.filter(query => query !== queryToDelete);
        setPreviousSearchQueries(updatedQueries);

        // Clear the search bar if the deleted query is currently in it
        if (searchQuery === queryToDelete) {
            setSearchQuery(''); // Clear the search query if it matches the deleted one
        }

        fetch(`${baseUrl}/backend/search_text/delete`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                user_id: userId, 
                s_text_query: queryToDelete,
            }),
        });
    };

    // Handles the search submission (with text and image upload) when the form is submitted
    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true); // Set loading to true to show the loading indicator

        const formData = new FormData();
        formData.append('query', searchQuery); // Append the search query to the form data

        const fileInput = document.getElementById('file-upload');
        const hasImage = fileInput && fileInput.files.length > 0;  // Check if there is an image

        // Check if the search query is empty and no image is uploaded
        if (!searchQuery.trim() && !hasImage) {
            console.log("Search query is empty and no image uploaded. No search");
            setImages([]);
            setLoading(false); // Stop loading if both search query and image are empty
            return; // Exit the function without saving or searching
        }

        if (hasImage) {
            formData.append('image', fileInput.files[0]); 
        }

        try {
            const response = await fetch(`${baseUrl}/backend/search`, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Search results:', result);
                const resultArray = Object.values(result);
                setImages(resultArray); // Update the state with the search results
                setSelectedImage(null); // Clear the selected image

                // Save the search query only if it's not empty
                if (searchQuery.trim()) {
                    await saveSearchQuery(searchQuery);
                }
            } else {
                console.error('Search failed');
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false); // Set loading to false after search completes
            setShowSearchHistory(false); // Hide search history after submission
        }
    };

    // Save the search query to the database
    const saveSearchQuery = async () => {
        if (!userId || !searchQuery.trim()) return;

        try {
            const response = await fetch(`${baseUrl}/backend/search_text/insert`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: userId,
                    s_text_query: searchQuery,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to save search query');
            }

        } catch (error) {
            console.error('Error saving search query:', error);
        }
    };

    // Handles the image file input change (validates and shows a preview)
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
            const imageUrl = URL.createObjectURL(file);
            setSelectedImage(imageUrl); // Set the selected image for preview
            console.log("Uploaded file:", file);
        } else {
            alert('Please select a valid .png or .jpg file.');
        }
    };

    // Clears the selected image (removes the preview)
    const clearSelectedImage = () => {
        setSelectedImage(null); // Clear the image preview
        document.getElementById('file-upload').value = ''; // Clear the file input field
    };

    // Toggles the saving or unsaving of an image
    const toggleSaveImage = async (imageUrl) => {
        const newSavedImages = new Set(savedImages);

        // Optimistically update the UI state
        if (newSavedImages.has(imageUrl)) {
            newSavedImages.delete(imageUrl); // Remove if already saved
        } else {
            newSavedImages.add(imageUrl); // Add if not saved
        }
        setSavedImages(newSavedImages); // Update the state with the new saved images set

        try {
            if (newSavedImages.has(imageUrl)) {
                // Make the API call to save the image
                const response = await fetch(`${baseUrl}/backend/saved_image/insert`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        user_id: userId,
                        sd_image_path: imageUrl,
                    }),
                });

                if (!response.ok) {
                    throw new Error('Failed to save image');
                }
            } else {
                // Call the delete function if it's already saved
                await deleteSavedImage(imageUrl);
            }
        } catch (error) {
            console.error('Error updating image:', error);
        }
    };

    // Deletes a saved image from the server
    const deleteSavedImage = async (imageUrl) => {
        if (!userId) {
            console.error("User ID is not available. Cannot delete image.");
            return; // Exit if userId is null
        }

        try {
            const response = await fetch(`${baseUrl}/backend/saved_image/delete`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: userId,
                    sd_image_path: imageUrl,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to delete saved image');
            }
        } catch (error) {
            console.error('Error deleting image:', error);
        }
    };
    
    return (
        // The container for the entire search form and image results
        <div className="background-container" >
            {/* Form submission triggers the search */}
            <form id="form" onSubmit={handleSubmit}>
                <center>
                    <img src="../images/ARTY.png" alt="ARTY" className="arty-image" />
                    {/* Container for the search bar and file upload components */}
                    <div className="searchbar-container">
                        {/* Input field for text-based search */}
                        <input
                            className="searchbar"
                            type="search"
                            placeholder="Upload and Search..."
                            onChange={handleInputChange}
                            onFocus={handleSearchFocus}  // Add focus handler
                            onBlur={handleSearchBlur}
                            value={searchQuery || ''}  // Ensure searchQuery is a string
                        />
                        {/* Previous search list */}
                        {showSearchHistory && filteredSearchQueries.length > 0 && (
                            <ul className="search-history-dropdown">
                                {filteredSearchQueries.map((query, index) => (
                                    <li
                                        key={index}
                                        className="search-history-item"
                                        onClick={() => handlePreviousSearchClick(query)} // Put history into search bar when item is clicked
                                    >
                                        <span>{query}</span>
                                        <button
                                            className="search-history-delete"
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevent triggering the search when delete button is clicked
                                                handleSearchDelete(query);
                                            }}
                                        >×
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                        {/* Hidden file input for image upload */}
                        <input
                            type="file"
                            accept=".png,.jpg"
                            id="file-upload"
                            onChange={handleFileChange}
                        />
                        {/* Image icon that triggers file input on click */}
                        <img 
                            src="../images/upload.png" 
                            alt="Upload Icon" 
                            className="upload-icon"
                            onClick={() => document.getElementById('file-upload').click()}
                        />
                        {/* Search button to submit the form */}
                        <button 
                            className="search-btn" 
                            type="submit" 
                            aria-label="Search button">
                            <img src="../images/search_icon.png" alt="Search Icon" className="search-icon" />
                        </button>
                    </div>
                </center>
            </form>

            {/* Loading indicator that shows while waiting for search results */}
            {loading && (
                <div className="loading-overlay">
                    <div className="loading-container">
                        <img src="../images/loading-icon.gif" alt="Loading..." className="loading-icon" />
                    </div>
                </div>
            )}

            {/* If an image is selected (from file upload), show a preview */}
            {selectedImage && (
                <div className="image-preview-container">
                    <img src={selectedImage} alt="Selected Preview" className="image-preview" />
                    {/* Add a close button (X) to cancel the uploaded image */}
                    <button className="discard-button" onClick={clearSelectedImage}>
                        Discard
                    </button>
                </div>
            )}
            
            <br />

            <div className="masonry">
                {/* Iterate through the list of images and display each one */}
                {images.slice(0, visibleImages).map((url, index) => (
                    <div key={`container ${index}`}>
                        <img className="item" src={url} alt={`Searched result ${index}`} key={`img ${index}`} />
                        {/* Save button */}
                        <button
                            className={`like-button ${savedImages.has(url) ? 'liked' : ''}`}
                            key={`button ${index}`}
                            onClick={() => {
                                toggleSaveImage(url);
                            }}
                        >
                            <div className="like-wrapper">
                                <div className="ripple"></div>
                                <svg className="heart" style={{ width: '24', height: '24', viewBox: '0 0 24 24' }}>
                                    <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z"></path>
                                </svg>
                                <div className="particles" style={{ '--total-particles': 6 }}>
                                    <div className="particle" style={{ '--i': 1, '--color': '#7642F0' }}></div>
                                    <div className="particle" style={{ '--i': 2, '--color': '#AFD27F' }}></div>
                                    <div className="particle" style={{ '--i': 3, '--color': '#DE8F4F' }}></div>
                                    <div className="particle" style={{ '--i': 4, '--color': '#D0516B' }}></div>
                                    <div className="particle" style={{ '--i': 5, '--color': '#5686F2' }}></div>
                                    <div className="particle" style={{ '--i': 6, '--color': '#D53EF3' }}></div>
                                </div>
                            </div>
                        </button>
                    </div>
                ))}
            </div>

            {/* If there are more images to load, display the "More results" button */}
            {visibleImages < images.length && (
                <label onClick={loadMore} className="load-more">More results...</label>
            )}
            <br/>
        </div>
    );
}
