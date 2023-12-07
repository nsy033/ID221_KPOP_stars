import './App.css';
import Stars from './elements/Stars';
import background from "./images/gradient_background_2.png";
import title from "./images/title.png";
import description from "./images/description.png";
import React, { useState, useEffect } from 'react';

function App() {
    const [windowRatio, setRatio] = useState(window.innerWidth / window.innerHeight);
    const handleResize = () => {
        setRatio(window.innerWidth / window.innerHeight);
    };
    useEffect(() => {
        // add listener to window resize event
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, []);
    return (
        <div className="App"
            style={{
                backgroundImage: `url(${background})`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat"
            }}
            >
            <div
                className='title'
                top='0'
                style={{
                    width: '50vh',
                    height: '15vh',
                    position: 'absolute',
                    top: '8vh',
                    left: '6vh',
                    backgroundImage: `url(${title})`,
                    backgroundSize: "contain",
                    backgroundRepeat: "no-repeat"
                }}
            />
            <div>
            { windowRatio >= 1.7 ?
                <div
                    className='description'
                    top='0'
                    style={{
                        width: '30vh',
                        height: '45vh',
                        position: 'absolute',
                        bottom: '6vh',
                        right: '6vh',
                        backgroundImage: `url(${description})`,
                        backgroundSize: "contain",
                        backgroundRepeat: "no-repeat"
                    }}
                />
                : <div/>
            }
            </div>
            <Stars/>
        </div>
    );
}

export default App;
