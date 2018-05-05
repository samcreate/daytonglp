import * as PIXI from 'pixi.js';
import { TweenLite, Sine} from "gsap";
import EventEmitter from 'wolfy87-eventemitter';
import GalleryItem from './GalleryItem';
export default class Gallery extends EventEmitter {

    constructor(galitems, controller) {
        super();

        this.view = new PIXI.Container();
        this.slides = [];
        this.currentSlide = -1;

        this.pausedSlides = [];

        this.paused = false;
        
        galitems.forEach(element => {
            let slide = new GalleryItem(element);
            this.addChild(slide);
            slide.on('tranitionStart', this.triggerTransition.bind(this));
            this.slides.push(slide);
            window.slide = slide;
        });

        this.animation1;
        this.animation2;
    }

    next(){
        if(this.paused) return;
            if (this.currentSlide < this.slides.length -1) {
                this.currentSlide++;
                this.slides[this.currentSlide].view.alpha = 1;
                this.slides[this.currentSlide].play();
                this.start = true;
                this.emitEvent('slideStart', [this.slides[this.currentSlide]]);
            } else {
                this.currentSlide = -1;
                this.next();
            }
    }

    addChild(child){
        this.view.addChild(child.view);
    }

    pause(paused){
        this.slides.forEach(element => {
            // element.pause(paused);
            if (!element.timeline.paused()){
                //('pause', element)
                this.pausedSlides.push(element);
                element.pause(paused);
            }
        });
        this.paused = paused;
        
        if(!paused){
            
            this.pausedSlides.forEach(element => {
                //console.log('unpause ', element)
                element.pause(paused);
            });
        }
        if (paused && this.animation1 !== undefined){
            this.animation1.paused();
            this.animation2.paused();
        } else if (this.animation1 !== undefined){
            this.animation1.resume(null, true);
            this.animation2.resume(null, true);
            
        }
    }

    triggerTransition(slide){
 
            this.emitEvent('startTransition', [this]);

            this.animation1 =  TweenLite.to(slide.view, 2, { alpha: 0, ease: Sine.easeInOut, delay:2 });
            this.animation2 =  TweenLite.to(this.slides[this.currentSlide].view, 2, { alpha: 1, ease: Sine.easeInOut });
            
    }
    
}
