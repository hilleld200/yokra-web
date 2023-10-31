import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-analytics.js";
import { doc, getFirestore, collection, addDoc, getDocs, getDoc, deleteDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-storage.js";
let products_list = [];
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
const input_search = document.querySelector("#query");
const myDate = new Date();
let is_sale_on = false;

getData();

//set the master div
master_div_element.id = "master_div";
master_div_element.className = "products";

//functions **********************************************************************************************************************************

// set the dialog functions

const dialog = document.querySelector("dialog");
document.getElementById("search_button").addEventListener("click", function () {
    dialog.showModal();
})
document.getElementById("search_by_name").addEventListener("click", function () {
    filter_by = "name";
    dialog.close();
})
document.getElementById("search_by_type").addEventListener("click", function () {
    filter_by = "type";
    dialog.close();
})
document.getElementById("search_by_mkt").addEventListener("click", function () {
    filter_by = "mkt";
    dialog.close();
})
//login button 
document.getElementById("login-button").addEventListener("click", function () {
    const input_password = document.querySelector(".password").value;
    const real_password = getDocs(collection(db, "users"))
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                if (doc.data().password == input_password) {
                    localStorage.setItem('admin_access', "true");
                    document.getElementById("add_img").style.visibility = "visible";
                    alert("login successful");
                } else {
                    alert("wrong password");
                    document.getElementById("add_img").style.visibility = "hidden";
                    localStorage.setItem('admin_access', "false");
                }
            })
        })
})
dialog.addEventListener("click", e => {
    const dialogDimensions = dialog.getBoundingClientRect()
    if (
        e.clientX < dialogDimensions.left ||
        e.clientX > dialogDimensions.right ||
        e.clientY < dialogDimensions.top ||
        e.clientY > dialogDimensions.bottom
    ) {
        dialog.close()
    }
})
//search bar
input_search.addEventListener('input', function (event) {
    const typedLetter = document.getElementById("query").value;
    const filteredProducts = products_list.filter((product) => {
        if (filter_by == "name") {
            if (product.name.includes(typedLetter)) {
                document.getElementById("product " + product.id).style.display = "block";
            } else {
                document.getElementById("product " + product.id).style.display = "none";
            }
        }
        if (filter_by == "type") {
            if (product.type.includes(typedLetter)) {
                document.getElementById("product " + product.id).style.display = "block";
            } else {
                document.getElementById("product " + product.id).style.display = "none";
            }
        }
        if (filter_by == "mkt") {
            if (product.mkt.includes(typedLetter)) {
                document.getElementById("product " + product.id).style.display = "block";
            } else {
                document.getElementById("product " + product.id).style.display = "none";
            }
        }

    })
});

// main herf
if (window.location.pathname.includes('index.html')) {
    document.getElementById("main-herf").addEventListener("click", function (event) {
        products_list.forEach((product) => {
            document.getElementById("product " + product.id).style.display = "block";
        })
        event.preventDefault();
    })
}

//spicel sale function
document.getElementById("sale-href").addEventListener("click", function (event) {
    if (window.location.pathname.includes('index.html')) {
        event.preventDefault();
    } else {
        window.location.href = "index.html";
        event.preventDefault();
    }


    products_list.filter((product) => {
        if (product.is_on_sale) {
            if (product.is_on_sale.toDate() > myDate) {
                document.getElementById("product " + product.id).style.display = "block";
                return
            }
        }
        document.getElementById("product " + product.id).style.display = "none";
    })
})



function getData() {

    let i = 0;
    getDocs(collection(db, "products"))
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const corerct_product = {
                    id: i,
                    type: doc.data().type,
                    name: doc.data().name,
                    price: doc.data().price,
                    uri: doc.data().uri,
                    specialNotes: doc.data().specialNotes,
                    secondSpecialNotes: doc.data().secondSpecialNotes,
                    is_in_stock: doc.data().is_in_stock,
                    mkt: doc.data().mkt,
                    is_on_sale: doc.data().is_on_sale,
                    specialSale: doc.data().specialSale
                };
                i++;

                // that code is for adding a new field to the database
                // updateDoc(doc.ref, {
                //   mkt: ""
                // })

                products_list.push(corerct_product);
                show_data(corerct_product);
            })
        })

    document.body.appendChild(master_div_element);

}
// show the data from the getData function
function show_data(data) {
    //create the elements
    const div_element = document.createElement("div");
    const sale_element = document.createElement("h1");
    const name_element = document.createElement("a");
    const line_break = document.createElement("hr");
    const type_and_price_element = document.createElement("p");
    const secondSpecialNotes_element = document.createElement("p");
    const img_div_element = document.createElement("div");
    const image_element = document.createElement("img");
    const out_of_stock_element = document.createElement("img");
    const mkt_element = document.createElement("p");
    // sale element
    if (data.is_on_sale) {
        if (data.is_on_sale.toDate() > myDate) {
            sale_element.innerHTML = data.specialSale;
            sale_element.style.color = "red";
        }
    }

    //name element
    name_element.innerHTML = data.name;
    name_element.addEventListener("click", function (event) {
        if (localStorage.getItem('admin_access') == "true") {
            localStorage.setItem('selected_product', data.name);
            window.location.href = "products-edit.html";
        } else {
            alert("you dont have the permission to edit this product");
            event.preventDefault();
        }
    })
    //type & price element
    type_and_price_element.innerHTML = data.type + " | " + data.price + "₪";
    type_and_price_element.style.direction = "rtl";
    //secondSpecialNotes element
    secondSpecialNotes_element.innerHTML = data.secondSpecialNotes;
    secondSpecialNotes_element.style.textAlign = "right";
    //image element
    getDownloadURL(ref(storage, data.uri)).then((url) => {
        image_element.src = url;
        //in stock element
        if (!data.is_in_stock) {
            out_of_stock_element.src = "data:image/png;base64,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"
            out_of_stock_element.style.position = "absolute";
            out_of_stock_element.style.opacity = "0.27";
            out_of_stock_element.style.loading = "lazy";
        }
    })
    image_element.loading = "lazy";
    //img div element
    img_div_element.style.display = "flex";
    img_div_element.style.position = "relative";
    img_div_element.appendChild(image_element);
    img_div_element.appendChild(out_of_stock_element);
    //mkt element
    mkt_element.textAlign = "center";
    mkt_element.innerHTML = data.mkt;
    //div element
    div_element.className = "card";
    div_element.id = "product " + data.id;
    //append the elements
    div_element.appendChild(sale_element);
    div_element.appendChild(name_element);
    div_element.appendChild(type_and_price_element);
    div_element.appendChild(secondSpecialNotes_element);
    div_element.appendChild(line_break);
    // div_element.appendChild(image_element);
    // div_element.appendChild(out_of_stock_element);
    div_element.appendChild(img_div_element);
    div_element.appendChild(mkt_element);
    master_div_element.appendChild(div_element);
}

export { products_list };