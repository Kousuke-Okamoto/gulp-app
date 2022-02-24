const path = require('path');
module.exports = {
    mode: 'production',
    entry: {
      main: './src/js/main.js',
      //top: './src/assets/js/top.js',
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].js',
    },
    module: {
       rules: [
         {
           test: /\.js$/,
           use: [
             {
               loader: 'babel-loader',
               options: {
                 presets: [
                   '@babel/preset-env',
                 ],
               },
             },
           ],
         },
       ],
     },
     target: ['web', 'es5'],
   }