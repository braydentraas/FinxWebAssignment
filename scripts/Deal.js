class Deal {
    constructor(color, term, interest, baseMonthlyPayment) {
        this.color = color;
        this.term = term; // default
        this.baseInterest = interest; // default
        this.baseMonthlyPayment = baseMonthlyPayment; // default
        this.frequency = FREQUENCY.monthly;

        this.products = {};

        this.buyDownPoints = 0;
        this.maxBuyDownPoints = 7;

        this.lastSavedConfiguration = this.serialize();
    }

    serialize() {
        let obj = Object.assign({}, this);
        delete obj.lastSavedConfiguration;
        return JSON.stringify(obj);
    }

    markSaved() {
        this.lastSavedConfiguration = this.serialize();
    }

    isModified() {
        let newConfig = this.serialize();
        return this.lastSavedConfiguration !== newConfig;
    }

    getInterest() {
        return (this.baseInterest - (0.1 * this.buyDownPoints)).toFixed(2);
    }
    getPayment() {
        let monthlyValue = this.baseMonthlyPayment;
        $.each(this.products, function(id,val){
            let product = PRODUCTS.ids[id];
            if(val) monthlyValue += product.monthlyCost;
        })

        // let decreasePayments = monthlyValue * this.buyDownPoints;
        monthlyValue -= ((this.buyDownPoints * monthlyValue) / this.term)

        if(this.frequency === FREQUENCY.biweekly) {
            monthlyValue /= 2;
        }

        return monthlyValue;
    }

    addProduct(product) {
        if(product.id) {
            product = product.id;
        }
        this.products[product] = true;
    }
    removeProduct(product) {
        if(product.id) {
            product = product.id;
        }
        this.products[product] = false;
    }
    hasProduct(product) {
        if(product.id) {
            product = product.id;
        }
        return !!(this.products[product]); // double negative to turn undefined into false
    }
    toggleProduct(product) {
        if(product.id) {
            product = product.id;
        }
        let newVal = !(this.products[product]);
        if(newVal) {
            this.products[product] = newVal;
        } else {
            delete this.products[product]; // so serialization stays the same
        }
    }
}