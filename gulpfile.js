/**
 * GULP AUTOMATION FOR MAGENTO 2 DEPLOYMENT
 * COMMANDS : 
 * gulp m2upgrade --theme Magento/luma --lang en_US
 * gulp m2clear --theme Magento/luma --lang en_US
 * gulp m2mode --set developer --cache disable /  gulp m2mode --set production --cache enable
 * gulp m2cache --cache disable / gulp m2cache --cache enable
 * gulp m2reindex
 */

var gulp = require('gulp'); 
var run = require('gulp-run');
var minimist = require('minimist');

var knownOptions = [
	{
	  string : 'theme'
	},
	{
	  string : 'lang'
	},
	{
	  string : 'set'
	},
	{
	  string : 'cache'
	}
]

var options = minimist(process.argv.slice(2), knownOptions);

if(options.theme == undefined){
	options.theme = 'Magento/luma';
}
if(options.lang == undefined){
	options.lang = 'en_US';
}
if(options.cache == undefined){
	options.cache = 'enable';
}

/**
 * Gulp tasks
 */
gulp.task('m2upgrade', ['setup-upgrade','m2clear']); //Upgrade > Clear Caches > Redeploy

gulp.task('m2clear', ['remove-caches','cache-clean','redeploy-static-assets']); //Remove Cache > Clean Mage Cache > Redeploy

gulp.task('m2mode', ['change-mode','change-cache-mode']); // Change development environment | Production or Development

gulp.task('m2cache', ['change-cache-mode']); //Change cache mode | ON or OFF

gulp.task('m2reindex', function() {
	return run('php bin/magento indexer:reindex').exec();
});


/**
 * Solo Functions
 */

gulp.task('setup-upgrade', function() {
	return run('php bin/magento setup:upgrade').exec();
});

gulp.task('redeploy-static-assets', function() {
	return run('php bin/magento setup:static-content:deploy --theme '+options.theme+' --theme Magento/backend').exec();
});

gulp.task('cache-clean', function() {
	return run('php bin/magento cache:clean').exec();
});

gulp.task('remove-caches', function() {
	return run('rm -rf pub/static/frontend/'+options.theme+'/'+options.lang+'/* var/cache var/composer_home var/generation var/page_cache var/view_preprocessed').exec();
});

gulp.task('change-mode', function() {
	if(options.set == 'developer'){
		return run('php bin/magento deploy:mode:set developer').exec();
	}else if(options.set == 'production'){
		return run('php bin/magento deploy:mode:set production').exec();
	}else{
		console.log('Invalid mode.');
	}
});

gulp.task('change-cache-mode', function() {
	if(options.cache == 'disable'){
		return run('php bin/magento cache:disable').exec();
	}else{
		return run('php bin/magento cache:enable').exec();
	}
});

//Debug
gulp.task('debug', function() {
	if(options.cache == 'disable'){
		console.log('Undefined value');
	}else{
		console.log(options.theme);
	}
});