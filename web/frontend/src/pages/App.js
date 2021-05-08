import React from 'react';
import { useHistory } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/App.css';
import uni_image from '../image/uni.png';
import mel_image from '../image/mel_black.png';



function App() { 
  let history = useHistory()

  const toMap = () => (
    history.push({
      pathname:"/map"
    })
  );

  return (
    <>
      <div className="project-name">
        <img src={uni_image} className="uni_image" />;
        <h1>COMP90024 CCC Project-2</h1>
      </div>
      <img src={mel_image} className="mel_image" />;
      <div className="start-area">
        <h2>Infrastructure VS Sentiment scores</h2>
        <h3>Presented by Group-26 </h3>
        <br></br>
        <Button variant="success" onClick={toMap}>
          Start explore
        </Button>
      </div>
    </>
  );
}

export default App;
