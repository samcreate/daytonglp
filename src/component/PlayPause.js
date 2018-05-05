import * as PIXI from 'pixi.js';
import { Sine, TimelineLite } from "gsap";
import EventEmitter from 'wolfy87-eventemitter'
import { SSL_OP_NETSCAPE_REUSE_CIPHER_CHANGE_BUG } from 'constants';

const play = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAQCAYAAAAmlE46AAAAdUlEQVQokZ3TywnCABBF0VFsQLEKK7EWXaYWa7ESbcJFCnBxXMgQAkp4uTDLC/PmU7jjhEqqfHnjhn0qNi9csEvF5oHzGrH5m39JZMp/SMVmln8DlfGsqmEbShNBqyOu3WoynGMynHgd8QGMwpP7mWNJXPVWH4WbpI0oX71NAAAAAElFTkSuQmCC";
const pause = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAQCAYAAAAmlE46AAAAI0lEQVQokWP8////fwZUwMiAHaCoY8KhiCAY1TiqcVQjLgAAyXEFHMxEswMAAAAASUVORK5CYII=";

export default class PlayPause extends EventEmitter {
    constructor() {
        super();

        this.view = new PIXI.Container();
        this.play = PIXI.Sprite.fromImage(play, true);
        this.pause = PIXI.Sprite.fromImage(pause, true);
       

        this.play.alpha = 0;
        this.view.addChild(this.play);
        this.view.addChild(this.pause);

       

        this.view.interactive = true;
        this.view.buttonMode = true;
        this.view.mousedown = this.onClick.bind(this);
    }

    onClick(){
        if (this.play.alpha === 0){
            this.pause.alpha = 0;
            this.play.alpha = 1;
            this.emitEvent('paused', [this, true]);
        }else{
            this.pause.alpha = 1;
            this.play.alpha = 0;
            this.emitEvent('paused', [this, false]);
        }
    }
}