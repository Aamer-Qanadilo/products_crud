// text fields

var inputProductName = document.getElementById('inputProductName1');
var inputProductQuantity = document.getElementById('inputProductQuantity1');
var inputProductPrice = document.getElementById('inputProductPrice1');
var inputProductDescription = document.getElementById('inputProductDescription1');

// buttons
var addBtn = document.getElementById('addBtn');
var clearBtn = document.getElementById('clearBtn');
var deleteAllBtn = document.getElementById('deleteAllBtn');

clearBtn.onclick = clearForm;
deleteAllBtn.onclick = deleteAll;
addBtn.onclick = function(){
    checkAllInputs();

    if(inputsError.length !== 0) return;

    if(!updateFlag){
        addProduct();
        displayProducts();
        clearForm();
        checkAvailableProducts();
    }
    else updateItem();
}

// custom variables

var productInputs = document.querySelectorAll('.productInputs')
var productsTable = document.getElementById('products');
var inputsRegex = [
                   /^[A-Z][A-Za-z 0-9]{2,24}$/ 
                 , /^([1-9]|[1-9][0-9]|[1-9][0-9][0-9]|1000)$/ 
                 , /^([0-9]|[0-9][0-9]|[0-9][0-9][0-9]|[0-4][0-9][0-9][0-9]|5000)$/
                 , /^[A-Za-z ]{0,100}$/
                ];
var inputsErrorMessage = [
                    "Name should start with a capital letter & with a length of 3-25",
                    "Range of Quantity should be between 1-1000",
                    "Range of Price should be between 0-5000",
                    "Maximum description length is 100 letter"
                ];
var inputsError = [];
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
    checkAvailableProducts();
}

productInputs.forEach((input,index) => {
    console.log(input, input.value);
    input.addEventListener("keyup", function(){
        checkInput(input,index)
    });
    input.addEventListener("click", function(){
        console.log(input.value);
    });
});

function checkInput(input,index){
    if(!inputsRegex[index].exec(productInputs[index].value)){
        productInputs[index].classList.remove("is-valid");
        productInputs[index].classList.add("is-invalid");
            
        //These next lines is used to add a paragraph with the error message
        if(input.parentElement.childElementCount < 3){
            const para = document.createElement(`p`);
            const node = document.createTextNode(inputsErrorMessage[index]);

            para.appendChild(node);
            para.classList.add("alert","alert-danger");
            input.parentElement.appendChild(para);
        }
    } else {
        productInputs[index].classList.remove("is-invalid");
        productInputs[index].classList.add("is-valid");
        if(input.parentElement.childElementCount == 3){
            //This next lines is used to remove the paragraph with the error message        
            input.parentElement.removeChild(input.parentElement.children[2]);
        }
    }
    checkAllInputs();
}

function checkAllInputs(){
    for(let i = 0 ; i < productInputs.length ; i++) {
        if(!inputsRegex[i].exec(productInputs[i].value)){
            addBtn.setAttribute("disabled","true");
            inputsError.push(inputsErrorMessage[i]);
            return;
        }
    }
    inputsError = [];
    addBtn.removeAttribute("disabled");
}

function clearForm(){
    for(let i = 0 ; i < productInputs.length ; i++) {
        productInputs[i].value = "";
        productInputs[i].classList.remove("is-valid");
        productInputs[i].classList.remove("is-invalid");
        if(productInputs[i].parentElement.childElementCount == 3){
            //This next lines is used to remove the paragraph with the error message        
            productInputs[i].parentElement.removeChild(productInputs[i].parentElement.children[2]);
        }
    }
    addBtn.innerHTML = "Add Product";
    updateFlag = false;
    addBtn.setAttribute("disabled","true");
}

function fillForm(index){
    let product = products[index];

    inputProductName.value = product.name;
    inputProductQuantity.value = product.quantity;
    inputProductPrice.value = product.price;
    inputProductDescription.value = product.description;

    addBtn.innerHTML = "Update Product";
    checkAllInputs();
    updateFlag = true;
    updateIndex = index;
}

function displayProducts(){
    var holder="";
    for(let i = 0 ; i < products.length ; i++){
        holder += `
        <tr>
            <td>${i}</td>
            <td>${products[i].name}</td>
            <td>${products[i].quantity}</td>
            <td>${products[i].price}</td>
            <td>${products[i].description}</td>
            <td><button type="button" onclick="deleteProduct(${i})" class="btn btn-danger">Delete</button></td>
            <td><button type="button" onclick="fillForm(${i})" class="btn btn-secondary">Update</button></td>  
        </tr>
        `
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
                confirmButtonText: 'Delete!'
              }).then((result) => {
                if (result.isConfirmed) {
                    products.splice(index,1);
                    updateLocalStorage();
                    displayProducts();
                    checkAvailableProducts();
                    
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
            confirmButtonText: 'Update'
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
                
                displayProducts();
                checkAvailableProducts();
                clearForm();

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
            checkAvailableProducts();
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

function checkAvailableProducts(){
    if(products.length === 0) deleteAllBtn.setAttribute("disabled","true");
    else                     deleteAllBtn.removeAttribute("disabled");
}