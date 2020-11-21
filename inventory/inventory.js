class Inventory {
    constructor() {
        this.inventory = new Map();
    }

    userExists(userId) {
        return this.inventory.has(userId)
    }

    resetUser(userId) {
        this.inventory.set(userId, new Map());
    }

    getItems(userId){
        return this.inventory.get(userId);
    }

    hasItem(userId, itemId){
        return this.inventory.get(userId).has(itemId);
    }

    getItem(userId, itemId){
        return this.inventory.get(userId).get(itemId);
    }

    setItem(userId, itemId, quantity = 1){
        return this.inventory.get(userId).set(itemId, quantity);
    }

    ///////////////////////////////////
    // Safe zone :

    userHasItems(userId) {
        return this.userExists(userId)
    }

    userHasItem(userId, itemId) {
        return this.userExists(userId) && this.hasItem(userId, itemId);
    }


    createUser(userId) {
        if(!this.userExists(userId)){
            this.resetUser(userId)
        }
    }

    getItemOfUser(userId, itemId){
        return this.userHasItem(userId, itemId)?this.getItem(userId,itemId):0;
    }

    getItemsOfUser(userId, itemId){
        return this.userExists(userId)?this.getItems(userId):{};
    }

    addItemToUser(userId, itemId, quantity = 1){

        if (this.userHasItem(userId, itemId)){
            quantity += this.getItemOfUser(userId, itemId);
        }


        this.createUser(userId);

        this.setItem(userId, itemId, quantity);
    }
}

module.exports = Inventory