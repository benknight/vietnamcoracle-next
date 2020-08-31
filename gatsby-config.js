module.exports = {
  siteMetadata: {
    title: 'Vietnam Coracle',
    description: 'Independent travel guides to Vietnam',
    author: 'Tom Divers <vietnamcoracle@gmail.com>',
  },
  plugins: [
    'gatsby-plugin-postcss',
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-sharp',
    'gatsby-transformer-sharp',
    // {
    //   resolve: 'gatsby-plugin-manifest',
    //   options: {
    //     name: 'vietnamcoracle-static',
    //     short_name: 'starter',
    //     start_url: '/',
    //     background_color: '#663399',
    //     theme_color: '#663399',
    //     display: 'minimal-ui',
    //     icon: 'src/assets/logo.jpg', // This path is relative to the root of the site.
    //   },
    // },
    {
      resolve: 'gatsby-plugin-prefetch-google-fonts',
      options: {
        fonts: [
          {
            family: 'Baskervville',
            subsets: ['latin', 'vietnamese'],
            variants: ['400', '400i'],
          },
        ],
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'assets',
        path: `${__dirname}/src/assets`,
      },
    },
    {
      resolve: 'gatsby-source-wordpress-experimental',
      options: {
        develop: {
          hardCacheMediaFiles: true,
        },
        html: {
          useGatsbyImage: false,
        },
        schema: {
          perPage: 8,
        },
        type: {
          // Limit the number of nodes downloaded, useful for debugging:
          // __all: {
          //   limit: 10,
          // },
          Comment: {
            exclude: true,
          },
          Menu: {
            exclude: true,
          },
          MenuItem: {
            exclude: true,
          },
          PostFormat: {
            exclude: true,
          },
          Tag: {
            exclude: true,
          },
          User: {
            exclude: true,
          },
          UserRole: {
            exclude: true,
          },
        },
        url: 'https://www.vietnamcoracle.com/graphql',
        verbose: true,
        writeQueriesToDisk: true,
      },
    },
  ],
};
