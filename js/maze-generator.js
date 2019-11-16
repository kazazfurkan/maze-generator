
var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");
var canvasWidth = canvas.width;
var canvasHeight = canvas.height;


/*  ************************************************ */
// setup

size = 25; // canvas size  (size*size)
w = canvasWidth / size; // cell size
var mazeBackground = "#FFFFFF";
var frequency = 0;

// create Cell objects
var Cells = new Array(size);
for(var x = 0 ; x < size ; x++){
    Cells[x] = new Array(size);
    for(var y = 0 ; y < size ; y++){
        Cells[x][y] = new Cell(x,y);
    }
}

var current = Cells[0][0];
var visitedList = [current];
current.isVisited = true;

/*  ************************************************  */
// update canvas

setInterval(() => {
    ctx.clearRect(0,0,canvasWidth,canvasHeight);
    draw();
    var next = current.checkNeighbors();
    console.log("Visited:" + visitedList.length + "/" + size*size);
    
    // neighbor available for next move
    if(next){
        next.isVisited = true;
        next.previousCell = current;

        removeWalls(current,next);
        
        current = next;
        visitedList.push(current);
        fillCell(current.x, current.y , "#17fc03");
    }
    // no neighbor available but there are still unvisited cells
    else if(visitedList.length !== size*size){ 
        next = current.previousCell;         
        current = next;
        fillCell(current.x, current.y , "#17fc03");
    }
    // no cell remained unvisited
    else{ 
        clearInterval("1");
        console.log("COMPLETED!");
    }


}, frequency);


/* ************************************************** */

// draws all cells to canvas
function draw(){

    for(var i = 0 ; i < size ; i++){
        for(var j = 0 ; j < size ; j++){
         Cells[i][j].show();
        }
    }
}



// Cell object constructor
function Cell (x,y){
    this.x = x;
    this.y = y;

    this.isVisited = false;

    this.previousCell;

    this.walls = {
        n: true,
        e: true,
        s: true,
        w: true  
    };

    // to draw each cell to canvas
    this.show = function(){
        var x = this.x*w;
        var y = this.y*w;

        ctx.beginPath();
        
        if(this.walls.n){
            drawLine(x  ,y  ,x+w,y  );
        }

        if(this.walls.e){
            drawLine(x+w,y  ,x+w,y+w);
        }
        
        if(this.walls.s){
            drawLine(x+w,y+w,x  ,y+w);
        }
        
        if(this.walls.w){
            drawLine(x  ,y+w,x  ,y  );
        }
        
        ctx.strokeStyle = "black";
        ctx.stroke();
        
        ctx.closePath();

        // if cell visited : paint
        if(this.isVisited){
            fillCell(this.x, this.y, mazeBackground);
        }
    }

    // returns random and unvisited neighbor or false
    this.checkNeighbors = function(){
        var neighbors = [];
        
        //left neighbor
        var left = x  > 0 ? Cells[x-1][y] : false ;
        if(left && !left.isVisited){
            neighbors.push(left);
        }

        //right neighbor
        var right = x < size - 1 ? Cells[x+1][y] : false;
        if( right && !right.isVisited){
            neighbors.push(right);
        }

        //top neighbor
        var top =  y > 0 ? Cells[x][y-1] : false;
        if(top && !top.isVisited){
            neighbors.push(top);
        }

        //bottom neighbor
        var bottom = y < size -1 ? Cells[x][y+1] : false;
        if(bottom  && !bottom.isVisited){
            neighbors.push(bottom);
        }
    
        // pick a random neighbor to visit
        if(neighbors.length > 0){
            var r  = Math.floor(Math.random()* neighbors.length);
            return neighbors[r];
        }else{
            return false;
        }

    };

}

// function to draw each individual line
// calling stroke for each line seperately 
// reduce the performance
function drawLine (x1,y1,x2,y2){
    ctx.moveTo(x1,y1);
    ctx.lineTo(x2,y2);
}

function fillCell(x,y,color){
    ctx.fillStyle = color;
    ctx.fillRect(x*w, y*w, w, w);
}

// removes the walls -between cells- while moving 
function removeWalls(currentCell, nextCell){
    
    if(nextCell.x - currentCell.x > 0){ //if moved right
        currentCell.walls.e = false;
        nextCell.walls.w = false
    }else if(nextCell.x - currentCell.x < 0){ //if moved left
        currentCell.walls.w = false;
        nextCell.walls.e = false
    }

    if(nextCell.y - currentCell.y > 0){ //if moved down
        currentCell.walls.s = false;
        nextCell.walls.n = false;
    }else if(nextCell.y - currentCell.y < 0){ //if moved up
        currentCell.walls.n = false;
        nextCell.walls.s = false
    }
}
