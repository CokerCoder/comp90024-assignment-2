import React from 'react';
import { useHistory } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/App.css';
// import User from "../components/User/User";



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
        <h1>COMP90024 CCC Project-2</h1>
      </div>
      <div className="start-area">
        <h1>Group-11</h1>
        <Button variant="success" onClick={toMap}>
          Start explore
        </Button>
      </div>
    </>
  );
}

export default App;
