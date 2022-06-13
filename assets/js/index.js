// text fields

var inputProductName = document.getElementById('inputProductName1');
var inputProductQuantity = document.getElementById('inputProductQuantity1');
var inputProductPrice = document.getElementById('inputProductPrice1');
var inputProductDescription = document.getElementById('inputProductDescription1');

// buttons
var addBtn = document.getElementById('addBtn');
var clearBtn = document.getElementById('clearBtn');

clearBtn.onclick = clearForm;
addBtn.onclick = function(){
    if(!updateFlag) addProduct();
    else           updateItem();
    displayProducts();
    clearForm();
}

// custom variables

var productInputs = document.getElementsByClassName('productInputs')
var productsTable = document.getElementById('products');
var products;
var updateIndex = 0;
var updateFlag = false;

window.onload = function(){
    if(localStorage.getItem("products") != null){
        products = JSON.parse(localStorage.getItem("products"));
        displayProducts();
    } else {
        products = [];
    }
}

function clearForm(){
    for(let i = 0 ; i < productInputs.length ; i++) {
        productInputs[i].value = "";
    }
    addBtn.innerHTML = "Add Product";
    updateFlag = false;
}

function fillForm(index){
    let product = products[index];

    inputProductName.value = product.name;
    inputProductQuantity.value = product.quantity;
    inputProductPrice.value = product.price;
    inputProductDescription.value = product.description;

    addBtn.innerHTML = "Update Product";
    updateFlag = true;
    updateIndex = index;
}

function displayProducts(){
    var holder="";
    for(let i = 0 ; i < products.length ; i++){
        holder += ` <tr>
            <td>${i}</td>
            <td>${products[i].name}</td>
            <td>${products[i].quantity}</td>
            <td>${products[i].price}</td>
            <td>${products[i].description}</td>
            <td><button type="button" onclick="deleteProduct(${i})" class="btn btn-danger">Delete</button></td>
            <td><button type="button" onclick="fillForm(${i})" class="btn btn-secondary">Update</button></td>
        </tr>`
    }
    productsTable.innerHTML = holder;
}

function updateLocalStorage(){
    localStorage.setItem("products", JSON.stringify(products));
}

function addProduct(){
    var product = {
        name: inputProductName.value,
        quantity: inputProductQuantity.value,
        price:    inputProductPrice.value,
        description: inputProductDescription.value
    }
    products.push(product);
    updateLocalStorage();
    Swal.fire({
        icon: 'success',
        title: 'New Product Added Successfully',
        showConfirmButton: false,
        timer: 2500
    });
}

function deleteProduct(index, approved=false){
    if(index >= 0 && index < products.length){
        // if approved = true, then we know that the confirmation is already approved
        // in our case (we confirmed it at deleteAll() function)
        if(!approved){
            Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
              }).then((result) => {
                if (result.isConfirmed) {
                    products.splice(index,1);
                    updateLocalStorage();
                    displayProducts();
                    
                    Swal.fire(
                        'Deleted!',
                        'Your file has been deleted.',
                        'success'
                    )
                }
            })
        } else {
            products.splice(index,1);
            updateLocalStorage();
            displayProducts();
        }
    }
}

function updateItem(){
    if(updateIndex >= 0 && updateIndex < products.length){
        
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, update it!'
          }).then((result) => {
            if (result.isConfirmed) {
                var product = {
                    name: inputProductName.value,
                    quantity: inputProductQuantity.value,
                    price:    inputProductPrice.value,
                    description: inputProductDescription.value
                }
                products.splice(updateIndex,1,product);
                updateLocalStorage(); 
                
                Swal.fire({
                    icon: 'success',
                    title: 'Updated successfully!',
                    showConfirmButton: false,
                    timer: 2000
                });
            }
        }) 
        
    }
}

function deleteAll(){
    var size = products.length;
    Swal.fire({
        title: 'Are you sure you want to delete them all?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete them all!'
      }).then((result) => {
        if (result.isConfirmed) {          
            for(let i = size-1 ; i >= 0 ; i--){
                deleteProduct(i, true);
            }
            Swal.fire(
                'Deleted!',
                'All products has been deleted.',
                'success'
            )
        }
    })

    // We can do another way which is 
    // localStorage.removeItem("products");
    // products = []; or even products.splice(0, products.length);
    // displayProducts();
}


function searchProduct(name){
    var holder="";
    for(let i = 0 ; i < products.length ; i++){
        if(products[i].name.toLowerCase().includes(name.toLowerCase())){
            holder += ` <tr>
            <td>${i}</td>
            <td>${products[i].name}</td>
            <td>${products[i].quantity}</td>
            <td>${products[i].price}</td>
            <td>${products[i].description}</td>
            <td><button type="button" onclick="deleteProduct(${i})" class="btn btn-danger">Delete</button></td>
            <td><button type="button" onclick="fillForm(${i})" class="btn btn-secondary">Update</button></td>
            </tr>`;
        }
    }
    productsTable.innerHTML = holder;
}

