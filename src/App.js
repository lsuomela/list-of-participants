import React, { Component } from 'react';
import Table from './Table';
import './css/App.css';

class App extends Component {
  
  render() {
    return (
      <div className="App">
        <header className="App-header">
            <img src="/logo.png" alt="Nord software"/> 
            <span>Nord Software</span>
        </header>
        <div className="table">
          <h2>
            List of participants
          </h2>
          <Table/>
        </div>
      </div>
    );
  }
}

export default App;
