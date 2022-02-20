// gulpfile.js
const { src, dest, watch, series, parallel }  = require('gulp');
//src:入力先
//dest:出力先
//watch：変更を監視する
//series：処理を直列で処理（順番に処理したいときに使う）
//parallel：処理を並列で処理（順番は問わない）
const sass = require('gulp-sass')(require('sass'));
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssdeclsort = require('css-declaration-sorter');
const gcmq = require('gulp-group-css-media-queries');
const mode = require('gulp-mode')();//開発モードとプロダクションモードの使い分けをできるようにする
const browserSync = require('browser-sync');//ライブリロード用

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


   const buildServer = (done) => {
    browserSync.init({
      port: 3000,//localhost:8080を開く
      files: ["**/*"],//全てのファイルを監視
      // 静的サイト
      server: { baseDir: './' },//index.htmlがどこにあるか
      // 動的サイト
      // proxy: "http://localsite.local/",
      open: true,　//ブラウザを自動で開く
      watchOptions: {
        debounceDelay: 1000,//1秒間タスクの連続実行を抑制
      },
    });
    done();
   };
   
   const browserReload = done => {
    browserSync.reload();
    done();
   };
   
   const watchFiles = () => {
    watch( './src/scss/**/*.scss', series(compileSass, browserReload))
   };

module.exports = {
 sass: compileSass,
 default: parallel(buildServer, watchFiles),
};
