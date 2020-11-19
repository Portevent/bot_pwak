class Inventory {

    inventory = new Map();

    userExist(userId) {
        return this.inventory.contains(userId)
    }

    hasItem(userId, itemId){
        return this.inventory.get(userId).contains(itemId);
    }

    resetUser(userId) {
        this.inventory.set(userId, new Map());
    }

    getItem(userId, itemId){
        return this.inventory.get(userId).get(itemId);
    }

    setItem(userId, itemId, quantity = 1){
        return this.inventory.get(userId).set(itemId, quantity);
    }

    ///////////////////////////////////
    // Safe zone :

    createUser(userId) {
        if(!this.userExist(userId)){
            this.resetUser(userId)
        }
    }

    userHasItem(userId, itemId) {
        return this.userExist(userId) && this.hasItem(userId, itemId);
    }

    getItemOfUser(userId, itemId){
        return this.userHasItem(userId, itemId)?this.getItem(userId,itemId):0;
    }

    addItemToUser(userId, itemId, quantity = 1){
        if (this.userHasItem(userId, itemId)){
            this.setItem(userId, itemId, quantity + this.getItemOfUser(userId, itemId));
        }

        else {
            if(!this.userExist(userId)) this.createUser(userId);

            this.setItem(userId, itemId, quantity);
        }
    }


}