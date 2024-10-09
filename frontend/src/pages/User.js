import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/User.css"; // Make sure this contains the masonry grid CSS

export default function User() {
    const [userId, setUserId] = useState(null);  // Store the user's ID
    const [userEmail, setUserEmail] = useState("");  // Store the user's email
    const [savedImages, setSavedImages] = useState(new Set()); // For saved images
    const [GeneratedImages, setGeneratedImages] = useState(new Set()); // For generated images
    const navigate = useNavigate();  // Navigating between routes
    const [previousSearchQueries, setPreviousSearchQueries] = useState([]); // Store previous search queries
    const baseUrl = 'http://127.0.0.1:5000'; // Define the base URL for the backend API requests
    const [visibleImages] = useState(999); // To control how many images are visible initially

    useEffect(() => {
        const id = localStorage.getItem('userId');
        setUserId(id); // Fetch id
        fetchPreviousSearchQueries(id); // Fetch previous search queries on load
    }, []); 

    useEffect(() => {
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
                    const savedImageSet = await new Set(savedImageArray.map(image => image.sd_image_path));
                    setSavedImages(savedImageSet); // Store saved images in state
                } else {
                    console.error('Failed to fetch saved images');
                }
            } catch (error) {
                console.error(error);
            }
        };

        const fetchGeneratedImages = async (id) => {
            try {
                const response = await fetch(`${baseUrl}/backend/generate_image/get/user`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ user_id: id }),
                });
                if (response.ok) {
                    const generatedImageArray = await response.json();
                    const generatedImageSet = await new Set(generatedImageArray.map(image => image.g_image_path));
                    setGeneratedImages(generatedImageSet); // Store saved images in state
                } else {
                    console.error('Failed to fetch generated images');
                }
            } catch (error) {
                console.error(error);
            }
        };
        
        const fetchUserData = async () => {
            const email = localStorage.getItem('userEmail');
            if (!email) {
                console.error('No email found in localStorage');
                return;
            }

            const idResponse = await fetch(`${baseUrl}/backend/users/get_id`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            if (idResponse.ok) {
                const idData = await idResponse.json();
                const userId = idData.user_id;

                // Fetch saved and generated images once user ID is obtained
                fetchSavedImages(userId); // Fetch saved images
                fetchGeneratedImages(userId); // Fetch generated images

                const userResponse = await fetch(`${baseUrl}/backend/users/get`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ user_id: userId }),
                });

                if (userResponse.ok) {
                    const data = await userResponse.json();
                    setUserEmail(data.email);
                } else {
                    console.error('Failed to fetch user data:', userResponse.statusText);
                }
            } else {
                console.error('Failed to fetch user ID:', idResponse.statusText);
            }
        };

        fetchUserData();
    }, [userId]); // Runs when userId changes

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

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userId');
        navigate("/"); 
    };

    const scrollToWorks = () => {
        document.getElementById("user-works").scrollIntoView({ behavior: 'smooth' });
    };

    const getUsernameFromEmail = (email) => {
        const atIndex = email.indexOf('@');
        return atIndex !== -1 ? email.substring(0, atIndex) : email;
    };

    // Toggles the saving or unsaving of an search image
    const toggleSaveImage = async (imageUrl) => {
        const newSavedImages = new Set(savedImages);
        if (newSavedImages.has(imageUrl)) {
            await deleteSavedImage(imageUrl); // Call the delete function
            newSavedImages.delete(imageUrl); // Remove if already saved
        } else {
            newSavedImages.add(imageUrl); // Add if not saved
            console.log('Saving image with:', {
                user_id: userId, // Use the state variable here
                sd_image_path: imageUrl,
            });

            if (!userId) {
                console.error("User ID is not available. Cannot save image.");
                return; // Exit the function if userId is null
            }

            // Make the API call to save the image
            try {
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
            } catch (error) {
                console.error('Error saving image:', error);
            }
        }
        setSavedImages(newSavedImages);
    };

    // Deletes a saved generated image from the server
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
            console.error('Error deleting saved image:', error);
        }
    };

    // Toggles the saving or unsaving of an AI-generated image
    const toggleSaveGeneratedImage = async (imageUrl) => {
        const newSavedGeneratedImages = new Set(GeneratedImages);
        if (newSavedGeneratedImages.has(imageUrl)) {
            await deleteGeneratedImage(imageUrl); // Call the delete function
            newSavedGeneratedImages.delete(imageUrl); // Remove if already saved
        } else {
            newSavedGeneratedImages.add(imageUrl); // Add if not saved
            console.log('Saving generated image with:', {
                user_id: userId, // Use the state variable here
                g_image_path: imageUrl,
            });

            if (!userId) {
                console.error("User ID is not available. Cannot save image.");
                return; // Exit the function if userId is null
            }

            // Make the API call to save the image
            try {
                const response = await fetch(`${baseUrl}/backend/generate_image/insert`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        user_id: userId,
                        g_image_path: imageUrl,
                    }),
                });

                if (!response.ok) {
                    throw new Error('Failed to save generated image');
                }
            } catch (error) {
                console.error('Error saving generated image:', error);
            }
        }
        setGeneratedImages(newSavedGeneratedImages);
    };

    // Deletes a generated image from the server
    const deleteGeneratedImage = async (imageUrl) => {
        if (!userId) {
            console.error("User ID is not available. Cannot delete image.");
            return; // Exit if userId is null
        }

        try {
            const response = await fetch(`${baseUrl}/backend/generate_image/delete`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: userId,
                    g_image_path: imageUrl,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to delete generated image');
            }
        } catch (error) {  
            console.error('Error deleting generated image:', error);
        }
    };
    
    return (
        <div className="user-home">
            <header className="user-home-header" style={{ backgroundImage: 'url("../images/user_bg.png")' }}>
                <br /><br />
                <div className="user-avatar-container">
                    <img src="../images/user_profile.jpg" alt="User Avatar" className="user-avatar" />
                </div>
                <h1>Welcome, {getUsernameFromEmail(userEmail)}</h1>
                <br /><br /><br />
                <div className="user-options">
                    <button className="button" onClick={scrollToWorks}>
                        My Works
                    </button>
                    <button className="button" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </header>
            <main className="user-home-content">
                <section className="user-works" id="user-works">
                    {/* List of saved images */}
                    <h4>Saved Images</h4>
                    <div className="image-grid">
                        {savedImages.size > 0 ? (
                            Array.from(savedImages).slice(0, visibleImages).map((url, index) => (
                                <div key={index} className="image-cell">
                                    <img className="results" src={`${url}`} alt={`Saved Img ${index + 1}`} />
                                    <img 
                                        src={savedImages.has(url) ? "../images/saved.png" : "../images/save.png"} 
                                        alt={savedImages.has(url) ? "Saved Icon" : "Save Icon"} 
                                        className="save-icon" 
                                        onClick={() => toggleSaveImage(url)} 
                                    />
                                </div>
                            ))
                        ) : (
                            <p>No saved images found.</p>
                        )}
                    </div>

                    {/* List of previous works */}
                    <h4>My Works</h4>
                    <div className="image-grid">
                        {GeneratedImages.size > 0 ? (
                            Array.from(GeneratedImages).slice(0, visibleImages).map((url, index) => (
                                <div key={index} className="image-cell">
                                    <img className="results" src={`${url}`} alt={`Generated Img ${index + 1}`} />
                                    <img 
                                        src={GeneratedImages.has(url) ? "../images/saved.png" : "../images/save.png"} 
                                        alt={GeneratedImages.has(url) ? "Saved Icon" : "Save Icon"} 
                                        className="save-icon" 
                                        onClick={() => toggleSaveGeneratedImage(url)} 
                                    />
                                </div>
                            ))
                        ) : (
                            <p>No generated images found.</p>
                        )}
                    </div>

                    {/* Previous search list */}
                    <h4>My Search History</h4>
                    <div className="previous-search-container">
                        {previousSearchQueries.length > 0 ? (
                            <ul>
                                {previousSearchQueries.map((query, index) => (
                                    <li
                                        key={index}
                                        className="previous-search-item"
                                    >
                                        {query}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No search history found.</p> 
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}