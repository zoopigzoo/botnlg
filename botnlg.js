'use strict'

var fs = require('fs');
var ngcompile = require('./ng-node-compile/main.js');
var underscore = require('underscore');
var path = require('path');

function botnlg(settings) {
    var defaultSetting = {
        tag: '#TH1S1SCOND1T1ON#',
        temptag: '$THISISBADTAG*',
        surroundingtag: 'botnlgtag',
        allowhtmlTags: false,
        addtionalScripts: [
            { name: 'botnlgApp', path: path.join(__dirname, 'botnlg.app.js') }, 
            { name: 'botnlgApp', path: path.join(__dirname, 'botnlg.func.js') }, 
            { name: 'botnlgApp', path: path.join(__dirname, 'botnlg.tag.js') }
        ]
    };
    
    this.settings = underscore.extend(defaultSetting, settings);
    
    var _self = this;
    
    //only generate text, do not check the avalabitliy
    _self.genRawText = function (templateText, renderData) {
        if (!templateText || templateText === '') {
            return '';
        }
        
        var templateString = templateText;
        if (templateString.indexOf("<" + _self.settings.surroundingtag) != 0) {
            templateString = "<" + _self.settings.surroundingtag + ">" + templateString + "</" + _self.settings.surroundingtag + ">";
        }
        
        var rawHtml = '';
        try {
            var ngEnviorment = new ngcompile(_self.settings.addtionalScripts);
            rawHtml = ngEnviorment.$compile(templateString)(renderData || {});
        } catch (e) {
            console.log("genText Error: ");
            console.log(e.message);
            return false;
        }

        if(_self.settings.allowhtmlTags === true) {
            rawHtml = _self.removengtags(rawHtml);
        } else {
            rawHtml = rawHtml.replace(/<(?:.|\n)*?>/gm, '');
        }

        return rawHtml;
    };

    //generate text, and check if some tags are not ava
    _self.genText = function (templateText, renderData) {
        var rawHtml = _self.genRawText(templateText, renderData);

        var index = rawHtml.indexOf(_self.settings["temptag"]);
        if (index >= 0) {
            return '';
        }

        if(_self.settings.allowhtmlTags === true) {
            rawHtml = _self.removengtags(rawHtml);
        } else {
            rawHtml = rawHtml.replace(/<(?:.|\n)*?>/gm, '');
        }

        return rawHtml;
    };

    //generate an array of texts
    _self.genTextArray = function (templateTextArr, renderData) {
        var arr = [];
        for(var i=0;i<templateTextArr.length;i++) {
            var txt = _self.genText(templateTextArr[i], renderData);
            if(txt && txt.length > 0) {
                arr.push(txt);
            }
        }

        return arr;
    };

    //if the condition string is satisfied
    _self.isSat = function (conditionString, renderData) {
        if(!conditionString || conditionString === '') {
            return true;
        }
        
        var templateCondition = conditionString;
        templateCondition = "<" + _self.settings.surroundingtag + " ng-if=\"" + templateCondition + "\">" + _self.settings["tag"] + "</" + _self.settings.surroundingtag + ">";
        
        var ngEnviorment = new ngcompile(_self.settings.addtionalScripts);
        
        var rawHtml = '';
        try {
            rawHtml = ngEnviorment.$compile(templateCondition)(renderData || {});
        } catch (e) {
            console.log("isSat Error: ");
            console.log(e.message);
            return false;
        }
        
        var index = rawHtml.indexOf(_self.settings["tag"]);
        if(index < 0) {
            return false;
        } else {
            return true;
        }
    };

    _self.removengtags = function(html) {
        if(!html || html === '') {
            return '';
        }

        while(/<([a-zA-Z]+) [^>]*?"ng\-[^"]*?"[^>]*?>/im.test(html)) {
            var match = html.match(/<([a-zA-Z]+) [^>]*?"ng\-[^"]*?"[^>]*?>/im);
            var wholematch = match[0];
            var tag = match[1].toLowerCase();
            var index = match.index;
            var nextStartIndex = index + wholematch.length;

            var closeTagStartIndex = _self.findCloseTag(html, nextStartIndex, tag);
            if(closeTagStartIndex === -1) {
                return html;
            }

            html = html.substr(0, closeTagStartIndex) + html.substr(closeTagStartIndex + 3 + tag.length);
            html = html.substr(0, index) + html.substr(nextStartIndex);
        }

        return html;
    };

    _self.findCloseTag = function(text, startindex, tag) {
        var searchtext = text.toLowerCase();
        var starttag = '<' + tag;
        var endtag = '</' + tag;

        var counter = 1;
        while(counter > 0) {
            var stidx = searchtext.indexOf(starttag, startindex);
            var edidx = searchtext.indexOf(endtag, startindex);
            if(stidx == -1 && edidx == -1) {
                return -1;
            } else if(stidx == -1 && edidx != -1) {
                counter --;
                if(counter === 0) {
                    return edidx;
                }

                startindex = edidx + endtag.length;
            } else if(stidx != -1 && edidx == -1) {
                counter ++;
                startindex = stidx + starttag.length;
            } else {
                if(stidx < edidx) {
                    counter ++;
                    startindex = stidx + starttag.length;                   
                } else {
                    counter --;
                    if(counter === 0) {
                        return edidx;
                    }

                    startindex = edidx + endtag.length;                    
                }
            }
        }

        return -1;
    };

    return;
}

module.exports = botnlg;
