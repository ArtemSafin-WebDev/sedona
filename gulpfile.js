const gulp = require("gulp");
const plumber = require("gulp-plumber");
const babel = require("gulp-babel");
const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const server = require("browser-sync").create();
const imagemin = require("gulp-imagemin");
const cssMinify = require("gulp-csso");
const webp = require("gulp-webp");
const svgstore = require("gulp-svgstore");
const cheerio = require("gulp-cheerio");
const rename = require("gulp-rename");
const run = require("run-sequence");
const del = require("del");
const imageminMozJpeg = require("imagemin-mozjpeg");
const imageminPngquant = require("imagemin-pngquant");
const browserify = require("browserify");
const source = require("vinyl-source-stream");
const uglify = require("gulp-uglify");
const twig = require('gulp-twig');
const htmlmin = require('gulp-htmlmin');

// Process SCSS files

gulp.task("style", function() {
  gulp
    .src("src/scss/styles.scss")
    .pipe(plumber())
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(gulp.dest("build/css"))
    .pipe(cssMinify())
    .pipe(rename("styles.min.css"))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
});

// Process HTML files

gulp.task("html", function() {
  return gulp
    .src("src/*.twig")
    .pipe(twig())
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest("build"))
    .pipe(server.stream());
});


// Process favicon files

gulp.task('favicon', function() {
  return gulp.src("src/*.{png,svg,jpeg,jpg,ico,xml,webmanifest,json}")
    .pipe(gulp.dest("build"))
    .pipe(server.stream());
})

// Process JS files

gulp.task("js", function() {
  return browserify("./src/js/app.js")
    .bundle()
    .pipe(source("bundle.js"))
    .pipe(gulp.dest("./build/js"))
    .pipe(server.stream());
});

// Transpile and minimize JS

gulp.task("transpile", function() {
  return gulp
    .src("./build/js/bundle.js")
    .pipe(
      babel({
        presets: ["env"]
      })
    )
    .pipe(uglify())
    .pipe(rename("bundle.transpiled.js"))
    .pipe(gulp.dest("./build/js"));
});

// Main task for watching changes

gulp.task("serve", function() {
  server.init({
    server: "build/"
  });
  gulp.watch("src/scss/**/*.scss", ["style"]);
  gulp.watch("src/**/*.twig", ["html"]);
  gulp.watch("src/**/*.js", ["js"]);
  gulp.watch("src/**/*.{png,jpg,svg,jpeg}", ["images"]);
  gulp.watch("src/*.{png,svg,jpeg,jpg,ico,xml,webmanifest,json}", ["favicon"]);
  gulp.watch("src/video/**/*.{mp4,webm,ogv}", ["video"]);
  gulp.watch("src/**/*.{woff,woff2}", ["fonts"]);
});

// Run 'gulp imagemin' to remove all unnecessary meta information from images. Will directly affect source images

gulp.task("imagemin", function() {
  return gulp
    .src("src/img/**/*.{png,jpg,svg}")
    .pipe(
      imagemin([
        imagemin.gifsicle({
          interlaced: true
        }),
        imagemin.jpegtran({
          progressive: true
        }),
        imagemin.optipng({
          optimizationLevel: 3
        }),
        imagemin.svgo({
          plugins: [
            {
              removeViewBox: false
            },
            {
              cleanupIDs: false
            }
          ]
        })
      ])
    )
    .pipe(gulp.dest("src/img"));
});


gulp.task("video", function() {
  return gulp.src("src/video/**/*.{mp4,webm,ogv}")
  .pipe(gulp.dest("build/video"))
  .pipe(server.stream());
})

// Run 'gulp compress' to perform compression operation. Result will be in the build folder. Source images are not touched

gulp.task("compress", function() {
  return gulp
    .src("src/img/**/*.{png,jpg}")
    .pipe(
      imagemin([
        imageminMozJpeg({
          quality: 80
        }),
        imageminPngquant({
          speed: 1,
          quality: 80
        })
      ])
    )
    .pipe(gulp.dest("./build/img"));
});

// Creates version of images in webp format (Supported mainly by Google Chrome)

gulp.task("webp", function() {
  return gulp
    .src("src/img/**/*.{png,jpg}")
    .pipe(
      webp({
        quality: 90
      })
    )
    .pipe(gulp.dest("src/img"));
});

// Run 'gulp sprite' to create SVG icon sprite from svg's with name like 'icon-***.svg'

gulp.task("sprite", function() {
  return gulp
    .src("src/img/icon-*.svg")
    .pipe(
      cheerio({
        run: function($) {
          $("[fill]").removeAttr("fill");
        },
        parserOptions: {
          xmlMode: true
        }
      })
    )
    .pipe(
      svgstore({
        inlineSvg: true
      })
    )
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("src/img"));
});

// Just to copy fonts

gulp.task("fonts", function() {
  return gulp
    .src("src/fonts/**/*.{woff,woff2}")
    .pipe(gulp.dest("build/fonts"))
    .pipe(server.stream());
});

// Just to copy images

gulp.task("images", function() {
  return gulp
    .src("src/img/**/*.{png,jpg,svg,webp,jpeg}")
    .pipe(gulp.dest("build/img"))
    .pipe(server.stream());
});

// Delete old Build folder

gulp.task("clean", function() {
  return del("build");
});

// Runs all tasks synchronously

gulp.task("build", function(done) {
  run("clean", "fonts", "images", 'favicon', "video", "style", "js", "html", done);
});

// Does not include image compression, run 'gulp compress' separately

gulp.task("optimize", function(done) {
  run("imagemin", "sprite", "webp", "images", done);
});

// Build project and then watch. Just run 'gulp' command

gulp.task("default", ["build", "serve"]);
