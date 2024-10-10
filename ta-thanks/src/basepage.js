import { useNavigate, useLocation } from 'react-router-dom';
import React, { useState } from "react";
import Draggable from 'react-draggable';  // Import Draggable
import "./basepage.css";
import homeIcon from './Assets/Vector.png';
import emptyCard1 from './Assets/card1_Empty.png';
import emptyCard2 from './Assets/card2_Empty.png';
import emptyCard3 from './Assets/Card3_Empty.png';
import emptyCard4 from './Assets/card4_Empty.png';
import emptyCard5 from './Assets/card5_Empty.png';

function BasePage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { selectedCard } = location.state || {};  // Retrieve card data from the router state
    const [text, setText] = useState(''); // State to store the user's message
    const [textBoxes, setTextBoxes] = useState([]); // Store multiple draggable text boxes
    const [selectedBoxId, setSelectedBoxId] = useState(null); // Track the currently selected text box
    const [previewTextSize, setPreviewTextSize] = useState(20); // Manage preview text size for new text boxes
    const [textColor, setTextColor] = useState('#000000'); // Set default text color to black

    const handleHomeClick = () => {
        const confirmDiscard = window.confirm("Are you sure you want to discard your changes and go to the home page?");
        if (confirmDiscard) {
            navigate('/');
        }
    };

    const handleSendClick = () => {
        const confirmSend = window.confirm("Are you sure you would like to send this card?");
        // Modify this if statement for sending the card wherever it's meant to be sent
        //if (confirmSend) {
        //    navigate('/basepage');
        //}
    };

    const handleAddTextBox = () => {
        if (text) {
            setTextBoxes([...textBoxes, { id: textBoxes.length + 1, content: text, color: textColor, textSize: previewTextSize }]);
            setText(''); // Reset the input box after adding
            setPreviewTextSize(20); // Reset preview text size for next addition
        }
    };

    const handleDeleteTextBox = () => {
        if (selectedBoxId) {
            setTextBoxes(textBoxes.filter(box => box.id !== selectedBoxId));
            setSelectedBoxId(null); // Reset the selected box ID after deletion
        }
    };

    const handleTextClick = (id) => {
        setSelectedBoxId(id); // Set the selected box ID when a text box is clicked

        // Update color and size for the selected box
        const selectedBox = textBoxes.find(box => box.id === id);
        if (selectedBox) {
            setTextColor(selectedBox.color); // Set color to the selected box's color
            setPreviewTextSize(selectedBox.textSize); // Set size to the selected box's size
        }
    };

    const updateTextBoxProperties = (id, newColor, newSize) => {
        setTextBoxes(textBoxes.map(box => 
            box.id === id 
                ? { ...box, color: newColor, textSize: newSize } 
                : box
        ));
    };

    const handleColorChange = (e) => {
        setTextColor(e.target.value);
        if (selectedBoxId) {
            updateTextBoxProperties(selectedBoxId, e.target.value, previewTextSize);
        }
    };

    const handleSizeChange = (increment) => {
        const newSize = Math.max(previewTextSize + increment, 1); // Prevent size from going below 1
        setPreviewTextSize(newSize);
        if (selectedBoxId) {
            updateTextBoxProperties(selectedBoxId, textColor, newSize);
        }
    };

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
                <div className="card-preview-container">
                    <div className="card-preview">
                        <img src={cards[selectedCard - 1]} alt="Selected card" />
                        {textBoxes.map((box) => (
                            <Draggable key={box.id} bounds="parent">
                                <div
                                    className="draggable-text"
                                    style={{
                                        fontSize: `${box.textSize}px`,
                                        color: box.color,
                                        border: selectedBoxId === box.id ? '2px solid blue' : 'none' // Highlight selected box
                                    }}
                                    onClick={() => handleTextClick(box.id)} // Select the text box on click
                                >
                                    {box.content}
                                </div>
                            </Draggable>
                        ))}
                        {/* Live preview of the current input message before it's added */}
                        {text && (
                            <Draggable bounds="parent">
                                <div className="draggable-text" style={{ fontSize: `${previewTextSize}px`, color: textColor }}>
                                    {text}
                                </div>
                            </Draggable>
                        )}
                    </div>
                </div>

                {/* Message Box Section */}
                <div className="message-box-container">
                    <label htmlFor="message">Add a Message</label>
                    <textarea id="message" value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter your message here" />
                    
                    <label htmlFor="color-picker">Text Color:</label>
                    <input type="color" id="color-picker" value={textColor} onChange={handleColorChange} />

                    <div className="controls">
                        <button onClick={() => handleSizeChange(-1)}>-</button>
                        <button onClick={() => handleSizeChange(1)}>+</button>
                        <p>{previewTextSize}px</p>
                    </div>

                    <div className="controls">
                        <button onClick={() => navigate('/search')} className="back-button">&larr;</button>
                        <button onClick={handleSendClick} className="send-button">Send Card</button>
                    </div>

                    <button className="add-text-button" onClick={handleAddTextBox}>
                        Add Text to Card
                    </button>

                    {/* Delete Selected Text Button */}
                    <button className="delete-text-button" onClick={handleDeleteTextBox} disabled={!selectedBoxId}>
                        Delete Selected Text
                    </button>
                </div>
            </div>
        </>
    );
}

export default BasePage;
