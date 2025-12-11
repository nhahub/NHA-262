const MerchantApp = (() => {
  'use strict';
  const API_BASE_URL = 'https://cartify.runasp.net/api';

  const sectionLoaders = Object.freeze({
    Dashboard: loadDashboard,
    Promotion: loadPromotion,
    Customer: loadCustomer,
    Order: loadOrder,
    Category: loadCategory,
    Subcategory: loadSubcategory,
    Profile: loadProfile,
    Products: loadProductsList,
    Orders: loadOrders,
    Inventory: loadInventory,
    Transactions: loadTransactions
  });

  const ATTRIBUTE_DEFINITIONS = {
    electronics: [
      {
        name: "Mobiles",
        attributes: [
          { name: "Brand" },
          { name: "Model" },
          { name: "Storage Capacity", unit: "GB" },
          { name: "RAM", unit: "GB" },
          { name: "Processor" },
          { name: "Battery", unit: "mAh" },
          { name: "Camera", unit: "MP" },
          { name: "Color" },
          { name: "Operating System" },
        ],
      },
      {
        name: "Laptops",
        attributes: [
          { name: "Brand" },
          { name: "Model" },
          { name: "Processor" },
          { name: "RAM", unit: "GB" },
          { name: "Storage Capacity", unit: "GB" },
          { name: "Graphics Card" },
          { name: "Screen Size", unit: "inch" },
          { name: "Operating System" },
          { name: "Color" },
        ],
      },
      {
        name: "Cameras",
        attributes: [
          { name: "Brand" },
          { name: "Model" },
          { name: "Resolution", unit: "MP" },
          { name: "Lens Type" },
          { name: "Sensor Type" },
          { name: "Battery", unit: "mAh" },
          { name: "Weight", unit: "g" },
        ],
      },
      {
        name: "Audio Devices",
        attributes: [
          { name: "Brand" },
          { name: "Type" },
          { name: "Model" },
          { name: "Connectivity" },
          { name: "Battery Life", unit: "hours" },
          { name: "Color" },
        ],
      },
      {
        name: "Accessories",
        attributes: [
          { name: "Type" },
          { name: "Compatibility" },
          { name: "Material" },
          { name: "Color" },
          { name: "Brand" },
        ],
      },
      {
        name: "Gaming Consoles",
        attributes: [
          { name: "Brand" },
          { name: "Model" },
          { name: "Generation" },
          { name: "Storage Capacity", unit: "GB" },
          { name: "Color" },
        ],
      },
    ],

    fashion: [
      {
        name: "Men's Clothing",
        attributes: [
          { name: "Brand" },
          { name: "Category" },
          { name: "Size" },
          { name: "Color" },
          { name: "Material" },
          { name: "Fit" },
          { name: "Style" },
        ],
      },
      {
        name: "Women's Clothing",
        attributes: [
          { name: "Brand" },
          { name: "Category" },
          { name: "Size" },
          { name: "Color" },
          { name: "Material" },
          { name: "Fit" },
          { name: "Style" },
        ],
      },
      {
        name: "Kids' Wear",
        attributes: [
          { name: "Brand" },
          { name: "Category" },
          { name: "Size" },
          { name: "Color" },
          { name: "Material" },
          { name: "Age Group" },
        ],
      },
      {
        name: "Footwear",
        attributes: [
          { name: "Brand" },
          { name: "Category" },
          { name: "Size", unit: "EU" },
          { name: "Color" },
          { name: "Material" },
          { name: "Style" },
        ],
      },
      {
        name: "Watches",
        attributes: [
          { name: "Brand" },
          { name: "Type" },
          { name: "Model" },
          { name: "Material" },
          { name: "Color" },
          { name: "Water Resistance", unit: "m" },
        ],
      },
      {
        name: "Bags & Accessories",
        attributes: [
          { name: "Brand" },
          { name: "Type" },
          { name: "Material" },
          { name: "Color" },
          { name: "Size" },
        ],
      },
    ],

    "home-furniture": [
      {
        name: "Furniture",
        attributes: [
          { name: "Type" },
          { name: "Material" },
          { name: "Color" },
          { name: "Dimensions", unit: "cm" },
          { name: "Brand" },
          { name: "Style" },
        ],
      },
      {
        name: "Kitchen & Dining",
        attributes: [
          { name: "Type" },
          { name: "Material" },
          { name: "Brand" },
          { name: "Dimensions", unit: "cm" },
          { name: "Color" },
        ],
      },
      {
        name: "Decor",
        attributes: [
          { name: "Type" },
          { name: "Style" },
          { name: "Material" },
          { name: "Color" },
          { name: "Dimensions", unit: "cm" },
        ],
      },
      {
        name: "Appliances",
        attributes: [
          { name: "Brand" },
          { name: "Type" },
          { name: "Model" },
          { name: "Power", unit: "W" },
          { name: "Capacity", unit: "L" },
          { name: "Warranty", unit: "Years" },
        ],
      },
      {
        name: "Lighting",
        attributes: [
          { name: "Type" },
          { name: "Brand" },
          { name: "Wattage", unit: "W" },
          { name: "Color" },
          { name: "Material" },
          { name: "Style" },
        ],
      },
    ],

    "beauty-care": [
      {
        name: "Skincare",
        attributes: [
          { name: "Brand" },
          { name: "Product Type" },
          { name: "Skin Type" },
          { name: "Ingredients" },
          { name: "Size", unit: "ml" },
        ],
      },
      {
        name: "Makeup",
        attributes: [
          { name: "Brand" },
          { name: "Product Type" },
          { name: "Shade" },
          { name: "Finish" },
          { name: "Ingredients" },
          { name: "Size", unit: "ml" },
        ],
      },
      {
        name: "Haircare",
        attributes: [
          { name: "Brand" },
          { name: "Product Type" },
          { name: "Hair Type" },
          { name: "Ingredients" },
          { name: "Size", unit: "ml" },
        ],
      },
      {
        name: "Fragrances",
        attributes: [
          { name: "Brand" },
          { name: "Type" },
          { name: "Fragrance Notes" },
          { name: "Size", unit: "ml" },
          { name: "Concentration" },
        ],
      },
      {
        name: "Men's Grooming",
        attributes: [
          { name: "Brand" },
          { name: "Product Type" },
          { name: "Skin Type" },
          { name: "Ingredients" },
          { name: "Size", unit: "ml" },
        ],
      },
      {
        name: "Wellness",
        attributes: [
          { name: "Brand" },
          { name: "Product Type" },
          { name: "Key Ingredients" },
          { name: "Usage" },
          { name: "Size" },
        ],
      },
    ],

    sports: [
      {
        name: "Sportswear",
        attributes: [
          { name: "Brand" },
          { name: "Type" },
          { name: "Size" },
          { name: "Color" },
          { name: "Material" },
        ],
      },
      {
        name: "Equipment",
        attributes: [
          { name: "Sport" },
          { name: "Brand" },
          { name: "Material" },
          { name: "Size" },
          { name: "Usage Level" },
        ],
      },
      {
        name: "Footwear",
        attributes: [
          { name: "Brand" },
          { name: "Type" },
          { name: "Size" },
          { name: "Material" },
          { name: "Color" },
        ],
      },
      {
        name: "Outdoor Gear",
        attributes: [
          { name: "Type" },
          { name: "Brand" },
          { name: "Material" },
          { name: "Size" },
          { name: "Features" },
        ],
      },
      {
        name: "Fitness",
        attributes: [
          { name: "Type" },
          { name: "Brand" },
          { name: "Size" },
          { name: "Material" },
          { name: "Usage" },
        ],
      },
      {
        name: "Personal Care",
        attributes: [
          { name: "Type" },
          { name: "Brand" },
          { name: "Size" },
          { name: "Ingredients" },
          { name: "Usage" },
        ],
      },
    ],
  };

  function initializeMerchantApp() {
    if (!ensureMerchantAccess()) return;
    setRoleMode(ROLE_MODES.MERCHANT);
    bindLogoutHandler();
    bindNavigation();
    initFileInputPlugin();
    initProductWizard();
    bindAttributeHandlers();
    bindRoleSwitcher();
    setInitialSection();
  }

  function bindLogoutHandler() {
    $('#logout1').off('click.merchant').on('click.merchant', handleLogout);
  }

  function handleLogout(e) {
    e.preventDefault();
    localStorage.removeItem("Auth");
    sessionStorage.removeItem("Auth");
    setRoleMode(null);
    window.location.href = "login.html";
  }

  function bindNavigation() {
    $(".nav-link").off('click.merchant').on('click.merchant', function (e) {
      e.preventDefault();
      const $link = $(this);
      const target = $link.data("target");
      setActiveNav($link);
      showSection(target);
    });
  }

  function bindRoleSwitcher() {
    const $switch = $('#switchRole');
    if (!$switch.length) return;
    const hasShopperMode = getCurrentUserRoles().some(role => role && role !== MERCHANT_ROLE_NAME);
    const label = hasShopperMode ? 'Switch to Shopping Mode' : 'Go to Storefront';
    $switch.find('.switch-role-label').text(label);
    $switch.off('click.merchant').on('click.merchant', function(e) {
      e.preventDefault();
      setRoleMode(ROLE_MODES.CUSTOMER);
      window.location.href = "index.html";
    });
  }

  function setActiveNav($link) {
    $(".nav-link").removeClass("active");
    $link.addClass("active");
  }

  function setInitialSection() {
    const $defaultNav = $('.nav-link[data-target="Dashboard"]');
    if ($defaultNav.length) {
      setActiveNav($defaultNav);
    }
    showSection("Dashboard");
  }

  function showSection(target) {
    hideProductWizard();
    const loader = sectionLoaders[target];
    if (typeof loader !== 'function') {
      console.warn(`No loader registered for section "${target}"`);
      return;
    }
    loader();
  }

  function hideProductWizard() {
    $("#productWizardContainer").hide();
  }

  function initFileInputPlugin() {
    if (!$.fn.fileinput) {
      console.warn("fileinput plugin is not available on the page.");
      return;
    }

    const $input = $("#input-pd");
    if (!$input.length) return;

    if ($input.data("fileinput")) {
      $input.fileinput("destroy");
    }

    $input.fileinput({
      uploadUrl: "/file-upload-batch/1", // adjust to your server
      uploadAsync: true,
      showPreview: true,
      browseClass: "btn-custom",
      removeClass: "btn btn-danger",
      maxFileCount: 5,
      previewFileType: "any",
      theme: "fas",
      fileActionSettings: {
        removeIcon: '<i class="bi bi-x-lg"></i>',
        uploadIcon: '<i class="bi bi-upload"></i>',
        zoomIcon: '<i class="bi bi-eye"></i>',
        dragIcon: '<i class="bi bi-arrows-move"></i>',
      },
    });
  }

  function initProductWizard() {
    $("#nextStep1").off('click.merchant').on('click.merchant', function (e) {
      e.preventDefault();
      goToStep("#productStep1", "#productStep2");
    });
    $("#nextStep2").off('click.merchant').on('click.merchant', function (e) {
      e.preventDefault();
      goToStep("#productStep2", "#productStep3");
    });
    $("#prevStep1").off('click.merchant').on('click.merchant', function (e) {
      e.preventDefault();
      goToStep("#productStep2", "#productStep1", "100%", "50%");
    });
    $("#prevStep2").off('click.merchant').on('click.merchant', function (e) {
      e.preventDefault();
      goToStep("#productStep3", "#productStep2");
    });
  }

  function bindAttributeHandlers() {
    $("#category").off('change.merchant').on('change.merchant', handleCategoryChange);
    $("#type").off('change.merchant').on('change.merchant', handleTypeChange);
  }

  function handleCategoryChange() {
    const subs = ATTRIBUTE_DEFINITIONS[$("#category").val()] || [];
    const $sub = $("#type");
    $sub.empty().append('<option value="" selected disabled hidden>Choose Type</option>');
    $("#attributesRow").empty();
    $.each(subs, (i, v) => {
      $sub.append(`<option value="${i}">${v.name}</option>`);
    });
  }

  function handleTypeChange() {
    const selectedType = $("#type").val();
    const categoryKey = $("#category").val();
    const subs = ATTRIBUTE_DEFINITIONS[categoryKey]?.[selectedType]?.attributes || [];
    const $container = $("#attributesRow");
    $container.empty();

    for (let i = 0; i < subs.length; i += 3) {
      const row = $('<div class="row mb-3"></div>');
      row.append(makeAttributeColumn(subs[i]));
      row.append(makeAttributeColumn(subs[i + 1]));
      row.append(makeAttributeColumn(subs[i + 2]));
      $container.append(row);
    }
  }

  function makeAttributeColumn(attr) {
    if (!attr) return "";
    if (attr.unit) {
      return `
        <div class="col">
          <label class="form-label">${attr.name}</label>
          <div class="input-group">
            <input type="text" class="form-control" name="${attr.name}" placeholder="${attr.name}" />
            <span class="input-group-text">${attr.unit}</span>
          </div>
        </div>
      `;
    }
    return `
      <div class="col">
        <label class="form-label">${attr.name}</label>
        <input type="text" class="form-control" name="${attr.name}" placeholder="${attr.name}" />
      </div>
    `;
  }

  function goToStep(hideStep, showStep, widthFrom = "50%", widthTo = "100%") {
    $(hideStep).hide();
    $(showStep)
      .show()
      .css({ width: widthFrom, opacity: 0 })
      .animate({ width: widthTo, opacity: 1 }, 400);
  }

  // Get Auth Token
  function getAuthToken() {
    const authData = JSON.parse(localStorage.getItem('Auth') || sessionStorage.getItem('Auth') || '{}');
    return authData.jwt || '';
  }

  // ==================== NOTIFICATION SYSTEM ====================
  function showNotification(message, type = 'success') {
    $('.custom-notification').remove();
    const icon = type === 'success' ? '<i class="bi bi-check-circle-fill"></i>' : 
                 type === 'error' ? '<i class="bi bi-x-circle-fill"></i>' : 
                 '<i class="bi bi-info-circle-fill"></i>';
    const notification = $(`
      <div class="custom-notification ${type}">
        <div class="notification-content">
          <span class="notification-icon">${icon}</span>
          <span class="notification-message">${message}</span>
          <button class="notification-close"><i class="bi bi-x"></i></button>
        </div>
      </div>
    `);
    $('body').append(notification);
    notification.fadeIn(300);
    notification.find('.notification-close').on('click', function() {
      notification.fadeOut(300, function() { $(this).remove(); });
    });
    setTimeout(() => {
      notification.fadeOut(300, function() { $(this).remove(); });
    }, 4000);
  }

  // ==================== CONFIRMATION MODAL ====================
  function showConfirmModal(title, message, onConfirm) {
    const modal = $(`
      <div class="modal fade" id="confirmModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header bg-warning">
              <h5 class="modal-title"><i class="bi bi-exclamation-triangle me-2"></i>${title}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body"><p>${message}</p></div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="button" class="btn btn-danger" id="confirmBtn">Confirm</button>
            </div>
          </div>
        </div>
      </div>
    `);
    $('body').append(modal);
    const bsModal = new bootstrap.Modal(document.getElementById('confirmModal'));
    bsModal.show();
    $('#confirmBtn').on('click', function() {
      onConfirm();
      bsModal.hide();
    });
    $('#confirmModal').on('hidden.bs.modal', function() { $(this).remove(); });
  }

  // -------------------- [Product Categories and Attributes Data] --------------------
  Object.assign(ATTRIBUTE_DEFINITIONS, {
    electronics: [
      {
        name: "Mobiles",
        attributes: [
          { name: "Brand" },
          { name: "Model" },
          { name: "Storage Capacity", unit: "GB" },
          { name: "RAM", unit: "GB" },
          { name: "Processor" },
          { name: "Battery", unit: "mAh" },
          { name: "Camera", unit: "MP" },
          { name: "Color" },
          { name: "Operating System" },
        ],
      },
      {
        name: "Laptops",
        attributes: [
          { name: "Brand" },
          { name: "Model" },
          { name: "Processor" },
          { name: "RAM", unit: "GB" },
          { name: "Storage Capacity", unit: "GB" },
          { name: "Graphics Card" },
          { name: "Screen Size", unit: "inch" },
          { name: "Operating System" },
          { name: "Color" },
        ],
      },
      {
        name: "Cameras",
        attributes: [
          { name: "Brand" },
          { name: "Model" },
          { name: "Resolution", unit: "MP" },
          { name: "Lens Type" },
          { name: "Sensor Type" },
          { name: "Battery", unit: "mAh" },
          { name: "Weight", unit: "g" },
        ],
      },
      {
        name: "Audio Devices",
        attributes: [
          { name: "Brand" },
          { name: "Type" },
          { name: "Model" },
          { name: "Connectivity" },
          { name: "Battery Life", unit: "hours" },
          { name: "Color" },
        ],
      },
      {
        name: "Accessories",
        attributes: [
          { name: "Type" },
          { name: "Compatibility" },
          { name: "Material" },
          { name: "Color" },
          { name: "Brand" },
        ],
      },
      {
        name: "Gaming Consoles",
        attributes: [
          { name: "Brand" },
          { name: "Model" },
          { name: "Generation" },
          { name: "Storage Capacity", unit: "GB" },
          { name: "Color" },
        ],
      },
    ],

    fashion: [
      {
        name: "Men's Clothing",
        attributes: [
          { name: "Brand" },
          { name: "Category" },
          { name: "Size" },
          { name: "Color" },
          { name: "Material" },
          { name: "Fit" },
          { name: "Style" },
        ],
      },
      {
        name: "Women's Clothing",
        attributes: [
          { name: "Brand" },
          { name: "Category" },
          { name: "Size" },
          { name: "Color" },
          { name: "Material" },
          { name: "Fit" },
          { name: "Style" },
        ],
      },
      {
        name: "Kids' Wear",
        attributes: [
          { name: "Brand" },
          { name: "Category" },
          { name: "Size" },
          { name: "Color" },
          { name: "Material" },
          { name: "Age Group" },
        ],
      },
      {
        name: "Footwear",
        attributes: [
          { name: "Brand" },
          { name: "Category" },
          { name: "Size", unit: "EU" },
          { name: "Color" },
          { name: "Material" },
          { name: "Style" },
        ],
      },
      {
        name: "Watches",
        attributes: [
          { name: "Brand" },
          { name: "Type" },
          { name: "Model" },
          { name: "Material" },
          { name: "Color" },
          { name: "Water Resistance", unit: "m" },
        ],
      },
      {
        name: "Bags & Accessories",
        attributes: [
          { name: "Brand" },
          { name: "Type" },
          { name: "Material" },
          { name: "Color" },
          { name: "Size" },
        ],
      },
    ],

    "home-furniture": [
      {
        name: "Furniture",
        attributes: [
          { name: "Type" },
          { name: "Material" },
          { name: "Color" },
          { name: "Dimensions", unit: "cm" },
          { name: "Brand" },
          { name: "Style" },
        ],
      },
      {
        name: "Kitchen & Dining",
        attributes: [
          { name: "Type" },
          { name: "Material" },
          { name: "Brand" },
          { name: "Dimensions", unit: "cm" },
          { name: "Color" },
        ],
      },
      {
        name: "Decor",
        attributes: [
          { name: "Type" },
          { name: "Style" },
          { name: "Material" },
          { name: "Color" },
          { name: "Dimensions", unit: "cm" },
        ],
      },
      {
        name: "Appliances",
        attributes: [
          { name: "Brand" },
          { name: "Type" },
          { name: "Model" },
          { name: "Power", unit: "W" },
          { name: "Capacity", unit: "L" },
          { name: "Warranty", unit: "Years" },
        ],
      },
      {
        name: "Lighting",
        attributes: [
          { name: "Type" },
          { name: "Brand" },
          { name: "Wattage", unit: "W" },
          { name: "Color" },
          { name: "Material" },
          { name: "Style" },
        ],
      },
    ],

    "beauty-care": [
      {
        name: "Skincare",
        attributes: [
          { name: "Brand" },
          { name: "Product Type" },
          { name: "Skin Type" },
          { name: "Ingredients" },
          { name: "Size", unit: "ml" },
        ],
      },
      {
        name: "Makeup",
        attributes: [
          { name: "Brand" },
          { name: "Product Type" },
          { name: "Shade" },
          { name: "Finish" },
          { name: "Ingredients" },
          { name: "Size", unit: "ml" },
        ],
      },
      {
        name: "Haircare",
        attributes: [
          { name: "Brand" },
          { name: "Product Type" },
          { name: "Hair Type" },
          { name: "Ingredients" },
          { name: "Size", unit: "ml" },
        ],
      },
      {
        name: "Fragrances",
        attributes: [
          { name: "Brand" },
          { name: "Fragrance Type" },
          { name: "Scent" },
          { name: "Size", unit: "ml" },
          { name: "Gender" },
        ],
      },
      {
        name: "Personal Hygiene",
        attributes: [
          { name: "Brand" },
          { name: "Product Type" },
          { name: "Size", unit: "ml" },
          { name: "Ingredients" },
          { name: "Usage" },
        ],
      },
    ],

    "sports-outdoors": [
      {
        name: "Fitness Equipment",
        attributes: [
          { name: "Brand" },
          { name: "Type" },
          { name: "Model" },
          { name: "Material" },
          { name: "Weight Capacity", unit: "kg" },
          { name: "Dimensions", unit: "cm" },
        ],
      },
      {
        name: "Sportswear",
        attributes: [
          { name: "Brand" },
          { name: "Category" },
          { name: "Size" },
          { name: "Color" },
          { name: "Material" },
          { name: "Style" },
        ],
      },
      {
        name: "Outdoor Gear",
        attributes: [
          { name: "Brand" },
          { name: "Type" },
          { name: "Material" },
          { name: "Durability" },
          { name: "Dimensions", unit: "cm" },
        ],
      },
      {
        name: "Bicycles",
        attributes: [
          { name: "Brand" },
          { name: "Type" },
          { name: "Frame Size", unit: "inch" },
          { name: "Wheel Size", unit: "inch" },
          { name: "Gear Count" },
          { name: "Color" },
        ],
      },
      {
        name: "Camping & Hiking",
        attributes: [
          { name: "Brand" },
          { name: "Type" },
          { name: "Capacity", unit: "L" },
          { name: "Material" },
          { name: "Weight", unit: "kg" },
          { name: "Dimensions", unit: "cm" },
        ],
      },
    ],

    groceries: [
      {
        name: "Fruits & Vegetables",
        attributes: [
          { name: "Type" },
          { name: "Variety" },
          { name: "Weight", unit: "kg" },
          { name: "Origin" },
          { name: "Organic/Non-Organic" },
        ],
      },
      {
        name: "Snacks",
        attributes: [
          { name: "Type" },
          { name: "Flavor" },
          { name: "Brand" },
          { name: "Weight", unit: "g" },
          { name: "Package Type" },
        ],
      },
      {
        name: "Beverages",
        attributes: [
          { name: "Type" },
          { name: "Flavor" },
          { name: "Brand" },
          { name: "Size", unit: "ml" },
          { name: "Package Type" },
        ],
      },
      {
        name: "Dairy & Bakery",
        attributes: [
          { name: "Type" },
          { name: "Brand" },
          { name: "Flavor" },
          { name: "Weight", unit: "g" },
          { name: "Package Type" },
        ],
      },
      {
        name: "Household Essentials",
        attributes: [
          { name: "Type" },
          { name: "Brand" },
          { name: "Size" },
          { name: "Material" },
          { name: "Usage" },
        ],
      },
    ],

    "books-stationery": [
      {
        name: "Fiction",
        attributes: [
          { name: "Title" },
          { name: "Author" },
          { name: "Publisher" },
          { name: "Language" },
          { name: "Pages" },
          { name: "ISBN" },
        ],
      },
      {
        name: "Non-fiction",
        attributes: [
          { name: "Title" },
          { name: "Author" },
          { name: "Publisher" },
          { name: "Language" },
          { name: "Pages" },
          { name: "ISBN" },
        ],
      },
      {
        name: "School Books",
        attributes: [
          { name: "Title" },
          { name: "Subject" },
          { name: "Grade" },
          { name: "Author" },
          { name: "Publisher" },
          { name: "ISBN" },
        ],
      },
      {
        name: "Office Supplies",
        attributes: [
          { name: "Type" },
          { name: "Material" },
          { name: "Brand" },
          { name: "Size" },
          { name: "Color" },
        ],
      },
      {
        name: "Art & Craft",
        attributes: [
          { name: "Type" },
          { name: "Material" },
          { name: "Brand" },
          { name: "Color" },
          { name: "Size" },
        ],
      },
    ],

    "toys-kids": [
      {
        name: "Toys",
        attributes: [
          { name: "Type" },
          { name: "Age Group" },
          { name: "Brand" },
          { name: "Material" },
          { name: "Dimensions", unit: "cm" },
        ],
      },
      {
        name: "Baby Products",
        attributes: [
          { name: "Type" },
          { name: "Age Group" },
          { name: "Material" },
          { name: "Brand" },
          { name: "Color" },
        ],
      },
      {
        name: "Kids’ Fashion",
        attributes: [
          { name: "Category" },
          { name: "Brand" },
          { name: "Size" },
          { name: "Color" },
          { name: "Material" },
          { name: "Style" },
        ],
      },
      {
        name: "Games & Puzzles",
        attributes: [
          { name: "Type" },
          { name: "Brand" },
          { name: "Age Group" },
          { name: "Pieces" },
          { name: "Material" },
        ],
      },
    ],

    automotive: [
      {
        name: "Car Accessories",
        attributes: [
          { name: "Type" },
          { name: "Brand" },
          { name: "Compatibility" },
          { name: "Material" },
          { name: "Color" },
        ],
      },
      {
        name: "Motorbike Accessories",
        attributes: [
          { name: "Type" },
          { name: "Brand" },
          { name: "Compatibility" },
          { name: "Material" },
          { name: "Color" },
        ],
      },
      {
        name: "Car Care",
        attributes: [
          { name: "Type" },
          { name: "Brand" },
          { name: "Size" },
          { name: "Usage" },
          { name: "Material" },
        ],
      },
      {
        name: "Spare Parts",
        attributes: [
          { name: "Type" },
          { name: "Brand" },
          { name: "Model Compatibility" },
          { name: "Material" },
        ],
      },
    ],

    "health-wellness": [
      {
        name: "Supplements",
        attributes: [
          { name: "Type" },
          { name: "Brand" },
          { name: "Dosage", unit: "mg" },
          { name: "Ingredients" },
          { name: "Size", unit: "capsules" },
        ],
      },
      {
        name: "Medical Equipment",
        attributes: [
          { name: "Type" },
          { name: "Brand" },
          { name: "Model" },
          { name: "Material" },
          { name: "Size" },
        ],
      },
      {
        name: "Fitness",
        attributes: [
          { name: "Type" },
          { name: "Brand" },
          { name: "Size" },
          { name: "Material" },
          { name: "Usage" },
        ],
      },
      {
        name: "Personal Care",
        attributes: [
          { name: "Type" },
          { name: "Brand" },
          { name: "Size" },
          { name: "Ingredients" },
          { name: "Usage" },
        ],
      },
    ],
  });

  Object.freeze(ATTRIBUTE_DEFINITIONS);

  const ROLE_MODE_STORAGE_KEY = 'CartifyRoleMode';
  const ROLE_MODES = Object.freeze({
    MERCHANT: 'merchant',
    CUSTOMER: 'customer'
  });
  const ROLE_CLAIM_PATH = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
  const MERCHANT_ROLE_NAME = 'Merchant';

  function parseJwt(token) {
    if (!token) return null;
    try {
      const base64Payload = token.split('.')[1];
      const payload = atob(base64Payload);
      return JSON.parse(payload);
    } catch (error) {
      console.warn('Unable to parse merchant JWT payload', error);
      return null;
    }
  }

  function getCurrentUserRoles() {
    const token = getAuthToken();
    if (!token) return [];
    const payload = parseJwt(token);
    if (!payload) return [];
    const rawRoles = payload[ROLE_CLAIM_PATH] || [];
    const roles = Array.isArray(rawRoles) ? rawRoles : (rawRoles ? [rawRoles] : []);
    return roles.filter(Boolean);
  }

  function setRoleMode(mode) {
    if (!mode) {
      localStorage.removeItem(ROLE_MODE_STORAGE_KEY);
      return;
    }
    localStorage.setItem(ROLE_MODE_STORAGE_KEY, mode);
  }

  function ensureMerchantAccess() {
    const token = getAuthToken();
    if (!token) {
      window.location.href = "login.html";
      return false;
    }
    const roles = getCurrentUserRoles();
    if (!roles.includes(MERCHANT_ROLE_NAME)) {
      setRoleMode(ROLE_MODES.CUSTOMER);
      window.location.href = "index.html";
      return false;
    }
    return true;
  }

  // ==================== DASHBOARD SECTION ====================
  function loadDashboard() {
    const html = `
      <div class="section-container">
        <h2 class="section-title"><i class="bi bi-speedometer2 me-2"></i>Dashboard</h2>
        <div class="row mb-4">
          <div class="col-md-3">
            <div class="card stat-card">
              <div class="card-body">
                <h5 class="card-title">Total Products</h5>
                <h3 class="stat-number" id="totalProducts">0</h3>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card stat-card">
              <div class="card-body">
                <h5 class="card-title">Total Customers</h5>
                <h3 class="stat-number" id="totalCustomers">0</h3>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card stat-card">
              <div class="card-body">
                <h5 class="card-title">Total Orders</h5>
                <h3 class="stat-number" id="totalOrders">0</h3>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card stat-card">
              <div class="card-body">
                <h5 class="card-title">Total Revenue</h5>
                <h3 class="stat-number" id="totalRevenue">$0</h3>
              </div>
            </div>
          </div>
        </div>
        <div class="card">
          <div class="card-header">
            <h5>Recent Activity</h5>
          </div>
          <div class="card-body">
            <div id="recentActivity">Loading...</div>
          </div>
        </div>
      </div>
    `;
    $("#dynamicContentContainer").show().html(html);
    fetchDashboardData();
  }

  function fetchDashboardData() {
    const storeId = getStoreId();
    if (!storeId) {
      $("#totalProducts").text("0");
      $("#totalCustomers").text("0");
      $("#totalOrders").text("0");
      $("#totalRevenue").text("$0");
      $("#recentActivity").html("<p>Store ID not found</p>");
      return;
    }

    // Get user ID from token
    const authData = JSON.parse(localStorage.getItem('Auth') || sessionStorage.getItem('Auth') || '{}');
    const token = authData.jwt;
    let userId = null;
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        userId = payload.sub || payload.nameid;
      } catch(e) {
        console.error('Error parsing token:', e);
      }
    }

    // Fetch Products Count
    if (userId) {
      $.ajax({
        url: `${API_BASE_URL}/merchant/products/merchant/${userId}?page=1&pageSize=1`,
        method: 'GET',
        headers: { 'Authorization': `Bearer ${getAuthToken()}` },
        success: function(response) {
          const totalProducts = response.totalCount || response.total || 0;
          $("#totalProducts").text(totalProducts);
        },
        error: function() {
          $("#totalProducts").text("0");
        }
      });
    }

    // Fetch Customers Count
    $.ajax({
      url: `${API_BASE_URL}/merchant/customers/store/${storeId}/count`,
      method: 'GET',
      headers: { 'Authorization': `Bearer ${getAuthToken()}` },
      success: function(response) {
        $("#totalCustomers").text(response.totalCustomers || 0);
      },
      error: function() {
        $("#totalCustomers").text("0");
      }
    });

    // Fetch Orders Count
    $.ajax({
      url: `${API_BASE_URL}/merchant/orders/store/${storeId}?page=1&pageSize=1`,
      method: 'GET',
      headers: { 'Authorization': `Bearer ${getAuthToken()}` },
      success: function(response) {
        const totalOrders = response.totalCount || response.total || 0;
        $("#totalOrders").text(totalOrders);
      },
      error: function() {
        $("#totalOrders").text("0");
      }
    });

    // Fetch Revenue from Transactions Summary
    $.ajax({
      url: `${API_BASE_URL}/merchant/transactions/store/${storeId}/summary?period=monthly`,
      method: 'GET',
      headers: { 'Authorization': `Bearer ${getAuthToken()}` },
      success: function(response) {
        const revenue = response.totalAmount || response.totalRevenue || 0;
        $("#totalRevenue").text("$" + parseFloat(revenue).toFixed(2));
      },
      error: function() {
        $("#totalRevenue").text("$0");
      }
    });

    // Fetch Recent Orders
    $.ajax({
      url: `${API_BASE_URL}/merchant/orders/store/${storeId}?page=1&pageSize=5`,
      method: 'GET',
      headers: { 'Authorization': `Bearer ${getAuthToken()}` },
      success: function(response) {
        const orders = response.data || response.items || response || [];
        if (orders.length === 0) {
          $("#recentActivity").html("<p>No recent activity</p>");
        } else {
          let html = '<ul class="list-group list-group-flush">';
          orders.forEach(order => {
            html += `
              <li class="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <strong>Order ${order.orderId || order.OrderId}</strong><br>
                  <small class="text-muted">${formatDate(order.orderDate || order.OrderDate)}</small>
                </div>
                <span class="badge ${getOrderStatusClass(getOrderStatusText(order.statusId || order.status))}">
                  ${getOrderStatusText(order.statusId || order.status)}
                </span>
              </li>
            `;
          });
          html += '</ul>';
          $("#recentActivity").html(html);
        }
      },
      error: function() {
        $("#recentActivity").html("<p>Error loading recent activity</p>");
      }
    });
  }

  // ==================== PROMOTION SECTION ====================
  function loadPromotion() {
    const html = `
      <div class="section-container">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h2 class="section-title"><i class="bi bi-tag me-2"></i>Promotion Management</h2>
          <button class="btn btn-primary" id="btnAddPromotion">
            <i class="bi bi-plus-circle me-2"></i>Add Promotion
          </button>
        </div>
        <div class="card">
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-hover" id="promotionTable">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Discount</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody id="promotionTableBody">
                  <tr><td colspan="7" class="text-center">Loading...</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    `;
    $("#dynamicContentContainer").show().html(html);
    fetchPromotions();
    
    // Add promotion button handler
    $(document).off('click', '#btnAddPromotion').on('click', '#btnAddPromotion', showPromotionModal);
  }

  function fetchPromotions() {
    // Fetch promotions from API
    $.ajax({
      url: `${API_BASE_URL}/Promotions`,
      method: 'GET',
      headers: { 'Authorization': `Bearer ${getAuthToken()}` },
      success: function(data) {
        renderPromotionsTable(data);
      },
      error: function() {
        $("#promotionTableBody").html('<tr><td colspan="7" class="text-center text-danger">Error loading promotions</td></tr>');
      }
    });
  }

  function renderPromotionsTable(promotions) {
    if (!promotions || promotions.length === 0) {
      $("#promotionTableBody").html('<tr><td colspan="7" class="text-center">No promotions found</td></tr>');
      return;
    }
    let html = '';
    promotions.forEach(promo => {
      html += `
        <tr>
          <td>${promo.id || 'N/A'}</td>
          <td>${promo.title || 'N/A'}</td>
          <td>${promo.discount || 0}%</td>
          <td>${promo.startDate || 'N/A'}</td>
          <td>${promo.endDate || 'N/A'}</td>
          <td><span class="badge ${promo.isActive ? 'bg-success' : 'bg-secondary'}">${promo.isActive ? 'Active' : 'Inactive'}</span></td>
          <td>
            <button class="btn btn-sm btn-primary me-1" onclick="editPromotion(${promo.id})">
              <i class="bi bi-pencil"></i>
            </button>
            <button class="btn btn-sm btn-danger" onclick="deletePromotion(${promo.id})">
              <i class="bi bi-trash"></i>
            </button>
          </td>
        </tr>
      `;
    });
    $("#promotionTableBody").html(html);
  }

  function showPromotionModal(id = null) {
    const isEdit = id !== null;
    const modal = `
      <div class="modal fade" id="promotionModal" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">${isEdit ? 'Edit' : 'Add'} Promotion</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <form id="promotionForm">
                <input type="hidden" id="promotionId" value="${id || ''}">
                <div class="mb-3">
                  <label class="form-label">Title</label>
                  <input type="text" class="form-control" id="promotionTitle" required>
                </div>
                <div class="mb-3">
                  <label class="form-label">Description</label>
                  <textarea class="form-control" id="promotionDescription" rows="3"></textarea>
                </div>
                <div class="mb-3">
                  <label class="form-label">Discount (%)</label>
                  <input type="number" class="form-control" id="promotionDiscount" min="0" max="100" required>
                </div>
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Start Date</label>
                    <input type="date" class="form-control" id="promotionStartDate" required>
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="form-label">End Date</label>
                    <input type="date" class="form-control" id="promotionEndDate" required>
                  </div>
                </div>
                <div class="mb-3">
                  <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="promotionIsActive" checked>
                    <label class="form-check-label" for="promotionIsActive">Active</label>
                  </div>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="button" class="btn btn-primary" onclick="savePromotion()">Save</button>
            </div>
          </div>
        </div>
      </div>
    `;
    $('body').append(modal);
    const bsModal = new bootstrap.Modal(document.getElementById('promotionModal'));
    bsModal.show();
    $('#promotionModal').on('hidden.bs.modal', function() {
      $(this).remove();
    });
    if (isEdit) loadPromotionData(id);
  }

  window.editPromotion = function(id) {
    showPromotionModal(id);
  };

  window.deletePromotion = function(id) {
    showConfirmModal('Delete Promotion', 'Are you sure you want to delete this promotion?', function() {
      $.ajax({
        url: `${API_BASE_URL}/Promotions/${id}`,
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getAuthToken()}` },
        success: function() {
          fetchPromotions();
          showNotification('Promotion deleted successfully', 'success');
        },
        error: function(xhr) {
          showNotification(xhr.responseJSON?.message || 'Error deleting promotion', 'error');
        }
      });
    });
  };

  window.savePromotion = function() {
    if (!$('#promotionTitle').val().trim()) {
      showNotification('Please enter a promotion title', 'error');
      return;
    }
    const data = {
      id: $('#promotionId').val() || 0,
      title: $('#promotionTitle').val().trim(),
      description: $('#promotionDescription').val().trim(),
      discount: parseFloat($('#promotionDiscount').val()) || 0,
      startDate: $('#promotionStartDate').val(),
      endDate: $('#promotionEndDate').val(),
      isActive: $('#promotionIsActive').is(':checked')
    };
    const method = data.id ? 'PUT' : 'POST';
    const url = data.id ? `${API_BASE_URL}/Promotions/${data.id}` : `${API_BASE_URL}/Promotions`;
    $.ajax({
      url: url,
      method: method,
      contentType: 'application/json',
      headers: { 'Authorization': `Bearer ${getAuthToken()}` },
      data: JSON.stringify(data),
      success: function() {
        bootstrap.Modal.getInstance(document.getElementById('promotionModal')).hide();
        fetchPromotions();
        showNotification(`Promotion ${data.id ? 'updated' : 'created'} successfully`, 'success');
      },
      error: function(xhr) {
        showNotification(xhr.responseJSON?.message || 'Error saving promotion', 'error');
      }
    });
  };

  function loadPromotionData(id) {
    $.ajax({
      url: `${API_BASE_URL}/Promotions/${id}`,
      method: 'GET',
      headers: { 'Authorization': `Bearer ${getAuthToken()}` },
      success: function(data) {
        $('#promotionId').val(data.id);
        $('#promotionTitle').val(data.title);
        $('#promotionDescription').val(data.description);
        $('#promotionDiscount').val(data.discount);
        $('#promotionStartDate').val(data.startDate);
        $('#promotionEndDate').val(data.endDate);
        $('#promotionIsActive').prop('checked', data.isActive);
      }
    });
  }

  // ==================== CUSTOMER SECTION ====================
  function loadCustomer() {
    const html = `
      <div class="section-container">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h2 class="section-title"><i class="bi bi-people me-2"></i>Customer Management</h2>
          <button class="btn btn-primary" id="btnRefreshCustomers">
            <i class="bi bi-arrow-clockwise me-2"></i>Refresh
          </button>
        </div>
        <div class="card shadow-sm mb-3">
          <div class="card-body">
            <div class="row">
              <div class="col-md-6">
                <div class="input-group">
                  <span class="input-group-text"><i class="bi bi-search"></i></span>
                  <input type="text" class="form-control" id="customerSearch" placeholder="Search customers...">
                </div>
              </div>
              <div class="col-md-6 text-end">
                <span class="badge bg-primary" id="customerCount">0 customers</span>
              </div>
            </div>
          </div>
        </div>
        <div class="card shadow-sm">
          <div class="card-body p-0">
            <div class="table-responsive">
              <table class="table table-hover mb-0" id="customerTable">
                <thead>
                  <tr>
                    <th><i class="bi bi-hash me-1"></i>ID</th>
                    <th><i class="bi bi-person me-1"></i>Name</th>
                    <th><i class="bi bi-envelope me-1"></i>Email</th>
                    <th><i class="bi bi-telephone me-1"></i>Phone</th>
                    <th><i class="bi bi-cart me-1"></i>Orders</th>
                    <th><i class="bi bi-toggle-on me-1"></i>Status</th>
                    <th class="text-center"><i class="bi bi-gear me-1"></i>Actions</th>
                  </tr>
                </thead>
                <tbody id="customerTableBody">
                  <tr><td colspan="7" class="text-center py-4"><div class="spinner-border text-primary" role="status"></div></td></tr>
                </tbody>
              </table>
            </div>
            <div class="d-flex justify-content-between align-items-center p-3">
              <div>
                <label class="me-2">Page:</label>
                <input type="number" id="customerPageNumber" class="form-control d-inline-block" style="width: 80px;" value="1" min="1">
                <label class="ms-2 me-2">Page Size:</label>
                <select id="customerPageSize" class="form-select d-inline-block" style="width: 100px;">
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                </select>
              </div>
              <div id="customerPaginationInfo"></div>
            </div>
          </div>
        </div>
      </div>
    `;
    $("#dynamicContentContainer").show().html(html);
    
    const storeId = getStoreId();
    if (storeId) {
      fetchCustomers(storeId);
      fetchCustomerCount(storeId);
    } else {
      $("#customerTableBody").html('<tr><td colspan="7" class="text-center text-danger">Store ID not found</td></tr>');
    }
    
    $(document).off('click', '#btnRefreshCustomers').on('click', '#btnRefreshCustomers', function() {
      const storeId = getStoreId();
      if (storeId) {
        fetchCustomers(storeId);
        fetchCustomerCount(storeId);
      }
    });
    
    $(document).off('input', '#customerSearch').on('input', '#customerSearch', function() {
      const term = $(this).val().toLowerCase();
      $('#customerTableBody tr').each(function() {
        $(this).toggle($(this).text().toLowerCase().includes(term));
      });
    });
    
    $(document).off('change', '#customerPageNumber, #customerPageSize').on('change', '#customerPageNumber, #customerPageSize', function() {
      const storeId = getStoreId();
      if (storeId) fetchCustomers(storeId);
    });
  }

  function fetchCustomers(storeId, page = 1, pageSize = 10) {
    page = parseInt($('#customerPageNumber').val()) || page;
    pageSize = parseInt($('#customerPageSize').val()) || pageSize;
    
    $.ajax({
      url: `${API_BASE_URL}/merchant/customers/store/${storeId}?page=${page}&pageSize=${pageSize}`,
      method: 'GET',
      headers: { 'Authorization': `Bearer ${getAuthToken()}` },
      success: function(response) {
        const customers = response.data || response.items || response || [];
        const totalCount = response.totalCount || response.total || customers.length;
        const totalPages = response.totalPages || Math.ceil(totalCount / pageSize);
        
        renderCustomersTable(customers);
        updateCustomerPaginationInfo(page, totalPages, totalCount);
      },
      error: function(xhr) {
        console.error('Error fetching customers:', xhr);
        let errorMsg = 'Error loading customers';
        if (xhr.responseJSON && xhr.responseJSON.message) {
          errorMsg = xhr.responseJSON.message;
        }
        $("#customerTableBody").html(`<tr><td colspan="7" class="text-center text-danger">${errorMsg}</td></tr>`);
      }
    });
  }

  function fetchCustomerCount(storeId) {
    $.ajax({
      url: `${API_BASE_URL}/merchant/customers/store/${storeId}/count`,
      method: 'GET',
      headers: { 'Authorization': `Bearer ${getAuthToken()}` },
      success: function(response) {
        const count = response.totalCustomers || response.count || 0;
        $('#customerCount').text(`${count} customer${count !== 1 ? 's' : ''}`);
      },
      error: function() {
        $('#customerCount').text('0 customers');
      }
    });
  }

  function updateCustomerPaginationInfo(currentPage, totalPages, totalCount) {
    $('#customerPaginationInfo').text(`Page ${currentPage} of ${totalPages} (Total: ${totalCount} customers)`);
  }

  function renderCustomersTable(customers) {
    if (!customers || customers.length === 0) {
      $("#customerTableBody").html(`
        <tr><td colspan="7" class="text-center py-5">
          <i class="bi bi-inbox" style="font-size: 3rem; color: #ccc;"></i>
          <p class="mt-3 text-muted">No customers found</p>
        </td></tr>
      `);
      return;
    }
    let html = '';
    customers.forEach(customer => {
      const name = customer.name || (customer.firstName && customer.lastName ? `${customer.firstName} ${customer.lastName}` : 'N/A');
      const customerId = customer.customerId || customer.id || customer.CustomerId;
      html += `
        <tr class="table-row-hover">
          <td><strong>#${customerId || 'N/A'}</strong></td>
          <td>
            <div class="d-flex align-items-center">
              <i class="bi bi-person-circle me-2" style="font-size: 1.5rem; color: var(--greenNormal);"></i>
              <span>${name}</span>
            </div>
          </td>
          <td><a href="mailto:${customer.email || ''}" class="text-decoration-none">${customer.email || 'N/A'}</a></td>
          <td>${customer.phone || customer.phoneNumber || '<span class="text-muted">-</span>'}</td>
          <td><span class="badge bg-info">${customer.totalOrders || 0}</span></td>
          <td><span class="badge ${customer.isActive !== false ? 'bg-success' : 'bg-secondary'}">${customer.isActive !== false ? '<i class="bi bi-check-circle me-1"></i>Active' : '<i class="bi bi-x-circle me-1"></i>Inactive'}</span></td>
          <td class="text-center">
            <button class="btn btn-sm btn-outline-primary" onclick="viewCustomerDetails(${customerId})" title="View Details">
              <i class="bi bi-eye"></i> View
            </button>
          </td>
        </tr>
      `;
    });
    $("#customerTableBody").html(html);
  }

  window.viewCustomerDetails = function(customerId) {
    if (!customerId) {
      showNotification('Customer ID is required', 'error');
      return;
    }
    
    $.ajax({
      url: `${API_BASE_URL}/merchant/customers/${customerId}`,
      method: 'GET',
      headers: { 'Authorization': `Bearer ${getAuthToken()}` },
      success: function(customer) {
        showCustomerDetailsModal(customer);
      },
      error: function(xhr) {
        console.error('Error fetching customer details:', xhr);
        let errorMsg = 'Error loading customer details';
        if (xhr.responseJSON && xhr.responseJSON.message) {
          errorMsg = xhr.responseJSON.message;
        }
        showNotification(errorMsg, 'error');
      }
    });
  };

  function showCustomerDetailsModal(customer) {
    const customerId = customer.customerId || customer.id || customer.CustomerId;
    const name = customer.name || (customer.firstName && customer.lastName ? `${customer.firstName} ${customer.lastName}` : 'N/A');
    const modal = `
      <div class="modal fade" id="customerDetailsModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered modal-lg">
          <div class="modal-content">
            <div class="modal-header bg-primary text-white">
              <h5 class="modal-title"><i class="bi bi-person-circle me-2"></i>Customer Details - ${name}</h5>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body p-4">
              <div class="row mb-3">
                <div class="col-md-6">
                  <p><strong><i class="bi bi-hash me-1"></i>Customer ID:</strong> ${customerId || 'N/A'}</p>
                  <p><strong><i class="bi bi-person me-1"></i>First Name:</strong> ${customer.firstName || 'N/A'}</p>
                  <p><strong><i class="bi bi-person me-1"></i>Last Name:</strong> ${customer.lastName || 'N/A'}</p>
                  <p><strong><i class="bi bi-envelope me-1"></i>Email:</strong> <a href="mailto:${customer.email || ''}">${customer.email || 'N/A'}</a></p>
                </div>
                <div class="col-md-6">
                  <p><strong><i class="bi bi-telephone me-1"></i>Phone:</strong> ${customer.phone || customer.phoneNumber || 'N/A'}</p>
                  <p><strong><i class="bi bi-cart me-1"></i>Total Orders:</strong> <span class="badge bg-info">${customer.totalOrders || 0}</span></p>
                  <p><strong><i class="bi bi-toggle-on me-1"></i>Status:</strong> 
                    <span class="badge ${customer.isActive !== false ? 'bg-success' : 'bg-secondary'}">
                      ${customer.isActive !== false ? 'Active' : 'Inactive'}
                    </span>
                  </p>
                  ${customer.address ? `<p><strong><i class="bi bi-geo-alt me-1"></i>Address:</strong> ${customer.address}</p>` : ''}
                </div>
              </div>
              ${customer.description ? `<p><strong>Description:</strong> ${customer.description}</p>` : ''}
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"><i class="bi bi-x-circle me-1"></i>Close</button>
            </div>
          </div>
        </div>
      </div>
    `;
    $('body').append(modal);
    const bsModal = new bootstrap.Modal(document.getElementById('customerDetailsModal'));
    bsModal.show();
    $('#customerDetailsModal').on('hidden.bs.modal', function() {
      $(this).remove();
    });
  }

  // ==================== ORDER SECTION ====================
  function loadOrder() {
    const html = `
      <div class="section-container">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h2 class="section-title"><i class="bi bi-cart-check me-2"></i>Order Management</h2>
        </div>
        <div class="card shadow-sm mb-3">
          <div class="card-body">
            <div class="row mb-3">
              <div class="col-md-4">
                <div class="input-group">
                  <span class="input-group-text"><i class="bi bi-search"></i></span>
                  <input type="text" class="form-control" id="orderSearch" placeholder="Search orders...">
                </div>
              </div>
              <div class="col-md-4">
                <select class="form-select" id="orderStatusFilter">
                  <option value="">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div class="col-md-4 text-end">
                <span class="badge bg-primary" id="orderCount">0 orders</span>
              </div>
            </div>
          </div>
        </div>
        <div class="card shadow-sm">
          <div class="card-body p-0">
            <div class="table-responsive">
              <table class="table table-hover mb-0" id="orderTable">
                <thead>
                  <tr>
                    <th><i class="bi bi-hash me-1"></i>Order ID</th>
                    <th><i class="bi bi-person me-1"></i>Customer</th>
                    <th><i class="bi bi-calendar me-1"></i>Date</th>
                    <th><i class="bi bi-currency-dollar me-1"></i>Total</th>
                    <th><i class="bi bi-tag me-1"></i>Status</th>
                    <th class="text-center"><i class="bi bi-gear me-1"></i>Actions</th>
                  </tr>
                </thead>
                <tbody id="orderTableBody">
                  <tr><td colspan="6" class="text-center py-4"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div></td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    `;
    $("#dynamicContentContainer").show().html(html);
    fetchOrders();
    
    $(document).off('input', '#orderSearch').on('input', '#orderSearch', function() {
      filterOrders();
    });
    $(document).off('change', '#orderStatusFilter').on('change', '#orderStatusFilter', function() {
      filterOrders();
    });
  }

  function fetchOrders() {
    $.ajax({
      url: `${API_BASE_URL}/Orders`,
      method: 'GET',
      headers: { 'Authorization': `Bearer ${getAuthToken()}` },
      success: function(data) {
        renderOrdersTable(data);
      },
      error: function() {
        $("#orderTableBody").html('<tr><td colspan="6" class="text-center text-danger">Error loading orders</td></tr>');
      }
    });
  }

  function renderOrdersTable(orders) {
    if (!orders || orders.length === 0) {
      $("#orderTableBody").html(`
        <tr>
          <td colspan="6" class="text-center py-5">
            <i class="bi bi-inbox" style="font-size: 3rem; color: #ccc;"></i>
            <p class="mt-3 text-muted">No orders found</p>
          </td>
        </tr>
      `);
      $('#orderCount').text('0 orders');
      return;
    }
    let html = '';
    orders.forEach(order => {
      const orderDate = order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'N/A';
      const statusClass = {
        'Pending': 'bg-warning',
        'Processing': 'bg-info',
        'Shipped': 'bg-primary',
        'Delivered': 'bg-success',
        'Cancelled': 'bg-danger'
      }[order.status] || 'bg-secondary';
      
      html += `
        <tr class="table-row-hover" data-status="${order.status || ''}">
          <td><strong>#${order.id || 'N/A'}</strong></td>
          <td>${order.customerName || order.customer?.name || 'N/A'}</td>
          <td>${orderDate}</td>
          <td><strong>$${parseFloat(order.totalAmount || 0).toFixed(2)}</strong></td>
          <td><span class="badge ${statusClass}">${order.status || 'N/A'}</span></td>
          <td class="text-center">
            <div class="btn-group" role="group">
              <button class="btn btn-sm btn-outline-primary" onclick="viewOrderDetails(${order.id})" title="View">
                <i class="bi bi-eye"></i>
              </button>
              <button class="btn btn-sm btn-outline-success" onclick="updateOrderStatus(${order.id})" title="Update Status">
                <i class="bi bi-arrow-repeat"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    });
    $("#orderTableBody").html(html);
    $('#orderCount').text(`${orders.length} order${orders.length !== 1 ? 's' : ''}`);
  }

  function filterOrders() {
    const searchTerm = $('#orderSearch').val().toLowerCase();
    const statusFilter = $('#orderStatusFilter').val();
    
    $('#orderTableBody tr').each(function() {
      const text = $(this).text().toLowerCase();
      const status = $(this).data('status') || '';
      const matchesSearch = text.includes(searchTerm);
      const matchesStatus = !statusFilter || status === statusFilter;
      $(this).toggle(matchesSearch && matchesStatus);
    });
  }

  window.viewOrderDetails = function(id) {
    $.ajax({
      url: `${API_BASE_URL}/Orders/${id}`,
      method: 'GET',
      headers: { 'Authorization': `Bearer ${getAuthToken()}` },
      success: function(order) {
        showOrderDetailsModal(order);
      },
      error: function() {
        showNotification('Error loading order details', 'error');
      }
    });
  };

  function showOrderDetailsModal(order) {
    const itemsHtml = order.orderItems?.map(item => `
      <tr>
        <td>${item.productName || 'N/A'}</td>
        <td>${item.quantity || 0}</td>
        <td>$${parseFloat(item.price || 0).toFixed(2)}</td>
        <td>$${parseFloat((item.quantity || 0) * (item.price || 0)).toFixed(2)}</td>
      </tr>
    `).join('') || '<tr><td colspan="4" class="text-center">No items</td></tr>';
    
    const modal = $(`
      <div class="modal fade" id="orderDetailsModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered modal-lg">
          <div class="modal-content">
            <div class="modal-header bg-primary text-white">
              <h5 class="modal-title"><i class="bi bi-cart-check me-2"></i>Order #${order.id} Details</h5>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body p-4">
              <div class="row mb-3">
                <div class="col-md-6">
                  <p><strong>Customer:</strong> ${order.customerName || 'N/A'}</p>
                  <p><strong>Date:</strong> ${order.orderDate ? new Date(order.orderDate).toLocaleString() : 'N/A'}</p>
                </div>
                <div class="col-md-6">
                  <p><strong>Status:</strong> <span class="badge bg-primary">${order.status || 'N/A'}</span></p>
                  <p><strong>Total:</strong> <strong>$${parseFloat(order.totalAmount || 0).toFixed(2)}</strong></p>
                </div>
              </div>
              <hr>
              <h6 class="mb-3">Order Items</h6>
              <div class="table-responsive">
                <table class="table table-sm">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Quantity</th>
                      <th>Price</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>${itemsHtml}</tbody>
                </table>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    `);
    $('body').append(modal);
    const bsModal = new bootstrap.Modal(document.getElementById('orderDetailsModal'));
    bsModal.show();
    $('#orderDetailsModal').on('hidden.bs.modal', function() { $(this).remove(); });
  }

  window.updateOrderStatus = function(id) {
    const modal = $(`
      <div class="modal fade" id="updateStatusModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header bg-success text-white">
              <h5 class="modal-title"><i class="bi bi-arrow-repeat me-2"></i>Update Order Status</h5>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body p-4">
              <form id="statusForm">
                <input type="hidden" id="orderId" value="${id}">
                <div class="mb-3">
                  <label class="form-label">New Status</label>
                  <select class="form-select" id="newStatus" required>
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="button" class="btn btn-success" onclick="saveOrderStatus()">Update Status</button>
            </div>
          </div>
        </div>
      </div>
    `);
    $('body').append(modal);
    const bsModal = new bootstrap.Modal(document.getElementById('updateStatusModal'));
    bsModal.show();
    $('#updateStatusModal').on('hidden.bs.modal', function() { $(this).remove(); });
  };

  window.saveOrderStatus = function() {
    const orderId = $('#orderId').val();
    const newStatus = $('#newStatus').val();
    
    $.ajax({
      url: `${API_BASE_URL}/Orders/${orderId}/status`,
      method: 'PUT',
      contentType: 'application/json',
      headers: { 'Authorization': `Bearer ${getAuthToken()}` },
      data: JSON.stringify({ status: newStatus }),
      success: function() {
        bootstrap.Modal.getInstance(document.getElementById('updateStatusModal')).hide();
        fetchOrders();
        showNotification('Order status updated successfully', 'success');
      },
      error: function() {
        showNotification('Error updating order status', 'error');
      }
    });
  };

  // ==================== CATEGORY SECTION ====================
  function loadCategory() {
    const html = `
      <div class="section-container">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h2 class="section-title"><i class="bi bi-folder me-2"></i>Category Management</h2>
          <button class="btn btn-primary" id="btnAddCategory">
            <i class="bi bi-plus-circle me-2"></i>Add Category
          </button>
        </div>
        <div class="card">
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-hover" id="categoryTable">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Image</th>
                    <th>Products Count</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody id="categoryTableBody">
                  <tr><td colspan="7" class="text-center">Loading...</td></tr>
                </tbody>
              </table>
            </div>
            <div class="d-flex justify-content-between align-items-center mt-3">
              <div>
                <label class="me-2">Page:</label>
                <input type="number" id="categoryPageNumber" class="form-control d-inline-block" style="width: 80px;" value="1" min="1">
                <label class="ms-2 me-2">Page Size:</label>
                <select id="categoryPageSize" class="form-select d-inline-block" style="width: 100px;">
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                </select>
              </div>
              <div id="categoryPaginationInfo"></div>
            </div>
          </div>
        </div>
      </div>
    `;
    $("#dynamicContentContainer").show().html(html);
    fetchCategories();
    
    $(document).off('click', '#btnAddCategory').on('click', '#btnAddCategory', showCategoryModal);
    $(document).off('change', '#categoryPageNumber, #categoryPageSize').on('change', '#categoryPageNumber, #categoryPageSize', function() {
      fetchCategories();
    });
  }

  function fetchCategories(page = 1, pageSize = 10) {
    page = parseInt($('#categoryPageNumber').val()) || page;
    pageSize = parseInt($('#categoryPageSize').val()) || pageSize;
    
    $.ajax({
      url: `${API_BASE_URL}/Category?page=${page}&pageSize=${pageSize}`,
      method: 'GET',
      headers: { 'Authorization': `Bearer ${getAuthToken()}` },
      success: function(response) {
        const categories = response.data || response.items || response || [];
        const totalCount = response.totalCount || response.total || categories.length;
        const totalPages = response.totalPages || Math.ceil(totalCount / pageSize);
        
        renderCategoriesTable(categories);
        updateCategoryPaginationInfo(page, totalPages, totalCount);
      },
      error: function(xhr) {
        console.error('Error fetching categories:', xhr);
        let errorMsg = 'Error loading categories';
        if (xhr.responseJSON && xhr.responseJSON.message) {
          errorMsg = xhr.responseJSON.message;
        }
        $("#categoryTableBody").html(`<tr><td colspan="7" class="text-center text-danger">${errorMsg}</td></tr>`);
      }
    });
  }

  function updateCategoryPaginationInfo(currentPage, totalPages, totalCount) {
    $('#categoryPaginationInfo').text(`Page ${currentPage} of ${totalPages} (Total: ${totalCount} categories)`);
  }

  function renderCategoriesTable(categories) {
    if (!categories || categories.length === 0) {
      $("#categoryTableBody").html('<tr><td colspan="7" class="text-center">No categories found</td></tr>');
      return;
    }
    let html = '';
    categories.forEach(category => {
      const categoryId = category.categoryId || category.id || category.CategoryId;
      html += `
        <tr>
          <td>${categoryId || 'N/A'}</td>
          <td>${category.categoryName || category.name || 'N/A'}</td>
          <td>${category.categoryDescription || category.CategoryDescription || category.description || category.Description || 'N/A'}</td>
          <td>${category.imageUrl ? `<img src="${category.imageUrl}" width="50" height="50" class="img-thumbnail">` : 'N/A'}</td>
          <td><span id="productCount-${categoryId}">Loading...</span></td>
          <td><span class="badge ${category.isActive !== false ? 'bg-success' : 'bg-secondary'}">${category.isActive !== false ? 'Active' : 'Inactive'}</span></td>
          <td>
            <button class="btn btn-sm btn-info me-1" onclick="viewCategoryDetails(${categoryId})" title="View Details">
              <i class="bi bi-eye"></i>
            </button>
            <button class="btn btn-sm btn-primary me-1" onclick="editCategory(${categoryId})" title="Edit">
              <i class="bi bi-pencil"></i>
            </button>
            <button class="btn btn-sm btn-danger" onclick="deleteCategory(${categoryId})" title="Delete">
              <i class="bi bi-trash"></i>
            </button>
          </td>
        </tr>
      `;
      // Fetch product count for each category
      if (categoryId) {
        fetchProductCountByCategory(categoryId);
      }
    });
    $("#categoryTableBody").html(html);
  }

  function fetchProductCountByCategory(categoryId) {
    $.ajax({
      url: `${API_BASE_URL}/Category/${categoryId}/products/count`,
      method: 'GET',
      headers: { 'Authorization': `Bearer ${getAuthToken()}` },
      success: function(response) {
        const count = response.productCount || 0;
        $(`#productCount-${categoryId}`).text(count);
      },
      error: function() {
        $(`#productCount-${categoryId}`).text('0');
      }
    });
  }

  function showCategoryModal(id = null) {
    const isEdit = id !== null;
    const modal = `
      <div class="modal fade" id="categoryModal" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">${isEdit ? 'Edit' : 'Add'} Category</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <form id="categoryForm" enctype="multipart/form-data">
                <input type="hidden" id="categoryId" value="${id || ''}">
                <div class="mb-3">
                  <label class="form-label">Name <span class="text-danger">*</span></label>
                  <input type="text" class="form-control" id="categoryName" required>
                </div>
                <div class="mb-3">
                  <label class="form-label">Description</label>
                  <textarea class="form-control" id="categoryDescription" rows="3"></textarea>
                </div>
                <div class="mb-3">
                  <label class="form-label">Image</label>
                  <input type="file" class="form-control" id="categoryImage" accept="image/*">
                  <small class="text-muted">Image will be uploaded to AWS S3</small>
                </div>
                <div class="mb-3">
                  <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="categoryIsActive" checked>
                    <label class="form-check-label" for="categoryIsActive">Active</label>
                  </div>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="button" class="btn btn-primary" onclick="saveCategory()">Save</button>
            </div>
          </div>
        </div>
      </div>
    `;
    $('body').append(modal);
    const bsModal = new bootstrap.Modal(document.getElementById('categoryModal'));
    bsModal.show();
    $('#categoryModal').on('hidden.bs.modal', function() {
      $(this).remove();
    });
    if (isEdit) loadCategoryData(id);
  }

  window.viewCategoryDetails = function(categoryId) {
    if (!categoryId) {
      alert('Category ID is required');
      return;
    }
    
    // Fetch category details
    $.ajax({
      url: `${API_BASE_URL}/Category/${categoryId}`,
      method: 'GET',
      headers: { 'Authorization': `Bearer ${getAuthToken()}` },
      success: function(category) {
        // Fetch product count
        $.ajax({
          url: `${API_BASE_URL}/Category/${categoryId}/products/count`,
          method: 'GET',
          headers: { 'Authorization': `Bearer ${getAuthToken()}` },
          success: function(countResponse) {
            const productCount = countResponse.productCount || 0;
            showCategoryDetailsModal(category, productCount);
          },
          error: function() {
            showCategoryDetailsModal(category, 0);
          }
        });
      },
      error: function(xhr) {
        console.error('Error fetching category:', xhr);
        alert('Error loading category details');
      }
    });
  };

  function showCategoryDetailsModal(category, productCount) {
    const categoryId = category.categoryId || category.id || category.CategoryId;
    const modal = `
      <div class="modal fade" id="categoryDetailsModal" tabindex="-1">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Category Details - ${category.categoryName || category.name || 'N/A'}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <div class="row mb-3">
                <div class="col-md-6">
                  <strong>Category ID:</strong> ${categoryId || 'N/A'}<br>
                  <strong>Name:</strong> ${category.categoryName || category.name || 'N/A'}<br>
                  <strong>Description:</strong> ${category.categoryDescription || category.CategoryDescription || category.description || category.Description || 'N/A'}<br>
                </div>
                <div class="col-md-6">
                  <strong>Products Count:</strong> ${productCount}<br>
                  <strong>Status:</strong> <span class="badge ${category.isActive !== false ? 'bg-success' : 'bg-secondary'}">${category.isActive !== false ? 'Active' : 'Inactive'}</span><br>
                  ${category.imageUrl ? `<img src="${category.imageUrl}" class="img-thumbnail mt-2" style="max-width: 200px;">` : ''}
                </div>
              </div>
              <div class="mt-3">
                <button class="btn btn-primary" onclick="viewProductsByCategory(${categoryId})">
                  <i class="bi bi-box-seam me-1"></i>View Products (${productCount})
                </button>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" class="btn btn-warning" onclick="editCategory(${categoryId}); bootstrap.Modal.getInstance(document.getElementById('categoryDetailsModal')).hide();">
                <i class="bi bi-pencil me-1"></i>Edit Category
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    $('body').append(modal);
    const bsModal = new bootstrap.Modal(document.getElementById('categoryDetailsModal'));
    bsModal.show();
    $('#categoryDetailsModal').on('hidden.bs.modal', function() {
      $(this).remove();
    });
  }

  window.viewProductsByCategory = function(categoryId) {
    if (!categoryId) {
      alert('Category ID is required');
      return;
    }
    
    $.ajax({
      url: `${API_BASE_URL}/Category/${categoryId}/products?page=1&pageSize=10`,
      method: 'GET',
      headers: { 'Authorization': `Bearer ${getAuthToken()}` },
      success: function(response) {
        const products = response.data || response.items || response || [];
        showProductsModal(products, `Products in Category ${categoryId}`);
      },
      error: function(xhr) {
        console.error('Error fetching products:', xhr);
        alert('Error loading products');
      }
    });
  };

  function showProductsModal(products, title) {
    let productsHtml = '';
    if (products.length === 0) {
      productsHtml = '<p>No products found</p>';
    } else {
      productsHtml = '<div class="table-responsive"><table class="table table-sm"><thead><tr><th>ID</th><th>Name</th><th>Price</th></tr></thead><tbody>';
      products.forEach(product => {
        productsHtml += `
          <tr>
            <td>${product.productId || product.ProductId || 'N/A'}</td>
            <td>${product.productName || product.ProductName || 'N/A'}</td>
            <td>$${parseFloat(product.price || product.Price || 0).toFixed(2)}</td>
          </tr>
        `;
      });
      productsHtml += '</tbody></table></div>';
    }
    
    const modal = `
      <div class="modal fade" id="productsModal" tabindex="-1">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">${title}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              ${productsHtml}
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    `;
    $('body').append(modal);
    const bsModal = new bootstrap.Modal(document.getElementById('productsModal'));
    bsModal.show();
    $('#productsModal').on('hidden.bs.modal', function() {
      $(this).remove();
    });
  }

  window.editCategory = function(id) {
    showCategoryModal(id);
  };

  window.deleteCategory = function(id) {
    if (!id) {
      showNotification('Category ID is required', 'error');
      return;
    }
    
    showConfirmModal('Delete Category', 'Are you sure you want to delete this category?', function() {
      $.ajax({
        url: `${API_BASE_URL}/Category/${id}`,
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getAuthToken()}` },
        success: function(response) {
          fetchCategories();
          showNotification('Category deleted successfully', 'success');
        },
        error: function(xhr) {
          console.error('Error deleting category:', xhr);
          let errorMsg = 'Error deleting category';
          if (xhr.responseJSON && xhr.responseJSON.message) {
            errorMsg = xhr.responseJSON.message;
          }
          showNotification(errorMsg, 'error');
        }
      });
    });
  };

  window.saveCategory = function() {
    const categoryId = $('#categoryId').val();
    const formData = new FormData();
    
    formData.append('CategoryName', $('#categoryName').val());
    formData.append('CategoryDescription', $('#categoryDescription').val() || '');
    
    const imageFile = $('#categoryImage')[0].files[0];
    if (imageFile) {
      formData.append('Image', imageFile);
    }
    
    const method = categoryId ? 'PUT' : 'POST';
    const url = categoryId ? `${API_BASE_URL}/Category/${categoryId}` : `${API_BASE_URL}/Category`;
    
    $.ajax({
      url: url,
      method: method,
      headers: { 
        'Authorization': `Bearer ${getAuthToken()}`
      },
      processData: false,
      contentType: false,
      data: formData,
      success: function(response) {
        bootstrap.Modal.getInstance(document.getElementById('categoryModal')).hide();
        fetchCategories();
        showNotification(`Category ${categoryId ? 'updated' : 'created'} successfully`, 'success');
      },
      error: function(xhr) {
        console.error('Error saving category:', xhr);
        let errorMsg = 'Error saving category';
        if (xhr.responseJSON && xhr.responseJSON.message) {
          errorMsg = xhr.responseJSON.message;
        }
        alert(errorMsg);
      }
    });
  };

  function loadCategoryData(id) {
    $.ajax({
      url: `${API_BASE_URL}/Category/${id}`,
      method: 'GET',
      headers: { 'Authorization': `Bearer ${getAuthToken()}` },
      success: function(data) {
        $('#categoryId').val(data.categoryId || data.id || data.CategoryId);
        $('#categoryName').val(data.categoryName || data.name);
        $('#categoryDescription').val(data.categoryDescription || data.CategoryDescription || data.description || data.Description || '');
        $('#categoryIsActive').prop('checked', data.isActive !== false);
      },
      error: function(xhr) {
        console.error('Error loading category:', xhr);
        alert('Error loading category data');
      }
    });
  }

  // ==================== SUBCATEGORY SECTION ====================
  function loadSubcategory() {
    const html = `
      <div class="section-container">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h2 class="section-title"><i class="bi bi-folder2 me-2"></i>Subcategory Management</h2>
          <button class="btn btn-primary" id="btnAddSubcategory">
            <i class="bi bi-plus-circle me-2"></i>Add Subcategory
          </button>
        </div>
        <div class="card">
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-hover" id="subcategoryTable">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody id="subcategoryTableBody">
                  <tr><td colspan="7" class="text-center">Loading...</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    `;
    $("#dynamicContentContainer").show().html(html);
    fetchSubcategories();
    
    $(document).off('click', '#btnAddSubcategory').on('click', '#btnAddSubcategory', showSubcategoryModal);
  }

  function fetchSubcategories() {
    $.ajax({
      url: `${API_BASE_URL}/Category/subcategory`,
      method: 'GET',
      headers: { 'Authorization': `Bearer ${getAuthToken()}` },
      success: function(data) {
        renderSubcategoriesTable(data);
      },
      error: function(xhr) {
        console.error('Error fetching subcategories:', xhr);
        let errorMsg = 'Error loading subcategories';
        if (xhr.responseJSON && xhr.responseJSON.message) {
          errorMsg = xhr.responseJSON.message;
        }
        $("#subcategoryTableBody").html(`<tr><td colspan="7" class="text-center text-danger">${errorMsg}</td></tr>`);
      }
    });
  }

  function renderSubcategoriesTable(subcategories) {
    if (!subcategories || subcategories.length === 0) {
      $("#subcategoryTableBody").html('<tr><td colspan="7" class="text-center">No subcategories found</td></tr>');
      return;
    }
    let html = '';
    subcategories.forEach(sub => {
      const subcategoryId = sub.subCategoryId || sub.id || sub.SubCategoryId;
      html += `
        <tr>
          <td>${subcategoryId || 'N/A'}</td>
          <td>${sub.subCategoryName || sub.name || 'N/A'}</td>
          <td>${sub.categoryName || sub.categoryId || 'N/A'}</td>
          <td>${sub.subCategoryDescription || sub.description || 'N/A'}</td>
          <td><span class="badge ${sub.isActive !== false ? 'bg-success' : 'bg-secondary'}">${sub.isActive !== false ? 'Active' : 'Inactive'}</span></td>
          <td>
            <button class="btn btn-sm btn-info me-1" onclick="viewSubcategoryDetails(${subcategoryId})" title="View Details">
              <i class="bi bi-eye"></i>
            </button>
            <button class="btn btn-sm btn-primary me-1" onclick="editSubcategory(${subcategoryId})" title="Edit">
              <i class="bi bi-pencil"></i>
            </button>
            <button class="btn btn-sm btn-danger" onclick="deleteSubcategory(${subcategoryId})" title="Delete">
              <i class="bi bi-trash"></i>
            </button>
          </td>
        </tr>
      `;
    });
    $("#subcategoryTableBody").html(html);
  }

  function showSubcategoryModal(id = null) {
    const isEdit = id !== null;
    const modal = `
      <div class="modal fade" id="subcategoryModal" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">${isEdit ? 'Edit' : 'Add'} Subcategory</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <form id="subcategoryForm" enctype="multipart/form-data">
                <input type="hidden" id="subcategoryId" value="${id || ''}">
                <div class="mb-3">
                  <label class="form-label">Category <span class="text-danger">*</span></label>
                  <select class="form-select" id="subcategoryCategoryId" required>
                    <option value="">Select Category</option>
                  </select>
                </div>
                <div class="mb-3">
                  <label class="form-label">Name <span class="text-danger">*</span></label>
                  <input type="text" class="form-control" id="subcategoryName" required>
                </div>
                <div class="mb-3">
                  <label class="form-label">Description</label>
                  <textarea class="form-control" id="subcategoryDescription" rows="3"></textarea>
                </div>
                <div class="mb-3">
                  <label class="form-label">Image</label>
                  <input type="file" class="form-control" id="subcategoryImage" accept="image/*">
                  <small class="text-muted">Image will be uploaded to AWS S3</small>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="button" class="btn btn-primary" onclick="saveSubcategory()">Save</button>
            </div>
          </div>
        </div>
      </div>
    `;
    $('body').append(modal);
    loadCategoriesForSubcategory();
    const bsModal = new bootstrap.Modal(document.getElementById('subcategoryModal'));
    bsModal.show();
    $('#subcategoryModal').on('hidden.bs.modal', function() {
      $(this).remove();
    });
    if (isEdit) loadSubcategoryData(id);
  }

  function loadCategoriesForSubcategory() {
    $.ajax({
      url: `${API_BASE_URL}/Category?page=1&pageSize=100`,
      method: 'GET',
      headers: { 'Authorization': `Bearer ${getAuthToken()}` },
      success: function(response) {
        const categories = response.data || response.items || response || [];
        const select = $('#subcategoryCategoryId');
        select.empty().append('<option value="">Select Category</option>');
        if (categories && categories.length > 0) {
          categories.forEach(cat => {
            const catId = cat.categoryId || cat.id || cat.CategoryId;
            const catName = cat.categoryName || cat.name;
            select.append(`<option value="${catId}">${catName}</option>`);
          });
        }
      },
      error: function() {
        console.error('Error loading categories for subcategory');
      }
    });
  }

  window.viewSubcategoryDetails = function(subcategoryId) {
    if (!subcategoryId) {
      alert('Subcategory ID is required');
      return;
    }
    
    $.ajax({
      url: `${API_BASE_URL}/Category/subcategory/${subcategoryId}`,
      method: 'GET',
      headers: { 'Authorization': `Bearer ${getAuthToken()}` },
      success: function(subcategory) {
        showSubcategoryDetailsModal(subcategory);
      },
      error: function(xhr) {
        console.error('Error fetching subcategory:', xhr);
        alert('Error loading subcategory details');
      }
    });
  };

  function showSubcategoryDetailsModal(subcategory) {
    const subcategoryId = subcategory.subCategoryId || subcategory.id || subcategory.SubCategoryId;
    const modal = `
      <div class="modal fade" id="subcategoryDetailsModal" tabindex="-1">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Subcategory Details - ${subcategory.subCategoryName || subcategory.name || 'N/A'}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <div class="row mb-3">
                <div class="col-md-6">
                  <strong>Subcategory ID:</strong> ${subcategoryId || 'N/A'}<br>
                  <strong>Name:</strong> ${subcategory.subCategoryName || subcategory.name || 'N/A'}<br>
                  <strong>Description:</strong> ${subcategory.subCategoryDescription || subcategory.description || 'N/A'}<br>
                </div>
                <div class="col-md-6">
                  <strong>Category:</strong> ${subcategory.categoryName || subcategory.categoryId || 'N/A'}<br>
                  <strong>Status:</strong> <span class="badge ${subcategory.isActive !== false ? 'bg-success' : 'bg-secondary'}">${subcategory.isActive !== false ? 'Active' : 'Inactive'}</span><br>
                  ${subcategory.imageUrl ? `<img src="${subcategory.imageUrl}" class="img-thumbnail mt-2" style="max-width: 200px;">` : ''}
                </div>
              </div>
              <div class="mt-3">
                <button class="btn btn-primary" onclick="viewProductsBySubcategory(${subcategoryId})">
                  <i class="bi bi-box-seam me-1"></i>View Products
                </button>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" class="btn btn-warning" onclick="editSubcategory(${subcategoryId}); bootstrap.Modal.getInstance(document.getElementById('subcategoryDetailsModal')).hide();">
                <i class="bi bi-pencil me-1"></i>Edit Subcategory
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    $('body').append(modal);
    const bsModal = new bootstrap.Modal(document.getElementById('subcategoryDetailsModal'));
    bsModal.show();
    $('#subcategoryDetailsModal').on('hidden.bs.modal', function() {
      $(this).remove();
    });
  }

  window.viewProductsBySubcategory = function(subcategoryId) {
    if (!subcategoryId) {
      alert('Subcategory ID is required');
      return;
    }
    
    $.ajax({
      url: `${API_BASE_URL}/Category/subcategory/${subcategoryId}/products?page=1&pageSize=10`,
      method: 'GET',
      headers: { 'Authorization': `Bearer ${getAuthToken()}` },
      success: function(response) {
        const products = response.data || response.items || response || [];
        showProductsModal(products, `Products in Subcategory ${subcategoryId}`);
      },
      error: function(xhr) {
        console.error('Error fetching products:', xhr);
        alert('Error loading products');
      }
    });
  };

  window.editSubcategory = function(id) {
    showSubcategoryModal(id);
  };

  window.deleteSubcategory = function(id) {
    if (!id) {
      showNotification('Subcategory ID is required', 'error');
      return;
    }
    
    showConfirmModal('Delete Subcategory', 'Are you sure you want to delete this subcategory?', function() {
      $.ajax({
        url: `${API_BASE_URL}/Category/subcategory/${id}`,
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getAuthToken()}` },
        success: function(response) {
          fetchSubcategories();
          showNotification('Subcategory deleted successfully', 'success');
        },
        error: function(xhr) {
          console.error('Error deleting subcategory:', xhr);
          let errorMsg = 'Error deleting subcategory';
          if (xhr.responseJSON && xhr.responseJSON.message) {
            errorMsg = xhr.responseJSON.message;
          }
          showNotification(errorMsg, 'error');
        }
      });
    });
  };

  window.saveSubcategory = function() {
    const subcategoryId = $('#subcategoryId').val();
    const formData = new FormData();
    
    formData.append('SubCategoryName', $('#subcategoryName').val());
    formData.append('SubCategoryDescription', $('#subcategoryDescription').val() || '');
    formData.append('CategoryId', $('#subcategoryCategoryId').val());
    
    const imageFile = $('#subcategoryImage')[0]?.files[0];
    if (imageFile) {
      formData.append('Image', imageFile);
    }
    
    const method = subcategoryId ? 'PUT' : 'POST';
    const url = subcategoryId ? `${API_BASE_URL}/Category/subcategory/${subcategoryId}` : `${API_BASE_URL}/Category/subcategory`;
    
    $.ajax({
      url: url,
      method: method,
      headers: { 
        'Authorization': `Bearer ${getAuthToken()}`
      },
      processData: false,
      contentType: false,
      data: formData,
      success: function(response) {
        bootstrap.Modal.getInstance(document.getElementById('subcategoryModal')).hide();
        fetchSubcategories();
        showNotification(`Subcategory ${subcategoryId ? 'updated' : 'created'} successfully`, 'success');
      },
      error: function(xhr) {
        console.error('Error saving subcategory:', xhr);
        let errorMsg = 'Error saving subcategory';
        if (xhr.responseJSON && xhr.responseJSON.message) {
          errorMsg = xhr.responseJSON.message;
        }
        alert(errorMsg);
      }
    });
  };

  function loadSubcategoryData(id) {
    $.ajax({
      url: `${API_BASE_URL}/Category/subcategory/${id}`,
      method: 'GET',
      headers: { 'Authorization': `Bearer ${getAuthToken()}` },
      success: function(data) {
        $('#subcategoryId').val(data.subCategoryId || data.id || data.SubCategoryId);
        $('#subcategoryCategoryId').val(data.categoryId || data.CategoryId);
        $('#subcategoryName').val(data.subCategoryName || data.name);
        $('#subcategoryDescription').val(data.subCategoryDescription || data.description);
        $('#subcategoryIsActive').prop('checked', data.isActive !== false);
      },
      error: function(xhr) {
        console.error('Error loading subcategory:', xhr);
        alert('Error loading subcategory data');
      }
    });
  }

  // ==================== PROFILE SECTION ====================
  function loadProfile() {
    const html = `
      <div class="section-container">
        <h2 class="section-title"><i class="bi bi-person-circle me-2"></i>Profile Management</h2>
        <div class="row">
          <div class="col-md-8">
            <div class="card">
              <div class="card-header">
                <h5>Merchant Profile</h5>
              </div>
              <div class="card-body">
                <form id="profileForm">
                  <input type="hidden" id="profileId">
                  <div class="row">
                    <div class="col-md-6 mb-3">
                      <label class="form-label">Store Name</label>
                      <input type="text" class="form-control" id="profileStoreName" required>
                    </div>
                    <div class="col-md-6 mb-3">
                      <label class="form-label">Email</label>
                      <input type="email" class="form-control" id="profileEmail" required>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-6 mb-3">
                      <label class="form-label">Phone</label>
                      <input type="tel" class="form-control" id="profilePhone">
                    </div>
                    <div class="col-md-6 mb-3">
                      <label class="form-label">Address</label>
                      <input type="text" class="form-control" id="profileAddress">
                    </div>
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Description</label>
                    <textarea class="form-control" id="profileDescription" rows="4"></textarea>
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Store Logo</label>
                    <input type="file" class="form-control" id="profileLogo" accept="image/*">
                    <small class="text-muted">Image will be uploaded to AWS S3</small>
                  </div>
                  <button type="button" class="btn btn-primary" onclick="saveProfile()">
                    <i class="bi bi-save me-2"></i>Save Profile
                  </button>
                </form>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card">
              <div class="card-header">
                <h5>Profile Image</h5>
              </div>
              <div class="card-body text-center">
                <img id="profileImagePreview" src="images/user.png" class="img-thumbnail mb-3" style="max-width: 200px;">
                <div class="mb-3">
                  <label class="form-label">Change Password</label>
                  <input type="password" class="form-control mb-2" id="profileOldPassword" placeholder="Old Password">
                  <input type="password" class="form-control mb-2" id="profileNewPassword" placeholder="New Password">
                  <input type="password" class="form-control" id="profileConfirmPassword" placeholder="Confirm Password">
                  <button type="button" class="btn btn-warning mt-2" onclick="changePassword()">
                    <i class="bi bi-key me-2"></i>Change Password
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    $("#dynamicContentContainer").show().html(html);
    loadProfileData();
  }

  function loadProfileData() {
    // Get user ID from token or API
    const authData = JSON.parse(localStorage.getItem('Auth') || sessionStorage.getItem('Auth') || '{}');
    const token = authData.jwt;
    if (!token) return;
    
    // Use the new merchant profile endpoint
    $.ajax({
      url: `${API_BASE_URL}/merchant/profile/me`,
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` },
      success: function(data) {
        $('#profileId').val(data.userId || '');
        $('#profileStoreName').val(data.storeName || '');
        $('#profileEmail').val(data.email || '');
        $('#profilePhone').val(data.phoneNumber || '');
        $('#profileDescription').val(data.description || '');
        if (data.logoUrl) {
          $('#profileImagePreview').attr('src', data.logoUrl);
        }
      },
      error: function(xhr) {
        console.log('Error loading profile:', xhr);
      }
    });
  }

  window.saveProfile = function() {
    const authData = JSON.parse(localStorage.getItem('Auth') || sessionStorage.getItem('Auth') || '{}');
    const token = authData.jwt;
    let userId = null;
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        userId = payload.sub || payload.nameid;
      } catch(e) {
        console.error('Error parsing token:', e);
      }
    }
    
    if (!userId) {
      alert('User ID not found');
      return;
    }
    
    // Update profile
    const profileData = {
      userId: userId,
      firstName: $('#profileStoreName').val().split(' ')[0] || '',
      lastName: $('#profileStoreName').val().split(' ').slice(1).join(' ') || '',
      email: $('#profileEmail').val(),
      phoneNumber: $('#profilePhone').val()
    };
    
    $.ajax({
      url: `${API_BASE_URL}/merchant/profile`,
      method: 'PUT',
      contentType: 'application/json',
      headers: { 'Authorization': `Bearer ${getAuthToken()}` },
      data: JSON.stringify(profileData),
      success: function() {
        // Update store info if storeId is available
        const storeId = getStoreId();
        if (storeId) {
          const formData = new FormData();
          formData.append('StoreId', storeId);
          formData.append('StoreName', $('#profileStoreName').val());
          formData.append('Description', $('#profileDescription').val() || '');
          
          const logoFile = $('#profileLogo')[0]?.files[0];
          if (logoFile) {
            formData.append('Logo', logoFile);
          }
          
          $.ajax({
            url: `${API_BASE_URL}/merchant/profile/store`,
            method: 'PUT',
            headers: { 
              'Authorization': `Bearer ${getAuthToken()}`
            },
            processData: false,
            contentType: false,
            data: formData,
            success: function() {
              alert('Profile updated successfully');
              loadProfileData();
            },
            error: function() {
              alert('Profile updated but store info update failed');
              loadProfileData();
            }
          });
        } else {
          alert('Profile updated successfully');
          loadProfileData();
        }
      },
      error: function() {
        alert('Error updating profile');
      }
    });
  };

  window.changePassword = function() {
    const oldPassword = $('#profileOldPassword').val();
    const newPassword = $('#profileNewPassword').val();
    const confirmPassword = $('#profileConfirmPassword').val();
    
    if (newPassword !== confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    
    $.ajax({
      url: `${API_BASE_URL}/merchant/profile/change-password`,
      method: 'POST',
      contentType: 'application/json',
      headers: { 'Authorization': `Bearer ${getAuthToken()}` },
      data: JSON.stringify({
        oldPassword: oldPassword,
        newPassword: newPassword
      }),
      success: function() {
        alert('Password changed successfully');
        $('#profileOldPassword, #profileNewPassword, #profileConfirmPassword').val('');
      },
      error: function(xhr) {
        let errorMsg = 'Error changing password';
        if (xhr.responseJSON && xhr.responseJSON.message) {
          errorMsg = xhr.responseJSON.message;
        }
        alert(errorMsg);
      }
    });
  };

  // ==================== PRODUCTS LIST SECTION ====================
  function loadProductsList() {
    const html = `
      <div class="section-container">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h2 class="section-title"><i class="bi bi-box-seam me-2"></i>Products Management</h2>
          <div class="d-flex gap-2">
            <button class="btn btn-success" id="btnAddNewProduct">
              <i class="bi bi-plus-circle me-2"></i>Add New Product
            </button>
            <button class="btn btn-primary" id="btnRefreshProducts">
              <i class="bi bi-arrow-clockwise me-2"></i>Refresh
            </button>
          </div>
        </div>
        <div class="card">
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-hover" id="productsTable">
                <thead>
                  <tr>
                    <th>Product ID</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody id="productsTableBody">
                  <tr><td colspan="6" class="text-center">Loading...</td></tr>
                </tbody>
              </table>
            </div>
            <div class="d-flex justify-content-between align-items-center mt-3">
              <div>
                <label class="me-2">Page:</label>
                <input type="number" id="productsPageNumber" class="form-control d-inline-block" style="width: 80px;" value="1" min="1">
                <label class="ms-2 me-2">Page Size:</label>
                <select id="productsPageSize" class="form-select d-inline-block" style="width: 100px;">
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                </select>
              </div>
              <div id="productsPaginationInfo"></div>
            </div>
          </div>
        </div>
      </div>
    `;
    $("#dynamicContentContainer").show().html(html);
    
    const authData = JSON.parse(localStorage.getItem('Auth') || sessionStorage.getItem('Auth') || '{}');
    const token = authData.jwt;
    let userId = null;
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        userId = payload.sub || payload.nameid;
      } catch(e) {
        console.error('Error parsing token:', e);
      }
    }
    
    if (userId) {
      fetchProducts(userId);
    } else {
      $("#productsTableBody").html('<tr><td colspan="6" class="text-center text-danger">User ID not found</td></tr>');
    }
    
    $(document).off('click', '#btnRefreshProducts').on('click', '#btnRefreshProducts', function() {
      if (userId) fetchProducts(userId);
    });
    
    $(document).off('click', '#btnAddNewProduct').on('click', '#btnAddNewProduct', function() {
      $("#dynamicContentContainer").hide();
      $("#productWizardContainer").show();
    });
    
    $(document).off('change', '#productsPageNumber, #productsPageSize').on('change', '#productsPageNumber, #productsPageSize', function() {
      if (userId) fetchProducts(userId);
    });
  }

  function fetchProducts(merchantId, page = 1, pageSize = 10) {
    page = parseInt($('#productsPageNumber').val()) || page;
    pageSize = parseInt($('#productsPageSize').val()) || pageSize;
    
    $.ajax({
      url: `${API_BASE_URL}/merchant/products/merchant/${merchantId}?page=${page}&pageSize=${pageSize}`,
      method: 'GET',
      headers: { 'Authorization': `Bearer ${getAuthToken()}` },
      success: function(response) {
        const products = response.data || response.items || response || [];
        const totalCount = response.totalCount || response.total || products.length;
        const totalPages = response.totalPages || Math.ceil(totalCount / pageSize);
        
        renderProductsTable(products);
        updateProductsPaginationInfo(page, totalPages, totalCount);
      },
      error: function(xhr) {
        console.error('Error fetching products:', xhr);
        let errorMsg = 'Error loading products';
        if (xhr.responseJSON && xhr.responseJSON.message) {
          errorMsg = xhr.responseJSON.message;
        }
        $("#productsTableBody").html(`<tr><td colspan="6" class="text-center text-danger">${errorMsg}</td></tr>`);
      }
    });
  }

  function renderProductsTable(products) {
    if (!products || products.length === 0) {
      $("#productsTableBody").html('<tr><td colspan="6" class="text-center">No products found</td></tr>');
      return;
    }
    
    let html = '';
    products.forEach(product => {
      html += `
        <tr>
          <td>${product.productId || product.ProductId || 'N/A'}</td>
          <td>${product.productName || product.ProductName || 'N/A'}</td>
          <td>$${parseFloat(product.price || product.Price || 0).toFixed(2)}</td>
          <td>${product.categoryName || product.CategoryName || 'N/A'}</td>
          <td><span class="badge ${product.isActive !== false ? 'bg-success' : 'bg-secondary'}">${product.isActive !== false ? 'Active' : 'Inactive'}</span></td>
          <td>
            <button class="btn btn-sm btn-primary me-1" onclick="viewProductDetails(${product.productId || product.ProductId})" title="View Details">
              <i class="bi bi-eye"></i>
            </button>
            <button class="btn btn-sm btn-warning me-1" onclick="editProduct(${product.productId || product.ProductId})" title="Edit">
              <i class="bi bi-pencil"></i>
            </button>
            <button class="btn btn-sm btn-danger" onclick="deleteProduct(${product.productId || product.ProductId})" title="Delete">
              <i class="bi bi-trash"></i>
            </button>
          </td>
        </tr>
      `;
    });
    $("#productsTableBody").html(html);
  }

  function updateProductsPaginationInfo(currentPage, totalPages, totalCount) {
    $('#productsPaginationInfo').text(`Page ${currentPage} of ${totalPages} (Total: ${totalCount} products)`);
  }

  window.viewProductDetails = function(productId) {
    if (!productId) {
      alert('Product ID is required');
      return;
    }
    
    $.ajax({
      url: `${API_BASE_URL}/merchant/products/${productId}`,
      method: 'GET',
      headers: { 'Authorization': `Bearer ${getAuthToken()}` },
      success: function(product) {
        const modal = `
          <div class="modal fade" id="productDetailsModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title">Product Details - ${product.productName || product.ProductName || 'N/A'}</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                  <div class="row mb-3">
                    <div class="col-md-6">
                      <strong>Product ID:</strong> ${product.productId || product.ProductId || 'N/A'}<br>
                      <strong>Name:</strong> ${product.productName || product.ProductName || 'N/A'}<br>
                      <strong>Price:</strong> $${parseFloat(product.price || product.Price || 0).toFixed(2)}<br>
                    </div>
                    <div class="col-md-6">
                      <strong>Category:</strong> ${product.categoryName || product.CategoryName || 'N/A'}<br>
                      <strong>Status:</strong> <span class="badge ${product.isActive !== false ? 'bg-success' : 'bg-secondary'}">${product.isActive !== false ? 'Active' : 'Inactive'}</span><br>
                    </div>
                  </div>
                  ${product.description ? `<p><strong>Description:</strong> ${product.description || product.Description}</p>` : ''}
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  <button type="button" class="btn btn-warning" onclick="editProduct(${product.productId || product.ProductId}); bootstrap.Modal.getInstance(document.getElementById('productDetailsModal')).hide();">
                    <i class="bi bi-pencil me-1"></i>Edit Product
                  </button>
                </div>
              </div>
            </div>
          </div>
        `;
        $('body').append(modal);
        const bsModal = new bootstrap.Modal(document.getElementById('productDetailsModal'));
        bsModal.show();
        $('#productDetailsModal').on('hidden.bs.modal', function() {
          $(this).remove();
        });
      },
      error: function(xhr) {
        console.error('Error fetching product details:', xhr);
        let errorMsg = 'Error loading product details';
        if (xhr.responseJSON && xhr.responseJSON.message) {
          errorMsg = xhr.responseJSON.message;
        }
        alert(errorMsg);
      }
    });
  };

  window.editProduct = function(productId) {
    alert('Edit product functionality - To be implemented. Product ID: ' + productId);
    // TODO: Implement edit product functionality
  };

  window.deleteProduct = function(productId) {
    if (!productId) {
      alert('Product ID is required');
      return;
    }
    
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }
    
    $.ajax({
      url: `${API_BASE_URL}/merchant/products/${productId}`,
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${getAuthToken()}` },
      success: function(response) {
        alert('Product deleted successfully!');
        const authData = JSON.parse(localStorage.getItem('Auth') || sessionStorage.getItem('Auth') || '{}');
        const token = authData.jwt;
        let userId = null;
        if (token) {
          try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            userId = payload.sub || payload.nameid;
          } catch(e) {
            console.error('Error parsing token:', e);
          }
        }
        if (userId) fetchProducts(userId);
      },
      error: function(xhr) {
        console.error('Error deleting product:', xhr);
        let errorMsg = 'Error deleting product';
        if (xhr.responseJSON && xhr.responseJSON.message) {
          errorMsg = xhr.responseJSON.message;
        }
        alert(errorMsg);
      }
    });
  };

  // ==================== ORDERS SECTION ====================
  function loadOrders() {
    const html = `
      <div class="section-container">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h2 class="section-title"><i class="bi bi-cart-check me-2"></i>Order Management</h2>
          <div class="d-flex gap-2">
            <select class="form-select" id="orderStatusFilter" style="width: auto;">
              <option value="">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <button class="btn btn-primary" id="btnRefreshOrders">
              <i class="bi bi-arrow-clockwise me-2"></i>Refresh
            </button>
          </div>
        </div>
        <div class="card">
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-hover" id="ordersTable">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Order Date</th>
                    <th>Total Amount</th>
                    <th>Payment Type</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody id="ordersTableBody">
                  <tr><td colspan="6" class="text-center">Loading...</td></tr>
                </tbody>
              </table>
            </div>
            <div class="d-flex justify-content-between align-items-center mt-3">
              <div>
                <label class="me-2">Page:</label>
                <input type="number" id="orderPageNumber" class="form-control d-inline-block" style="width: 80px;" value="1" min="1">
                <label class="ms-2 me-2">Page Size:</label>
                <select id="orderPageSize" class="form-select d-inline-block" style="width: 100px;">
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                </select>
              </div>
              <div id="orderPaginationInfo"></div>
            </div>
          </div>
        </div>
      </div>
    `;
    $("#dynamicContentContainer").show().html(html);
    
    // Get store ID from token or user data
    const storeId = getStoreId();
    if (storeId) {
      fetchOrders(storeId);
    } else {
      $("#ordersTableBody").html('<tr><td colspan="6" class="text-center text-danger">Store ID not found. Please check your authentication.</td></tr>');
    }
    
    // Event handlers
    $(document).off('click', '#btnRefreshOrders').on('click', '#btnRefreshOrders', function() {
      const storeId = getStoreId();
      if (storeId) fetchOrders(storeId);
    });
    
    $(document).off('change', '#orderStatusFilter').on('change', '#orderStatusFilter', function() {
      const storeId = getStoreId();
      if (storeId) fetchOrders(storeId);
    });
    
    $(document).off('change', '#orderPageNumber, #orderPageSize').on('change', '#orderPageNumber, #orderPageSize', function() {
      const storeId = getStoreId();
      if (storeId) fetchOrders(storeId);
    });
  }

  function getStoreId() {
    // Try to get store ID from localStorage/sessionStorage or decode from token
    const authData = JSON.parse(localStorage.getItem('Auth') || sessionStorage.getItem('Auth') || '{}');
    const token = authData.jwt;
    if (!token) return null;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      // Try to get storeId from token claims or use a default/fallback
      // You may need to adjust this based on your token structure
      return payload.storeId || payload.StoreId || 1; // Fallback to 1 if not found
    } catch(e) {
      console.error('Error parsing token:', e);
      return 1; // Fallback
    }
  }

  function fetchOrders(storeId, page = 1, pageSize = 10) {
    const statusFilter = $('#orderStatusFilter').val();
    page = parseInt($('#orderPageNumber').val()) || page;
    pageSize = parseInt($('#orderPageSize').val()) || pageSize;
    
    let url = `${API_BASE_URL}/merchant/orders/store/${storeId}?page=${page}&pageSize=${pageSize}`;
    
    // If status filter is selected, use filter endpoint
    if (statusFilter) {
      url = `${API_BASE_URL}/merchant/orders/filter?storeId=${storeId}&status=${statusFilter}&page=${page}&pageSize=${pageSize}`;
    }
    
    $.ajax({
      url: url,
      method: 'GET',
      headers: { 'Authorization': `Bearer ${getAuthToken()}` },
      success: function(response) {
        // Handle both direct array and paged result
        const orders = response.data || response.items || response || [];
        const totalCount = response.totalCount || response.total || orders.length;
        const totalPages = response.totalPages || Math.ceil(totalCount / pageSize);
        
        renderOrdersTable(orders);
        updateOrderPaginationInfo(page, totalPages, totalCount);
      },
      error: function(xhr) {
        console.error('Error fetching orders:', xhr);
        let errorMsg = 'Error loading orders';
        if (xhr.responseJSON && xhr.responseJSON.message) {
          errorMsg = xhr.responseJSON.message;
        }
        $("#ordersTableBody").html(`<tr><td colspan="6" class="text-center text-danger">${errorMsg}</td></tr>`);
      }
    });
  }

  function renderOrdersTable(orders) {
    if (!orders || orders.length === 0) {
      $("#ordersTableBody").html('<tr><td colspan="6" class="text-center">No orders found</td></tr>');
      return;
    }
    
    let html = '';
    orders.forEach(order => {
      const status = getOrderStatusText(order.statusId || order.status || 'Pending');
      const statusClass = getOrderStatusClass(status);
      const canAllow = status.toLowerCase() === 'pending' || status.toLowerCase() === 'processing';
      
      html += `
        <tr>
          <td>${order.orderId || order.OrderId || 'N/A'}</td>
          <td>${formatDate(order.orderDate || order.OrderDate)}</td>
          <td>$${parseFloat(order.totalAmount || order.TotalAmount || 0).toFixed(2)}</td>
          <td>${order.paymentType || order.PaymentType || 'N/A'}</td>
          <td><span class="badge ${statusClass}">${status}</span></td>
          <td>
            <button class="btn btn-sm btn-success me-1 ${canAllow ? '' : 'd-none'}" onclick="allowOrder('${order.orderId || order.OrderId}')" title="Allow/Approve Order">
              <i class="bi bi-check-circle me-1"></i>Allow
            </button>
            <button class="btn btn-sm btn-primary me-1" onclick="viewOrderDetails('${order.orderId || order.OrderId}')" title="View Details">
              <i class="bi bi-eye"></i>
            </button>
            <button class="btn btn-sm btn-warning" onclick="updateOrderStatus('${order.orderId || order.OrderId}')" title="Update Status">
              <i class="bi bi-pencil"></i>
            </button>
          </td>
        </tr>
      `;
    });
    $("#ordersTableBody").html(html);
  }

  function getOrderStatusText(statusId) {
    const statusMap = {
      1: 'Pending',
      2: 'Approved',
      3: 'Processing',
      4: 'Shipped',
      5: 'Delivered',
      6: 'Cancelled'
    };
    if (typeof statusId === 'number') {
      return statusMap[statusId] || 'Pending';
    }
    return statusId || 'Pending';
  }

  function getOrderStatusClass(status) {
    const statusLower = status.toLowerCase();
    if (statusLower === 'approved' || statusLower === 'delivered') return 'bg-success';
    if (statusLower === 'pending') return 'bg-warning';
    if (statusLower === 'processing' || statusLower === 'shipped') return 'bg-info';
    if (statusLower === 'cancelled') return 'bg-danger';
    return 'bg-secondary';
  }

  function formatDate(dateString) {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    } catch(e) {
      return dateString;
    }
  }

  function updateOrderPaginationInfo(currentPage, totalPages, totalCount) {
    $('#orderPaginationInfo').text(`Page ${currentPage} of ${totalPages} (Total: ${totalCount} orders)`);
  }

  // Allow/Approve Order Function
  window.allowOrder = function(orderId) {
    if (!orderId) {
      alert('Order ID is required');
      return;
    }
    
    if (!confirm('Are you sure you want to approve/allow this order?')) {
      return;
    }
    
    updateOrderStatusTo(orderId, 'Approved');
  };

  // Update Order Status Function
  window.updateOrderStatus = function(orderId) {
    if (!orderId) {
      alert('Order ID is required');
      return;
    }
    
    const statusOptions = ['Pending', 'Approved', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    const currentStatus = prompt('Enter new status:\n' + statusOptions.join(', '));
    
    if (currentStatus && statusOptions.includes(currentStatus)) {
      updateOrderStatusTo(orderId, currentStatus);
    } else if (currentStatus) {
      alert('Invalid status. Please use one of: ' + statusOptions.join(', '));
    }
  };

  function updateOrderStatusTo(orderId, status) {
    $.ajax({
      url: `${API_BASE_URL}/merchant/orders/${orderId}/status`,
      method: 'PUT',
      contentType: 'application/json',
      headers: { 'Authorization': `Bearer ${getAuthToken()}` },
      data: JSON.stringify({ status: status }),
      success: function(response) {
        alert('Order status updated successfully!');
        // Refresh orders list
        const storeId = getStoreId();
        if (storeId) fetchOrders(storeId);
      },
      error: function(xhr) {
        console.error('Error updating order status:', xhr);
        let errorMsg = 'Error updating order status';
        if (xhr.responseJSON && xhr.responseJSON.message) {
          errorMsg = xhr.responseJSON.message;
        }
        alert(errorMsg);
      }
    });
  }

  // View Order Details Function
  window.viewOrderDetails = function(orderId) {
    if (!orderId) {
      alert('Order ID is required');
      return;
    }
    
    $.ajax({
      url: `${API_BASE_URL}/merchant/orders/${orderId}`,
      method: 'GET',
      headers: { 'Authorization': `Bearer ${getAuthToken()}` },
      success: function(order) {
        showOrderDetailsModal(order);
      },
      error: function(xhr) {
        console.error('Error fetching order details:', xhr);
        let errorMsg = 'Error loading order details';
        if (xhr.responseJSON && xhr.responseJSON.message) {
          errorMsg = xhr.responseJSON.message;
        }
        alert(errorMsg);
      }
    });
  };

  function showOrderDetailsModal(order) {
    const modal = `
      <div class="modal fade" id="orderDetailsModal" tabindex="-1">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Order Details - ${order.orderId || order.OrderId || 'N/A'}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <div class="row mb-3">
                <div class="col-md-6">
                  <strong>Order ID:</strong> ${order.orderId || order.OrderId || 'N/A'}<br>
                  <strong>Order Date:</strong> ${formatDate(order.orderDate || order.OrderDate)}<br>
                  <strong>Total Amount:</strong> $${parseFloat(order.totalAmount || order.TotalAmount || 0).toFixed(2)}<br>
                </div>
                <div class="col-md-6">
                  <strong>Payment Type:</strong> ${order.paymentType || order.PaymentType || 'N/A'}<br>
                  <strong>Status:</strong> <span class="badge ${getOrderStatusClass(getOrderStatusText(order.statusId || order.status))}">${getOrderStatusText(order.statusId || order.status)}</span><br>
                </div>
              </div>
              ${order.items ? `
                <h6>Order Items:</h6>
                <div class="table-responsive">
                  <table class="table table-sm">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${order.items.map(item => `
                        <tr>
                          <td>${item.productName || 'N/A'}</td>
                          <td>${item.quantity || 0}</td>
                          <td>$${parseFloat(item.price || 0).toFixed(2)}</td>
                          <td>$${parseFloat((item.quantity || 0) * (item.price || 0)).toFixed(2)}</td>
                        </tr>
                      `).join('')}
                    </tbody>
                  </table>
                </div>
              ` : ''}
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              ${getOrderStatusText(order.statusId || order.status).toLowerCase() === 'pending' ? `
                <button type="button" class="btn btn-success" onclick="allowOrder('${order.orderId || order.OrderId}'); bootstrap.Modal.getInstance(document.getElementById('orderDetailsModal')).hide();">
                  <i class="bi bi-check-circle me-1"></i>Allow Order
                </button>
              ` : ''}
            </div>
          </div>
        </div>
      </div>
    `;
    $('body').append(modal);
    const bsModal = new bootstrap.Modal(document.getElementById('orderDetailsModal'));
    bsModal.show();
    $('#orderDetailsModal').on('hidden.bs.modal', function() {
      $(this).remove();
    });
  }

  // ==================== INVENTORY SECTION ====================
  function loadInventory() {
    const html = `
      <div class="section-container">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h2 class="section-title"><i class="bi bi-boxes me-2"></i>Inventory Management</h2>
          <div class="d-flex gap-2">
            <button class="btn btn-warning" id="btnLowStockAlerts">
              <i class="bi bi-exclamation-triangle me-2"></i>Low Stock Alerts
            </button>
            <button class="btn btn-primary" id="btnRefreshInventory">
              <i class="bi bi-arrow-clockwise me-2"></i>Refresh
            </button>
          </div>
        </div>
        <div class="card">
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-hover" id="inventoryTable">
                <thead>
                  <tr>
                    <th>Inventory ID</th>
                    <th>Product Detail ID</th>
                    <th>Available</th>
                    <th>Reserved</th>
                    <th>Reorder Level</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody id="inventoryTableBody">
                  <tr><td colspan="7" class="text-center">Loading...</td></tr>
                </tbody>
              </table>
            </div>
            <div class="d-flex justify-content-between align-items-center mt-3">
              <div>
                <label class="me-2">Page:</label>
                <input type="number" id="inventoryPageNumber" class="form-control d-inline-block" style="width: 80px;" value="1" min="1">
                <label class="ms-2 me-2">Page Size:</label>
                <select id="inventoryPageSize" class="form-select d-inline-block" style="width: 100px;">
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                </select>
              </div>
              <div id="inventoryPaginationInfo"></div>
            </div>
          </div>
        </div>
      </div>
    `;
    $("#dynamicContentContainer").show().html(html);
    
    const storeId = getStoreId();
    if (storeId) {
      fetchInventory(storeId);
    } else {
      $("#inventoryTableBody").html('<tr><td colspan="7" class="text-center text-danger">Store ID not found</td></tr>');
    }
    
    $(document).off('click', '#btnRefreshInventory').on('click', '#btnRefreshInventory', function() {
      const storeId = getStoreId();
      if (storeId) fetchInventory(storeId);
    });
    
    $(document).off('click', '#btnLowStockAlerts').on('click', '#btnLowStockAlerts', function() {
      const storeId = getStoreId();
      if (storeId) fetchLowStockAlerts(storeId);
    });
    
    $(document).off('change', '#inventoryPageNumber, #inventoryPageSize').on('change', '#inventoryPageNumber, #inventoryPageSize', function() {
      const storeId = getStoreId();
      if (storeId) fetchInventory(storeId);
    });
  }

  function fetchInventory(storeId, page = 1, pageSize = 10) {
    page = parseInt($('#inventoryPageNumber').val()) || page;
    pageSize = parseInt($('#inventoryPageSize').val()) || pageSize;
    
    $.ajax({
      url: `${API_BASE_URL}/merchant/inventory/store/${storeId}?page=${page}&pageSize=${pageSize}`,
      method: 'GET',
      headers: { 'Authorization': `Bearer ${getAuthToken()}` },
      success: function(response) {
        const inventory = response.data || response.items || response || [];
        const totalCount = response.totalCount || response.total || inventory.length;
        const totalPages = response.totalPages || Math.ceil(totalCount / pageSize);
        
        renderInventoryTable(inventory);
        updateInventoryPaginationInfo(page, totalPages, totalCount);
      },
      error: function(xhr) {
        console.error('Error fetching inventory:', xhr);
        let errorMsg = 'Error loading inventory';
        if (xhr.responseJSON && xhr.responseJSON.message) {
          errorMsg = xhr.responseJSON.message;
        }
        $("#inventoryTableBody").html(`<tr><td colspan="7" class="text-center text-danger">${errorMsg}</td></tr>`);
      }
    });
  }

  function fetchLowStockAlerts(storeId, page = 1, pageSize = 10) {
    page = parseInt($('#inventoryPageNumber').val()) || page;
    pageSize = parseInt($('#inventoryPageSize').val()) || pageSize;
    
    $.ajax({
      url: `${API_BASE_URL}/merchant/inventory/store/${storeId}/low-stock?page=${page}&pageSize=${pageSize}`,
      method: 'GET',
      headers: { 'Authorization': `Bearer ${getAuthToken()}` },
      success: function(response) {
        const inventory = response.data || response.items || response || [];
        const totalCount = response.totalCount || response.total || inventory.length;
        const totalPages = response.totalPages || Math.ceil(totalCount / pageSize);
        
        renderInventoryTable(inventory);
        updateInventoryPaginationInfo(page, totalPages, totalCount);
      },
      error: function(xhr) {
        console.error('Error fetching low stock alerts:', xhr);
        let errorMsg = 'Error loading low stock alerts';
        if (xhr.responseJSON && xhr.responseJSON.message) {
          errorMsg = xhr.responseJSON.message;
        }
        alert(errorMsg);
      }
    });
  }

  function renderInventoryTable(inventory) {
    if (!inventory || inventory.length === 0) {
      $("#inventoryTableBody").html('<tr><td colspan="7" class="text-center">No inventory items found</td></tr>');
      return;
    }
    
    let html = '';
    inventory.forEach(item => {
      const isLowStock = item.quantityAvailable <= item.reorderLevel;
      const statusClass = isLowStock ? 'bg-danger' : 'bg-success';
      const statusText = isLowStock ? 'Low Stock' : 'In Stock';
      
      html += `
        <tr>
          <td>${item.inventoryId || item.InventoryId || 'N/A'}</td>
          <td>${item.productDetailId || item.ProductDetailId || 'N/A'}</td>
          <td>${item.quantityAvailable || item.QuantityAvailable || 0}</td>
          <td>${item.quantityReserved || item.QuantityReserved || 0}</td>
          <td>${item.reorderLevel || item.ReorderLevel || 0}</td>
          <td><span class="badge ${statusClass}">${statusText}</span></td>
          <td>
            <button class="btn btn-sm btn-success me-1" onclick="updateStockQuantity(${item.productDetailId || item.ProductDetailId})" title="Update Stock">
              <i class="bi bi-pencil me-1"></i>Update
            </button>
            <button class="btn btn-sm btn-primary" onclick="viewInventoryDetails(${item.productDetailId || item.ProductDetailId})" title="View Details">
              <i class="bi bi-eye"></i>
            </button>
          </td>
        </tr>
      `;
    });
    $("#inventoryTableBody").html(html);
  }

  function updateInventoryPaginationInfo(currentPage, totalPages, totalCount) {
    $('#inventoryPaginationInfo').text(`Page ${currentPage} of ${totalPages} (Total: ${totalCount} items)`);
  }

  window.updateStockQuantity = function(productDetailId) {
    if (!productDetailId) {
      alert('Product Detail ID is required');
      return;
    }
    
    const newQuantity = prompt('Enter new stock quantity:');
    if (newQuantity === null) return;
    
    const quantity = parseInt(newQuantity);
    if (isNaN(quantity) || quantity < 0) {
      alert('Please enter a valid positive number');
      return;
    }
    
    $.ajax({
      url: `${API_BASE_URL}/merchant/inventory/product-detail/${productDetailId}/stock`,
      method: 'PUT',
      contentType: 'application/json',
      headers: { 'Authorization': `Bearer ${getAuthToken()}` },
      data: JSON.stringify({ newQuantity: quantity }),
      success: function(response) {
        alert('Stock quantity updated successfully!');
        const storeId = getStoreId();
        if (storeId) fetchInventory(storeId);
      },
      error: function(xhr) {
        console.error('Error updating stock:', xhr);
        let errorMsg = 'Error updating stock quantity';
        if (xhr.responseJSON && xhr.responseJSON.message) {
          errorMsg = xhr.responseJSON.message;
        }
        alert(errorMsg);
      }
    });
  };

  window.viewInventoryDetails = function(productDetailId) {
    if (!productDetailId) {
      alert('Product Detail ID is required');
      return;
    }
    
    $.ajax({
      url: `${API_BASE_URL}/merchant/inventory/product-detail/${productDetailId}`,
      method: 'GET',
      headers: { 'Authorization': `Bearer ${getAuthToken()}` },
      success: function(inventory) {
        const modal = `
          <div class="modal fade" id="inventoryDetailsModal" tabindex="-1">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title">Inventory Details</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                  <p><strong>Inventory ID:</strong> ${inventory.inventoryId || inventory.InventoryId || 'N/A'}</p>
                  <p><strong>Product Detail ID:</strong> ${inventory.productDetailId || inventory.ProductDetailId || 'N/A'}</p>
                  <p><strong>Available Quantity:</strong> ${inventory.quantityAvailable || inventory.QuantityAvailable || 0}</p>
                  <p><strong>Reserved Quantity:</strong> ${inventory.quantityReserved || inventory.QuantityReserved || 0}</p>
                  <p><strong>Reorder Level:</strong> ${inventory.reorderLevel || inventory.ReorderLevel || 0}</p>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  <button type="button" class="btn btn-success" onclick="updateStockQuantity(${inventory.productDetailId || inventory.ProductDetailId}); bootstrap.Modal.getInstance(document.getElementById('inventoryDetailsModal')).hide();">
                    <i class="bi bi-pencil me-1"></i>Update Stock
                  </button>
                </div>
              </div>
            </div>
          </div>
        `;
        $('body').append(modal);
        const bsModal = new bootstrap.Modal(document.getElementById('inventoryDetailsModal'));
        bsModal.show();
        $('#inventoryDetailsModal').on('hidden.bs.modal', function() {
          $(this).remove();
        });
      },
      error: function(xhr) {
        console.error('Error fetching inventory details:', xhr);
        let errorMsg = 'Error loading inventory details';
        if (xhr.responseJSON && xhr.responseJSON.message) {
          errorMsg = xhr.responseJSON.message;
        }
        alert(errorMsg);
      }
    });
  };

  // ==================== TRANSACTIONS SECTION ====================
  function loadTransactions() {
    const html = `
      <div class="section-container">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h2 class="section-title"><i class="bi bi-cash-stack me-2"></i>Transaction Management</h2>
          <div class="d-flex gap-2">
            <select class="form-select" id="transactionPeriod" style="width: auto;">
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly" selected>Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
            <button class="btn btn-primary" id="btnRefreshTransactions">
              <i class="bi bi-arrow-clockwise me-2"></i>Refresh
            </button>
          </div>
        </div>
        <div class="row mb-4">
          <div class="col-md-4">
            <div class="card stat-card">
              <div class="card-body">
                <h5 class="card-title">Total Revenue</h5>
                <h3 class="stat-number" id="totalRevenueSummary">$0</h3>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card stat-card">
              <div class="card-body">
                <h5 class="card-title">Successful Transactions</h5>
                <h3 class="stat-number" id="successfulTransactions">0</h3>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card stat-card">
              <div class="card-body">
                <h5 class="card-title">Failed Transactions</h5>
                <h3 class="stat-number" id="failedTransactions">0</h3>
              </div>
            </div>
          </div>
        </div>
        <div class="card">
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-hover" id="transactionsTable">
                <thead>
                  <tr>
                    <th>Transaction ID</th>
                    <th>Order ID</th>
                    <th>Payment Method</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody id="transactionsTableBody">
                  <tr><td colspan="6" class="text-center">Loading...</td></tr>
                </tbody>
              </table>
            </div>
            <div class="d-flex justify-content-between align-items-center mt-3">
              <div>
                <label class="me-2">Page:</label>
                <input type="number" id="transactionPageNumber" class="form-control d-inline-block" style="width: 80px;" value="1" min="1">
                <label class="ms-2 me-2">Page Size:</label>
                <select id="transactionPageSize" class="form-select d-inline-block" style="width: 100px;">
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                </select>
              </div>
              <div id="transactionPaginationInfo"></div>
            </div>
          </div>
        </div>
      </div>
    `;
    $("#dynamicContentContainer").show().html(html);
    
    const storeId = getStoreId();
    if (storeId) {
      fetchTransactions(storeId);
      fetchTransactionSummary(storeId);
    } else {
      $("#transactionsTableBody").html('<tr><td colspan="6" class="text-center text-danger">Store ID not found</td></tr>');
    }
    
    $(document).off('click', '#btnRefreshTransactions').on('click', '#btnRefreshTransactions', function() {
      const storeId = getStoreId();
      if (storeId) {
        fetchTransactions(storeId);
        fetchTransactionSummary(storeId);
      }
    });
    
    $(document).off('change', '#transactionPeriod').on('change', '#transactionPeriod', function() {
      const storeId = getStoreId();
      if (storeId) fetchTransactionSummary(storeId);
    });
    
    $(document).off('change', '#transactionPageNumber, #transactionPageSize').on('change', '#transactionPageNumber, #transactionPageSize', function() {
      const storeId = getStoreId();
      if (storeId) fetchTransactions(storeId);
    });
  }

  function fetchTransactions(storeId, page = 1, pageSize = 10) {
    page = parseInt($('#transactionPageNumber').val()) || page;
    pageSize = parseInt($('#transactionPageSize').val()) || pageSize;
    
    $.ajax({
      url: `${API_BASE_URL}/merchant/transactions/store/${storeId}?page=${page}&pageSize=${pageSize}`,
      method: 'GET',
      headers: { 'Authorization': `Bearer ${getAuthToken()}` },
      success: function(response) {
        const transactions = response.data || response.items || response || [];
        const totalCount = response.totalCount || response.total || transactions.length;
        const totalPages = response.totalPages || Math.ceil(totalCount / pageSize);
        
        renderTransactionsTable(transactions);
        updateTransactionPaginationInfo(page, totalPages, totalCount);
      },
      error: function(xhr) {
        console.error('Error fetching transactions:', xhr);
        let errorMsg = 'Error loading transactions';
        if (xhr.responseJSON && xhr.responseJSON.message) {
          errorMsg = xhr.responseJSON.message;
        }
        $("#transactionsTableBody").html(`<tr><td colspan="6" class="text-center text-danger">${errorMsg}</td></tr>`);
      }
    });
  }

  function fetchTransactionSummary(storeId) {
    const period = $('#transactionPeriod').val() || 'monthly';
    
    $.ajax({
      url: `${API_BASE_URL}/merchant/transactions/store/${storeId}/summary?period=${period}`,
      method: 'GET',
      headers: { 'Authorization': `Bearer ${getAuthToken()}` },
      success: function(summary) {
        $("#totalRevenueSummary").text("$" + parseFloat(summary.totalAmount || summary.totalRevenue || 0).toFixed(2));
        $("#successfulTransactions").text(summary.successfulCount || summary.successfulTransactions || 0);
        $("#failedTransactions").text(summary.failedCount || summary.failedTransactions || 0);
      },
      error: function(xhr) {
        console.error('Error fetching transaction summary:', xhr);
        $("#totalRevenueSummary").text("$0");
        $("#successfulTransactions").text("0");
        $("#failedTransactions").text("0");
      }
    });
  }

  function renderTransactionsTable(transactions) {
    if (!transactions || transactions.length === 0) {
      $("#transactionsTableBody").html('<tr><td colspan="6" class="text-center">No transactions found</td></tr>');
      return;
    }
    
    let html = '';
    transactions.forEach(transaction => {
      const statusClass = transaction.isSuccessful || transaction.IsSuccessful ? 'bg-success' : 'bg-danger';
      const statusText = transaction.isSuccessful || transaction.IsSuccessful ? 'Success' : 'Failed';
      
      html += `
        <tr>
          <td>${transaction.transactionId || transaction.TransactionId || 'N/A'}</td>
          <td>${transaction.orderId || transaction.OrderId || 'N/A'}</td>
          <td>${transaction.paymentMethod || transaction.PaymentMethod || 'N/A'}</td>
          <td>$${parseFloat(transaction.amount || transaction.Amount || 0).toFixed(2)}</td>
          <td>${formatDate(transaction.transactionDate || transaction.TransactionDate)}</td>
          <td><span class="badge ${statusClass}">${statusText}</span></td>
        </tr>
      `;
    });
    $("#transactionsTableBody").html(html);
  }

  function updateTransactionPaginationInfo(currentPage, totalPages, totalCount) {
    $('#transactionPaginationInfo').text(`Page ${currentPage} of ${totalPages} (Total: ${totalCount} transactions)`);
  }

  return {
    init: initializeMerchantApp,
    showSection,
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  if (MerchantApp?.init) {
    MerchantApp.init();
  }
});