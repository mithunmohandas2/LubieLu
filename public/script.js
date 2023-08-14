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
async function loadSubCategory(id){
  const subCategoryList = await fetch('/admin/loadSubCat',{
  method :'post',
  headers : {
    "Content-Type" : 'application/json'
  },
  body : JSON.stringify({catID: id})
  })
  .then((value) =>{ return value.json()} )
  .catch((err) =>{
    console.log(err.message)
  })
 
  document.getElementById("subCat").innerHTML= ""
  for (let i=0; i<subCategoryList.length;i++){
    let option = document.createElement("option");
    option.value = subCategoryList[i]._id;
    option.text = subCategoryList[i].subCategoryName;
    document.getElementById("subCat").appendChild(option);
  }
}


// Sub-Category name populate in manage category form
async function loadSubCat(id){
  const subCategoryList = await fetch('/admin/loadSubCat',{
  method :'post',
  headers : {
    "Content-Type" : 'application/json'
  },
  body : JSON.stringify({catID: id})
  })
  .then((value) =>{ return value.json()} )
  .catch((err) =>{
    console.log(err.message)
  })
 
  // console.log(subCategoryList)

  document.getElementById("subCategory").innerHTML= ""
  for (let i=0; i<subCategoryList.length;i++){
    let option = document.createElement("option");
    option.value = subCategoryList[i].subCategoryName;
    option.text = subCategoryList[i].subCategoryName;
    document.getElementById("subCategory").appendChild(option);
  }
}

function qtyUpdate() {
  const fill = document.getElementById("qty").value
  document.getElementById("qtyCheckout").value = fill
}