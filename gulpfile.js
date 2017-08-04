var gulp        = require('gulp'),
		sass        = require('gulp-sass'),
		browserSync = require('browser-sync'),
		concat      = require('gulp-concat'),
		uglify      = require('gulp-uglifyjs'),
		cssnano     = require('gulp-cssnano'),
		rename      = require('gulp-rename'),
		del         = require('del'),
		imagemin    = require('gulp-imagemin'),
		pngquant    = require('imagemin-pngquant'),
		cache       = require('gulp-cache'),
		autoprefixer = require('gulp-autoprefixer');

// Task for compiling scss files
gulp.task('sass', function() {
	return gulp.src('app/sass/**/*.scss')
	.pipe(sass())
	.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {cascade: true})) 
	.pipe(gulp.dest('app/css'))
	.pipe(browserSync.reload({stream: true}))
});

// Task for minification and concatenation js
gulp.task('scripts', function() {
	return gulp.src([
		'app/libs/jquery/dist/jquery.min.js',
		'app/libs/bootstrap/dist/js/bootstrap.min.js',
	])
	.pipe(concat('libs.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('app/js'))
});

// Task for minification and rename css libs
gulp.task('css-libs', ['sass'], function() {
	return gulp.src('app/css/libs.css')
	.pipe(cssnano())
	.pipe(rename({suffix: '.min'}))
	.pipe(gulp.dest('app/css'));
});

// Task for auto-reloading
gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: 'app'
		},
		notify: false
	});
});

// Task for clearing the directory of the finished project
gulp.task('clean', function() {
	return del.sync('dist');
});

// Task to clear the cache
gulp.task('clear', function() {
	return cache.clearAll();
});

// Task for image optimization
gulp.task('img', function() {
	return gulp.src('app/img/**/*')
	.pipe(cache(imagemin({
		interlaced: true,
		progressive: true,
		svgoPlagins: [{removeViewBox: false}],
		use: [pngquant()]
	})))
	.pipe(gulp.dest('dist/img'));
});

// Task for tracking changes in files
gulp.task('watch', ['browser-sync', 'css-libs', 'scripts'], function() {
	gulp.watch('app/sass/**/*.scss', ['sass']);
	gulp.watch('app/*.html', browserSync.reload);
	gulp.watch('app/js/**/*.js', browserSync.reload);
});

// Task for project assembly
gulp.task('bild', ['clean', 'img', 'sass', 'scripts'], function() {
	var bildCss = gulp.src([
			'app/css/mine.css',
			'app/css/libs.min.css',
		])
		.pipe(gulp.dest('dist/css'));

	var bildFonts = gulp.src('app/fonts/**/*')
		.pipe(gulp.dest('dist/fonts'));

	var bildJs = gulp.src('app/js/**/*')
		.pipe(gulp.dest('dist/js'));

	var bildHtml = gulp.src('app/*.html')
		.pipe(gulp.dest('dist'));
});