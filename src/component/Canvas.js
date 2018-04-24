import './Canvas.css';
import React, { Component } from 'react';
import * as PIXI from 'pixi.js'
import Smoke from './Smoke';
import topSmoke from '../top_smoke.png';
import gallitem1_img from '../gallery/one.jpg';
import gallitem1_txt from '../gallery/one-txt.png';
import gallitem2_img from '../gallery/two.jpg';
import gallitem2_txt from '../gallery/two-txt.png';
import gallitem3_img from '../gallery/three.jpg';
import gallitem3_txt from '../gallery/three-txt.png';
import gallitem4_img from '../gallery/four.jpg';
import gallitem4_txt from '../gallery/four-txt.png';

import survive_txt from '../survive-txt.png';
import survive_mobile_txt from '../survive-mobile-txt.png';

import {  Linear, Sine, TimelineLite } from "gsap";
import Gallery from './Gallery';
import MobileDetect from 'mobile-detect';
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

        this.survive_txt = PIXI.Sprite.fromImage(survive_txt);
        this.survive_mobile_txt = PIXI.Sprite.fromImage(survive_mobile_txt);
        this.smokeCoverUp = new PIXI.Container();
        this.smokeCoverUp.y = 0;
        
        this.setupSmoke();
        this.setupGallery().next();
        this.updateDimensions();
    }

    setupSmoke(){
        this.smoke = new Smoke(this.app, this.mainLayer);
        this.smoke.view.y = 0;
        let topSmokeTexture = PIXI.Texture.fromImage(topSmoke);
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

        this.timeline
            .to(this.topSmokeRight, 1.1, { alpha: 1, ease: Linear.easeNone }, 'whiteout')
            .to(this.topSmokeLeft, 1.1, { alpha: 1, ease: Linear.easeNone }, 'whiteout')
            .to(this.topSmokeMid, 1.1, { alpha: 1, ease: Linear.easeNone }, 'whiteout')
            .to(this.smoke.smokeShader.uniforms.time, this.state.transitionTImeIn, { value: '+=0.875', ease: Sine.easeInOut }, 'whiteout')
            .to(this.smoke.smokeShader.uniforms.brightness, this.state.transitionTImeIn, { value: 7, ease: Sine.easeInOut }, 'whiteout')
            .to(this.smoke.smokeShader.uniforms.whiteness, this.state.transitionTImeIn, { value: 1.1, ease: Sine.easeInOut }, 'whiteout');

            window.timeline = this.timeline;
        
            //     this.smokeShader.uniforms.time.value = 4.878;
       
    }


    setupGallery(){
        this.gallery = new Gallery([
            { img: gallitem1_img, txt: gallitem1_txt, y: 200 }, 
            { img: gallitem2_img, txt: gallitem2_txt, y: 200 },
            { img: gallitem3_img, txt: gallitem3_txt, y: 200 },
            { img: gallitem4_img, txt: gallitem4_txt, y: 200 }
        ]);
        this.gallery.view.y = 150;
        this.gallery.on('startTransition', this.startTransition.bind(this));
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


    startTransition(){
        
        this.timeline.play().timeScale(2.5);
     
    }

    transitionComplete(){
        this.gallery.next();
        this.timeline.reverse(5);
    }

    animation(delta){
        requestAnimationFrame(this.animation.bind(this));
        this.topSmokeRight.tilePosition.x += 2.1;
        this.topSmokeLeft.tilePosition.x -= 0.4;
        this.topSmokeMid.tilePosition.x += 1.4;
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