/**
 * Example for using LWIP to blend two images.
 */

var path = require('path'),
    async = require('async'),
    lwip = require('pajk-lwip');
fs = require('fs');
config = require("./config");
path = require("path");
var mkdirp = require('mkdirp');

let reduce = (arr, folder, done = name => console.log(name)) => {
    if (arr && arr.length > 0)
        return async.map(arr, open, (err, result) => async.reduce(result, 0, pasteAsync, writeFile));
    else done("empty src in config");

    function open(folder, callback) {
        let files = getFiles('./images/' + folder);
        let file = files[getRandomInt(0, files.length)];
        if (file)
            lwip.open(file, function (err, image) {
                console.log("open: "+  file);
                callback(err, image);
            });
        else logError(folder + " is empty");
    }

    function pasteAsync(image, next, callback) {
        if (image != 0) {
            image.paste(0, 0, next, (err, image) => callback(null, image));
        }
    else
        callback(null, next);
    }
    function writeFile(err, image) {
        if (!err)
            {
                mkdirp(path.join(__dirname + "/public/queue/" + folder), () => {
                let name = new Date() + 'paste.png';
                //let name = '!first.png';
                image.writeFile('./public/queue/' + folder + "/" + name, function (err) {
                                logError(err);
                                done(name);
                            });
                        }
                    );
            }
    else logError(err);
    }

    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }
    function getFiles(dir) {
        let fileList = [];
        try {
            let files = fs.readdirSync(dir);
            for (let i in files) {
                if (!files.hasOwnProperty(i)) continue;
                let name = dir + '/' + files[i];
                if (!fs.statSync(name).isDirectory() && name.toLocaleLowerCase().endsWith(".png")) {
                    fileList.push(name);
                }
            }
        } catch (err) {
            let folder = path.join(__dirname);
            console.log(err, "folder: "+ folder);
        }
        return fileList;
    }

    function logError(err) {
        if (err) console.log(err);
    }
};

exports.reduce = reduce;


