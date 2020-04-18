function createVueObjects() {
    SCORE_OBJ = new Vue({
        el: '#score',
        data: {
            score: 0,
			lives: 1
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
                left: 122
            }
        }
    });
}
