let project_folder = require("path").basename(__dirname);
let source_folder = "#list";

let fs = require("fs");

let path = {
  build: {
    html: project_folder + "/",
    css: project_folder + "/css/",
    js: project_folder + "/js/",
    js_plugins: project_folder + "/js/js_plugins/",
    resources: project_folder + "/resources/",
    fonts: project_folder + "/fonts/",
  },
  src: {
    html: [source_folder + "/*.html", "!" + source_folder + "/_*.html"],
    css: [source_folder + "/scss/*.scss", "!" + source_folder + "/_*.scss"],
    js: [source_folder + "/js/*.js", "!" + source_folder + "/js/_*js"],
    js_plugins: source_folder + "/js/js_plugins/*.js",
    resources: source_folder + "/resources/**/*.{jpg,jpeg,png,svg,gif,ico,webp,mp4}",
    fonts: source_folder + "/fonts/**/*",
  },
  watch: {
    html: source_folder + "/**/*.html",
    css: source_folder + "/scss/**/*.scss",
    js: source_folder + "/js/**/*.js",
    js_plugins: source_folder + "/js/js_plugins/*.js",
    resources: source_folder + "/resources/**/*.{jpg,png,svg,gif,ico,webp,mp4}",
  },
  clean: "./" + project_folder + "/",
};

let { src, dest } = require("gulp"),
  gulp = require("gulp");
svgSprite = require("gulp-svg-sprite");
// browsersync = require("browser-sync").create();
fileinclude = require("gulp-file-include");
del = require("del");
scss = require("gulp-sass");
autoprefixer = require("gulp-autoprefixer");
clean_css = require("gulp-clean-css");
rename = require("gulp-rename");
uglify = require("gulp-uglify-es").default;
imagemin = require("gulp-imagemin");
// webp = require("gulp-webp");
// webphtml = require("gulp-webp-html");
// webpcss = require("gulp-webpcss");
ttf2woff = require("gulp-ttf2woff");
ttf2woff2 = require("gulp-ttf2woff2");
fonter = require("gulp-fonter");
svgSprite = require("gulp-svg-sprite");
svgSymbols = require("gulp-svg-symbols");
// // Создание локального сервера
// const browserSync = (params) => {
//   browsersync.init({
//     server: {
//       baseDir: "./" + project_folder + "/",
//     },
//     port: 3000,
//     // notify:false
//   });
// };

// манипуляции с HTML
const html = () => {
  return src(path.src.html).pipe(fileinclude()).pipe(dest(path.build.html));
  // .pipe(browsersync.stream());
};

// Шрифты
const fonts = () => {
  src(path.src.fonts).pipe(ttf2woff()).pipe(dest(path.build.fonts));

  return src(path.src.fonts).pipe(ttf2woff2()).pipe(dest(path.build.fonts));
};

gulp.task("otf2ttf", function () {
  return src([source_folder] + "/fonts/**/*.otf")
    .pipe(
      fonter({
        formats: ["ttf"],
      })
    )
    .pipe(dest(source_folder + "/fonts/**/"));
});

function fontsStyle(params) {
  let file_content = fs.readFileSync(source_folder + "/scss/base/fonts.scss");
  if (file_content == "") {
    fs.writeFile(source_folder + "/scss/base/fonts.scss", "", cb);
    return fs.readdir(path.build.fonts, function (err, items) {
      if (items) {
        let c_fontname;
        for (var i = 0; i < items.length; i++) {
          let fontname = items[i].split(".");
          fontname = fontname[0];
          if (c_fontname != fontname) {
            fs.appendFile(
              source_folder + "/scss/base/fonts.scss",
              '@include font("' + fontname + '", "' + fontname + '", "400", "normal");\r\n',
              cb
            );
          }
          c_fontname = fontname;
        }
      }
    });
  }
}

function cb() {}

// манипуляции с CSS
const css = () => {
  return src(path.src.css)
    .pipe(
      scss({
        outputStyle: "expanded",
      })
    )

    .pipe(
      autoprefixer({
        cascade: true,
        overrideBrowserslist: ["last 5 versions"],
      })
    )
    // .pipe(webpcss())
    .pipe(dest(path.build.css))
    .pipe(clean_css())
    .pipe(
      rename({
        extname: ".min.css",
      })
    )
    .pipe(dest(path.build.css));
  // .pipe(browsersync.stream());
};

// манипуляции с JS
const js = () => {
  return src(path.src.js)
    .pipe(fileinclude())
    .pipe(dest(path.build.js))
    .pipe(uglify())
    .pipe(
      rename({
        extname: ".min.js",
      })
    )
    .pipe(dest(path.build.js));
  // .pipe(browsersync.stream());
};

const js_plugins = () => {
  return src(path.src.js_plugins).pipe(dest(path.build.js_plugins));
};

// Манипуляции с IMG
const images = () => {
  return src(path.src.resources)
    // .pipe(
    //   webp({
    //     quality: 70,
    //   })
    // )
    .pipe(dest(path.build.resources))
    .pipe(src(path.src.resources))
    .pipe(
      imagemin({
        progressive: true,
        svgoPlugins: [{ removeViewBox: false }],
        interlaced: true,
        optimizationlevel: 3,
      })
    )
    .pipe(dest(path.build.resources));
  // .pipe(browsersync.stream());
};

const makeSprite = () => {
  return gulp
    .src([source_folder + "/resources/iconsSprite/*.svg"])
    .pipe(
      svgSprite({
        mode: {
          // stack: {
          //   sprite: "../iconsSprite/icons.svg", // имя спрайта
          //   // example: true,
          // },
          symbol: true, // Activate the «symbol» mode
        },
      })
    )
    .pipe(dest(path.build.resources));
};

// gulp.task(`svgSpriteSymbol`, function () {
//   return gulp
//     .src([source_folder + "/resources/iconsSprite/*.svg"])
//     .pipe(svgSymbols())
//     .pipe(dest(path.build.resources));
// });

const watchFiles = () => {
  gulp.watch([path.watch.html], html);
  gulp.watch([path.watch.css], css);
  gulp.watch([path.watch.js], js);
  gulp.watch([path.watch.js_plugins], js_plugins);
  gulp.watch([path.watch.resources], images);
};

// Удаление папки dist
const clean = () => {
  return del(path.clean);
};

// Сценарий выполнения Gulp
let build = gulp.series(
  clean,
  gulp.parallel(js, js_plugins, css, html, images, fonts),
  // fontsStyle,
  makeSprite
);
let watch = gulp.parallel(build, watchFiles); /* browserSync) */

exports.makeSprite = makeSprite;
exports.fontsStyle = fontsStyle;
exports.fonts = fonts;
exports.images = images;
exports.js = js;
exports.js_plugins = js_plugins;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;
