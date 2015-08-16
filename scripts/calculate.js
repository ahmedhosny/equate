

$('#tempButton').click(function(){

	// 3xN 
	// 	P1	P2	P3	...
	// X
	// Y
	// Z

	console.log("tempCalculate")

	// All the X's , All the Y's , All the Z's

	A = [ [0 , 1.86 , 2.24 ] , [-1.49 , -292.82 , -292.82 ] , [ 426.72 , 425.99 , 0.03  ] ];
	B = [ [250.68 , 87.06 , 85.85 ] , [-1060.09 , -1251.14 , -992.87 ] , [ 615.28 , 469.11 , 131.73 ] ];

	



	// // SET POSITION
	// myMesh2.position.set(-468.2426 ,243.4595, -707.6555);


	// // SET ROTATION
	// var rotMat = new THREE.Matrix4();
	// rotMat.set(   0.8232 ,  -0.4488  , -0.3476 , 0 ,
 //    			0.5677  ,  0.6551  ,  0.4986 , 0 ,
 //   				 0.0039  , -0.6078  ,  0.7940  , 0 ,
 //      			  0   ,      0  ,       0  ,  1.0000);
	// var quat = new THREE.Quaternion();
	// quat.setFromRotationMatrix ( rotMat );
	// myMesh2.rotation.setFromQuaternion ( quat , 'XYZ');







	render();
	// FLIP A and B
	calculate (B,A);



});


function calculate(Ainput,Binput){

	var doScale = false;
	var doWeights = false;

	// assuming no weights

	// get centroids - operate on the input
	var lc = getCentroid(Ainput);
	var rc = getCentroid(Binput);

	// subtract centroid from input
	var left  = subtractVector(Ainput,lc);
	var right  = subtractVector(Binput,rc);

	// multiply left by right
	var leftMat = math.matrix(left);
	var rightMat = math.matrix(right);
	var M = math.multiply(left,numeric.transpose(right));
	
	// calculate rotation matrix for 3d case
	// get N
	var N = returnN(M);
	console.log(N);

	// get eigenvalue/vector pair
	var pair = numeric.eig ( N ) ;
	// console.log(pair);

	var V = pair.E.x;
	// var D = pair.lambda.x;
	// var D = pair.lambda;
	// var Vtemp1 =  pair.E.inv() ;
	// var Vtemp2 = math.multiply(Vtemp1 , -1 );
	console.log(V);




    
}

// takes original input, calculate centroid the spits an array
function getCentroid(input){

	var means = [];
	for (var i  = 0 ; i < 3 ; i++){
		temp = ( input[i][0] + input[i][1] + input[i][2] ) / 3.0
		means.push([temp]);
	}

	return means
}

// subtracts the vector from the array
function subtractVector(array,vector){

	var diff = [];
	var temp1 = [];
	var temp2 = [];
	var temp3 = [] ;
	for (var i  = 0 ; i < 3 ; i++){
		var one = array[0][i] - vector[0];
		var two = array[1][i] - vector[1];
		var three = array[2][i] - vector[2];
		temp1.push (one);
		temp2.push (two);
		temp3.push (three);
	}

	diff.push(temp1,temp2,temp3);
	return diff
}

// returns N from M
function returnN(M) {

	//
	var Sxx = M[0][0];
	var Sxy = M[0][1];
	var Sxz = M[0][2];
	//
	var Syx = M[1][0];
	var Syy = M[1][1];
	var Syz = M[1][2];
	//
	var Szx = M[2][0];
	var Szy = M[2][1];
	var Szz = M[2][2];
	//

	var N=[ [ (Sxx+Syy+Szz) , (Syz-Szy) ,     (Szx-Sxz)   ,   (Sxy-Syx) ] ,
            [ (Syz-Szy)  ,    (Sxx-Syy-Szz) , (Sxy+Syx)  ,    (Szx+Sxz) ] ,
           	[ (Szx-Sxz) ,     (Sxy+Syx)  ,   (-Sxx+Syy-Szz) ,  (Syz+Szy) ] , 
           	[ (Sxy-Syx)   ,   (Szx+Sxz)  ,    (Syz+Szy)   ,   (-Sxx-Syy+Szz) ] ] ;
 
    return N;

}