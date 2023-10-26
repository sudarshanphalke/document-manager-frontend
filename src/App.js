import React from 'react';
import TablePostbox from "./TablePostbox";
import './App.css';
 
function App() {
  return (
    <div className="container">
      <div className="row">
        <div className="col-12 text-left mt-3">
          <h1>Postbox</h1>
        </div>
      </div>
      <div className="row mt-3">
        <div className="col-12">
          <ul className="nav nav-tabs">
            <li className="nav-item tab-inbox">
              <a className="nav-link active" href="#" onClick={() => console.log("")}>Inbox</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="row mt-3">
        <div className="col-12">
          <TablePostbox />
        </div>
      </div>
    </div>
  );
}
 
export default App;