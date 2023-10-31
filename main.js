document.getElementById("add_img").addEventListener("click", function () {
  if (localStorage.getItem('admin_access') == "true") {
    localStorage.setItem('selected_product', "null");
    window.location.href = "products-edit.html";
  } else {
    alert("you dont have the permission to add products");
  }
})
