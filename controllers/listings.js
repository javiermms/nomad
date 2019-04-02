const Listing = require('../models/listing');
const User = require('../models/user');
// //LOGIN POST
// app.post("/login", (req, res) => {
//   const username = req.body.username;
//   const password = req.body.password;
//   // Find this user name
//   User.findOne({ username }, "username password")
//   .then(user => {
//       if (!user) {
//       // User not found
//       return res.status(401).send({ message: "Wrong Username or Password" });
//       }
//   }).catch(err => {
//       console.log(err);
//   });
// });

//use token username and find it in the db
//if found get account attribute
//if account attribute is ll then make this var if not make tenant var

module.exports = (app) => {
  // HOMEPAGE
  app.get('/', (req, res) => {
    const currentUser = req.user;

    //need to find away to his new listings from tenants but not from landlords
    
    // const find = req.user.username;
    // console.log(req.user.username)
    // // console.log(req.body)

    // User.find({find}, "account")
    // .then(user => {
    //     console.log(user)
    //     if (!user) {
    //     // User not found
    //     // return res.status(401).send({ message: "Wrong Username or Password" });
    //     console.log("user not found")
    //     }
    // }).catch(err => {
    //     console.log(err);
    // });
  
    // if (req.user.account == "Landlord"){
    //   var Landlord = req.user;
    // } else if (req.user.account == "Tenant") {
    //   var Tenant = req.user;
    // }
    res.render("homepage", { currentUser });

  });
  

  // SHOW ALL LISTINGS
  app.get('/listings', (req, res) => {
    var currentUser = req.user;
    // res.render('home', {});
    console.log(req.cookies);
    Listing.find().populate('author')
    .then(listings => {
        res.render('all-listings-show', { listings, currentUser });
        // res.render('home', {});
    }).catch(err => {
        console.log(err.message);
    })
  })

  // NEW LISTING FORM
  app.get('/listings/new', (req, res) => {
      res.render('listings-new', {});
  });
  
  // CREATE LISTING
  app.post("/listings/new", (req, res) => {
    if (req.user) {
        var listing = new Listing(req.body);
        listing.author = req.user._id;

        listing
            .save()
            .then(listing => {
                return User.findById(req.user._id);
            })
            .then(user => {
                user.listings.unshift(listing);
                user.save();
                // REDIRECT TO THE NEW POST
                res.redirect(`/listings/${listing._id}`);
            })
            .catch(err => {
                console.log(err.message);
            });
    } else {
        return res.status(401); // UNAUTHORIZED
    }
});

  //SHOW SPECIFIC LISTING
  app.get("/listings/:id", function(req, res) {
    // LOOK UP THE LISTING
    Listing.findById(req.params.id)
      .then(listing => {
        res.render("listings-show", { listing });
      })
      .catch(err => {
        console.log(err.message);
      });
  });

  //EDIT LISTING
  app.get('/listings/:id/edit', (req, res) => {
    Listing.findById(req.params.id, function(err, listing) {
      res.render('listings-edit', {listing: listing});
    })
  })

  // UPDATE LISTING
  app.put('/listings/:id', (req, res) => {
    Listing.findByIdAndUpdate(req.params.id, req.body)
      .then(listing => {
        res.redirect(`/listings/${listing._id}`)
      })
      .catch(err => {
        console.log(err.message)
      })
  })

  //DELETE LISTING
  app.delete('/listings/:id', function (req, res) {
    console.log("DELETE review")
    Listing.findByIdAndRemove(req.params.id).then((listing) => {
      res.redirect('/listings');
    }).catch((err) => {
      console.log(err.message);
    })
  })
    
  // // GET DISTRICT
  // app.get("/:district", function (req, res) {
  //   var currentUser = req.user;
  //   Listing.find({ district: req.params.district }).populate('author')
  //       .then(listings => {
  //           res.render("all-listings-show", { listings, currentUser });
  //       })
  //       .catch(err => {
  //           console.log(err);
  //       });
  // });

};