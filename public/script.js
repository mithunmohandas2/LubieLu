const { options } = require("nodemon/lib/config");

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

// Preview Images
document.addEventListener('DOMContentLoaded', function () {
  const imageInput = document.getElementById('imageInput');
  const imagePreviewContainer = document.getElementById('imagePreviewContainer');

  imageInput.addEventListener('change', function (event) {
    imagePreviewContainer.innerHTML = ''; // Clear previous previews

    const files = event.target.files;
    for (const file of files) {
      const img = document.createElement('img');
      img.src = URL.createObjectURL(file);
      img.className = 'preview-image';
      imagePreviewContainer.appendChild(img);
    }
  });
});


// changing static path to load product image
var imgElement = document.getElementById('prd_img');
var currentSrc = imgElement.getAttribute('src');
var newSrc = currentSrc.replace('public', '');
imgElement.setAttribute('src', newSrc);


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
 
  console.log(subCategoryList)

  document.getElementById("subCat").innerHTML= ""
  for (let i=0; i<subCategoryList.length;i++){
    let option = document.createElement("option");
    option.value = subCategoryList[i]._id;
    option.text = subCategoryList[i].subCategoryName;
    console.log(subCategoryList[i]._id+"Understand")
    document.getElementById("subCat").appendChild(option);
  }
}


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
 
  console.log(subCategoryList)

  document.getElementById("subCat").innerHTML= ""
  for (let i=0; i<subCategoryList.length;i++){
    let option = document.createElement("option");
    option.value = subCategoryList[i]._id;
    option.text = subCategoryList[i].subCategoryName;
    console.log(subCategoryList[i]._id+"Understand")
    document.getElementById("subCat").appendChild(option);
  }
}