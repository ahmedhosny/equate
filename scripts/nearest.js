//5//


var distanceList = [];
var colorList = []; // one per face (changed from hex to rgb)
var vertexColorOld = []; // one per vertex - same across face (rgb)
var vertexColorNew = []; // averaged out (hex)
var myMin = 0;
var myMax = 0;



//
// define Nearest neighbout
//
function tryNearest(){


    ///////////////////////////////////////////
    ///////////////////////////////////////////
    // functions to do the nearest calculation
    //////////////////////////////////////////
    //////////////////////////////////////////

    var maxDistance = Math.pow(120000, 2) ;  
    function displayNearest(kdTree, position) {            
        var inRange = kdTree.nearest([position[0], position[1], position[2] ], 1, maxDistance);
        // check if position and neartes are actually coincident
        // if(inRange.length === 0 ){
        //     distanceList.push(0);
        // }
        // else{
            distanceList.push(Math.sqrt(inRange[0][1]));
        //}
    }


    //
    // get face centroid given an array of x,y,z or vertices
    //
    function getCentroid(refVer ){

        var centroid = [];
        for(var  i = 0 ; i < refVer.length ; i=i+9){
            // get centroid
            var temp = [];
            var centX = ( refVer[i] + refVer[i+3] + refVer[i+6] ) /3;
            var centY = ( refVer[i+1] + refVer[i+4] + refVer[i+7] ) /3;
            var centZ = ( refVer[i+2] + refVer[i+5] + refVer[i+8] ) /3;
            temp = [centX , centY, centZ];
            centroid.push(temp);
            
        }

        return centroid;

    }

    //
    // get face centroid given an array of vector
    //
    function getCentroidVec3(refVer ){

        var centroid = [];
        for(var  i = 0 ; i < refVer.length ; i=i+3){
            // get centroid
            var temp = [];
            var centX = ( refVer[i].x + refVer[i+1].x + refVer[i+2].x ) /3;
            var centY = ( refVer[i].y + refVer[i+1].y + refVer[i+2].y  ) /3;
            var centZ = ( refVer[i].z + refVer[i+1].z + refVer[i+2].z  ) /3;
            temp = [centX , centY, centZ];
            centroid.push(temp);
            
        }

        return centroid;

    }

    //
    // gets distance given two points
    //
    var distanceFunction = function(a, b){
        return Math.pow(a[0] - b[0], 2) +  Math.pow(a[1] - b[1], 2) +  Math.pow(a[2] - b[2], 2);
    };


    //
    // creates color map given a list 
    //
    function colorize(distanceList){
        console.log(distanceList)
        myMax = _.max(distanceList);
        myMin = _.min(distanceList);;
        console.log("min,max" , myMin , myMax );
        var myRainbow = new Rainbow();
        myRainbow.setNumberRange(myMin, myMax);
        myRainbow.setSpectrum('#FF7F00' ,  '#FF0000' );
        // '#5d6ed9', '#5dd9ca', '#78d163', '#d2d95d' ,'#d9a95d' , '#d85c5c'
        //loop
        for (var k = 0 ; k < distanceList.length ; k++){
            var myHex = myRainbow.colorAt(distanceList[k]); 

            colorList.push(myHex);
            // push three times in vertexColorOld
            vertexColorOld.push( hexToRgb( "#" + String(myHex) ) );
            vertexColorOld.push( hexToRgb( "#" + String(myHex) ) );
            vertexColorOld.push( hexToRgb( "#" + String(myHex) ) );

        }
    }

    //
    // creates color map given a list - use tinycolor instead of colorize
    //
    function controledColorize(distanceList){
        console.log(distanceList)
        myMax = _.max(distanceList);
        myMin = _.min(distanceList);;
        console.log("min,max" , myMin , myMax );
        // make a dark red color
        
        // loop through distance list
        for (var k = 0 ; k < distanceList.length ; k++){
            // output = output_start + ((output_end - output_start) / (input_end - input_start)) * (input - input_start)

            // input_end myMax
            // input_start myMin
            // output_end 100
            // output_start 0

            var myLightness = 0 + ( (100-0) / (myMax - myMin) ) * (distanceList[k] - myMin)  ;
            var myColor = tinycolor("red");
            
            myColor.lighten( parseInt(myLightness) );
            // round r,g,b to the nearest interger
            myColor._r = parseInt(myColor._r);
            myColor._g = parseInt(myColor._g)
            myColor._b = parseInt(myColor._b)
            
            // add to lists as rgb
            colorList.push([ myColor._r , myColor._g , myColor._b ]);
            // colorList.push(myColor.toHex());

            // push three times in vertexColorOld
            // vertexColorOld.push( hexToRgb( "#" + String(myColor.toHex()) ) );
            // vertexColorOld.push( hexToRgb( "#" + String(myColor.toHex()) ) );
            // vertexColorOld.push( hexToRgb( "#" + String(myColor.toHex()) ) );
        }

    }

    function hashCode(str) { 
        var hash = 0;
        for (var i = 0; i < str.length; i++) {
           hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return hash;
    } 


    function hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    function componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }

    function rgbToHex(r, g, b) {
        return  componentToHex(r) + componentToHex(g) + componentToHex(b);
    }


    //
    // This function will find where the vertices are duplicated and generate a new color for that
    //
    function getColorAtVertex(colorList,myFinalGeometry){

        
        // loop through single vertex
        for (var i = 0 ; i < myFinalGeometry.vertices.length ; i++){
            // now find duplicates [ [0,233,544,566] , [1,223,556,888] , ... ]
            var temp = [i];
            for (var j = 0 ; j < myFinalGeometry.vertices.length ; j++){
                if( myFinalGeometry.vertices[i].equals ( myFinalGeometry.vertices[j] )  && i!=j ){
                    temp.push(j);
                }
            }    
            // now temp has the duplicates - lets go through it
            var totalR = 0 ;
            var totalG = 0 ;
            var totalB = 0 ;
            for (var k = 0 ; k < temp.length ; k++){
                totalR += vertexColorOld[ temp[k] ].r ;
                totalG += vertexColorOld[ temp[k] ].g ;
                totalB += vertexColorOld[ temp[k] ].b ;
            }

            var avgR = parseInt(totalR / temp.length);
            var avgG = parseInt(totalG / temp.length);
            var avgB = parseInt(totalB / temp.length);

            // now convert back to hex and add to list
            var finalHex =  rgbToHex(avgR, avgG, avgB)
            vertexColorNew.push(finalHex)

        }

    }


    ///////////////////
    ///////////////////
    // end of functions
    ///////////////////
    ///////////////////


    //
    // preparation phase
    //
    console.time('prep1');

    // get face centroid from myGeom1
    var refVer = myGeom1.attributes.position.array;
    var refCent = getCentroid(refVer);

    console.timeEnd('prep1');
    console.log("myGeom1 number of face centroids" , refCent.length );


    //
    // nearest neighbour phase
    //
    console.time('prep2');


    // [x1,y1,z1,x2,y2,z2,.....]
    var subVer = myMesh3bAdjusted; // array of Vec3 

    var subCent = getCentroidVec3(subVer);

    var subCentFlat = _.flatten(subCent);

    var positions = new Float32Array( subCentFlat.length );
    var alphas = new Float32Array( subCentFlat.length / 3 );


    var _particleGeom = new THREE.BufferGeometry();
    _particleGeom.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
    _particleGeom.addAttribute( 'alpha', new THREE.BufferAttribute( alphas, 1 ) );
                
    var particles = new THREE.Points( _particleGeom);

    // loop through particles
    for (var x = 0; x < (subCentFlat.length / 3); x++) {
        positions[ x * 3 + 0 ] = subCentFlat[ x * 3 + 0 ];
        positions[ x * 3 + 1 ] = subCentFlat[ x * 3 + 1 ];
        positions[ x * 3 + 2 ] = subCentFlat[ x * 3 + 2 ];
        alphas[x] = 1.0;
    }

    console.timeEnd('prep2');
    console.log("myGeom3 number of face centroids" , subCent.length  )



    //
    // kd tree
    //
    console.time("kdTree");
    var kdTree = new THREE.TypedArrayUtils.Kdtree( positions, distanceFunction, 3 );
    console.timeEnd("kdTree");



    //
    // run nearest neighbour
    //
    console.time("nearest");
    for (var i = 0 ; i < refCent.length ; i++){   
        displayNearest(kdTree, refCent[i]);
    }
    console.log('distanceList' , distanceList)
    console.timeEnd("nearest");



    //
    // now we have a list of distances
    //
    //1// convert the distance list to a list of colors.
    console.time("colorize");
    controledColorize(distanceList); // uses tinyColor
    // colorize(distanceList); // uses rainbow JS
    console.log("colorList", colorList);
    console.timeEnd("colorize");

    //2// remove the two existing meshes
    // will remove them before even starting tryNearest()



    
    //3// apply color
    console.time("draw new colored geometry");
    // create geometry from the buffer geometry myGeom1
    var myFinalGeometry = new THREE.Geometry().fromBufferGeometry( myGeom1 );

    // get colors at vertices - this will populate vertexColorNew
    // getColorAtVertex(colorList,myFinalGeometry); //////////////////////////////////// switch vertex to face /////



    //
    // apply color to the vertices    -------------------
    // 
    // var color, face, numberOfSides, vertexIndex;
    // var faceIndices = [ 'a', 'b', 'c', 'd' ];

    // for ( var i = 0; i < myFinalGeometry.faces.length; i++ )  {
    //     face  = myFinalGeometry.faces[ i ];    
    //     // determine if current face is a tri or a quad
    //     numberOfSides = ( face instanceof THREE.Face3 ) ? 3 : 4;
    //     // assign color to each vertex of current face
    //     for( var j = 0; j < numberOfSides; j++ ) 
    //     {
    //         vertexIndex = face[ faceIndices[ j ] ];
    //         // initialize color variable
    //         color = new THREE.Color( 0xffffff );
    //         color.setHex(   hashCode('0x' + colorList[i] )   );   ////////////////// switch vertex to face /////
    //         // vertexColorNew[ (3*i) + j ]

    //         face.vertexColors[ j ] = color;
    //     }

    // }





    // 
    // apply color to face -------------------
    //
    for (var i = 0 ; i < myFinalGeometry.faces.length ; i++){
        myFinalGeometry.faces[i].color.setRGB (   colorList[i][0]/255 , colorList[i][1]/255 , colorList[i][2]/255   );   

        // myFinalGeometry.faces[i].color.setHex (  hashCode('0x' + colorList[i])  );
        // console.log( colorList[i][0]/255 , colorList[i][1]/255 , colorList[i][2]/255  );
    }

    // create material
    var myMaterial = new THREE.MeshBasicMaterial( {  vertexColors: THREE.FaceColors } ); // THREE.VertexColors ---

    // create mesh and add to scene
    var myFinalMesh = new THREE.Mesh( myFinalGeometry , myMaterial  ) ;
    myScene3.add(myFinalMesh);


    // //////////////////////////
    console.log(myFinalGeometry);
    console.log(myFinalMesh);

    console.timeEnd("draw new colored geometry");



    










}