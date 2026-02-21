const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const dotenv = require('dotenv');


dotenv.config({ path: '../.env' }); 

module.exports = {
  entry: './src/index.js', 
  output: {
    path: path.resolve(__dirname, 'dist'), 
    filename: 'bundle.js',
    publicPath: '/',
  },
  module: {
    rules: [
           {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
          type: 'javascript/auto',
        use: {
          loader: 'babel-loader',
          options: {
             sourceType: 'unambiguous',
            presets: [
              ['@babel/preset-env', { modules: false }],
              ['@babel/preset-react', { runtime: 'automatic' }]
            ]
          }
        },
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i, 
        type: 'asset/resource',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html', 
    }),
    new webpack.DefinePlugin({
     
      'process.env.API_BASE_URL': JSON.stringify(process.env.API_BASE_URL || 'http://localhost:5000/api'),
    }),
  ],
  devServer: {
    historyApiFallback: true,
    port: 3000,
    hot: true, 
  },
  resolve: {
    extensions: ['.js', '.jsx'], 
  },
};