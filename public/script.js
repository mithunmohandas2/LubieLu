// ======== PRICE CALCULATION (add product)================
function calculate() {
  const basePrice = document.getElementById("basePrice").value;
  const gst = document.getElementById("gst").value;
  const discount = document.getElementById("discount").value;
  let result = (basePrice * (1 + (gst / 100))) - (basePrice * discount / 100)
  document.getElementById("sellingPrice").value = result.toFixed(2)
}
// ========Manage category==========

function categoryFill() {
  const fill = document.getElementById("category").value
  document.getElementById("editCategory").value = fill
  document.getElementById("originalCategory").value = fill
  document.getElementById("deleteCategory").value = fill
  document.getElementById("addCategory").value = fill
}

function categoryUpdate() {
  const fill = document.getElementById("addCategory").value
  document.getElementById("editCategory").value = fill
  document.getElementById("deleteCategory").value = fill
}

// ==========Manage sub category===============

function rootCategoryFill() {
  const fillroot = document.getElementById("rootCategory").value
  document.getElementById("rootCategoryId1").value = fillroot
  document.getElementById("rootCategoryId2").value = fillroot
  document.getElementById("rootCategoryId3").value = fillroot
}
function SubCategoryFill() {
  const fill = document.getElementById("subCategory").value
  document.getElementById("field").value = fill
  document.getElementById("originalSubCategory1").value = fill
  document.getElementById("editSubCategory").value = fill
  document.getElementById("deleteSubCategory").value = fill
}

function SubCategoryUpdate() {
  const fill = document.getElementById("field").value
  document.getElementById("editSubCategory").value = fill
  document.getElementById("deleteSubCategory").value = fill
}


// Sub-Category name populate in add/edit product form
async function loadSubCategory(id) {
  const subCategoryList = await fetch('/admin/loadSubCat', {
    method: 'post',
    headers: {
      "Content-Type": 'application/json'
    },
    body: JSON.stringify({ catID: id })
  })
    .then((value) => { return value.json() })
    .catch((err) => {
      console.log(err.message)
    })

  document.getElementById("subCat").innerHTML = ""
  for (let i = 0; i < subCategoryList.length; i++) {
    let option = document.createElement("option");
    option.value = subCategoryList[i]._id;
    option.text = subCategoryList[i].subCategoryName;
    document.getElementById("subCat").appendChild(option);
  }
}


// Sub-Category name populate in manage category form
async function loadSubCat(id) {
  const subCategoryList = await fetch('/admin/loadSubCat', {
    method: 'post',
    headers: {
      "Content-Type": 'application/json'
    },
    body: JSON.stringify({ catID: id })
  })
    .then((value) => { return value.json() })
    .catch((err) => {
      console.log(err.message)
    })

  // console.log(subCategoryList)

  document.getElementById("subCategory").innerHTML = ""
  for (let i = 0; i < subCategoryList.length; i++) {
    let option = document.createElement("option");
    option.value = subCategoryList[i].subCategoryName;
    option.text = subCategoryList[i].subCategoryName;
    document.getElementById("subCategory").appendChild(option);
  }
}

function qtyUpdate() {
  const fill = document.getElementById("qty").value
  document.getElementById("qtyCart").value = fill
  document.getElementById("qtyWishlist").value = fill
  // document.getElementById("qtyCheckout").value = fill 
}

function emailOTPUpdate() {
  const fill = document.getElementById("emailForOTP").value
  document.getElementById("emailOTPFill").value = fill
}

//image zoom
function productImageChange(i) {
  const primary = document.getElementById("prd_img_0").src;
  const fill = document.getElementsByClassName("product_img")[i].src;
  document.getElementsByClassName("product_img")[i].src = primary
  document.getElementById("prd_img_0").src = fill;
}

// --------------------------------
//cart qty change
async function qtyIncrease(i, stock) {
  const preQty = document.getElementsByClassName("cartQty")[i].innerHTML
  if (preQty < stock) {
    // updating in Mongo DB
    const productID = document.getElementsByName("product_id")[i].value;

    const qtyUpdate = await fetch('/qtyChange', {
      method: 'post',
      headers: {
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({
        product_id: productID,
        isAdd: true,
      })
    })
      .then(() => {
        //DOM Manipulate 
        const preCartRate = document.getElementsByClassName("cartRate")[i].innerHTML
        document.getElementsByClassName("cartQty")[i].innerHTML = +document.getElementsByClassName("cartQty")[i].innerHTML + 1;
        const qty = document.getElementsByClassName("cartQty")[i].innerHTML
        document.getElementsByClassName("cartRate")[i].innerHTML = document.getElementsByClassName("rate")[i].innerHTML * qty
        const total = +document.getElementById("totalValue").innerHTML
        document.getElementById("totalValue").innerHTML = (1 * total) + (document.getElementsByClassName("cartRate")[i].innerHTML * 1) - (1 * preCartRate);

      })
      .catch((err) => {
        console.log(err.message)
        throw Error
      })
  }
}

async function qtyDecrease(i) {
  const preQty = document.getElementsByClassName("cartQty")[i].innerHTML
  if (preQty > 1) {
    // updating in Mongo DB
    const productID = document.getElementsByName("product_id")[i].value;
    const qtyUpdate = await fetch('/qtyChange', {
      method: 'post',
      headers: {
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({
        product_id: productID,
        isAdd: false,
      })
    })
      .then(() => {
        //DOM Manipulate 
        const rate = document.getElementsByClassName("rate")[i].innerHTML
        document.getElementsByClassName("cartQty")[i].innerHTML = +preQty - 1;
        const qty = document.getElementsByClassName("cartQty")[i].innerHTML
        document.getElementsByClassName("cartRate")[i].innerHTML = document.getElementsByClassName("rate")[i].innerHTML * qty
        const total = +document.getElementById("totalValue").innerHTML
        document.getElementById("totalValue").innerHTML = (1 * total) - (1 * rate)
      })
      .catch((err) => {
        console.log(err.message)
        throw Error
      })
  }
}

// ------------------------------
// select Address

function selectAddress(i) {
  document.getElementById("addressID").value = document.getElementsByClassName("savedAddressID")[i].value
  document.getElementById("addressName").value = document.getElementsByClassName("savedAddressName")[i].innerHTML
  document.getElementById("phone").value = document.getElementsByClassName("savedPhone")[i].innerHTML
  document.getElementById("address1").value = document.getElementsByClassName("savedAddress1")[i].innerHTML
  document.getElementById("address2").value = document.getElementsByClassName("savedAddress2")[i].innerHTML
  document.getElementById("district").value = document.getElementsByClassName("savedDistrict")[i].innerHTML
  document.getElementById("state").value = document.getElementsByClassName("savedState")[i].innerHTML
  document.getElementById("pincode").value = document.getElementsByClassName("savedPincode")[i].innerHTML
}

// -----------------

// to select only one payment option 
const onlinePayCheckbox = document.getElementById('onlinepay');
const codCheckbox = document.getElementById('COD');

onlinePayCheckbox.addEventListener('change', function () {
  codCheckbox.checked = !this.checked;
});
codCheckbox.addEventListener('change', function () {
  onlinePayCheckbox.checked = !this.checked;
});

// ----------------------------

// Order status update
async function orderStatusChange(i) {
  const status = document.getElementsByClassName("orderStatus")[i].value;
  const orderID = document.getElementsByClassName("orderID")[i].innerHTML
  const update = await fetch('/admin/orderstatus', {
    method: 'post',
    headers: {
      "Content-Type": 'application/json'
    },
    body: JSON.stringify({
      status: status,
      orderID: orderID
    })
  })
    .then(() => {
      window.alert("Status updated")
    })
    .catch(() => {
      window.alert("Unable to update status now")
    })
}
// -------------------------------


// alerts
function popUpAlert(message) {
  window.alert(message)
}

// ========= Delete Product Image =================
async function deleteImage(imageIndex, productID) {
  const confirmed = window.confirm("Are you sure you want to delete the image?");
  if (confirmed) {
    // console.log(imageIndex +","+ productID);
    const response = await fetch("/admin/deleteFile", {
      method: "POST",
      headers: {
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({
        index: imageIndex,
        product_id: productID,
      })
    })
      .then(() => {
        window.alert("Image Deleted")
      })
      .then(() => {
        const imageContainer = document.querySelectorAll('.col-6')[imageIndex];
        const image = imageContainer.querySelector('img');
        // Decrease image transparency by 50%
        image.style.opacity = 0.5;
        
        const deleteButton = imageContainer.querySelector('.btn');
        // Remove the delete button
        deleteButton.remove();
      })

      .catch((error) => {
        window.alert("Unable to delete image")
        console.error(error);
      })
  }
}
// -------------------------

