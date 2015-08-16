// SET UP DOUBLE CLICKING ON MESHES

var container1counter = 1;
container1.ondblclick=function(event){
   
    if(container1counter < 4){
        var myBool = doubleclick(event,container1, myCamera1, projector, myMesh1, myScene1, container1counter, myVer1);
        if (myBool){
            container1counter += 1;
        }
    }

};

var container2counter = 1;
container2.ondblclick=function(event){
   
    if(container2counter < 4){
        var myBool = doubleclick(event,container2, myCamera2, projector, myMesh2, myScene2, container2counter, myVer2);
        if (myBool){
            container2counter += 1;
        }
    }

};



function doubleclick(event, container, camera, projector, mesh, scene, counter, myVer){

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
    projector.unprojectVector( vector, camera );
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
    var texture = THREE.ImageUtils.loadTexture('https://mecano-eq.s3.amazonaws.com/' + String(counter) + '.jpg');
    var material = new THREE.MeshPhongMaterial({
        ambient: 0xFFFFFF,
        map: texture,
       specular: 0xFFFFFF,
       shininess: 100,
       shading: THREE.FlatShading
    });

    //
    var radius = 20;
    var geometry = new THREE.SphereGeometry( 20, 20,20);
    
    var sphere = new THREE.Mesh( geometry, material );
    sphere.position.x = intersect.x;
    sphere.position.y = intersect.y;
    sphere.position.z = intersect.z;
    scene.add( sphere );
    render();

};

function checkProgress(){
    if(myVer1.length == 3){

        // container 1
        $("#container1").css('border-color' , '#FFFFFF');
        $("#container1").css('cursor' , 'auto');
        document.getElementById('text1').innerHTML = "done!";
        // container 2
        $("#container2").css('border-color' , 'red');
        $("#container2").css('cursor' , 'crosshair');
        document.getElementById('text2').innerHTML = "double click on the stl to identify the same three feature points in the same order";


    }
    if(myVer2.length == 3){
        // container 2
        document.getElementById('text2').innerHTML = "done!";
        $("#container2").css('border-color' , '#FFFFFF');
        $("#container2").css('cursor' , 'auto');

        // create button
        var temp = $(" <button id='alignButton' type='button' > align </button> ");
        $("#main").append(temp);

        // // HANDLE CLICK
        $("#alignButton").click(function(){
            console.log("align button clicked");
            console.log("myVer1 " , myVer1);
            console.log("myVer2 " , myVer2);
            console.log("calculation started");
            // calculate (myVer1,myVer2);   
        });
    }
}





