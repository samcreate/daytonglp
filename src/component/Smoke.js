

import * as PIXI from 'pixi.js';
function Smoke(app, mainLayer){
    let shaderCode = document.getElementById('fragShader').innerHTML;
    this.count = 0;
    this.uniforms = {};
    this.uniforms.resolution = { type: 'v2', value: { x: app.view.width * 1.5, y: app.view.height+50    } };
    this.uniforms.brightness = { type: '1f', value: 0.8, default: 0.8};
    this.uniforms.whiteness = { type: '1f', value: 1.5, default: 1.5 };
    this.uniforms.alpha = { type: '1f', value: 0.0 };
    this.uniforms.shift = { type: '1f', value: 1.6 };
    this.uniforms.time = { type: '1f', value: 0 };
    this.uniforms.speed = { type: 'v2', value: { x: 0.2, y: 0.3 } };
    this.uniforms.transr = { type: '1f', value: 72.0 };
    this.uniforms.transg = { type: '1f', value: 79.0 };
    this.uniforms.transb = { type: '1f', value: 84.0 };
    this.animationPaussed = false;

    this.smokeShader = new PIXI.AbstractFilter(null, shaderCode, this.uniforms);
    
    //this.colorMatrix = new PIXI.filters.ColorMatrixFilter();
    
    this.view = PIXI.Sprite.fromImage(window.smoke_shader);
    this.view.width = app.view.width;
    this.view.height = 705;
    this.view.filters = [this.smokeShader];
    this.view.smokeShader = this.smokeShader;
    this.view.blendMode = PIXI.BLEND_MODES.MULTIPLY

    this.animation = (delta) => {
        requestAnimationFrame(this.animation.bind(this));
        if (this.animationPaussed !== true){
            this.count += 0.009;
            this.smokeShader.uniforms.time.value = this.count;
        }
        //console.log(this.smokeShader.uniforms.time.value);
    }

    this.updateWidth = function( w ) {
        this.smokeShader.uniforms.resolution.value.x = w * 1.5;
        this.view.width = w;
    }

    this.animation();
  
    return this;
};

export default Smoke;
