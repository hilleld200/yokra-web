// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-analytics.js";
import { getFirestore, collection, addDoc, getDocs, getDoc, doc, setDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";
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
let start_data;
let new_data;
let isImgSelected = false;
let isUploaded = true;
let file;

const nameInput = document.getElementById("name-input");
const priceInput = document.getElementById("price-input");
const notesInput = document.getElementById("notes-input");
const secondNotesInput = document.getElementById("secondNotes-input");
const typeInput = document.getElementById("type-input");
const imageInput = document.getElementById("image-input");
const imagePreview = document.getElementById("image-preview");
const saveButton = document.getElementById("save-button");
const deleteButton = document.getElementById("delete-button");
const is_in_stock = document.getElementById("is_in_stock");
const mkt = document.getElementById("mkt-input");
const dateInput = document.getElementById("date-input");
const saleInput = document.getElementById("sale-input");
const data_div = document.getElementById("data-div");
const sale_div = document.getElementById("sale-div");

//functions
imageInput.addEventListener("change", function () {
    isImgSelected = true;
    imagePreview.src = URL.createObjectURL(imageInput.files[0]);
    file = imageInput.files[0];
})

saveButton.addEventListener("click", function () {
    let the_date;
    if (dateInput.value == "") {
        the_date = null;
    } else {
        the_date = new Date(dateInput.value);
    }
    new_data = {
        name: nameInput.value,
        price: priceInput.value,
        specialNotes: notesInput.value,
        secondSpecialNotes: secondNotesInput.value,
        type: typeInput.value,
        uri: start_data.uri,
        is_in_stock: is_in_stock.checked,
        mkt: mkt.value,
        is_on_sale: the_date,
        specialSale: saleInput.value
    }
    new_data.name = new_data.name.trim();
    new_data.name = new_data.name.replace("/", "^");
    updateData();
})

deleteButton.addEventListener("click", function () {
    deleteData();
})

function updateData() {
    if (nameInput.value == "") {
        alert("enter product name");
        return;
    }
    if (isImgSelected) {
        isUploaded = false;
        new_data.uri = file.name;
        uploadImage();
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

function uploadImage() {
    const storageRef = ref(storage, new_data.uri);

    // Create a unique name for the image file
    const imageName = new_data.uri;

    // Upload the file to Firebase Storage
    const uploadTask = uploadBytesResumable(storageRef, file);
    // Monitor the upload progress
    uploadTask.on("state_changed",
        (error) => {
            logger.error(error);
            alert("Error uploading image: " + error + "\n please report this error to the developer");
        },
        () => {
            // Upload completed successfully, now we can get the download URL
            if (isUploaded) {
                window.location.href = "index.html";
            } else {
                isUploaded = true;
            }
        }
    );
    if (!start_data.uri == "icon.jpg") {
        deleteObject(ref(storage, start_data.uri));
    }
}

function setTheView() {
    nameInput.value = start_data.name.replace("^", "/");
    priceInput.value = start_data.price;
    notesInput.value = start_data.specialNotes;
    secondNotesInput.value = start_data.secondSpecialNotes;
    typeInput.value = start_data.type;
    is_in_stock.checked = start_data.is_in_stock;
    mkt.value = start_data.mkt;
    dateInput.valueAsDate = start_data.is_on_sale;
    saleInput.value = start_data.specialSale;
    console.log(start_data);
    if (start_data.uri != null) {
        getDownloadURL(ref(storage, start_data.uri)).then((url) => {
            imagePreview.src = url;
        })
    } else {
        getDownloadURL(ref(storage, "icon.png")).then((url) => {
            imagePreview.src = url;
        })
    }
}

function deleteData() {
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
const saleButton = document.getElementById("sale-button");
saleButton.addEventListener("click", function () {
    if (data_div.style.display == "none") {
        data_div.style.display = "block"
        sale_div.style.display = "none"
    }
    else {
        data_div.style.display = "none"
        sale_div.style.display = "block"
    }
})

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
        specialSale: docSnap.data().specialSale
    }
    if (!start_data.is_on_sale) {
        start_data.is_on_sale = null
    } else {
        start_data.is_on_sale = start_data.is_on_sale.toDate()
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
        specialSale: null
    }
    setTheView();
}
