import React from 'react';
import '../styles/App.css';
import LinkList from './LinkList';
import CreateLink from './CreateLink';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <CreateLink />
        {/* <LinkList /> */}
      </header>
    </div>
  );
}

export default App;
