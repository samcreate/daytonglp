import React, { Component } from 'react';
import { Player, ControlBar } from 'video-react';
import '../../node_modules/video-react/dist/video-react.css';
import {  Cookies } from 'react-cookie';
import { instanceOf } from 'prop-types';
import _ from 'underscore';
export default class VideoPlayer extends Component {


    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };

    constructor(props, context) {
        super(props, context);

        this.state = {
            video: {
                currentSrc:'',
                currentTime:0,
                startTime:0,
                vtt: [
                    { kind: 'subtitles', src: '', srcLang: 'en', default: true },
                    { kind: 'subtitles', src: '', srcLang: 'es' },
                    { kind: 'subtitles', src: '', srcLang: 'de' }
                ]
            },
            title: '',
            visible: false,
            currentKey: ''
        }

        this.state.coach = {
            currentIndex: 0,
            videos: [{
                url: '/video/coach/1/sintel-short.mp4',
                vtt: [
                    { kind: 'subtitles', src: '/video/coach/1/vtt/sintel-en.vtt', srcLang: 'en', default: true },
                    { kind: 'subtitles', src: '/video/coach/1/vtt/sintel-es.vtt', srcLang: 'es' },
                    { kind: 'subtitles', src: '/video/coach/1/vtt/sintel-de.vtt', srcLang: 'de' }
                ]
            }],
            lastVideoState: {}
        }

        this.eventTrigger = true;
        this.handleValueChange = this.handleValueChange.bind(this);
        this.updatePlayerInfo = this.updatePlayerInfo.bind(this);
        this.throttle = _.throttle(this.handleStateChange.bind(this), 100);
     
    }

    handleStateChange(state, test) {

        //console.log('arguments', state.ended, state);
       
        let key = this.state.title;
        let vtt = this.state[key].videos[this.state[key].currentIndex].vtt;
        
        this.state.video = state;
        this.state.video.vtt = vtt;
        let json_tmp = JSON.stringify(this.state);
        this.props.cookies.set(key, json_tmp, { path: '/' });

        if (state.ended && this.eventTrigger === true) {
            this.eventTrigger = false;
            this.updateIndex(key);
        }

    }


    updateIndex(key){
        let cookieState = this.props.cookies.get(key)[key];

        console.log('cookieState!!!!: ', cookieState.currentIndex, cookieState.videos.length);

        if (cookieState.currentIndex < (cookieState.videos.length -1) ){
            console.log('video index updated! ', cookieState.currentIndex);
        } else {
            console.log('no more videos');
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.playerSource !== prevState.playerSource) {
            this.refs.player.load();
        }
        
       this.refs.player.subscribeToStateChange(this.throttle);
    }

    handleValueChange(e) {
        
        var value = e.target.value;
        this.setState({
            [e.target.id]: value
        });
    }

    updatePlayerInfo() {
        this.setState({
            playerSource: this.state.inputVideoUrl
        });
    }

    loadVideo(key){

        //console.log('this.props.cookies.get(key)', ,key)
        let tmpVid = {};
        if (this.props.cookies.get(key)){
            //has video info
            let data = this.props.cookies.get(key);
            
            tmpVid = data;
            tmpVid.title = key;
            tmpVid.visible = true;
            tmpVid.video.vtt = this.state[key].videos[this.state[key].currentIndex].vtt;
            console.log('load from cookie', tmpVid.video.currentTime);
           // tmpVid[key].currentIndex = this.state[key].currentIndex + 1;
        }else{
            //load first video
            console.log('load first video')
            tmpVid.video = {};
            tmpVid.video.currentSrc = this.state[key].videos[this.state[key].currentIndex].url;
            tmpVid.video.vtt = this.state[key].videos[this.state[key].currentIndex].vtt;
            tmpVid.title = key;
            tmpVid.visible = true;


        }
        console.log('this.state.video.startTime', this.state.video.currentTime);
        this.setState(tmpVid);
        console.log('this.state.video.startTime', tmpVid);
        this.refs.player.load();
    }

    closeVideo(comingFromParent){
        this.setState({
            visible: false
        });
        this.refs.player.pause();
        if (comingFromParent !== true) this.props.parent.closeVideo();
    }


    render() {
        return (
            <div className={this.state.visible ? 'visible' : 'hidden'}>
                <h4 className="c-heading-4">{this.state.title}</h4>
                <a href="#closeVideo" className="closeButton c-glyph x-hidden-focus" onClick={this.closeVideo.bind(this)}>close video</a>
                
                <Player
                    fluid
                    startTime={this.state.video.currentTime}
                    ref="player"
                    autoPlay={this.state.visible}>
                    <source src={this.state.video.currentSrc} type="video/mp4" />
                    <ControlBar autoHide={true} className="my-class" />
                    <track label="English" kind="subtitles" srcLang="en" src={this.state.video.vtt[0].src} default />
                    <track label="Deutsch" kind="subtitles" srcLang="de" src={this.state.video.vtt[1].src} />
                    <track label="Español" kind="subtitles" srcLang="es" src={this.state.video.vtt[2].src} />
                </Player>
            </div>
        );
    }
}
