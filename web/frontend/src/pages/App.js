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
    <div className="App">
      <h1>COMP90024 CCC-P2</h1>
      <Button variant="secondary" onClick={toMap}>
          Start
      </Button>
      {/* <header className="App-header">
        <Map />
      </header> */}
    </div>
  );
}

export default App;
