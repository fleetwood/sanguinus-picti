const blog = require('../models/Blog');
const pageType = 'blog';

exports.seed = function(knex, Promise) {
  // Inserts seed entries
  return knex(blog.tableName).insert([
    { 
      url: 'test-blog-one',
      pageType: pageType,
      title: 'Test Blog One',
      body: 'Lorem ipsum dolor sit amet. This is a test blog.',
      summary: 'This is just a test blog.',
      images: {
        header: '/images/pic02.jpg',
        gallery: [
          '/images/pic03.jpg'
        ]
      },
      featured: true,
      authors: [2],
      postDate: '2018/04/02'
    },

    { 
      url: 'test-blog-two',
      pageType: pageType,
      title: 'Test Blog Two',
      body: 'Lorem ipsum dolor sit amet. This is another test blog.',
      summary: 'This is just another test blog.',
      images: {
        header: '/images/pic04.jpg',
        gallery: [
          '/images/pic05.jpg'
        ]
      },
      featured: false,
      authors: [1],
      postDate: '2018/04/12'
    }
  ]);
};
