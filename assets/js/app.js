var cl = console.log ;  //first class function(FCF)

const formList = document.getElementById("formList")
const enterItem = document.getElementById("enterItem")
const btnAddItem = document.getElementById("btnAddItem")
const todoList = document.getElementById("todoList")
const updateItemBtn = document.getElementById("updateItemBtn");
const clearAll = document.getElementById("clearAll");
const filterItem = document.getElementById("filterItem");

let dbArray = JSON.parse(localStorage.getItem('dbArray')) || [];

//************* This function is used for the create unique I'd *******************************
function create_UUID() {
   var dt = new Date().getTime();
   var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
       var r = (dt + Math.random() * 16) % 16 | 0;
       dt = Math.floor(dt / 16);
       return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
   });
   return uuid;
}

//************* This function is used for the create Tempating of Items *******************************
const templating =(arr) =>{
   let result = ''
   arr.forEach(ele => {
      result += `
      <li class="list-group-item text-uppercase font-weight-bold mt-3" id = ${ele.itemId}>
         <span onclick = "onItemEdit(this)">${ele.itemName}</span> 
         <span>  <i class="fa-solid fa-xmark" onclick = "onDeleteItem(this)" data-deleteid="${ele.itemId}"></i> </span> 
       </li>
      `
   });

   todoList.innerHTML = result;
}
//Here we can call templating fun globaly because when we add the item then automatically templating call

templating(dbArray)

//******************* Edit Items functionality ****************************
const onItemEdit = (eve) =>{
 let editId = eve.closest('li').getAttribute('id')
   // cl(editId);
   localStorage.setItem('editId',editId);

   let editObj = dbArray.find((item)=>{
      return item.itemId === editId
   
   })

   localStorage.setItem('editObj', JSON.stringify(editObj))
   updateItemBtn.classList.remove('d-none');
   btnAddItem.classList.add('d-none');
   enterItem.value = editObj.itemName;
   

}


//******************* Update Items functionality****************************
const onUpdateItem = (eve) =>{
   
   let updateValue = enterItem.value; //Here enterItem id is a input 
   // cl(updateValue);

   let editedObj = JSON.parse(localStorage.getItem('editObj')).itemId 
   // cl(editedObj)
   //Here we can match the each and every element in array and match the id
   for (let i = 0; i < dbArray.length; i++) {
     if(dbArray[i].itemId === editedObj){
        dbArray[i].itemName = updateValue;
        break;
     }
    
   }

   localStorage.setItem('dbArray', JSON.stringify(dbArray));
   templating(dbArray);
   // let targetLi = document.getElementById(editedObj)
   // targetLi.firstElementChild.innerHTML = updateValue;
   updateItemBtn.classList.add('d-none');
   btnAddItem.classList.remove('d-none');
  
   formList.reset();
   
   Swal.fire({
      icon: 'success',
      title: `${updateValue.toUpperCase()} is updated successfully!!`,
      timer: 3000
  })
   
}

// ********************************** Delete Item functionality *****************************

const onDeleteItem = (eve)=>{
   //   cl(eve);
  let delId = eve.dataset.deleteid;
   //   cl(delId);
let deletedValue = document.getElementById(delId).firstElementChild.innerHTML;
// cl(deletedValue);
let confirmDelete = confirm(`Are You Sure to Delete ${deletedValue.toUpperCase()} Item to list...?`)

if(confirmDelete){
   dbArray = dbArray.filter(item =>{
     return item.itemId != delId;
   })

   localStorage.setItem('dbArray', JSON.stringify(dbArray));
   document.getElementById(delId).remove();

   Swal.fire({
      icon: 'success',
      text: `${deletedValue.toUpperCase()} is deleted successfully...!!`,
      timer: 3000
  })

   } else {
             return false
      }

}

// ********************************** Add Item functionality *****************************

const onAddItem = (eve) =>{
   eve.preventDefault();
   // cl("submited",eve)
   

   let obj = {
      itemName : enterItem.value,
      itemId : create_UUID()
   }
   eve.target.reset();
   dbArray.unshift(obj);
   // localStorage.clear();
   localStorage.setItem('dbArray', JSON.stringify(dbArray))
   // cl(dbArray);
  templating(dbArray)
   Swal.fire({
      icon: 'success',
      text: `${obj.itemName.toUpperCase()} is Added successfully...!!`,
      timer: 3000
   })
   // location.reload()
}

//*********************** all clear list functionality************************ */

const onClearList = (eve) =>{
 let confirmAll = confirm(`Do You Want Clear All List`);
 if(confirmAll){
   dbArray.splice(0);
   localStorage.setItem('dbArray',JSON.stringify(dbArray));
   templating(dbArray)
 }
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
         Swal.fire(
            'Deleted!',
            'Your all list has been deleted sucessfully..!!',
            'success'
         )
         }
      })

}

//***************** Below function for the filter the Item functionality*****************************************************

const onFilterItem = (eve) =>{
   let filterItem = dbArray.filter((obj) => obj.itemName.toLowerCase().includes(eve.target.value.toLowerCase()))
      templating(filterItem)

}


//******************* Events functionality ***************************

formList.addEventListener('submit',onAddItem);
updateItemBtn.addEventListener('click',onUpdateItem);
clearAll.addEventListener('click',onClearList)
filterItem.addEventListener('keyup',onFilterItem)