"use strict";

var canvas;
var gl;

var positions = [];

var numTimesToSubdivide = 5;

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = canvas.getContext('webgl2');
    if (!gl) { alert( "WebGL 2.0 isn't available" ); }


    var A = vec2( -.5, -.5 );
    var B = vec2(  0, (Math.sqrt(3)/4));
    var C = vec2(  .5, -.5 );

    kochTriangle(A,B,C,numTimesToSubdivide);
    kochTriangle(A,C,B,numTimesToSubdivide);
    kochTriangle(B,C,A,numTimesToSubdivide);


    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram(program);

    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(positions), gl.STATIC_DRAW );


    var positionLoc = gl.getAttribLocation( program, "aPosition" );
    gl.vertexAttribPointer( positionLoc, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( positionLoc );

    render();
};

/**
 * Fractal by Triangle Side
 * @param A
 * @param B
 * @param C
 * @param count
 */
function kochTriangle(A, B, C, count)
{

    if(count == 0){
        positions.push(A,B);
    }
    else {

        var j = add(mult(2/3,A),mult(1/3,C));
        var k = add(mult(2/3,B),mult(1/3,C));

        //new triangle
        var d = add(mult(2/3,A),mult(1/3,B));
        var e = add(mult(1/3,A),mult(2/3,B));
        var f = mix(C, mix(A, B, 1 / 2), 4 / 3);

        --count;

        kochTriangle(A, d, j,count);
        kochTriangle(d, f, e,count);
        kochTriangle(f, e, d,count);
        kochTriangle(e, B, k,count);

    }
}
function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.LINES, 0, positions.length );
}
