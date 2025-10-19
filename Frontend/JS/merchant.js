$(document).ready(function () {

  // -------------------- [Initial Content Load] --------------------
  $("#dynamicContentContainer").html("<p>Home</p>");

  // -------------------- [Navigation Handling] --------------------
  $(".nav-link").click(function (e) {
    e.preventDefault();

    // Reset active class
    $(".nav-link").removeClass("active");
    $(this).addClass("active");

    let target = $(this).data("target");

    // -------------------- [Target Based Rendering] --------------------
    switch (target) {
      case "Home":
      case "Orders":
      case "Customers":
      case "Analytics":
        $("#dynamicContentContainer")
          .show()
          .html(`<p>${target}</p>`);
        $("#productWizardContainer").hide();
        break;

      case "Products":
        $("#dynamicContentContainer").hide();
        $("#productWizardContainer").show();
        break;
    }
  });

  // -------------------- [File Input Plugin Initialization] --------------------
  $("#input-pd").fileinput({
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

  // -------------------- [Product Wizard Navigation] --------------------
  function goToStep(hideStep, showStep, widthFrom = "50%", widthTo = "100%") {
    $(hideStep).hide();
    $(showStep)
      .show()
      .css({ width: widthFrom, opacity: 0 })
      .animate({ width: widthTo, opacity: 1 }, 400);
  }

  $("#nextStep1").click((e) => { e.preventDefault(); goToStep("#productStep1", "#productStep2"); });
  $("#nextStep2").click((e) => { e.preventDefault(); goToStep("#productStep2", "#productStep3"); });
  $("#prevStep1").click((e) => { e.preventDefault(); goToStep("#productStep2", "#productStep1", "100%", "50%"); });
  $("#prevStep2").click((e) => { e.preventDefault(); goToStep("#productStep3", "#productStep2"); });

  // -------------------- [Product Categories and Attributes Data] --------------------
  let data = {
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
  };

  // -------------------- [Category Change Handler] --------------------
  $("#category").change(function () {
    let subs = data[$(this).val()] || [];
    let $sub = $("#type");

    // Clear "type" dropdown
    $sub.empty().append('<option value="" selected disabled hidden>Choose Type</option>');

    // Clear attributes row
    $("#attributesRow").empty();

    // Populate "type" dropdown
    $.each(subs, (i, v) => {
      $sub.append(`<option value="${i}">${v.name}</option>`);
    });
  });

  // -------------------- [Type Change Handler - Generate Attributes Form] --------------------
  $("#type").change(function () {
    let selectedType = $(this).val();
    let subs = data[$("#category").val()][selectedType]?.attributes || [];
    let $container = $("#attributesRow");

    $container.empty(); // clear previous attributes

    // Add attributes in rows of 3 inputs each
    for (let i = 0; i < subs.length; i += 3) {
      let row = $('<div class="row mb-3"></div>');

      function makeCol(attr) {
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
        } else {
          return `
            <div class="col">
              <label class="form-label">${attr.name}</label>
              <input type="text" class="form-control" name="${attr.name}" placeholder="${attr.name}" />
            </div>
          `;
        }
      }

      row.append(makeCol(subs[i]));
      row.append(makeCol(subs[i + 1]));
      row.append(makeCol(subs[i + 2]));
      $container.append(row);
    }
  });
// -------------------- [Logout Handler] --------------------
$("#logoutBtn").click(function (e) {
  e.preventDefault();

  // امسح التوكن من التخزين المحلي
  localStorage.removeItem("Auth");
  sessionStorage.removeItem("Auth");

  // // لو حابب كمان تمسح بيانات المستخدم
  // localStorage.removeItem("userData");
  // sessionStorage.removeItem("userData");

  // بعد كده redirect لصفحة اللوجين
  window.location.href = "login.html";
});


});