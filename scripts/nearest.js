




$("#temp").click(function(){
    tryNearest(1,1);
});

var distanceList = [];
var colorList = [];




//
// define Nearest neighbout
//
function tryNearest(myMesh1,myMesh3){


    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    var maxDistance = Math.pow(120, 2) ;  
    function displayNearest(kdTree, position) {            
        var inRange = kdTree.nearest([position[0], position[1], position[2] ], 1, maxDistance);
        // check if position and neartes are actually coincident
        if(inRange.length === 0 ){
            distanceList.push(0);
        }
        else{
            distanceList.push(Math.sqrt(inRange[0][1]));
        }
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
    // gets distance given two points
    //
    var distanceFunction = function(a, b){
        return Math.pow(a[0] - b[0], 2) +  Math.pow(a[1] - b[1], 2) +  Math.pow(a[2] - b[2], 2);
    };


    //
    // creates color map given a list then adjusts the color of a given mesh
    //
    function colorize(distanceList){
        console.log(distanceList)
        var myMax = _.max(distanceList);
        var myMin = _.min(distanceList);;
        console.log("min,max" , myMin , myMax );
        var myRainbow = new Rainbow();
        myRainbow.setNumberRange(myMin, myMax);
        myRainbow.setSpectrum('#5d6ed9', '#5dd9ca', '#78d163', '#d2d95d' ,'#d9a95d' , '#d85c5c');
        //loop
        for (var k = 0 ; k < distanceList.length ; k++){
            var myHex = myRainbow.colorAt(distanceList[k]); 
            //convert to rgba
            var myRGBA = convertHex(myHex,100);
            colorList.push(myRGBA);
        }




    }



    function convertHex(hex,opacity){
        hex = hex.replace('#','');
        r = parseInt(hex.substring(0,2), 16);
        g = parseInt(hex.substring(2,4), 16);
        b = parseInt(hex.substring(4,6), 16);

        result = 'rgba('+r+','+g+','+b+','+opacity/100+')';
        return result;
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    //
    // preparation phase
    //
    console.time('prep1');

    // get face centroid from myGeom1
    var refVer = myGeom1.attributes.position.array;
    var refCent = getCentroid(refVer);

    console.timeEnd('prep1');
    console.log("myGeom1 number of face centroids" , refCent.length );


    ////////////////////////
    ////////////////////////
    ////////////////////////

    //
    // nearest neighbour phase
    //
    console.time('prep2');


    // [x1,y1,z1,x2,y2,z2,.....]
    var subVer = myGeom3.attributes.position.array;  
    var subCent = getCentroid(subVer);
    var positions = new Float32Array( subCent.length );
    var alphas = new Float32Array( subCent.length / 3 );


    var _particleGeom = new THREE.BufferGeometry();
    _particleGeom.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
    _particleGeom.addAttribute( 'alpha', new THREE.BufferAttribute( alphas, 1 ) );
                
    var particles = new THREE.PointCloud( _particleGeom);

    // loop through particles
    for (var x = 0; x < (subCent.length / 3); x++) {
        positions[ x * 3 + 0 ] = subCent[ x * 3 + 0 ];
        positions[ x * 3 + 1 ] = subCent[ x * 3 + 1 ];
        positions[ x * 3 + 2 ] = subCent[ x * 3 + 2 ];
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
    console.timeEnd("nearest");

    //
    // now we have a list of distances
    //
    //1// convert the distance list to a list of colors.
    console.time("colorize");
    colorize(distanceList);
    console.timeEnd("colorize");



}