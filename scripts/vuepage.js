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
    })

    SNOWMAN_OBJ = new Vue({
        el: '#enterprise',
        data: {
            snowmanStyle: {
                top: null, 
                left: 122,
                ary: new Array(1,2,3)
            },
            ammo: 100,
            status: 0
        }
    });
}
