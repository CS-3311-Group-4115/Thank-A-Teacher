import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './taInbox.css';
import { useNavigate } from 'react-router-dom';
import homeIcon from './Assets/Vector.png';
import { useUser } from './UserContext';

function TaInbox({ taId }) {
    // State for modal
    const [isModalVisible, setModalVisible] = useState(false);
    const [modalImageSrc, setModalImageSrc] = useState('');
    const [selectedCard, setSelectedCard] = useState(null);

    // State for filtering
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedColor, setSelectedColor] = useState('All');
    const [cards, setCards] = useState([]); // Store cards from DB
    const navigate = useNavigate();

    // List of colors for the color filter
    const colors = ['Red', 'Gold', 'Yellow', 'Green', 'Blue', 'Purple', 'Pink', 'Gray', 'Black', 'Brown'];

    // Context to get the current user's email
    const { userEmail } = useUser(); 
    console.log(userEmail);

    // Fetch cards for a specific TA from the database
    useEffect(() => {
        axios.get(`http://127.0.0.1:3001/cards/${userEmail}`)
            .then((response) => {
                setCards(response.data);
                console.log(cards);
            })
            .catch((error) => {
                console.error("Error fetching cards:", error);
            });
    }, [taId]);

    // Filter the cards based on the selected category and color
    const filteredCards = cards
        .filter(card => selectedCategory === 'All' || card.category === selectedCategory)
        .filter(card => selectedColor === 'All' || card.color === selectedColor);

    const handleImageClick = (imageUrl, card) => {
        setModalImageSrc(imageUrl);
        setModalVisible(true);
        setSelectedCard(card);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
    };

    const [sortOrder, setSortOrder] = useState('ascending'); // Default: ascending

    const sortedCards = sortOrder === 'ascending' 
        ? [...filteredCards] 
        : [...filteredCards].reverse();
    
    

    return (
        <div className="App">
            <div className="header">
                <div className="title">TA Thank You Cards</div>
                <div className="search">
                    <button onClick={() => navigate('/')}>
                        <img src={homeIcon} alt="Home" />
                    </button>
                </div>
            </div>

            <div className="main-contenti">
                {/* Filters Section */}
                <div className="filtersi">
                    {/* Sort by Date */}
                    <div className="sort-filter">
                        <label htmlFor="sortOrder" className="sort-label">Sort by Date: </label>
                        <select
                            id="sortOrder"
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                            className="custom-dropdown"
                        >
                            <option value="ascending">Oldest First</option>
                            <option value="descending">Newest First</option>
                        </select>
                    </div>


                    <div className="reseti-filters">
                        <button onClick={() => {
                            setSelectedCategory('All');
                            setSelectedColor('All');
                        }}>
                            Reset Filters
                        </button>
                    </div>
                </div>

                {/* Card Display Section */}
                <div className="cardi-display">
                    {sortedCards.map((card, index) => (
                        <div key={card._id || index} className="cardi">
                            <img 
                                src={card.data} 
                                alt={`Card ${index + 1}`} 
                                onClick={() => handleImageClick(card.data, card)} 
                                style={{ cursor: 'pointer' }}
                            />
                            <h3>{card.title}</h3>
                        </div>
                    ))}
                </div>


                {/* Modal for card image */}
                {isModalVisible && (
                    <div id="image-modal" className="image-modal">
                        <span className="close-modal" onClick={handleCloseModal}>&times;</span>
                        <img id="modal-image" className="modal-content" src={modalImageSrc} alt="" />
                    </div>
                )}
            </div>
        </div>
    );
}

export default TaInbox;
