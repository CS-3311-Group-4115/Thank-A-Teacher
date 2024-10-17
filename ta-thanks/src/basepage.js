import { useNavigate, useLocation } from 'react-router-dom';
import React, { useState } from "react";
import Draggable from 'react-draggable';  // Import Draggable
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
    const { selectedCard } = location.state || {};  // Retrieve card data from the router state
    const [text, setText] = useState(''); // State to store the user's message
    const [textBoxes, setTextBoxes] = useState([]); // Store multiple draggable text boxes
    const [selectedBoxId, setSelectedBoxId] = useState(null); // Track the currently selected text box
    const [previewTextSize, setPreviewTextSize] = useState(20); // Manage preview text size for new text boxes
    const [textColor, setTextColor] = useState('#000000'); // Set default text color to black
    const [textStyle, setTextStyle] = useState('Aboreto'); // New state for text style (font)

    const handleHomeClick = () => {
        const confirmDiscard = window.confirm("Are you sure you want to discard your changes and go to the home page?");
        if (confirmDiscard) {
            navigate('/');
        }
    };

    const handleSendClick = () => {
        const confirmSend = window.confirm("Are you sure you would like to send this card?");
    };

    const handleAddTextBox = () => {
        if (text) {
            setTextBoxes([...textBoxes, { id: textBoxes.length + 1, content: text, color: textColor, textSize: previewTextSize, fontStyle: textStyle }]);
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
            setTextStyle(selectedBox.fontStyle); // Set font style to the selected box's style
        }
    };

    const updateTextBoxProperties = (id, newColor, newSize, newStyle) => {
        setTextBoxes(textBoxes.map(box => 
            box.id === id 
                ? { ...box, color: newColor, textSize: newSize, fontStyle: newStyle } 
                : box
        ));
    };

    const handleColorChange = (color) => {
        setTextColor(color);
        if (selectedBoxId) {
            updateTextBoxProperties(selectedBoxId, color, previewTextSize, textStyle);
        }
    };

    const handleSizeChange = (e) => {
        const newSize = Math.max(e.target.value, 1); // Prevent size from going below 1
        setPreviewTextSize(newSize);
        if (selectedBoxId) {
            updateTextBoxProperties(selectedBoxId, textColor, newSize, textStyle);
        }
    };

    const handleFontStyleChange = (e) => {
        setTextStyle(e.target.value); // Update font style
        if (selectedBoxId) {
            updateTextBoxProperties(selectedBoxId, textColor, previewTextSize, e.target.value); // Apply font style change to selected text box
        }
    };

    const handleReset = () => {
        setText('');
        setTextColor('#000000');
        setPreviewTextSize(20);
        setTextStyle('Aboreto');
    };

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
                                        fontFamily: box.fontStyle, // Set font style for the text box
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
                                <div className="draggable-text" style={{ fontSize: `${previewTextSize}px`, color: textColor, fontFamily: textStyle }}>
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

                    {/* Text Style Dropdown */}
                    <label htmlFor="font-style">Text Style</label>
                    <select id="font-style" value={textStyle} onChange={handleFontStyleChange}>
                        <option value="Aboreto">Aboreto</option>
                        <option value="Awkward Gothic JNL">Awkward Gothic JNL</option>
                        <option value="Barlow Semi Condensed Medium">Barlow Semi Condensed Medium</option>
                        <option value="BN Bergen">BN Bergen</option>
                        <option value="Brandon Grotesque Bold">Brandon Grotesque Bold</option>
                        <option value="Fjalla One">Fjalla One</option>
                        <option value="Function Caps Light">Function Caps Light</option>
                    </select>
                    <a href="#" className="reset" onClick={handleReset}>Reset</a>

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
                    <a href="#" className="reset" onClick={handleReset}>Reset</a>

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
                    <a href="#" className="reset" onClick={handleReset}>Reset</a>
                </div>
            </div>
        </>
    );
}

export default BasePage;

import { useNavigate, useLocation } from 'react-router-dom';
import React, { useState } from "react";
import Draggable from 'react-draggable';  // Import Draggable
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
    const { selectedCard } = location.state || {};  // Retrieve card data from the router state
    const [text, setText] = useState(''); // State to store the user's message
    const [textBoxes, setTextBoxes] = useState([]); // Store multiple draggable text boxes
    const [selectedBoxId, setSelectedBoxId] = useState(null); // Track the currently selected text box
    const [previewTextSize, setPreviewTextSize] = useState(20); // Manage preview text size for new text boxes
    const [textColor, setTextColor] = useState('#000000'); // Set default text color to black
    const [textStyle, setTextStyle] = useState('Aboreto'); // New state for text style (font)

    const handleHomeClick = () => {
        const confirmDiscard = window.confirm("Are you sure you want to discard your changes and go to the home page?");
        if (confirmDiscard) {
            navigate('/');
        }
    };

    const handleSendClick = () => {
        const confirmSend = window.confirm("Are you sure you would like to send this card?");
    };

    const handleAddTextBox = () => {
        if (text) {
            setTextBoxes([...textBoxes, { id: textBoxes.length + 1, content: text, color: textColor, textSize: previewTextSize, fontStyle: textStyle }]);
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
            setTextStyle(selectedBox.fontStyle); // Set font style to the selected box's style
        }
    };

    const updateTextBoxProperties = (id, newColor, newSize, newStyle) => {
        setTextBoxes(textBoxes.map(box => 
            box.id === id 
                ? { ...box, color: newColor, textSize: newSize, fontStyle: newStyle } 
                : box
        ));
    };

    const handleColorChange = (color) => {
        setTextColor(color);
        if (selectedBoxId) {
            updateTextBoxProperties(selectedBoxId, color, previewTextSize, textStyle);
        }
    };

    const handleSizeChange = (e) => {
        const newSize = Math.max(e.target.value, 1); // Prevent size from going below 1
        setPreviewTextSize(newSize);
        if (selectedBoxId) {
            updateTextBoxProperties(selectedBoxId, textColor, newSize, textStyle);
        }
    };

    const handleFontStyleChange = (e) => {
        setTextStyle(e.target.value); // Update font style
        if (selectedBoxId) {
            updateTextBoxProperties(selectedBoxId, textColor, previewTextSize, e.target.value); // Apply font style change to selected text box
        }
    };

    const handleReset = () => {
        setText('');
        setTextColor('#000000');
        setPreviewTextSize(20);
        setTextStyle('Aboreto');
    };

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
                                        fontFamily: box.fontStyle, // Set font style for the text box
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
                                <div className="draggable-text" style={{ fontSize: `${previewTextSize}px`, color: textColor, fontFamily: textStyle }}>
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

                    {/* Text Style Dropdown */}
                    <label htmlFor="font-style">Text Style</label>
                    <select id="font-style" value={textStyle} onChange={handleFontStyleChange}>
                        <option value="Aboreto">Aboreto</option>
                        <option value="Awkward Gothic JNL">Awkward Gothic JNL</option>
                        <option value="Barlow Semi Condensed Medium">Barlow Semi Condensed Medium</option>
                        <option value="BN Bergen">BN Bergen</option>
                        <option value="Brandon Grotesque Bold">Brandon Grotesque Bold</option>
                        <option value="Fjalla One">Fjalla One</option>
                        <option value="Function Caps Light">Function Caps Light</option>
                    </select>
                    <a href="#" className="reset" onClick={handleReset}>Reset</a>

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
                    <a href="#" className="reset" onClick={handleReset}>Reset</a>

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
                    <a href="#" className="reset" onClick={handleReset}>Reset</a>
                </div>
            </div>
        </>
    );
}

export default BasePage;
