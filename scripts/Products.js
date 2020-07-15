var PRODUCTS = {
    ids: {}
};

class Product {
    constructor(id, name, monthlyCost) {
        this.id = id;
        this.name = name;
        this.monthlyCost = monthlyCost;
        // PRODUCTS[key] = this;
        PRODUCTS.ids[id] = this;
    }
}

PRODUCTS.tire_rim  = new Product(1, "Tire & Rim", 21.2);
PRODUCTS.warranty  = new Product(2, "Warranty", 29.1);
PRODUCTS.keyfob    = new Product(3, "KeyFob", 5.20);
PRODUCTS.chemicals = new Product(4, "Chemicals",7.18);
PRODUCTS.gap       = new Product(5, "Gap", 10.6);
PRODUCTS.walkaway  = new Product(6, "WalkaWay", 10.2);
PRODUCTS.lifeinsurance = new Product(7, "Life Insurance", 92.2);
PRODUCTS.disabilityinsurance = new Product(8, "Disability Insurance", 89.2);
PRODUCTS.criticalillnessinsurance = new Product(9, "Critical Illness Insurance", 109.2);
PRODUCTS.pocketguard = new Product(10, "Pocket Guard", 5);
PRODUCTS.fabricprotection = new Product(11, "Fabric Protection", 16);
PRODUCTS.leatherprotection = new Product(12, "Leather Protection", 19);
PRODUCTS.paintprotection = new Product(13, "Leather Protection", 21);
PRODUCTS.undercoating = new Product(14, "Undercoating", 13);
PRODUCTS.rustprotection = new Product(15, "Rust Protection", 12);

