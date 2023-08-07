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
  const fill= document.getElementById("field").value
  document.getElementById("editSubCategory").value = fill
  document.getElementById("deleteSubCategory").value = fill
}