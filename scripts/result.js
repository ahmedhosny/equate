
function resultScene(){

	// empty
	$("#main").empty();
	// add div
	document.getElementById('main').innerHTML = ' <div id="container3" ><div id = "text1">result</div><div id = "text1a"></div> </div>   <button id="raytraceButton" type="button"> calculate deviation</button> <br> <input type="text" id="counter" value="" readonly> '  ;

	var container3 = document.getElementById("container3");

	initiateScene3();
	// Load  both files
	loadSTL3(binary1, "container3");
	loadSTL3(binary2, "container3"); // this is now myMesh3

    // prepare raytace calculation button
    $('#raytraceButton').click(function(){
        console.log("raytrace calculation started");
        tryGPGPU(myMesh1,myMesh3);
        // raycast(myMesh1,myMesh3);
        console.log("raytrace calculation ended");
    });

}


var myScene3,
myCamera3,
myRenderer3,
controls3, 
myMesh3a,
myMesh3b,
myGeom3;
var resultCounter = 0;




//
// CREATE SCENE 3
//
function initiateScene3(){

    // SCENE
    myScene3 = new THREE.Scene();
    // CAMERA
    myCamera3 = new THREE.PerspectiveCamera(fov,window.innerWidth / window.innerHeight,1,10000);
    // RENDER
    myRenderer3 = new THREE.WebGLRenderer();
    // DUMMY POSITION
    myCamera3.target = new THREE.Vector3(0,0,0);
    myCamera3.position.set(-8.0, -30, 9);
    myScene3.add(myCamera3);
    // // MATERIAL
    // myMaterial1 = new THREE.MeshBasicMaterial({color: 0x867970 //wireframe: true
    // });
    // LIGHT
    var light = new THREE.AmbientLight( 0xFFFFFF); // soft white light
    myScene3.add( light );
    // CONTROL
    controls3 = new THREE.TrackballControls( myCamera3, container3);
    controls3.rotateSpeed = 1.0;
    controls3.zoomSpeed = 1.2;
    controls3.panSpeed = 0.8;
    controls3.noZoom = false;
    controls3.noPan = false;
    controls3.staticMoving = false;
    controls3.dynamicDampingFactor = 0.15;
    controls3.keys = [ 65, 83, 68 ];

}



function render3(){
        myRenderer3.render(myScene3,myCamera3);
        controls3.update();
        myMesh3b.geometry.dynamic = true;
        myMesh3b.geometry.attributes.position.needsUpdate = true;
        requestAnimationFrame(render3);
}



function loadSTL3(filePath, myContainer){

    var windowContainer = document.getElementById(myContainer);


        // RESIZE
        $(window).resize(function () {
            width=$("#" + myContainer).width();
            height=$("#" + myContainer).height();

            myCamera3.aspect = width/height;
            myCamera3.updateProjectionMatrix();

            myRenderer3.setSize( width, height );

        });


        stlLoader.load( filePath, createScene3 ); 
        myRenderer3.setSize( $("#" + myContainer).innerWidth() , $("#" + myContainer).innerHeight() );
        windowContainer.appendChild(myRenderer3.domElement);
        myRenderer3.setClearColor( 0xDCDCDC , 1 );
        

}


function createScene3( geometry, materials ) {
    // wireframe materials of different colors
    console.log(geometry);
    if(resultCounter == 0){
        var mat = new THREE.MeshBasicMaterial( {  color: 0x0000FF , opacity: 0.4, transparent: true, wireframe: true } );
        myMesh3a = new THREE.Mesh( geometry , mat );
        myScene3.add(myMesh3a); 
    }
    else{
        var mat = new THREE.MeshBasicMaterial( {  color: 0xFF0000 , opacity: 0.1, transparent: true, wireframe: true } );
        // double sides so that it detects rays coming from behind
        // mat.side = THREE.DoubleSide;
        myMesh3b = new THREE.Mesh( geometry , mat );
    }

    
    



    //
    // if first mesh
    //
    
    if(resultCounter == 0){
        // CREATE BOUNDING BOX
        myMesh3a.geometry.computeBoundingBox();
        var boundingBox2 = myMesh3a.geometry.boundingBox;
        // FIX CAMERA
        var myX2= (boundingBox2.max.x + boundingBox2.min.x) / 2
        var myY2= (boundingBox2.max.y + boundingBox2.min.y) / 2
        var myZ2= (boundingBox2.max.z + boundingBox2.min.z) / 2

        // FIX TARGET
        myCamera3.target = new THREE.Vector3(myX2,myY2,myZ2);

        // SET POSITION
        myCamera3.position.set(boundingBox2.max.x, boundingBox2.max.y, boundingBox2.max.z);

        // FIX ROTATION 
        myCamera3.updateProjectionMatrix();

        // FIX CONTROLS
        controls3.target.set( Math.round(myX2) , Math.round(myY2) , Math.round(myZ2) );
        
    }

    //
    // CHANGE myMesh3b position and rotation
    //
    resultCounter+= 1;
    // if acting on second mesh:-
    if(resultCounter == 2){
        // update position of myMesh3
    	run();

        render3();

        myScene3.add(myMesh3b); 

        myGeom3 = myMesh3b.geometry;



    }

}














