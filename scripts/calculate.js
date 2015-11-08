//3// calculations for aligning

function run(){


	// 3xN 
	// 	P1	P2	P3	...
	// X
	// Y
	// Z

	console.log("running alignment")

	// All the X's , All the Y's , All the Z's
	// 1. get myVer1 and myVer2 and prepare them
	var A =  [   [ myVer1[0][0] , myVer1[1][0] , myVer1[2][0] ] , 
				[ myVer1[0][1] , myVer1[1][1] , myVer1[2][1] ] ,
				[ myVer1[0][2] , myVer1[1][2] , myVer1[2][2] ]  ] ; 

	var B =  [   [ myVer2[0][0] , myVer2[1][0] , myVer2[2][0] ] , 
				[ myVer2[0][1] , myVer2[1][1] , myVer2[2][1] ] ,
				[ myVer2[0][2] , myVer2[1][2] , myVer2[2][2] ]  ] ; 

	// 2. do calculation
	// FLIP A and B (result[0] is T and result[1] is TM)
	var result = calculate (B,A);

	// 3. Pass on to scene
	// SET POSITION
	myMesh3b.position.set( result[0][0] , result[0][1] , result[0][2]  ) ;
	 // SET ROTATION
	var rotMat = new THREE.Matrix4();
	rotMat.set(   result[1][0][0] ,  result[1][0][1]  , result[1][0][2] , result[1][0][3] ,
					result[1][1][0] ,  result[1][1][1]  , result[1][1][2] , result[1][1][3] ,
					result[1][2][0] ,  result[1][2][1]  , result[1][2][2] , result[1][2][3] ,
					result[1][3][0] ,  result[1][3][1]  , result[1][3][2] , result[1][3][3]  );

	var quat = new THREE.Quaternion();
	quat.setFromRotationMatrix ( rotMat );
	myMesh3b.rotation.setFromQuaternion ( quat , 'XYZ');


	console.log("alignment done")


}


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

	// get eigenvalue/vector pair
	var pair = numeric.eig ( N ) ;

	var V = pair.E.x;
	var D = pair.lambda.x;


	// Get index of max value in eigenvectors [ first largest value ]
	var i = D.indexOf(Math.max.apply(Math,D));

	// Get eigen vector corresponding to max value 
	var q = getEigenVec(i,V);

	// get index of max value in eigen vector
	var qABS = listABS(q);
	var ii = qABS.indexOf(Math.max.apply(Math,qABS));

	// get sign of max value in eigen vector
	var sign =  getSign(q[ii]);

	// multiply q by the sign
	var qMul = vecXscalar(q,sign);

	// get R
	var R = getR(qMul);

	// get Translation matrix
	var T = getT(R, lc, rc);
	// console.table(T);

	// Get transformation matrix (without translation)
	var TM = RtoT(R);
	// console.table(TM);

	var result = [T,TM];
	return result;
    
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
// get eigenvec corresponding to max eigenvalue
function getEigenVec(index,matrix){
	temp = [];
	for (var  i = 0 ; i < matrix.length ; i++){
		var num = parseFloat ( [matrix[i][index]] ) ; 

		if( !isNumber(num) ){
			console.log('some numbers in the max eigenvector are not true');
		}

		temp.push(num);
		
	}

	return temp;
}

// check if number is real
function isNumber(n){
	var bool = false;
	if ( typeof n == 'number' && !isNaN(n) && isFinite(n) ){
		bool = true;
	}
    return bool;
 }

// get abs of every item in list
 function listABS(list){
 	var temp = [];
 	for (var i = 0 ; i < list.length ; i++){
 		temp.push(Math.abs(list[i]));
 	}
 	return temp;
 }
 
// get sign of number
function getSign(number){
	var result = 0;
	if (number > 0 ){
		result = 1;
	}
	else if( number < 0){
		result = -1;
	}
	return result;
}

// multiply vector by scalar
function vecXscalar(vector,scalar){
	var temp = [];
	for (var i = 0 ; i < vector.length ; i++){
 		temp.push( vector[i] * scalar);
 	}
 	return temp;
}

// get rotation matrix
function getR(vector){

	var q0 = vector[0];
	var qx = vector[1];
	var qy = vector[2];
	var qz = vector[3];
	var v = [ vector[1],vector[2],vector[3] ]; 


	var Z = [	[q0 ,-qz , qy ] , 
           		[qz , q0 , -qx ] ,
          		[-qy, qx , q0 ]   ];


    var R1 = multiplyMatrices(v, v);
    var R2 = math.multiply(Z, Z)  ;
    var R3 = math.add(R1,R2);
    
    return R3;


}


function multiplyMatrices(m1, m2) {
    var result = [];
    // vertical matrix
    for(var i = 0 ; i < 3 ; i ++){
    	var temp = [];
    	// horizontal matrix
    	for(var j = 0 ; j < 3 ; j ++){
    		temp.push(m1[i]*m2[j]);
    	}
    	result.push(temp);
    }
    return result;
}

function RtoT(R){
	var temp = R;
	temp[0].push(0);
	temp[1].push(0);
	temp[2].push(0);
	temp.push([0,0,0,1]);
	return temp;
}

function getT(R, lc, rc){
	var T1 = math.multiply(R, lc);
	var T2 = math.subtract(rc,T1)
	return T2;
}

