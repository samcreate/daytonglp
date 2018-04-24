import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';
import Canvas from './component/Canvas';
import Videos from './component/Videos';
import { CookiesProvider, Cookies } from 'react-cookie';
class App extends Component {

  render() {
    return (
      <div className="App">
        <Canvas></Canvas>
        <CookiesProvider >
          <Videos cookies={new Cookies(document.cookies)}></Videos>
        </CookiesProvider>
      </div>
    );
  }
}

export default App;
