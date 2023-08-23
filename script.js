const itemForm = document.querySelector('#item-form');
const itemInput = document.querySelector('#item-input');
const itemList = document.querySelector('#item-list');
const clearBtn = document.querySelector('#clear');
const itemFilter = document.querySelector('.filter');
const formInputFilter = document.querySelector('.form-input-filter');
const formBtn = itemForm.querySelector('button');
let isEditMode = false;

// display existing items
function displayItems() {
    const itemsFromStorage = getItemsFromStorage();
    itemsFromStorage.forEach(item => addItemToDOM(item));
}

// add item
function onAddItemSubmit(e) {
    e.preventDefault();

    const newItem = itemInput.value;

    if(newItem === '') {
        alert('Please add an item');
        return;
    }

    if(isEditMode) {
        const itemToEdit = itemList.querySelector('.edit-mode');
        
        removeItemFromStorage(itemToEdit.textContent);
        itemToEdit.classList.remove('edit-mode');
        itemToEdit.remove();
        isEditMode = false;
    }
    else {
        if(checkIfItemExist(newItem)) {
            alert("Item already exists!");
            return;
        }
    }

    addItemToDOM(newItem); // create item in dom
    addItemToLocalStorage(newItem); // add item to storage
}

function addItemToDOM(item) {
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(item));
    
    const button = createButton('remove-item btn-link text-red');
    
    li.appendChild(button);
    
    // console.log(li);
    itemList.appendChild(li);
    
    itemInput.value = '';
    checkUI();
}

function createButton(classes) {
    const button = document.createElement('button');
    button.className = classes;

    const icon = createIcon('fa-solid fa-xmark');
    button.appendChild(icon);

    return button;
}

function createIcon(classes) {
    const icon = document.createElement('i');
    icon.className = classes;
    
    return icon;
}

function addItemToLocalStorage(item) {
    let itemsFromStorage = getItemsFromStorage();

    itemsFromStorage.push(item);

    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function getItemsFromStorage() {
    let itemsFromStorage;

    if(localStorage.getItem('items') === null) {
        itemsFromStorage = [];
    }
    else {
        itemsFromStorage = JSON.parse(localStorage.getItem('items'));
    }

    return itemsFromStorage;
}

// Remove Item
function onClickItem(e) {
    if(e.target.parentElement.classList.contains('remove-item')) {
        removeItem(e.target.parentElement.parentElement)
    }
    else {
       setItemToEdit(e.target);
    }
}

function checkIfItemExist(item) {
    const itemsFromStorage = getItemsFromStorage();

    return itemsFromStorage.includes(item);
}

function setItemToEdit(item) {
    // console.log(item);
    isEditMode = true;

    itemList.querySelectorAll('li').forEach(i => i.classList.remove('edit-mode'));

    item.classList.add('edit-mode');

    formBtn.innerHTML =  `<i class="fa-solid fa-pen"></i> Update item`;
    formBtn.style.backgroundColor = '#228822';
    itemInput.value = item.textContent;
}


function removeItem(item) {
    if(confirm('Are you sure?')) {
        // remove item form DOM
        item.remove();
        checkUI();

        // remove item from local storage
        removeItemFromStorage(item.textContent);
    }
}

function removeItemFromStorage(item) {
    let itemsFromStorage = getItemsFromStorage();
    itemsFromStorage = itemsFromStorage.filter(elem => elem !== item);

    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
    checkUI();
}

// Remove All Items
function removeAllItems(e) {
    // itemList.innerHTML = '';
    while(itemList.firstChild) {
        itemList.firstChild.remove();
        // console.log(itemList.firstChild);
    }
    
    localStorage.removeItem('items')
    checkUI();
}


// filter items
function filterItems(e) {
    const text = e.target.value.toLowerCase();
    const items = document.querySelectorAll('li');

    items.forEach(item => {
        const itemName = item.firstChild.textContent.toLowerCase();

        if(itemName.indexOf(text) != -1) {
            item.style.display = 'flex';
        }
        else {
            item.style.display = 'none';    
        }
    })
    
}

function checkUI() {
    itemInput.value = ''
    const items = document.querySelectorAll('li');

    // console.log(items);
    if(items.length === 0) {
        clearBtn.style.display = 'none';
        itemFilter.style.display = 'none';
    }
    else {
        clearBtn.style.display = 'block';
        itemFilter.style.display = 'block';
    }

    formBtn.innerHTML =  `<i class="fa-solid fa-plus"></i>Add item`;
    formBtn.style.backgroundColor = '#333';


    isEditMode = false;

}

itemForm.addEventListener('submit', onAddItemSubmit);
itemList.addEventListener('click', onClickItem);
clearBtn.addEventListener('click', removeAllItems);
formInputFilter.addEventListener('input', filterItems);
document.addEventListener('DOMContentLoaded', displayItems);

checkUI();

