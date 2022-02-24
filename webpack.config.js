const path = require('path');

module.exports = {
    mode: "production",
    entry: {
      main: "./src/assets/js/main.js",
      //another: "./src/assets/js/another.js",
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: "[name].js",
    },
    module: {
       rules: [
         {
           test: /\.js$/,
           use: [
             {
               loader: "babel-loader",
               options: {
                 presets: [
                   "@babel/preset-env",
                 ],
               },
             },
           ],
         },
       ],
     },
     target: ["web", "es5"],
   }