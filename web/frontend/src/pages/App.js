// COMP90024-Cluster and Cloud Computing Assignment 2
// Team Group 26

// Yunfei Jing (987784) jinyj@student.unimelb.edu.au
// Tianze Liu (987969) tianze@student.unimelb.edu.au
// Liang Min(981061) lmmin@student.unimelb.edu.au
// Youran Zhou(991504) youran@student.unimelb.edu.au
// Haoyuan Yu (988290) haoyuany@student.unimelb.edu.au

import React from "react";
import { useHistory } from "react-router-dom";
import { Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/App.css";
import uni_image from "../image/uni.svg";
import mel_image from "../image/mel_black.png";

function App() {
  let history = useHistory();

  const toMap = () =>
    history.push({
      pathname: "/map",
    });

  return (
    <>
      <div className="project-name">
        <a href="https://www.unimelb.edu.au/">
          <img src={uni_image} className="uni_image" />
        </a>
        <h1 />
        <h2>COMP90024</h2>
      </div>
      <img src={mel_image} className="mel_image" />
      <div className="start-area">
        <h2>Infrastructure VS Sentiment Scores</h2>
        <h3>Group-26</h3>
        <br></br>
        <Button type="primary" className="button-color-unimelb" onClick={toMap}>
          Start Explore
        </Button>
      </div>
    </>
  );
}

export default App;
