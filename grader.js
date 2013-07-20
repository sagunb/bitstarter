#!/usr/bin/env node
/*
Automatically grade files for the presence of specified HTML tags/attributes.
Uses commander.js and cheerio.*/

var fs = require('fs');
var rest = require('restler');
var program = require('commander');
var cheerio = require('cheerio');
var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";

var checkurl = function(url){
    rest.get(url).on('complete', function(result) {
  if (result instanceof Error) {
    console.log('Error: ' + result.message);
  } else {
    var htmlfile = cheerio.load(result);
    var checkJson = checkHtmlFile(htmlfile,program.checks);
    var outJson = JSON.stringify(checkJson, null, 4);
    console.log(outJson);
  }
});
};

var assertFileExists = function(infile){
    var instr = infile.toString();
    if(!fs.existsSync(instr)){
	console.log("%s does not exist. Exiting.", instr);
	process.exit(1);// this causes it to exit with a failure code
    }
    return instr;
};

var cheerioHtmlFile = function(htmlfile){
    return cheerio.load(fs.readFileSync(htmlfile));
};

var loadChecks = function(checksfile){
    return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(htmlfile, checksfile){
    $ = htmlfile;
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks){
	var present = $(checks[ii]).length > 0 ;
	out[checks[ii]] = present;
    }
    return out;
};

var clone = function(fn){
    //some workaround for commander.js issue
    return fn.bind({});
};

if(require.main == module){
    program
	.option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
	.option('-f, --file <html_file>', 'Path to index.html', clone(assertFileExists), HTMLFILE_DEFAULT)
	.option('-url, --url <url_link>', 'link to bitstarter website')
	.parse(process.argv);
    if(program.url){
    console.log("URL mode");
console.log(program.url);
    checkurl(program.url);
 }
    else{
    console.log("File mode");
console.log(program.file);
    var content = fs.readFileSync(program.file);
    var htmlfile = cheerio.load(content);
    var checkJson = checkHtmlFile(htmlfile,program.checks);
    var outJson = JSON.stringify(checkJson, null, 4);
    console.log(outJson);
}
} else {
    exports.checkHtmlFile = checkHtmlFile;
}
