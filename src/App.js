import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';
import Canvas from './component/Canvas';
import Videos from './component/Videos';
import { CookiesProvider, Cookies } from 'react-cookie';
class App extends Component {

  constructor(){
    super();
    this.state = {
      playPause:'pause-btn',
      paused: false
    };
  }

  playPause(e){
    if (e) e.preventDefault();

    if (this.state.playPause === 'pause-btn'){
      this.setState({
        playPause: 'play-btn',
        paused: true
      });
      this.refs.canvas.handlePause(null, true);
      console.log('pause');
    } else {
      this.setState({
        playPause: 'pause-btn',
        paused: false
      });
      this.refs.canvas.handlePause(null, false);
    }
  }

  render() {
    return (
      <div className="App">
        <div id="pause-container">
          <div data-grid="container" >
            <div data-grid="col-12 pad-6x">
              <a href="#pause" className={"c-glyph x-hidden-focus playpause-btn " + this.state.playPause} ref="pauseBtn" onClick={this.playPause.bind(this)}>{this.state.playPause}</a>
            </div>
            <div data-grid="col-12 pad-6x">
              <p className="c-subheading-1">how will you survive?</p>
            </div>
          </div>
        </div>
        <Canvas ref="canvas"></Canvas>
        <CookiesProvider >
          <Videos cookies={new Cookies(document.cookies)} parent={this}></Videos>
        </CookiesProvider>
      </div>
    );
  }
}

export default App;
