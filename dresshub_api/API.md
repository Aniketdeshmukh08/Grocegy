# Api list

***** - verifyjwtadmin
** - verifyjwt

### address.js

all Address     -- //http://localhost:4000/address/allAddress
** - Add Address     --//http://localhost:4000/address/addAddress
** - address id      --//http://localhost:4000/address/addressById/:addressId
User id         --//http://localhost:4000/address/getByuserId/:userId
** - Delete address  --//http://localhost:4000/address/deleteAddress/:addressId
** - Update address  --//http://localhost:4000/address/updateAddress/:addressId


### Cart.js

** - AllCarts Items                   --//http://localhost:4000/cart/allCartItems
** - get cart of particular user      --//http://localhost:4000/cart/userCart/:userid
** - add items to cart                --//http://localhost:4000/cart/addToCart      
** - empty the cart of user           --//http://localhost:4000/cart/emptyCart/:userid    
** - remove product from cart of user --//http://localhost:4000/cart/removeProduct/:userid/:productid    
** - update cartitem of user          --//http://localhost:4000/cart/updateCart/:userid/:productid    
** - gets join data of userCart  and product table  --//http://localhost:4000/cart/cartDetails/:userid    
** - Shows Quality of product         --//http://localhost:4000/cart/handleQuantity/:userid/:productid


### category.js

Get all category --//http://localhost:4000/category/allCategory
category By name --//http://localhost:4000/category/getByName
category By Id   --//http://localhost:4000/category/getById/id001
All category     --//http://localhost:4000/category/addCategory
***** - Remove category  --//http://localhost:4000/category/removeCategory/id001
***** - Update category  --//http://localhost:4000/category/updateCategory/id001

### categoryimage.js

Upload image for a category --http://localhost:4000/images/upload/:categoryId
Update image for a category --http://localhost:4000/images/update/:categoryId
Delete image for a category --http://localhost:4000/images/delete/:categoryId
Get image for a category --http://localhost:4000/images/:categoryId


### checkout.js

checkout --//http://localhost:4000/checkout/checkout

### customer.js

***** - get all Customer --//http://localhost:4000/customer/showallcustomer
get customer id  --//http://localhost:4000/customer/customerById/id001
get customer address --//http://localhost:4000/customer/customer/addCustomer
Upadate customer id  --//http://localhost:4000/customer/customer/updateCustomer/id001
***** - Remove customer id  --//http://localhost:4000/customer/customer/removecustomer/id001
***** - gets join data of users and customer table --//http://localhost:4000/customer/customer/customerDetails    
gets id of usres and customer table --//http://localhost:4000/customer/customer/customerDetails/id001
***** - updated the data of joined table of users and customer_details --//http://localhost:4000/customer/updateCustomerDetails/:id
***** - Remove the data of joined table of users and customer_details  --//http://localhost:4000/customer/customer/removeCustomerAndUser/:userid

### customProduct.js

get all product --//http://localhost:4000/customProduct/getall
add customer product --//http://localhost:4000/customProduct/add  


### images.js

upload image --http://localhost:4000/images/upload
get all image --http://localhost:4000/images
delete image --http://localhost:4000/images/:imageName

### orderDetails.js

***** - get all Order details --//http://localhost:4000/orders/orderDetails
** - add products          --//http://localhost:4000/orders/addToOrderProducts
** - order id              --//http://localhost:4000/orders/getById/id001
** - Remove ordered product--//http://localhost:4000/orders/removeOrderProduct/id001
** - Update the order product details --//http://localhost:4000/orders/updateOrderProductDetails/id001


### orders.js

** - get all orders --//http://localhost:4000/orders/allOrders
** - all order by id --//http://localhost:4000/orders/allorderIDs
** - get order by id --//http://localhost:4000/order/getById/id001
** - get order by id --//http://localhost:4000/orders/getOrderById/:id
** - add order --//http://localhost:4000/orders/addOrder
** - update order --//http://localhost:4000/orders/updateOrder/:id
** - remove order --//http://localhost:4000/orders/removeOrder/:id
** - get user id --//http://localhost:4000/order/getByuserId/:userId
** - count sold product --//http://localhost:4000/orders/soldproductcount
** - mark order delivered --//http://localhost:4000/orders/markdelivered/7484593613
** - mark delivery cancelled --//http://localhost:4000/orders/markdeliverycancelled/7484593613
** - mark order as completed --//http://localhost:4000/orders/markascompleted/7484593613
** - mark order as cancelled --//http://localhost:4000/orders/markascancelled/7484593613 


### ourteam.js

all our team members --//http://localhost:4000/ourteam/allourteam
our team by id --//http://localhost:4000/ourteam/ourteambyid/:id
add our team --//http://localhost:4000/ourteam/addourteam
remove our team --//http://localhost:4000/ourteam/removeourteam/:id
update our team --//http://localhost:4000/ourteam/updateourteam/:id


### products.js

category by name --//http://localhost:4000/products/CategoryByName
all products --//http://localhost:4000/products/allProducts
product by id --//http://localhost:4000/products/productByPId/id001
product search --// http://localhost:4000/products/search
gets products based on Category --//http://localhost:4000/products/byCategoryId/:001 
update product image --//http://localhost:4000/products/updateProductImage/:productid
copy product --// http://localhost:4000/products/copyProuduct
get all products --//http://localhost:4000/products/allProducts
get products by id --//http://localhost:4000/products/getProductById/id001
add product --//http://localhost:4000/products/addProduct
***** - update product --//http://localhost:4000/products/updateProduct/id001
***** - remove product --//http://localhost:4000/products/removeProduct/id001
gets products based on subcactegory  --//http://localhost:4000/products/bySubCategory


### settings.js

get all setting --//http://localhost:4000/settings/allsettings
get market status --//http://localhost:4000/settings/settingbyid/marketstatus
add setting --//http://localhost:4000/settings/addsetting
remove setting --//http://localhost:4000/settings/removesetting/12345
update setting --//http://localhost:4000/settings/updatesetting/123456
setting notice --// http://localhost:4000/settings/notice


### subCategory.js

get all subcategory --//http://localhost:4000/subcategory/allSubCategory
subcategory name    --//http://localhost:4000/subCategory/subCategoryName 
subcategory id  --//http://localhost:4000/subCategory/subCategoryById/id001
add subcategory --//http://localhost:4000/subCategory/addSubCategory
***** - Remove subcategory  --//http://localhost:4000/subCategory/removeSubCategory/id001
Get both category and subcategory id  --//http://localhost:4000/subCategory/categoryid/:id
***** - Update subcategory  --//http://localhost:4000/subCategory/updateSubCategory/id001


### users.js

** - get all users --//http://localhost:4000/users/allUsers
** - Serach user  --//http://localhost:4000/users/searchuser/:id
** - Find user id  --// http://localhost:4000/users/finduser?id=id001
** - get user by id --//http://localhost:4000/users/getUserById/id001
add user --//http://localhost:4000/users/addUser
add guest user --// http://localhost:4000/users/addguestuser
** - update user --//http://localhost:4000/users/updateUser/id001
***** - remove user --//http://localhost:4000/users/removeUser/id001
** - Password fetch  --// http://localhost:4000/users/Database/fetchPassword
***** - Active user  --// http://localhost:4000/users/activateuser/:id
** - login user --//http://localhost:4000/users/login
** - update user password  --// http://localhost:4000/users/updateuserpassword
** - update users --// http://localhost:4000/users/updateusers


### wishList.js

** - get all wishlist --//http://localhost:4000/wishlists/allWishlists
** - get wishlist by user id --//http://localhost:4000/wishlist/usersWishlist/:userid
** - add to wishlist --//http://localhost:4000/wishlist/addToWishlist
** - add wishlist --//http://localhost:4000/wishlists/addWishlist
** - empty the cart of user  --//http://localhost:4000/wishlist/emptyWishList/:userid 
** - update wishlist --//http://localhost:4000/wishlists/updateWishlist/

### Brand.js

//http://localhost:4000/brand/allbrands
// http://localhost:4000/brand/brandbyid/:id
//http://localhost:4000/brand/brandbycategoryid/:categoryid
** - //http://localhost:4000/brand/addbrand
***** - // http://localhost:4000/brand/removebrand/:id
***** - // http://localhost:4000/brand/updatebrand/:id

### complains.js

** - //http://localhost:4000/complains/allcomplains
** - // http://localhost:4000/complains/complainbyid/:complainid
//http://localhost:4000/complains/addcomplain
** - // http://localhost:4000/complains/removecomplains/:complainid
** - // http://localhost:4000/complains/updatecomplains/:complainid

### contact.js

** - // http://localhost:4000/contact/allContacts
** - // http://localhost:4000/contact/getById/id001
// http://localhost:4000/contact/addContact
** - // http://localhost:4000/contact/updateContact/id001
** - // http://localhost:4000/contact/removeContact/id001

### vendor.js

** - //http://localhost:4000/vendor/allvendors
** - //http://localhost:4000/vendor/vendorbyid/:id
//http://localhost:4000/vendor/addvendor
***** - //http://localhost:4000/vendor/updatevendor/:id
***** - //http://localhost:4000/vendor/removevendor/:id