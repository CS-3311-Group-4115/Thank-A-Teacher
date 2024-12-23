import { useNavigate, useLocation } from 'react-router-dom';
import React, { useState, useEffect, useRef } from "react";
import ReactDOM from 'react-dom';
import html2canvas from 'html2canvas';
import Draggable from 'react-draggable'; 
import "./basepage.css";
import homeIcon from './Assets/Vector.png';
import emptyCard1 from './Assets/card1_Empty.png';
import emptyCard2 from './Assets/card2_Empty.png';
import emptyCard3 from './Assets/Card3_Empty.png';
import emptyCard4 from './Assets/card4_Empty.png';
import emptyCard5 from './Assets/card5_Empty.png';
import emailjs from 'emailjs-com';
import axios from "axios";
import GIF from './GIF';
import GIFEncoder from './GIFEncoder';
import { encode64 } from './b64';

function BasePage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { selectedCard } = location.state || {};  // Retrieve card data from the router state
    const { selectedTAEmail } = location.state || {};
    const [text, setText] = useState(''); // State to store the user's message
    const [textBoxes, setTextBoxes] = useState([]); // Store multiple draggable text boxes
    const [selectedBoxId, setSelectedBoxId] = useState(null); // Track the currently selected text box
    const [previewTextSize, setPreviewTextSize] = useState(20); // Manage preview text size for new text boxes
    const [textColor, setTextColor] = useState('#000000'); // Set default text color to black
    const [textStyle, setTextStyle] = useState('Aboreto'); // New state for text style (font)
    const controlsRef = useRef(null);
    const [gifBoxes, setGifBoxes] = useState([]); // Store draggable GIFs
    const [gifPosition, setGifPosition] = useState([]);
    const [gifPositionID, setGifPositionID] = useState([])
    const [selectedGifId, setSelectedGifId] = useState(null);
    const gifContainerRef = useRef(null);
    const [availableGifs, setAvailableGifs] = useState([]);
    useEffect(() => {

        const defaultColor = defaultTextColors[selectedCard - 1];
        setTextColor(defaultColor);

        // Function to handle clicks outside the text box
        const handleClickOutside = (event) => {
            const cardPreview = document.querySelector('.card-preview-container');
            // Check if the click is outside both the text box and the controls section
            if (
                cardPreview && 
                !cardPreview.contains(event.target) && 
                controlsRef.current && 
                !controlsRef.current.contains(event.target)
            ) {
                setSelectedBoxId(null); // Deselect text box
            }
        };
    
        // Add event listener for clicks on the document
        document.addEventListener('mousedown', handleClickOutside);
    
        // Cleanup function to remove event listener when component unmounts
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Fetch GIFs from the backend on component mount
    useEffect(() => {
        const fetchGifs = async () => {
            try {
                const response = await axios.get("http://localhost:3001/gifs"); 
                setAvailableGifs(response.data.gifs); 
            } catch (error) {
                console.error("Error fetching GIFs:", error);
            }
        };

        fetchGifs();
    }, []);

    const handleHomeClick = () => {
        const confirmDiscard = window.confirm("Are you sure you want to discard your changes and go to the home page?");
        if (confirmDiscard) {
            navigate('/');
        }
    };
    function downloadURI(uri, name) {
        var link = document.createElement("a");
        link.download = name;
        link.href = uri;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    var loadedGIF = []
    var waitingOnGIF = gifPositionID.length;

    const loadGIF = async (src, callback) => {
        const myGif = GIF();
        myGif.onerror = function(e) {
            console.log("Gif loading error " + e.type);
        };
    
        myGif.load(src);
        myGif.onload = function() {
            console.log("LOADED GIF", src);
            loadedGIF.push(myGif);
            callback(); // Notify that the GIF has loaded
        };
    };
    
    const loadGIFs = async() => {
        for (let index = 0; index < gifPositionID.length; index++) {
            const gifID = gifPositionID[index];
            const position = gifPosition[index];
            const x = position[0];
            const y = position[1];
            const src = gifBoxes[index].src;

            // Process GIF loading with timeout to allow UI updates
            await new Promise((resolve) => {
                setTimeout(() => {
                    loadGIF(src, resolve); // Load the GIF and resolve once it's loaded
                }, 0); // 0 ms delay to yield control to the UI thread
            });
        }

        console.log("All GIFs loaded");
    };

    const printRef = React.useRef();
    const handleSendClick = async () => {
        const confirmSend = window.confirm("Are you sure you would like to send this card?");
        if (confirmSend) {
            try {
                const element = printRef.current; // Reference to the .card-preview-container
                console.log("Element: ", element);
    
                // Use html2canvas to capture the content
                const canvas = await html2canvas(element, {
                    useCORS: true,
                    logging: true,
                });
    
                const canvasWidth = canvas.width; // html2canvas will set the actual canvas width
                const canvasHeight = canvas.height; // html2canvas will set the actual canvas height
    
                console.log("Canvas Size: ", canvasWidth, canvasHeight);
    
                // Loop through all GIF positions and update their positions based on their image's DOM position
                const adjustedPositions = await Promise.all(gifPosition.map(async ([x, y], index) => {
                    const imgElement = document.getElementById(gifPositionID[index]);
                    if (imgElement) {
                        // Get the position of the image element relative to the screen or container
                        const rect = imgElement.getBoundingClientRect();
                        const containerRect = element.getBoundingClientRect();
                        const imgX = rect.left; // X position relative to the screen
                        const imgY = rect.top + window.scrollY - ((containerRect.y / 3 ) - 10);  // Y position relative to the screen
                        console.log(imgY);
    
                        // Return the updated position
                        return [imgX, imgY];
                    }
                    return [x, y]; // If the image is not found, fallback to original position
                }));
    
                console.log("Adjusted Positions: ", adjustedPositions);
    
                const ctx = canvas.getContext("2d");
                const encoder = new GIFEncoder();
                encoder.setRepeat(0); // 0 -> loop forever
                encoder.setDelay(500); // Delay for each frame
                encoder.start();
    
                // Dynamically load GIFs and add frames
                await loadGIFs();
    
                // Capture each frame of the GIF
                for (let frame = 0; frame < 20; frame++) {
                    for (let index = 0; index < loadedGIF.length; index++) {
                        const gif = loadedGIF[index];
                        const position = adjustedPositions[index];
                        const x = position[0];
                        const y = position[1] + 25;
    
                        // Ensure gif.frames[frame] exists and has an image
                        if (gif.frames && gif.frames[frame] && gif.frames[frame].image) {
                            const gifFrame = gif.frames[frame];
                            const image = gifFrame.image;

                        // Draw the GIF frame with the adjusted position and size
                            ctx.drawImage(image, x, y, 150, 150);
                        } else {
                            console.warn(`Frame ${frame} does not exist for GIF at index ${index}.`);
                        }
                    }
    
                    encoder.addFrame(ctx);
                }
    
                encoder.finish();
                const binaryGif = encoder.stream().getData();
                encoder.download("download.gif"); // Download the GIF
    
                // Prepare to send the generated GIF data
                const data = "data:image/gif;base64," + encode64(binaryGif);
                downloadURI(data, "test.gif");
    
                axios({
                    method: "post",
                    url: "http://localhost:3001/card",
                    data: { data: data, for: selectedTAEmail },
                    config: { headers: { "Content-Type": "multipart/form-data" } },
                })
                    .then(function (response) {
                        console.log(response);
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            } catch (error) {
                console.error("Error in capturing screenshot or generating GIF", error);
            }
            
        }

    if (confirmSend) {
        const message = "You have been sent a card! http://localhost:3000/login"; // Assuming 'text' contains the card message
        const cardImage = cards[selectedCard - 1]; // Get the selected card image
    
        const templateParams = {
            to_email: selectedTAEmail, // Recipient email
            from_name: 'thankateacher', // Sender name (could be dynamic)
            message: message,
        };
    
            emailjs.send('service_zajqzw1', 'template_3annybp', templateParams, 'PCG3Qws_V456mFKTi')
                .then((response) => {
            console.log('Email successfully sent!', response.status, response.text);
            alert('Email sent successfully!');
        })
            .catch((error) => {
            console.error('Failed to send email:', error);
            alert('Failed to send email.');
        });
        
    }
    

        if (confirmSend) {
          // Navigate to the SentPage to show the animation
          navigate('/sent');
        }
    };

    
    // Reset when adding a new text box
    const handleAddTextBox = () => {
        if (text) {
    
            // Add the new text box with the current textColor (not resetting it)
            setTextBoxes([...textBoxes, {
                id: textBoxes.length + 1,
                content: text,
                color: textColor,  // Use the currently selected color (not the default one)
                textSize: previewTextSize,
                fontStyle: textStyle
            }]);
            setText('');  // Clear the text input
            setPreviewTextSize(20);  // Reset the text size for new box
            setTextStyle('Aboreto');  // Reset the font style for new box
        }
    };
    

    

    const handleDeleteTextBox = () => {
        if (selectedBoxId !== null) {
            // Filter out the selected text box
            setTextBoxes(prevBoxes => prevBoxes.filter(box => box.id !== selectedBoxId));
            setSelectedBoxId(null); // Deselect after deletion
        } else {
            alert("No text box is selected!");
        }
    };
    
    const handleTextClick = (id) => {
        if (selectedBoxId !== id) {
            setSelectedBoxId(id); // Set selected only when it's not already selected
        } else {
            setSelectedBoxId(null); // Deselect if already selected
        }
        // Fetch and apply text box properties to the controls
        const selectedBox = textBoxes.find(box => box.id === id);
        if (selectedBox) {
            setTextColor(selectedBox.color);
            setPreviewTextSize(selectedBox.textSize);
            setTextStyle(selectedBox.fontStyle); // Set the font style of the selected box
        }
    };

    const handleColorChange = (color) => {
        setTextColor(color);
        if (selectedBoxId !== null) {
            setTextBoxes(prevBoxes => 
                prevBoxes.map(box =>
                    box.id === selectedBoxId
                        ? { ...box, color: color }
                        : box
                )
            );
        }
    };

    const handleSizeChange = (e) => {
        const newSize = Math.max(e.target.value, 1); // Prevent size from going below 1
        setPreviewTextSize(newSize);
        if (selectedBoxId !== null) {
            setTextBoxes(prevBoxes => 
                prevBoxes.map(box =>
                    box.id === selectedBoxId
                        ? { ...box, textSize: newSize }
                        : box
                )
            );
        }
    };

    const handleFontStyleChange = (e) => {
        const newFontStyle = e.target.value;
        setTextStyle(newFontStyle);
        if (selectedBoxId !== null) {
            setTextBoxes(prevBoxes => 
                prevBoxes.map(box =>
                    box.id === selectedBoxId
                        ? { ...box, fontStyle: newFontStyle }
                        : box
                )
            );
        }
    };

    const handleExportCard = async () => {
        // Select the card preview container (the div that wraps the card and text)
        const cardPreview = document.querySelector('.card-preview-container');

        if (cardPreview) {
            // Capture the card preview as an image using html2canvas
            html2canvas(cardPreview, { useCORS: true }).then((canvas) => {
                // Convert the canvas to an image data URL
                const imgData = canvas.toDataURL('image/png');

                // Create a download link
                const link = document.createElement('a');
                link.href = imgData;
                link.download = 'card.png';  // Set the filename for download
                link.click();  // Trigger the download
            });
        }
    };
    const handleAddGif = (gifSrc) => {
        // Add the new GIF to the gifBoxes state
        setGifBoxes([
            ...gifBoxes,
            {
                id: "GIF" + (gifBoxes.length + 1), // Unique ID for each GIF
                src: gifSrc,
            },
        ]);
    };

    const [gifs, setGifs] = useState([]);
    const fetchGifs = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:3001/get-gifs');
            console.log(response.data); // Log the response to inspect the data
            setGifs(response.data);
        } catch (error) {
            console.error('Error fetching GIFs:', error);
        }
    };

    useEffect(() => {
        fetchGifs();
    }, []);

    const handleDeleteGif = () => {
        if (selectedGifId !== null) {
            setGifBoxes((prevGifBoxes) => 
                prevGifBoxes.filter((gif) => gif.id !== selectedGifId)
            );
            setSelectedGifId(null); // Deselect after deletion
        } else {
            alert("No GIF is selected!");
        }
    };
    const handleStop = (event, dragElement) => {
        var id = event.target.id;
        if (id === '') {
            return
        }
        console.log(id)
        console.log(gifPositionID)
        for(var v of gifPositionID.entries()) {
            if(v[1] === id) {
                gifPosition[v[0]] = [dragElement.x,  dragElement.y]
                setGifPosition(gifPosition) 
                console.log(gifPosition) 
                return;
            }
        }
        setGifPositionID([...gifPositionID, id])
        setGifPosition([...gifPosition, [dragElement.x,  dragElement.y]])
        console.log(gifPosition)
        console.log(gifBoxes)
      };
    const defaultTextColors = [
        '#FFFFFF',  
        '#FFFFFF', 
        '#FFFFFF',  
        '000000', 
        '#FFFFFF'   
    ];

    // Static Color Palette (Rainbow + Black, White, Brown)
    const colors = [
        '#FF0000', '#FFA500', '#FFFF00', '#008000', '#0000FF', 
        '#800080', '#FFC0CB', '#000000', '#FFFFFF', '#A52A2A'
    ];

    const cards = [
        emptyCard1,
        emptyCard2,
        emptyCard3,
        emptyCard4,
        emptyCard5
    ];

    return (
        <>
            <div className="blue-section">
                <p>3 of 3: Edit Card</p>
                <button onClick={handleHomeClick}>
                    <img src={homeIcon} alt="Home" />
                </button>
            </div>
            <div className="container">
            {/* Card Preview Section */}
            <div ref={printRef} className="card-preview-container">
                <div id="preview" className="card-preview">
                    <img src={cards[selectedCard - 1]} alt="Selected card" />
                    {textBoxes.map((box) => (
                        <Draggable
                            key={box.id}
                            bounds="parent"
                            onStart={() => handleTextClick(box.id)}
                            onDrag={() => handleTextClick(box.id)}
                        >
                            <div
                                className="draggable-text"
                                style={{
                                    fontSize: `${box.textSize}px`,
                                    color: box.color,
                                    fontFamily: box.fontStyle,
                                    border: selectedBoxId === box.id ? '2px solid blue' : 'none'
                                }}
                            >
                                {box.content}
                            </div>
                        </Draggable>
                    ))}
                    
                    {gifBoxes.map((gif) => (
                        <Draggable
                            key={gif.id}
                            onStop={handleStop}
                            bounds="parent"
                            onStart={() => setSelectedGifId(gif.id)} // Select the GIF on click/drag
                        >
                            <img
                                id={gif.id}
                                src={gif.src}
                                alt="Draggable GIF"
                                className="draggable-gif"
                            />
                        </Draggable>
                    ))}


                    {text && (
                        <Draggable bounds="parent">
                            <div className="draggable-text" style={{ fontSize: `${previewTextSize}px`, color: textColor, fontFamily: textStyle }}>
                                {text}
                            </div>
                        </Draggable>
                    )}
                </div>
            </div>

            {/* GIF Selection Menu */}
            <div className="gif-selection-container">
                <h3 className="gif-selection-title">GIF Selection</h3>
                <div className="gif-placeholder">
                    {/* Static GIFs */}
                    <img
                        src={require('./Assets/Spongebob.gif')}
                        alt="Spongebob GIF"
                        className="gif-option"
                        onClick={() => handleAddGif(require('./Assets/Spongebob.gif'))}
                    />
                    <img
                        src={require('./Assets/TY1.gif')}
                        alt="Thank You GIF"
                        className="gif-option"
                        onClick={() => handleAddGif(require('./Assets/TY1.gif'))}
                    />
                    <img
                        src={require('./Assets/BearyBest.gif')}
                        alt="Beary Best GIF"
                        className="gif-option"
                        onClick={() => handleAddGif(require('./Assets/BearyBest.gif'))}
                    />
                    <img
                        src={require('./Assets/Heart.gif')}
                        alt="Heart GIF"
                        className="gif-option"
                        onClick={() => handleAddGif(require('./Assets/Heart.gif'))}
                    />

                    {/* Dynamically loaded GIFs from database */}
                    {gifs.map((gif) => (
                        <img
                            key={gif._id} // Use _id from the database
                            src={`http://127.0.0.1:3001/get-gif/${gif._id}`} // Construct the URL for the GIF
                            alt={gif.name} // Optional alt text for accessibility
                            className="gif-option"
                            onClick={() => handleAddGif(`http://127.0.0.1:3001/get-gif/${gif._id}`)} // Pass URL to handler
                        />
                    ))}

                </div>
            </div>

        </div>

                {/* Message Box Section */}
                <div className="message-box-container">
                    <label htmlFor="message">Add a Message</label>
                    <textarea id="message" value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter your message here" />

                    {/* Text Style Dropdown */}
                    <select id="font-style" value={textStyle} onChange={handleFontStyleChange}>
                        <option value="Roboto">Roboto</option>
                        <option value="Open Sans">Open Sans</option>
                        <option value="Lato">Lato</option>
                        <option value="Poppins">Poppins</option>
                        <option value="Montserrat">Montserrat</option>
                        <option value="Merriweather">Merriweather</option>
                        <option value="Playfair Display">Playfair Display</option>
                        <option value="Raleway">Raleway</option>
                        <option value="Oswald">Oswald</option>
                    </select>

                    {/* Text Size Slider */}
                    <label htmlFor="text-size">Text Size</label>
                    <div className="slider-container">
                        <input
                            id="text-size"
                            type="range"
                            min="10"
                            max="100"
                            value={previewTextSize}
                            onChange={handleSizeChange}
                        />
                        <span className="slider-value">{previewTextSize} pt</span>
                    </div>

                    {/* Text Color */}
                    <label htmlFor="color-picker">Text Color:</label>
                    <div className="color-palette">
                        {colors.map((color, index) => ( 
                            <div
                                key={index}
                                className="color-circle"
                                style={{ backgroundColor: color }}
                                onClick={() => handleColorChange(color)}
                            ></div>
                        ))}
                    </div>

                    {/* Buttons Section */}
                    <div className="controls">
                        <button onClick={() => navigate('/search')} className="back-button">&larr;</button>
                        <button onClick={handleSendClick} className="send-button">Send Card</button>
                        <button onClick={handleExportCard} className="export-button">Export Card</button> 
                    </div>

                    <button className="add-text-button" onClick={handleAddTextBox}>
                        Add Text to Card
                    </button>
                    


                    <button
                        className="delete-text-button"
                        onClick={handleDeleteTextBox}
                        disabled={!selectedBoxId} // Disable button if no box is selected
                        >
                        Delete Selected Text
                     </button>

                    <button
                        className="delete-gif-button"
                        onClick={handleDeleteGif}
                        disabled={!selectedGifId} // Disable if no GIF is selected
                        >
                        Delete Selected GIF
                    </button>
                </div>
        </>
    );
}

export default BasePage;
