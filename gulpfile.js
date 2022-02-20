// gulpfile.js
const { src, dest } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssdeclsort = require('css-declaration-sorter');
const gcmq = require('gulp-group-css-media-queries');
const mode = require('gulp-mode')();//開発モードとプロダクションモードの使い分けをできるようにする

const compileSass = (done) => {
    // postcssを纏めて変数に代入
    const postcssPlugins = [
        autoprefixer({
          grid: "autoplace",
          cascade: false,
        }),//ベンダープレフィックスを自動付与
        cssdeclsort({ order: 'alphabetical' })//css出力時に各スタイル内記述をアルファベット順にする
      ];
    src('./src/scss/**/*.scss', { sourcemaps: true })
      .pipe(
        plumber({ errorHandler: notify.onError('Error: <%= error.message %>') })//エラーが出た際に通知を出す
      )
      .pipe(sass({ outputStyle: 'expanded' }))//sassの出力形式を指定
      .pipe(postcss(postcssPlugins))
      .pipe(mode.production(gcmq()))
      //npx gulp sass --production (プロダクションモード) でmedia queryの記述をブレイクポイントごとにまとめてくれる
      .pipe(dest('./dist/css', { sourcemaps: './sourcemaps' }));//ソースマップの指定
    done();
   };

module.exports = {
 sass: compileSass,
};
