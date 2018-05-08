import * as PIXI from 'pixi.js';
import { Sine, TimelineMax } from "gsap";
import EventEmitter from 'wolfy87-eventemitter'
export default class GalleryItem extends EventEmitter {

    constructor(gal) {
        super();

        
        this.smokeColor = gal.color;
        this.view = new PIXI.Container();
        this.image = PIXI.Sprite.fromImage(gal.img, true);
        this.text = PIXI.Sprite.fromImage(gal.txt, true);
        this.text.pos = { x: (window.innerWidth - (window.innerWidth * 0.80)) - (this.text.width - (this.text.width * 0.75)), y: gal.y};
        
        this.image.blendMode = PIXI.BLEND_MODES.SCREEN;
        this.image.anchor.set(0.5, 0);

        this.eventTriggered = false;

        this.mask = new PIXI.Graphics();
        this.mask.beginFill(0xFFFFFF);
        this.mask.drawRect(0, 0, window.innerWidth, 405);

        this.view.addChild(this.mask);
        this.view.addChild(this.image);
        this.view.addChild(this.text);
        
        this.image.mask = this.mask;
        this.initWidth = this.text.width;

        this.timeline = new TimelineMax({ paused: true, onComplete: this.transitionComplete.bind(this), onUpdate: this.animUpdate.bind(this) });
        
        window.addEventListener('resize', this.updateDimensions.bind(this));

        this._setupTxt();

        this.view.alpha = 0;
        this.updateDimensions();
        this._animSetup();

        this.paused =  false;
        
    }

    pause(paused) {
        this.paused = paused;
        
        if(paused){
            this.timeline.pause();
        } else {

            this.timeline.resume(null, true);
            this.eventTriggered = false;
       
        }
    }

    updateDimensions(){
        let tmp_x = ((window.innerWidth / 2)) ;
        this.image.x = tmp_x;

        this.mask.clear();
        this.mask.beginFill(0xFFFFFF);
        this.mask.drawRect(0, 0, window.innerWidth, 405);
        let tmpSize = 1;
        if (window.innerWidth < 1000){
            tmpSize = (window.innerWidth / 255) / 1.9;
            tmpSize = tmpSize > 1 ? 1 : tmpSize;
            this.image.x -= 150;
        }
        this.text.scale.set(tmpSize);
        if (!this.timeline.isActive()){
            this.text.pos.x = (window.innerWidth - (window.innerWidth * 0.80)) - (this.text.width - (this.text.width * 0.75));
            this.text.x = this.text.pos.x - 100
        }
    }

    _setupTxt(){
        this.text.alpha = 0;
        this.text.y = this.text.pos.y;
        this.text.x = this.text.x = this.text.pos.x - 100;
        if (this.text.x < 0) this.text.x = 0;
     
    }

    _animSetup(){
        //this.text.pos
        this.timeline
            .to(this.text, 10, { x: this.text.pos.x, alpha: 1, ease: Sine.easeOut, delay: 0.3 }, 'gall')
            .to(this.image.scale, 10, { x: 1.4, y: 1.4, ease: Sine.easeOut }, 'gall')
            .to(this.image, 10, { y: '-=40', ease: Sine.easeOut }, 'gall')
            .to(this.text, 10, { alpha: 0, ease: Sine.easeOut }, '-=6.5')
    }

    transitionComplete(){
        this.eventTriggered = false;
        this._setupTxt();
        
    }

    animUpdate(e){
        if (this.paused) return;
        if (this.timeline.progress() > 0.45 && !this.eventTriggered){
            this.emitEvent('tranitionStart', [this]);
            this.eventTriggered = true;

            
        }
       
        
       
    }

    play(){
    
        this.timeline.restart();
        this.timeline.play().timeScale(0.8)
    }
}
