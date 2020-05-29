if (!Array.prototype.last){
    Array.prototype.last = function(){
        return this[this.length - 1];
    };
};


let count = 0;
let sizes;
const NUM_DIGITS = 10;
const timeCount = 50;
const maxCount = (1 << NUM_DIGITS) - 1;
const disks = [];
const sticks = [[], [], []];
let lastState;

function setup() {
	const cnv = createCanvas(windowWidth, windowHeight);
	rectMode(CENTER);
	sizes = [20, width / 6];

	for (let i = 0; i < NUM_DIGITS; i++) {	
		disks[i] = new Disk(i);
	}

	for (let i = 0; i < NUM_DIGITS; i++) {
		sticks[0][i] = NUM_DIGITS - i - 1;
	}

	lastState = addZeros(count.toString(2))
	
	nextCount();
}

function draw() {
	
	background(0);
	stroke(255);
	fill(255);
	textSize(32);
	text(lastState, 70, 100);
	text("This is binary Hanoi tower solver", 300, 100);

	// render all disks
	for (let i = 0; i < sticks.length; i++) {
		for (let j = 0; j < sticks[i].length; j++) {
			const ind = sticks[i][j];
			disks[ind].show(i, j);	
		}
	}


}

function compareStates(st0, st1) {
	for (let i = 0; i < st0.length; i++) {
		if(st0[i] !== st1[i]){
			return st0.length - i - 1;
		}
	}
	return -1;
}

function moveDisk(ind) {

	const start = disks[ind].i;

	let end = ( start + 1 ) % 3;
	if(sticks[end].last() < ind) {
		end = ( start + 2 ) % 3;
		if(sticks[end].last() < ind) {
			return false;
		}
	}

	const elem = sticks[start].pop();
	sticks[end].push(elem);

	return true;
}

function addZeros(s) {
	return ('0'.repeat(NUM_DIGITS) + s).slice(-NUM_DIGITS);
}


function nextCount() {
	setTimeout(() => {
		count++;
		const oldState = lastState;
		lastState = addZeros(count.toString(2))
		if( moveDisk(compareStates(oldState, lastState)) ) {
			if(count < maxCount) {
				nextCount();
			}
		} else {
			console.log('some error');
		}

	}, timeCount);
}



class Disk{
	
	constructor(ind) {
		this.ind = ind;
		this.width = map(this.ind, 0, NUM_DIGITS, sizes[0], sizes[1]);
		this.height = sizes[1] / 10;
		this.i = 0;
		this.j = ind;
	}

	show(i, j) {
		this.i = i;
		this.j = j;
		this.pos = createVector(width * (i + .5) / 3, height - (j + 1) * this.height);
		fill(map(this.ind, 0, NUM_DIGITS, 0, 255));
		rect(this.pos.x, this.pos.y, this.width, this.height);
	}

}