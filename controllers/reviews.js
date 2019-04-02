const Review = require('../models/review');
const User = require('../models/user');

module.exports = (app) => {
  
  // SHOW ALL REVIEWS
  app.get('/reviews', (req, res) => {
    var currentUser = req.user;
    // res.render('home', {});
    console.log(req.cookies);
    Review.find().populate('author')
    .then(reviews => {
        res.render('all-reviews-show', { reviews, currentUser });
        // res.render('home', {});
    }).catch(err => {
        console.log(err.message);
    })
  })

  // NEW REVIEW FORM
  app.get('/reviews/new', (req, res) => {
      res.render('reviews-new', {});
  });
  
  // CREATE REVIEW
  app.post("/reviews/new", (req, res) => {
    if (req.user) {
        var review = new Review(req.body);
        review.author = req.user._id;

        review
            .save()
            .then(review => {
                return User.findById(req.user._id);
            })
            .then(user => {
                // user.reviews.unshift(review);
                user.save();
                // REDIRECT TO THE NEW POST
                res.redirect(`/reviews/${review._id}`);
            })
            .catch(err => {
                console.log(err.message);
            });
    } else {
        return res.status(401); // UNAUTHORIZED
    }
});

  //SHOW SPECIFIC REVIEW
  app.get("/reviews/:id", function(req, res) {
    // LOOK UP THE REVIEW
    Review.findById(req.params.id)
      .then(review => {
        res.render("reviews-show", { review });
      })
      .catch(err => {
        console.log(err.message);
      });
  });

  //EDIT REVIEW
  app.get('/reviews/:id/edit', (req, res) => {
    Review.findById(req.params.id, function(err, review) {
      res.render('reviews-edit', {review: review});
    })
  })

  // UPDATE REVIEW
  app.put('/reviews/:id', (req, res) => {
    Review.findByIdAndUpdate(req.params.id, req.body)
      .then(review => {
        res.redirect(`/reviews/${review._id}`)
      })
      .catch(err => {
        console.log(err.message)
      })
  })

  //DELETE REVIEW
  app.delete('/reviews/:id', function (req, res) {
    console.log("DELETE review")
    Review.findByIdAndRemove(req.params.id).then((review) => {
      res.redirect('/reviews');
    }).catch((err) => {
      console.log(err.message);
    })
  })
    
};