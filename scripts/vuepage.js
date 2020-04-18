function createVueObjects() {
    /*new Vue({
		el: '#this_one',
		data: {
			active: false
		}
		})
	*/
	SCORE_OBJ = new Vue({
        el: '#score',
        data: {
            score: 0
		}
    });
	
	LIVES_OBJ = new Vue({
		el: '#lives',
		data: {
			lives: 1
		}
	});
	
    LEVEL_OBJ = new Vue({
        el: '#level',
        data: {
            level: 1
        }
    });

    SNOWMAN_OBJ = new Vue({
        el: '#enterprise',
        data: {
            snowmanStyle: {
                top: null,
                left: 122,
				pic: "img/defaultSnowman.png"
            }
        }
    });
	
	OUTFIT1_OBJ = new Vue({
		el: '#outfit1',
		data: {
			outfitStyle: {
				position: "absolute",
				border: "none",
				top: 10,
				left: 10,
			},
			pic: "img/snowman2locked.png",
			condition: "locked",
			price: 10000
		},
		methods: {
			handleClick: function() {
				switch(this.condition) {
					case "locked": {
						if (SCORE_OBJ.score >= this.price) {
							SCORE_OBJ.score -= this.price;
							this.pic = "img/snowman2.png";
							this.condition = "unlocked";
							console.log("unlocked outfit 1");
						}
						break;
					}
					case "unlocked": {
						SNOWMAN_OBJ.snowmanStyle.pic = "img/snowman2.png";
						this.condition = "equipped";
						this.outfitStyle.border = "solid blue 10px"
						console.log("equipped outfit 1");
						if (OUTFIT2_OBJ.condition === "equipped") {
							OUTFIT2_OBJ.condition = "unlocked";
							OUTFIT2_OBJ.outfitStyle.border = "none";
						}
						break;
					}
					case "equipped": {
						SNOWMAN_OBJ.snowmanStyle.pic = "img/defaultSnowman.png";
						this.outfitStyle.border = "none";
						this.condition = "unlocked";
						console.log("unequipped outfit 1");
					}
				}
			}
		}
	});
	
	OUTFIT2_OBJ = new Vue({
		el: '#outfit2',
		data: {
			outfitStyle: {
				position: "absolute",
				border: "none",
				top: 10,
				left: 110,
			},
			pic: "img/snowman3locked.png",
			condition: "locked",
			price: 50000
		},
		methods: {
			handleClick: function() {
				switch(this.condition) {
					case "locked": {
						if (SCORE_OBJ.score >= this.price) {
							SCORE_OBJ.score -= this.price;
							this.pic = "img/snowman3.png";
							this.condition = "unlocked";
							console.log("unlocked outfit 2");
						}
						break;
					}
					case "unlocked": {
						SNOWMAN_OBJ.snowmanStyle.pic = "img/snowman3.png";
						this.condition = "equipped";
						this.outfitStyle.border = "solid blue 10px"
						console.log("equipped outfit 2");
						if (OUTFIT1_OBJ.condition === "equipped") {
							OUTFIT1_OBJ.condition = "unlocked";
							OUTFIT1_OBJ.outfitStyle.border = "none";
						}
						break;
					}
					case "equipped": {
						SNOWMAN_OBJ.snowmanStyle.pic = "img/defaultSnowman.png";
						this.outfitStyle.border = "none";
						this.condition = "unlocked";
						console.log("unequipped outfit 2");
						
					}
				}
			}
		}
	});
	
	MORE_LIVES = new Vue({
		el: '#moreLives',
		data: {
			lifeStyle: {
				position: "absolute",
				border: "none",
				top: 10,
				left: 210,
			},
			pic: "img/life.png",
			price: 5000
		},
		methods: {
			handleClick: function() {
				if (SCORE_OBJ.score >= this.price) {
					SCORE_OBJ.score -= this.price;
					LIVES_OBJ.lives += 1;
					this.price += 5000;
					console.log("Bought another life");
				}
			}
		}
	});
	
	DOUBLE_SHOT_OBJ = new Vue({
		el: '#doubleShot',
		data: {
			shotStyle: {
				position: "absolute",
				border: "none",
				top: 10,
				left: 310,
			},
			pic: "img/double_shot_locked.png",
			condition: "locked",
			price: 10000
		},
		methods: {
			handleClick: function() {
				switch(this.condition) {
					case "locked": {
						if (SCORE_OBJ.score >= this.price) {
							SCORE_OBJ.score -= this.price;
							this.pic = "img/double_shot.png";
							this.condition = "unlocked";
							console.log("unlocked doubleshot");
						}
						break;
					}
					case "unlocked": {
						if (NUM_EQUIPPED < 3) {
							this.condition = "equipped";
							this.shotStyle.border = "solid blue 10px"
							NUM_EQUIPPED += 1;
							NUM_SNOWBALLS = 2;
							console.log("equipped doubleshot");
						}
						break;
					}
					case "equipped": {
						if (TRIPLE_SHOT_OBJ.condition === "equipped") {
							NUM_EQUIPPED -= 1;
							TRIPLE_SHOT_OBJ.shotStyle.border = "none";
							TRIPLE_SHOT_OBJ.condition = "unlocked";
							console.log("unequipped tripleshot");
						}
						NUM_EQUIPPED -= 1;
						NUM_SNOWBALLS = 1;
						this.shotStyle.border = "none";
						this.condition = "unlocked";
						console.log("unequipped doubleshot");
						
					}
				}
			},
			show_info() {
				$('#popds').css(display, "block");
			},
			hide_info() {
				$('#popds').css(display, "none");
			}
		}
	});
	
	TRIPLE_SHOT_OBJ = new Vue({
		el: '#tripleShot',
		data: {
			shotStyle: {
				position: "absolute",
				border: "none",
				top: 10,
				left: 410,
			},
			pic: "img/triple_shot_locked.png",
			condition: "locked",
			price: 20000
		},
		methods: {
			handleClick: function() {
				switch(this.condition) {
					case "locked": {
						if (SCORE_OBJ.score >= this.price && DOUBLE_SHOT_OBJ.condition != "locked") {
							SCORE_OBJ.score -= this.price;
							this.pic = "img/triple_shot.png";
							this.condition = "unlocked";
							console.log("unlocked tripleshot");
						}
						break;
					}
					case "unlocked": {
						if (NUM_EQUIPPED < 3 && DOUBLE_SHOT_OBJ.condition === "equipped") {
							this.condition = "equipped";
							this.shotStyle.border = "solid blue 10px"
							NUM_EQUIPPED += 1;
							NUM_SNOWBALLS = 3;
							console.log("equipped tripleshot");
						}
						break;
					}
					case "equipped": {
						NUM_EQUIPPED -= 1;
						NUM_SNOWBALLS = 2;
						this.shotStyle.border = "none";
						this.condition = "unlocked";
						console.log("unequipped tripleshot");
						
					}
				}
			}
		}
	});
	
	PIERCING1_OBJ = new Vue({
		el: '#piercing1',
		data: {
			shotStyle: {
				position: "absolute",
				border: "none",
				top: 10,
				left: 510,
			},
			pic: "img/pierce1_locked.png",
			condition: "locked",
			price: 10000
		},
		methods: {
			handleClick: function() {
				switch(this.condition) {
					case "locked": {
						if (SCORE_OBJ.score >= this.price) {
							SCORE_OBJ.score -= this.price;
							this.pic = "img/pierce1.png";
							this.condition = "unlocked";
							console.log("unlocked piercing");
						}
						break;
					}
					case "unlocked": {
						if (NUM_EQUIPPED < 3) {
							this.condition = "equipped";
							this.shotStyle.border = "solid blue 10px"
							NUM_EQUIPPED += 1;
							SNOWBALL_DURABILITY = 2;
							console.log("equipped piercing");
						}
						break;
					}
					case "equipped": {
						if (PIERCING2_OBJ.condition === "equipped") {
							NUM_EQUIPPED -= 1;
							PIERCING2_OBJ.shotStyle.border = "none";
							PIERCING2_OBJ.condition = "unlocked";
							console.log("unequipped piercing 2");
						}
						NUM_EQUIPPED -= 1;
						SNOWBALL_DURABILITY = 1;
						this.shotStyle.border = "none";
						this.condition = "unlocked";
						console.log("unequipped piercing");
						
					}
				}
			}
		}
	});
	
	PIERCING2_OBJ = new Vue({
		el: '#piercing2',
		data: {
			shotStyle: {
				position: "absolute",
				border: "none",
				top: 10,
				left: 610,
			},
			pic: "img/pierce2_locked.png",
			condition: "locked",
			price: 20000
		},
		methods: {
			handleClick: function() {
				switch(this.condition) {
					case "locked": {
						if (SCORE_OBJ.score >= this.price && PIERCING1_OBJ.condition != "locked") {
							SCORE_OBJ.score -= this.price;
							this.pic = "img/pierce2.png";
							this.condition = "unlocked";
							console.log("unlocked piercing 2");
						}
						break;
					}
					case "unlocked": {
						if (NUM_EQUIPPED < 3 && PIERCING1_OBJ.condition === "equipped") {
							this.condition = "equipped";
							this.shotStyle.border = "solid blue 10px"
							NUM_EQUIPPED += 1;
							SNOWBALL_DURABILITY = 3;
							console.log("equipped piercing 2");
						}
						break;
					}
					case "equipped": {
						NUM_EQUIPPED -= 1;
						SNOWBALL_DURABILITY = 2;
						this.shotStyle.border = "none";
						this.condition = "unlocked";
						console.log("unequipped piercing 2");
						
					}
				}
			}
		}
	});
	
	GHOST_OBJ = new Vue({
		el: '#ghost',
		data: {
			shotStyle: {
				position: "absolute",
				border: "none",
				top: 10,
				left: 710,
			},
			pic: "img/ghost_ball_locked.png",
			condition: "locked",
			price: 10000
		},
		methods: {
			handleClick: function() {
				switch(this.condition) {
					case "locked": {
						if (SCORE_OBJ.score >= this.price) {
							SCORE_OBJ.score -= this.price;
							this.pic = "img/ghost_ball.png";
							this.condition = "unlocked";
							console.log("unlocked ghost shot");
						}
						break;
					}
					case "unlocked": {
						if (NUM_EQUIPPED < 3) {
							this.condition = "equipped";
							this.shotStyle.border = "solid blue 10px"
							NUM_EQUIPPED += 1;
							GHOST_SNOWBALL = true;
							console.log("equipped ghost shot");
						}
						break;
					}
					case "equipped": {
						NUM_EQUIPPED -= 1;
						GHOST_SNOWBALL = false;
						this.shotStyle.border = "none";
						this.condition = "unlocked";
						console.log("unequipped ghost shot");
						
					}
				}
			}
		}
	});
	
	LARGE_OBJ = new Vue({
		el: '#largeBall',
		data: {
			shotStyle: {
				position: "absolute",
				border: "none",
				top: 10,
				left: 710,
			},
			pic: "img/large_locked.png",
			condition: "locked",
			price: 10000
		},
		methods: {
			handleClick: function() {
				switch(this.condition) {
					case "locked": {
						if (SCORE_OBJ.score >= this.price) {
							SCORE_OBJ.score -= this.price;
							this.pic = "img/large.png";
							this.condition = "unlocked";
							console.log("unlocked large snowball");
						}
						break;
					}
					case "unlocked": {
						if (NUM_EQUIPPED < 3) {
							this.condition = "equipped";
							this.shotStyle.border = "solid blue 10px"
							NUM_EQUIPPED += 1;
							SNOWBALL_SIZE = 35;
							console.log("equipped large snowball");
						}
						break;
					}
					case "equipped": {
						if (HUGE_OBJ.condition === "equipped") {
							NUM_EQUIPPED -= 1;
							HUGE_OBJ.shotStyle.border = "none";
							HUGE_OBJ.condition = "unlocked";
							console.log("unequipped huge snowball");
						}
						NUM_EQUIPPED -= 1;
						SNOWBALL_SIZE = 20;
						this.shotStyle.border = "none";
						this.condition = "unlocked";
						console.log("unequipped large snowball");
						
					}
				}
			}
		}
	});
	
	HUGE_OBJ = new Vue({
		el: '#hugeBall',
		data: {
			shotStyle: {
				position: "absolute",
				border: "none",
				top: 10,
				left: 810,
			},
			pic: "img/huge_locked.png",
			condition: "locked",
			price: 20000
		},
		methods: {
			handleClick: function() {
				switch(this.condition) {
					case "locked": {
						if (SCORE_OBJ.score >= this.price && LARGE_OBJ.condition != "locked") {
							SCORE_OBJ.score -= this.price;
							this.pic = "img/huge.png";
							this.condition = "unlocked";
							console.log("unlocked huge snowball");
						}
						break;
					}
					case "unlocked": {
						if (NUM_EQUIPPED < 3 && LARGE_OBJ.condition === "equipped") {
							this.condition = "equipped";
							this.shotStyle.border = "solid blue 10px"
							NUM_EQUIPPED += 1;
							SNOWBALL_SIZE = 50;
							console.log("equipped huge snowball");
						}
						break;
					}
					case "equipped": {
						NUM_EQUIPPED -= 1;
						SNOWBALL_SIZE = 35;
						this.shotStyle.border = "none";
						this.condition = "unlocked";
						console.log("unequipped huge snowball");
						
					}
				}
			}
		}
	});
	
	FAST1_OBJ = new Vue({
		el: '#fast1',
		data: {
			shotStyle: {
				position: "absolute",
				border: "none",
				top: 110,
				left: 10,
			},
			pic: "img/fast1_locked.png",
			condition: "locked",
			price: 10000
		},
		methods: {
			handleClick: function() {
				switch(this.condition) {
					case "locked": {
						if (SCORE_OBJ.score >= this.price) {
							SCORE_OBJ.score -= this.price;
							this.pic = "img/fast1.png";
							this.condition = "unlocked";
							console.log("unlocked fast reload");
						}
						break;
					}
					case "unlocked": {
						if (NUM_EQUIPPED < 3) {
							this.condition = "equipped";
							this.shotStyle.border = "solid blue 10px"
							NUM_EQUIPPED += 1;
							var SNOWBALL_RECHARGE = 300;
							console.log("equipped fast reload");
						}
						break;
					}
					case "equipped": {
						if (FAST2_OBJ.condition === "equipped") {
							NUM_EQUIPPED -= 1;
							FAST2_OBJ.shotStyle.border = "none";
							FAST2_OBJ.condition = "unlocked";
							console.log("unequipped faster reload");
						}
						NUM_EQUIPPED -= 1;
						var SNOWBALL_RECHARGE = 400;
						this.shotStyle.border = "none";
						this.condition = "unlocked";
						console.log("unequipped fast reload");
						
					}
				}
			}
		}
	});
	
	FAST2_OBJ = new Vue({
		el: '#fast2',
		data: {
			shotStyle: {
				position: "absolute",
				border: "none",
				top: 110,
				left: 110,
			},
			pic: "img/fast2_locked.png",
			condition: "locked",
			price: 20000
		},
		methods: {
			handleClick: function() {
				switch(this.condition) {
					case "locked": {
						if (SCORE_OBJ.score >= this.price && FAST1_OBJ.condition != "locked") {
							SCORE_OBJ.score -= this.price;
							this.pic = "img/fast2.png";
							this.condition = "unlocked";
							console.log("unlocked faster reload");
						}
						break;
					}
					case "unlocked": {
						if (NUM_EQUIPPED < 3 && FAST1_OBJ.condition === "equipped") {
							this.condition = "equipped";
							this.shotStyle.border = "solid blue 10px"
							NUM_EQUIPPED += 1;
							var SNOWBALL_RECHARGE = 200;
							console.log("equipped faster snowball");
						}
						break;
					}
					case "equipped": {
						NUM_EQUIPPED -= 1;
						var SNOWBALL_RECHARGE = 300;
						this.shotStyle.border = "none";
						this.condition = "unlocked";
						console.log("unequipped faster reload");
						
					}
				}
			}
		}
	});
}
