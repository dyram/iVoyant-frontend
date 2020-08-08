import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import TableComp from "./Components/TableComponent"

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route
            crossorigin
            path="/"
            component={() => <TableComp />}
          />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
