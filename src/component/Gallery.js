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
        
        galitems.forEach(element => {
            let slide = new GalleryItem(element);
            this.addChild(slide);
            slide.on('tranitionStart', this.triggerTransition.bind(this));
            this.slides.push(slide);
            window.slide = slide;
        });

    }

    next(){
        if (this.currentSlide < this.slides.length -1) {
            this.currentSlide++;
            this.slides[this.currentSlide].view.alpha = 1;
            this.slides[this.currentSlide].play();
            this.start = true;
        } else {
            this.currentSlide = -1;
            this.next();
        }
        
    }

    addChild(child){
        this.view.addChild(child.view);
    }

    triggerTransition(slide){
        this.emitEvent('startTransition', [this]);
        TweenLite.to(slide.view, 2, { alpha: 0, ease: Sine.easeInOut, delay:2 });
        TweenLite.to(this.slides[this.currentSlide].view, 2, { alpha: 1, ease: Sine.easeInOut });
    
    }
    
}
// console.log('fuck you');
// 