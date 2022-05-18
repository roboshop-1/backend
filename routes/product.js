const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const multer = require('multer');
const path = require("path");
const bodyParser = require('body-parser');
const product = require("../models/product");


router.use('/images', express.static(path.join('backend/images')))
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
// Mime type configurations
const MIME_TYPE = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
    // destination
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE[file.mimetype];
        let error = new Error("Mime type is invalid");
        if (isValid) {
            error = null;
        }
        cb(null, 'src/assets/images/back')
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const extension = MIME_TYPE[file.mimetype];
        const imgName = name + '-' + Date.now() + '-RoboShop-' + '.' +
            extension;
        cb(null, imgName);
    }
});



//---------------------------------Add Product----------------------------
router.post('/products/add', multer({ storage: storage }).single('img'), (req, res) => {
    // console.log('Here into Post product ', req.body);
    let url = req.protocol + '://' + req.get('host');
    const product = new Product({
        name: req.body.name,
        price: req.body.price,
        categorie: req.body.categorie,
        quantity: req.body.quantity,
        description: req.body.description,
        detail : req.body.detail ,
        img: "/assets/images/back/" + req.file.filename,
        solde: req.body.solde,
        remise: req.body.remise,
        stock: req.body.stock
      
    });
    if (product.quantity >= 1) {
        product.stock = true;
    }
    else {
        product.stock = false;
    }
   
   
   
    product.save().then(
        (result) => {
            if (result) {
                res.status(200).json({
                    message: "product added with succes ",
                    product: result
                })
            }
        }
    )
});
//-------------------------Add second photo ----------------------------
router.post('/upload', multer({ storage: storage }).single('imgg'), (req, res) => {
    console.log('Here into Post product ');

    let url = req.protocol + '://' + req.get('host');
    const product = new Product({
        name: req.body.name,
        price: req.body.price,
        categorie: req.body.categorie,
        quantity: req.body.quantity,
        detail : req.body.detail ,
        description: req.body.description,
        imgg: "/assets/images/back/" + req.file.filename,
        img: req.body.img,
        solde: req.body.solde,
        remise: req.body.remise,
        stock: req.body.stock,
 

    });
    if (product.solde == true){
        product.new_price = product.price - ((product.price * product.remise)/100);
        }
   
    product.save().then(
        (result) => {
            if (result) {
                res.status(200).json({
                    message: "Product added with succes ",
                    product: result
                })
            }
        }
    )

});

//------------------------------------- delete product -----------------------------------
router.delete('/delete/:id', (req, res) => {
    console.log('Here into delete product bu ID', req.params.id);
    Product.deleteOne({ _id: req.params.id }).then(
        (result) => {
            if (result) {
                res.status(200).json({
                    message: 'Deleted Product with success '
                })
            }
        }
    )
})


//-----------------------------------Get All Product---------------------------------------
router.get('/products', (req, res) => {
    console.log('Here into get all Products');
    product.find().then(
        (result) => {
            if (result) {
                Product.count().then(
                    (nbr)=>{
                res.status(200).json({
                    products: result,
                    number : nbr
                })
            }
            )
            }
        }
    )
});

//-----------------------------------Get All Product in Stock---------------------------------------
router.get('/instock', (req, res) => {
    console.log('Here into get all Products in stock');
    product.find({stock : true}).then(
        (result) => {
            if (result) {
                Product.count().then(
                    (nbr)=>{
                res.status(200).json({
                    products: result,
                    number : nbr
                })
            }
            )
            }
        }
    )
});
//------------------------------- get Product by Category ------------------------------------
router.get('/category/:id', (req, res) => {
    console.log('Here In Get Products By Category :', req.params.id);
    Product.find({ categorie: req.params.id }).then(
        (result) => {
            if (result) {

                var data = new Array();
                for (let i = 0; i < 5; i++) {
                    data.push(result[i]);
                }
                console.log('This is product by category ',result);
                res.status(200).json({
                    produit : data
                })
            }
        }
    )
});

//------------------------------- get Product by Categorys For Shop ------------------------------------
router.get('/categorys/:id', (req, res) => {
    console.log('Here In Get Products By Category :', req.params.id);
    Product.find({ categorie: req.params.id }).then(
        (result) => {
            if (result) {
                console.log('This is product by category ',result);
                res.status(200).json({
                    produit : result
                })
            }
        }
    )
});

//------------------------
router.get('/category/home/:id' ,(req,res)=>{
    console.log('Here In Get Products By Category Home :', req.params.id);
    Product.find({ categorie: req.params.id }).then(
        (result) => {
            if (result) {
                var data = new Array();
                for (let i = 0; i < 10; i++) {
                    data.push(result[i]);
                }
                console.log('This is product by category ',result);
                res.status(200).json({
                    produit : data
                })
            }
        }
    )
})

//---------------------------Get Product In Home ---------------------------
router.get('/home', (req,res)=>{
    console.log('get product in Home');
    Product.find().then(
        (result)=>{
            var data = new Array();
            for (let i = 0; i < 10; i++) {
                data.push(result[i]); 
            }
            res.status(200).json({
                produit: data
            })
        }
    )
})

//---------------------------- Get All Product Sorted By Count --------------------------------
router.get('/trends', (req, res) => {
    console.log('Here in get products sorted by nbr payment');
    Product.find().then(
        (result) => {
            //  console.log('get all result before sort',result);
            result.sort((x, y) => y.nbr_payment - x.nbr_payment);
            //    console.log('here data :',result);
            var data = new Array();
            for (let i = 0; i < 5; i++) {
                //   console.log('mel boucle :',result[i]);
                data.push(result[i]);
            }
            console.log('daataaaaa',data);
            res.status(200).json({
                trend: data
            })
            // console.log('here data :',data);  
        }
    )
});

//-------------------------Get Product By ID------------------------------------------
router.get('/products/:id', (req, res) => {
    console.log('Here into get products by ID', req.params.id);
    Product.findOne({ _id: req.params.id }).then(
        (result) => {
            if (result) {
                res.status(200).json({
                    product: result
                })
            }
        }
    )
});

//-------------------------Get Product By ID------------------------------------------
router.get('/product/:name', (req, res) => {
    console.log('Here into get products by name', req.params.name);
    Product.findOne({ name: req.params.name }).then(
        (result) => {
            if (result) {
                res.status(200).json({
                    product: result
                })
            }
        }
    )
});

//--------------------------- Get Products Of Shop Home ---------------------------------
router.get('/shop_home' , (req,res)=>{
    console.log('here in get products of shop home');
    Product.find().then(
        (result)=>{
            var data = new Array();
            for (let i = 0; i < 10; i++) {
                data.push(result[i]);
            }

            res.status(200).json({
                product : data
            })
        }
    )
})


//------------------------Delete Product---------------------------------------------------
router.delete('/products/:id', (req, res) => {
    console.log('Here into delete products by ID', req.params.id);
    Product.deleteOne({ _id: req.params.id }).then(
        (resulft) => {
            if (resulft) {
                res.status(200).json({
                    message: 'Deleted Product with success '
                })
            }
        }
    )
});


//------------------- edit product -----------------------------
router.put("/editt/:id"  , (req, res) => {
    console.log('Here in edit Product', req.body);
  
    const product = new Product({
        _id: req.params.id,
        name: req.body.name,
        price: req.body.price,
        categorie: req.body.categorie,
        quantity: req.body.quantity,
        detail : req.body.detail ,
        description: req.body.description,
        imgg: req.body.imgg,
        img: req.body.img,
        solde: req.body.solde,
        remise: req.body.remise,
        stock: req.body.stock,
        new_price : req.body.new_price
       });  
            // console.log('new product', product);
            // console.log('req.params.id', req.params.id);
                                                    
                    Product.updateOne({_id : req.params.id}, product).then((result) => {
                        console.log("updated ");
                        res.status(200).json({
                            message: 'Update with success',
                            id: req.params.id
                        });
                    })
                        .catch(err => {
                            console.log("error", err);
                            res.status(500).json({
                                error: err
                            });
                        });
                    })
            

//--------------------------------- Edit Product with one photo ----------------------------------------------
router.put("/edit1/:id" , multer({ storage: storage }).single('img')  , (req, res) => {
    console.log('Here in edit Product1', req.body);
    let url = req.protocol + '://' + req.get('host');
    const product = new Product({
        _id: req.params.id,
        name: req.body.name,
        price: req.body.price,
        categorie: req.body.categorie,
        quantity: req.body.quantity,
        detail : req.body.detail ,
        description: req.body.description,
        imgg: req.body.imgg,
        img: "/assets/images/back/" + req.file.filename,
        solde: req.body.solde,
        remise: req.body.remise,
        stock: req.body.stock,
        new_price : req.body.new_price
       });  
            console.log('new product', product);
            console.log('req.params.id', req.params.id);
                                                    
                    Product.updateOne({_id : req.params.id}, product).then((result) => {
                        console.log("updated ",result);
                        res.status(200).json({
                            message: 'Update with success',
                            product: product
                        });
                    })
                        .catch(err => {
                            console.log("error", err);
                            res.status(500).json({
                                error: err
                            });
                        });
                    })

//-------------------- edit product with two photo -----------------------------
router.put("/edit2/:id" , multer({ storage: storage }).single('imgg')  , (req, res) => {
    let url = req.protocol + '://' + req.get('host');
    const product = new Product({
        _id: req.params.id,
        name: req.body.name,
        price: req.body.price,
        categorie: req.body.categorie,
        quantity: req.body.quantity,
        detail : req.body.detail ,
        description: req.body.description,
        img: req.body.img,
        imgg: "/assets/images/back/" + req.file.filename,
        solde: req.body.solde,
        remise: req.body.remise,
        stock: req.body.stock,
        new_price : req.body.new_price
       });  

       Product.updateOne({_id : req.params.id}, product).then((result) => {
        console.log("updated ");
        res.status(200).json({
            message: 'Update with success',
            id: req.params.id
        });
    })
        .catch(err => {
            console.log("error", err);
            res.status(500).json({
                error: err
            });
        });
   



});
            


//------------------------------- Delete Quantity of Product --------------------------
router.post('/delete/quantity', (req,res)=>{
    console.log('here in delete quantity of product after payment',req.body);
    Product.findOne({name : req.body.name}).then(
        (data)=>{
            data.quantity = data.quantity - req.body.quantity;
            if (data.quantity < 1){
                data.stock = false;
            }
            Product.updateOne({name : req.body.name},data).then(
                (result)=>{
                    res.status(200).json({
                        message : "Product updated successfully"
                    })
                }
            )
        }
    )
});

//---------------------- Get Latest Arrival -------------------------
router.get('/latest' , (req,res)=>{
    console.log('Get Latest Arrivals Product');
    Product.find().then(
        (data)=>{
            if(data){
                var pro = new Array();
                var y = data.length ;
                var j = 0 ;
                for (let i = 0; i < 5; i++) {
                    pro.push(data[y-i-1]);
                }
                res.status(200).json({
                    produits : pro
                })
            }
        }
    )
})

//---------------------------- Lower Product --------------------
router.post('/lower', (req,res)=>{
    console.log('Get Product from lower to high');
    var data = req.body;
    data.sort((x,y)=> y.price - x.price);
    // console.log('afetr sorted ',data);
    res.status(200).json({
        product : data
    })
})

//---------------------------- High Product --------------------
router.post('/high', (req,res)=>{
    console.log('Get Product from high to low');
    var data = req.body;
    data.sort((x,y)=> x.price - y.price);
    res.status(200).json({
        product : data
    })
})

module.exports = router;