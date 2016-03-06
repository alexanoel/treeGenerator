	debug = false;

		if (document.body){
				var width = (document.body.clientWidth);
				var height = (document.body.clientHeight);
			}else{
				var width = (window.innerWidth);
				var height = (window.innerHeight);
			}
			
		document.getElementById('myCanvas').width = screen.width;
		document.getElementById('myCanvas').height = screen.height;

		//Points frequency
		var YRATIO =2;

		//Tree form
		var MAXSIDE = 8;
		var MINSIDE = 2;
		var MAXCOEF = 1.5;
		var MINCOEF = 0.5;

		var INITCOEF = 0.3;
		var INITSLOPE = 0;	

		var SHIVERx = 4;
		var SHIVERy = 1;

		/**
		 * Circle constructor, a circle makes part of a {@link Branch}
		 * @param xCoordinate the x coordinate of the circle (x position)
		 * @param yCoordinate the y coordinate of the circle (y position)
		 * @param width the with of the circle
		 */ 
		function Circle(xCoordinate, yCoordinate, width) {
			this.xCoordinate = xCoordinate;
			this.yCoordinate = yCoordinate;
			this.width = width;
			/**
			* Getter of the x coordinate
			* @return xCoordinate
			*/
			this.getX = function () {
				return this.xCoordinate;
			};
			/**
			* Getter of the y coordinate
			* @return yCoordinate
			*/
			this.getY = function () {
				return this.yCoordinate;
			};
			/**
			* Getter of the circle width
			* @return width
			*/
			this.getWitdh = function () {
				return this.width;
			};
			/**
			* Setter of the x coordinate
			* @param x new x coordinate for the circle
			*/
			this.setX = function (x) {
				   xCoordinate = x;
			};
			/**
			* Setter of the y coordinate
			* @param y new y coordinate for the circle
			*/   
			this.setY = function (y) {
				   yCoordinate = y;
			};
			
		}

		/**
		 * Branch constructor, a branch is composed by {@link Circle} and make part of a tree.
		 * @param width the width of the branch
		 * @param coef the speed coefficient of reduction of the width.
		 * @param xOrigin the initial x coordinate
		 * @param yOrigin the initial y coordinate
		 * @param slope the slope of the branch, the gap compared to the trunk
		 * @param side the direction of the branch : -1 for left and 1 for right
		 */ 
		function Branch(width, coef, xOrigin, yOrigin, slope, side) {
			this.width = width;
			this.coef = coef;
			this.slope = slope;
			this.side = side;
			this.circleArray = [new Circle(xOrigin, yOrigin)];
			
			/**
			* Getter of the width
			* @return width
			*/
			this.getWidth = function () {
				return this.width;
			};
			/**
			* Getter of the coefficient
			* @return coef
			*/ 
			this.getCoef = function () {
				return this.coef;
			};
			/**
			* Getter of the slope
			* @return slope
			*/
			this.getSlope = function () {
				return this.slope;
			};
			/**
			* Getter of the side
			* @return side
			*/
			this.getSide = function () {
				return this.side;
			};
			/**
			* Getter of the circle array
			* @return circleArray
			*/
			this.getCircle = function() {
				return this.circleArray[this.circleArray.length-1];
			};
			/**
			* Setter of the width
			* @param newWidth the new width of the branch
			*/ 
			this.setWidth = function (newWidth) {
				this.width = newWidth;
			};
			/**
			* Add a new circle to the branch, un {@link circleArray}
			* @param newCircle the ne circle to add, obecjt {@link Circle}
			*/
			this.addCircle = function (newCircle) {
				this.circleArray.push(newCircle);
			};
			/**
			* Draw the branch in the canvas
			*@param ctx the canvas where the branch will be drawn
			*/
			this.draw = function (ctx) {
				for(var i=0; i<this.circleArray.length;i++){
					if(debug){ alert("draw : "+this.circleArray[i].getX()+" "+ this.circleArray[i].getY()+" "+ this.width);}
					ctx.beginPath();
					ctx.arc(this.circleArray[i].getX(), this.circleArray[i].getY(), this.circleArray[i].width, 0 , 2*Math.PI);
					ctx.stroke();
				}
			};
			
		}
		 
		if(debug){ alert("begin");}

		//New canvas
		var c = document.getElementById("myCanvas");
		var ctx = c.getContext("2d");

		//First Branch of the tree
		var trunk = new Branch(50, INITCOEF, width/3, height/8, INITSLOPE, 1);
		var tree = [trunk];

		var newX;
		var newY;
		var newSlope;
		var newCoef;

		for(var i = 0; i<tree.length; i++) {
			if(debug){ alert("i : "+i+" tree.length : "+tree.length);}
			
			while(tree[i].getWidth()>1) {
				if(debug){ alert("tree[i].getWidth"+tree[i].getWidth());}
				
				tree[i].setWidth(tree[i].getWidth()-tree[i].getCoef());
				
				if(debug){ alert("tree[i].getWidth"+tree[i].getWidth());}
				
				newX = tree[i].getCircle().getX() +(tree[i].getSlope()*tree[i].getSide());
				newX = newX + ((Math.random() * (2*SHIVERx)) - SHIVERx);
				
				newY = tree[i].getCircle().getY()-YRATIO;
				newY = newY + ((Math.random() * SHIVERy) -SHIVERy);
				
				tree[i].addCircle(new Circle(newX, newY, tree[i].getWidth()));
				
				if(debug){ alert("newX : "+newX+" newY : "+newY);}
				
				if(tree[i].getWidth()<30) {
					if(Math.random() < 0.07) {
						var sidePlusOrMinus = Math.random() < 0.5 ? -1 : 1;
						newSlope = Math.floor(Math.random() * (MAXSIDE-MINSIDE)) + MINSIDE;
						newCoef = Math.floor(Math.random() * (MAXCOEF-MINCOEF)) + MINCOEF;
						tree.push(new Branch(tree[i].getWidth(), newCoef, tree[i].getCircle().getX(), tree[i].getCircle().getY(), newSlope, sidePlusOrMinus));
					}
				}
			}
			if(debug){ alert("draw branch : "+i);}
			tree[i].draw(ctx);
		}
