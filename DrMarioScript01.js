//
//BUGS: currently resetBlock funciton doesn't reset the block position



var canvas = document.getElementById("myCanvas");

//ctx variable stores the 2D rendering context
var ctx = canvas.getContext("2d");


var level = [        						// creates an empty level
		[0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0],
		[0,2,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,1,0,0,0,0,0],
		[0,0,0,0,1,0,0,0,0,0],
		[0,0,0,0,0,0,3,0,0,0],
		[0,0,0,0,1,0,0,0,0,0],
		[0,0,0,0,1,0,0,0,0,0],
		[0,2,0,0,0,0,0,0,0,0],
		[0,0,0,0,1,0,0,3,0,0],
		[0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
		[5,5,5,5,5,5,5,5,5,5]         //NOTE: YOU CURRENTLY HAVE ONE MORE ARRAY THAN NECESSARY to block bottom easily
	];


var blockAlive = true;

var levelRows = 20; 
var levelCols = 10; 

//VARIABLES FOR PLAYER BLOCK OBJECT

var xPosStart = 5;
var yPosStart = 0;

var blockWidth = 32;
var blockHeight = 32;

var xPos = xPosStart;
var yPos = yPosStart;

var blockPosition = "horizontal";


var xPosPx = xPos * 32;
var yPosPx = yPos * 32;

var blockValue;         //want these start as random
var swingBlockValue; 
var blockColor;
var swingBlockColor;


function setBlockValues() {
    blockValue = Math.floor((Math.random() * 3) + 1);
    swingBlockValue  = Math.floor((Math.random() * 3) + 1);
    if(blockValue == 1) {
        blockColor = "blue"; 
    }else if (blockValue == 2) {
        blockColor = "green"; 
    } else if (blockValue == 3) {
        blockColor = "red";
        };
    if(swingBlockValue == 1) {
        swingBlockColor = "blue"; 
    }else if (swingBlockValue == 2) {
        swingBlockColor = "green"; 
    } else if (swingBlockValue == 3) {
        swingBlockColor = "red";
        };
    };



/*
NOTES: BLOCK VALUES TO COLORS
0 = none
1 = blue
2 = green 
3 = red
*/


//This function checks to see what position the block is in to detect the swing block
//maybe the positions should come from using math.floor on the pixels



function getSwingBlockCor() {
    if(blockPosition == "horizontal") {
        swingBlockXPosPx = xPosPx+32;
        swingBlockXPos = xPos + 1;
        swingBlockYPosPx = yPosPx;
        swingBlockYPos = yPos;
    } else if (blockPosition == "vertical") {
        swingBlockXPosPx = xPosPx;
        swingBlockXPos = xPos;
        swingBlockYPosPx = yPosPx + 32;
        swingBlockYPos = yPos + 1;
    } else if (blockPosition == "backwardsHorizontal") {
        swingBlockXPosPx = xPosPx - 32;
        swingBlockXPos = xPos - 1;
        swingBlockYPosPx = yPosPx;
        swingBlockYPos = yPos;
    } else if (blockPosition == "upsidedownVertical") {
        swingBlockXPosPx = xPosPx;
        swingBlockXPos = xPos;
        swingBlockYPosPx = yPosPx - 32;
        swingBlockYPos = yPos - 1;
    };
};





var fallSpeed = 2.5;   //.8 feels natural for play?  


rightPressed = false; 
leftPressed = false;
upPressed = false;
downPressed = false;







//RENDER LEVEL

function renderLevel(){
        for(i=0;i<levelRows;i++){
            for(j=0;j<levelCols;j++){
                if(level[i][j]==1){
                    ctx.beginPath();
                    ctx.rect([j]*32,[i]*32,32,32); 
                    ctx.fillStyle = "blue"; 
                    ctx.fill();
                ctx.closePath();
                } else if (level[i][j]==2){
                    ctx.beginPath();
                    ctx.rect([j]*32,[i]*32,32,32); 
                    ctx.fillStyle = "green"; 
                    ctx.fill();
                ctx.closePath();
            } else if (level[i][j]==3){
                    ctx.beginPath();
                    ctx.rect([j]*32,[i]*32,32,32); 
                    ctx.fillStyle = "red"; 
                    ctx.fill();
                ctx.closePath();
            };
        };
    };
};

//draws center block
function drawBrick() {
    ctx.beginPath();
    ctx.rect(xPosPx, yPosPx, blockWidth, blockHeight);
    ctx.fillStyle =  blockColor;
    ctx.fill();
    ctx.closePath();

    if (blockPosition == "horizontal") {
        ctx.beginPath();
        ctx.rect(xPosPx + 32, yPosPx, blockWidth, blockHeight);
        ctx.fillStyle =  swingBlockColor;
        ctx.fill();
        ctx.closePath();
    } else if (blockPosition == "vertical") {
        ctx.beginPath();
        ctx.rect(xPosPx, yPosPx + 32, blockWidth, blockHeight);
        ctx.fillStyle =  swingBlockColor;
        ctx.fill();
        ctx.closePath();
          } else if (blockPosition == "backwardsHorizontal") {
        ctx.beginPath();
        ctx.rect(xPosPx -32, yPosPx, blockWidth, blockHeight);
        ctx.fillStyle =  swingBlockColor;
        ctx.fill();
        ctx.closePath();
          } else if (blockPosition == "upsidedownVertical") {
        ctx.beginPath();
        ctx.rect(xPosPx, yPosPx -32, blockWidth, blockHeight);
        ctx.fillStyle =  swingBlockColor;
        ctx.fill();
        ctx.closePath();
    };
};



//DETECT WALLS  function to detect if left/right wall should block move

function detectWalls () {
    if(xPos == 0) {
       leftPressed = false; 
    } else if (xPos == 8 && blockPosition == "horizontal"){
        rightPressed = false;
    } else if (xPos == 0 && blockPosition == "backwardsHorizontal"){
        leftPressed = false;
    } else if (xPos == 9) {
        rightPressed = false;
    };
};


// function detectWalls () {
//     getSwingBlockCor();
//     if(xPos == 0) {
//        leftPressed = false; 
//     } else if (xPos == 9) {
//         rightPressed = false;
//     };
//     if (swingBlockXPos == 0){
//         leftPressed = false;
//     } else if (swingBlockXPos == 9){
//         rightPressed = false;
//     };
// };



//Need function to execute when block is detected that checks for other nearby things // 
/*
function detectAdjacent() {
    getSwingBlockCor();
    var yPosRounded = Math.floor(yPosPx/32);
    if(level[yPosRounded][xPos])                           //start by doing it 
};

*/



//DETECTS CONTACT BELOW AND SETS TO NEW VALUE
function detectBlock() {
       var yPosRounded = Math.floor(yPosPx/32);
        if(blockPosition == "horizontal") {
            if(level[yPosRounded + 1][xPos] !== 0 || level[yPosRounded + 1][xPos +1] !== 0 ) {   
                level[yPosRounded][xPos] = blockValue;
                level[yPosRounded][xPos+1] = swingBlockValue;
                resetBlock();
            };
        } else if(blockPosition == "vertical") {
            if(level[yPosRounded + 1][xPos] !== 0 || level[yPosRounded + 2][xPos] !== 0 ) {   
                level[yPosRounded][xPos] = blockValue;
                level[yPosRounded+1][xPos] = swingBlockValue;
                resetBlock();
            };
        } else if(blockPosition == "backwardsHorizontal") {
            if(level[yPosRounded + 1][xPos] !== 0 || level[yPosRounded + 1][xPos -1] !== 0 ) {   
                level[yPosRounded][xPos] = blockValue;
                level[yPosRounded][xPos-1] = swingBlockValue;
                resetBlock();
        };
    } else if(blockPosition == "upsidedownVertical") {
            if(level[yPosRounded + 1][xPos] !== 0 || level[yPosRounded][xPos] !== 0 ) {   
                level[yPosRounded][xPos] = blockValue;
                level[yPosRounded-1][xPos] = swingBlockValue;
                resetBlock();
        };
    };
};





//BY MAKING IT RESET THE X PX AND DETECTING BLOCK RIGHT AWAY, YOU CANNOT SLIDE THROUGH THINGS. LOOKS BETTER, BUT MAYBE BEST NOT TO DO THIS. 


var wiggleRoom = 20;



function checkGapRight() {
    getSwingBlockCor();                                          //swing block cor necessary?
    var yPosRounded = (Math.floor(yPosPx / 32)); 
    var swingBlockYPosRounded = Math.floor(swingBlockYPosPx / 32); 
    if (blockPosition == "horizontal") {
        if (level[yPosRounded + 2][xPos + 2] !== 0 && level[yPosRounded + 1][xPos + 2] == 0 && level[yPosRounded][xPos + 2] !== 0) {
            if (yPosPx % 32 > wiggleRoom) {
                xPos = xPos + 1;
                xPosPx = xPosPx + 32;
                yPosPx = (yPosRounded + 1) * 32; 
                yPos = yPosPx / 32;
                rightPressed = false;
                detectBlock();
            };
        };
    } else if (blockPosition == "vertical") {
        if (level[yPosRounded + 3][xPos + 1] !== 0 && level[yPosRounded + 2][xPos + 1] == 0 && level[yPosRounded + 1][xPos + 1] == 0 && level[yPosRounded][xPos + 1] !== 0) {
            if (yPosPx % 32 > wiggleRoom) {
                xPos = xPos + 1;
                xPosPx = xPosPx + 32;
                yPosPx = (yPosRounded + 1) * 32; 
                yPos = yPosPx / 32;
                rightPressed = false;
                detectBlock();
            };
        };
    } else if (blockPosition == "upsidedownVertical") {
        if (level[yPosRounded + 2][xPos + 1] !== 0 && level[yPosRounded + 1][xPos + 1] == 0 && level[yPosRounded][xPos + 1] == 0 && level[yPosRounded-1][xPos + 1] !== 0) {
            if (yPosPx % 32 > wiggleRoom) {
                xPos = xPos + 1;
                xPosPx = xPosPx + 32;
                yPosPx = (yPosRounded + 1) * 32; 
                yPos = yPosPx / 32;
                rightPressed = false;
                detectBlock();
            };
        };
    } else if (blockPosition == "backwardsHorizontal") {
        if (level[yPosRounded + 2][xPos + 1] !== 0 && level[yPosRounded + 1][xPos + 1] == 0 && level[yPosRounded][xPos + 1] !== 0) {
            if (yPosPx % 32 > wiggleRoom) {
                xPos = xPos + 1;
                xPosPx = xPosPx + 32;
                yPosPx = (yPosRounded + 1) * 32; 
                yPos = yPosPx / 32;
                rightPressed = false;
                detectBlock();
            };
        };
    };
};




//DETECT RIGHT  -- function checks if block is to the right and if so blocks it // also checks swing block 
function detectRight() {
    checkGapRight();
    getSwingBlockCor();           
     var yPosRounded = Math.floor(yPosPx/32);
     var swingBlockYPosRounded = Math.floor(swingBlockYPosPx/32);
        if(     level[yPosRounded][xPos + 1] !== 0   
            || level[yPosRounded + 1][xPos + 1] !== 0 
            || level[swingBlockYPosRounded][swingBlockXPos + 1]  !== 0 
            || level[swingBlockYPosRounded + 1][swingBlockXPos + 1] !== 0 ) {
            rightPressed=false; 
        } else {
            rightPressed=true; 
        };
    detectWalls();
};

//FUNCTION TO DETECT IF THERE IS A GAP TO THE LEFT OR RIGHT AND THEN ALLOWS MOVE TO THE LEFT/RIGHT IF SO 
// COULD THEN HAVE THIS CALLED IN THE OTHER FUNCTION AS AN ELSE IF CHECK BEFORE THE ACTUAL CHECK

//FIRST WRITE FUNCTION TO CHECK FOR THE GAP TO THE LEFT

function checkGapLeft() {
    getSwingBlockCor();
    var yPosRounded = (Math.floor(yPosPx / 32)); 
    var swingBlockYPosRounded = Math.floor(swingBlockYPosPx / 32); 
    if (blockPosition == "horizontal") {
        if (level[yPosRounded + 2][xPos - 1] !== 0 && level[yPosRounded + 1][xPos - 1] == 0 && level[yPosRounded][xPos - 1] !== 0) {
            if (yPosPx % 32 > wiggleRoom) {
                xPos = xPos - 1;
                xPosPx = xPosPx - 32;
                yPosPx = (yPosRounded + 1) * 32; 
                yPos = yPosPx / 32;
                leftPressed = false;
                detectBlock();
            };
        };
    } else if (blockPosition == "vertical") {
        if (level[yPosRounded + 3][xPos - 1] !== 0 && level[yPosRounded + 2][xPos - 1] == 0 && level[yPosRounded + 1][xPos - 1] == 0 && level[yPosRounded][xPos - 1] !== 0) {
            if (yPosPx % 32 > wiggleRoom) {
                xPos = xPos - 1;
                xPosPx = xPosPx - 32;
                yPosPx = (yPosRounded + 1) * 32; 
                yPos = yPosPx / 32;
                leftPressed = false;
                detectBlock();
            };
        };
    } else if (blockPosition == "upsidedownVertical") {
        if (level[yPosRounded + 2][xPos - 1] !== 0 && level[yPosRounded + 1][xPos - 1] == 0 && level[yPosRounded][xPos - 1] == 0 && level[yPosRounded-1][xPos - 1] !== 0) {
            if (yPosPx % 32 > wiggleRoom) {
                xPos = xPos - 1;
                xPosPx = xPosPx - 32;
                yPosPx = (yPosRounded + 1) * 32; 
                yPos = yPosPx / 32;
                leftPressed = false;
                detectBlock();
            };
        };
    } else if (blockPosition == "backwardsHorizontal") {
        if (level[yPosRounded + 2][xPos - 2] !== 0 && level[yPosRounded + 1][xPos - 2] == 0 && level[yPosRounded][xPos - 2] !== 0) {
            if (yPosPx % 32 > wiggleRoom) {
                xPos = xPos - 1;
                xPosPx = xPosPx - 32;
                yPosPx = (yPosRounded + 1) * 32; 
                yPos = yPosPx / 32;
                leftPressed = false;
                detectBlock();
            };
        };
    };
};





//DETECT LEFT  -- checks if block is to left and then blocks move, also checks swing block
function detectLeft() {
    checkGapLeft();
    getSwingBlockCor();  
    var yPosRounded = Math.floor(yPosPx/32);
    var swingBlockYPosRounded = Math.floor(swingBlockYPosPx/32);
    if(    level[yPosRounded][xPos -1] !== 0  
        || level[yPosRounded + 1][xPos - 1]  !== 0 
        || level[swingBlockYPosRounded][swingBlockXPos -1] !== 0  
        || level[swingBlockYPosRounded + 1][swingBlockXPos - 1] !== 0 ) {
            leftPressed=false; 
        } else {
            leftPressed=true; 
        };
   detectWalls();
};


    







    
    //WASD listeners
    
    document.addEventListener("keydown", function(e){
        console.log(e.keyCode);
        switch(e.keyCode){
            case 65:
                detectLeft();
                break;
            case 87:
                upPressed=true;
                break;
            case 68:
                detectRight();
                break;
            case 83:
                downPressed=true;
                break;
                case 32:
                resetBlock();
                break;
        }
    }, false);





    document.addEventListener("keyup", function(e){
        switch(e.keyCode){
            case 65:
                leftPressed=false;
                break;
            case 87:
                upPressed=false;
                break;
            case 68:
                rightPressed=false;
                break;
            case 83:
                downPressed=false;
                break;
        }
    }, false);
    


//function to Check if player is pressing left or right
function checkMove() {
    if(leftPressed){
        xPos--;
        leftPressed = false; 
        } else if (rightPressed) {
            xPos++;
            rightPressed = false;
        };
    };




//NOTE: NEED TO CHANGE THE ROTATE FUNCTION SO THAT IT WON'T ROTATE IF THE SWINGBLOCK OCCU[IED PART IS OCCUPIED (COULD WRITE A FUNCTION FOR THIS!)]


function checkCanRotateClockwise() {
    yPosRounded = Math.floor(yPosPx/32);
    if(blockPosition == "horizontal") {
        if(level[yPosRounded][xPos] == 0 && level[yPosRounded +1][xPos] == 0) {
            return true;
        } else {
            return false;
            };
    } else if(blockPosition == "vertical") {
        if( level[yPosRounded][xPos -1]  == 0 && level[yPosRounded + 1][xPos - 1] == 0) {
            return true;
        } else {
            return false;
            };
    } else if(blockPosition == "backwardsHorizontal") {
        if(level[yPosRounded][xPos] == 0 && level[yPosRounded - 1][xPos] == 0) {
            return true;
        } else {
            return false;
            };
    } else if(blockPosition == "upsidedownVertical") {
        if(level[yPosRounded][xPos + 1] == 0 && level[yPosRounded +1][xPos +1] == 0) {
            return true;
        } else {
            return false;
        };
    };
};



// ROTATE CLOCKWISE FUNCTION


function rotateClockwise() {
    if(upPressed) {
        var canRotate = checkCanRotateClockwise();
        if(blockPosition == "horizontal" && canRotate) {
            blockPosition = "vertical";
        } else if (blockPosition == "vertical"  && canRotate) {
            blockPosition = "backwardsHorizontal";
        } else if (blockPosition == "backwardsHorizontal" && canRotate) {
            blockPosition = "upsidedownVertical";
        } else if (blockPosition == "upsidedownVertical" && canRotate) {
            blockPosition = "horizontal";
        };
    };
    upPressed = false; 
};

// ROTATE CC FUNCTION

function checkCanRotateCounterClockwise() {
    yPosRounded = Math.floor(yPosPx/32);
    if(blockPosition == "horizontal") {
        if(level[yPosRounded][xPos] == 0 && level[yPosRounded -1][xPos] == 0) {
            return true;
        } else {
            return false;
            };
    } else if(blockPosition == "vertical") {
        if( level[yPosRounded][xPos +1]  == 0 && level[yPosRounded + 1][xPos + 1] == 0) {
            return true;
        } else {
            return false;
            };
    } else if(blockPosition == "backwardsHorizontal") {
        if(level[yPosRounded][xPos] == 0 && level[yPosRounded + 1][xPos] == 0) {
            return true;
        } else {
            return false;
            };
    } else if(blockPosition == "upsidedownVertical") {
        if(level[yPosRounded][xPos - 1] == 0 && level[yPosRounded +1][xPos -1] == 0) {
            return true;
        } else {
            return false;
        };
      };

    };

function rotateCounterClockwise() {
        if(downPressed) {
            var canRotate = checkCanRotateCounterClockwise();
            if(blockPosition == "horizontal" && canRotate) {
                blockPosition = "upsidedownVertical";
            } else if (blockPosition == "upsidedownVertical" && canRotate) {
                blockPosition = "backwardsHorizontal";
            } else if (blockPosition == "backwardsHorizontal" && canRotate) {
                blockPosition = "vertical";
            } else if (blockPosition == "vertical" && canRotate) {
                blockPosition = "horizontal";
        };   
    };
   downPressed = false;
};



function resetBlock() {                                 //RESTARTS PIECE AT TOP FOR TEST PURPOSES
            xPos = xPosStart; 
            yPos = yPosStart; 
            xPosPx = xPos*32; 
            yPosPx = yPos*32;
            blockPosition = "horizontal";
            blockAlive = true;
            setBlockValues();
};










setBlockValues();


//GAME LOOP HERE
function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);  // clears level
    
    rotateClockwise();
    rotateCounterClockwise();
    checkMove();
    detectBlock();
    
    renderLevel(); 
    drawBrick();


    yPosPx += fallSpeed;
    xPosPx = xPos*32;
    yPos = Math.floor(yPosPx/32)+1;

    requestAnimationFrame(draw);
};

draw(); 



