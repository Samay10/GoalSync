const webpack = require('webpack');

module.exports = {
  webpack: (config, env) => {
    // Add fallback for server-side Node.js modules to prevent errors in the browser
    config.resolve.fallback = {
      ...config.resolve.fallback,
      async_hooks: false,  // Exclude async_hooks for client-side build
      fs: false,           // Exclude fs module
      net: false,          // Exclude net module
      tls: false,          // Exclude tls module
      child_process: false // Exclude child_process module
    };

    // Ensure the output path for static assets is properly set
    config.output = {
      ...config.output,
      publicPath: '/static/', // Make sure assets are correctly served from the /static/ path
    };

    // Handle production-specific optimizations and chunk splitting
    if (env === 'production') {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
        },
        runtimeChunk: {
          name: entrypoint => `runtime-${entrypoint.name}`,
        },
      };
    }

    // Ensure the CSS and JS are correctly handled and no errors related to static files
    config.module.rules = [
      ...config.module.rules,
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['react-app'],
          },
        },
      },
    ];

    // Optionally, add environment-specific configurations
    config.plugins = [
      ...config.plugins,
      new webpack.DefinePlugin({
        'process.env.REACT_APP_ENV': JSON.stringify(env),  // Define environment variable
      }),
    ];

    return config;
  },
};
