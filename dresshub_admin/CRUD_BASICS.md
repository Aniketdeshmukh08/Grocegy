Dresshub
products


DB
productid
prod_name
category
subcategory
price
image
brand
discount
prod_desc



Back End
productid - unique random string + number
prod_name - FE - xyz blue jenas
category - FE
subcategory - FE
price - FE
image - FE
brand - FE
discount - FE
prod_desc - FE



productid
{
prod_name: ""
category: ""
subcategory: ""
price: ""
image: ""
brand: ""
discount: ""
prod_desc: ""
}

{
    "productid": 7,
    "prod_name": "t_shirt",
    "category": "cloths",
    "subcategory": "mens wear",
    "price": "3000",
    "image": "uangoeno",
    "brand": "zara",
    "discount": "24%",
    "prod_desc": "this is  a branded  product",
    "isactive": 1,
    "createdon": "2024-02-05T07:30:59.000Z",
    "createdby": "admin",
    "updatedon": "2024-02-05T07:33:51.000Z",
    "updatedby": "admin"
  }
  
  
  
  
CRUD - Create Update Read Delete


REST API - 
POST - Create/Insert
GET - Read/Select
DELETE - Delete
PUT - Update/Update

POST - Create/Insert - Add anything
DELETE - Delete - Delete Anything
PUT/PATCH - Update/Update - Update Any data
GET - Read/Select - Read Single Data
GET - Read/Select - Read All Data

CRUD - 5 APIs


product update by id


product_update_id


///////////////////////////////////////////////////
POST - Create/Insert - Add anything
DELETE - Delete - Delete Anything
PUT/PATCH - Update/Update - Update Any data
GET - Read/Select - Read Single Data
****GET - Read/Select - Read All Data

UI Pages
ProductsList.js - 1 - Show All Products, Delete
ProductAdd.js - 2 - Add new Product
ProductEdit.js - 3 - Edit Product
Optional - 4 - View Product


Step 1 - Create files
Step 2 - Create different route for all pages - import and route add
Step 3 - Add on menubar
Step 4 - Actal tasks - list page, delete task, add task, edit task, view task