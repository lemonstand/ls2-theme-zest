//
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

    var base = $('base').attr('href');
	  var share_url = base + 'sharrre/';

    $('#sharrre .twitter').sharrre({
    	template: '<button class="twitter button small"><i class="fi-social-twitter medium"></i> &nbsp; {total}</button>',
    	share: {
    		twitter: true
    	},
    	enableHover: false,
    	enableTracking: true,
    	click: function(api, options) {
    		api.simulateClick();
    		api.openPopup('twitter');
    	}
    });
    $('#sharrre .facebook').sharrre({
    	template: '<button class="facebook button small"><span aria-hidden="true"><i class="fi-social-facebook medium"></i> &nbsp; {total}</span></button>',
    	share: {
    		facebook: true
    	},
    	enableHover: false,
    	enableTracking: true,
    	click: function(api, options) {
    		api.simulateClick();
    		api.openPopup('facebook');
    	}
    });
    $('#sharrre .googleplus').sharrre({
    	template: '<button class="googleplus button small"><span aria-hidden="true"><i class="fi-social-google-plus medium"></i> &nbsp; {total}</span></button>',
    	share: {
    		googlePlus: true
    	},
    	enableHover: false,
    	enableTracking: true,
    	click: function(api, options) {
    		api.simulateClick();
    		api.openPopup('googlePlus');
    	},
    	urlCurl: share_url
    });
    $('#sharrre .pinterest').sharrre({
    	template: '<button class="pinterest button small"><span aria-hidden="true"><i class="fi-social-pinterest medium"></i> &nbsp; {total}</span></button>',
    	share: {
    		pinterest: true
    	},
    	enableHover: false,
    	enableTracking: true,
    	click: function(api, options) {
    		api.simulateClick();
    		api.openPopup('pinterest');
    	},
    	urlCurl: share_url
    });

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
  $(window).on('onAfterAjaxUpdate', function(){
    $(document).foundationCustomForms();
    $("select[data-ajax-refresh]").change() // Forces Foundation to redraw the drop-down for states select elements after update
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
        $(this).sendRequest('shop:cart', {
          update: {'#cart-content': 'shop-cart-content', '#mini-cart': 'shop-minicart'},
          extraFields: {'set_coupon_code': 1}
        });
      }
    })

    //
    // Handle the Enter key in the Quantity field
    //
    $('#cart-content').on('keydown', 'input.quantity', function(ev) {
      if (ev.keyCode == 13) {
        $(this).sendRequest('shop:cart', {
          update: {'#cart-content': 'shop-cart-content', '#mini-cart': 'shop-minicart'}
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
      $(this).sendRequest('shop:onCheckoutShippingMethod', {
        update: {'#checkout-totals': 'shop-checkout-totals', '#mini-cart':'shop-minicart'}
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

    $(document).on('change', '#payment_method', function() {
      $(this).sendRequest('shop:onUpdatePaymentMethod', {
          update: {'#payment_form' : 'shop-paymentform'},
          onAfterUpdate: foundationCustomizePaymentForms
      });
    })

    $(document).on('click', '#copy_billing_to_shipping', function (){
      //data-ajax-handler="shop:onCopyBillingToShipping" data-ajax-update="#checkout-page=shop-checkoutaddress"
      $(this).sendRequest('shop:onCheckoutBillingInfo', {
          onAfterUpdate: function() {
            $(this).sendRequest('shop:onCopyBillingToShipping', {
              update: {'#checkout-page' : 'shop-checkout-address', '#mini-cart':'shop-minicart'}
            });
          }
      });
    })

    //
    // handle classing footer and header menu
    //
    $('.footer-menu').find("ul").first().addClass("nav-bar");
    $('.header-menu-bar').find("ul").first().addClass("nav-bar nav-bar-user");

    //
    // Handle responsive nav for mobile view
    //
    $('.header-menu-bar-mobile .icon').on("click", function(){
      $('.header-menu-bar-mobile-dropdown').toggleClass("menu-show");
    });

    //
    // Star rating
    //
    $('.rating > span').click(function() {
        var currentId = $(this).attr('id');
        if ( currentId === 'hate' ) {
            $('#hate').addClass('select');
            $( '#dont-like, #ok, #like, #love' ).removeClass('select');
            $('.rating > p').text( 'I hate it' );
            $("#item_rating").val('1');
        }
        if ( currentId === 'dont-like' ) {
            $( '#hate, #dont-like' ).addClass('select');
            $( '#ok, #like, #love' ).removeClass('select');
            $('.rating > p').text( 'I don\'t like it' );
            $("#item_rating").val('2');
        }
        if ( currentId === 'ok' ) {
            $( '#hate, #dont-like, #ok' ).addClass('select');
            $( '#like, #love' ).removeClass('select');
            $('.rating > p').text( 'It\'s ok' );
            $("#item_rating").val('3');
        }
        if ( currentId === 'like' ) {
            $( '#hate, #dont-like, #ok, #like' ).addClass('select');
            $( '#love' ).removeClass('select');
            $('.rating > p').text( 'I like it' );
            $("#item_rating").val('4');
        }
        if ( currentId === 'love' ) {
            $( '#hate, #dont-like, #ok, #like, #love' ).addClass('select');
            $('.rating > p').text( 'I love it' );
            $("#item_rating").val('5');
        }
        console.log($('#item_rating').val());
    });

    //
    // Review Modal
    //
    $(function() {

      $("#modal-1").on("change", function() {
        if ($(this).is(":checked")) {
          $("body").addClass("modal-open");
          $(".modal-form-fade-screen").addClass("modal-fade-open");
          console.log("modal-1 activated!");
        } else {
          $("body").removeClass("modal-open");
          $(".modal-form-fade-screen").removeClass("modal-fade-open");
        }
      });
      $("#modal-2").on("change", function() {
        if ($(this).is(":checked")) {
          $("body").addClass("modal-open");
          $(".modal-view-fade-screen").addClass("modal-fade-open");
          console.log("modal-2 activated!");
        } else {
          $("body").removeClass("modal-open");
          $(".modal-view-fade-screen").removeClass("modal-fade-open");
        }
      });

      //
      // Modal Links
      //
      $("#view-review").on("click", function() {
        $(".modal-state:checked").prop("checked", false).change();
        $("#modal-2").prop("checked", true).change();
      })
      $("#write-review").on("click", function() {
        $(".modal-state:checked").prop("checked", false).change();
        $("#modal-1").prop("checked", true).change();
      })

      //
      // Change from view-review modal to write-review modal
      //
      $("#write-review-inview").on("click", function() {
        $(".modal-state:checked").prop("checked", false).change();
        $("#modal-1").prop("checked", true).change();
      })

      //
      // Change from Sign-Up modal to Sign-In modal and visa-versa
      //
      $("#sign-up-inview").on("click", function() {
        $(".modal-state:checked").prop("checked", false).change();
        $("#modal-2").prop("checked", true).change();
      })
      $("#sign-in-inview").on("click", function() {
        $(".modal-state:checked").prop("checked", false).change();
        $("#modal-1").prop("checked", true).change();
      })

      $(".modal-fade-screen, .modal-close").on("click", function() {
        $(".modal-state:checked").prop("checked", false).change();
      });

      $(".modal-inner").on("click", function(e) {
        e.stopPropagation();
      });
    });

  });
})(jQuery);
