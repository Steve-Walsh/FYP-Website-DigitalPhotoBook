var mongoose = require('mongoose');  
    mongoose.connect('mongodb://localhost/newListDB');
    var Post = require('../api/post/post.model');

    Post.find({}).remove(function() {
      Post.create(  {
        title : 'India - Tiger population sees 30% increase.',
        link:   'http://www.bbc.com/news/world-asia-30896028',
        username: 'jbloggs',
        comments : [],
        upvotes: 0
      },  {
        title : 'The button that is not.',
        link:   'http://blog.nuclearsecrecy.com/2014/12/15/button-isnt/',
        username: 'psmith',
        comments : [],
        upvotes: 0
      },  {
        title : 'Google Nears $1B Investment in SpaceX',
        link:   null,
        username: 'aoneill',
        comments : [],
        upvotes: 0
      },   {
        title : 'Coinbase Raises $75M from DFJ Growth, USAA, and More',
        link:   'http://blog.coinbase.com/post/108642362357/coinbase-raises-75m-from-dfj-growth-usaa-nyse',
        username: 'jmarino',
        comments : [],
        upvotes: 0
      }, function () {
    process.exit()
});