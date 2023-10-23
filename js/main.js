import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-analytics.js";
import { doc, getFirestore, collection, addDoc, getDocs, getDoc, deleteDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-storage.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC_05cP9iqq6dZ1wB78_r7-XYFrTO7guhM",
  authDomain: "yokraproject-470b9.firebaseapp.com",
  projectId: "yokraproject-470b9",
  storageBucket: "yokraproject-470b9.appspot.com",
  messagingSenderId: "868266877329",
  appId: "1:868266877329:web:ab972b5684b001dc177a30",
  measurementId: "G-FW1ZGF06M6",
  storageBucket: "gs://yokraproject-470b9.appspot.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

//initialize the variables
const master_div_element = document.createElement("div");
let filter_by = "name";
const products_list = [];
const input_search = document.querySelector("#query");

//add button function
document.getElementById("add_img").addEventListener("click", function () {
  if (localStorage.getItem('admin_access') == "true") {
    localStorage.setItem('selected_product', "null");
    window.location.href = "products-edit.html";
  } else {
    alert("you dont have the permission to add products");
  }
})
