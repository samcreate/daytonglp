import './Canvas.css';
import React, { Component } from 'react';
import * as PIXI from 'pixi.js'
import Smoke from './Smoke';
import {  Linear, Sine, TimelineLite } from "gsap";
import Gallery from './Gallery';
import MobileDetect from 'mobile-detect';
import gradient from './gradient';
import PlayPause from './PlayPause';
export default class Canvas extends Component {

    /**
    * Define our prop types
    **/
    // static propTypes = {
    //     zoomLevel: PropTypes.number.isRequired
    // };

    constructor(props) {
        super(props);

        this.state = {
            width: 0,
            height: 705,
            transitionTImeIn: 5,
            transitionTimeOut:2
        };

        this.md = new MobileDetect(window.navigator.userAgent);

        this.timeline = new TimelineLite({ paused: true, onComplete: this.transitionComplete.bind(this)});
    }

    /**
    * In this case, componentDidMount is used to grab the canvas container ref, and 
    * and hook up the PixiJS renderer
    **/
    componentDidMount() {

        //handle window resize
        window.addEventListener('resize', this.updateDimensions.bind(this));
        
        //Setup PIXI Canvas in componentDidMount
        this.app = new PIXI.autoDetectRenderer(this.state.width, this.state.height, { backgroundColor: 0x000000 });
        this.app.autoResize = true;
        this.app.plugins.interaction.autoPreventDefault = false;
        this.refs.Smoke.appendChild(this.app.view);
        this.mainLayer = new PIXI.Container();

        //console.log('this.app', this.app.plugins.interaction.autoPreventDefault);

        this.survive_txt = PIXI.Sprite.fromImage(window.hwy_survive);
        this.survive_mobile_txt = PIXI.Sprite.fromImage(window.hwy_survive_mobile);
        this.smokeCoverUp = new PIXI.Container();
        this.smokeCoverUp.y = 0;

        // this.blackOut = new PIXI.Graphics();
        // this.blackOut.beginFill(0x000000);
        // this.blackOut.drawRect(0, 0, window.innerWidth, 800);
        // this.blackOut.alpha = 0;

        this.playPause = new PlayPause();

        let gradientTexture = PIXI.Texture.fromImage(gradient);
       
        this.blackOut = new PIXI.extras.TilingSprite(
            gradientTexture,
            (this.app.width*10),
            526
        );
        this.blackOut.alpha = 0;
        this.blackOut.y =180;
        window.blackout = gradientTexture;
        this.setupSmoke();
        this.setupGallery().next();
        this.updateDimensions();
        this.setupTimeline();
        this.mainLayer.addChild(this.playPause.view);
        this.mainLayer.addChild(this.blackOut);
        
        this.playPause.view.x = window.innerWidth - 30;
        this.playPause.view.y = 520;
        this.playPause.on('paused', this.handlePause.bind(this));
        this.paused = false;
        
    }

    handlePause(btn, paused){
        this.paused = paused;

    
        this.gallery.pause(paused);
        this.smoke.pause(paused);
    }

    setupSmoke(){
        this.smoke = new Smoke(this.app, this.mainLayer);
        this.smoke.view.y = 0;
        let topSmokeTexture = PIXI.Texture.fromImage(window.top_smoke);
        this.topSmokeRight = new PIXI.extras.TilingSprite(
            topSmokeTexture,
            this.app.width,
            398
        );
        this.topSmokeLeft = new PIXI.extras.TilingSprite(
            topSmokeTexture,
            this.app.width,
            398
        );
        this.topSmokeMid = new PIXI.extras.TilingSprite(
            topSmokeTexture,
            this.app.width,
            398
        );
        this.topSmokeRight.alpha = 0;
        this.topSmokeLeft.alpha = 0;
        this.topSmokeMid.alpha = 0;
        this.topSmokeLeft.y = -10;
        this.topSmokeMid.y = -10;
        this.topSmokeRight.y = -40;
        this.topSmokeLeft.blendMode = PIXI.BLEND_MODES.DARKEN;
        this.topSmokeLeft.tilePosition.x = this.state.width / 2;
        this.topSmokeMid.tilePosition.x -= this.state.width / 2;

        if (!this.md.is('iPhone')){
            this.mainLayer.addChild(this.smoke.view);
        }
        this.smokeCoverUp.addChild(this.topSmokeRight);
        this.smokeCoverUp.addChild(this.topSmokeLeft);
        this.smokeCoverUp.addChild(this.topSmokeMid);
        this.mainLayer.addChild(this.smokeCoverUp);
        this.animation();

        
            //     this.smokeShader.uniforms.time.value = 4.878;
       
    }

    setupTimeline(){
        this.timeline
            .to(this.topSmokeRight, 1.1, { alpha: 1, ease: Linear.easeNone }, 'whiteout')
            .to(this.topSmokeLeft, 1.1, { alpha: 1, ease: Linear.easeNone }, 'whiteout')
            .to(this.topSmokeMid, 1.1, { alpha: 1, ease: Linear.easeNone }, 'whiteout')
            .to(this.gallery.view, this.state.transitionTImeIn, { alpha: 0.6, ease: Sine.easeInOut }, 'whiteout')
            .to(this.blackOut, this.state.transitionTImeIn, { alpha: 0.6, ease: Sine.easeInOut }, 'whiteout')
            .to(this.smoke.smokeShader.uniforms.brightness, this.state.transitionTImeIn, { value: 6, ease: Sine.easeInOut }, 'whiteout')
            .to(this.smoke.smokeShader.uniforms.whiteness, this.state.transitionTImeIn, { value: 1.1, ease: Sine.easeInOut }, 'whiteout');
        
        window.timeline = this.timeline;
    }


    setupGallery(){
        this.gallery = new Gallery([
            { img: window.img_one, txt: window.img_txt_one, y: 200, color: { r:91.0, g:101.0, b:107.0} }, 
            { img: window.img_two, txt: window.img_txt_two, y: 200, color: { r: 94.0, g: 96.0, b: 87.0 }  },
            { img: window.img_three, txt: window.img_txt_three, y: 200, color: { r: 80.0, g: 83.0, b: 67.0 } },
            { img: window.img_four, txt: window.img_txt_four, y: 200, color: { r: 91.0, g: 101.0, b: 107.0 } }
        ]);
        this.gallery.view.y = 150;
        this.gallery.on('startTransition', this.startTransition.bind(this));
        this.gallery.on('slideStart', this.slideStart.bind(this));
        
        this.mainLayer.addChild(this.gallery.view);

        

        this.mainLayer.addChild(this.survive_txt);
        this.mainLayer.addChild(this.survive_mobile_txt)
        this.survive_txt.blendMode = PIXI.BLEND_MODES.SCREEN;
        this.survive_txt.anchor.set(0.5, 0);
        this.survive_txt.y = this.state.height - 80;
        this.survive_txt.x = window.innerWidth / 2;
        this.survive_mobile_txt.blendMode = PIXI.BLEND_MODES.SCREEN;
        this.survive_mobile_txt.anchor.set(0.5, 0);
        this.survive_mobile_txt.y = this.state.height - 105;
        this.survive_mobile_txt.x = window.innerWidth / 2;
  
        return this.gallery;
    }


    slideStart(slide) {
       setTimeout(() => {
           this.smoke.smokeShader.uniforms.transr.value = slide.smokeColor.r;
           this.smoke.smokeShader.uniforms.transg.value = slide.smokeColor.g;
           this.smoke.smokeShader.uniforms.transb.value = slide.smokeColor.b;
       }, 1500);
    }

    startTransition() {
        this.timeline.play().timeScale(2.5);

    }

    transitionComplete(){
        this.gallery.next();
        this.timeline.reverse(5);
    }

    animation(delta){
        // if (this.paused) return false;
        requestAnimationFrame(this.animation.bind(this));
        if(!this.paused){
            this.topSmokeRight.tilePosition.x += 2.1;
            this.topSmokeLeft.tilePosition.x -= 0.4;
            this.topSmokeMid.tilePosition.x += 1.4;
        }
        
        this.app.render(this.mainLayer);
    }

    /**
    * Updates the width of our canvas
    * 
    **/
    updateDimensions() {
        let temp_width = window.innerWidth;
        this.setState({ width: temp_width });
        
        if (this.app){
            this.playPause.view.x = temp_width

            this.app.resize(this.state.width, this.state.height);
            this.survive_txt.x = window.innerWidth / 2;
         
            if (window.innerWidth < 1030) {
                this.survive_mobile_txt.alpha = 1;
                this.survive_txt.alpha = 0;
            } else {
                this.survive_mobile_txt.alpha = 0;
                this.survive_txt.alpha = 1;
            }
            this.survive_mobile_txt.x = window.innerWidth / 2;
            this.survive_txt.x = window.innerWidth / 2;
       
        }
        if(this.smoke){
            this.smoke.updateWidth(temp_width);
        }
       // console.log()
    }

    componentWillMount() {
        this.updateDimensions();
    }
    /**
    * Render our container that will store our PixiJS game canvas. Store the ref
    **/
    render() {
        return (
            <div className="Smoker" ref="Smoke">
            </div>
        );
    }
}