// gulpfile.js
const gulp = require('gulp');
const { src, dest, watch, series, parallel, lastRun }  = require("gulp");
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
const rename = require('gulp-rename');
const ejs = require('gulp-ejs');
const replace = require('gulp-replace');
const fs = require('fs');
const imageMin = require("gulp-imagemin");
const mozjpeg = require("imagemin-mozjpeg");
const pngquant = require("imagemin-pngquant");
const changed = require("gulp-changed");
const webp = require("gulp-webp");

//パス設定
const paths = {
  'src' : {
    'html' : './src/',
    'scss' : './src/scss/',
    'images': './src/images/',
    'js'   : './src/js/',
    'ejs'  : './src/ejs/'
  },
  'dist' : {
    'html' : './dist/',
    'css' : './dist/css',
    'images':'./dist/images',
    'js'   : './dist/js'
  }
}
const files = {
  'html' : '**/*.html',
  'ejs'  : '**/*.ejs',
  'ejs_partial' : '!./src/ejs/**/_*.ejs',
  'scss' : '**/*.scss',
  'css'  : '**/*.css',
  'js'   : '**/*.js',
  'jsondata' : './src/ejs/data.json'
}

// EJSコンパイル
const compileEjs = (done) => {
  const json = JSON.parse(fs.readFileSync(files.jsondata), 'utf8');
  gulp.src([paths.src.ejs+files.ejs, files.ejs_partial])
    .pipe(plumber())
    .pipe(ejs({data:json}, {}, { ext: '.html' }))
    .pipe(rename({ extname: '.html' }))
    .pipe(replace(/^[ \t]*\n/gmi, ''))
    .pipe(gulp.dest(paths.dist.html));
  done();
};


const compileSass = (done) => {
    // postcssを纏めて変数に代入
    const postcssPlugins = [
        autoprefixer({
          grid: "autoplace",
          cascade: false,
        }),//ベンダープレフィックスを自動付与
        cssdeclsort({ order: 'alphabetical' })//css出力時に各スタイル内記述をアルファベット順にする
      ];
    src(paths.src.scss+files.scss, { sourcemaps: true })
      .pipe(
        plumber({ errorHandler: notify.onError('Error: <%= error.message %>') })//エラーが出た際に通知を出す
      )
      .pipe(sass({ outputStyle: 'expanded' }))//sassの出力形式を指定
      .pipe(postcss(postcssPlugins))
      .pipe(mode.production(gcmq()))
      //npx gulp sass --production (プロダクションモード) でmedia queryの記述をブレイクポイントごとにまとめてくれる
      .pipe(dest(paths.dist.css, { sourcemaps: './sourcemaps' }));//ソースマップの指定
    done();
   };

   //画像コピー
   const copyImages = done => {
     src(["./src/images/**/*"])
       .pipe(dest("./dist/images"))
       .on("end", done);
   };

   //画像圧縮
   const compileImg = (done) => {
    src(paths.src.images + '**/*')
    .pipe(changed(paths.dist.images))
    .pipe(
      imageMin([
        pngquant({
          quality: [0.6, 0.7],
          speed: 1,
        }),
        mozjpeg({ quality: 65 }),
        imageMin.svgo(),
        imageMin.optipng(),
        imageMin.gifsicle({ optimizationLevel: 3 }),
      ])
    )
    .pipe(dest(paths.dist.images));
    done();
   };

   //webp作成
   const generateWebp = done => {
    src("./dist/imges/**/*.{png,jpg,jpeg}", {since: lastRun(generateWebp)})
      .pipe(webp())
      .pipe(dest("dist/imges/webp"));
    done();
   };

   const buildServer = (done) => {
    browserSync.init({
      port: 3000,//localhost:8080を開く
      files: ["**/*"],//全てのファイルを監視
      // 静的サイト
      server: { baseDir: './dist' },//index.htmlがどこにあるか
      // wordpressなど動的サイト
      // proxy: "http://localsite.local/",
      open: true,　//ブラウザを自動で開く
      watchOptions: {
        debounceDelay: 1000,//1秒間タスクの連続実行を抑制
      },
    });
    done();
   };
   
   //リロード
   const browserReload = done => {
    browserSync.reload();
    done();
   };

   //静的ファイルコピー
   const copyStatic = done => {
    src(["./src/static/**/*"])
      .pipe(dest("./dist/"))
      .on("end", done);
  };
   
   //ローカルサーバーでリアルタイムに更新するファイル群
   const watchFiles = () => {
    watch( "./src/ejs/**/*.ejs", series(compileEjs, browserReload))
    watch( './src/scss/**/*.scss', series(compileSass, browserReload))
    watch( "./src/images/**/*", series(copyImages, generateWebp, browserReload))
    watch( "./src/static/**/*", series(copyStatic, browserReload))
   };

module.exports = {
 ejs: compileEjs,
 sass: compileSass,
 imagemin: compileImg,
 webp: generateWebp,
 static:copyStatic,
 build: series(parallel(compileSass, compileEjs),copyImages),
 default: parallel(buildServer, watchFiles),
};
