import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { doc, getFirestore, collection, addDoc, getDocs, getDoc, deleteDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-storage.js";
import { products_list } from "public.js";
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
const folders_list = [];
const master_div_element = document.createElement("div")
const master_data_div = document.getElementById("master_div")
get_data()

//master div element
master_div_element.id = "master_folder_div";
document.body.appendChild(master_div_element)

//functions **********************************************************************************************************************************
function get_data() {
  console.log("get data");
  getDocs(collection(db, "folder"))
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const folder = {
          name: doc.data().name
        }
        console.log(folder);
        show_data(folder);
        folders_list.push(folder);
      })
    })
}


function show_data(data) {
  //create the elements
  const div_element = document.createElement("div");
  const name_element = document.createElement("a");
  const line_break = document.createElement("hr");
  //name element
  name_element.innerHTML = data.name;
  name_element.addEventListener("click", function (event) {
    const typedLetter = data.name;
    products_list.filter((product) => {
      if (product.type.includes(typedLetter)) {
        document.getElementById("product " + product.id).style.display = "block";
      } else {
        document.getElementById("product " + product.id).style.display = "none";
      }
    })
    master_div_element.style.display = "none";
    master_data_div.style.display = "block";
  })
  //div element
  div_element.className = "card";
  //append the elements
  div_element.appendChild(name_element);
  div_element.appendChild(line_break);
  master_div_element.appendChild(div_element);
}
