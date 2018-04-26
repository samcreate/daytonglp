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
                end: {
                    copy: "Your choices determined coach's fate. Now watch the nurse's story.",
                    key: "nurse"
                },
                mainVideo: {
                    played: !1,
                    title: "Coach",
                    video: {
                        lastPlayTime: 0,
                        src: "https://compass-ssl.xbox.com/assets/e7/d4/e7d450f9-5930-495f-bbb8-6b9bb2dc6860.mp4?n=main.mp4",
                        button: "Be Pragmatic",
                        vtt: [{
                            kind: "subtitles",
                            src: "https://compass-ssl.xbox.com/assets/ce/c0/cec0f5a8-90e7-4a88-84b8-6abb1eecc40d.vtt?n=sintel-en.vtt",
                            srcLang: "en",
                            default: !0
                        }, {
                            kind: "subtitles",
                            src: "https://compass-ssl.xbox.com/assets/72/17/7217d587-9b33-45d4-95db-5aafd399e086.vtt?n=sintel-es.vtt",
                            srcLang: "es"
                        }, {
                            kind: "subtitles",
                            src: "https://compass-ssl.xbox.com/assets/4a/12/4a12e9e7-c774-4353-8111-ab8f5257c06f.vtt?n=sintel-de.vtt",
                            srcLang: "de"
                        }]
                    }
                },
                options: {
                    copy: "Coach is Infected. If he turns he endangers everyone. What do you do?",
                    content: [{
                        played: !1,
                        title: "Coach : Pragmatic",
                        video: {
                            lastPlayTime: 0,
                            src: "https://compass-ssl.xbox.com/assets/64/b8/64b8ca5d-1616-474d-95de-5f1009050b7a.mp4?n=pragmatic.mp4",
                            button: "Be Pragmatic",
                            copy: "You chose pragmatic and sacrificed coach. What if you had been compassionate?",
                            vtt: [{
                                kind: "subtitles",
                                src: "https://compass-ssl.xbox.com/assets/59/86/5986decc-1186-40a4-8f7e-662360a3b2e4.vtt?n=coach3sintel-en.vtt",
                                srcLang: "en",
                                default: !0
                            }, {
                                kind: "subtitles",
                                src: "https://compass-ssl.xbox.com/assets/0d/99/0d99505a-e137-425f-bc65-823ad5547371.vtt?n=coach3sintel-es.vtt",
                                srcLang: "es"
                            }, {
                                kind: "subtitles",
                                src: "https://compass-ssl.xbox.com/assets/ce/db/cedb510d-538e-4de2-b70a-ab8a8f5af3c7.vtt?n=coach3sintel-de.vtt",
                                srcLang: "de"
                            }]
                        }
                    }, {
                        played: !1,
                        title: "Coach : Compassionate",
                        video: {
                            lastPlayTime: 0,
                            src: "https://compass-ssl.xbox.com/assets/2d/f6/2df64d39-6fcc-486e-96cd-97f6fd2784fa.mp4?n=compassion.mp4",
                            button: "Be Compassionate",
                            copy: "You chose compassion and saved coach. What if you had been pragmatic?",
                            vtt: [{
                                kind: "subtitles",
                                src: "https://compass-ssl.xbox.com/assets/ae/f5/aef577ba-fc91-46fe-8326-fa046a1a67bc.vtt?n=coach2sintel-en.vtt",
                                srcLang: "en",
                                default: !0
                            }, {
                                kind: "subtitles",
                                src: "https://compass-ssl.xbox.com/assets/24/23/242375a1-1c3c-4820-9f8d-a3cee31b7d35.vtt?n=coach2sintel-es.vtt",
                                srcLang: "es"
                            }, {
                                kind: "subtitles",
                                src: "https://compass-ssl.xbox.com/assets/d5/07/d5076245-5198-4849-8a67-08db513e145b.vtt?n=coach2sintel-de.vtt",
                                srcLang: "de"
                            }]
                        }
                    }]
                }
            },
            nurse: {
                end: {
                    copy: "Your choices determined Nurse's fate. Now watch the coach's story.",
                    key: "coach"
                },
                mainVideo: {
                    played: !1,
                    title: "Nurse",
                    video: {
                        lastPlayTime: 0,
                        src: "https://compass-ssl.xbox.com/assets/8d/47/8d479b06-34fd-4c8c-a59f-bbb956bf66d8.mp4?n=nursemain.mp4",
                        vtt: [{
                            kind: "subtitles",
                            src: "https://compass-ssl.xbox.com/assets/36/02/3602b1cb-531f-4c6c-b149-3737116c3a6f.vtt?n=nurse1sintel-en.vtt",
                            srcLang: "en",
                            default: !0
                        }, {
                            kind: "subtitles",
                            src: "https://compass-ssl.xbox.com/assets/d6/1e/d61e5d05-0583-4b5c-a88d-71db30679bb7.vtt?n=nurse1sintel-es.vtt",
                            srcLang: "es"
                        }, {
                            kind: "subtitles",
                            src: "https://compass-ssl.xbox.com/assets/b1/de/b1ded8da-c149-4d90-b677-62a7db2e61eb.vtt?n=nurse1sintel-de.vtt",
                            srcLang: "de"
                        }]
                    }
                },
                options: {
                    copy: "NURSE'S CAMP HAS BEEN RAIDED. SHE MUST ACT TO SAVE HER COMMUNITY. what do you do?",
                    content: [{
                        played: !1,
                        title: "Nurse : BE DARING",
                        video: {
                            lastPlayTime: 0,
                            src: "https://compass-ssl.xbox.com/assets/26/58/265830d9-77c2-458b-aa78-b44d62994507.mp4?n=daring.mp4",
                            button: "BE DARING",
                            copy: "You chose TO BE DARING and THE NURSE LOST HER LIFE. What if you had been PRUDENT?",
                            vtt: [{
                                kind: "subtitles",
                                src: "https://compass-ssl.xbox.com/assets/5a/a2/5aa2bf10-be40-4b25-b5a6-a62093a18015.vtt?n=nurse2sintel-en.vtt",
                                srcLang: "en",
                                default: !0
                            }, {
                                kind: "subtitles",
                                src: "https://compass-ssl.xbox.com/assets/e8/43/e843ad9f-00aa-4b4b-8c57-50db84938892.vtt?n=nurse2sintel-es.vtt",
                                srcLang: "es"
                            }, {
                                kind: "subtitles",
                                src: "https://compass-ssl.xbox.com/assets/50/2f/502fd080-3285-4d8f-9e28-3bea61472dd3.vtt?n=nurse2sintel-de.vtt",
                                srcLang: "de"
                            }]
                        }
                    }, {
                        played: !1,
                        title: "Nurse : PRUDENT",
                        video: {
                            lastPlayTime: 0,
                            src: "https://compass-ssl.xbox.com/assets/8d/de/8ddea03b-40d9-4f8a-a430-ead8107ea753.mp4?n=prudent.mp4",
                            button: "Be PRUDENT",
                            copy: "You chose to be prudent and joined another community. What if you had been daring?",
                            vtt: [{
                                kind: "subtitles",
                                src: "https://compass-ssl.xbox.com/assets/84/8c/848c9939-bbb2-428f-afaf-b1c64f0dd1fb.vtt?n=nurse3sintel-en.vtt",
                                srcLang: "en",
                                default: !0
                            }, {
                                kind: "subtitles",
                                src: "https://compass-ssl.xbox.com/assets/82/ec/82ec5b0a-0a2e-4b57-ad77-781acc00b9b2.vtt?n=nurse3sintel-es.vtt",
                                srcLang: "es"
                            }, {
                                kind: "subtitles",
                                src: "https://compass-ssl.xbox.com/assets/34/4d/344d22c9-900e-4145-8f4b-7e9d06e01b0e.vtt?n=nurse3sintel-de.vtt",
                                srcLang: "de"
                            }]
                        }
                    }]
                }
            }
        }
     
    }

    handleStateChange(state, test) {
        //console.log('VIDEO PLAYBACK TIME', state);
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
                    crossOrigin="anonymous"
                    autoPlay={this.props.visible }
                    >
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
