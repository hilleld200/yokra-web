import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getFirestore, deleteDoc, updateDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
import { getStorage, ref, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-storage.js";
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
const starList = [];
let products_list = [];
let full_products_list = [];
const news_list = [];
let filter_by = "name";
const myDate = new Date();
const starButton = document.querySelector(".star");
const input_search = document.querySelector("#query");
const newsList = document.getElementById("news-list");
const master_div_element = document.createElement("div");
const master_data_div = document.getElementById("grid-continer");
const hamburgerButton = document.querySelector(".hamburger-menu").querySelector("input");

// obsarver
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("card-show");
        } else {
            entry.target.classList.remove("card-show");
        }
    })
}, {
    threshold: 0.2
})


function addNewsItem(news) {
    const li = document.createElement("li");
    li.classList.add("news-item");
    li.textContent = news;
    newsList.appendChild(li);

    // Adjust the width of the ticker container based on the total width of news items
    const totalWidth = getTotalWidth();
    newsList.style.width = totalWidth + "px";
}

function getTotalWidth() {
    let totalWidth = 0;
    const newsItems = document.querySelectorAll(".news-item");
    newsItems.forEach((item) => {
        totalWidth += item.offsetWidth + parseInt(getComputedStyle(item).marginRight);
    });
    return totalWidth;
}

getData();
get_folder_data();
get_news_data();

//set the master div
master_div_element.id = "master_div";
master_div_element.className = "products";

//functions********************************************************************************************************

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

// add product
document.getElementById("add_img").addEventListener("click", function () {
    if (localStorage.getItem('admin_access') == "true") {
        localStorage.setItem('selected_product', "null");
        window.location.href = "products-edit.html";
    } else {
        alert("you dont have the permission to add products");
    }
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

// star button
starButton.addEventListener("click", function () {
    products_list.forEach(product => {
        document.getElementById("product " + product.id).style.display = "none";
    })
    starList.forEach(star => {
        document.getElementById("product " + star).style.display = "block";
    })

})

const expendList = document.querySelectorAll(".i-expend");
expendList.forEach(expend => {
    expend.addEventListener("click", function () {
        expend.parentElement.classList.toggle("expend");
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
input_search.addEventListener('input', function () {
    const typedLetter = document.getElementById("query").value;
    if (typedLetter == "") {
        console.log("empty");
        input_search.parentElement.classList.remove("expend");
    } else {
        if (!input_search.parentElement.classList.contains("expend")) {
            input_search.parentElement.classList.add("expend");
        }
    }
    products_list.filter((product) => {
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


function reg_herf() {
    hamburgerButton.checked = false;
    // Set the products_list variable to the full_products_list
    products_list = full_products_list;

    // make the back button invisible
    document.querySelector(".back").style.display = "none";

    // Hide the master_data_div element
    master_data_div.style.display = "none";

    // Display the master_div_element as a flex container
    master_div_element.style.display = "flex";
}

// main herf
document.getElementById("main-herf").addEventListener("click", function () {
    reg_herf();
    products_list = full_products_list
    products_list.forEach((product) => {
        document.getElementById("product " + product.id).style.display = "block";
    })
})

//spicel sale function
document.getElementById("sale-href").addEventListener("click", function () {
    const tempList = [];
    reg_herf();
    products_list.filter((product) => {
        if (product.is_on_sale) {
            if (product.is_on_sale.toDate() > myDate) {
                document.getElementById("product " + product.id).style.display = "block";
                tempList.push(product);
                return
            }
        }
        document.getElementById("product " + product.id).style.display = "none";
    })
    products_list = tempList
})

//type herf
document.getElementById("types-href").addEventListener("click", function () {
    hamburgerButton.checked = false;

    // Set the products_list variable to the full_products_list
    products_list = full_products_list;

    // make the back button invisible
    document.querySelector(".back").style.display = "none";

    master_div_element.style.display = "none";
    master_data_div.style.display = "grid";
})

async function getData() {
    const querySnapshot = await getDocs(collection(db, "products"));
    let i = 0
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
            specialSale: doc.data().specialSale,
            isNew: doc.data().isNew
        };
        if(corerct_product.isNew.date.toDate() > new Date()){
                starList.push(corerct_product.id);
        }

        // that code is for adding a new field to the database
        // updateDoc(doc.ref, {
        //     isNew: {
        //         date: new Date(),
        //         text: "new"
        //     }
        // })



        products_list.push(corerct_product);
        show_data(corerct_product);
        i++
    });

    full_products_list = products_list;
    document.body.appendChild(master_div_element);
}
function get_news_data() {
    getDocs(collection(db, "news")).then((querySnapshot) => {
        querySnapshot.forEach((doc,) => {
            const news = doc.data().text
            news_list.push(news);
            addNewsItem(news)
        })
    })
}

// show the data from the getData function
function show_data(data) {
    //create the elements
    const div_element = document.createElement("div");
    const sale_element = document.createElement("h1");
    const iElement = document.createElement("i");
    const name_element = document.createElement("a");
    const line_break = document.createElement("hr");
    const type_and_price_element = document.createElement("p");
    const secondSpecialNotes_element = document.createElement("p");
    const img_div_element = document.createElement("div");
    const image_element = document.createElement("img");
    const out_of_stock_element = document.createElement("img");
    const mkt_element = document.createElement("p");
    const dropDownElement = document.createElement("select");
    // sale element
    if (data.is_on_sale) {
        if (data.is_on_sale.toDate() > myDate) {
            sale_element.innerHTML = data.specialSale;
            sale_element.style.color = "red";
        }
    }

    // i element
    // iElement.classList.add("fa-solid", "fa-star");
    iElement.innerHTML = data.isNew.text;
    iElement.classList.add("new");
    iElement.style.fontSize = "16px"
    iElement.style.color = "gold";
    if (starList.includes(data.id)) {
        img_div_element.appendChild(iElement);
    }

    //name element
    name_element.innerHTML = data.name.replaceAll("^", "/");
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
    if (data.price.includes("&")) {
        const temp = data.price.split("&");
        temp.forEach((element) => {
            const op = document.createElement("option");
            op.value = element;
            op.innerHTML = element;
            dropDownElement.appendChild(op);
        })
        type_and_price_element.innerHTML = data.type + " | ";
        type_and_price_element.appendChild(dropDownElement);

    } else {
        type_and_price_element.innerHTML = data.type + " | " + data.price + "₪";
    }

    type_and_price_element.style.direction = "rtl";
    //secondSpecialNotes element
    secondSpecialNotes_element.innerHTML = data.secondSpecialNotes;
    secondSpecialNotes_element.style.textAlign = "right";
    //image element
    if (data.uri == "icon.jpg") {
        image_element.src = "./imgs/icon.jpg";
    } else {
        getDownloadURL(ref(storage, data.uri)).then((url) => {
            image_element.src = url;
        })
    }
    //in stock element
    if (!data.is_in_stock) {
        out_of_stock_element.src = "./imgs/soldOut.png"
        out_of_stock_element.style.position = "absolute";
        out_of_stock_element.style.opacity = "0.27";
        out_of_stock_element.style.loading = "lazy";
    }

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
    observer.observe(div_element);
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

function get_folder_data() {
    getDocs(collection(db, "folder"))
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const folder = {
                    name: doc.data().name,
                }
                show_folder_data(folder);
            })
        })
}


function show_folder_data(data) {
    //create the elements
    const div_element = document.createElement("div");
    const name_element = document.createElement("a");
    //name element
    name_element.innerHTML = data.name;
    name_element.addEventListener("click", function (event) {
        const temp_list = [];
        document.querySelector(".back").style.visibility = "visible";
        document.querySelector(".back").style.display = "block";
        const typedLetter = data.name;
        products_list.filter((product) => {
            if (product.type.includes(typedLetter)) {
                document.getElementById("product " + product.id).style.display = "block";
                temp_list.push(product);
            } else {
                document.getElementById("product " + product.id).style.display = "none";
            }
        })
        products_list = temp_list;
        master_data_div.style.display = "none";
        master_div_element.style.display = "flex";
        event.preventDefault();
    })
    //div element
    div_element.className = "folder-card";
    div_element.style.maxWidth = "unset";
    //append the elements
    div_element.appendChild(name_element);
    master_data_div.appendChild(div_element);
}
//set the back button
document.querySelector(".back").addEventListener("click", function () {
    document.querySelector(".back").style.visibility = "hidden";
    products_list = full_products_list;
    master_div_element.style.display = "none";
    master_data_div.style.display = "grid";
})