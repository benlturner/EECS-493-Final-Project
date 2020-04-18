function createVueObjects() {
    SCORE_OBJ = new Vue({
        el: '#score',
        data: {
            score: 0
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
                lives: 1
            }
        }
    });
}
