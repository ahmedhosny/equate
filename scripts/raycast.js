

var searchDist = 500;

function raycast(myMesh1,myMesh3){

    // get from three js
    var refVer = myMesh1.geometry.attributes.position.array;
    var refNormalList = myMesh1.geometry.attributes.normal.array;

    // spits our to lists of equal length (position and normal)
    var result = getCentroidnNormal(refVer, refNormalList)
    var refCent = result[0];
    var refNorm = result[1];


    // console.log(refCent);
    // console.log(refNorm);

}


function getCentroidnNormal(refVer, refNormalList){

    var centroid = [];
    var normal = [];
    var faceCounter = 0;
    var distanceList = [];
    for(var  i = 0 ; i < refVer.length ; i=i+9){
        // get centroid
        var temp = [];
        var centX = ( refVer[i] + refVer[i+3] + refVer[i+6] ) /3;
        var centY = ( refVer[i+1] + refVer[i+4] + refVer[i+7] ) /3;
        var centZ = ( refVer[i+2] + refVer[i+5] + refVer[i+8] ) /3;
        temp = [centX , centY, centZ];
        centroid.push(temp);
        // get normal
        var temp1 = [ refNormalList[i] , refNormalList[i+1]  , refNormalList[i+2] ];
        normal.push(temp1);


        //
        // RAY 1 outwards from ref geometry
        //

        // now that we have temp and temp1, lets make a ray
        var origin = new THREE.Vector3( temp[0] , temp[1] , temp[2] );
        var dir = new THREE.Vector3( temp1[0] , temp1[1] , temp1[2] );

        var newPoint = new THREE.Vector3(  temp[0]+ (temp1[0]*100) ,  temp[1]+ (temp1[1]*100) ,  temp[2]+(temp1[2]*100)  );

        // draw a lin in the scene
        // drawRay(origin, newPoint )

        // ray
        var ray = new THREE.Raycaster( origin, dir.normalize() );


        // look for intersection
        var list = [];
        list.push(myMesh3);
        var intersects = ray.intersectObjects( list);
        

        // if there is one intersection within the search distance
        if ( intersects.length > 0 )
        {
            distanceList.push(intersects[0].distance);
            //console.log(intersects[0].distance);
        }
        else{
            //console.log("no intersection");
        }

        // set Counter value
        faceCounter += 1;
        if(faceCounter%50 == 0){
            console.log(faceCounter);
        }
        document.getElementById("counter").value = String(faceCounter) + " of " + String(refVer.length/9) + " faces done."

    }
    var result = [centroid,normal];


    return result;

}

function drawRay(A,B){

    // material
    var material = new THREE.LineBasicMaterial({
        color: 0x00ff00
    });

    // to from
    var geometry = new THREE.Geometry();
    geometry.vertices.push(A);
    geometry.vertices.push(B);

    // draw line
    var line = new THREE.Line(geometry, material);

    // scene
    myScene3.add(line)
    render3();

}
