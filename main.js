/**@type {Tile[][]} */
var board = [[]];

class Entity {
    constructor(onStepHere) {
        this.onStepHere = onStepHere;
        this.type = 'generic'
    }
}

function display(char, color) {
    return {
        char:char,
        color:color
    }
}

const game = {
    renderDist: 7,
    display: {
        width:500,
        height:500,
    }
}
game.display.fontSize = Math.min(game.display.width, game.display.height)/(game.renderDist * 2);

const Terr = {
    mountain:display('M','brown'),
    plain:display(' \u2022','green'),
    interest:display("\u03c8",'gold'),
    swamp:display('s','olive'),
    //pit:display('\u058D',"black"),
    wall:display('X','darkgray'),
    village:display("V","orange"),
    desert:display("D",'tan'),
    water:display("\u2248", 'blue')
}

/*
\u26AB
*/

const player = {
    x:0,y:0,
    hasBoat:false
}

class Tile{
    constructor(terrain, ...thingsHere) {
        if(terrain instanceof Entity) {
            thingsHere.unshift(terrain);
            terrain = undefined;
        }
        /**@type {Entity[]} */
        this.thingsHere = thingsHere;
        if(terrain != undefined) {
            this.terrain = terrain;
            this.color = terrain.color;
        } else {
            //let keys = Object.keys(Terr);
            //this.terrain = Terr[keys[ keys.length * Math.random() << 0]];
            this.terrain = Terr.plain
        }
    }
    add(e) {
        this.thingsHere.push(e);
    }
    get display() {
        let isP = getCoordsOf(this).equals(v(player.x,player.y));
        return display(
            (isP) ? '@': this.terrain.char,
            (isP)?'steelblue':this.terrain.color
        );
    }
}

function getCoordsOf(x){
    return getCoordsOfIn(x, board);
}

function getCoordsOfIn(x, arr){
    for(let i = 0; i < arr.length; i++)
        for(let j = 0; j <arr[i].length; j++)
            if(arr[i][j] == x)
                return v(i,j)
    return v(-1,-1);
}

function v(x = 0, y = 0) {
    return {x:x, y:y, equals(o){return (this.x == o.x &&this.y == o.y);}};
}

function BoardMaker(width, height, startX, startY) {
    var outBoard = [[]];
    for(let i=0;i<height;i++){
        outBoard[i]=[];
        for(let j=0;j<width;j++)
            outBoard[i][j] = new Tile();
    }

    return {
        /**@type {Tile[][]} */
        arr:outBoard,
        start:v(startX, startY),
        get(x, y) {
            if(x<0||y<0||x>=this.arr[0].length||y>=this.arr.length)
                return false
            return this.arr[y][x];
        },
        add(x, y, what) {
            let t = get(x, y);
            if(t) {
                t
            }

            return this;
        },
        finalize() {
            player.x = startX;
            player.y = startY;
            return this.arr;
        }
    }
}

board = BoardMaker(15,15,2,2).finalize();
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

(function setup() {
    document.body.appendChild(canvas);
    canvas.width = game.display.width;
    canvas.height = game.display.height;
    canvas.style.border = '2px black solid';
})();

function draw() {
    
    let w = game.display.width;
    let h = game.display.height;
    let rd = game.renderDist;
    let dw = w / (2*rd+1);
    let dh = h / (2*rd+1);
    
    ctx.clearRect(0,0,w,h);
    function g(x, y) {
        if(x<0||y<0||x>=board[0].length||y>=board.length)
            return display("X", 'black');
        return board[x][y].display;
    }
    for (let i = 0; i < rd*2+1; i++) {
        for(let j = 0; j < rd*2+1; j++){
            let d = g(player.x - rd + i, player.y - rd + j);
            ctx.fillStyle = d.color;
            ctx.font = game.display.fontSize + 'px Times New Roman';
            ctx.fillText(d.char,Math.floor(i*dw+.5*dw) - game.display.fontSize/2 + 5, Math.floor(j*dh+.5*dh)+game.display.fontSize/2 - 5);
        }
    }
}
draw()

document.addEventListener('keydown', e=>{
    if((e.key == 'ArrowDown' || e.key == "s") && canMove(player.x, player.y + 1)) {
        player.y++;
    }
    else if ((e.key == 'ArrowRight' || e.key == 'd') && canMove(player.x + 1, player.y)) {
        player.x ++;
    }
    else if((e.key == 'ArrowUp' || e.key == 'w') && canMove(player.x, player.y - 1)) {
        player.y--;
    }
    else if ((e.key == 'ArrowLeft' || e.key == 'a') && canMove(player.x - 1, player.y)) {
        player.x--;
    }
    draw();
})

function canMove(x, y) {
    if(x<0||y<0||x>=board[0].length||y>=board.length)
            return false;
    return (board[x][y].terrain == Terr.wall || (board[x][y].terrain == Terr.water&&!player.hasBoat)) ? false: true;
}