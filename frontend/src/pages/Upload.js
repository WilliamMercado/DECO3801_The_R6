import React, { useState, useEffect, useRef, useCallback } from "react";
import "../styles/Upload.css";
import "../styles/Button.css"; 

export default function Upload() {
    const [files, setFiles] = useState([]);  // Array of selected files
    const [showClear, setShowClear] = useState(false);  // Flag to toggle the visibility of the clear button
    const [userId, setUserId] = useState(null);  // Store the user's ID
    const [text, setText] = useState('');  // Text input state
    const [textvisible, setTextVisible] = useState(false);  // Toggle visibility of text input
    const [previews, setPreviews] = useState([]);  // Previews of the selected images
    const [aiOptions, setAiOptions] = useState([]);  // Options for AI image processing
    
    //for canvas using
    const [isDrawing, setIsDrawing] = useState(false);  // Flag to determine if the user is drawing on the canvas
    const [isPenMode, setIsPenMode] = useState(false);  //  Add a flag to toggle between pen and rectangle mode 
    const [penWidth, setPenWidth] = useState(5);  //  Add a state to control the brush thickness 
    const [originalWidth, setOriginalWidth] = useState(0);  // Width of the selected image
    const [originalHeight, setOriginalHeight] = useState(0);  // Height of the selected image
    const [selectedImage, setSelectedImage] = useState(null);  // The currently selected image for drawing
    const [showCanvas, setShowCanvas] = useState(false);  // Flag to toggle the visibility of the canvas
    const [loading, setLoading] = useState(false);  // Loading state for the submission process
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });  // Starting position for drawing rectangles
    const [rect, setRects] = useState([]);  // Array to hold the drawn rectangles
    const [currentRect, setCurrentRect] = useState(null);  // The rectangle currently being drawn
    const [penStrokes, setPenStrokes] = useState([]);  //  Array to store pen strokes 
    const [currentPenStroke, setCurrentPenStroke] = useState([]);  // ## Current pen stroke being drawn ##
    const canvasRef = useRef(null);  // Reference to the main canvas element
    const drawingCanvasRef = useRef(null);  // Reference to the drawing canvas element
    const undoStack = useRef([]);  // Stack to keep track of actions for undo functionality
    const [cachedImage, setCachedImage] = useState(null);  // Cached version of the selected image

    //for ai using
    const [generatedImages, setGeneratedImages] = useState({}); // State to store AI-generated image filenames
    const [savedGeneratedImages, setSavedGeneratedImages] = useState(new Set()); // Set of saved image names
    const baseUrl = 'http://127.0.0.1:5000';
    
    useEffect(() => {
        const id = localStorage.getItem('userId');
        console.log("Retrieved user ID:", id); // Log to verify
        setUserId(id);
    }, [userId]); // Runs when userId changes

    // Toggles the saving or unsaving of an AI-generated image
    const toggleSaveGeneratedImage = async (imageUrl) => {
        const newSavedGeneratedImages = new Set(savedGeneratedImages);
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
                        g_image_path: `${baseUrl}/static/generations/${imageUrl}`,
                    }),
                });
                if (!response.ok) {
                    throw new Error('Failed to save generated image');
                }
            } catch (error) {
                console.error('Error saving generated image:', error);
            }
        }
        setSavedGeneratedImages(newSavedGeneratedImages); // Update the state with the new saved images set
    };

    // Deletes a saved generated image from the server
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
                    g_image_path: `${baseUrl}/static/generations/${imageUrl}`,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to delete generated image');
            }
        } catch (error) {
            console.error('Error deleting generated image:', error);
        }
    };

    // Function to draw the image and any drawn rectangles on the canvas
    const drawImageOnCanvas = useCallback((ctx) => {
        if (!cachedImage || !ctx) return;
        // Calculate scaling and offsets to center the image in the canvas
        const imgScale = Math.min(ctx.canvas.width / originalWidth, ctx.canvas.height / originalHeight);
        const offsetX = (ctx.canvas.width - originalWidth * imgScale) / 2;
        const offsetY = (ctx.canvas.height - originalHeight * imgScale) / 2;

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.drawImage(cachedImage, offsetX, offsetY, originalWidth * imgScale, originalHeight * imgScale);

        // Set styles for drawing rectangles
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineJoin = 'round';  
        ctx.lineCap = 'round';

        // Draw all the rectangles from the rect array
        rect.forEach(r => {
            ctx.fillRect(offsetX + r.x * imgScale, offsetY + r.y * imgScale, r.width * imgScale, r.height * imgScale);
            ctx.strokeRect(offsetX + r.x * imgScale, offsetY + r.y * imgScale, r.width * imgScale, r.height * imgScale);
        });

        // Draw the current rectangle if it's being drawn
        if (currentRect) {
            ctx.fillRect(offsetX + currentRect.x * imgScale, offsetY + currentRect.y * imgScale, currentRect.width * imgScale, currentRect.height * imgScale);
            ctx.strokeRect(offsetX + currentRect.x * imgScale, offsetY + currentRect.y * imgScale, currentRect.width * imgScale, currentRect.height * imgScale);
        }

        // Draw all the pen strokes 
        ctx.strokeStyle = 'white';
        ctx.lineWidth = penWidth;
        ctx.lineJoin = 'round';  // Make the rectangle corners smooth
        ctx.lineCap = 'round';

        penStrokes.forEach(stroke => {
            ctx.beginPath();
            ctx.moveTo(offsetX + stroke[0].x * imgScale, offsetY + stroke[0].y * imgScale);
            stroke.forEach(point => {
                ctx.lineTo(offsetX + point.x * imgScale, offsetY + point.y * imgScale);
            });
            ctx.stroke();
        });

        //  Draw the current pen stroke if it's being drawn 
        if (currentPenStroke.length > 0) {
            ctx.beginPath();
            ctx.moveTo(offsetX + currentPenStroke[0].x * imgScale, offsetY + currentPenStroke[0].y * imgScale);
            currentPenStroke.forEach(point => {
                ctx.lineTo(offsetX + point.x * imgScale, offsetY + point.y * imgScale);
            });
            ctx.stroke();
        }
    }, [cachedImage, originalWidth, originalHeight, rect, currentRect, penStrokes, currentPenStroke, penWidth]); 

    // useEffect hook to draw the image when the canvas or cached image changes
    useEffect(() => {
        if (canvasRef.current && cachedImage) {
            const ctx = canvasRef.current.getContext('2d');
            drawImageOnCanvas(ctx);
        }
    }, [cachedImage, drawImageOnCanvas]);

    // Function to update AI options when selected in the dropdown
    const handleOptionChange = (index, value) => {
        const updatedOptions = [...aiOptions];
        updatedOptions[index] = value;
        setAiOptions(updatedOptions);
    };

    // Handle file selection and enforce a maximum of 3 images
    const handleImageChange = (event) => {
        const selectedFiles = event.target.files;
        if (selectedFiles.length > 0) {
            if(selectedFiles.length > 3) {
                alert("Please choose no more than 3 images");
                return;
            }
            // Convert the FileList to an array and create object URLs for each image
            const imagePreviews = Array.from(selectedFiles).map(file => URL.createObjectURL(file));
            setPreviews(imagePreviews); // Update the previews state with the new image URLs
            setFiles(Array.from(selectedFiles)); // Store the selected files in the state
            setShowClear(true);
        }
    };

    // Function to clear uploaded images
    const handleClear = () => {
        setPreviews([]); // Clear the image previews
        setFiles([]); // Clear the selected files
        setShowClear(false); // Hide the clear button
        document.getElementById('imageUpload').value = null; // Clear the file input
    };

    // Toggle the visibility of the text input and clear the text if it was visible
    const handleWithTextClick = () => {
        if (textvisible) {
            setText('');
        }
        setTextVisible(prev => !prev);
    };

    // Handle selection of an image to display on the canvas
    const handleCanvasChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            const img = new Image();
            img.onload = () => {
                setOriginalWidth(img.width);
                setOriginalHeight(img.height);
                setSelectedImage(selectedFile);
                setCachedImage(img);
                const drawingCanvas = drawingCanvasRef.current;
                drawingCanvas.width = img.width;
                drawingCanvas.height = img.height;
            };
            img.src = URL.createObjectURL(selectedFile);
        }
    };

    // Clear the canvas and reset the drawn rectangles and undo stack
    const clearCanvas = () => {
        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            setRects([]);
            setPenStrokes([]);  // Clear all pen strokes 
            setCurrentRect(null);
            undoStack.current = [];
            // Redraw the image on the cleared canvas
            if (cachedImage) {
                const imgScale = Math.min(ctx.canvas.width / originalWidth, ctx.canvas.height / originalHeight);
                const offsetX = (ctx.canvas.width - originalWidth * imgScale) / 2;
                const offsetY = (ctx.canvas.height - originalHeight * imgScale) / 2;
                ctx.drawImage(cachedImage, offsetX, offsetY, originalWidth * imgScale, originalHeight * imgScale);
            }
        }
    };

    // Undo the last drawn rectangle
    const undoLastAction = () => {
        if (penStrokes.length > 0 || rect.length > 0) {
            // If pen strokes exist, undo the last pen stroke
            if (penStrokes.length > 0) {
                const newPenStrokes = penStrokes.slice(0, -1);  // Remove the last pen stroke
                setPenStrokes(newPenStrokes);  // Update the state
                undoStack.current.push({ type: 'pen', data: penStrokes[penStrokes.length - 1] });  // Save the pen stroke to the undo stack
            }
            // If no pen strokes left, but rectangles exist, undo the last rectangle
            else if (rect.length > 0) {
                const newRects = rect.slice(0, -1);  // Remove the last rectangle
                setRects(newRects);  // Update the state
                undoStack.current.push({ type: 'rect', data: rect[rect.length - 1] });  // Save the rectangle to the undo stack
            }
    
            // Redraw the canvas
            if (canvasRef.current && cachedImage) {
                const ctx = canvasRef.current.getContext('2d');
                drawImageOnCanvas(ctx);  // Redraw the canvas with updated state
            }
        }
    };

    // Start drawing a rectangle when the user clicks on the canvas
    const startDrawing = (e) => {
        if (!selectedImage) {
            alert("Please choose image first");
            return;
        }
        setIsDrawing(true);
        const canvas = canvasRef.current;
        const rectBounds = canvas.getBoundingClientRect();
        const imgScale = Math.min(canvas.width / originalWidth, canvas.height / originalHeight);
        const offsetX = (canvas.width - originalWidth * imgScale) / 2;
        const offsetY = (canvas.height - originalHeight * imgScale) / 2;

        const x = (e.clientX - rectBounds.left - offsetX) / imgScale;
        const y = (e.clientY - rectBounds.top - offsetY) / imgScale;

        if (isPenMode) {
            //  Start drawing with pen (freehand) 
            setCurrentPenStroke([{ x, y }]);
        } else {
            // Start drawing a rectangle
            setStartPos({ x, y });
            setCurrentRect({ x, y, width: 0, height: 0 });
        }
    };

    // Finish drawing a rectangle when the user releases the mouse
    const draw = (e) => {
        if (!isDrawing || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        const imgScale = Math.min(canvas.width / originalWidth, canvas.height / originalHeight);
        const offsetX = (canvas.width - originalWidth * imgScale) / 2;
        const offsetY = (canvas.height - originalHeight * imgScale) / 2;

        const currentX = (e.clientX - canvas.getBoundingClientRect().left - offsetX) / imgScale;
        const currentY = (e.clientY - canvas.getBoundingClientRect().top - offsetY) / imgScale;
        const width = currentX - startPos.x;
        const height = currentY - startPos.y;

        if (isPenMode) {
            //  Add points to the current pen stroke 
            setCurrentPenStroke(prev => [...prev, { x: currentX, y: currentY }]);
        } else {
            // Draw a rectangle
            setCurrentRect({ ...currentRect, width, height });
        }

        drawImageOnCanvas(ctx);
    };

    const stopDrawing = () => {
        if (!isDrawing) return;  // If drawing is not active, return immediately
        setIsDrawing(false);  // Stop drawing
    
        if (isPenMode) {
            // ## Save the current pen stroke to the penStrokes array ##
            if (currentPenStroke.length > 0) {
                setPenStrokes(prev => [...prev, currentPenStroke]);  // Add the current pen stroke to penStrokes
                undoStack.current.push({ type: 'pen', data: currentPenStroke });  // Save the pen stroke to the undo stack
            }
            setCurrentPenStroke([]);  // Reset the current pen stroke
        } else {
            if (currentRect && currentRect.width !== 0 && currentRect.height !== 0) {
                setRects(prev => [...prev, currentRect]);  // Add the new rectangle to the rects array
                undoStack.current.push({ type: 'rect', data: currentRect });  // Save the rectangle to the undo stack
            }
            setCurrentRect(null);  // Reset the current rectangle
        }
    
        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            // Redraw the canvas with the updated rectangles or pen strokes
            drawImageOnCanvas(ctx);
        }
    };
    
    // Handle file submission and send the selected files and drawn rectangles to the backend
    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        const drawingCanvas = drawingCanvasRef.current;
        const formData = new FormData();
    
        if (files.length > 0) {
            files.forEach((file, index) => {
                // Logging the files and options
                console.log(`Appending file: ${file.name}, Option: ${aiOptions[index]}`);
                formData.append(`image${index}`, file);
                formData.append(`option${index}`, aiOptions[index]);
            });
        }
    
        formData.append('text', text);

        if (selectedImage && drawingCanvas) {
            const exportCanvas = document.createElement('canvas');
            exportCanvas.width = originalWidth;
            exportCanvas.height = originalHeight;
            const exportCtx = exportCanvas.getContext('2d');
            exportCtx.fillStyle = '#000000';
            exportCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
            exportCtx.fillStyle = 'white';
            
            // store either the rectangle or brush part into mask.
            if (rect.length > 0) {
                rect.forEach(r => {
                    exportCtx.fillRect(r.x, r.y, r.width, r.height);
                });
            }
    
           
            if (penStrokes.length > 0) {
                exportCtx.strokeStyle = 'white';  
                exportCtx.lineWidth = penWidth;  
                exportCtx.lineJoin = 'round';  
                exportCtx.lineCap = 'round';  
    
                penStrokes.forEach(stroke => {
                    exportCtx.beginPath();
                    exportCtx.moveTo(stroke[0].x, stroke[0].y);  
                    stroke.forEach(point => {
                        exportCtx.lineTo(point.x, point.y); 
                    });
                    exportCtx.stroke();
                });
            }
    
    
            const maskBlob = await new Promise((resolve, reject) => {
                exportCanvas.toBlob((blob) => {
                    if (blob) {
                        resolve(blob);
                    } else {
                        reject(new Error("Mask toBlob failed"));
                    }
                }, 'image/png');
            });
            formData.append('maskImage', maskBlob);
            formData.append('canvasImage', selectedImage);

        }

        // Debugging the formData
        for (let pair of formData.entries()) {
            console.log(`${pair[0]}: ${pair[1] instanceof Blob ? pair[1].name : pair[1]}`);
        }
    
        try {
            const response = await fetch(`${baseUrl}/backend/upload`, {
                method: 'POST',
                body: formData,
            });
            if (response.ok) {
                const result = await response.json();
                console.log('AI generated image:', result);
                setGeneratedImages(result); // Update state with the generated images
            } else {
                console.error('Upload failed');
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="upload-holder">
            <center>
                <form onSubmit={handleSubmit}>
                    <br />
                    <div className="avatar-preview">
                        {previews.length === 0 && (
                            <div id="defaultPreview" style={{ backgroundImage: 'url(/images/hum-2.gif)' }}>
                                <h2>-Upload your work-</h2>
                            </div>
                        )}
                        {previews.map((preview, index) => (
                            <div key={index} id="imagePreview" style={{ backgroundImage: `url(${preview})` }}>
                                <select
                                    value={aiOptions[index]}
                                    onChange={(e) => handleOptionChange(index, e.target.value)}
                                >
                                    <option value="AI Options">AI options</option>
                                    <optgroup label="Edge Detection">
                                        <option value="canny|low">Canny (Low Intensity)</option>
                                        <option value="canny|balanced">Canny (Balance Intensity)</option>
                                        <option value="canny|high">Canny (High Intensity)</option>
                                    </optgroup>
                                    <optgroup label="Architechure">
                                        <option value="mlsd|low">mlsd (Low Intensity)</option>
                                        <option value="mlsd|balanced">mlsd (Balance Intensity)</option>
                                        <option value="mlsd|high">mlsd (High Intensity)</option>
                                    </optgroup>
                                    <optgroup label="Face">
                                        <option value="openpose_faceonly|low">openpose_faceonly (Low Intensity)</option>
                                        <option value="openpose_faceonly|balanced">openpose_faceonly (Balance Intensity)</option>
                                        <option value="openpose_faceonly|high">openpose_faceonly (High Intensity)</option>
                                    </optgroup>
                                    <optgroup label="Hand">
                                        <option value="openpose_hand|low"> openpose_hand (Low Intensity)</option>
                                        <option value="openpose_hand|balanced">openpose_hand (Balance Intensity)</option>
                                        <option value="openpose_hand|high">openpose_hand (High Intensity)</option>
                                    </optgroup>
                                    <optgroup label="Full Pose">
                                        <option value="dw_openpose_full|low">dw_openpose_full (Low Intensity)</option>
                                        <option value="dw_openpose_full|balanced">dw_openpose_full (Balance Intensity)</option>
                                        <option value="dw_openpose_full|high">dw_openpose_full (High Intensity)</option>
                                    </optgroup>
                                    <optgroup label="Animal Pose">
                                        <option value="animal_openpose|low">animal_openpose (Low Intensity)</option>
                                        <option value="animal_openpose|balanced">animal_openpose (Balance Intensity)</option>
                                        <option value="animal_openpose|high">animal_openpose (High Intensity)</option>
                                    </optgroup>
                                    <optgroup label="Depth">
                                        <option value="depth_anything_v2|low">depth_anything_v2 (Low Intensity)</option>
                                        <option value="depth_anything_v2|balanced">depth_anything_v2 (Balance Intensity)</option>
                                        <option value="depth_anything_v2|high">depth_anything_v2 (High Intensity)</option>
                                    </optgroup>
                                    <optgroup label="Segmentation">
                                        <option value="seg_ofade20k|low">seg_ofade20k (Low Intensity)</option>
                                        <option value="seg_ofade20k|balanced">seg_ofade20k (Balance Intensity)</option>
                                        <option value="seg_ofade20k|high">seg_ofade20k (High Intensity)</option>
                                    </optgroup>
                                    <optgroup label="Segmentation Anime">
                                        <option value="seg_anime_face|low">seg_anime_face (Low Intensity)</option>
                                        <option value="seg_anime_face|balanced">seg_anime_face (Balance Intensity)</option>
                                        <option value="seg_anime_face|high">seg_anime_face (High Intensity)</option>
                                    </optgroup>
                                    <optgroup label="Color Palatte">
                                        <option value="shuffle|low">shuffle (Low Intensity)</option>
                                        <option value="shuffle|balanced">shuffle (Balance Intensity)</option>
                                        <option value="shuffle|high">shuffle (High Intensity)</option>
                                    </optgroup>
                                    <optgroup label="Color Composition">
                                        <option value="t2ia_color_grid|low">t2ia_color_grid (Low Intensity)</option>
                                        <option value="t2ia_color_grid|balanced">t2ia_color_grid (Balance Intensity)</option>
                                        <option value="t2ia_color_grid|high">t2ia_color_grid (High Intensity)</option>
                                    </optgroup>
                                </select>
                            </div>
                        ))}
                        
                        <div className="avatar-edit">
                            <input
                                multiple
                                type="file"
                                id="imageUpload"
                                accept=".png, .jpg, .jpeg"
                                onChange={handleImageChange}
                            />
                            {/* Button that toggles between Browse and Clear */}
                            <button 
                                className="function-btn" 
                                type="button" 
                                onClick={() => {
                                    if (showClear) {
                                        handleClear(); // Call handleClear when Clear is shown
                                    } else {
                                        document.getElementById('imageUpload').click(); // Trigger file input click when Browse is shown
                                    }
                                }}
                            >
                                {showClear ? "Clear" : "Browse"} {/* Toggle button text */}
                            </button>
                            <button className="function-btn" type="button" onClick={() => setShowCanvas(!showCanvas)}>
                                {showCanvas ? "No inpainting" : "With Inpainting"}
                            </button>
                            <button
                                className="function-btn"
                                type="button"
                                onClick={handleWithTextClick}
                            >
                                {textvisible ? "No text" : "With text"}
                            </button>
                            <button className="function-btn" type="submit">
                                Generate
                            </button>
                        </div>
                    </div>
                    <br />
                    {showCanvas && (
                        <div>
                            <h2>Polish your work with inpainting</h2>
                            <canvas
                                id="canvasRef"
                                ref={canvasRef}
                                onMouseDown={startDrawing}
                                onMouseUp={stopDrawing}
                                onMouseMove={draw}
                                onTouchMove={draw}
                                onTouchEnd={stopDrawing}
                                onTouchStart={startDrawing}
                                width="800"
                                height="600"
                            />
                            <canvas
                                id="drawingCanvasRef"
                                ref={drawingCanvasRef}
                                width="500"
                                height="500"
                            />
                            <br />
                            <div className="canvas-btn">
                                <button type="button" onClick={undoLastAction} className="painting-tool">
                                    <img src="../images/undo.png" className="painting-icon" alt="undo" />
                                </button>
                                
                                <div style={{ display: 'inline-block' }}> 
                                    <label htmlFor="penWidth" style={{color:'white'}}>Brush Width: </label>  
                                    <input 
                                        id="penWidth" 
                                        type="range" 
                                        min="1" 
                                        max="20" 
                                        value={penWidth} 
                                        onChange={(e) => setPenWidth(e.target.value)} 
                                        style={{ width: '100px' }} 
                                    />  
                                </div>  
  
                                <button className="function-btn" type="button" onClick={() => setIsPenMode(!isPenMode)} >
                                    {isPenMode ? "Switch to Rectangle" : "Switch to Pen"}
                                </button>
                                <input
                                    type="file"
                                    id="canvasUpload"
                                    accept=".png, .jpg, .jpeg"
                                    onChange={handleCanvasChange}
                                />
                                <button className="function-btn" type="button" onClick={() => document.getElementById('canvasUpload').click()}>
                                    Choose an image
                                </button>
                                <button className="function-btn" type="button" onClick={clearCanvas}>
                                    Clear canvas
                                </button>
                            </div>
                        </div>
                    )}

                    <br />
                    <br />

                    {textvisible && (
                        <textarea
                            className="form-control"
                            id="textAreaExample1"
                            rows="4"
                            value={text}
                            placeholder="Enter your description here..."
                            onChange={e => setText(e.target.value)}
                        ></textarea>
                    )}
                    
                    <br />
                    <br />

                </form>

                {/* Render the AI-generated images only if there are generated images */}
                {Object.keys(generatedImages).length > 0 && (
                    <div>
                        <h2>Generated Images:</h2>
                        {Object.values(generatedImages).map((imageName, index) => (
                            <div key={index} className="image-display">
                                <img
                                    className="results"
                                    src={`${baseUrl}/static/generations/${imageName}`}
                                    alt={`Generated ${index}`}
                                />
                                {/* Save button */}
                                <button
                                    className={`like-button ${savedGeneratedImages.has(imageName) ? 'liked' : ''}`}
                                    onClick={() => {
                                        toggleSaveGeneratedImage(imageName);
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
                )}

                <br />
                <br />

                {loading && (
                    <div className="loading-overlay">
                        <div className="loading-container">
                            <img src="../images/loading-icon.gif" alt="Loading..." className="loading-icon" />
                        </div>
                    </div>
                )}
            </center>
        </div>
    );
}


