
// populate model
var deals = {
    "1":        new Deal("orangered", 48, 6.79, 480.20),
    "quote":    new Deal("gray", 60, 5.29, 390.06),
    "2":        new Deal("dodgerblue", 72, 1.86, 388.64),
};

deals["2"].addProduct(PRODUCTS.warranty);
deals["2"].addProduct(PRODUCTS.tire_rim);
deals["2"].addProduct(PRODUCTS.keyfob);

$.each(deals, function(key, val){
    val.markSaved();
})


$(function(){

    // Load all products to DOM
    $.each(PRODUCTS.ids, function(key, value){
        let newListItem = $(".horizontal-product-to-clone").clone();
        newListItem.removeClass('horizontal-product-to-clone');

        newListItem
            .data('product_id', value.id)
            .addClass('product_' + value.id) // better performance querying css classes than data attributes
            .find('.grid-mini-module')
                .text(value.name);

        $('.horizontal-product-list').append(newListItem);

        // now do products tab on the right

        let newRow = "<tr><td><div onclick='toggleProduct(this)' class='round-cell round-product-cell product-"+value.id+"'  data-product_id='"+value.id+"'>"+value.name+"</div></td></tr>";
        $('.product-column.products .product-column-table')
            .append(newRow);


        let newBrochureNode = $('.tab-brochures .brochure-node-to-clone').clone();
        newBrochureNode.removeClass('brochure-node-to-clone');
        newBrochureNode.find('.brochure-title').text(value.name);
        newBrochureNode.data('product_id', value.id);
        newBrochureNode.addClass('brochure-node-product-'+value.id)

        $('.tab-brochures')
            .append(newBrochureNode);

    });

    for(let i = 0; i <= 30; i++) {
        $('.buy-down-points .product-column-table').append("<tr class='buy-down-points-"+i+"'><td><div class='round-cell' onclick='setBuyDownPoints("+i+")'>"+i+"</div></td></tr>")
    }


    loadDeals();
    loadProductsAndBuyDownPointsFromSelectedDeal();
})


function sendDeal() {
    if(!isOneDealSelected()) {
        alert("Please select one deal to send!");
        return;
    }
    alert("Sending configuration to sales agent!");
    $.each(deals, function(key,val){
       val.markSaved();
    });
    loadDeals();
    setTimeout(function(){
        triggerCall();
    }, 3000);
}

function toggleDeal(e) {
    let element = $(e);
    let wasSelected = element.hasClass('selected');
    let dealKey = element.data('option');

    if(wasSelected) {
        element.removeClass('selected'); // could do toggleClass()
        $('.option-column.option-'+dealKey).hide();
    } else {
        element.addClass('selected');
        $('.option-column.option-'+dealKey).show();
    }
    loadProductsAndBuyDownPointsFromSelectedDeal();
    loadDeals();
}

function loadDealToLeftPanelFromModel() {
    let selectedDealId = getSelectedDealId();
    if(!selectedDealId) return;
    let deal = deals[selectedDealId];
    if(!deal) return;

    // Do details
    $('#loan_term option[value='+deal.term+']').prop('selected', true)

    // Do product grids

}

// should call on load and for any change
function loadDealColumnFromModel(dealKey) {
    if(!isOneDealSelected()) {
        return;
    }
    if(!dealKey) {
        return;
    }
    let deal = deals[dealKey];
    if(!deal) {
        alert("Failed to load deal for key: "+dealKey);
        return;
    }



    // do right side column

    let dealColumn = $('.option-column.option-'+dealKey);
    if(!dealColumn) {
        alert("Failed to load deal column for key: "+dealKey);
        return;
    }

    dealColumn.find('.term-value').text(deal.term);
    dealColumn.find('.interest-value').text(deal.getInterest() + "%");
    dealColumn.find('.payment-value').text("$" + deal.getPayment().toFixed(2));

    dealColumn.find('.included-list')
        .html('');

    $.each(deal.products, function(id, value){
        if(value) {
            let product = PRODUCTS.ids[id];
            let ul = dealColumn.find('.included-list');
            ul.append("<li>"+product.name+"</li>");
        }
    });
}

function getSelectedDealId() {
    let selected =  $('.option-select-button.selected');
    if(!selected) return null;
    return selected.data('option');
}

function isOneDealSelected() {
    let selectedOption = $('.option-select-button.selected');
    if(!selectedOption) {
        return false;
    }
    return selectedOption.length <= 1;
}

function loadDeals() {
    // load deal info in DOM from model
    let modified = false;
    $.each(deals, function(key, value) {
        if(!modified && deals[key] && deals[key].isModified()) modified = true;
        loadDealColumnFromModel(key);
        $('.tab-products, .tab-brochures').removeClass('option-'+key);
    });

    if(modified) {
        $('.send-button').addClass('highlighted');
    } else {
        $('.send-button').removeClass('highlighted');
    }

    let selectedDealId = getSelectedDealId()
    if(selectedDealId) {
        $('.tab-products, .tab-brochures').addClass('option-'+selectedDealId);

    }

    loadDealToLeftPanelFromModel();
}

function loadProductsAndBuyDownPointsFromSelectedDeal() {
    if(!isOneDealSelected()) {
        return;
    }
    let selectedOption = $('.option-select-button.selected');

    let dealKey = selectedOption.data('option');
    let deal = deals[dealKey];
    if(!deal) {
        return;
    }

    // first set selected
    $('.grid-icon-table')
        .removeClass('selected')
        .each(function(){
            $(this).css('background-color', deal.color)
                .find('td')
                    .css('border-color', 'black');
        });

    $('.product-column.products .round-cell').removeClass('selected-colored');
    $('.tab-brochures .brochure-node').addClass('disabled');

    $.each(deal.products, function(id, val){
        if(val) {
            $('.product_'+id+' .grid-icon-table')
                .addClass('selected')
                .css('background-color', 'white')
                .find('td')
                    .css('border-color', deal.color);

            $('.product-column.products .round-cell.product-'+id).addClass('selected-colored');

            $('.tab-brochures .brochure-node-product-'+id).removeClass('disabled');

        }
    });

    // $('.buy-down-points .round-cell')
    $('.buy-down-points .round-cell')
        .removeClass("disabled")
        .removeClass('selected-colored');
    for(let i = 1; i <= 30; i++) {
        if(i > deal.maxBuyDownPoints) {
            $('.buy-down-points-'+i).find('.round-cell').addClass("disabled");
        } else if(i == deal.buyDownPoints) {
            $('.buy-down-points-'+i).find('.round-cell').addClass("selected-colored");
        } else {
            // default white
        }
    }



    // $('.grid-icon-table').css('deal.color
}


function showTab(button, panel) {
    $('.tab-panel').not(panel).hide();
    panel.show();

    $('button.tablinks').not(button).removeClass('active');
    $(button).addClass('active');
}

function setTerm(value) {
    let selectedOption = $('.option-select-button.selected');
    if(!selectedOption) {
        alert("Please select an option first!");
        return;
    }
    if(selectedOption.length > 1) {
        alert("More than one option selected!");
        return;
    }
    var dealKey = selectedOption.data('option');
    var deal = deals[dealKey];

    deal.term = value;

    loadDeals();
}
function setFrequency(value) {

    let dealKey = getSelectedDealId();
    if(!dealKey) {
        return;
    }
    let deal = deals[dealKey];

    deal.frequency = parseInt(value);

    loadDeals();
}

function toggleProduct(e) {
    if(!isOneDealSelected()) {
        alert("Please select one deal!");
        return;
    }
    let dealId = getSelectedDealId()
    if(!dealId) {
        alert("Failed to find deal...");
        return;
    }

    let element = $(e);
    let wasSelected = element.hasClass('selected');
    let productId = element.data('product_id');
    let product = PRODUCTS.ids[productId];

    let deal = deals[dealId];
    deal.toggleProduct(productId);

    loadProductsAndBuyDownPointsFromSelectedDeal();
    loadDeals();
}

function setBuyDownPoints(points) {
    if(!isOneDealSelected()) {
        alert("Please select one deal!");
        return;
    }
    let dealKey = getSelectedDealId();
    if(!dealKey) {
        return;
    }
    let deal = deals[dealKey];
    deal.buyDownPoints = points;
    loadProductsAndBuyDownPointsFromSelectedDeal();
    loadDeals();
}


function triggerCall() {
    $('#incoming_connection').show();
    $('#overlay').show();
}
function acceptCall() {
    $('#incoming_connection').hide();
    $('#overlay').hide();
}
function denyCall() {
    $('#incoming_connection').hide();
    $('#overlay').hide();
}
function openBrochure(e) {
    let element = $(e);
    let productId = element.data('product_id');
    let dealId = getSelectedDealId();
    if(!dealId) {
        alert("Failed to load deal");
        return;
    }
    let deal = deals[dealId];
    let product = PRODUCTS.ids[productId];

    $('#brochure_dialog .brochure-title').text(product.name);

    $('#brochure_dialog')
        .css('background-color', deal.hasProduct(productId) ? deal.color : "#777")
        .show();

    $('#overlay').show();
}
function closeBrochure() {
    $('#brochure_dialog').hide();
    $('#overlay').hide();
}