const MerchantApp = (() => {
  'use strict';
  const API_BASE_URL = 'https://cartify.runasp.net/api';

  // Cache to store attribute name to ID mapping
  let attributeNameToIdMap = {};

  // API Endpoints Configuration - Easy to modify in one place
  const API_ENDPOINTS = {
    // Products
    products: {
      getAll: (merchantId, page, pageSize) => `${API_BASE_URL}/merchant/products/merchant/${merchantId}?page=${page}&pageSize=${pageSize}`,
      getById: (productId) => `${API_BASE_URL}/merchant/products/${productId}`,
      create: () => `${API_BASE_URL}/merchant/products`,
      update: (productId) => `${API_BASE_URL}/merchant/products/${productId}`,
      delete: (productId) => `${API_BASE_URL}/merchant/products/${productId}`,
      search: (name, page, pageSize) => `${API_BASE_URL}/merchant/products/search?name=${encodeURIComponent(name)}&page=${page}&pageSize=${pageSize}`
    },
    // Product Details (Variants)
    productDetails: {
      getByProductId: (productId) => `${API_BASE_URL}/merchant/products/${productId}/details`, // Note: May need to check if this endpoint exists
      getById: (detailId) => `${API_BASE_URL}/merchant/products/details/${detailId}`,
      create: () => `${API_BASE_URL}/merchant/products/details`,
      update: () => `${API_BASE_URL}/merchant/products/details`,
      delete: (detailId) => `${API_BASE_URL}/merchant/products/details/${detailId}`
    },
    // Inventory
    inventory: {
      getByProductDetailId: (productDetailId) => `${API_BASE_URL}/merchant/inventory/product-detail/${productDetailId}`,
      create: (productDetailId) => `${API_BASE_URL}/merchant/inventory/product-detail/${productDetailId}`,
      updateStock: (productDetailId) => `${API_BASE_URL}/merchant/inventory/product-detail/${productDetailId}/stock`,
      delete: (inventoryId) => `${API_BASE_URL}/merchant/inventory/${inventoryId}`
    }
  };

  // Navigation state for breadcrumbs
  let navigationState = {
    currentView: 'products', // 'products', 'productDetails', 'inventory'
    currentProductId: null,
    currentProductName: null,
    currentProductDetailId: null,
    currentProductDetailName: null
  };

  const sectionLoaders = Object.freeze({
    Dashboard: loadDashboard,
    Customer: loadCustomer,
    Category: loadCategory,
    Subcategory: loadSubcategory,
    Products: loadProductsList,
    Orders: loadOrders,
    Inventory: loadInventory,
    AttributeMeasure: loadAttributeMeasure
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
    $switch.off('click.merchant').on('click.merchant', function (e) {
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
    try {
      // Try localStorage first, then sessionStorage
      let authString = localStorage.getItem('Auth');
      if (!authString) {
        authString = sessionStorage.getItem('Auth');
      }

      // If no auth data found in either storage, return empty
      if (!authString) {
        console.warn('getAuthToken: No auth data found in localStorage or sessionStorage');
        return '';
      }

      // Parse the JSON string
      const authData = JSON.parse(authString);

      // Extract and validate the JWT token
      const token = authData?.jwt || authData?.token || '';

      if (!token || typeof token !== 'string' || token.trim() === '') {
        console.warn('getAuthToken: Token is empty or invalid');
        return '';
      }

      // Validate token format (should have 3 parts separated by dots)
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) {
        console.warn('getAuthToken: Invalid token format (expected 3 parts, got', tokenParts.length, ')');
        return '';
      }

      console.log('getAuthToken: ✅ Valid token retrieved');
      return token.trim();
    } catch (error) {
      console.error('getAuthToken: Error retrieving auth token:', error);
      console.error('getAuthToken: Error details:', {
        message: error.message,
        stack: error.stack
      });
      // If there's invalid JSON or any error, return empty string
      return '';
    }
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
    notification.find('.notification-close').on('click', function () {
      notification.fadeOut(300, function () { $(this).remove(); });
    });
    setTimeout(() => {
      notification.fadeOut(300, function () { $(this).remove(); });
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
    $('#confirmBtn').on('click', function () {
      onConfirm();
      bsModal.hide();
    });
    $('#confirmModal').on('hidden.bs.modal', function () { $(this).remove(); });
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
    if (!token) {
      console.warn('getCurrentUserRoles: No token available');
      return [];
    }

    const payload = parseJwt(token);
    if (!payload) {
      console.warn('getCurrentUserRoles: Failed to parse token payload');
      return [];
    }

    // Extract roles from the JWT payload
    const rawRoles = payload[ROLE_CLAIM_PATH] || [];

    // Handle both array and single string role formats
    const roles = Array.isArray(rawRoles) ? rawRoles : (rawRoles ? [rawRoles] : []);

    // Filter out any null/undefined/empty values and return
    const validRoles = roles.filter(Boolean);
    console.log('getCurrentUserRoles: Extracted roles:', validRoles);

    return validRoles;
  }

  function setRoleMode(mode) {
    if (!mode) {
      localStorage.removeItem(ROLE_MODE_STORAGE_KEY);
      return;
    }
    localStorage.setItem(ROLE_MODE_STORAGE_KEY, mode);
  }

  function ensureMerchantAccess() {
    // Prevent redirect loops - if we're already on login page, don't redirect again
    if (window.location.pathname.includes('login.html')) {
      console.log('ensureMerchantAccess: Already on login page, skipping check');
      return false;
    }

    const token = getAuthToken();
    console.log('ensureMerchantAccess: Token retrieved:', token ? 'Token exists' : 'No token');

    if (!token || token.trim() === '') {
      console.warn('ensureMerchantAccess: No valid token found, redirecting to login');
      // Small delay to prevent race conditions with other scripts
      setTimeout(() => {
        if (!getAuthToken()) {
          window.location.href = "login.html";
        }
      }, 100);
      return false;
    }

    const roles = getCurrentUserRoles();
    console.log('ensureMerchantAccess: User roles extracted:', roles);
    console.log('ensureMerchantAccess: Looking for role:', MERCHANT_ROLE_NAME);

    // Check if user has Merchant role (case-insensitive check for safety)
    // Also handle variations like "Merchant", "merchant", "MERCHANT"
    const hasMerchantRole = roles.some(role => {
      if (!role) return false;
      const roleStr = role.toString().trim();
      return roleStr.toLowerCase() === MERCHANT_ROLE_NAME.toLowerCase() ||
        roleStr === MERCHANT_ROLE_NAME;
    });

    console.log('ensureMerchantAccess: Has Merchant role?', hasMerchantRole);

    if (!hasMerchantRole) {
      console.warn('ensureMerchantAccess: User does not have Merchant role. Roles found:', roles);
      console.warn('ensureMerchantAccess: Redirecting to index.html');
      setRoleMode(ROLE_MODES.CUSTOMER);
      // Small delay to prevent race conditions
      setTimeout(() => {
        window.location.href = "index.html";
      }, 100);
      return false;
    }

    console.log('ensureMerchantAccess: ✅ Merchant access granted successfully');
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
      } catch (e) {
        console.error('Error parsing token:', e);
      }
    }

    // Fetch Products Count
    if (userId) {
      $.ajax({
        url: `${API_BASE_URL}/merchant/products/merchant/${userId}?page=1&pageSize=1`,
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        success: function (response) {
          const totalProducts = response.totalCount || response.total || 0;
          $("#totalProducts").text(totalProducts);
        },
        error: function (xhr) {
          console.error('Error fetching products count:', xhr);
          $("#totalProducts").text("0");
          if (xhr.status === 0 || xhr.statusText === 'error') {
            console.warn(`⚠️ CORS error: Backend needs to allow origin ${window.location.origin}`);
          }
        }
      });
    }

    // Fetch Customers Count
    (async () => {
      try {
        const token = getAuthToken();
        if (!token) return;

        const response = await fetch(`${API_BASE_URL}/merchant/customers/store/${storeId}/count`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        $("#totalCustomers").text(data.totalCustomers || 0);
      } catch (error) {
        console.error('Error fetching customers count:', error);
        $("#totalCustomers").text("0");
      }
    })();

    // Fetch Orders Count
    (async () => {
      try {
        const token = getAuthToken();
        if (!token) return;

        const response = await fetch(`${API_BASE_URL}/merchant/orders/store/${storeId}?page=1&pageSize=1`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const totalOrders = data.totalCount || data.total || (data.items || data.Items || []).length || 0;
        $("#totalOrders").text(totalOrders);
      } catch (error) {
        console.error('Error fetching orders count:', error);
        $("#totalOrders").text("0");
      }
    })();

    // Fetch Revenue from Transactions Summary
    (async () => {
      try {
        const token = getAuthToken();
        if (!token) return;

        const response = await fetch(`${API_BASE_URL}/merchant/transactions/store/${storeId}/summary?period=monthly`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const revenue = data.totalAmount || data.totalRevenue || 0;
        $("#totalRevenue").text("$" + parseFloat(revenue).toFixed(2));
      } catch (error) {
        console.error('Error fetching revenue:', error);
        $("#totalRevenue").text("$0");
      }
    })();

    // Fetch Recent Orders
    (async () => {
      try {
        const token = getAuthToken();
        if (!token) return;

        const response = await fetch(`${API_BASE_URL}/merchant/orders/store/${storeId}?page=1&pageSize=5`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const orders = data.items || data.Items || data.data || data || [];

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
      } catch (error) {
        console.error('Error fetching recent orders:', error);
        $("#recentActivity").html("<p>Error loading recent activity</p>");
      }
    })();
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

    $(document).off('click', '#btnRefreshCustomers').on('click', '#btnRefreshCustomers', function () {
      const storeId = getStoreId();
      if (storeId) {
        fetchCustomers(storeId);
        fetchCustomerCount(storeId);
      }
    });

    $(document).off('input', '#customerSearch').on('input', '#customerSearch', function () {
      const term = $(this).val().toLowerCase();
      $('#customerTableBody tr').each(function () {
        $(this).toggle($(this).text().toLowerCase().includes(term));
      });
    });

    $(document).off('change', '#customerPageNumber, #customerPageSize').on('change', '#customerPageNumber, #customerPageSize', function () {
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
      success: function (response) {
        const customers = response.data || response.items || response || [];
        const totalCount = response.totalCount || response.total || customers.length;
        const totalPages = response.totalPages || Math.ceil(totalCount / pageSize);

        renderCustomersTable(customers);
        updateCustomerPaginationInfo(page, totalPages, totalCount);
      },
      error: function (xhr) {
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
      success: function (response) {
        const count = response.totalCustomers || response.count || 0;
        $('#customerCount').text(`${count} customer${count !== 1 ? 's' : ''}`);
      },
      error: function () {
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

  window.viewCustomerDetails = function (customerId) {
    if (!customerId) {
      showNotification('Customer ID is required', 'error');
      return;
    }

    $.ajax({
      url: `${API_BASE_URL}/merchant/customers/${customerId}`,
      method: 'GET',
      headers: { 'Authorization': `Bearer ${getAuthToken()}` },
      success: function (customer) {
        showCustomerDetailsModal(customer);
      },
      error: function (xhr) {
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
    $('#customerDetailsModal').on('hidden.bs.modal', function () {
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

    $(document).off('input', '#orderSearch').on('input', '#orderSearch', function () {
      filterOrders();
    });
    $(document).off('change', '#orderStatusFilter').on('change', '#orderStatusFilter', function () {
      filterOrders();
    });
  }

  function fetchOrders() {
    $.ajax({
      url: `${API_BASE_URL}/Orders`,
      method: 'GET',
      headers: { 'Authorization': `Bearer ${getAuthToken()}` },
      success: function (data) {
        renderOrdersTable(data);
      },
      error: function () {
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

    $('#orderTableBody tr').each(function () {
      const text = $(this).text().toLowerCase();
      const status = $(this).data('status') || '';
      const matchesSearch = text.includes(searchTerm);
      const matchesStatus = !statusFilter || status === statusFilter;
      $(this).toggle(matchesSearch && matchesStatus);
    });
  }

  window.viewOrderDetails = function (id) {
    $.ajax({
      url: `${API_BASE_URL}/Orders/${id}`,
      method: 'GET',
      headers: { 'Authorization': `Bearer ${getAuthToken()}` },
      success: function (order) {
        showOrderDetailsModal(order);
      },
      error: function () {
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
    $('#orderDetailsModal').on('hidden.bs.modal', function () { $(this).remove(); });
  }

  window.updateOrderStatus = function (id) {
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
    $('#updateStatusModal').on('hidden.bs.modal', function () { $(this).remove(); });
  };

  window.saveOrderStatus = function () {
    const orderId = $('#orderId').val();
    const newStatus = $('#newStatus').val();

    $.ajax({
      url: `${API_BASE_URL}/Orders/${orderId}/status`,
      method: 'PUT',
      contentType: 'application/json',
      headers: { 'Authorization': `Bearer ${getAuthToken()}` },
      data: JSON.stringify({ status: newStatus }),
      success: function () {
        bootstrap.Modal.getInstance(document.getElementById('updateStatusModal')).hide();
        fetchOrders();
        showNotification('Order status updated successfully', 'success');
      },
      error: function () {
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
    $(document).off('change', '#categoryPageNumber, #categoryPageSize').on('change', '#categoryPageNumber, #categoryPageSize', function () {
      fetchCategories();
    });
  }

  function fetchCategories(page = 1, pageSize = 10) {
    page = parseInt($('#categoryPageNumber').val()) || page;
    pageSize = parseInt($('#categoryPageSize').val()) || pageSize;

    const token = getAuthToken();
    if (!token) {
      $("#categoryTableBody").html(`<tr><td colspan="7" class="text-center text-danger">Authentication required. Please login again.</td></tr>`);
      return;
    }

    $.ajax({
      url: `${API_BASE_URL}/Category?page=${page}&pageSize=${pageSize}`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      success: function (response) {
        console.log('Categories API Response:', response);
        const categories = response.data || response.items || response || [];
        const totalCount = response.totalCount || response.total || categories.length;
        const totalPages = response.totalPages || Math.ceil(totalCount / pageSize);

        renderCategoriesTable(categories);
        updateCategoryPaginationInfo(page, totalPages, totalCount);
      },
      error: function (xhr) {
        console.error('Error fetching categories:', xhr);
        console.error('Status:', xhr.status);
        console.error('Response:', xhr.responseJSON || xhr.responseText);

        let errorMsg = 'Error loading categories';
        if (xhr.status === 0 || xhr.statusText === 'error') {
          errorMsg = `CORS error: Unable to connect to API. The backend needs to allow requests from ${window.location.origin}. Please check Program.cs CORS configuration.`;
        } else if (xhr.status === 401) {
          errorMsg = 'Unauthorized. Please check your authentication token.';
        } else if (xhr.status === 404) {
          errorMsg = 'Category endpoint not found. Please check the API URL.';
        } else if (xhr.status === 403) {
          errorMsg = 'Forbidden. You may not have permission to access this resource.';
        } else if (xhr.responseJSON && xhr.responseJSON.message) {
          errorMsg = xhr.responseJSON.message;
        } else if (xhr.responseText) {
          errorMsg = xhr.responseText;
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
      // Extract category ID properly - handle different property names and ensure it's a number/string
      let categoryId = category.categoryId || category.id || category.CategoryId || category.ID;
      if (categoryId && typeof categoryId === 'object') {
        categoryId = categoryId.value || categoryId.id || null;
      }
      categoryId = categoryId ? String(categoryId) : null;

      if (!categoryId) {
        console.warn('Category without ID:', category);
        return; // Skip categories without valid IDs
      }

      html += `
        <tr>
          <td>${categoryId}</td>
          <td>${category.categoryName || category.name || category.CategoryName || 'N/A'}</td>
          <td>${category.categoryDescription || category.CategoryDescription || category.description || category.Description || 'N/A'}</td>
          <td>${category.imageUrl || category.image || category.ImageUrl ? `<img src="${category.imageUrl || category.image || category.ImageUrl}" width="50" height="50" class="img-thumbnail">` : 'N/A'}</td>
          <td><span id="productCount-${categoryId}">Loading...</span></td>
          <td><span class="badge ${category.isActive !== false ? 'bg-success' : 'bg-secondary'}">${category.isActive !== false ? 'Active' : 'Inactive'}</span></td>
          <td>
            <button class="btn btn-sm btn-info me-1" onclick="viewCategoryDetails('${categoryId}')" title="View Details">
              <i class="bi bi-eye"></i>
            </button>
            <button class="btn btn-sm btn-primary me-1" onclick="editCategory('${categoryId}')" title="Edit">
              <i class="bi bi-pencil"></i>
            </button>
            <button class="btn btn-sm btn-danger" onclick="deleteCategory('${categoryId}')" title="Delete">
              <i class="bi bi-trash"></i>
            </button>
          </td>
        </tr>
      `;
      // Fetch product count for each category
      fetchProductCountByCategory(categoryId);
    });
    $("#categoryTableBody").html(html);
  }

  function fetchProductCountByCategory(categoryId) {
    $.ajax({
      url: `${API_BASE_URL}/Category/${categoryId}/products/count`,
      method: 'GET',
      headers: { 'Authorization': `Bearer ${getAuthToken()}` },
      success: function (response) {
        const count = response.productCount || 0;
        $(`#productCount-${categoryId}`).text(count);
      },
      error: function () {
        $(`#productCount-${categoryId}`).text('0');
      }
    });
  }

  function showCategoryModal(id = null) {
    // Ensure ID is a string/number, not an object
    let categoryIdValue = '';
    if (id !== null && id !== undefined) {
      if (typeof id === 'object') {
        categoryIdValue = id.id || id.categoryId || id.value || '';
      } else {
        categoryIdValue = String(id);
      }
    }

    const isEdit = categoryIdValue !== '';
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
                <input type="hidden" id="categoryId" value="${categoryIdValue}">
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
    $('#categoryModal').on('hidden.bs.modal', function () {
      $(this).remove();
    });
    if (isEdit && categoryIdValue) {
      loadCategoryData(categoryIdValue);
    }
  }

  window.viewCategoryDetails = function (categoryId) {
    // Ensure ID is a string/number, not an object
    if (!categoryId) {
      showNotification('Category ID is required', 'error');
      return;
    }
    if (typeof categoryId === 'object') {
      categoryId = categoryId.id || categoryId.categoryId || categoryId.value || null;
      if (!categoryId) {
        showNotification('Invalid category ID', 'error');
        return;
      }
    }
    categoryId = String(categoryId);

    const token = getAuthToken();
    if (!token) {
      showNotification('Authentication required. Please login again.', 'error');
      return;
    }

    // Fetch category details
    $.ajax({
      url: `${API_BASE_URL}/Category/${categoryId}`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      success: function (category) {
        // Fetch product count
        $.ajax({
          url: `${API_BASE_URL}/Category/${categoryId}/products/count`,
          method: 'GET',
          headers: { 'Authorization': `Bearer ${getAuthToken()}` },
          success: function (countResponse) {
            const productCount = countResponse.productCount || 0;
            showCategoryDetailsModal(category, productCount);
          },
          error: function () {
            showCategoryDetailsModal(category, 0);
          }
        });
      },
      error: function (xhr) {
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
              <button type="button" class="btn btn-warning" onclick="editCategory('${categoryId}'); bootstrap.Modal.getInstance(document.getElementById('categoryDetailsModal')).hide();">
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
    $('#categoryDetailsModal').on('hidden.bs.modal', function () {
      $(this).remove();
    });
  }

  window.viewProductsByCategory = function (categoryId) {
    if (!categoryId) {
      alert('Category ID is required');
      return;
    }

    $.ajax({
      url: `${API_BASE_URL}/Category/${categoryId}/products?page=1&pageSize=10`,
      method: 'GET',
      headers: { 'Authorization': `Bearer ${getAuthToken()}` },
      success: function (response) {
        const products = response.data || response.items || response || [];
        showProductsModal(products, `Products in Category ${categoryId}`);
      },
      error: function (xhr) {
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
    $('#productsModal').on('hidden.bs.modal', function () {
      $(this).remove();
    });
  }

  window.editCategory = function (id) {
    // Ensure ID is a string/number, not an object
    if (!id) {
      showNotification('Category ID is required', 'error');
      return;
    }
    if (typeof id === 'object') {
      id = id.id || id.categoryId || id.value || null;
      if (!id) {
        showNotification('Invalid category ID', 'error');
        return;
      }
    }
    showCategoryModal(String(id));
  };

  window.deleteCategory = function (id) {
    // Ensure ID is a string/number, not an object
    if (!id) {
      showNotification('Category ID is required', 'error');
      return;
    }
    if (typeof id === 'object') {
      id = id.id || id.categoryId || id.value || null;
      if (!id) {
        showNotification('Invalid category ID', 'error');
        return;
      }
    }
    id = String(id);

    const token = getAuthToken();
    if (!token) {
      showNotification('Authentication required. Please login again.', 'error');
      return;
    }

    showConfirmModal('Delete Category', 'Are you sure you want to delete this category?', function () {
      $.ajax({
        url: `${API_BASE_URL}/Category/${id}`,
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        success: function (response) {
          fetchCategories();
          showNotification('Category deleted successfully', 'success');
        },
        error: function (xhr) {
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

  window.saveCategory = function () {
    let categoryId = $('#categoryId').val();
    const categoryName = $('#categoryName').val();

    // Ensure categoryId is a valid string/number, not an object
    if (categoryId) {
      if (typeof categoryId === 'object') {
        categoryId = categoryId.id || categoryId.categoryId || categoryId.value || null;
      } else {
        categoryId = String(categoryId).trim();
        if (categoryId === '' || categoryId === 'undefined' || categoryId === 'null') {
          categoryId = null;
        }
      }
    }

    if (!categoryName || categoryName.trim() === '') {
      showNotification('Category name is required', 'error');
      return;
    }

    const token = getAuthToken();
    if (!token) {
      showNotification('Authentication required. Please login again.', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('CategoryName', categoryName.trim());
    formData.append('CategoryDescription', $('#categoryDescription').val() || '');

    const imageFile = $('#categoryImage')[0].files[0];
    if (imageFile) {
      formData.append('Image', imageFile);
    }

    const method = categoryId ? 'PUT' : 'POST';
    const url = categoryId ? `${API_BASE_URL}/Category/${categoryId}` : `${API_BASE_URL}/Category`;

    console.log(`Saving category: ${method} ${url}`);
    console.log('Category ID:', categoryId);

    $.ajax({
      url: url,
      method: method,
      headers: {
        'Authorization': `Bearer ${token}`
      },
      processData: false,
      contentType: false,
      data: formData,
      success: function (response) {
        console.log('Category saved successfully:', response);
        bootstrap.Modal.getInstance(document.getElementById('categoryModal')).hide();
        fetchCategories();
        showNotification(`Category ${categoryId ? 'updated' : 'created'} successfully`, 'success');
      },
      error: function (xhr) {
        console.error('Error saving category:', xhr);
        console.error('Status:', xhr.status);
        console.error('Response:', xhr.responseJSON || xhr.responseText);

        let errorMsg = 'Error saving category';
        if (xhr.status === 0 || xhr.statusText === 'error') {
          errorMsg = `CORS error: Unable to connect to API. The backend needs to allow requests from ${window.location.origin}. Please check Program.cs CORS configuration.`;
        } else if (xhr.status === 401) {
          errorMsg = 'Unauthorized. Please check your authentication token.';
        } else if (xhr.status === 400) {
          errorMsg = 'Invalid data. Please check all required fields.';
        } else if (xhr.status === 404) {
          errorMsg = 'Category not found. The category may have been deleted.';
        } else if (xhr.status === 403) {
          errorMsg = 'Forbidden. You may not have permission to perform this action.';
        } else if (xhr.responseJSON && xhr.responseJSON.message) {
          errorMsg = xhr.responseJSON.message;
        } else if (xhr.responseText) {
          errorMsg = xhr.responseText;
        }
        showNotification(errorMsg, 'error');
      }
    });
  };

  function loadCategoryData(id) {
    // Ensure ID is a string/number, not an object
    if (!id) {
      console.error('Category ID is required');
      return;
    }
    if (typeof id === 'object') {
      id = id.id || id.categoryId || id.value || null;
      if (!id) {
        console.error('Invalid category ID');
        return;
      }
    }
    id = String(id);

    const token = getAuthToken();
    if (!token) {
      showNotification('Authentication required. Please login again.', 'error');
      return;
    }

    $.ajax({
      url: `${API_BASE_URL}/Category/${id}`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      success: function (data) {
        console.log('Category data loaded:', data);

        // Extract and set category ID as string
        const loadedId = data.categoryId || data.id || data.CategoryId || data.ID;
        if (loadedId) {
          $('#categoryId').val(String(loadedId));
        } else {
          console.error('No category ID found in response:', data);
          showNotification('Error: Category ID not found in response', 'error');
          return;
        }

        $('#categoryName').val(data.categoryName || data.name || data.CategoryName || '');
        $('#categoryDescription').val(data.categoryDescription || data.CategoryDescription || data.description || data.Description || '');
        $('#categoryIsActive').prop('checked', data.isActive !== false && data.isActive !== undefined);

        // If there's an existing image, show it
        if (data.imageUrl || data.image || data.ImageUrl) {
          const imageUrl = data.imageUrl || data.image || data.ImageUrl;
          // Remove any existing preview
          $('#categoryImage').parent().find('.img-thumbnail').parent().remove();
          const imagePreview = `<div class="mt-2"><img src="${imageUrl}" class="img-thumbnail" style="max-width: 200px;"><br><small class="text-muted">Current image</small></div>`;
          $('#categoryImage').parent().append(imagePreview);
        }
      },
      error: function (xhr) {
        console.error('Error loading category:', xhr);
        console.error('Status:', xhr.status);
        console.error('Response:', xhr.responseJSON || xhr.responseText);

        let errorMsg = 'Error loading category data';
        if (xhr.status === 0 || xhr.statusText === 'error') {
          errorMsg = `CORS error: Unable to connect to API. The backend needs to allow requests from ${window.location.origin}. Please check Program.cs CORS configuration.`;
        } else if (xhr.status === 404) {
          errorMsg = 'Category not found';
        } else if (xhr.status === 401) {
          errorMsg = 'Unauthorized. Please check your authentication token.';
        } else if (xhr.status === 403) {
          errorMsg = 'Forbidden. You may not have permission to access this resource.';
        } else if (xhr.responseJSON && xhr.responseJSON.message) {
          errorMsg = xhr.responseJSON.message;
        } else if (xhr.responseText) {
          errorMsg = xhr.responseText;
        }
        showNotification(errorMsg, 'error');
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
                  <tr><td colspan="6" class="text-center">Loading...</td></tr>
                </tbody>
              </table>
            </div>
            <div class="d-flex justify-content-between align-items-center mt-3">
              <div>
                <label class="me-2">Page:</label>
                <input type="number" id="subcategoryPageNumber" class="form-control d-inline-block" style="width: 80px;" value="1" min="1">
                <label class="ms-2 me-2">Page Size:</label>
                <select id="subcategoryPageSize" class="form-select d-inline-block" style="width: 100px;">
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                </select>
              </div>
              <div id="subcategoryPaginationInfo"></div>
            </div>
          </div>
        </div>
      </div>
    `;
    $("#dynamicContentContainer").show().html(html);
    fetchSubcategories();

    $(document).off('click', '#btnAddSubcategory').on('click', '#btnAddSubcategory', showSubcategoryModal);
    $(document).off('change', '#subcategoryPageNumber, #subcategoryPageSize').on('change', '#subcategoryPageNumber, #subcategoryPageSize', function () {
      fetchSubcategories();
    });
  }

  function fetchSubcategories(page = 1, pageSize = 10) {
    page = parseInt($('#subcategoryPageNumber').val()) || page;
    pageSize = parseInt($('#subcategoryPageSize').val()) || pageSize;

    $.ajax({
      url: `${API_BASE_URL}/Category/subcategory`,
      method: 'GET',
      headers: { 'Authorization': `Bearer ${getAuthToken()}` },
      success: function (data) {
        renderSubcategoriesTable(data);
      },
      error: function (xhr) {
        console.error('Error fetching subcategories:', xhr);
        let errorMsg = 'Error loading subcategories';
        if (xhr.responseJSON && xhr.responseJSON.message) {
          errorMsg = xhr.responseJSON.message;
        }
        $("#subcategoryTableBody").html(`<tr><td colspan="6" class="text-center text-danger">${errorMsg}</td></tr>`);
      }
    });
  }

  function updateSubcategoryPaginationInfo(currentPage, totalPages, totalCount) {
    $('#subcategoryPaginationInfo').text(`Page ${currentPage} of ${totalPages} (Total: ${totalCount} subcategories)`);
  }

  function renderSubcategoriesTable(subcategories) {
    if (!subcategories || subcategories.length === 0) {
      $("#subcategoryTableBody").html('<tr><td colspan="6" class="text-center">No subcategories found</td></tr>');
      return;
    }
    let html = '';
    subcategories.forEach(sub => {
      // Extract subcategory ID properly - handle different property names and ensure it's a number/string
      // Note: 0 is a valid ID, so we need to check for null/undefined specifically, not just falsy values
      let subcategoryId = sub.subCategoryId !== undefined && sub.subCategoryId !== null ? sub.subCategoryId
        : sub.id !== undefined && sub.id !== null ? sub.id
          : sub.SubCategoryId !== undefined && sub.SubCategoryId !== null ? sub.SubCategoryId
            : sub.ID !== undefined && sub.ID !== null ? sub.ID
              : null;

      if (subcategoryId !== null && subcategoryId !== undefined && typeof subcategoryId === 'object') {
        subcategoryId = subcategoryId.value !== undefined ? subcategoryId.value
          : subcategoryId.id !== undefined ? subcategoryId.id
            : null;
      }

      // Convert to string, but allow 0 as valid ID
      if (subcategoryId === null || subcategoryId === undefined) {
        console.warn('Subcategory without ID:', sub);
        return; // Skip subcategories without valid IDs
      }

      subcategoryId = String(subcategoryId);

      html += `
        <tr>
          <td>${subcategoryId}</td>
          <td>${sub.subCategoryName || sub.name || sub.SubCategoryName || 'N/A'}</td>
          <td>${sub.categoryName || sub.CategoryName || sub.categoryId || 'N/A'}</td>
          <td>${sub.subCategoryDescription || sub.description || sub.SubCategoryDescription || 'N/A'}</td>
          <td><span class="badge ${sub.isActive !== false ? 'bg-success' : 'bg-secondary'}">${sub.isActive !== false ? 'Active' : 'Inactive'}</span></td>
          <td>
            <button class="btn btn-sm btn-info me-1" onclick="viewSubcategoryDetails('${subcategoryId}')" title="View Details">
              <i class="bi bi-eye"></i>
            </button>
            <button class="btn btn-sm btn-primary me-1" onclick="editSubcategory('${subcategoryId}')" title="Edit">
              <i class="bi bi-pencil"></i>
            </button>
            <button class="btn btn-sm btn-danger" onclick="deleteSubcategory('${subcategoryId}')" title="Delete">
              <i class="bi bi-trash"></i>
            </button>
          </td>
        </tr>
      `;
    });
    $("#subcategoryTableBody").html(html);
  }

  function showSubcategoryModal(id = null) {
    // Ensure ID is a string/number, not an object
    let subcategoryIdValue = '';
    if (id !== null && id !== undefined) {
      if (typeof id === 'object') {
        subcategoryIdValue = id.id || id.subCategoryId || id.value || '';
      } else {
        subcategoryIdValue = String(id);
      }
    }

    const isEdit = subcategoryIdValue !== '';
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
                <input type="hidden" id="subcategoryId" value="${subcategoryIdValue}">
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
    $('#subcategoryModal').on('hidden.bs.modal', function () {
      $(this).remove();
    });
    if (isEdit) loadSubcategoryData(subcategoryIdValue);
  }

  function loadCategoriesForSubcategory() {
    $.ajax({
      url: `${API_BASE_URL}/Category?page=1&pageSize=100`,
      method: 'GET',
      headers: { 'Authorization': `Bearer ${getAuthToken()}` },
      success: function (response) {
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
      error: function () {
        console.error('Error loading categories for subcategory');
      }
    });
  }

  window.viewSubcategoryDetails = function (subcategoryId) {
    // Ensure ID is a string/number, not an object
    if (!subcategoryId) {
      showNotification('Subcategory ID is required', 'error');
      return;
    }
    if (typeof subcategoryId === 'object') {
      subcategoryId = subcategoryId.id || subcategoryId.subCategoryId || subcategoryId.value || null;
      if (!subcategoryId) {
        showNotification('Invalid subcategory ID', 'error');
        return;
      }
    }
    subcategoryId = String(subcategoryId);

    const token = getAuthToken();
    if (!token) {
      showNotification('Authentication required. Please login again.', 'error');
      return;
    }

    $.ajax({
      url: `${API_BASE_URL}/Category/subcategory/${subcategoryId}`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      success: function (subcategory) {
        showSubcategoryDetailsModal(subcategory);
      },
      error: function (xhr) {
        console.error('Error fetching subcategory:', xhr);
        alert('Error loading subcategory details');
      }
    });
  };

  function showSubcategoryDetailsModal(subcategory) {
    let subcategoryId = subcategory.subCategoryId || subcategory.id || subcategory.SubCategoryId || subcategory.ID;
    if (subcategoryId && typeof subcategoryId === 'object') {
      subcategoryId = subcategoryId.value || subcategoryId.id || null;
    }
    subcategoryId = subcategoryId ? String(subcategoryId) : 'N/A';

    const modal = `
      <div class="modal fade" id="subcategoryDetailsModal" tabindex="-1">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Subcategory Details - ${subcategory.subCategoryName || subcategory.name || subcategory.SubCategoryName || 'N/A'}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <div class="row mb-3">
                <div class="col-md-6">
                  <strong>Subcategory ID:</strong> ${subcategoryId}<br>
                  <strong>Name:</strong> ${subcategory.subCategoryName || subcategory.name || subcategory.SubCategoryName || 'N/A'}<br>
                  <strong>Description:</strong> ${subcategory.subCategoryDescription || subcategory.description || subcategory.SubCategoryDescription || 'N/A'}<br>
                </div>
                <div class="col-md-6">
                  <strong>Category:</strong> ${subcategory.categoryName || subcategory.CategoryName || subcategory.categoryId || 'N/A'}<br>
                  <strong>Status:</strong> <span class="badge ${subcategory.isActive !== false ? 'bg-success' : 'bg-secondary'}">${subcategory.isActive !== false ? 'Active' : 'Inactive'}</span><br>
                  ${subcategory.imageUrl || subcategory.image || subcategory.ImageUrl ? `<img src="${subcategory.imageUrl || subcategory.image || subcategory.ImageUrl}" class="img-thumbnail mt-2" style="max-width: 200px;">` : ''}
                </div>
              </div>
              <div class="mt-3">
                <button class="btn btn-primary" onclick="viewProductsBySubcategory('${subcategoryId}')">
                  <i class="bi bi-box-seam me-1"></i>View Products
                </button>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" class="btn btn-warning" onclick="editSubcategory('${subcategoryId}'); bootstrap.Modal.getInstance(document.getElementById('subcategoryDetailsModal')).hide();">
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
    $('#subcategoryDetailsModal').on('hidden.bs.modal', function () {
      $(this).remove();
    });
  }

  window.viewProductsBySubcategory = function (subcategoryId) {
    // Ensure ID is a string/number, not an object
    if (!subcategoryId) {
      showNotification('Subcategory ID is required', 'error');
      return;
    }
    if (typeof subcategoryId === 'object') {
      subcategoryId = subcategoryId.id || subcategoryId.subCategoryId || subcategoryId.value || null;
      if (!subcategoryId) {
        showNotification('Invalid subcategory ID', 'error');
        return;
      }
    }
    subcategoryId = String(subcategoryId);

    const token = getAuthToken();
    if (!token) {
      showNotification('Authentication required. Please login again.', 'error');
      return;
    }

    $.ajax({
      url: `${API_BASE_URL}/Category/subcategory/${subcategoryId}/products?page=1&pageSize=10`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      success: function (response) {
        const products = response.data || response.items || response || [];
        showProductsModal(products, `Products in Subcategory ${subcategoryId}`);
      },
      error: function (xhr) {
        console.error('Error fetching products:', xhr);
        alert('Error loading products');
      }
    });
  };

  window.editSubcategory = function (id) {
    // Ensure ID is a string/number, not an object
    if (!id) {
      showNotification('Subcategory ID is required', 'error');
      return;
    }
    if (typeof id === 'object') {
      id = id.id || id.subCategoryId || id.value || null;
      if (!id) {
        showNotification('Invalid subcategory ID', 'error');
        return;
      }
    }
    showSubcategoryModal(String(id));
  };

  window.deleteSubcategory = function (id) {
    // Ensure ID is a string/number, not an object
    if (!id) {
      showNotification('Subcategory ID is required', 'error');
      return;
    }
    if (typeof id === 'object') {
      id = id.id || id.subCategoryId || id.value || null;
      if (!id) {
        showNotification('Invalid subcategory ID', 'error');
        return;
      }
    }
    id = String(id);

    const token = getAuthToken();
    if (!token) {
      showNotification('Authentication required. Please login again.', 'error');
      return;
    }

    showConfirmModal('Delete Subcategory', 'Are you sure you want to delete this subcategory?', function () {
      $.ajax({
        url: `${API_BASE_URL}/Category/subcategory/${id}`,
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        success: function (response) {
          fetchSubcategories();
          showNotification('Subcategory deleted successfully', 'success');
        },
        error: function (xhr) {
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

  window.saveSubcategory = function () {
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
      success: function (response) {
        bootstrap.Modal.getInstance(document.getElementById('subcategoryModal')).hide();
        fetchSubcategories();
        showNotification(`Subcategory ${subcategoryId ? 'updated' : 'created'} successfully`, 'success');
      },
      error: function (xhr) {
        console.error('Error saving subcategory:', xhr);
        let errorMsg = 'Error saving subcategory';
        if (xhr.responseJSON && xhr.responseJSON.message) {
          errorMsg = xhr.responseJSON.message;
        }
        showNotification(errorMsg, 'error');
      }
    });
  };

  function loadSubcategoryData(id) {
    // Ensure ID is a string/number, not an object
    if (!id) {
      console.error('Subcategory ID is required');
      return;
    }
    if (typeof id === 'object') {
      id = id.id || id.subCategoryId || id.value || null;
      if (!id) {
        console.error('Invalid subcategory ID');
        return;
      }
    }
    id = String(id);

    const token = getAuthToken();
    if (!token) {
      showNotification('Authentication required. Please login again.', 'error');
      return;
    }

    $.ajax({
      url: `${API_BASE_URL}/Category/subcategory/${id}`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      success: function (data) {
        console.log('Subcategory data loaded:', data);

        // Extract and set subcategory ID as string
        const loadedId = data.subCategoryId || data.id || data.SubCategoryId || data.ID;
        if (loadedId) {
          $('#subcategoryId').val(String(loadedId));
        } else {
          console.error('No subcategory ID found in response:', data);
          showNotification('Error: Subcategory ID not found in response', 'error');
          return;
        }

        // Set category ID
        const catId = data.categoryId || data.CategoryId || data.categoryID;
        if (catId) {
          $('#subcategoryCategoryId').val(String(catId));
        }

        $('#subcategoryName').val(data.subCategoryName || data.name || data.SubCategoryName || '');
        $('#subcategoryDescription').val(data.subCategoryDescription || data.description || data.SubCategoryDescription || '');
        $('#subcategoryIsActive').prop('checked', data.isActive !== false && data.isActive !== undefined);

        // If there's an existing image, show it
        if (data.imageUrl || data.image || data.ImageUrl) {
          const imageUrl = data.imageUrl || data.image || data.ImageUrl;
          // Remove any existing preview
          $('#subcategoryImage').parent().find('.img-thumbnail').parent().remove();
          const imagePreview = `<div class="mt-2"><img src="${imageUrl}" class="img-thumbnail" style="max-width: 200px;"><br><small class="text-muted">Current image</small></div>`;
          $('#subcategoryImage').parent().append(imagePreview);
        }
      },
      error: function (xhr) {
        console.error('Error loading subcategory:', xhr);
        console.error('Status:', xhr.status);
        console.error('Response:', xhr.responseJSON || xhr.responseText);

        let errorMsg = 'Error loading subcategory data';
        if (xhr.status === 0 || xhr.statusText === 'error') {
          errorMsg = `CORS error: Unable to connect to API. The backend needs to allow requests from ${window.location.origin}. Please check Program.cs CORS configuration.`;
        } else if (xhr.status === 404) {
          errorMsg = 'Subcategory not found';
        } else if (xhr.status === 401) {
          errorMsg = 'Unauthorized. Please check your authentication token.';
        } else if (xhr.status === 403) {
          errorMsg = 'Forbidden. You may not have permission to access this resource.';
        } else if (xhr.responseJSON && xhr.responseJSON.message) {
          errorMsg = xhr.responseJSON.message;
        } else if (xhr.responseText) {
          errorMsg = xhr.responseText;
        }
        showNotification(errorMsg, 'error');
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
      success: function (data) {
        $('#profileId').val(data.userId || '');
        $('#profileStoreName').val(data.storeName || '');
        $('#profileEmail').val(data.email || '');
        $('#profilePhone').val(data.phoneNumber || '');
        $('#profileDescription').val(data.description || '');
        if (data.logoUrl) {
          $('#profileImagePreview').attr('src', data.logoUrl);
        }
      },
      error: function (xhr) {
        console.log('Error loading profile:', xhr);
      }
    });
  }

  window.saveProfile = function () {
    const authData = JSON.parse(localStorage.getItem('Auth') || sessionStorage.getItem('Auth') || '{}');
    const token = authData.jwt;
    let userId = null;
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        userId = payload.sub || payload.nameid;
      } catch (e) {
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
      success: function () {
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
            success: function () {
              alert('Profile updated successfully');
              loadProfileData();
            },
            error: function () {
              alert('Profile updated but store info update failed');
              loadProfileData();
            }
          });
        } else {
          alert('Profile updated successfully');
          loadProfileData();
        }
      },
      error: function () {
        alert('Error updating profile');
      }
    });
  };

  window.changePassword = function () {
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
      success: function () {
        alert('Password changed successfully');
        $('#profileOldPassword, #profileNewPassword, #profileConfirmPassword').val('');
      },
      error: function (xhr) {
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
    // Reset navigation state
    navigationState = {
      currentView: 'products',
      currentProductId: null,
      currentProductName: null,
      currentProductDetailId: null,
      currentProductDetailName: null
    };

    const html = `
      <div class="section-container">
        <!-- Breadcrumb Navigation -->
        <nav aria-label="breadcrumb" class="mb-3">
          <ol class="breadcrumb">
            <li class="breadcrumb-item active"><i class="bi bi-box-seam me-1"></i>Products</li>
          </ol>
        </nav>
        
        <!-- Header with Search and Actions -->
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h2 class="section-title mb-0"><i class="bi bi-box-seam me-2"></i>Products Management</h2>
          <div class="d-flex gap-2 align-items-center">
            <div class="input-group" style="width: 300px;">
              <span class="input-group-text"><i class="bi bi-search"></i></span>
              <input type="text" class="form-control" id="productSearchInput" placeholder="Search products...">
            </div>
            <button class="btn btn-success" id="btnAddNewProduct">
              <i class="bi bi-plus-circle me-2"></i>Add New Product
            </button>
            <button class="btn btn-primary" id="btnRefreshProducts">
              <i class="bi bi-arrow-clockwise me-2"></i>Refresh
            </button>
          </div>
        </div>
        
        <!-- Products Grid/Table View -->
        <div class="card shadow-sm">
          <div class="card-body">
            <!-- View Toggle -->
            <div class="d-flex justify-content-end mb-3">
              <div class="btn-group" role="group">
                <input type="radio" class="btn-check" name="viewToggle" id="viewTable" checked>
                <label class="btn btn-outline-primary" for="viewTable"><i class="bi bi-list-ul"></i> Table</label>
                <input type="radio" class="btn-check" name="viewToggle" id="viewGrid">
                <label class="btn btn-outline-primary" for="viewGrid"><i class="bi bi-grid-3x3-gap"></i> Grid</label>
              </div>
            </div>
            
            <!-- Table View -->
            <div id="productsTableView" class="products-view">
              <div class="table-responsive">
                <table class="table table-hover align-middle" id="productsTable">
                  <thead>
                    <tr>
                      <th style="width: 80px;">Image</th>
                      <th>Product ID</th>
                      <th>Name</th>
                      <th>Description</th>
                      <th>Category</th>
                      <th>Status</th>
                      <th style="width: 200px;">Actions</th>
                    </tr>
                  </thead>
                  <tbody id="productsTableBody">
                    <tr><td colspan="7" class="text-center py-4"><i class="bi bi-arrow-repeat spin me-2"></i>Loading products...</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            <!-- Grid View -->
            <div id="productsGridView" class="products-view" style="display: none;">
              <div class="row g-4" id="productsGridBody">
                <div class="col-12 text-center py-4"><i class="bi bi-arrow-repeat spin me-2"></i>Loading products...</div>
              </div>
            </div>
            
            <!-- Pagination -->
            <div class="d-flex justify-content-between align-items-center mt-4">
              <div class="d-flex align-items-center gap-2">
                <label class="mb-0">Page:</label>
                <input type="number" id="productsPageNumber" class="form-control" style="width: 80px;" value="1" min="1">
                <label class="mb-0">Page Size:</label>
                <select id="productsPageSize" class="form-select" style="width: 100px;">
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                </select>
              </div>
              <div id="productsPaginationInfo" class="text-muted"></div>
            </div>
          </div>
        </div>
      </div>
    `;
    $("#dynamicContentContainer").show().html(html);

    // Get merchant ID from token
    const authData = JSON.parse(localStorage.getItem('Auth') || sessionStorage.getItem('Auth') || '{}');
    const token = authData.jwt;
    let userId = null;
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        userId = payload.sub || payload.nameid;
      } catch (e) {
        console.error('Error parsing token:', e);
      }
    }

    // Load products
    if (userId) {
      fetchProducts(userId);
    } else {
      $("#productsTableBody").html('<tr><td colspan="7" class="text-center text-danger py-4">User ID not found. Please login again.</td></tr>');
      $("#productsGridBody").html('<div class="col-12 text-center text-danger py-4">User ID not found. Please login again.</div>');
    }

    // Bind event handlers
    $(document).off('click', '#btnRefreshProducts').on('click', '#btnRefreshProducts', function () {
      if (userId) fetchProducts(userId);
    });

    $(document).off('click', '#btnAddNewProduct').on('click', '#btnAddNewProduct', function () {
      showAddProductModal();
    });

    $(document).off('change', '#productsPageNumber, #productsPageSize').on('change', '#productsPageNumber, #productsPageSize', function () {
      if (userId) fetchProducts(userId);
    });

    // Search functionality
    let searchTimeout;
    $(document).off('input', '#productSearchInput').on('input', '#productSearchInput', function () {
      clearTimeout(searchTimeout);
      const searchTerm = $(this).val().trim();
      searchTimeout = setTimeout(() => {
        if (searchTerm.length >= 2 || searchTerm.length === 0) {
          if (userId) {
            if (searchTerm.length === 0) {
              fetchProducts(userId);
            } else {
              searchProducts(userId, searchTerm);
            }
          }
        }
      }, 500);
    });

    // View toggle
    $(document).off('change', 'input[name="viewToggle"]').on('change', 'input[name="viewToggle"]', function () {
      if ($(this).attr('id') === 'viewTable') {
        $('#productsTableView').show();
        $('#productsGridView').hide();
      } else {
        $('#productsTableView').hide();
        $('#productsGridView').show();
      }
    });
  }

  function fetchProducts(merchantId, page = 1, pageSize = 10) {
    page = parseInt($('#productsPageNumber').val()) || page;
    pageSize = parseInt($('#productsPageSize').val()) || pageSize;

    const url = API_ENDPOINTS.products.getAll(merchantId, page, pageSize);

    $.ajax({
      url: url,
      method: 'GET',
      headers: { 'Authorization': `Bearer ${getAuthToken()}` },
      success: function (response) {
        const products = response.data || response.items || response || [];
        const totalCount = response.totalCount || response.total || products.length;
        const totalPages = response.totalPages || Math.ceil(totalCount / pageSize);

        renderProducts(products);
        updateProductsPaginationInfo(page, totalPages, totalCount);
      },
      error: function (xhr) {
        console.error('Error fetching products:', xhr);
        let errorMsg = 'Error loading products';
        if (xhr.responseJSON && xhr.responseJSON.message) {
          errorMsg = xhr.responseJSON.message;
        }
        $("#productsTableBody").html(`<tr><td colspan="7" class="text-center text-danger py-4">${errorMsg}</td></tr>`);
        $("#productsGridBody").html(`<div class="col-12 text-center text-danger py-4">${errorMsg}</div>`);
      }
    });
  }

  function searchProducts(merchantId, searchTerm, page = 1, pageSize = 10) {
    page = parseInt($('#productsPageNumber').val()) || page;
    pageSize = parseInt($('#productsPageSize').val()) || pageSize;

    const url = API_ENDPOINTS.products.search(searchTerm, page, pageSize);

    $.ajax({
      url: url,
      method: 'GET',
      headers: { 'Authorization': `Bearer ${getAuthToken()}` },
      success: function (response) {
        const products = response.data || response.items || response || [];
        const totalCount = response.totalCount || response.total || products.length;
        const totalPages = response.totalPages || Math.ceil(totalCount / pageSize);

        renderProducts(products);
        updateProductsPaginationInfo(page, totalPages, totalCount);
      },
      error: function (xhr) {
        console.error('Error searching products:', xhr);
        let errorMsg = 'Error searching products';
        if (xhr.responseJSON && xhr.responseJSON.message) {
          errorMsg = xhr.responseJSON.message;
        }
        $("#productsTableBody").html(`<tr><td colspan="7" class="text-center text-danger py-4">${errorMsg}</td></tr>`);
        $("#productsGridBody").html(`<div class="col-12 text-center text-danger py-4">${errorMsg}</div>`);
      }
    });
  }

  function renderProducts(products) {
    if (!products || products.length === 0) {
      $("#productsTableBody").html('<tr><td colspan="7" class="text-center py-4 text-muted">No products found</td></tr>');
      $("#productsGridBody").html('<div class="col-12 text-center py-4 text-muted">No products found</div>');
      return;
    }

    renderProductsTable(products);
    renderProductsGrid(products);
  }

  function renderProductsTable(products) {
    let html = '';
    products.forEach(product => {
      const productId = product.productId || product.ProductId || 'N/A';
      const productName = product.productName || product.ProductName || 'N/A';
      const description = (product.productDescription || product.ProductDescription || 'No description').substring(0, 100) + (product.productDescription && product.productDescription.length > 100 ? '...' : '');
      const imageUrl = product.imageUrl || product.ImageUrl || product.imageURL || 'Icons/headphone.jpg';
      const categoryName = product.categoryName || product.CategoryName || 'N/A';
      const isActive = product.isActive !== false;

      html += `
        <tr class="table-row-hover">
          <td>
            <img src="${imageUrl}" alt="${productName}" class="product-thumbnail" 
                 onerror="this.src='Icons/headphone.jpg'" 
                 style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">
          </td>
          <td><strong>#${productId}</strong></td>
          <td><strong>${escapeHtml(productName)}</strong></td>
          <td class="text-muted" style="max-width: 300px;">${escapeHtml(description)}</td>
          <td><span class="badge bg-info">${escapeHtml(categoryName)}</span></td>
          <td><span class="badge ${isActive ? 'bg-success' : 'bg-secondary'}">${isActive ? 'Active' : 'Inactive'}</span></td>
          <td>
            <div class="btn-group" role="group">
              <button class="btn btn-sm btn-primary" onclick="MerchantApp.viewProductVariants(${productId}, '${escapeHtml(productName)}')" title="View Variants">
                <i class="bi bi-eye"></i> Variants
              </button>
              <button class="btn btn-sm btn-warning" onclick="MerchantApp.editProduct(${productId})" title="Edit">
                <i class="bi bi-pencil"></i>
              </button>
              <button class="btn btn-sm btn-danger" onclick="MerchantApp.deleteProduct(${productId})" title="Delete">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    });
    $("#productsTableBody").html(html);
  }

  function renderProductsGrid(products) {
    let html = '';
    products.forEach(product => {
      const productId = product.productId || product.ProductId || 'N/A';
      const productName = product.productName || product.ProductName || 'N/A';
      const description = (product.productDescription || product.ProductDescription || 'No description').substring(0, 150) + (product.productDescription && product.productDescription.length > 150 ? '...' : '');
      const imageUrl = product.imageUrl || product.ImageUrl || product.imageURL || 'Icons/headphone.jpg';
      const categoryName = product.categoryName || product.CategoryName || 'N/A';
      const isActive = product.isActive !== false;

      html += `
        <div class="col-md-4 col-lg-3">
          <div class="card product-card h-100 shadow-sm">
            <img src="${imageUrl}" class="card-img-top product-card-image" alt="${productName}"
                 onerror="this.src='Icons/headphone.jpg'">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">${escapeHtml(productName)}</h5>
              <p class="card-text text-muted small flex-grow-1">${escapeHtml(description)}</p>
              <div class="mb-2">
                <span class="badge bg-info me-1">${escapeHtml(categoryName)}</span>
                <span class="badge ${isActive ? 'bg-success' : 'bg-secondary'}">${isActive ? 'Active' : 'Inactive'}</span>
              </div>
              <div class="btn-group w-100" role="group">
                <button class="btn btn-sm btn-primary" onclick="MerchantApp.viewProductVariants(${productId}, '${escapeHtml(productName)}')">
                  <i class="bi bi-eye me-1"></i>Variants
                </button>
                <button class="btn btn-sm btn-warning" onclick="MerchantApp.editProduct(${productId})">
                  <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="MerchantApp.deleteProduct(${productId})">
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    });
    $("#productsGridBody").html(html);
  }

  function updateProductsPaginationInfo(currentPage, totalPages, totalCount) {
    $('#productsPaginationInfo').text(`Page ${currentPage} of ${totalPages} (Total: ${totalCount} products)`);
  }

  // Helper function to escape HTML
  function escapeHtml(text) {
    if (!text) return '';
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.toString().replace(/[&<>"']/g, m => map[m]);
  }

  // ==================== PRODUCT CRUD OPERATIONS ====================

  // View Product Variants (ProductDetails)
  window.viewProductVariants = function (productId, productName) {
    if (!productId) {
      showNotification('Product ID is required', 'error');
      return;
    }

    navigationState.currentView = 'productDetails';
    navigationState.currentProductId = productId;
    navigationState.currentProductName = productName || 'Product';

    loadProductDetailsView(productId, productName);
  };

  // Edit Product
  window.editProduct = function (productId) {
    if (!productId) {
      showNotification('Product ID is required', 'error');
      return;
    }

    $.ajax({
      url: API_ENDPOINTS.products.getById(productId),
      method: 'GET',
      headers: { 'Authorization': `Bearer ${getAuthToken()}` },
      success: function (product) {
        showEditProductModal(product);
      },
      error: function (xhr) {
        console.error('Error fetching product:', xhr);
        let errorMsg = 'Error loading product';
        if (xhr.responseJSON && xhr.responseJSON.message) {
          errorMsg = xhr.responseJSON.message;
        }
        showNotification(errorMsg, 'error');
      }
    });
  };

  // Delete Product
  window.deleteProduct = function (productId) {
    if (!productId) {
      showNotification('Product ID is required', 'error');
      return;
    }

    showConfirmModal(
      'Delete Product',
      'Are you sure you want to delete this product? This action cannot be undone.',
      function () {
        $.ajax({
          url: API_ENDPOINTS.products.delete(productId),
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${getAuthToken()}` },
          success: function (response) {
            showNotification('Product deleted successfully!', 'success');
            const authData = JSON.parse(localStorage.getItem('Auth') || sessionStorage.getItem('Auth') || '{}');
            const token = authData.jwt;
            let userId = null;
            if (token) {
              try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                userId = payload.sub || payload.nameid;
              } catch (e) {
                console.error('Error parsing token:', e);
              }
            }
            if (userId) fetchProducts(userId);
          },
          error: function (xhr) {
            console.error('Error deleting product:', xhr);
            let errorMsg = 'Error deleting product';
            if (xhr.responseJSON && xhr.responseJSON.message) {
              errorMsg = xhr.responseJSON.message;
            }
            showNotification(errorMsg, 'error');
          }
        });
      }
    );
  };

  // Expose functions to global scope for onclick handlers
  window.MerchantApp = {
    viewProductVariants: window.viewProductVariants,
    editProduct: window.editProduct,
    deleteProduct: window.deleteProduct,
    viewInventory: function (productDetailId, productDetailName) {
      return viewInventory(productDetailId, productDetailName);
    },
    editProductDetail: function (detailId) {
      return editProductDetail(detailId);
    },
    deleteProductDetail: function (detailId) {
      return deleteProductDetail(detailId);
    },
    addInventoryItem: function (productDetailId) {
      return showAddInventoryModal(productDetailId);
    },
    deleteInventoryItem: function (inventoryId, productDetailId) {
      return deleteInventoryItem(inventoryId, productDetailId);
    },
    showEditInventoryModal: function (productDetailId) {
      return showEditInventoryModal(productDetailId);
    }
  };

  // Expose showEditInventoryModal globally for onclick handlers
  window.showEditInventoryModal = showEditInventoryModal;

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
    $(document).off('click', '#btnRefreshOrders').on('click', '#btnRefreshOrders', function () {
      const storeId = getStoreId();
      if (storeId) fetchOrders(storeId);
    });

    $(document).off('change', '#orderStatusFilter').on('change', '#orderStatusFilter', function () {
      const storeId = getStoreId();
      if (storeId) fetchOrders(storeId);
    });

    $(document).off('change', '#orderPageNumber, #orderPageSize').on('change', '#orderPageNumber, #orderPageSize', function () {
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
    } catch (e) {
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
      success: function (response) {
        // Handle both direct array and paged result
        const orders = response.data || response.items || response || [];
        const totalCount = response.totalCount || response.total || orders.length;
        const totalPages = response.totalPages || Math.ceil(totalCount / pageSize);

        renderOrdersTable(orders);
        updateOrderPaginationInfo(page, totalPages, totalCount);
      },
      error: function (xhr) {
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
    } catch (e) {
      return dateString;
    }
  }

  function updateOrderPaginationInfo(currentPage, totalPages, totalCount) {
    $('#orderPaginationInfo').text(`Page ${currentPage} of ${totalPages} (Total: ${totalCount} orders)`);
  }

  // Allow/Approve Order Function
  window.allowOrder = function (orderId) {
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
  window.updateOrderStatus = function (orderId) {
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
      success: function (response) {
        alert('Order status updated successfully!');
        // Refresh orders list
        const storeId = getStoreId();
        if (storeId) fetchOrders(storeId);
      },
      error: function (xhr) {
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
  window.viewOrderDetails = function (orderId) {
    if (!orderId) {
      alert('Order ID is required');
      return;
    }

    $.ajax({
      url: `${API_BASE_URL}/merchant/orders/${orderId}`,
      method: 'GET',
      headers: { 'Authorization': `Bearer ${getAuthToken()}` },
      success: function (order) {
        showOrderDetailsModal(order);
      },
      error: function (xhr) {
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
    $('#orderDetailsModal').on('hidden.bs.modal', function () {
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

    $(document).off('click', '#btnRefreshInventory').on('click', '#btnRefreshInventory', function () {
      const storeId = getStoreId();
      if (storeId) fetchInventory(storeId);
    });

    $(document).off('click', '#btnLowStockAlerts').on('click', '#btnLowStockAlerts', function () {
      const storeId = getStoreId();
      if (storeId) fetchLowStockAlerts(storeId);
    });

    $(document).off('change', '#inventoryPageNumber, #inventoryPageSize').on('change', '#inventoryPageNumber, #inventoryPageSize', function () {
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
      success: function (response) {
        const inventory = response.data || response.items || response || [];
        const totalCount = response.totalCount || response.total || inventory.length;
        const totalPages = response.totalPages || Math.ceil(totalCount / pageSize);

        renderInventoryTable(inventory);
        updateInventoryPaginationInfo(page, totalPages, totalCount);
      },
      error: function (xhr) {
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
      success: function (response) {
        const inventory = response.data || response.items || response || [];
        const totalCount = response.totalCount || response.total || inventory.length;
        const totalPages = response.totalPages || Math.ceil(totalCount / pageSize);

        renderInventoryTable(inventory);
        updateInventoryPaginationInfo(page, totalPages, totalCount);
      },
      error: function (xhr) {
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

  window.updateStockQuantity = function (productDetailId) {
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
      success: function (response) {
        alert('Stock quantity updated successfully!');
        const storeId = getStoreId();
        if (storeId) fetchInventory(storeId);
      },
      error: function (xhr) {
        console.error('Error updating stock:', xhr);
        let errorMsg = 'Error updating stock quantity';
        if (xhr.responseJSON && xhr.responseJSON.message) {
          errorMsg = xhr.responseJSON.message;
        }
        alert(errorMsg);
      }
    });
  };

  window.viewInventoryDetails = function (productDetailId) {
    if (!productDetailId) {
      alert('Product Detail ID is required');
      return;
    }

    $.ajax({
      url: `${API_BASE_URL}/merchant/inventory/product-detail/${productDetailId}`,
      method: 'GET',
      headers: { 'Authorization': `Bearer ${getAuthToken()}` },
      success: function (inventory) {
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
        $('#inventoryDetailsModal').on('hidden.bs.modal', function () {
          $(this).remove();
        });
      },
      error: function (xhr) {
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

    $(document).off('click', '#btnRefreshTransactions').on('click', '#btnRefreshTransactions', function () {
      const storeId = getStoreId();
      if (storeId) {
        fetchTransactions(storeId);
        fetchTransactionSummary(storeId);
      }
    });

    $(document).off('change', '#transactionPeriod').on('change', '#transactionPeriod', function () {
      const storeId = getStoreId();
      if (storeId) fetchTransactionSummary(storeId);
    });

    $(document).off('change', '#transactionPageNumber, #transactionPageSize').on('change', '#transactionPageNumber, #transactionPageSize', function () {
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
      success: function (response) {
        const transactions = response.data || response.items || response || [];
        const totalCount = response.totalCount || response.total || transactions.length;
        const totalPages = response.totalPages || Math.ceil(totalCount / pageSize);

        renderTransactionsTable(transactions);
        updateTransactionPaginationInfo(page, totalPages, totalCount);
      },
      error: function (xhr) {
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
      success: function (summary) {
        $("#totalRevenueSummary").text("$" + parseFloat(summary.totalAmount || summary.totalRevenue || 0).toFixed(2));
        $("#successfulTransactions").text(summary.successfulCount || summary.successfulTransactions || 0);
        $("#failedTransactions").text(summary.failedCount || summary.failedTransactions || 0);
      },
      error: function (xhr) {
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

  // ==================== SWAPPER SECTION ====================
  function loadSwapper() {
    const html = `
      <div class="section-container">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h2 class="section-title"><i class="bi bi-arrow-left-right me-2"></i>Swapper</h2>
        </div>
        <div class="card">
          <div class="card-body">
            <p class="text-muted">Swapper section content will be displayed here.</p>
          </div>
        </div>
      </div>
    `;
    $("#dynamicContentContainer").show().html(html);
  }

  // ==================== ATTRIBUTE & MEASURE SECTION ====================
  function loadAttributeMeasure() {
    const html = `
      <div class="section-container">
        <h2 class="section-title"><i class="bi bi-tags me-2"></i>Attributes & Measures Management</h2>
        
        <!-- Attributes Section -->
        <div class="card mb-4">
          <div class="card-header">
            <div class="d-flex justify-content-between align-items-center">
              <h5 class="mb-0"><i class="bi bi-list-ul me-2"></i>Attributes</h5>
              <button class="btn btn-primary btn-sm" id="btnAddAttribute">
                <i class="bi bi-plus-circle me-2"></i>Add Attribute
              </button>
            </div>
          </div>
          <div class="card-body">
            <div class="row mb-3">
              <div class="col-md-6">
                <input type="text" class="form-control" id="attributeSearch" placeholder="Search attributes...">
              </div>
              <div class="col-md-6">
                <button class="btn btn-secondary" id="btnRefreshAttributes">
                  <i class="bi bi-arrow-clockwise me-2"></i>Refresh
                </button>
              </div>
            </div>
            <div class="table-responsive">
              <table class="table table-hover" id="attributesTable">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Attribute Name</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody id="attributesTableBody">
                  <tr><td colspan="4" class="text-center">Loading...</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Measures Section -->
        <div class="card mb-4">
          <div class="card-header">
            <div class="d-flex justify-content-between align-items-center">
              <h5 class="mb-0"><i class="bi bi-rulers me-2"></i>Measures</h5>
              <button class="btn btn-primary btn-sm" id="btnAddMeasure">
                <i class="bi bi-plus-circle me-2"></i>Add Measure
              </button>
            </div>
          </div>
          <div class="card-body">
            <div class="row mb-3">
              <div class="col-md-6">
                <input type="text" class="form-control" id="measureSearch" placeholder="Search measures...">
              </div>
              <div class="col-md-6">
                <button class="btn btn-secondary" id="btnRefreshMeasures">
                  <i class="bi bi-arrow-clockwise me-2"></i>Refresh
                </button>
              </div>
            </div>
            <div class="table-responsive">
              <table class="table table-hover" id="measuresTable">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Measure Name</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody id="measuresTableBody">
                  <tr><td colspan="4" class="text-center">Loading...</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Measure by Attribute Section -->
        <div class="card">
          <div class="card-header">
            <div class="d-flex justify-content-between align-items-center">
              <h5 class="mb-0"><i class="bi bi-link-45deg me-2"></i>Measures by Attribute</h5>
              <button class="btn btn-primary btn-sm" id="btnAddMeasureByAttribute">
                <i class="bi bi-plus-circle me-2"></i>Add Measure to Attribute
              </button>
            </div>
          </div>
          <div class="card-body">
            <div class="row mb-3">
              <div class="col-md-6">
                <label class="form-label">Select Attribute</label>
                <select class="form-select" id="attributeSelectForMeasure">
                  <option value="">Choose an attribute...</option>
                </select>
              </div>
              <div class="col-md-6">
                <button class="btn btn-secondary mt-4" id="btnRefreshMeasuresByAttribute">
                  <i class="bi bi-arrow-clockwise me-2"></i>Refresh
                </button>
              </div>
            </div>
            <div class="table-responsive">
              <table class="table table-hover" id="measuresByAttributeTable">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Measure Name</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody id="measuresByAttributeTableBody">
                  <tr><td colspan="3" class="text-center">Select an attribute to view measures</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    `;
    $("#dynamicContentContainer").show().html(html);

    fetchAttributes();
    fetchMeasures();
    loadAttributesForSelect();

    // Bind event handlers
    $(document).off('click', '#btnAddAttribute').on('click', '#btnAddAttribute', showAddAttributeModal);
    $(document).off('click', '#btnAddMeasure').on('click', '#btnAddMeasure', showAddMeasureModal);
    $(document).off('click', '#btnAddMeasureByAttribute').on('click', '#btnAddMeasureByAttribute', showAddMeasureByAttributeModal);
    $(document).off('click', '#btnRefreshAttributes').on('click', '#btnRefreshAttributes', fetchAttributes);
    $(document).off('click', '#btnRefreshMeasures').on('click', '#btnRefreshMeasures', fetchMeasures);
    $(document).off('click', '#btnRefreshMeasuresByAttribute').on('click', '#btnRefreshMeasuresByAttribute', function () {
      const attributeName = $('#attributeSelectForMeasure').val();
      console.log('btnRefreshMeasuresByAttribute clicked, selected attribute:', attributeName);
      if (attributeName && attributeName.trim() !== '') {
        fetchMeasuresByAttribute(attributeName);
      } else {
        console.warn('btnRefreshMeasuresByAttribute: No attribute selected');
        $('#measuresByAttributeTableBody').html('<tr><td colspan="3" class="text-center text-warning">Please select an attribute first</td></tr>');
      }
    });
    $(document).off('change', '#attributeSelectForMeasure').on('change', '#attributeSelectForMeasure', function () {
      const attributeName = $(this).val();
      console.log('attributeSelectForMeasure changed, selected attribute:', attributeName);
      if (attributeName && attributeName.trim() !== '') {
        fetchMeasuresByAttribute(attributeName);
      } else {
        $('#measuresByAttributeTableBody').html('<tr><td colspan="3" class="text-center text-muted">Select an attribute to view measures</td></tr>');
      }
    });
    $(document).off('input', '#attributeSearch').on('input', '#attributeSearch', function () {
      filterAttributes($(this).val());
    });
    $(document).off('input', '#measureSearch').on('input', '#measureSearch', function () {
      filterMeasures($(this).val());
    });
  }

  function fetchAttributes() {
    const token = getAuthToken();
    if (!token) {
      $("#attributesTableBody").html('<tr><td colspan="4" class="text-center text-danger">Authentication required</td></tr>');
      return;
    }

    $.ajax({
      url: `${API_BASE_URL}/merchant/attributes-measures/attributes`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      success: function (response) {
        const attributes = Array.isArray(response) ? response : [];
        renderAttributesTable(attributes);
      },
      error: function (xhr) {
        console.error('Error fetching attributes:', xhr);
        let errorMsg = 'Error loading attributes';
        if (xhr.responseJSON && xhr.responseJSON.message) {
          errorMsg = xhr.responseJSON.message;
        }
        $("#attributesTableBody").html(`<tr><td colspan="4" class="text-center text-danger">${errorMsg}</td></tr>`);
      }
    });
  }

  function fetchMeasures() {
    const token = getAuthToken();
    if (!token) {
      $("#measuresTableBody").html('<tr><td colspan="4" class="text-center text-danger">Authentication required</td></tr>');
      return;
    }

    $.ajax({
      url: `${API_BASE_URL}/merchant/attributes-measures/measures`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      success: function (response) {
        const measures = Array.isArray(response) ? response : [];
        renderMeasuresTable(measures);
      },
      error: function (xhr) {
        console.error('Error fetching measures:', xhr);
        let errorMsg = 'Error loading measures';
        if (xhr.responseJSON && xhr.responseJSON.message) {
          errorMsg = xhr.responseJSON.message;
        }
        $("#measuresTableBody").html(`<tr><td colspan="4" class="text-center text-danger">${errorMsg}</td></tr>`);
      }
    });
  }


  function fetchMeasuresByAttribute(attributeName) {
    // Validate input
    if (!attributeName || attributeName.trim() === '') {
      console.error('fetchMeasuresByAttribute: attributeName is empty or invalid');
      $("#measuresByAttributeTableBody").html('<tr><td colspan="3" class="text-center text-warning">Please select an attribute</td></tr>');
      return;
    }

    const token = getAuthToken();
    if (!token) {
      console.error('fetchMeasuresByAttribute: No authentication token found');
      $("#measuresByAttributeTableBody").html('<tr><td colspan="3" class="text-center text-danger">Authentication required</td></tr>');
      return;
    }

    // Get attributeId from cache or look it up
    let attributeId = attributeNameToIdMap[attributeName];

    if (!attributeId) {
      // If not in cache, we need to look it up
      console.log('fetchMeasuresByAttribute: Looking up attribute ID for:', attributeName);
      $("#measuresByAttributeTableBody").html('<tr><td colspan="3" class="text-center"><i class="bi bi-arrow-repeat me-2"></i>Looking up attribute ID...</td></tr>');

      lookupAttributeIdByName(attributeName, function (foundId) {
        if (foundId) {
          // Cache it and make the request
          attributeNameToIdMap[attributeName] = foundId;
          // Recursively call with the found ID
          fetchMeasuresByAttributeWithId(attributeName, foundId);
        } else {
          $("#measuresByAttributeTableBody").html('<tr><td colspan="3" class="text-center text-danger">Could not find attribute ID. Please try again.</td></tr>');
        }
      });
      return;
    }

    // Use the cached ID
    fetchMeasuresByAttributeWithId(attributeName, attributeId);
  }

  // Internal function to actually fetch measures using attributeId
  function fetchMeasuresByAttributeWithId(attributeName, attributeId) {

    const token = getAuthToken();
    if (!token) {
      console.error('fetchMeasuresByAttributeWithId: No authentication token found');
      $("#measuresByAttributeTableBody").html('<tr><td colspan="3" class="text-center text-danger">Authentication required</td></tr>');
      return;
    }

    // Construct URL with attributeId
    const url = `${API_BASE_URL}/merchant/attributes-measures/attributes/${attributeId}/measures`;
    console.log('fetchMeasuresByAttributeWithId: Calling API:', url);
    console.log('fetchMeasuresByAttributeWithId: Attribute ID:', attributeId, 'Attribute name:', attributeName);

    // Show loading state
    $("#measuresByAttributeTableBody").html('<tr><td colspan="3" class="text-center"><i class="bi bi-arrow-repeat me-2"></i>Loading measures...</td></tr>');

    $.ajax({
      url: url,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      success: function (response) {
        console.log('fetchMeasuresByAttribute: Success response:', response);

        // Handle response - could be array or object with data property
        let measures = [];
        if (Array.isArray(response)) {
          measures = response;
        } else if (response && Array.isArray(response.data)) {
          measures = response.data;
        } else if (response && response.data) {
          measures = [response.data];
        }

        console.log('fetchMeasuresByAttribute: Parsed measures:', measures);
        renderMeasuresByAttributeTable(measures, attributeName);
      },
      error: function (xhr, status, error) {
        console.error('fetchMeasuresByAttribute: AJAX Error Details:');
        console.error('  - Status:', xhr.status);
        console.error('  - Status Text:', xhr.statusText);
        console.error('  - Error:', error);
        console.error('  - Response Text:', xhr.responseText);
        console.error('  - Response JSON:', xhr.responseJSON);
        console.error('  - Full XHR object:', xhr);

        let errorMsg = 'Error loading measures';

        if (xhr.status === 0) {
          errorMsg = 'Network error. Please check your connection and CORS settings.';
        } else if (xhr.status === 401) {
          errorMsg = 'Authentication failed. Please login again.';
        } else if (xhr.status === 404) {
          errorMsg = `Attribute with ID ${attributeId} not found.`;
        } else if (xhr.status === 400) {
          errorMsg = 'Invalid request. Please check the attribute ID.';
        } else if (xhr.responseJSON && xhr.responseJSON.message) {
          errorMsg = xhr.responseJSON.message;
        } else if (xhr.responseText) {
          try {
            const errorObj = JSON.parse(xhr.responseText);
            errorMsg = errorObj.message || errorObj.error || errorMsg;
          } catch (e) {
            errorMsg = `Server error (${xhr.status}): ${xhr.statusText}`;
          }
        } else {
          errorMsg = `Error (${xhr.status}): ${xhr.statusText || error}`;
        }

        $("#measuresByAttributeTableBody").html(`<tr><td colspan="3" class="text-center text-danger">${errorMsg}</td></tr>`);
      }
    });
  }

  // Helper function to look up attribute ID from name by trying IDs sequentially
  // FIXED: Now stops after finding first valid ID to prevent hundreds of 404 errors
  function lookupAttributeIdByName(attributeName, callback) {
    if (!attributeName || attributeName.trim() === '') {
      callback(null);
      return;
    }

    // Check cache first
    if (attributeNameToIdMap[attributeName]) {
      callback(attributeNameToIdMap[attributeName]);
      return;
    }

    const token = getAuthToken();
    if (!token) {
      console.error('lookupAttributeIdByName: No authentication token');
      callback(null);
      return;
    }

    // Try IDs sequentially starting from 1, but STOP after finding first valid ID
    let currentId = 1;
    const maxAttempts = 100; // Reduced limit to prevent excessive 404s
    let attempts = 0;
    let isStopped = false; // Flag to prevent multiple callbacks

    function tryNextId() {
      // Stop if we already found an ID or exceeded max attempts
      if (isStopped || attempts >= maxAttempts) {
        if (!isStopped) {
          console.warn('lookupAttributeIdByName: Max attempts reached without finding valid ID');
          callback(null);
        }
        return;
      }

      attempts++;
      const testUrl = `${API_BASE_URL}/merchant/attributes-measures/attributes/${currentId}/measures`;

      $.ajax({
        url: testUrl,
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        success: function (response) {
          // FIXED: Stop immediately after finding first valid ID
          // Cache it and return - don't continue trying more IDs
          if (!isStopped) {
            isStopped = true;
            attributeNameToIdMap[attributeName] = currentId;
            console.log('lookupAttributeIdByName: Found attribute ID', currentId, 'for', attributeName);
            callback(currentId);
          }
        },
        error: function (xhr) {
          if (isStopped) {
            return; // Already found an ID, ignore this error
          }

          if (xhr.status === 404) {
            // Attribute not found, try next ID
            currentId++;
            tryNextId();
          } else if (xhr.status === 400 && xhr.responseJSON && xhr.responseJSON.message) {
            // Check if it's an invalid ID error
            if (xhr.responseJSON.message.includes('Invalid attribute ID')) {
              currentId++;
              tryNextId();
            } else {
              // Other 400 error - might be valid ID, use it
              isStopped = true;
              attributeNameToIdMap[attributeName] = currentId;
              console.log('lookupAttributeIdByName: Using attribute ID', currentId, 'for', attributeName);
              callback(currentId);
            }
          } else {
            // Other error (401, 500, etc.) - don't use this ID, try next
            currentId++;
            tryNextId();
          }
        }
      });
    }

    // Start trying IDs
    tryNextId();
  }

  function loadAttributesForSelect() {
    const token = getAuthToken();
    if (!token) {
      console.error('loadAttributesForSelect: No authentication token found');
      return;
    }

    console.log('loadAttributesForSelect: Loading attributes for dropdown');

    $.ajax({
      url: `${API_BASE_URL}/merchant/attributes-measures/attributes`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      success: function (response) {
        console.log('loadAttributesForSelect: Success response:', response);

        // Handle response - could be array or object with data property
        let attributes = [];
        if (Array.isArray(response)) {
          attributes = response;
        } else if (response && Array.isArray(response.data)) {
          attributes = response.data;
        }

        console.log('loadAttributesForSelect: Parsed attributes:', attributes);

        const $select = $('#attributeSelectForMeasure');
        if ($select.length === 0) {
          console.error('loadAttributesForSelect: Select element #attributeSelectForMeasure not found');
          return;
        }

        // Clear existing options except the first one
        $select.find('option:not(:first)').remove();

        // Clear the cache
        attributeNameToIdMap = {};

        // Add attributes to dropdown
        // Store attribute name in value - ID will be looked up and cached when selected
        attributes.forEach((attr, index) => {
          const attrName = typeof attr === 'string' ? attr : (attr.name || attr.Name || attr);
          const escapedAttr = String(attrName).replace(/"/g, '&quot;');
          $select.append(`<option value="${escapedAttr}">${attrName}</option>`);
        });

        // Note: Attribute ID mapping will be built on-demand when attributes are selected
        // This prevents hundreds of 404 errors from sequential lookups

        console.log('loadAttributesForSelect: Loaded', attributes.length, 'attributes into dropdown');
      },
      error: function (xhr, status, error) {
        console.error('loadAttributesForSelect: Error loading attributes:');
        console.error('  - Status:', xhr.status);
        console.error('  - Status Text:', xhr.statusText);
        console.error('  - Error:', error);
        console.error('  - Response Text:', xhr.responseText);
        console.error('  - Response JSON:', xhr.responseJSON);
      }
    });
  }

  function renderAttributesTable(attributes) {
    const $tbody = $('#attributesTableBody');
    if (!attributes || attributes.length === 0) {
      $tbody.html('<tr><td colspan="4" class="text-center text-muted">No attributes found</td></tr>');
      return;
    }

    let html = '';
    attributes.forEach((attr, index) => {
      const escapedAttr = attr.replace(/'/g, "\\'").replace(/"/g, '&quot;');
      html += `
        <tr>
          <td>${index + 1}</td>
          <td><strong>${attr}</strong></td>
          <td><span class="badge bg-success">Active</span></td>
          <td>
            <button class="btn btn-sm btn-outline-primary check-attribute-btn" data-attribute="${escapedAttr}" title="Check">
              <i class="bi bi-search"></i>
            </button>
          </td>
        </tr>
      `;
    });
    $tbody.html(html);

    // Bind click handlers using event delegation
    $tbody.off('click', '.check-attribute-btn').on('click', '.check-attribute-btn', function () {
      const attrName = $(this).data('attribute');
      checkAttribute(attrName);
    });
  }

  function renderMeasuresTable(measures) {
    const $tbody = $('#measuresTableBody');
    if (!measures || measures.length === 0) {
      $tbody.html('<tr><td colspan="4" class="text-center text-muted">No measures found</td></tr>');
      return;
    }

    let html = '';
    measures.forEach((measure, index) => {
      const escapedMeasure = measure.replace(/'/g, "\\'").replace(/"/g, '&quot;');
      html += `
        <tr>
          <td>${index + 1}</td>
          <td><strong>${measure}</strong></td>
          <td><span class="badge bg-success">Active</span></td>
          <td>
            <button class="btn btn-sm btn-outline-primary check-measure-btn" data-measure="${escapedMeasure}" title="Check">
              <i class="bi bi-search"></i>
            </button>
          </td>
        </tr>
      `;
    });
    $tbody.html(html);

    // Bind click handlers using event delegation
    $tbody.off('click', '.check-measure-btn').on('click', '.check-measure-btn', function () {
      const measureName = $(this).data('measure');
      checkMeasure(measureName);
    });
  }

  function renderMeasuresByAttributeTable(measures, attributeName) {
    const $tbody = $('#measuresByAttributeTableBody');

    console.log('renderMeasuresByAttributeTable: Rendering measures:', measures);
    console.log('renderMeasuresByAttributeTable: Attribute name:', attributeName);

    if (!measures || measures.length === 0) {
      const message = attributeName
        ? `No measures found for attribute "${attributeName}". Measures will appear here once they are used in products with this attribute.`
        : 'No measures found for this attribute';
      $tbody.html(`<tr><td colspan="3" class="text-center text-muted">${message}</td></tr>`);
      return;
    }

    let html = '';
    measures.forEach((measure, index) => {
      // Handle if measure is an object with a Name property, or just a string
      const measureName = typeof measure === 'string' ? measure : (measure.name || measure.Name || measure);
      const escapedMeasure = String(measureName).replace(/</g, '&lt;').replace(/>/g, '&gt;');

      html += `
        <tr>
          <td>${index + 1}</td>
          <td><strong>${escapedMeasure}</strong></td>
          <td><span class="badge bg-success">Active</span></td>
        </tr>
      `;
    });
    $tbody.html(html);
    console.log('renderMeasuresByAttributeTable: Rendered', measures.length, 'measures');
  }

  function filterAttributes(searchTerm) {
    const $rows = $('#attributesTableBody tr');
    if (!searchTerm) {
      $rows.show();
      return;
    }
    const term = searchTerm.toLowerCase();
    $rows.each(function () {
      const text = $(this).text().toLowerCase();
      $(this).toggle(text.includes(term));
    });
  }

  function filterMeasures(searchTerm) {
    const $rows = $('#measuresTableBody tr');
    if (!searchTerm) {
      $rows.show();
      return;
    }
    const term = searchTerm.toLowerCase();
    $rows.each(function () {
      const text = $(this).text().toLowerCase();
      $(this).toggle(text.includes(term));
    });
  }

  function showAddAttributeModal() {
    const modalHtml = `
      <div class="modal fade" id="addAttributeModal" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title"><i class="bi bi-plus-circle me-2"></i>Add New Attribute</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3">
                <label for="newAttributeName" class="form-label">Attribute Name <span class="text-danger">*</span></label>
                <input type="text" class="form-control" id="newAttributeName" placeholder="Enter attribute name" required>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="button" class="btn btn-primary" id="btnConfirmAddAttribute">Add Attribute</button>
            </div>
          </div>
        </div>
      </div>
    `;

    $('#addAttributeModal').remove();
    $('body').append(modalHtml);
    const modal = new bootstrap.Modal(document.getElementById('addAttributeModal'));
    modal.show();

    $('#btnConfirmAddAttribute').off('click').on('click', function () {
      const name = $('#newAttributeName').val().trim();
      if (!name) {
        showNotification('Attribute name is required', 'error');
        return;
      }
      addAttribute(name);
      modal.hide();
    });
  }

  function showAddMeasureModal() {
    const modalHtml = `
      <div class="modal fade" id="addMeasureModal" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title"><i class="bi bi-plus-circle me-2"></i>Add New Measure</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3">
                <label for="newMeasureName" class="form-label">Measure Name <span class="text-danger">*</span></label>
                <input type="text" class="form-control" id="newMeasureName" placeholder="Enter measure name (e.g., kg, cm, liter)" required>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="button" class="btn btn-primary" id="btnConfirmAddMeasure">Add Measure</button>
            </div>
          </div>
        </div>
      </div>
    `;

    $('#addMeasureModal').remove();
    $('body').append(modalHtml);
    const modal = new bootstrap.Modal(document.getElementById('addMeasureModal'));
    modal.show();

    $('#btnConfirmAddMeasure').off('click').on('click', function () {
      const name = $('#newMeasureName').val().trim();
      if (!name) {
        showNotification('Measure name is required', 'error');
        return;
      }
      addMeasure(name);
      modal.hide();
    });
  }

  function showAddMeasureByAttributeModal() {
    const modalHtml = `
      <div class="modal fade" id="addMeasureByAttributeModal" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title"><i class="bi bi-link-45deg me-2"></i>Add Measure to Attribute</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3">
                <label for="modalAttributeSelect" class="form-label">Attribute <span class="text-danger">*</span></label>
                <select class="form-select" id="modalAttributeSelect" required>
                  <option value="">Choose an attribute...</option>
                </select>
              </div>
              <div class="mb-3">
                <label for="modalMeasureName" class="form-label">Measure Name <span class="text-danger">*</span></label>
                <input type="text" class="form-control" id="modalMeasureName" placeholder="Enter measure name" required>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="button" class="btn btn-primary" id="btnConfirmAddMeasureByAttribute">Add Measure</button>
            </div>
          </div>
        </div>
      </div>
    `;

    $('#addMeasureByAttributeModal').remove();
    $('body').append(modalHtml);

    // Load attributes into modal select
    const token = getAuthToken();
    if (token) {
      $.ajax({
        url: `${API_BASE_URL}/merchant/attributes-measures/attributes`,
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        success: function (response) {
          const attributes = Array.isArray(response) ? response : [];
          const $select = $('#modalAttributeSelect');
          attributes.forEach(attr => {
            $select.append(`<option value="${attr}">${attr}</option>`);
          });
        }
      });
    }

    const modal = new bootstrap.Modal(document.getElementById('addMeasureByAttributeModal'));
    modal.show();

    $('#btnConfirmAddMeasureByAttribute').off('click').on('click', function () {
      const attributeName = $('#modalAttributeSelect').val();
      const measureName = $('#modalMeasureName').val().trim();
      if (!attributeName || !measureName) {
        showNotification('Both attribute and measure name are required', 'error');
        return;
      }
      addMeasureByAttribute(attributeName, measureName);
      modal.hide();
    });
  }

  function addAttribute(name) {
    const token = getAuthToken();
    if (!token) {
      showNotification('Authentication required', 'error');
      return;
    }

    $.ajax({
      url: `${API_BASE_URL}/merchant/attributes-measures/attributes`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      data: JSON.stringify({ Name: name }),
      success: function (response) {
        showNotification('Attribute added successfully ✅', 'success');
        fetchAttributes();
        loadAttributesForSelect();
      },
      error: function (xhr) {
        console.error('Error adding attribute:', xhr);
        let errorMsg = 'Failed to add attribute';
        if (xhr.responseJSON && xhr.responseJSON.message) {
          errorMsg = xhr.responseJSON.message;
        }
        showNotification(errorMsg, 'error');
      }
    });
  }

  function addMeasure(name) {
    const token = getAuthToken();
    if (!token) {
      showNotification('Authentication required', 'error');
      return;
    }

    $.ajax({
      url: `${API_BASE_URL}/merchant/attributes-measures/measures`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      data: JSON.stringify({ Name: name }),
      success: function (response) {
        showNotification('Measure added successfully ✅', 'success');
        fetchMeasures();
      },
      error: function (xhr) {
        console.error('Error adding measure:', xhr);
        let errorMsg = 'Failed to add measure';
        if (xhr.responseJSON && xhr.responseJSON.message) {
          errorMsg = xhr.responseJSON.message;
        }
        showNotification(errorMsg, 'error');
      }
    });
  }

  function addMeasureByAttribute(attributeName, measureName) {
    const token = getAuthToken();
    if (!token) {
      showNotification('Authentication required', 'error');
      return;
    }

    $.ajax({
      url: `${API_BASE_URL}/merchant/attributes-measures/attributes/${encodeURIComponent(attributeName)}/measures`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      data: JSON.stringify({ name: measureName }),
      success: function (response) {
        showNotification('Measure added to attribute successfully ✅', 'success');
        fetchMeasuresByAttribute(attributeName);
        fetchMeasures();
      },
      error: function (xhr) {
        console.error('Error adding measure by attribute:', xhr);
        let errorMsg = 'Failed to add measure to attribute';
        if (xhr.responseJSON && xhr.responseJSON.message) {
          errorMsg = xhr.responseJSON.message;
        }
        showNotification(errorMsg, 'error');
      }
    });
  }

  function checkAttribute(name) {
    const token = getAuthToken();
    if (!token) {
      showNotification('Authentication required', 'error');
      return;
    }

    $.ajax({
      url: `${API_BASE_URL}/merchant/attributes-measures/attributes/check?name=${encodeURIComponent(name)}`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      success: function (response) {
        const exists = response.exists;
        showNotification(`Attribute "${name}" ${exists ? 'exists' : 'does not exist'}`, exists ? 'success' : 'info');
      },
      error: function (xhr) {
        console.error('Error checking attribute:', xhr);
        showNotification('Error checking attribute', 'error');
      }
    });
  }

  function checkMeasure(name) {
    const token = getAuthToken();
    if (!token) {
      showNotification('Authentication required', 'error');
      return;
    }

    $.ajax({
      url: `${API_BASE_URL}/merchant/attributes-measures/measures/check?name=${encodeURIComponent(name)}`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      success: function (response) {
        const exists = response.exists;
        showNotification(`Measure "${name}" ${exists ? 'exists' : 'does not exist'}`, exists ? 'success' : 'info');
      },
      error: function (xhr) {
        console.error('Error checking measure:', xhr);
        showNotification('Error checking measure', 'error');
      }
    });
  }

  // Expose check functions globally for onclick handlers
  window.checkAttribute = checkAttribute;
  window.checkMeasure = checkMeasure;

  // ==================== PRODUCT DETAILS (VARIANTS) VIEW ====================
  function loadProductDetailsView(productId, productName) {
    const html = `
      <div class="section-container">
        <!-- Breadcrumb Navigation -->
        <nav aria-label="breadcrumb" class="mb-3">
          <ol class="breadcrumb">
            <li class="breadcrumb-item"><a href="#" onclick="MerchantApp.showSection('Products'); return false;"><i class="bi bi-box-seam me-1"></i>Products</a></li>
            <li class="breadcrumb-item active">${escapeHtml(productName || 'Product')} - Variants</li>
          </ol>
        </nav>
        
        <!-- Header -->
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 class="section-title mb-1"><i class="bi bi-layers me-2"></i>Product Variants</h2>
            <p class="text-muted mb-0">${escapeHtml(productName || 'Product')} - Manage product variants and configurations</p>
          </div>
          <div class="d-flex gap-2">
            <button class="btn btn-secondary" onclick="MerchantApp.showSection('Products');">
              <i class="bi bi-arrow-left me-2"></i>Back to Products
            </button>
            <button class="btn btn-success" id="btnAddProductDetail">
              <i class="bi bi-plus-circle me-2"></i>Add Variant
            </button>
            <button class="btn btn-primary" id="btnRefreshProductDetails">
              <i class="bi bi-arrow-clockwise me-2"></i>Refresh
            </button>
          </div>
        </div>
        
        <!-- Product Details Table -->
        <div class="card shadow-sm">
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-hover align-middle" id="productDetailsTable">
                <thead>
                  <tr>
                    <th>Variant ID</th>
                    <th>Storage</th>
                    <th>RAM</th>
                    <th>Processor</th>
                    <th>Measure Unit</th>
                    <th>Attributes</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th style="width: 250px;">Actions</th>
                  </tr>
                </thead>
                <tbody id="productDetailsTableBody">
                  <tr><td colspan="9" class="text-center py-4"><i class="bi bi-arrow-repeat spin me-2"></i>Loading variants...</td></tr>
                </tbody>
              </table>
            </div>
            <div id="productDetailsEmpty" class="text-center py-5" style="display: none;">
              <i class="bi bi-inbox" style="font-size: 3rem; color: #ccc;"></i>
              <p class="text-muted mt-3">No variants found for this product.</p>
              <button class="btn btn-success" onclick="$('#btnAddProductDetail').click();">
                <i class="bi bi-plus-circle me-2"></i>Add First Variant
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    $("#dynamicContentContainer").show().html(html);

    // Fetch product details
    fetchProductDetails(productId);

    // Bind event handlers
    $(document).off('click', '#btnRefreshProductDetails').on('click', '#btnRefreshProductDetails', function () {
      fetchProductDetails(productId);
    });

    $(document).off('click', '#btnAddProductDetail').on('click', '#btnAddProductDetail', function () {
      showAddProductDetailModal(productId);
    });
  }

  function fetchProductDetails(productId) {
    // Note: The backend may not have a direct endpoint for this
    // We'll try to get product by ID first, then fetch details
    // If endpoint doesn't exist, we'll need to adapt
    $.ajax({
      url: API_ENDPOINTS.products.getById(productId),
      method: 'GET',
      headers: { 'Authorization': `Bearer ${getAuthToken()}` },
      success: function (product) {
        // Try to get product details - may need to check if product has details property
        const details = product.productDetails || product.ProductDetails || product.details || [];
        renderProductDetailsTable(details, productId);
      },
      error: function (xhr) {
        console.error('Error fetching product details:', xhr);
        // If product endpoint fails, try alternative approach
        // For now, show empty state
        $("#productDetailsTableBody").html('<tr><td colspan="9" class="text-center text-danger py-4">Error loading variants. Please try again.</td></tr>');
        $("#productDetailsEmpty").show();
      }
    });
  }

  function renderProductDetailsTable(details, productId) {
    if (!details || details.length === 0) {
      $("#productDetailsTableBody").html('');
      $("#productDetailsTable").hide();
      $("#productDetailsEmpty").show();
      return;
    }

    $("#productDetailsTable").show();
    $("#productDetailsEmpty").hide();

    let html = '';
    details.forEach((detail, index) => {
      const detailId = detail.productDetailId || detail.ProductDetailId || detail.id || index;
      const storage = detail.storage || detail.Storage || 'N/A';
      const ram = detail.ram || detail.RAM || 'N/A';
      const processor = detail.processor || detail.Processor || 'N/A';
      const measureUnit = detail.measureUnit || detail.MeasureUnit || 'piece';
      const price = parseFloat(detail.price || detail.Price || 0).toFixed(2);
      const quantity = detail.quantityAvailable || detail.QuantityAvailable || 0;

      // Format attributes
      let attributesHtml = 'None';
      if (detail.attributes && detail.attributes.length > 0) {
        const attrs = detail.attributes.map(attr => {
          const name = attr.name || attr.Name || attr.key || 'Unknown';
          const value = attr.value || attr.Value || attr.measureUnit || 'N/A';
          return `${escapeHtml(name)}: ${escapeHtml(value)}`;
        });
        attributesHtml = attrs.join(', ');
      } else if (detail.Attributes && detail.Attributes.length > 0) {
        const attrs = detail.Attributes.map(attr => {
          const name = attr.name || attr.Name || 'Unknown';
          const value = attr.measureUnit || attr.MeasureUnit || 'N/A';
          return `${escapeHtml(name)}: ${escapeHtml(value)}`;
        });
        attributesHtml = attrs.join(', ');
      }

      html += `
        <tr class="table-row-hover">
          <td><strong>#${detailId}</strong></td>
          <td>${escapeHtml(storage)}</td>
          <td>${escapeHtml(ram)}</td>
          <td>${escapeHtml(processor)}</td>
          <td><span class="badge bg-info">${escapeHtml(measureUnit)}</span></td>
          <td class="text-muted small" style="max-width: 200px;" title="${attributesHtml}">${attributesHtml.length > 50 ? attributesHtml.substring(0, 50) + '...' : attributesHtml}</td>
          <td><strong>$${price}</strong></td>
          <td><span class="badge ${quantity > 0 ? 'bg-success' : 'bg-warning'}">${quantity}</span></td>
          <td>
            <div class="btn-group" role="group">
              <button class="btn btn-sm btn-primary" onclick="MerchantApp.viewInventory(${detailId}, 'Variant #${detailId}')" title="View Inventory">
                <i class="bi bi-box-seam"></i> Inventory
              </button>
              <button class="btn btn-sm btn-warning" onclick="MerchantApp.editProductDetail(${detailId})" title="Edit">
                <i class="bi bi-pencil"></i>
              </button>
              <button class="btn btn-sm btn-danger" onclick="MerchantApp.deleteProductDetail(${detailId})" title="Delete">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    });
    $("#productDetailsTableBody").html(html);
  }

  // ==================== INVENTORY VIEW ====================
  function viewInventory(productDetailId, productDetailName) {
    if (!productDetailId) {
      showNotification('Product Detail ID is required', 'error');
      return;
    }

    navigationState.currentView = 'inventory';
    navigationState.currentProductDetailId = productDetailId;
    navigationState.currentProductDetailName = productDetailName || 'Variant';

    loadInventoryView(productDetailId, productDetailName);
  }

  function loadInventoryView(productDetailId, productDetailName) {
    const html = `
      <div class="section-container">
        <!-- Breadcrumb Navigation -->
        <nav aria-label="breadcrumb" class="mb-3">
          <ol class="breadcrumb">
            <li class="breadcrumb-item"><a href="#" onclick="MerchantApp.showSection('Products'); return false;"><i class="bi bi-box-seam me-1"></i>Products</a></li>
            <li class="breadcrumb-item"><a href="#" onclick="MerchantApp.viewProductVariants(${navigationState.currentProductId}, '${escapeHtml(navigationState.currentProductName || 'Product')}'); return false;">${escapeHtml(navigationState.currentProductName || 'Product')}</a></li>
            <li class="breadcrumb-item active">${escapeHtml(productDetailName || 'Variant')} - Inventory</li>
          </ol>
        </nav>
        
        <!-- Header -->
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 class="section-title mb-1"><i class="bi bi-box-seam me-2"></i>Inventory Management</h2>
            <p class="text-muted mb-0">${escapeHtml(productDetailName || 'Variant')} - Manage serial numbers and inventory items</p>
          </div>
          <div class="d-flex gap-2">
            <button class="btn btn-secondary" onclick="MerchantApp.viewProductVariants(${navigationState.currentProductId}, '${escapeHtml(navigationState.currentProductName || 'Product')}');">
              <i class="bi bi-arrow-left me-2"></i>Back to Variants
            </button>
            <button class="btn btn-success" id="btnAddInventoryItem">
              <i class="bi bi-plus-circle me-2"></i>Add Inventory Item
            </button>
            <button class="btn btn-primary" id="btnRefreshInventory">
              <i class="bi bi-arrow-clockwise me-2"></i>Refresh
            </button>
          </div>
        </div>
        
        <!-- Inventory Summary Card -->
        <div class="row mb-4">
          <div class="col-md-4">
            <div class="card bg-primary text-white">
              <div class="card-body">
                <h5 class="card-title"><i class="bi bi-box-seam me-2"></i>Total Units</h5>
                <h2 class="mb-0" id="inventoryTotalCount">0</h2>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card bg-success text-white">
              <div class="card-body">
                <h5 class="card-title"><i class="bi bi-check-circle me-2"></i>Available</h5>
                <h2 class="mb-0" id="inventoryAvailableCount">0</h2>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card bg-warning text-white">
              <div class="card-body">
                <h5 class="card-title"><i class="bi bi-exclamation-triangle me-2"></i>Reserved</h5>
                <h2 class="mb-0" id="inventoryReservedCount">0</h2>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Inventory Table -->
        <div class="card shadow-sm">
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-hover align-middle" id="inventoryTable">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Serial Number</th>
                    <th>Created At</th>
                    <th>Status</th>
                    <th style="width: 150px;">Actions</th>
                  </tr>
                </thead>
                <tbody id="inventoryTableBody">
                  <tr><td colspan="5" class="text-center py-4"><i class="bi bi-arrow-repeat spin me-2"></i>Loading inventory...</td></tr>
                </tbody>
              </table>
            </div>
            <div id="inventoryEmpty" class="text-center py-5" style="display: none;">
              <i class="bi bi-inbox" style="font-size: 3rem; color: #ccc;"></i>
              <p class="text-muted mt-3">No inventory items found for this variant.</p>
              <button class="btn btn-success" onclick="$('#btnAddInventoryItem').click();">
                <i class="bi bi-plus-circle me-2"></i>Add First Inventory Item
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    $("#dynamicContentContainer").show().html(html);

    // Fetch inventory
    fetchInventory(productDetailId);

    // Bind event handlers
    $(document).off('click', '#btnRefreshInventory').on('click', '#btnRefreshInventory', function () {
      fetchInventory(productDetailId);
    });

    $(document).off('click', '#btnAddInventoryItem').on('click', '#btnAddInventoryItem', function () {
      showAddInventoryModal(productDetailId);
    });
  }

  function fetchInventory(productDetailId) {
    $.ajax({
      url: API_ENDPOINTS.inventory.getByProductDetailId(productDetailId),
      method: 'GET',
      headers: { 'Authorization': `Bearer ${getAuthToken()}` },
      success: function (response) {
        // The response might be a single InventoryDto or a list
        // Adapt based on actual backend response
        const inventory = response.inventory || response.items || response || [];
        renderInventoryTable(inventory, productDetailId);
        updateInventorySummary(inventory);
      },
      error: function (xhr) {
        console.error('Error fetching inventory:', xhr);
        // If endpoint returns 404, it might mean no inventory exists yet
        if (xhr.status === 404) {
          renderInventoryTable([], productDetailId);
          updateInventorySummary([]);
        } else {
          let errorMsg = 'Error loading inventory';
          if (xhr.responseJSON && xhr.responseJSON.message) {
            errorMsg = xhr.responseJSON.message;
          }
          $("#inventoryTableBody").html(`<tr><td colspan="5" class="text-center text-danger py-4">${errorMsg}</td></tr>`);
        }
      }
    });
  }

  function renderInventoryTable(inventory, productDetailId) {
    // Note: The backend InventoryDto doesn't have serial numbers per item
    // It has QuantityAvailable, QuantityReserved
    // We'll need to adapt this based on actual requirements
    // For now, we'll show the inventory summary

    if (!inventory || (Array.isArray(inventory) && inventory.length === 0)) {
      $("#inventoryTableBody").html('');
      $("#inventoryTable").hide();
      $("#inventoryEmpty").show();
      return;
    }

    $("#inventoryTable").show();
    $("#inventoryEmpty").hide();

    // If inventory is a single object (not array), convert to array
    const inventoryList = Array.isArray(inventory) ? inventory : [inventory];

    let html = '';
    if (inventoryList.length > 0 && inventoryList[0].quantityAvailable !== undefined) {
      // Backend returns quantity-based inventory, not serial-based
      // We'll show it as a summary for now
      const inv = inventoryList[0];
      html += `
        <tr>
          <td>1</td>
          <td><span class="text-muted">Quantity-based inventory</span></td>
          <td>${inv.createdDate ? new Date(inv.createdDate).toLocaleDateString() : 'N/A'}</td>
          <td>
            <span class="badge bg-success">Available: ${inv.quantityAvailable || 0}</span>
            <span class="badge bg-warning ms-1">Reserved: ${inv.quantityReserved || 0}</span>
          </td>
          <td>
            <button class="btn btn-sm btn-warning" onclick="showEditInventoryModal(${productDetailId})" title="Update Stock">
              <i class="bi bi-pencil"></i> Update
            </button>
          </td>
        </tr>
      `;
    } else {
      // If we have serial numbers (future implementation)
      inventoryList.forEach((item, index) => {
        const serialNumber = item.serialNumber || item.SerialNumber || `SN-${index + 1}`;
        const createdAt = item.createdAt || item.CreatedAt || item.createdDate || 'N/A';
        html += `
          <tr class="table-row-hover">
            <td>${index + 1}</td>
            <td><strong>${escapeHtml(serialNumber)}</strong></td>
            <td>${typeof createdAt === 'string' ? createdAt : new Date(createdAt).toLocaleDateString()}</td>
            <td><span class="badge bg-success">Active</span></td>
            <td>
              <button class="btn btn-sm btn-danger" onclick="MerchantApp.deleteInventoryItem(${item.inventoryId || item.InventoryId || index}, ${productDetailId})" title="Delete">
                <i class="bi bi-trash"></i>
              </button>
            </td>
          </tr>
        `;
      });
    }

    $("#inventoryTableBody").html(html);
  }

  function updateInventorySummary(inventory) {
    if (!inventory || (Array.isArray(inventory) && inventory.length === 0)) {
      $("#inventoryTotalCount").text('0');
      $("#inventoryAvailableCount").text('0');
      $("#inventoryReservedCount").text('0');
      return;
    }

    const inv = Array.isArray(inventory) ? inventory[0] : inventory;
    const available = inv.quantityAvailable || inv.QuantityAvailable || 0;
    const reserved = inv.quantityReserved || inv.QuantityReserved || 0;
    const total = available + reserved;

    $("#inventoryTotalCount").text(total);
    $("#inventoryAvailableCount").text(available);
    $("#inventoryReservedCount").text(reserved);
  }

  // ==================== PRODUCT MODALS ====================
  function showAddProductModal() {
    const modalHtml = `
      <div class="modal fade" id="addProductModal" tabindex="-1">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title"><i class="bi bi-plus-circle me-2"></i>Add New Product</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <form id="addProductForm">
                <div class="row mb-3">
                  <div class="col-md-6">
                    <label for="newProductName" class="form-label">Product Name <span class="text-danger">*</span></label>
                    <input type="text" class="form-control" id="newProductName" required>
                  </div>
                  <div class="col-md-6">
                    <label for="newProductCategory" class="form-label">Category</label>
                    <input type="text" class="form-control" id="newProductCategory" placeholder="Optional">
                  </div>
                </div>
                <div class="mb-3">
                  <label for="newProductDescription" class="form-label">Description</label>
                  <textarea class="form-control" id="newProductDescription" rows="3" placeholder="Enter product description"></textarea>
                </div>
                <div class="mb-3">
                  <label for="newProductImageUrl" class="form-label">Image URL</label>
                  <input type="url" class="form-control" id="newProductImageUrl" placeholder="https://example.com/image.jpg">
                  <small class="text-muted">Or use the product wizard for image upload</small>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="button" class="btn btn-success" id="btnConfirmAddProduct">
                <i class="bi bi-check-circle me-2"></i>Add Product
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    $('#addProductModal').remove();
    $('body').append(modalHtml);
    const modal = new bootstrap.Modal(document.getElementById('addProductModal'));
    modal.show();

    $('#btnConfirmAddProduct').off('click').on('click', function () {
      const productName = $('#newProductName').val().trim();
      const description = $('#newProductDescription').val().trim();
      const imageUrl = $('#newProductImageUrl').val().trim();

      if (!productName) {
        showNotification('Product name is required', 'error');
        return;
      }

      // Use the existing product wizard or create via API
      // For now, redirect to wizard
      modal.hide();
      $("#dynamicContentContainer").hide();
      $("#productWizardContainer").show();
      $('#productName').val(productName);
      if (description) $('#description').val(description);
      if (imageUrl) {
        // Note: Image URL handling may need to be adapted
      }
    });

    $('#addProductModal').on('hidden.bs.modal', function () {
      $(this).remove();
    });
  }

  function showEditProductModal(product) {
    const productId = product.productId || product.ProductId;
    const modalHtml = `
      <div class="modal fade" id="editProductModal" tabindex="-1">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title"><i class="bi bi-pencil me-2"></i>Edit Product</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <form id="editProductForm">
                <div class="row mb-3">
                  <div class="col-md-6">
                    <label for="editProductName" class="form-label">Product Name <span class="text-danger">*</span></label>
                    <input type="text" class="form-control" id="editProductName" value="${escapeHtml(product.productName || product.ProductName || '')}" required>
                  </div>
                  <div class="col-md-6">
                    <label for="editProductCategory" class="form-label">Category</label>
                    <input type="text" class="form-control" id="editProductCategory" value="${escapeHtml(product.categoryName || product.CategoryName || '')}" placeholder="Optional">
                  </div>
                </div>
                <div class="mb-3">
                  <label for="editProductDescription" class="form-label">Description</label>
                  <textarea class="form-control" id="editProductDescription" rows="3">${escapeHtml(product.productDescription || product.ProductDescription || '')}</textarea>
                </div>
                <div class="mb-3">
                  <label for="editProductImageUrl" class="form-label">Image URL</label>
                  <input type="url" class="form-control" id="editProductImageUrl" value="${escapeHtml(product.imageUrl || product.ImageUrl || '')}" placeholder="https://example.com/image.jpg">
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="button" class="btn btn-primary" id="btnConfirmEditProduct">
                <i class="bi bi-check-circle me-2"></i>Update Product
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    $('#editProductModal').remove();
    $('body').append(modalHtml);
    const modal = new bootstrap.Modal(document.getElementById('editProductModal'));
    modal.show();

    $('#btnConfirmEditProduct').off('click').on('click', function () {
      const productName = $('#editProductName').val().trim();
      const description = $('#editProductDescription').val().trim();
      const imageUrl = $('#editProductImageUrl').val().trim();

      if (!productName) {
        showNotification('Product name is required', 'error');
        return;
      }

      // Create FormData for multipart/form-data (as backend expects [FromForm])
      const formData = new FormData();
      formData.append('ProductName', productName);
      if (description) formData.append('ProductDescription', description);
      if (imageUrl) formData.append('ImageUrl', imageUrl);

      $.ajax({
        url: API_ENDPOINTS.products.update(productId),
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${getAuthToken()}` },
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
          showNotification('Product updated successfully!', 'success');
          modal.hide();
          const authData = JSON.parse(localStorage.getItem('Auth') || sessionStorage.getItem('Auth') || '{}');
          const token = authData.jwt;
          let userId = null;
          if (token) {
            try {
              const payload = JSON.parse(atob(token.split('.')[1]));
              userId = payload.sub || payload.nameid;
            } catch (e) {
              console.error('Error parsing token:', e);
            }
          }
          if (userId) fetchProducts(userId);
        },
        error: function (xhr) {
          console.error('Error updating product:', xhr);
          let errorMsg = 'Error updating product';
          if (xhr.responseJSON && xhr.responseJSON.message) {
            errorMsg = xhr.responseJSON.message;
          }
          showNotification(errorMsg, 'error');
        }
      });
    });

    $('#editProductModal').on('hidden.bs.modal', function () {
      $(this).remove();
    });
  }

  // ==================== PRODUCT DETAIL MODALS ====================
  function showAddProductDetailModal(productId) {
    const modalHtml = `
      <div class="modal fade" id="addProductDetailModal" tabindex="-1">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title"><i class="bi bi-plus-circle me-2"></i>Add Product Variant</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <form id="addProductDetailForm">
                <div class="row mb-3">
                  <div class="col-md-6">
                    <label for="newDetailStorage" class="form-label">Storage</label>
                    <input type="text" class="form-control" id="newDetailStorage" placeholder="e.g., 128 GB">
                  </div>
                  <div class="col-md-6">
                    <label for="newDetailRAM" class="form-label">RAM</label>
                    <input type="text" class="form-control" id="newDetailRAM" placeholder="e.g., 8 GB">
                  </div>
                </div>
                <div class="row mb-3">
                  <div class="col-md-6">
                    <label for="newDetailProcessor" class="form-label">Processor</label>
                    <input type="text" class="form-control" id="newDetailProcessor" placeholder="e.g., Helio G99">
                  </div>
                  <div class="col-md-6">
                    <label for="newDetailMeasureUnit" class="form-label">Measure Unit <span class="text-danger">*</span></label>
                    <select class="form-select" id="newDetailMeasureUnit" required>
                      <option value="">Choose...</option>
                      <option value="piece">Piece</option>
                      <option value="box">Box</option>
                      <option value="pack">Pack</option>
                      <option value="kg">Kilogram (kg)</option>
                      <option value="g">Gram (g)</option>
                      <option value="l">Liter (L)</option>
                      <option value="ml">Milliliter (ml)</option>
                    </select>
                  </div>
                </div>
                <div class="row mb-3">
                  <div class="col-md-6">
                    <label for="newDetailPrice" class="form-label">Price <span class="text-danger">*</span></label>
                    <div class="input-group">
                      <span class="input-group-text">$</span>
                      <input type="number" class="form-control" id="newDetailPrice" step="0.01" min="0.01" required>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <label for="newDetailQuantity" class="form-label">Initial Quantity <span class="text-danger">*</span></label>
                    <input type="number" class="form-control" id="newDetailQuantity" min="0" value="0" required>
                  </div>
                </div>
                <div class="mb-3">
                  <label for="newDetailDescription" class="form-label">Description</label>
                  <textarea class="form-control" id="newDetailDescription" rows="2" placeholder="Optional variant description"></textarea>
                </div>
                
                <!-- Dynamic Attributes Section -->
                <div class="mb-3">
                  <div class="d-flex justify-content-between align-items-center mb-2">
                    <label class="form-label mb-0">Attributes</label>
                    <button type="button" class="btn btn-sm btn-outline-primary" id="btnAddAttributeRow">
                      <i class="bi bi-plus-circle me-1"></i>Add Attribute
                    </button>
                  </div>
                  <div id="attributesContainer">
                    <!-- Attribute rows will be added here -->
                  </div>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="button" class="btn btn-success" id="btnConfirmAddProductDetail">
                <i class="bi bi-check-circle me-2"></i>Add Variant
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    $('#addProductDetailModal').remove();
    $('body').append(modalHtml);
    const modal = new bootstrap.Modal(document.getElementById('addProductDetailModal'));
    modal.show();

    // Add attribute row functionality
    let attributeRowCount = 0;
    function addAttributeRow() {
      attributeRowCount++;
      const rowHtml = `
        <div class="row mb-2 attribute-row" data-row-id="${attributeRowCount}">
          <div class="col-md-5">
            <input type="text" class="form-control attribute-name" placeholder="Attribute name (e.g., Color)">
          </div>
          <div class="col-md-5">
            <input type="text" class="form-control attribute-value" placeholder="Attribute value (e.g., Blue)">
          </div>
          <div class="col-md-2">
            <button type="button" class="btn btn-sm btn-danger w-100 remove-attribute-row">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>
      `;
      $('#attributesContainer').append(rowHtml);
    }

    $(document).off('click', '#btnAddAttributeRow').on('click', '#btnAddAttributeRow', function () {
      addAttributeRow();
    });

    $(document).off('click', '.remove-attribute-row').on('click', '.remove-attribute-row', function () {
      $(this).closest('.attribute-row').remove();
    });

    $('#btnConfirmAddProductDetail').off('click').on('click', function () {
      const measureUnit = $('#newDetailMeasureUnit').val();
      const price = parseFloat($('#newDetailPrice').val());
      const quantity = parseInt($('#newDetailQuantity').val());

      if (!measureUnit || !price || price <= 0) {
        showNotification('Please fill in all required fields with valid values', 'error');
        return;
      }

      // Collect attributes
      const attributes = [];
      $('.attribute-row').each(function () {
        const name = $(this).find('.attribute-name').val().trim();
        const value = $(this).find('.attribute-value').val().trim();
        if (name && value) {
          // Note: Backend expects AttributeId and MeasureUnitId
          // For now, we'll send name/value pairs and adapt if needed
          attributes.push({ key: name, value: value });
        }
      });

      // Build request body
      const requestData = {
        productId: productId,
        serialNumber: `SN-${Date.now()}`, // Generate serial number
        price: price,
        description: $('#newDetailDescription').val().trim() || null,
        quantityAvailable: quantity,
        attributes: attributes.map(attr => ({
          attributeId: 0, // Will need to be resolved from attribute name
          measureUnitId: 0 // Will need to be resolved
        }))
      };

      $.ajax({
        url: API_ENDPOINTS.productDetails.create(),
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json'
        },
        data: JSON.stringify(requestData),
        success: function (response) {
          showNotification('Product variant added successfully!', 'success');
          modal.hide();
          fetchProductDetails(productId);
        },
        error: function (xhr) {
          console.error('Error adding product detail:', xhr);
          let errorMsg = 'Error adding variant';
          if (xhr.responseJSON && xhr.responseJSON.message) {
            errorMsg = xhr.responseJSON.message;
          }
          showNotification(errorMsg, 'error');
        }
      });
    });

    $('#addProductDetailModal').on('hidden.bs.modal', function () {
      $(this).remove();
    });
  }

  function editProductDetail(detailId) {
    $.ajax({
      url: API_ENDPOINTS.productDetails.getById(detailId),
      method: 'GET',
      headers: { 'Authorization': `Bearer ${getAuthToken()}` },
      success: function (detail) {
        showEditProductDetailModal(detail);
      },
      error: function (xhr) {
        console.error('Error fetching product detail:', xhr);
        showNotification('Error loading variant details', 'error');
      }
    });
  }

  function showEditProductDetailModal(detail) {
    // Similar to add modal but pre-filled
    showNotification('Edit variant functionality - Similar to add modal with pre-filled data', 'info');
    // Implementation similar to showAddProductDetailModal but with edit logic
  }

  function deleteProductDetail(detailId) {
    showConfirmModal(
      'Delete Variant',
      'Are you sure you want to delete this variant? This action cannot be undone.',
      function () {
        $.ajax({
          url: API_ENDPOINTS.productDetails.delete(detailId),
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${getAuthToken()}` },
          success: function (response) {
            showNotification('Variant deleted successfully!', 'success');
            if (navigationState.currentProductId) {
              fetchProductDetails(navigationState.currentProductId);
            }
          },
          error: function (xhr) {
            console.error('Error deleting product detail:', xhr);
            let errorMsg = 'Error deleting variant';
            if (xhr.responseJSON && xhr.responseJSON.message) {
              errorMsg = xhr.responseJSON.message;
            }
            showNotification(errorMsg, 'error');
          }
        });
      }
    );
  }

  // ==================== INVENTORY MODALS ====================
  function showAddInventoryModal(productDetailId) {
    const modalHtml = `
      <div class="modal fade" id="addInventoryModal" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title"><i class="bi bi-plus-circle me-2"></i>Add Inventory Item</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <form id="addInventoryForm">
                <div class="mb-3">
                  <label for="newInventorySerialNumber" class="form-label">Serial Number <span class="text-danger">*</span></label>
                  <input type="text" class="form-control" id="newInventorySerialNumber" placeholder="Enter serial number" required>
                  <small class="text-muted">Unique identifier for this inventory item</small>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="button" class="btn btn-success" id="btnConfirmAddInventory">
                <i class="bi bi-check-circle me-2"></i>Add Item
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    $('#addInventoryModal').remove();
    $('body').append(modalHtml);
    const modal = new bootstrap.Modal(document.getElementById('addInventoryModal'));
    modal.show();

    $('#btnConfirmAddInventory').off('click').on('click', function () {
      const serialNumber = $('#newInventorySerialNumber').val().trim();

      if (!serialNumber) {
        showNotification('Serial number is required', 'error');
        return;
      }

      // Note: Backend may not support adding individual serial numbers
      // This might need to update stock quantity instead
      // Adapt based on actual backend implementation
      $.ajax({
        url: API_ENDPOINTS.inventory.create(productDetailId),
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json'
        },
        data: JSON.stringify({ serialNumber: serialNumber }),
        success: function (response) {
          showNotification('Inventory item added successfully!', 'success');
          modal.hide();
          fetchInventory(productDetailId);
        },
        error: function (xhr) {
          console.error('Error adding inventory item:', xhr);
          let errorMsg = 'Error adding inventory item';
          if (xhr.responseJSON && xhr.responseJSON.message) {
            errorMsg = xhr.responseJSON.message;
          }
          showNotification(errorMsg, 'error');
        }
      });
    });

    $('#addInventoryModal').on('hidden.bs.modal', function () {
      $(this).remove();
    });
  }

  function showEditInventoryModal(productDetailId) {
    // Show modal to update stock quantity
    const modalHtml = `
      <div class="modal fade" id="editInventoryModal" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title"><i class="bi bi-pencil me-2"></i>Update Stock Quantity</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <form id="editInventoryForm">
                <div class="mb-3">
                  <label for="editInventoryQuantity" class="form-label">New Quantity <span class="text-danger">*</span></label>
                  <input type="number" class="form-control" id="editInventoryQuantity" min="0" required>
                  <small class="text-muted">Enter the new total quantity available</small>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="button" class="btn btn-primary" id="btnConfirmUpdateInventory">
                <i class="bi bi-check-circle me-2"></i>Update Stock
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    $('#editInventoryModal').remove();
    $('body').append(modalHtml);
    const modal = new bootstrap.Modal(document.getElementById('editInventoryModal'));
    modal.show();

    $('#btnConfirmUpdateInventory').off('click').on('click', function () {
      const newQuantity = parseInt($('#editInventoryQuantity').val());

      if (isNaN(newQuantity) || newQuantity < 0) {
        showNotification('Please enter a valid quantity (0 or greater)', 'error');
        return;
      }

      $.ajax({
        url: API_ENDPOINTS.inventory.updateStock(productDetailId),
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json'
        },
        data: JSON.stringify({ newQuantity: newQuantity }),
        success: function (response) {
          showNotification('Stock quantity updated successfully!', 'success');
          modal.hide();
          fetchInventory(productDetailId);
        },
        error: function (xhr) {
          console.error('Error updating inventory:', xhr);
          let errorMsg = 'Error updating stock';
          if (xhr.responseJSON && xhr.responseJSON.message) {
            errorMsg = xhr.responseJSON.message;
          }
          showNotification(errorMsg, 'error');
        }
      });
    });

    $('#editInventoryModal').on('hidden.bs.modal', function () {
      $(this).remove();
    });
  }

  function deleteInventoryItem(inventoryId, productDetailId) {
    showConfirmModal(
      'Delete Inventory Item',
      'Are you sure you want to delete this inventory item? This action cannot be undone.',
      function () {
        $.ajax({
          url: API_ENDPOINTS.inventory.delete(inventoryId),
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${getAuthToken()}` },
          success: function (response) {
            showNotification('Inventory item deleted successfully!', 'success');
            fetchInventory(productDetailId);
          },
          error: function (xhr) {
            console.error('Error deleting inventory item:', xhr);
            let errorMsg = 'Error deleting inventory item';
            if (xhr.responseJSON && xhr.responseJSON.message) {
              errorMsg = xhr.responseJSON.message;
            }
            showNotification(errorMsg, 'error');
          }
        });
      }
    );
  }

  // ==================== PRODUCTS SECTION ====================

  // Cache for subcategories
  let subcategoriesCache = null;

  function loadProductsList() {
    const html = `
      <div class="section-container">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h2 class="section-title"><i class="bi bi-box-seam me-2"></i>Products Management</h2>
          <button class="btn btn-primary" id="btnAddProduct">
            <i class="bi bi-plus-circle me-2"></i>Add Product
          </button>
        </div>
        <div class="card shadow-sm mb-3">
          <div class="card-body">
            <div class="row mb-3">
              <div class="col-md-6">
                <div class="input-group">
                  <span class="input-group-text"><i class="bi bi-search"></i></span>
                  <input type="text" class="form-control" id="productSearch" placeholder="Search products...">
                </div>
              </div>
              <div class="col-md-6 text-end">
                <span class="badge bg-primary" id="productCount">0 products</span>
              </div>
            </div>
          </div>
        </div>
        <div class="card shadow-sm">
          <div class="card-body p-0">
            <div class="table-responsive">
              <table class="table table-hover mb-0" id="productTable">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Type</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody id="productTableBody">
                  <tr><td colspan="6" class="text-center py-4"><div class="spinner-border text-primary"></div></td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="d-flex justify-content-between align-items-center mt-3">
          <div>
            <label class="me-2">Page:</label>
            <input type="number" id="productPageNumber" class="form-control d-inline-block" style="width: 80px;" value="1" min="1">
            <label class="ms-2 me-2">Page Size:</label>
            <select id="productPageSize" class="form-select d-inline-block" style="width: 100px;">
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>
          <div id="productPaginationInfo"></div>
        </div>
      </div>
    `;
    $("#dynamicContentContainer").show().html(html);
    fetchProducts();

    $(document).off('click', '#btnAddProduct').on('click', '#btnAddProduct', () => showProductModal());
    $(document).off('change', '#productPageNumber, #productPageSize').on('change', '#productPageNumber, #productPageSize', fetchProducts);
    $(document).off('input', '#productSearch').on('input', '#productSearch', function () {
      const query = $(this).val();
      if (query.trim()) {
        searchProducts(query);
      } else {
        fetchProducts();
      }
    });
  }

  function fetchProducts(page = 1, pageSize = 10) {
    page = parseInt($('#productPageNumber').val()) || page;
    pageSize = parseInt($('#productPageSize').val()) || pageSize;

    const userId = getUserIdFromToken();
    if (!userId) {
      $("#productTableBody").html('<tr><td colspan="6" class="text-center text-danger">User ID not found</td></tr>');
      return;
    }

    $.ajax({
      url: API_ENDPOINTS.products.getAll(userId, page, pageSize),
      method: 'GET',
      headers: { 'Authorization': `Bearer ${getAuthToken()}` },
      success: function (response) {
        const products = response.data || response.items || response || [];
        const totalCount = response.totalCount || response.total || products.length;
        const totalPages = response.totalPages || Math.ceil(totalCount / pageSize);
        renderProductsTable(products);
        $('#productPaginationInfo').text(`Page ${page} of ${totalPages} (Total: ${totalCount} products)`);
        $('#productCount').text(`${totalCount} product${totalCount !== 1 ? 's' : ''}`);
      },
      error: function (xhr) {
        console.error('Error fetching products:', xhr);
        $("#productTableBody").html('<tr><td colspan="6" class="text-center text-danger">Error loading products</td></tr>');
      }
    });
  }

  function renderProductsTable(products) {
    if (!products || products.length === 0) {
      $("#productTableBody").html('<tr><td colspan="6" class="text-center py-5"><i class="bi bi-inbox" style="font-size: 3rem; color: #ccc;"></i><p class="mt-3 text-muted">No products found</p></td></tr>');
      return;
    }

    let html = '';
    products.forEach(product => {
      const productId = product.productId || product.id;
      const imageUrl = product.imageUrl || product.productImageUrl || 'images/placeholder.png';
      html += `
        <tr>
          <td><strong>#${productId}</strong></td>
          <td><img src="${imageUrl}" width="50" height="50" class="img-thumbnail" onerror="this.src='images/placeholder.png'"></td>
          <td>${product.productName || product.name || 'N/A'}</td>
          <td>${(product.productDescription || product.description || 'N/A').substring(0, 50)}...</td>
          <td><span class="badge bg-info">${product.typeName || product.type || 'N/A'}</span></td>
          <td>
            <div class="btn-group" role="group">
              <button class="btn btn-sm btn-outline-success" onclick="MerchantApp.manageVariants(${productId}, '${(product.productName || product.name || '').replace(/'/g, "\\'")}'))" title="Manage Variants">
                <i class="bi bi-list-ul"></i>
              </button>
              <button class="btn btn-sm btn-outline-primary" onclick="MerchantApp.editProduct(${productId})" title="Edit">
                <i class="bi bi-pencil"></i>
              </button>
              <button class="btn btn-sm btn-outline-danger" onclick="MerchantApp.deleteProduct(${productId})" title="Delete">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    });
    $("#productTableBody").html(html);
  }

  function searchProducts(query) {
    const page = parseInt($('#productPageNumber').val()) || 1;
    const pageSize = parseInt($('#productPageSize').val()) || 10;

    $.ajax({
      url: API_ENDPOINTS.products.search(query, page, pageSize),
      method: 'GET',
      headers: { 'Authorization': `Bearer ${getAuthToken()}` },
      success: function (response) {
        const products = response.data || response.items || response || [];
        renderProductsTable(products);
      },
      error: function (xhr) {
        console.error('Error searching products:', xhr);
        $("#productTableBody").html('<tr><td colspan="6" class="text-center text-danger">Error searching products</td></tr>');
      }
    });
  }

  function showProductModal(productId = null) {
    const isEdit = productId !== null;
    const modalHtml = `
      <div class="modal fade" id="productModal" tabindex="-1">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">${isEdit ? 'Edit' : 'Add'} Product</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <form id="productForm">
                <input type="hidden" id="productId" value="${productId || ''}">
                <div class="mb-3">
                  <label class="form-label">Product Name <span class="text-danger">*</span></label>
                  <input type="text" class="form-control" id="productName" required>
                </div>
                <div class="mb-3">
                  <label class="form-label">Description</label>
                  <textarea class="form-control" id="productDescription" rows="3"></textarea>
                </div>
                <div class="mb-3">
                  <label class="form-label">Subcategory/Type <span class="text-danger">*</span></label>
                  <select class="form-select" id="productType" required>
                    <option value="">Loading subcategories...</option>
                  </select>
                </div>
                <div class="mb-3">
                  <label class="form-label">Product Images</label>
                  <input type="file" class="form-control" id="productImages" accept="image/*" multiple>
                  <small class="text-muted">Images will be uploaded to AWS S3</small>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="button" class="btn btn-primary" id="saveProductBtn">Save Product</button>
            </div>
          </div>
        </div>
      </div>
    `;

    $('body').append(modalHtml);
    const modal = new bootstrap.Modal(document.getElementById('productModal'));
    modal.show();

    fetchSubcategories();

    $('#productModal').on('hidden.bs.modal', function () {
      $(this).remove();
    });

    $('#saveProductBtn').on('click', saveProduct);

    if (isEdit) {
      $.ajax({
        url: API_ENDPOINTS.products.getById(productId),
        method: 'GET',
        headers: { 'Authorization': `Bearer ${getAuthToken()}` },
        success: function (product) {
          // CRITICAL FIX: Use scoped selectors to avoid duplicate IDs
          const $modal = $('#productModal');
          $modal.find('#productName').val(product.productName || product.name);
          $modal.find('#productDescription').val(product.productDescription || product.description);
          $modal.find('#productType').val(product.typeId || product.type?.id);
        },
        error: function (xhr) {
          console.error('Error loading product:', xhr);
          showNotification('Error loading product details', 'error');
        }
      });
    }
  }

  function saveProduct() {
    // CRITICAL FIX: Scope selectors to #productModal to avoid duplicate IDs from old wizard
    const $modal = $('#productModal');
    const productId = $modal.find('#productId').val();
    const productName = $modal.find('#productName').val();
    const productDescription = $modal.find('#productDescription').val();
    const typeId = $modal.find('#productType').val();
    const storeId = getStoreId();

    // Detailed validation with specific error messages
    if (!productName || productName.trim() === '') {
      showNotification('Product name is required', 'error');
      $modal.find('#productName').focus();
      return;
    }

    if (!typeId || typeId === '') {
      showNotification('Please select a subcategory/type', 'error');
      $modal.find('#productType').focus();
      return;
    }

    console.log('Saving product with:', { productName, typeId, storeId, productDescription });

    const formData = new FormData();
    formData.append('ProductName', productName);
    formData.append('ProductDescription', productDescription || '');
    formData.append('TypeId', typeId);
    formData.append('StoreId', storeId);

    const imageFiles = $modal.find('#productImages')[0].files;
    if (imageFiles.length > 0 && !productId) {
      for (let i = 0; i < imageFiles.length; i++) {
        formData.append('Images', imageFiles[i]);
      }
    }

    const method = productId ? 'PUT' : 'POST';
    const url = productId ? API_ENDPOINTS.products.update(productId) : API_ENDPOINTS.products.create();

    $.ajax({
      url: url,
      method: method,
      headers: { 'Authorization': `Bearer ${getAuthToken()}` },
      processData: false,
      contentType: false,
      data: formData,
      success: function (response) {
        showNotification(`Product ${productId ? 'updated' : 'created'} successfully!`, 'success');
        bootstrap.Modal.getInstance(document.getElementById('productModal')).hide();
        fetchProducts();

        if (!productId && imageFiles.length > 0 && response.productId) {
          uploadProductImages(response.productId, imageFiles);
        }
      },
      error: function (xhr) {
        console.error('Error saving product:', xhr);
        console.error('Response:', xhr.responseJSON);
        let errorMsg = 'Error saving product';
        if (xhr.responseJSON?.message) {
          errorMsg = xhr.responseJSON.message;
        } else if (xhr.responseJSON?.errors) {
          errorMsg = Object.values(xhr.responseJSON.errors).flat().join(', ');
        } else if (xhr.responseText) {
          errorMsg = xhr.responseText;
        }
        showNotification(errorMsg, 'error');
      }
    });
  }

  function deleteProduct(productId) {
    showConfirmModal(
      'Delete Product',
      'Are you sure you want to delete this product? This action cannot be undone.',
      function () {
        $.ajax({
          url: API_ENDPOINTS.products.delete(productId),
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${getAuthToken()}` },
          success: function () {
            showNotification('Product deleted successfully!', 'success');
            fetchProducts();
          },
          error: function (xhr) {
            console.error('Error deleting product:', xhr);
            showNotification('Error deleting product', 'error');
          }
        });
      }
    );
  }

  function uploadProductImages(productId, files) {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }

    $.ajax({
      url: `${API_BASE_URL}/merchant/products/${productId}/images`,
      method: 'POST',
      headers: { 'Authorization': `Bearer ${getAuthToken()}` },
      processData: false,
      contentType: false,
      data: formData,
      success: function (response) {
        console.log('Images uploaded successfully:', response);
        showNotification('Product images uploaded successfully!', 'success');
        fetchProducts();
      },
      error: function (xhr) {
        console.error('Error uploading images:', xhr);
        showNotification('Product created, but error uploading images', 'error');
      }
    });
  }

  function fetchSubcategories() {
    if (subcategoriesCache) {
      populateTypeDropdown(subcategoriesCache);
      return;
    }

    $.ajax({
      url: `${API_BASE_URL}/Category/subcategory`,
      method: 'GET',
      headers: { 'Authorization': `Bearer ${getAuthToken()}` },
      success: function (response) {
        const subcategories = response.data || response.items || response || [];
        subcategoriesCache = subcategories;
        populateTypeDropdown(subcategories);
      },
      error: function (xhr) {
        console.error('Error fetching subcategories:', xhr);
        // CRITICAL FIX: Scope to #productModal to avoid duplicate IDs
        $('#productModal').find('#productType').html('<option value="">Error loading subcategories</option>');
      }
    });
  }

  function populateTypeDropdown(subcategories) {
    let options = '<option value="">Select Subcategory/Type</option>';
    subcategories.forEach(sub => {
      const subId = sub.subCategoryId || sub.id;
      const subName = sub.subCategoryName || sub.name;
      options += `<option value="${subId}">${subName}</option>`;
    });
    // CRITICAL FIX: Scope to #productModal to avoid duplicate IDs
    $('#productModal').find('#productType').html(options);
  }


  // ==================== PRODUCT DETAILS/VARIANTS SECTION ====================

  function loadProductDetails(productId, productName) {
    navigationState.currentView = 'productDetails';
    navigationState.currentProductId = productId;
    navigationState.currentProductName = productName;

    const html = `
      <div class="section-container">
        <div class="mb-3">
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
              <li class="breadcrumb-item"><a href="#" onclick="MerchantApp.backToProducts(); return false;">Products</a></li>
              <li class="breadcrumb-item active">${productName} - Variants</li>
            </ol>
          </nav>
        </div>
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h2 class="section-title"><i class="bi bi-box me-2"></i>Product Variants - ${productName}</h2>
          <div>
            <button class="btn btn-secondary me-2" onclick="MerchantApp.backToProducts()">
              <i class="bi bi-arrow-left me-2"></i>Back to Products
            </button>
            <button class="btn btn-primary" id="btnAddVariant">
              <i class="bi bi-plus-circle me-2"></i>Add Variant
            </button>
          </div>
        </div>
        <div class="card shadow-sm">
          <div class="card-body p-0">
            <div class="table-responsive">
              <table class="table table-hover mb-0">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Storage</th>
                    <th>RAM</th>
                    <th>Processor</th>
                    <th>Measure Unit</th>
                    <th>Price</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody id="variantsTableBody">
                  <tr><td colspan="7" class="text-center py-4"><div class="spinner-border text-primary"></div></td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    `;

    $("#dynamicContentContainer").show().html(html);
    fetchProductDetails(productId);

    $(document).off('click', '#btnAddVariant').on('click', '#btnAddVariant', () => showVariantModal(null, productId));
  }

  function fetchProductDetails(productId) {
    $.ajax({
      url: `${API_BASE_URL}/merchant/products/${productId}/details`,
      method: 'GET',
      headers: { 'Authorization': `Bearer ${getAuthToken()}` },
      success: function (response) {
        const details = response.data || response.items || response || [];
        renderVariantsTable(details);
      },
      error: function (xhr) {
        console.error('Error fetching product details:', xhr);
        if (xhr.status === 404) {
          $("#variantsTableBody").html('<tr><td colspan="7" class="text-center py-4"><p class="text-muted">No variants found. Add your first variant!</p></td></tr>');
        } else {
          $("#variantsTableBody").html('<tr><td colspan="7" class="text-center text-danger">Error loading variants</td></tr>');
        }
      }
    });
  }

  function renderVariantsTable(details) {
    if (!details || details.length === 0) {
      $("#variantsTableBody").html('<tr><td colspan="7" class="text-center py-4"><p class="text-muted">No variants found. Add your first variant!</p></td></tr>');
      return;
    }

    let html = '';
    details.forEach(detail => {
      const detailId = detail.productDetailId || detail.id;
      html += `
        <tr>
          <td><strong>#${detailId}</strong></td>
          <td>${detail.storage || 'N/A'}</td>
          <td>${detail.ram || 'N/A'}</td>
          <td>${detail.processor || 'N/A'}</td>
          <td>${detail.measureUnit || 'N/A'}</td>
          <td><strong>$${parseFloat(detail.price || 0).toFixed(2)}</strong></td>
          <td>
            <div class="btn-group" role="group">
              <button class="btn btn-sm btn-outline-primary" onclick="MerchantApp.editVariant(${detailId}, ${navigationState.currentProductId})" title="Edit">
                <i class="bi bi-pencil"></i>
              </button>
              <button class="btn btn-sm btn-outline-danger" onclick="MerchantApp.deleteVariant(${detailId})" title="Delete">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    });
    $("#variantsTableBody").html(html);
  }

  function showVariantModal(detailId = null, productId = null) {
    const isEdit = detailId !== null;
    const targetProductId = productId || navigationState.currentProductId;

    const modalHtml = `
      <div class="modal fade" id="variantModal" tabindex="-1">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">${isEdit ? 'Edit' : 'Add'} Product Variant</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <form id="variantForm">
                <input type="hidden" id="variantId" value="${detailId || ''}">
                <input type="hidden" id="variantProductId" value="${targetProductId}">
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Storage</label>
                    <input type="text" class="form-control" id="variantStorage" placeholder="e.g., 128GB">
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="form-label">RAM</label>
                    <input type="text" class="form-control" id="variantRam" placeholder="e.g., 8GB">
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Processor</label>
                    <input type="text" class="form-control" id="variantProcessor" placeholder="e.g., A16 Bionic">
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Measure Unit</label>
                    <input type="text" class="form-control" id="variantMeasureUnit" placeholder="e.g., piece, kg">
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Price <span class="text-danger">*</span></label>
                    <div class="input-group">
                      <span class="input-group-text">$</span>
                      <input type="number" class="form-control" id="variantPrice" step="0.01" required>
                    </div>
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Stock Quantity</label>
                    <input type="number" class="form-control" id="variantStock" min="0" placeholder="0">
                  </div>
                </div>
                <div class="mb-3">
                  <label class="form-label">Additional Attributes (JSON)</label>
                  <textarea class="form-control" id="variantAttributes" rows="3" placeholder='{"color": "Black", "warranty": "1 year"}'></textarea>
                  <small class="text-muted">Optional: Enter additional attributes as JSON</small>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="button" class="btn btn-primary" id="saveVariantBtn">Save Variant</button>
            </div>
          </div>
        </div>
      </div>
    `;

    $('body').append(modalHtml);
    const modal = new bootstrap.Modal(document.getElementById('variantModal'));
    modal.show();

    $('#variantModal').on('hidden.bs.modal', function () {
      $(this).remove();
    });

    $('#saveVariantBtn').on('click', saveVariant);

    if (isEdit) {
      $.ajax({
        url: API_ENDPOINTS.productDetails.getById(detailId),
        method: 'GET',
        headers: { 'Authorization': `Bearer ${getAuthToken()}` },
        success: function (detail) {
          $('#variantStorage').val(detail.storage || '');
          $('#variantRam').val(detail.ram || '');
          $('#variantProcessor').val(detail.processor || '');
          $('#variantMeasureUnit').val(detail.measureUnit || '');
          $('#variantPrice').val(detail.price || '');
          $('#variantStock').val(detail.stockQuantity || '');
          if (detail.attributes && typeof detail.attributes === 'object') {
            $('#variantAttributes').val(JSON.stringify(detail.attributes, null, 2));
          }
        },
        error: function (xhr) {
          console.error('Error loading variant:', xhr);
          showNotification('Error loading variant details', 'error');
        }
      });
    }
  }

  function saveVariant() {
    const detailId = $('#variantId').val();
    const productId = $('#variantProductId').val();
    const price = $('#variantPrice').val();

    if (!price) {
      showNotification('Price is required', 'error');
      return;
    }

    let attributes = null;
    const attrsText = $('#variantAttributes').val();
    if (attrsText) {
      try {
        attributes = JSON.parse(attrsText);
      } catch (e) {
        showNotification('Invalid JSON in attributes field', 'error');
        return;
      }
    }

    const data = {
      productId: parseInt(productId),
      storage: $('#variantStorage').val() || null,
      ram: $('#variantRam').val() || null,
      processor: $('#variantProcessor').val() || null,
      measureUnit: $('#variantMeasureUnit').val() || null,
      price: parseFloat(price),
      stockQuantity: parseInt($('#variantStock').val()) || 0,
      attributes: attributes
    };

    if (detailId) {
      data.productDetailId = parseInt(detailId);
    }

    const method = detailId ? 'PUT' : 'POST';
    const url = detailId ? API_ENDPOINTS.productDetails.update() : API_ENDPOINTS.productDetails.create();

    $.ajax({
      url: url,
      method: method,
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json'
      },
      data: JSON.stringify(data),
      success: function (response) {
        showNotification(`Variant ${detailId ? 'updated' : 'created'} successfully!`, 'success');
        bootstrap.Modal.getInstance(document.getElementById('variantModal')).hide();
        fetchProductDetails(productId);
      },
      error: function (xhr) {
        console.error('Error saving variant:', xhr);
        let errorMsg = 'Error saving variant';
        if (xhr.responseJSON?.message) {
          errorMsg = xhr.responseJSON.message;
        }
        showNotification(errorMsg, 'error');
      }
    });
  }

  function deleteVariant(detailId) {
    showConfirmModal(
      'Delete Variant',
      'Are you sure you want to delete this product variant? This action cannot be undone.',
      function () {
        $.ajax({
          url: API_ENDPOINTS.productDetails.delete(detailId),
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${getAuthToken()}` },
          success: function () {
            showNotification('Variant deleted successfully!', 'success');
            fetchProductDetails(navigationState.currentProductId);
          },
          error: function (xhr) {
            console.error('Error deleting variant:', xhr);
            showNotification('Error deleting variant', 'error');
          }
        });
      }
    );
  }

  function backToProducts() {
    navigationState.currentView = 'products';
    navigationState.currentProductId = null;
    navigationState.currentProductName = null;
    loadProductsList();
  }

  function getUserIdFromToken() {
    try {
      const authData = JSON.parse(localStorage.getItem('Auth') || sessionStorage.getItem('Auth') || '{}');
      const token = authData.jwt;
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.sub || payload.nameid || payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
      }
    } catch (e) {
      console.error('Error getting user ID:', e);
    }
    return null;
  }

  function getStoreId() {
    try {
      const authData = JSON.parse(localStorage.getItem('Auth') || sessionStorage.getItem('Auth') || '{}');
      return authData.storeId || 1;
    } catch (e) {
      return 1;
    }
  }

  // ==================== ORDERS & INVENTORY PLACEHOLDERS ====================

  function loadOrders() {
    $("#dynamicContentContainer").show().html('<div class="section-container"><h2>Orders</h2><p>Coming soon...</p></div>');
  }

  function loadInventory() {
    $("#dynamicContentContainer").show().html('<div class="section-container"><h2>Inventory</h2><p>Coming soon...</p></div>');
  }

  return {
    init: initializeMerchantApp,
    showSection,
    checkAttribute,
    checkMeasure,
    editProduct: (id) => showProductModal(id),
    deleteProduct: deleteProduct,
    manageVariants: (id, name) => loadProductDetails(id, name),
    backToProducts: backToProducts,
    editVariant: (detailId, productId) => showVariantModal(detailId, productId),
    deleteVariant: deleteVariant
  };
})();

// Initialize immediately when script loads to prevent other scripts from redirecting
(function () {
  // Run initialization as soon as possible
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      if (MerchantApp?.init) {
        console.log('MerchantApp: Initializing on DOMContentLoaded');
        MerchantApp.init();
      }
    });
  } else {
    // DOM is already loaded, initialize immediately
    if (MerchantApp?.init) {
      console.log('MerchantApp: Initializing immediately (DOM already loaded)');
      MerchantApp.init();
    }
  }
})();

// ==================== LIGHTWEIGHT API WIRING FOR NEW FORMS ====================
(() => {
  const API_ROOT = 'https://cartify.runasp.net/api';
  const ENDPOINTS = {
    products: `${API_ROOT}/Product`,
    productDetails: `${API_ROOT}/ProductDetails`,
    attributes: `${API_ROOT}/Attributes`,
    measureUnits: `${API_ROOT}/MeasureUnits`,
    subCategories: `${API_ROOT}/SubCategory`
  };

  const statusElId = 'apiStatus';

  const readAuthToken = () => {
    try {
      const auth = JSON.parse(localStorage.getItem('Auth') || sessionStorage.getItem('Auth') || '{}');
      return auth.jwt || auth.token || null;
    } catch (err) {
      console.warn('Unable to read auth token', err);
      return null;
    }
  };

  const buildHeaders = (headers = {}) => {
    const token = readAuthToken();
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...headers
    };
  };

  const fetchJson = async (url, options = {}) => {
    const response = await fetch(url, { ...options, headers: buildHeaders(options.headers || {}) });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `Request failed (${response.status})`);
    }
    if (response.status === 204) return null;
    return response.json();
  };

  // ---- API surface required by the brief ----
  const ApiService = {
    getProducts: () => fetchJson(ENDPOINTS.products),
    addProduct: (productData) => fetchJson(ENDPOINTS.products, {
      method: 'POST',
      body: JSON.stringify(productData)
    }),
    getProductDetails: (productId) => fetchJson(`${ENDPOINTS.productDetails}/${productId}`),
    addProductDetails: (detailsData) => fetchJson(ENDPOINTS.productDetails, {
      method: 'POST',
      body: JSON.stringify(detailsData)
    }),
    getAttributes: () => fetchJson(ENDPOINTS.attributes),
    getMeasureUnits: () => fetchJson(ENDPOINTS.measureUnits),
    getSubCategories: () => fetchJson(ENDPOINTS.subCategories)
  };

  const setStatus = (message, type = 'info') => {
    const el = document.getElementById(statusElId);
    if (!el) return;
    el.textContent = message;
    el.className = `status-message status-${type}`;
  };

  const safeNumber = (value) => {
    const parsed = parseFloat(value);
    return Number.isFinite(parsed) ? parsed : null;
  };

  const toOptions = (select, items, valueKey, labelKey) => {
    if (!select) return;
    select.innerHTML = '';
    const frag = document.createDocumentFragment();
    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = 'Select an option';
    placeholder.disabled = true;
    placeholder.selected = true;
    frag.appendChild(placeholder);
    (items || []).forEach((item) => {
      const opt = document.createElement('option');
      opt.value = item[valueKey];
      opt.textContent = item[labelKey];
      frag.appendChild(opt);
    });
    select.appendChild(frag);
  };

  const toMultiOptions = (select, items, valueKey, labelKey) => {
    if (!select) return;
    select.innerHTML = '';
    (items || []).forEach((item) => {
      const opt = document.createElement('option');
      opt.value = item[valueKey];
      opt.textContent = item[labelKey];
      select.appendChild(opt);
    });
  };

  const renderProductsList = (products = []) => {
    const list = document.getElementById('productList');
    const select = document.getElementById('detailProductId');
    if (!list || !select) return;

    list.innerHTML = '';
    select.innerHTML = '<option value="">Select a product</option>';

    if (!products.length) {
      list.innerHTML = '<li class="list-group-item">No products found.</li>';
      return;
    }

    const fragList = document.createDocumentFragment();
    const fragSelect = document.createDocumentFragment();

    products.forEach((p) => {
      const id = p.productId || p.id || p.productID || p.productid;
      const name = p.productName || p.name || p.title || `Product ${id ?? ''}`;
      const price = p.price ?? p.productPrice ?? null;

      const li = document.createElement('li');
      li.className = 'list-group-item';
      li.textContent = `${name}`;
      if (price !== null) {
        const priceEl = document.createElement('small');
        priceEl.textContent = `Price: ${price}`;
        li.appendChild(priceEl);
      }
      fragList.appendChild(li);

      if (id !== undefined && id !== null && id !== '') {
        const opt = document.createElement('option');
        opt.value = id;
        opt.textContent = name;
        fragSelect.appendChild(opt);
      }
    });

    list.appendChild(fragList);
    select.appendChild(fragSelect);
  };

  const loadFormData = async () => {
    try {
      setStatus('Loading reference data...', 'info');
      const [subCategories, attributes, measureUnits, products] = await Promise.all([
        ApiService.getSubCategories(),
        ApiService.getAttributes(),
        ApiService.getMeasureUnits(),
        ApiService.getProducts()
      ]);

      toOptions(
        document.getElementById('productSubcategory'),
        subCategories || [],
        'subCategoryId',
        'subCategoryName'
      );

      toMultiOptions(
        document.getElementById('detailAttributes'),
        attributes || [],
        'attributeId',
        'attributeName'
      );

      toMultiOptions(
        document.getElementById('detailMeasureUnits'),
        measureUnits || [],
        'measureUnitId',
        'measureUnitName'
      );

      renderProductsList(products || []);
      setStatus('Reference data loaded. Ready to add products.', 'success');
    } catch (error) {
      console.error('Error loading form data:', error);
      setStatus(error.message || 'Unable to load form data', 'error');
    }
  };

  const getSelectedValues = (select) => {
    if (!select) return [];
    return Array.from(select.selectedOptions)
      .map((opt) => opt.value)
      .filter(Boolean)
      .map((v) => (isNaN(v) ? v : Number(v)));
  };

  const handleProductSubmit = async (event) => {
    event.preventDefault();
    const name = document.getElementById('productName')?.value?.trim();
    const price = safeNumber(document.getElementById('productPrice')?.value);
    const subCategoryId = document.getElementById('productSubcategory')?.value;

    if (!name || price === null || !subCategoryId) {
      setStatus('Name, price, and subcategory are required.', 'error');
      return;
    }

    const payload = {
      productName: name,
      price,
      subCategoryId: isNaN(subCategoryId) ? subCategoryId : Number(subCategoryId)
    };

    try {
      setStatus('Adding product...', 'info');
      await ApiService.addProduct(payload);
      setStatus('Product added successfully.', 'success');
      (event.target)?.reset();
      await loadFormData();
    } catch (error) {
      console.error('Add product error:', error);
      setStatus(error.message || 'Failed to add product', 'error');
    }
  };

  const handleProductDetailsSubmit = async (event) => {
    event.preventDefault();
    const productId = document.getElementById('detailProductId')?.value;
    const attributeIds = getSelectedValues(document.getElementById('detailAttributes'));
    const measureUnitIds = getSelectedValues(document.getElementById('detailMeasureUnits'));
    const detailPrice = safeNumber(document.getElementById('detailPrice')?.value);
    const detailQuantity = safeNumber(document.getElementById('detailQuantity')?.value);

    if (!productId) {
      setStatus('Please select a product before adding details.', 'error');
      return;
    }

    if (!attributeIds.length || !measureUnitIds.length) {
      setStatus('Choose at least one attribute and one measure unit.', 'error');
      return;
    }

    const payload = {
      productId: isNaN(productId) ? productId : Number(productId),
      attributeIds,
      measureUnitIds
    };

    if (detailPrice !== null) payload.price = detailPrice;
    if (detailQuantity !== null) payload.quantity = detailQuantity;

    try {
      setStatus('Adding product details...', 'info');
      await ApiService.addProductDetails(payload);
      setStatus('Product details added successfully.', 'success');
      (event.target)?.reset();
      await loadFormData();
    } catch (error) {
      console.error('Add product details error:', error);
      setStatus(error.message || 'Failed to add product details', 'error');
    }
  };

  const bindFormEvents = () => {
    const productForm = document.getElementById('productForm');
    const detailsForm = document.getElementById('productDetailsForm');
    if (!productForm || !detailsForm) return;

    productForm.addEventListener('submit', handleProductSubmit);
    detailsForm.addEventListener('submit', handleProductDetailsSubmit);
    loadFormData();
  };

  document.addEventListener('DOMContentLoaded', bindFormEvents);
})();