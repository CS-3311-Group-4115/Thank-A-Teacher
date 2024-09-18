import { useNavigate } from 'react-router-dom';
import React, { useState } from "react";
import "./basepage.css";
import homeIcon from './Assets/Vector.png' 


function BasePage(){
    const navigate = useNavigate();
    const [textSize, setTextSize] = useState(0);
    const increaseTextSize = () => {
        setTextSize(textSize + 1);
    };
    const decreaseTextSize = () => {
        setTextSize(textSize - 1);
    };
    return (
        <><div class="blue-section">
            <p>3 of 3: Edit Card</p>
            <button onClick={() => navigate('/')}>
                 <img src={homeIcon} alt="Home" />
            </button>
        </div><div class="container">
                {/* <!-- Card Preview Section (Without the Thank You text) --> */}
                <div class="card-preview">
                    {/* <!-- Card content can be inserted here if needed in the future --> */}
                </div>

                {/* <!-- Message Box Section --> */}
                <div class="message-box-container">
                    <label for="message">Add a Message</label>
                    <textarea id="message" placeholder="Enter your message here"></textarea>
                    <div class="controls">
                        <button onClick={decreaseTextSize}> - </button>
                        <button onClick={increaseTextSize}> + </button>
                        <p> {textSize + 20} </p> {/* should be changed when actual text size is implemented on card*/}
                    </div>
                    <div class="controls">
                        <button onClick={() => navigate('/search')} href="#" class="back-button">&larr;</button>
                        <button class="send-button">Send Card</button>
                    </div>
                </div>
            </div></>
    );
}
export default BasePage;