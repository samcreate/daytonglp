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
            optionsIndex:NaN,
            coach: {
                end:{
                    copy: 'Your choices determined coach\'s fate. Now watch the nurse\'s story.',
                    key:'nurse' 
                },
                mainVideo: {
                    played: false,
                    title: 'Coach',
                    video: {
                        lastPlayTime: 0,
                        src: 'video/coach/1/main.mp4',
                        button: 'Be Pragmatic',
                        vtt: [
                            { kind: 'subtitles', src: 'video/coach/1/vtt/sintel-en.vtt', srcLang: 'en', default: true },
                            { kind: 'subtitles', src: 'video/coach/1/vtt/sintel-es.vtt', srcLang: 'es' },
                            { kind: 'subtitles', src: 'video/coach/1/vtt/sintel-de.vtt', srcLang: 'de' }
                        ]
                    }
                },
                options: {
                    copy: 'Coach is Infected. If he turns he endagners everyone. What do you do?',
                    content: [
                        {
                            played: false,
                            title: 'Coach : Pragmatic',
                            video: {
                                lastPlayTime: 0,
                                src: 'video/coach/3/pragmatic.mp4',
                                button: 'Be Pragmatic',
                                copy: 'You chose pragmatic and sacrificed coach. What if you had been compassionate?',
                                vtt: [
                                    { kind: 'subtitles', src: 'video/coach/3/vtt/sintel-en.vtt', srcLang: 'en', default: true },
                                    { kind: 'subtitles', src: 'video/coach/3/vtt/sintel-es.vtt', srcLang: 'es' },
                                    { kind: 'subtitles', src: 'video/coach/3/vtt/sintel-de.vtt', srcLang: 'de' }
                                ]
                            }
                        },
                        {
                            played: false,
                            title: 'Coach : Compassionate',
                            video: {
                                lastPlayTime: 0,
                                src: 'video/coach/2/compassion.mp4',
                                button: 'Be Compassionate',
                                copy: 'You chose compassion and saved coach. What if you had been pragmatic?',
                                vtt: [
                                    { kind: 'subtitles', src: 'video/coach/2/vtt/sintel-en.vtt', srcLang: 'en', default: true },
                                    { kind: 'subtitles', src: 'video/coach/2/vtt/sintel-es.vtt', srcLang: 'es' },
                                    { kind: 'subtitles', src: 'video/coach/2/vtt/sintel-de.vtt', srcLang: 'de' }
                                ]
                            }
                        }
                    ]
                }
            },
            nurse: {
                end: {
                    copy: 'Your choices determined Nurse\'s fate. Now watch the coach\'s story.',
                    key: 'coach'
                },
                mainVideo: {
                    played: false,
                    title: 'Nurse',
                    video: {
                        lastPlayTime: 0,
                        src: 'video/nurse/1/main.mp4',
                        vtt: [
                            { kind: 'subtitles', src: 'video/coach/1/vtt/sintel-en.vtt', srcLang: 'en', default: true },
                            { kind: 'subtitles', src: 'video/coach/1/vtt/sintel-es.vtt', srcLang: 'es' },
                            { kind: 'subtitles', src: 'video/coach/1/vtt/sintel-de.vtt', srcLang: 'de' }
                        ]
                    }
                },
                options: {
                    copy: 'NURSE\'S CAMP HAS BEEN RAIDED. SHE MUST ACT TO SAVE HER COMMUNITY. what do you do?',
                    content: [
                        {
                            played: false,
                            title: 'Nurse : BE DARING',
                            video: {
                                lastPlayTime: 0,
                                src: 'video/nurse/2/daring.mp4',
                                button: 'BE DARING',
                                copy: 'You chose TO BE DARING and THE NURSE LOST HER LIFE. What if you had been PRUDENT?',
                                vtt: [
                                    { kind: 'subtitles', src: 'video/coach/1/vtt/sintel-en.vtt', srcLang: 'en', default: true },
                                    { kind: 'subtitles', src: 'video/coach/1/vtt/sintel-es.vtt', srcLang: 'es' },
                                    { kind: 'subtitles', src: 'video/coach/1/vtt/sintel-de.vtt', srcLang: 'de' }
                                ]
                            }
                        },
                        {
                            played: false,
                            title: 'Nurse : PRUDENT',
                            video: {
                                lastPlayTime: 0,
                                src: 'video/nurse/3/prudent.mp4',
                                button: 'Be PRUDENT',
                                copy: 'You chose to be prudent and joined another community. What if you had been daring?',
                                vtt: [
                                    { kind: 'subtitles', src: 'video/coach/1/vtt/sintel-en.vtt', srcLang: 'en', default: true },
                                    { kind: 'subtitles', src: 'video/coach/1/vtt/sintel-es.vtt', srcLang: 'es' },
                                    { kind: 'subtitles', src: 'video/coach/1/vtt/sintel-de.vtt', srcLang: 'de' }
                                ]
                            }
                        }
                    ]
                }
            }
        }
     
    }

    handleStateChange(state, test) {
        //console.log('VIDEO PLAYBACK TIME', state.currentTime);
        if (state.ended && this.eventTrigger === false) {
            //console.log('VIDEO ENDED');
            this.eventTrigger = true;
            this.handleVideoEnd();
        } else if(this.eventTrigger === false){
            this.setStatesPlaybackTime(state.currentTime);
        }

    }

    handleVideoEnd(){
        let { content, id } = this.getVideoState(this.props.videoKey);
        content.played = true;
        this.refs.player.pause();
        this.setVideoState(content, id);
        this.refs.videoOverlay.style.display = 'block';
        setTimeout(() => {
            this.refs.videoOverlay.style.opacity = '1';
        }, 100);
        
    }

    setStatesPlaybackTime(time) {
        let { content, id } = this.getVideoState(this.props.videoKey);
        content.video.lastPlayTime = time;
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
            if (!video.played && index !== this.state.optionsIndex){
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
        
        if (!isNaN(id)){
            // eslint-disable-next-line
            this.state[this.props.videoKey].options.content[id] = content;
            
        }
    }

    getVideoState(key){

        //get video set. Nurser or coach
        let videoSet = this.state[key];
        let options = this.getOptions(key);
        //check if main video has been played
        //console.log(key, videoSet.mainVideo.played, 'isNaN(this.state.optionsIndex): ', isNaN(this.state.optionsIndex));
        if (!videoSet.mainVideo.played || isNaN(this.state.optionsIndex) ){
            return { content: videoSet.mainVideo, id: 'mainVideo', options, optionsCopy: videoSet.options.copy, autoPlay: true };
        } else{
            //console.log('get video state: ', this.props.videoKey, this.state.optionsIndex)
            // eslint-disable-next-line
           return { 
                content: this.state[this.props.videoKey].options.content[this.state.optionsIndex],
                id: 0, 
                options, 
                optionsCopy: this.state[this.props.videoKey].options.content[this.state.optionsIndex].video.copy,
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
        console.log(arguments);
        if (e) e.preventDefault();
        //console.log('nextVideo', index)
        // eslint-disable-next-line
        this.state.optionsIndex = index;
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
        // eslint-disable-next-line
        this.state.optionsIndex = NaN;
        this.props.parent.handleVideo(key);
        this.eventTrigger = false;
        this.hideOverlay();
         
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
        //console.log('render: -->',{ content, options, optionsCopy});
        
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
            if(this.state.optionsIndex === 0){
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
                            < a href={'#' + options[0].video.button} onClick={this.nextVideo.bind(this, 1)} aria-labelledby={options[0].video.button}>{options[0].video.button} </a>
                        </div>
                    </div>
                );

            } else {
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
                            < a href={'#' + options[0].video.button} onClick={this.nextVideo.bind(this, 1)} aria-labelledby={options[0].video.button}>{options[0].video.button} </a>
                        </div>
                    </div>
                );
            }
            
        } else if (options.length === 2){
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
                        < a href={'#' + options[0].video.button} onClick={this.nextVideo.bind(this, 0)} aria-labelledby={options[0].video.button}>{options[0].video.button} </a>
                    </div>
                    <div data-grid="col-2">
                        <p className="or">
                            -or-
                        </p>
                    </div>
                    <div data-grid="col-5">
                        < a href={'#' + options[1].video.button} onClick={this.nextVideo.bind(this, 1)} aria-labelledby={options[0].video.button}>{options[1].video.button} </a>
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
                    autoPlay={this.props.visible }>
                    <source src={content.video.src} type="video/mp4" />
                    <ControlBar autoHide={false} className="my-class">
                        <VolumeMenuButton order={1.1} vertical={true} />
                        <CurrentTimeDisplay order={4.1} />
                        <TimeDivider order={4.2} />
                        <CCButton className="cc-button" order={7.1} parent={this} />
                    </ControlBar>
                    <track label="English" kind="subtitles" srcLang="en" src={content.video.vtt[0].src} ref="engSub" />
                    <track label="Deutsch" kind="subtitles" srcLang="de" src={content.video.vtt[1].src} />
                    <track label="Español" kind="subtitles" srcLang="es" src={content.video.vtt[2].src} />
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
