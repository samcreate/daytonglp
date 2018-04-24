
import React, { Component } from 'react';
//import logo from './logo.svg';
import './Videos.css';
import '../../node_modules/video-react/dist/video-react.css';
import { instanceOf } from 'prop-types';
import {Cookies } from 'react-cookie';
import VideoPlayer from './VideoPlayer';
import MobileDetect from 'mobile-detect';
class Videos extends Component {

    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };

   
    constructor(props) {
        super(props);
        this.md = new MobileDetect(window.navigator.userAgent);
        this.state = {
            visible: false,
            videoKey: 'coach',
        }
    }


    handleVideo(vid, e){
       
        if (e) e.preventDefault();

       this.setState({
           visible: true,
           videoKey: vid
       });
        
    }


    closeVideo(e){
        
        this.setState({
            visible: false
        });
        this.refs.VideoPlayer.closeVideo(true);
    }

    stopBodyScrolling(bool) {
        if (bool === true) {
            var vpH = window.innerHeight;
            document.documentElement.style.height = vpH.toString() + "px";
            document.body.style.height = vpH.toString() + "px";
            document.body.style.overflowY = "hidden";
            document.body.style.touchAction = "none";
            document.documentElement.style.overflowY = "hidden";
            document.documentElement.style.touchAction = "none";
        } else {
            document.body.style.overflowY = "auto";
            document.documentElement.style.overflowY = "auto";
            document.documentElement.style.touchAction = "auto"
            document.body.style.touchAction = "auto";
        }
    }

    // componentDidMount() {
    //     if (this.md.mobile()) {
           
    //         this.refs.videoComponent.style.height = window.innerHeight+'px';
    //         this.refs.videoComponent.style.overflowY = "auto";
    //     }
    // }

    render() {

        return (
           
            <div data-grid="container" role="main" className="videos">
                <section data-grid="col-12" className="videoHolder">
                    <div ref="videoComponent" className="videoComponent" data-grid="col-11">
                        <VideoPlayer ref="VideoPlayer" parent={this} cookies={this.props.cookies} videoKey={this.state.videoKey} visible={this.state.visible}>
                        </VideoPlayer>
                    </div>
                    <div onClick={this.closeVideo.bind(this)} className={this.state.visible ? 'visible modal' : 'hidden modal'}>&nbsp;</div>
                </section>
                <div data-grid="col-12" >
                    <p className="c-subheading-1" >Watch their stories. Decide for yourself. </p>
                </div>
                <section data-grid="col-12 ">
                    <div data-grid="col-6 pad-3x" className="videoThumb coach ">
                        <a href="#playCoach" tabIndex="0" role="listitem" aria-labelledby="Play Coach Video Series" onClick={this.handleVideo.bind(this, 'coach')}>
                            <div className='rectangle-box'>
                                <div className='rectangle-content'>
                                    <div>
                                        <span className="c-glyph context-glyph-tile"></span>
                                    </div>
                                </div>
                            </div>
                        </a>
                    </div>
                    <div data-grid="col-6 pad-3x" className="videoThumb nurse">
                        <a href="#playNuse" tabIndex="0" role="listitem" aria-labelledby="Play Nurse Video Series" onClick={this.handleVideo.bind(this, 'nurse')}>
                            <div className='rectangle-box'>
                                <div className='rectangle-content'>
                                    <div>
                                        <span className="c-glyph context-glyph-tile"></span>
                                    </div>
                                </div>
                            </div>
                        </a>
                    </div>
                </section>
            </div>
        );
    }
}

export default Videos;
