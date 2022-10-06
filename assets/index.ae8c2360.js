var c=Object.defineProperty;var f=(l,t,e)=>t in l?c(l,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):l[t]=e;var a=(l,t,e)=>(f(l,typeof t!="symbol"?t+"":t,e),e);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))i(o);new MutationObserver(o=>{for(const s of o)if(s.type==="childList")for(const n of s.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&i(n)}).observe(document,{childList:!0,subtree:!0});function e(o){const s={};return o.integrity&&(s.integrity=o.integrity),o.referrerpolicy&&(s.referrerPolicy=o.referrerpolicy),o.crossorigin==="use-credentials"?s.credentials="include":o.crossorigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(o){if(o.ep)return;o.ep=!0;const s=e(o);fetch(o.href,s)}})();let r={height:752,width:1536,zoom:200,dragx:0,dragy:0,color:{r:255,g:255,b:255,a:255},maxIteration: 1500};const u=`#version 300 es
 
// an attribute is an input (in) to a vertex shader.
// It will receive data from a buffer
in vec4 a_position;
 
// all shaders have a main function
void main() {
 
  // gl_Position is a special variable a vertex shader
  // is responsible for setting
  gl_Position = a_position;
}
`,p=`#version 300 es
 
// fragment shaders don't have a default precision so we need
// to pick one. highp is a good default. It means "high precision"
precision highp float;

uniform float zoom;

uniform float offset_x;
uniform float offset_y;
 
// we need to declare an output for the fragment shader
out vec4 outColor;

void main() {

    float dx = (gl_FragCoord.x - ${r.width/2}.0) / zoom + offset_x;
    float dy = (gl_FragCoord.y - ${r.height/2}.0) / zoom + offset_y;

    float a = dx;
    float b = dy;

    for(float i = 0.0; i < ${r.maxIteration}.0; i++) {
        float d = (a * a) - (b * b) + dx;
        b = 2.0 * (a * b) + dy;
        a = d;
        if (d > 10000.0) {
            outColor = vec4((i / ${Math.round(r.maxIteration*r.color.r/255)}.0), (i / ${Math.round(r.maxIteration*r.color.g/255)}.0) * 0.6, (i / ${Math.round(r.maxIteration*r.color.b/255)}.0) * 0.6, ${Math.round(r.maxIteration*r.color.a/255)}.0);
            break;
        }
    }
}
`;class v{constructor(t,e){a(this,"width");a(this,"height");a(this,"zoom",200);a(this,"canvas");a(this,"gl",null);a(this,"vertexShader");a(this,"fragmentShader");a(this,"program");this.canvas=t,this.width=e.width,this.height=e.height,this.onInit()}onInit(){for(this.gl=this.canvas.getContext("webgl2"),this.canvas.width=this.width,this.canvas.height=this.height;!this.checkCompatibility(this.gl);)window.alert("webgl not avaliable!");this.main()}main(){this.vertexShader=this.createShader(this.gl.VERTEX_SHADER,u),this.fragmentShader=this.createShader(this.gl.FRAGMENT_SHADER,p),this.program=this.createProgram(this.vertexShader,this.fragmentShader);let t=this.gl.getAttribLocation(this.program,"a_position"),e=this.gl.createBuffer();this.gl.bindBuffer(this.gl.ARRAY_BUFFER,e);let i=this.generatePixels();this.gl.bufferData(this.gl.ARRAY_BUFFER,new Float32Array(i),this.gl.STATIC_DRAW);let o=this.getUniformLocation("zoom"),s=this.gl.createVertexArray();this.gl.bindVertexArray(s),this.gl.enableVertexAttribArray(t);let n=2,h=this.gl.FLOAT,g=!1,d=0,m=0;this.gl.vertexAttribPointer(t,n,h,g,d,m),this.gl.viewport(0,0,this.gl.canvas.width,this.gl.canvas.height),this.gl.clearColor(0,0,0,0),this.gl.clear(this.gl.COLOR_BUFFER_BIT|this.gl.DEPTH_BUFFER_BIT),this.gl.useProgram(this.program),this.assignUniform(o,this.zoom),this.gl.bindVertexArray(s),this.draw()}checkCompatibility(t){return!!t}createShader(t,e){let i=this.gl.createShader(t);return this.gl.shaderSource(i,e),this.gl.compileShader(i),this.gl.getShaderParameter(i,this.gl.COMPILE_STATUS)?i:(console.log(this.gl.getShaderInfoLog(i)),null)}createProgram(t,e){let i=this.gl.createProgram();this.gl.attachShader(i,t),this.gl.attachShader(i,e),this.gl.linkProgram(i);let o=this.gl.getProgramParameter(i,this.gl.LINK_STATUS);return o?i:(console.log(o),null)}generatePixels(){let t=[];for(let e=-(this.width/2);e<this.width/2;e++)for(let i=-(this.height/2);i<this.height/2;i++);return t.push(-1,-1,-1,1,1,-1,1,-1,1,1,-1,1),t}draw(){let t=this.gl.TRIANGLES,e=0,i=6;this.gl.drawArrays(t,e,i)}getUniformLocation(t){return this.gl.getUniformLocation(this.program,t)}assignUniform(t,e){this.gl.uniform1f(t,e)}}class b{constructor(){a(this,"canvasElement",document.querySelector("canvas"));a(this,"draggableElement",document.getElementById("draggable"));a(this,"canvas",new v(this.canvasElement,r));a(this,"dragging",!1);a(this,"zoomMultiplier",1);a(this,"sleep",t=>new Promise(e=>setTimeout(e,t)));this.onInit()}onInit(){window.addEventListener("wheel",t=>this.onZoomChange(t)),this.setUpDraggable(),this.draggableElement.addEventListener("mousedown",()=>{this.dragging=!0}),this.draggableElement.addEventListener("mousemove",t=>{this.dragging==!0&&this.onDrag(t)}),this.draggableElement.addEventListener("mouseup",()=>{this.dragging=!1}),this.setUpSliders()}setUpDraggable(){this.draggableElement.style.width=r.width+"px",this.draggableElement.style.height=r.height+"px",this.draggableElement.style.left=this.canvasElement.offsetLeft+"px"}setUpSliders(){}onZoomChange(t){t.wheelDelta<0?(r.zoom-=1*(this.zoomMultiplier*this.zoomMultiplier*this.zoomMultiplier),this.zoomMultiplier--):(r.zoom+=1*(this.zoomMultiplier*this.zoomMultiplier*this.zoomMultiplier),this.zoomMultiplier++);let e=this.canvas.getUniformLocation("zoom");this.canvas.assignUniform(e,r.zoom),this.canvas.draw(),console.log(this.zoomMultiplier)}async onDrag(t){await this.sleep(50),r.dragx+=-t.movementX/(500*r.zoom/500),r.dragy+=t.movementY/(500*r.zoom/500);let e=this.canvas.getUniformLocation("offset_x"),i=this.canvas.getUniformLocation("offset_y");this.canvas.assignUniform(e,r.dragx),this.canvas.assignUniform(i,r.dragy),this.canvas.draw()}}new b;
