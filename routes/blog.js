const express = require("express");
const router = express.Router();
const Blog = require("../models/blog");
const path = require("path");
const bodyParser = require('body-parser');
const multer = require('multer');

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
        cb(null, 'src/assets/images/Blogs')
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const extension = MIME_TYPE[file.mimetype];
        const imgName = name + '-' + Date.now() + '-RoboShop-' + '.' +
            extension;
        cb(null, imgName);
    }
});


//------------------------------------- Add Blog -------------------------------------

router.post('/add',  multer({ storage: storage }).single('img') ,(req, res) => {
    // console.log('Here in Add Blog ', req.body);
    let url = req.protocol + '://' + req.get('host');
    const blog = new Blog({
        title: req.body.title,
        author: req.body.author,
        description1: req.body.description1,
        description2: req.body.description1,
        quote : req.body.quote ,
        img: "/assets/images/Blogs/" + req.file.filename,
        date : req.body.date
    });

    //  console.log('this is Blog ',blog);
    Blog.findOne({ title: req.body.title }).then(
        (data) => {
            if (data) {
                console.log('mawjoda');
                res.status(200).json({
                    message: "-1"
                })
            }
            else {
                blog.save().then(
                    (result) => {
                        res.status(200).json({
                            message: "Blog added successfully !",
                            blog : result 
                        })
                    }
                )
            }
        }
    )
});


//-----------------------------Ad Blog ------------------------------
router.post('/upload', multer({ storage: storage }).single('imgg'), (req, res) => {
    console.log('Here into Post Blog ');

    let url = req.protocol + '://' + req.get('host');
    const blog = new Blog({
        title: req.body.title,
        author: req.body.author,
        description1: req.body.description1,
        description2: req.body.description1,
        quote : req.body.quote ,
        imgg: "/assets/images/Blogs/" + req.file.filename,
        img: req.body.img,
        date : req.body.date
    })
    blog.save().then(
        (result) => {
            if (result) {
                res.status(200).json({
                    message: "Blog added with succes ",
                    product: result
                })
            }
        }
    )

});

//------------------------------ Delete Blog --------------------------
router.delete('/delete/:id', (req, res) => {
    console.log('Delete Blog By ID', req.params.id);
    Blog.deleteOne({ _id: req.params.id }).then(
        (result) => {
            if (result) {
                res.status(200).json({
                    message: 'Deleted Blog with success'
                })
            }
        }
    )
});

//-----------------------------------Get All Product---------------------------------------
router.get('/blogs', (req, res) => {
    console.log('Here into get all Blogs');
    Blog.find().then(
        (result) => {
            if (result) {
                res.status(200).json({
                    blogs: result
                })
            }
        }
    )
});

//------------------- edit Blog -----------------------------
router.put("/editing/:id"  , (req, res) => {
    console.log('Here in edit Blog', req.body);
    const blog = new Blog({
        _id : req.params.id ,
        title: req.body.title,
        author: req.body.author,
        description1: req.body.description1,
        description2: req.body.description2,
        quote : req.body.quote ,
        imgg: req.body.imgg,
        img: req.body.img,
        date : req.body.date
    })
                                                    
        Blog.updateOne({_id : req.params.id}, blog).then((result) => {
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
    console.log('Here in edit Blog1', req.body);
    let url = req.protocol + '://' + req.get('host');
    const blog = new Blog({
        _id : req.params.id ,
        title: req.body.title,
        author: req.body.author,
        description1: req.body.description1,
        description2: req.body.description2,
        quote : req.body.quote ,
        imgg: req.body.imgg,
        img: "/assets/images/back/" + req.file.filename,
        date : req.body.date
    })
                                 
            Blog.updateOne({_id : req.params.id}, blog).then((result) => {
                console.log("updated ",result);
                res.status(200).json({
                    message: 'Update with success',
                    blog: blog
                });
            })
                .catch(err => {
                    console.log("error", err);
                    res.status(500).json({
                        error: err
                    });
                });
            })


//-------------------- edit Blog with two photo -----------------------------
router.put("/edite2/:id" , multer({ storage: storage }).single('imgg')  , (req, res) => {
    console.log('Here in edit Blog2', req.body);
    let url = req.protocol + '://' + req.get('host');
    const blog = new Blog({
        _id : req.params.id ,
        title: req.body.title,
        author: req.body.author,
        description1: req.body.description1,
        description2: req.body.description2,
        quote : req.body.quote ,
        img: req.body.img,
        imgg: "/assets/images/back/" + req.file.filename,
        date : req.body.date
    })

       Blog.updateOne({_id : req.params.id}, blog).then((result) => {
        console.log("updated 2");
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
            

//------------------------- Get Home Blogs --------------------------
router.get('/home-blog' , (req,res)=>{
    console.log('here in get Home Blogs');
    Blog.find().then(
        (result)=>{
            result.sort((x, y) => y.visits - x.visits);
            var data = new Array();
             for (let i = 0; i < 3; i++) {
             data.push(result[i]);
            }
            res.status(200).json({
                blogs : data 
            })
        }
    )
})



//-------------------------Get Blog By ID------------------------------------------
router.get('/:id', (req, res) => {
    console.log('Here into get Blog by ID', req.params.id);
    Blog.findOne({ _id: req.params.id }).then(
        (result) => {
            result.visits = result.visits + 1 ;
            Blog.updateOne({_id : req.params.id},result).then(
                (data)=>{
                    if (result) {
                        res.status(200).json({
                            blog: result
                        })
                    }

                }
            )       
        }
    )
});

module.exports = router;
