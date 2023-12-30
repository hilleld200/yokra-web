// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getFirestore, addDoc, collection, updateDoc, getDocs, getDoc, doc, setDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-storage.js";

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

//Initialize the variables
const myDate = new Date();
let newsList = [];
let start_data;
let new_data;
let isImgSelected = false;
let isUploaded = false;
let isNewsUpdeted = false;
let file;

const secondNotesInput = document.getElementById("secondNotes-input");
const newsButton = document.getElementsByClassName("fa-newspaper")[0];
const addNews = document.getElementsByClassName("add-news")[0];
const imagePreview = document.getElementById("image-preview");
const deleteButton = document.getElementById("delete-button");
const deleteImage = document.getElementById("delete-image");
const is_in_stock = document.getElementById("is_in_stock");
const priceInput = document.getElementById("price-input");
const notesInput = document.getElementById("notes-input");
const imageInput = document.getElementById("image-input");
const saveButton = document.getElementById("save-button");
const saleButton = document.getElementById("sale-button");
const nameInput = document.getElementById("name-input");
const typeInput = document.getElementById("type-input");
const dateInput = document.getElementById("date-input");
const saleInput = document.getElementById("sale-input");
const data_div = document.getElementById("data-div");
const sale_div = document.getElementById("sale-div");
const newsDiv = document.getElementById("news-div");
const mkt = document.getElementById("mkt-input");
const dialog = document.querySelector("dialog");
const star = document.getElementById("star");

get_news_data();

//functions******************************************************************************
/**/
// image input
imageInput.addEventListener("change", function () {
    isImgSelected = true;
    imagePreview.src = URL.createObjectURL(imageInput.files[0]);
    file = imageInput.files[0];
})

// save button
saveButton.addEventListener("click", function () {
    let the_date;
    if (dateInput.value == "") {
        the_date = null;
    } else {
        the_date = new Date(dateInput.value);
    }
    new_data = {
        name: nameInput.value.trim(),
        price: priceInput.value.trim(),
        specialNotes: notesInput.value.trim(),
        secondSpecialNotes: secondNotesInput.value.trim(),
        type: typeInput.value.trim(),
        uri: start_data.uri,
        is_in_stock: is_in_stock.checked,
        mkt: mkt.value.trim(),
        is_on_sale: the_date,
        specialSale: saleInput.value.trim(),
        isNew: start_data.isNew
    }
    new_data.name = new_data.name.trim();
    new_data.name = new_data.name.replaceAll("/", "^");
    if (isNewsUpdeted) {
        updateNews();
    }
    updateData();
})

// update data
function updateData() {
    if (nameInput.value == "") {
        alert("enter product name");
        return;
    }
    saveButton.style.display = "none";
    if (isImgSelected) {
        isUploaded = false;
        new_data.uri = file.name;
        uploadImage();
    } else {
        isUploaded = true;
    }
    if (new_data.name != start_data.name && start_data.name != null) {
        deleteData();
    }
    setDoc(doc(db, "products", new_data.name), new_data).then(() => {
        if (isUploaded) {
            window.location.href = "index.html";
        } else {
            isUploaded = true;
        }
    }).catch((error) => {
        console.error("Error adding document: ", error);
    });

}

// delete button
deleteButton.addEventListener("click", function () {
    deleteData();
})

// delete image
deleteImage.addEventListener("click", function (event) 
{
    event.preventDefault();
    start_data.uri = "icon.jpg";
    imagePreview.src = "./imgs/icon.jpg";
    isImgSelected = false;
})

//short IsNew click
star.addEventListener("click", function (event) 
{
    event.preventDefault();
    star.style.color = "green";
    myDate.setDate(myDate.getDate() + 7);
    start_data.isNew.date = myDate;
    start_data.isNew.text = "חדש באתר";
})

/* start of long IsNew click*/
let timeoutId;

function startLongClick(event) {
  timeoutId = setTimeout(() => {
    dialog.showModal();
  }, 1000); // Adjust the duration as needed
}

function endLongClick(event) {
  clearTimeout(timeoutId);
}
star.addEventListener('touchstart', startLongClick);
star.addEventListener('touchend', endLongClick);
star.addEventListener('mousedown', startLongClick);
star.addEventListener('mouseup', endLongClick);
/* end of long IsNew click */

// dialog logic
document.getElementById("dialog-save").addEventListener("click", function () {
    start_data.isNew = {
        date: new Date(document.getElementById("dialog-date-input").value),
        text: document.getElementById("dialog-text-input").value
    }
    dialog.close();
})

// update news
function updateNews() {
    getDocs(collection(db, "news")).then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            if (document.getElementById(doc.id)) {
                updateDoc(doc.ref, {
                    text: document.getElementById(doc.id).querySelector("input").value
                })
            } else {
                deleteDoc(doc.ref)
            }

        })
    })
}

// upload image
function uploadImage() {

    const storageRef = ref(storage, new_data.uri);

    if (start_data.uri != "icon.jpg") {
        deleteObject(ref(storage, start_data.uri));
    }
    
    // Upload the file to Firebase Storage
    uploadBytesResumable(storageRef, file).then((snapshot) => {
        if (isUploaded) {
            console.log("uploaded");
            window.location.href = "index.html";
        } else {
            isUploaded = true;
        }
    });


}

// set the views
function setTheView() {
    nameInput.value = start_data.name
    if (start_data.name && start_data.name.includes("^")) {
        nameInput.value = start_data.name.replaceAll("^", "/");
    }
    priceInput.value = start_data.price;
    notesInput.value = start_data.specialNotes;
    secondNotesInput.value = start_data.secondSpecialNotes;
    typeInput.value = start_data.type;
    is_in_stock.checked = start_data.is_in_stock;
    mkt.value = start_data.mkt;
    dateInput.valueAsDate = start_data.is_on_sale;
    saleInput.value = start_data.specialSale;
    console.log(start_data);
    if (start_data.uri != null || start_data.uri != "icon.png") {
        getDownloadURL(ref(storage, start_data.uri)).then((url) => {
            imagePreview.src = url;
        })
    } else {
        imagePreview.src = "./imgs/icon.jpg";
    }
}

// delete data
function deleteData(d) {
    if (d) {
        document.getElementById(d).style.backgroundColor = "pink";
        deleteDoc(doc(db, "news", d)).then(() => {
            document.getElementById(d).remove();
            newsList = newsList.filter((item) => item.id !== d);
            return;

        }).catch((error) => {
            console.error("Error removing document: ", error);
            alert("Error removing document: " + error);
            document.getElementById(d).style.backgroundColor = "white";
            return;

        });
        return;
    }
    if (start_data.name == null) {
        alert("no product to delete");
        return;
    }
    if (start_data.name == null) {
        alert("no product to delete");
        return;
    }
    deleteDoc(doc(db, "products", start_data.name)).then(() => {
        window.location.href = "index.html";
    }).catch((error) => {
        console.error("Error removing document: ", error);
    });
}

// sale-button
saleButton.addEventListener("click", function () {
    newsDiv.style.display = "none"
    addNews.style.display = "none"
    newsButton.style.display = "block"
    if (data_div.style.display == "none") {
        data_div.style.display = "flex"
        sale_div.style.display = "none"
    }
    else {
        data_div.style.display = "none"
        sale_div.style.display = "flex"
    }
})

// add news button
addNews.addEventListener("click", async function () {
    const docRef = await addDoc(collection(db, "news"), {
        text: null
    })
    const news = {
        text: null,
        id: docRef.id
    }
    set_news(news)
    newsList.push(news)

})

// news-button
newsButton.addEventListener("click", function () {
    data_div.style.display = "none"
    sale_div.style.display = "none"
    newsButton.style.display = "none"
    addNews.style.display = "block"
    newsDiv.style.display = "flex"
    isNewsUpdeted = true;
})

// get the news
async function get_news_data() {
    const querySnapshot = await getDocs(collection(db, "news"));
    querySnapshot.forEach((doc) => {
        const news = {
            id: doc.id,
            text: doc.data().text
        }
        set_news(news);
        newsList.push(news);
    });

}

function set_news(data) {
    const labelElement = document.createElement("label");
    const inputElement = document.createElement("input");
    const iElement = document.createElement("i");

    // input element
    inputElement.value = data.text;
    labelElement.appendChild(inputElement);

    // i elemnet
    iElement.classList.add("fa-solid", "fa-trash");
    iElement.style.fontSize = "16px"
    iElement.addEventListener("click", function () {
        deleteData(data.id)
    })
    labelElement.appendChild(iElement);

    // label element
    labelElement.setAttribute("id", data.id);
    labelElement.classList.add("label");
    newsDiv.appendChild(labelElement);

}

//get the start_data
if (localStorage.getItem('selected_product') != "null") {
    const docRef = doc(db, "products", localStorage.getItem('selected_product'));
    const docSnap = await getDoc(docRef);
    start_data = {
        name: docSnap.data().name,
        price: docSnap.data().price,
        specialNotes: docSnap.data().specialNotes,
        secondSpecialNotes: docSnap.data().secondSpecialNotes,
        type: docSnap.data().type,
        uri: docSnap.data().uri,
        is_in_stock: docSnap.data().is_in_stock,
        mkt: docSnap.data().mkt,
        is_on_sale: docSnap.data().is_on_sale,
        specialSale: docSnap.data().specialSale,
        isNew : docSnap.data().isNew
    }
    if (!start_data.is_on_sale) {
        start_data.is_on_sale = null
    } else {
        start_data.is_on_sale = new Date(start_data.is_on_sale)
        console.log(start_data.is_on_sale)
    }
    setTheView();
} else {
    start_data = {
        name: null,
        price: null,
        specialNotes: null,
        secondSpecialNotes: null,
        type: null,
        uri: "icon.jpg",
        is_in_stock: true,
        mkt: null,
        is_on_sale: null,
        specialSale: null,
        isNew : {
            date: new Date(),
            text: ""
        }
    }
    setTheView();
}
