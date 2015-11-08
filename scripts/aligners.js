//2// SET UP DOUBLE CLICKING ON MESHES

// var for slider
var sphereList = [];
var currentScale = 1;

var container1counter = 1;
container1.ondblclick=function(event){
   
    if(container1counter < 4){
        var myBool = doubleclick(event,container1, myCamera1,  myMesh1, myScene1, container1counter, myVer1);
        if (myBool){
            container1counter += 1;
        }
        // check if the first point is picked here, if so, display the slider
        if(container1counter == 2){
            displaySlider();
        }
    }

};

var container2counter = 1;
container2.ondblclick=function(event){
   
    if(container2counter < 4){
        var myBool = doubleclick(event,container2, myCamera2, myMesh2, myScene2, container2counter, myVer2);
        if (myBool){
            container2counter += 1;
        }
    }

};



function doubleclick(event, container, camera, mesh, scene, counter, myVer){

    var myBool = false;

    console.log("doubleclicked on " + container.id);

    // update the mouse variable
    mouse.x = ( (event.clientX - $('#' + container.id) .offset().left ) / $('#' + container.id).width() ) *2 -1 ;
    mouse.y =  -1 * ( ( event.clientY - $('#' + container.id) .offset().top ) / $('#' + container.id).height() ) *2 + 1 ;

    console.log( mouse.x , mouse.y );
    
    // find intersections

    // create a Ray with origin at the mouse position
    //   and direction into the scene (camera direction)
    var vector = new THREE.Vector3( mouse.x, mouse.y, 1 );
    vector.unproject(camera);
    var ray = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );

    // create an array containing all objects in the scene with which the ray intersects
    var list = [];
    list.push(mesh);
    var intersects = ray.intersectObjects( list);
    console.log(intersects);

    

    // if there is one (or more) intersections
    if ( intersects.length > 0 )
    {
        console.log("Hit @ " + toString( intersects[0].point ) );
        addSphere(intersects[0].point,scene, counter);

        var temp = [ intersects[0].point.x, intersects[0].point.y , intersects[0].point.z ];
        myVer.push(temp);

        myBool = true;
        
    }

    checkProgress();

    return myBool;

};


function toString(v) { 
    return "[ " + v.x + ", " + v.y + ", " + v.z + " ]"; 
};


function addSphere(intersect,scene,counter){

    console.log(counter);
    //
    THREE.ImageUtils.crossOrigin = '';
    var texture = THREE.ImageUtils.loadTexture('https://mecano-eq.s3.amazonaws.com/' + String(counter) + 'c.jpg');
    texture.minFilter = THREE.NearestFilter;
    var material = new THREE.MeshPhongMaterial({
        map: texture,
       specular: 0xFFFFFF,
       shininess: 0,
       shading: THREE.FlatShading
    });

    //
    var radius = 1.0;
    var geometry = new THREE.SphereGeometry( radius, 20,20);
    
    var sphere = new THREE.Mesh( geometry, material );
    //
    sphere.position.x = intersect.x;
    sphere.position.y = intersect.y;
    sphere.position.z = intersect.z;
    //
    sphere.scale.x = currentScale;
    sphere.scale.y = currentScale;
    sphere.scale.z = currentScale;
    //
    scene.add( sphere );
    sphereList.push(sphere);
    render();

};

function checkProgress(){
    if(myVer1.length == 3){

        // container 1
        $("#con1line1").remove();
        $("#con1line2").remove();
        $("#prompt1text").remove();
        // change cursor
        $("#container1").css('cursor' , 'url("img/rotate32.png"), auto');
    
        // container 2
        $("#container2").css('cursor' , 'crosshair');
        document.getElementById('prompt2').innerHTML =  '<hr id="con2line1"> <p id = "prompt2text" > double click to pick the same 3 feature points in the same order </p> <hr id="con2line2">' ;


    }
    if(myVer2.length == 3){
        // container 2
        $("#con2line1").remove();
        $("#con2line2").remove();
        $("#prompt2text").remove();
        // change cursor
        $("#container2").css('cursor' , 'url("img/rotate32.png"), auto');

        // create button
        $("#main").append("<hr id='con3line1' > </hr> <button type='button' class='btn btn-default btn-block' id='alignButton' > align </button> ")


        // // HANDLE CLICK
        $("#alignButton").click(function(){
            console.log("align button clicked");
            console.log("myVer1 " , myVer1);
            console.log("myVer2 " , myVer2);
            console.log("calculation started");
            resultScene();
        });
    }
}

//
// sphere radius control
//


// when the first point is picked, display the slider

function displaySlider(){

    document.getElementById("mySliderDiv").innerHTML = '<input id="mySlider" type="text" class="span2" value="" data-slider-min="0.1" data-slider-max="14.9" data-slider-step="0.1" data-slider-value="14" data-slider-orientation="vertical" data-slider-selection="after"data-slider-tooltip="hide">';

    $('.slider').slider();

    $('#mySlider').slider()
      .on('slide', function(ev){

        for (var i = 0 ; i < sphereList.length ; i++){
            //
            sphereList[i].scale.x = 15 - ev.value;
            sphereList[i].scale.y = 15 - ev.value;
            sphereList[i].scale.z = 15 - ev.value;
            //
            currentScale = 15 - ev.value; 
        } 

    });

}

