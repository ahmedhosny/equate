
//
 $(document).ready(function(){

    //
    // container 1
    //

    $("#container1").on("dragenter",function(){
        // replace
        $('#con1Logo').attr("src" ,  "img/con1after.svg" );

    });

    $("#container1").on("dragleave",function(){
        // replace
        $('#con1Logo').attr("src" ,  "img/con1before.svg" );

    });


    //
    // container 2
    //

    $("#container2").on("dragenter",function(){
        // replace
        $('#con2Logo').attr("src" ,  "img/con2after.svg" );

    });

    $("#container2").on("dragleave",function(){
        // replace
        $('#con2Logo').attr("src" ,  "img/con2before.svg" );

    });





});