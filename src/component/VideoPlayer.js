import React, { Component } from 'react';
import {Player, ControlBar, CurrentTimeDisplay, TimeDivider, VolumeMenuButton } from 'video-react';
import '../../node_modules/video-react/dist/video-react.css';
import {  Cookies } from 'react-cookie';
import { instanceOf, string, bool} from 'prop-types';
import _ from 'underscore';
import './VideoPlayer.css';
import MobileDetect from 'mobile-detect';
import CCButton from './CCButton';
export default class VideoPlayer extends Component {


    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };

    static propTypes = {
        videoKey: string
    };

    static propTypes = {
        visible: bool
    };

    constructor(props, context) {
        super(props, context);

        this.md = new MobileDetect(window.navigator.userAgent);

        this.eventTrigger = false;

        this.throttle = _.throttle(this.handleStateChange.bind(this), 500);

        this.state = {
            overlayVisible: false,
            optionsID:null,
            coach: {
                allPlayed: false,
                end: {
                    copy: "Your choices determined coach's fate. Now watch the nurse's story.",
                    key: "nurse"
                },
                mainVideo: {
                    played: false,
                    title: "Coach",
                    video: {
                        lastPlayTime: 0,
                        percentagePlayed: 0,
                        src: "https://compass-ssl.xbox.com/assets/e7/d4/e7d450f9-5930-495f-bbb8-6b9bb2dc6860.mp4?n=main.mp4",
                        button: "Be Pragmatic",
                        vtt: [{
                            kind: "subtitles",
                            src: "video/coach/1/vtt/coach1sintel-en.vtt",
                            srcLang: "en",
                            default: !0
                        }]
                    }
                },
                options: {
                    copy: "Coach is Infected. If he turns he endangers everyone. What do you do?",
                    content: [{
                        played: false,
                        title: "Coach : Pragmatic",
                        id:'pragmatic',
                        video: {
                            lastPlayTime: 0,
                            percentagePlayed: 0,
                            src: "https://compass-ssl.xbox.com/assets/64/b8/64b8ca5d-1616-474d-95de-5f1009050b7a.mp4?n=pragmatic.mp4",
                            button: "Be Pragmatic",
                            copy: "You chose pragmatic and sacrificed coach. What if you had been compassionate?",
                            vtt: [{
                                kind: "subtitles",
                                src: "video/coach/3/vtt/coach3sintel-en.vtt",
                                srcLang: "en",
                                default: true
                            }]
                        }
                    }, {
                        played: false,
                        title: "Coach : Compassionate",
                        id: 'compassionate',
                        video: {
                            lastPlayTime: 0,
                            percentagePlayed: 0,
                            src: "https://compass-ssl.xbox.com/assets/2d/f6/2df64d39-6fcc-486e-96cd-97f6fd2784fa.mp4?n=compassion.mp4",
                            button: "Be Compassionate",
                            copy: "You chose compassion and saved coach. What if you had been pragmatic?",
                            vtt: [{
                                kind: "subtitles",
                                src: "video/coach/2/vtt/coach2sintel-en.vtt",
                                srcLang: "en",
                                default: true
                            }]
                        }
                    }]
                }
            },
            nurse: {
                allPlayed: false,
                end: {
                    copy: "Your choices determined Nurse's fate. Now watch the coach's story.",
                    key: "coach"
                },
                mainVideo: {
                    played: false,
                    title: "Nurse",
                    video: {
                        lastPlayTime: 0,
                        percentagePlayed: 0,
                        src: "https://compass-ssl.xbox.com/assets/8d/47/8d479b06-34fd-4c8c-a59f-bbb956bf66d8.mp4?n=nursemain.mp4",
                        vtt: [{
                            kind: "subtitles",
                            src: "video/nurse/1/vtt/nurse1sintel-en.vtt",
                            srcLang: "en",
                            default: true
                        }]
                    }
                },
                options: {
                    copy: "NURSE'S CAMP HAS BEEN RAIDED. SHE MUST ACT TO SAVE HER COMMUNITY. what do you do?",
                    content: [{
                        played: false,
                        title: "Nurse : BE DARING",
                        id: 'daring',
                        video: {
                            lastPlayTime: 0,
                            percentagePlayed: 0,
                            src: "https://compass-ssl.xbox.com/assets/26/58/265830d9-77c2-458b-aa78-b44d62994507.mp4?n=daring.mp4",
                            button: "BE DARING",
                            copy: "You chose TO BE DARING and THE NURSE LOST HER LIFE. What if you had been PRUDENT?",
                            vtt: [{
                                kind: "subtitles",
                                src: "video/nurse/2/vtt/nurse2sintel-en.vtt",
                                srcLang: "en",
                                default: true
                            }]
                        }
                    }, {
                        played: false,
                        title: "Nurse : PRUDENT",
                        id: 'prudent',
                        video: {
                            lastPlayTime: 0,
                            percentagePlayed: 0,
                            src: "https://compass-ssl.xbox.com/assets/8d/de/8ddea03b-40d9-4f8a-a430-ead8107ea753.mp4?n=prudent.mp4",
                            button: "Be PRUDENT",
                            copy: "You chose to be prudent and joined another community. What if you had been daring?",
                            vtt: [{
                                kind: "subtitles",
                                src: "video/nurse/3/vtt/nurse3sintel-en.vtt",
                                srcLang: "en",
                                default: true
                            }]
                        }
                    }]
                }
            }
        };

        this.inital_state = this.state;
        window.state = this.state;
     
    }

    handleStateChange(state, test) {
       // console.log('VIDEO PLAYBACK TIME',);
        let percentage = Math.floor((state.currentTime / state.duration) * 100);
        if (state.ended && this.eventTrigger === false) {
            //console.log('VIDEO ENDED');
            this.eventTrigger = true;
            this.handleVideoEnd();
        } else if(this.eventTrigger === false){
            this.setStatesPlaybackTime(state.currentTime, percentage);
        }

    }

    handleVideoEnd(timeout = 100){
        let { content, id } = this.getVideoState(this.props.videoKey);
        content.played = true;
        this.refs.player.pause();
        this.setVideoState(content, id);
        this.refs.videoOverlay.style.display = 'block';
        setTimeout(() => {
            this.refs.videoOverlay.style.opacity = '1';
        }, timeout);
        
    }

    setStatesPlaybackTime(time, percentage) {
        let { content, id } = this.getVideoState(this.props.videoKey);
        content.video.lastPlayTime = time;
        content.video.percentagePlayed = percentage;
        this.setVideoState(content, id);
    }


    componentDidUpdate(prevProps, prevState) {
        if(this.props.visible){
            this.refs.player.load();
            //console.log('player loaded and played')
        }

        this.refs.player.subscribeToStateChange(this.throttle);
    }

    getOptions(key){
        let options = [];
        let vidState = this.state[key];
        vidState.options.content.forEach((video, index) => {
            ;
            if (!video.played && video.id !== this.state.optionsID){
                video.index = index;
                //console.log('getOptions() -> index: ', index, ', optionsID: ', this.state.optionsID)
                options.push(video);
            } 
        });
        return options;
    }

    setVideoState(content, id){

        if (id === 'mainVideo'){
            // console.log('videoSet.mainVideo', content)
            // eslint-disable-next-line
            this.state[this.props.videoKey].mainVideo = content;
        }
        
        if (this.state.optionsID !== null ){
            // eslint-disable-next-line
            this.state[this.props.videoKey].options.content[id] = content;
            
        }
    }

    getVideoState(key){

        //get video set. Nurser or coach
        let videoSet = this.state[key];
        let options = this.getOptions(key);
        //check if main video has been played
        //console.log(key, videoSet.mainVideo.played, 'isNaN(this.state.optionsID): ', isNaN(this.state.optionsID));
        if (!videoSet.mainVideo.played || this.state.optionsID === null ){
            return { content: videoSet.mainVideo, id: 'mainVideo', options, optionsCopy: videoSet.options.copy, autoPlay: true };
        } else{
            console.log('get video state: ', this.props.videoKey, this.state.optionsID)
            // eslint-disable-next-line
            let tmpContent;
            videoSet.options.content.forEach(element => {
                if (element.id === this.state.optionsID){
                    tmpContent = element
                }
            });
           return { 
                content: tmpContent,
                options,
                id: this.state.optionsID,
                optionsCopy: tmpContent.video.copy,
                autoPlay: true
            };
        }
    }

    closeVideo(comingFromParent){
        
        this.setState({
            visible: false
        });
        this.refs.player.pause();
        this.eventTrigger = false;
        if (comingFromParent !== true){
            this.props.parent.closeVideo();
            comingFromParent.preventDefault();
        }
    }

    nextVideo(index, e){
        if (e) e.preventDefault();
        console.log('nextVideo() -> index:', index)
        // eslint-disable-next-line
        this.state.optionsID = index;
        this.eventTrigger = false;
        this.hideOverlay();
        this.forceUpdate();
    }

    hideOverlay(){
        this.refs.videoOverlay.style.display = 'none';
        this.refs.videoOverlay.style.opacity = '0';
    }

    playOtherVideoSeries(key, e){
        e.preventDefault();
        if (this.state.coach.allPlayed && this.state.nurse.allPlayed){
            console.log('reset state')
            this.setState(this.inital_state);
        }
        // eslint-disable-next-line
        this.state.optionsID = null;
        this.props.parent.handleVideo(key);
        this.eventTrigger = false;
        this.hideOverlay();
        if(key === 'nurse'){
            // eslint-disable-next-line
            this.state.coach.allPlayed = true;
        }else{
            // eslint-disable-next-line
            this.state.nurse.allPlayed = true;
        }
         
    }

    componentDidMount() {
        if (this.md.mobile()) {

            this.refs.videoContainer.style.height = window.innerHeight + 'px';
            this.refs.videoContainer.style.overflowY = "auto";
        }
    }

    ccToggle(on){
        if(on){
            this.refs.player.video.video.textTracks[0].mode = "showing";
        } else {
            this.refs.player.video.video.textTracks[0].mode = "hidden";
        }
    }

    render() {


        let { content, options, optionsCopy} = this.getVideoState(this.props.videoKey);
        let optionsHtml;
        let autoPlay = this.props.visible;
        
        if (content.video.percentagePlayed !== 0 && content.video.percentagePlayed > 95){
            autoPlay = false;
            this.handleVideoEnd(1000);
        }
        
        console.log('render()-> options.length', options.length);
        console.log('render()-> content to play', content.title)
        if (options.length === 0){
            //no options, show other story 
            optionsHtml = (
                <div data-grid="col-12">
                    <div data-grid="col-12">
                        <div data-grid="col-3"></div>
                        <p data-grid="col-6">
                            {this.state[this.props.videoKey].end.copy}
                        </p>
                        <div data-grid="col-3"></div>
                    </div>
                    <div data-grid="col-3"></div>
                    <div data-grid="col-6 pad-3x" className={this.state[this.props.videoKey].end.key +' videoThumb'}>
                        <a onClick={this.playOtherVideoSeries.bind(this, this.state[this.props.videoKey].end.key)} href={"#play" + this.state[this.props.videoKey].end.key} tabIndex="0" role="listitem" aria-labelledby="Play Other Video Series" className="end" >
                            <div className='rectangle-box'>
                                <div className='rectangle-content'>
                                    <div>
                                        <span className="c-glyph context-glyph-tile"></span>
                                    </div>
                                </div>
                            </div>
                        </a>
                    </div>
                    <div data-grid="col-3"></div>
                </div>
            );
        } else if (options.length === 1) {
            console.log('render() -> this.state.optionsID', this.state.optionsID, options)
            //one option left
            optionsHtml = (
                <div data-grid="col-12">
                    <div data-grid="col-12">
                        <div data-grid="col-3"></div>
                        <p data-grid="col-6">
                            {optionsCopy}
                        </p>
                        <div data-grid="col-3"></div>
                    </div>
                    <div data-grid="col-12">
                        < a href={'#' + options[0].video.button} onClick={this.nextVideo.bind(this, options[0].id)} aria-labelledby={options[0].video.button}>{options[0].video.button} </a>
                    </div>
                </div>
            );
            
        } else if (options.length === 2){
            //alll options are on the table
            optionsHtml = (
                <div data-grid="col-12">
                    <div data-grid="col-12">
                        <div data-grid="col-3"></div>
                        <p data-grid="col-6">
                            {optionsCopy}
                        </p>
                        <div data-grid="col-3"></div>
                    </div>
                    <div data-grid="col-5">
                        < a href={'#' + options[0].video.button} onClick={this.nextVideo.bind(this, options[0].id)} aria-labelledby={options[0].video.button}>{options[0].video.button} </a>
                    </div>
                    <div data-grid="col-2">
                        <p className="or">
                            -or-
                        </p>
                    </div>
                    <div data-grid="col-5">
                        < a href={'#' + options[1].video.button} onClick={this.nextVideo.bind(this, options[1].id)} aria-labelledby={options[1].video.button}>{options[1].video.button} </a>
                    </div>
                </div>
            );
        }

        return (
            <div className={this.props.visible ? 'visible' : 'hidden'} ref="videoContainer">
                <h4 className="c-heading-4">{content.title}</h4>
                <a href="#closeVideo" className="closeButton c-glyph x-hidden-focus" onClick={this.closeVideo.bind(this)} aria-labelledby="Close Video Overlay">close video</a>
                <Player
                    playsInline={false}
                    startTime={content.video.lastPlayTime}
                    ref="player"
                    autoPlay={autoPlay}
                    >
                    <source src={content.video.src} type="video/mp4" />
                    <ControlBar autoHide={true} className="my-class">
                        <VolumeMenuButton order={1.1} vertical={true} />
                        <CurrentTimeDisplay order={4.1} />
                        <TimeDivider order={4.2} />
                        <CCButton className="cc-button" order={7.1} parent={this} />
                    </ControlBar>
                    <track label="English" kind="subtitles" srcLang="en" src={content.video.vtt[0].src} ref="engSub" />
                    <div id="vid-overlay" ref="videoOverlay" data-grid="container" style={{ display: 'none'}}>
                        <div data-grid="col-12 pad-6x" className="opt-content">
                            {optionsHtml}
                        </div>
                    </div>
                </Player>
            </div>
        );
    }
}
