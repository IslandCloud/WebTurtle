var graphCanvas = $("#graphCanvas")[0];
var graphContext = graphCanvas.getContext('2d');


var turtleCanvas = $("#turtleCanvas")[0];
var turtleContext = turtleCanvas.getContext('2d');
var turtleLogo = new Image();
turtleLogo.src =  "/images/turtle.png";

var gridCanvas = $("#gridCanvas")[0];
var gridContext = gridCanvas.getContext('2d');

var turtle = undefined;

var funcRecord = { // Record the 4 functions
    func1: [],
    data1: [],
    func2: [],
    data2: [],
    func3: [],
    data3: [],
    func4: [],
    data4: []
};
var funcRecordTemp = {// Record temporary function
    func: [],
    data: []
};
var isFuncRecord = 0;
var functionBox = $("#functionRecord");

var repeatRecord = { // Record the Repeat actions
    func:[],
    data:[]
};
var isRepeatRecord = 0;
var repeatBox = $("#repeatRecord");

function initialize(){
    turtle = {
        x: 0,
        y: 0,
        angle: 90, //default direction ↑
        penDown: true,
        visible: true,
        width: 4,
        colour: "#0000ff" //default colour of the line
    };

    turtleLogo.onload = function(){
        turtleContext.globalAlpha = 0.7;
        turtleContext.drawImage(turtleLogo, 238, 233, 25, 35);
    }

}

function centerOrigin(context){
    //set the origin to the center of the canvas, facing upwards

    var width = context.canvas.width;
    var height = context.canvas.height;
    context.translate(width/2, height/2);
    context.transform(1,0,0,-1,0,0);

}

function drawTurtle(){
    if(turtle.visible) {

        var canvaswidth = turtleCanvas.width;
        var angle = toRad(270-turtle.angle);
        var x = turtle.x;
        var y = turtle.y;
        turtleContext.clearRect(0, 0, turtleContext.canvas.width, turtleContext.canvas.height);

        turtleContext.save();
        turtleContext.globalAlpha = 0.7;
        centerOrigin(turtleContext);
        var width = turtle.width;
        turtleContext.fillRect(turtle.x - width / 2, turtle.y - width / 2, width, width);
        turtleContext.restore();


        turtleContext.save();

        centerOrigin(turtleContext);
        turtleContext.translate(x, y);
        turtleContext.rotate(-angle);
        // turtleContext.translate(-x, -y);
        // turtleContext.translate(x, y);
        // turtleContext.drawImage(turtleLogo, turtle.x + 236.5, 232 - turtle.y, 25, 35);
        turtleContext.drawImage(turtleLogo, -25/2, -35/2, 25, 35);
        // turtleContext.drawImage(turtleLogo, 0, 0, 25, 35);

        turtleContext.restore();



    }
}

function forward(distance){

    if(isRepeatRecord === 1){
        repeatRecord.func.push("forward");
        repeatRecord.data.push(distance);
        repeatBox.html(repeatBox.html() + "forward(" + distance + ")  ");
        return;
    }

    var angle = toRad(turtle.angle);  //get current angle(in radian)
    var x_dis = distance * Math.cos(angle);
    var y_dis = distance * Math.sin(angle);

    if (turtle.penDown) {
        graphContext.save();

        graphContext.beginPath();
        graphContext.translate(turtle.x, turtle.y);
        graphContext.moveTo(0, 0);
        graphContext.lineTo(x_dis, y_dis);
        graphContext.strokeStyle = turtle.colour;
        graphContext.stroke();
        graphContext.closePath();

        graphContext.restore();
    }

    turtle.x += x_dis;
    turtle.y += y_dis;

    clearTurtleScreen();
    drawTurtle();

    if(isFuncRecord){
        funcRecordTemp.func.push("forward");
        funcRecordTemp.data.push(distance);
        functionBox.html(functionBox.html() + "forward(" + distance + ")  ");
    }


}

function right(angle){

    if(isRepeatRecord === 1){
        repeatRecord.func.push("right");
        repeatRecord.data.push(angle);
        repeatBox.html(repeatBox.html() + "right(" + angle + ")  ")
        return;
    }

    turtle.angle -= angle;
    if(turtle.angle >= 360){
        turtle.angle -= 360;
    }else if(turtle.angle <= -360){
        turtle.angle += 360;
    }

    if(isFuncRecord === 1){
        funcRecordTemp.func.push("right");
        funcRecordTemp.data.push(angle);
        functionBox.html(functionBox.html() + "right(" + angle + ")  ")
    }


    drawTurtle();


}

function left(angle){

    if(isRepeatRecord === 1){
        repeatRecord.func.push("left");
        repeatRecord.data.push(angle);
        repeatBox.html(repeatBox.html() + "left(" + angle + ")  ");
        return;
    }

    turtle.angle += angle;

    if(turtle.angle >= 360){
        turtle.angle -= 360;
    }else if(turtle.angle <= -360){
        turtle.angle += 360;
    }

    if(isFuncRecord === 1){
        funcRecordTemp.func.push("left");
        funcRecordTemp.data.push(angle);
        functionBox.html(functionBox.html() + "left(" + angle + ")  ")
    }

    drawTurtle();

}

function toRad(angle){
    return angle * Math.PI / 180;
}

function clearTurtleScreen(){ // clear the turtle
    turtleContext.save();

    turtleContext.clearRect(0, 0, turtleContext.canvas.width, turtleContext.canvas.height);
    turtleContext.restore();
}

function clearGraphScreen(){ // clear the graph screen
    graphContext.save();
    graphContext.setTransform(1,0,0,1,0,0);
    graphContext.clearRect(0, 0, graphContext.canvas.width, graphContext.canvas.height);
    graphContext.fillStyle = "#fff";
    graphContext.fillRect(0, 0, 500, 500);
    graphContext.restore();


}

function changeColour(colour){
    turtle.colour = colour;
}

function functionStart(){

    isFuncRecord = 1;
    functionBox.html("");
    funcRecordTemp.func = [];
    funcRecordTemp.data = [];

}

function functionEnd(){
    isFuncRecord = 0;
}

function functionSave(){
    var number = $("#saveNumber").val();
    number = parseInt(number);
    switch (number){
        case 1:
            funcRecord.func1 = funcRecordTemp.func;
            funcRecord.data1 = funcRecordTemp.data;
            break;

        case 2:
            funcRecord.func2 = funcRecordTemp.func;
            funcRecord.data2 = funcRecordTemp.data;
            break;

        case 3:
            funcRecord.func3 = funcRecordTemp.func;
            funcRecord.data3 = funcRecordTemp.data;
            break;

        case 4:
            funcRecord.func4 = funcRecordTemp.func;
            funcRecord.data4 = funcRecordTemp.data;
            break;

        default:
            break;
    }
}

function dofunction(func, data){
    var a = 0;
    while(a < func.length){

        switch(func[a]){
            case "forward":
                forward(data[a]);
                break;
            case "right":
                right(data[a]);
                break;
            case "left":
                left(data[a]);
                break;
            default:
                break;
        }
        a++;
    }
}

function functionDo(){

    if(isFuncRecord !== 0){  // Must End the function before Do
        alert("Please End the Function first!!");
        console.log("Please End the Function first!!");
        return;
    }

    var number = $("#doNumber").val();
    number = parseInt(number);
    // console.log(number);
    switch(number){
        case 1:
            dofunction(funcRecord.func1, funcRecord.data1);
            break;
        case 2:
            dofunction(funcRecord.func2, funcRecord.data2);
            break;
        case 3:
            dofunction(funcRecord.func3, funcRecord.data3);
            break;
        case 4:
            dofunction(funcRecord.func4, funcRecord.data4);
            break;
        default:
            break;
    }

}

function functionClear(){
    var number = $("#clearNumber").val();
    number = parseInt(number);
    switch(number){
        case 1:
            funcRecord.func1 = [];
            funcRecord.data1 = [];
            break;

        case 2:
            funcRecord.func2 = [];
            funcRecord.data2 = [];
            break;

        case 3:
            funcRecord.func3 = [];
            funcRecord.data3 = [];
            break;

        case 4:
            funcRecord.func4 = [];
            funcRecord.data4 = [];
            break;

        default:
            break;
    }
    // functionBox.html("");
}

function functionDelete(){
    if(isFuncRecord !== 0) {
        funcRecordTemp.func.pop();
        funcRecordTemp.data.pop();

        functionBox.html("");
        for (var i = 0; i < funcRecordTemp.func.length; i++) {
            functionBox.html(functionBox.html() + funcRecordTemp.func[i] + "(" + funcRecordTemp.data[i] + ") ");
        }
    }else{
        alert("Cannot delete after Repeat is ended!");
    }

}

function function1(){

    functionBox.html("");
    for (var i = 0; i < funcRecord.func1.length; i++) {
        functionBox.html(functionBox.html() + funcRecord.func1[i] + "(" + funcRecord.data1[i] + ") ");
    }
}

function function2(){

    functionBox.html("");
    for (var i = 0; i < funcRecord.func2.length; i++) {
        functionBox.html(functionBox.html() + funcRecord.func2[i] + "(" + funcRecord.data2[i] + ") ");
    }
}

function function3(){

    functionBox.html("");
    for (var i = 0; i < funcRecord.func3.length; i++) {
        functionBox.html(functionBox.html() + funcRecord.func3[i] + "(" + funcRecord.data3[i] + ") ");
    }
}

function function4(){

    functionBox.html("");
    for (var i = 0; i < funcRecord.func4.length; i++) {
        functionBox.html(functionBox.html() + funcRecord.func4[i] + "(" + funcRecord.data4[i] + ") ");
    }
}

function repeatStart(){
    isRepeatRecord = 1;
    repeatRecord = {
        func:[],
        data:[]
    };
    repeatBox.html("");
}

function repeatEnd(){
    isRepeatRecord = 0;
}

function repeatDo(){

    if(repeatRecord.func.length === 0){
        alert("There is no function recorded!!");
        console.log("There is no function recorded!!");
        return;
    }

    if(isRepeatRecord !== 0){  // Must End the function before Do
        alert("Please End the Function first!!");
        console.log("Please End the Function first!!");
        return;
    }

    var iteration = 1;
    var repeatTime = $("#repeatTime").val();
    while(iteration <= repeatTime) {
        var a = 0;
        while (a < repeatRecord.func.length) {
            switch (repeatRecord.func[a]) {
                case "forward":
                    forward(repeatRecord.data[a]);
                    break;
                case "right":
                    right(repeatRecord.data[a]);
                    break;
                case "left":
                    left(repeatRecord.data[a]);
                    break;
                default:
                    break;
            }
            a++;
        }
        iteration++;
    }

}

function repeatDelete(){ // Delete the last action
    if(isRepeatRecord !== 0) {
        repeatRecord.func.pop();
        repeatRecord.data.pop();

        repeatBox.html("");
        for (var i = 0; i < repeatRecord.func.length; i++) {
            repeatBox.html(repeatBox.html() + repeatRecord.func[i] + "(" + repeatRecord.data[i] + ") ");
        }
    }else{
        alert("Cannot delete after Repeat is ended!");
    }

}

function repeatClear(){
    repeatRecord = {
        func:[],
        data:[]
    };
    repeatBox.html("");
}

function reset(){



    clearGraphScreen();
    clearTurtleScreen();


    // centerOrigin(graphContext);
    initialize();
    drawGrid50();
    drawTurtle();


}




// Command Box
$("#commandDo").click(function(){
    var command = $("#command");
    eval(command.val());
    command.val('');
    // console.log(command);
});


// drawing grid
function drawGrid50(){
    gridContext.save();

    gridContext.strokeStyle = '#E0E0E0';

    for(var col = 50; col < 500; col+=50){
        gridContext.moveTo(0, col);
        gridContext.lineTo(500, col);
        gridContext.stroke();
    }
    for(var row = 50; row < 500; row+=50){
        gridContext.moveTo(row, 0);
        gridContext.lineTo(row, 500);
        gridContext.stroke();
    }

    gridContext.restore();
}




// Buttons
$("#reset").click(function (){
    reset();
});

$("#left").click(function (){
    var value = $("#leftValue").val();

    if(value.indexOf("/") > 0){ // if division calculation exists
        var divValue = value.split("/");
        divValue[0] = parseInt(divValue[0]);
        divValue[1] = parseInt(divValue[1]);
        value = divValue[0] / divValue[1];
    }else if(value.indexOf("*") > 0){ // if multi calculation exists
        var mulValue = value.split("*");
        mulValue[0] = parseInt(mulValue[0]);
        mulValue[1] = parseInt(mulValue[1]);
        value = mulValue[0] * mulValue[1];
    }else{
        value = parseInt(value);
    }

    left(value);
});

$("#right").click(function (){
    var value = $("#rightValue").val();

    if(value.indexOf("/") > 0){ // if exist division calculation
        var divValue = value.split("/");
        divValue[0] = parseInt(divValue[0]);
        divValue[1] = parseInt(divValue[1]);
        value = divValue[0] / divValue[1];
    }else if(value.indexOf("*") > 0){
        var mulValue = value.split("*");
        mulValue[0] = parseInt(mulValue[0]);
        mulValue[1] = parseInt(mulValue[1]);
        value = mulValue[0] * mulValue[1];
    }else{
        value = parseInt(value);
    }

    right(value);
});

$("#forward").click(function (){
    var value = $("#forwardValue").val();

    if(value.indexOf("/") > 0){ // if exist division calculation
        var divValue = value.split("/");
        divValue[0] = parseInt(divValue[0]);
        divValue[1] = parseInt(divValue[1]);
        value = divValue[0] / divValue[1];
    }else if(value.indexOf("*") > 0){
        var mulValue = value.split("*");
        mulValue[0] = parseInt(mulValue[0]);
        mulValue[1] = parseInt(mulValue[1]);
        value = mulValue[0] * mulValue[1];
    }else{
        value = parseInt(value);
    }

    value = parseInt(value);
    forward(value);
});

$("#yellow").click(function (){
    changeColour("yellow");
});

$("#red").click(function (){
    changeColour("red");
});

$("#penDown").click(function (){
    turtle.penDown = true;
});

$("#penUp").click(function (){
    turtle.penDown = false;
});

$("#hideTurtle").click(function (){
    turtle.visible = false;
    clearTurtleScreen();
});

$("#showTurtle").click(function (){
    turtle.visible = true;
    drawTurtle();
});

$("#functionStart").click(function (){
    functionStart();
});

$("#functionEnd").click(function (){
    functionEnd();
});

$("#functionDo").click(function (){
    functionDo();
});

$("#functionSave").click(function (){
    functionSave();
});

$("#functionClear").click(function(){
    functionClear();
});

$("#functionDelete").click(function (){
    functionDelete();
});

$("#function1").click(function(){
    function1();
});

$("#function2").click(function(){
    function2();
});

$("#function3").click(function(){
    function3();
});

$("#function4").click(function(){
    function4();
});

$("#repeatStart").click(function (){
    repeatStart();
});

$("#repeatEnd").click(function (){
    repeatEnd();
});

$("#repeatDo").click(function (){
    repeatDo();
});

$("#repeatDelete").click(function(){
    repeatDelete();
});

$("#repeatClear").click(function(){
    repeatClear();
});

$("#screenshot").click(function(){


    var url = graphCanvas.toDataURL();
    console.log(url);
});

// $("#loginButton").on('click', function(){
//     $.get();
// });


reset();
centerOrigin(graphContext);

