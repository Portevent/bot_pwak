class Item {
    static items = this.setupItemMap();

    static get(id) {
        return this.items.get(id);
    }

    static setupItemMap(){
        const items_list = require('./items.json');
        let items_map = new Map();
        for (let item of items_list.items) {
            items_map.set(item.id.toLowerCase(), item);
        }
        return items_map;
    }

}
module.exports = Item