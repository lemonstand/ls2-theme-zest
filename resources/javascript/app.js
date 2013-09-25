//
// Zurb Foundation stuff
//
;(function ($, window, undefined) {
  'use strict';

  var $doc = $(document),
      Modernizr = window.Modernizr;

  $(document).ready(function() {
    $.fn.foundationAlerts           ? $doc.foundationAlerts() : null;
    $.fn.foundationButtons          ? $doc.foundationButtons() : null;
    $.fn.foundationAccordion        ? $doc.foundationAccordion() : null;
    $.fn.foundationNavigation       ? $doc.foundationNavigation() : null;
    $.fn.foundationTopBar           ? $doc.foundationTopBar() : null;
    $.fn.foundationCustomForms      ? $doc.foundationCustomForms() : null;
    $.fn.foundationMediaQueryViewer ? $doc.foundationMediaQueryViewer() : null;
    $.fn.foundationTabs             ? $doc.foundationTabs({callback : $.foundation.customForms.appendCustomMarkup}) : null;
    $.fn.foundationTooltips         ? $doc.foundationTooltips() : null;
    $.fn.foundationMagellan         ? $doc.foundationMagellan() : null;
    $.fn.foundationClearing         ? $doc.foundationClearing() : null;

    $.fn.placeholder                ? $('input, textarea').placeholder() : null;
  });

  // UNCOMMENT THE LINE YOU WANT BELOW IF YOU WANT IE8 SUPPORT AND ARE USING .block-grids
  // $('.block-grid.two-up>li:nth-child(2n+1)').css({clear: 'both'});
  // $('.block-grid.three-up>li:nth-child(3n+1)').css({clear: 'both'});
  // $('.block-grid.four-up>li:nth-child(4n+1)').css({clear: 'both'});
  // $('.block-grid.five-up>li:nth-child(5n+1)').css({clear: 'both'});

  // Hide address bar on mobile devices (except if #hash present, so we don't mess up deep linking).
  if (Modernizr.touch && !window.location.hash) {
    $(window).load(function () {
      setTimeout(function () {
        window.scrollTo(0, 1);
      }, 0);
    });
  }

})(jQuery, this);

//
// Theme scripts
//

(function ($) {
  // 
  // Automatically apply Foundation custom form styles when an AJAX request finishes
  //
  $(window).on('onAjaxUpdateFinished', function(){
    $(document).foundationCustomForms();
  });

  $(document).ready(function() {
    // 
    // Handle thumbnail clicks on the Product page
    //
    $('#product-page').on('click', 'div.item-images ul a', function(){
      $('div.big-image img', $(this).closest('.item-images')).attr('src', this.href);

      return false;
    })

    //
    // Handle the Enter key in the Coupon field
    //
    $('#cart-content').on('keydown', 'input#coupon', function(ev) {
      if (ev.keyCode == 13) {
        $(this).sendRequest('on_action', {
          update: {'cart-content': 'shop:cart_content', 'mini-cart': 'shop:mini_cart'},
          extraFields: {'set_coupon_code': 1}
        });
      }
    }) 

    //
    // Handle the Enter key in the Quantity field
    //
    $('#cart-content').on('keydown', 'input.quantity', function(ev) {
      if (ev.keyCode == 13) {
        $(this).sendRequest('on_action', {
          update: {'cart-content': 'shop:cart_content', 'mini-cart': 'shop:mini_cart'}
        });
      }
    });

    //
    // Handle the shipping option radio button clicks
    //
    $('#checkout-page').on('change', '#shipping-methods input', function(){
      // When the shipping method is shipping we want to update the 
      // order totals area on the Checkout page. The native Checkout 
      // action does all the calculations.
      //
      $(this).sendRequest('on_action', {
        update: {'checkout-totals': 'shop:checkout_totals'}
      })
    });

    //
    // Apply Foundation form customization to payment forms
    //
    function foundationCustomizePaymentForms() {
      $('#payment_form form').addClass('custom');
      $(document).foundationCustomForms();
      $('#payment_form form div.custom.dropdown').css('width', '100%');
      $('#payment_form form input[type=button], #payment_form form input[type=submit]').addClass('button');
    }

    if ($('#payment_form').length) {
      foundationCustomizePaymentForms();
    }

    $('#payment_method').change(function(){
      $(this).sendRequest('shop:on_updatePaymentMethod', {
        update: {'payment_form': 'shop:payment_form'},
        onAfterUpdate: foundationCustomizePaymentForms
      });
    })

    // 
    // Automatically update state lists when a country is changed
    //
    $(document).on('change', '[data-state-selector]', function(){
      var 
        stateSelectorId = $(this).data('state-selector');
        updateList = {};
        
      updateList[stateSelectorId] = 'shop:state_options';

      $(this).sendRequest('shop:on_updateStateList', {
          extraFields: {
            country: $(this).val(),
            current_state: $(this).data('current-state')
          },
          update: updateList,
          onAfterUpdate: function() {
            $('#'+stateSelectorId).change(); // Forces Foundation to redraw the drop-down element
          }
      });
    });
  });
})(jQuery);