class Item {
    static categories = require('./items.json');
    static items = this.setupItemMap();

    static get(id) {
        return this.items.get(id);
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

}
module.exports = Item