import _fill from 'lodash/fill';

export default {
  collection: _fill(Array(2), {
    body: 'This is the ad body content. Use this to describe your product or service. Spice it up with an image of your product.',
    enabled: true,
    heading: 'Title Banner [$250/month]',
    position: 3,
    cta: {
      title: 'Call to Action',
      url: 'https://www.vietnamcoracle.com',
    },
    image: {
      altText: '',
      srcLarge:
        'https://cms.vietnamcoracle.com/wp-content/uploads/2025/11/youradherebg.png',
    },
  }),
};
