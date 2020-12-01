const fs = require("fs");

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
        this.inventory.get(userId).set(itemId, quantity);
        return quantity;
    }

    ///////////////////////////////////
    // Safe zone :

    userHasItems(userId) {
        return this.userExists(userId)
    }

    userHasItem(userId, itemId) {
        return this.userExists(userId) && this.hasItem(userId, itemId) && this.getItem(userId, itemId) > 0;
    }


    createUser(userId) {
        if(!this.userExists(userId)){
            this.resetUser(userId)
        }
    }

    getItemOfUser(userId, itemId, defaultValue = 0){
        return this.userHasItem(userId, itemId)?this.getItem(userId,itemId):defaultValue;
    }
    getTrueItemOfUser(userId, itemId, defaultValue = 0){
        return (this.userExists(userId) && this.hasItem(userId, itemId))?this.getItem(userId,itemId):defaultValue;
    }

    getItemsOfUser(userId){
        // Return a Map with all the items of the user
        return this.userExists(userId)?this.getItems(userId):new Map();
    }

    getInventoryOfUser(userId){
        // Return a Map with all the items of the user, filtered by Category
        if (this.userExists(userId)) {
            let inventory = require('./items.json'); // Fait exprès pour ne pas modifier par erreur la liste des items
            for (let category_id of Object.keys(inventory)) {
                for (let item of inventory[category_id].items) {
                    item.quantity = this.getItemOfUser(userId, item.id);
                }
            }
            return inventory;
        }

        else{
            return false;
        }
    }

    addItemToUser(userId, itemId, quantity = 1){
        if (this.userHasItem(userId, itemId)){
            quantity += this.getItemOfUser(userId, itemId);
        }


        this.createUser(userId);

        this.setItem(userId, itemId, quantity);
    }

    safeAddItemToUser(userId, itemId, quantity = 1){
        this.createUser(userId);
        return this.setItem(userId, itemId, Math.max(0, this.getTrueItemOfUser(userId, itemId, 0) + quantity));
    }

    setItemToUser(userId, itemId, quantity = 1){
        this.createUser(userId);

        this.setItem(userId, itemId, quantity);
    }

    export(filename = "save"){
        // Map to obj
        let obj = {};
        for(let user of this.inventory.keys()){
            obj[user] = Object.fromEntries(this.inventory.get(user));
        }

        fs.writeFile("./inventory/saves/" + filename + ".json", JSON.stringify(obj, null, 4), err => {
            if(err){
                console.log(err);
                fs.writeFile("./inventory/saves/" + filename + ".error", err, err2 => {
                    if(err2){
                        console.log(err2);
                    }
                });
            }
        });
    }

    import(filename = "save"){
        try{
            let saved_inventory = require("./saves/" + filename + ".json");
            this.inventory = new Map();
            for(let user of Object.keys(saved_inventory)){
                this.inventory.set(user, new Map(Object.entries(saved_inventory[user])));
            }
            return 0;
        }catch(e){
            return e;
        }
    }
}

module.exports = Inventory