const tattoo = require('../models/Tattoo');
const pageType = 'tattoos';

exports.seed = function (knex, Promise) {
  return knex(tattoo.tableName).insert([

    {
      url: 'test-tattoo-one',
      pageType: pageType,
      title: 'Test Tattoo One',
      body: 'Lorem ipsum dolor sit amet. This is a test tattoo.',
      summary: 'This is just a test tattoo.',
      images: {
        header: '/images/pic02.jpg',
        gallery: [
          '/images/pic02.jpg',
          '/images/pic03.jpg',
          '/images/pic04.jpg'
        ]
      },
      featured: true,
      authors: [2],
      postDate: '2018/04/02'
    },

    {
      url: 'test-tattoo-two',
      pageType: pageType,
      title: 'Test Tattoo Two',
      body: 'Lorem ipsum dolor sit amet. This is a test tattoo.',
      summary: 'This is just a test tattoo.',
      images: {
        header: '/images/pic03.jpg',
        gallery: [
          '/images/pic03.jpg',
          '/images/pic04.jpg'
        ]
      },
      featured: false,
      authors: [1,2],
      postDate: '2018/04/12'
    },

    {
      url: 'camera-apertures',
      pageType: pageType,
      title: 'Camera Apertures',
      body: 'Lorem ipsum dolor sit amet. This is a test tattoo.',
      summary: 'Heidi Denney.',
      images: {
        header: '/images/heidi/01.jpg',
        gallery: [
          '/images/heidi/01.jpg',
          '/images/heidi/02.jpg',
          '/images/heidi/03.jpg',
          '/images/heidi/04.jpg',
          '/images/heidi/05.jpg',
          '/images/heidi/06.jpg',
          '/images/heidi/07.jpg',
          '/images/heidi/08.jpg',
          '/images/heidi/09.jpg'
        ]
      },
      featured: true,
      authors: [1],
      postDate: '2018/04/18'
    }
  ]);
};
