class Item {
    static categories = this.require();
    static items = this.setupItemMap();


    static require(){
        delete require.cache[require.resolve("./items.json")];
        return require('./items.json');
    }

    static load(){
        this.categories = this.require();
        this.items = this.setupItemMap();
    }


    static get(id) {
        return this.items.get(id);
    }
    static exists(id) {
        return this.items.has(id);
    }
    static getCategory(id) {
        return this.categories[id];
    }

    static setupItemMap(){
        let items_map = new Map();
        for (let category_id of Object.keys(this.categories)) {
            for (let item of this.categories[category_id].items) {
                item.category = category_id;
                items_map.set(item.id.toLowerCase(), item);
            }
        }

        return items_map;
    }

    static getFromName(name){
        for (let item of this.items.values()) {
            for (let language in item.name){
                if(item.name[language] === name){
                    return item;
                }
            }
        }
    }
}
module.exports = Item