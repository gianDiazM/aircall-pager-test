class Target {

    constructor(type) {
        if(!type){
            throw new Error("Target Type is mandatory to create instance")
        }
        this.type = type
    }

    getType(){
        return this.type
    }
}

module.exports = Target
