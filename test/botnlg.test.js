describe("botnlg", function () {
    var expect = require("chai").expect;
    var botnlg = require('../botnlg.js');
    var _lib = new botnlg();
    var _libwithhtml = new botnlg({allowhtmlTags: true});

    it('basic template engine is working', function () {
        expect(_lib.genText('<div><b>I\'m OK</b></div>', null)).to.equal('I\'m OK');
        expect(_libwithhtml.genText('<b>I\'m OK</b>', null)).to.equal('<b>I\'m OK</b>');
    });

    it('tag plugin is working' ,function() {
        var testData = {
            date: {
                hour: 9
            }
        };

        expect(_lib.genText('Hi, <timeofday data="date"></timeofday>好', testData)).to.equal('Hi, 早上好');
    });

    it('isSat is working', function() {
        var context = {
            refer: {
                url: 'https://www.linkedin.com/',
                domain: 'www.linkedin.com'
            },
            history: [
                {
                    state: {
                        state: 'good'
                    }
                }
            ]
        };

        expect(_lib.isSat("domainIsLinkedIn(refer) === true", context)).to.be.ok;
    });

    it('finding close tag', function() {
        expect(_lib.findCloseTag('<botnlgtag class="ng-scope">嘘，刘晓江他在开会，你知道<timeofday data="date" class="ng-isolate-scope">下午</timeofday>总是有很多会要开。</botnlgtag>'
            , '<botnlgtag class="ng-scope">'.length, 'botnlgtag')).to.equal('<botnlgtag class="ng-scope">嘘，刘晓江他在开会，你知道<timeofday data="date" class="ng-isolate-scope">下午</timeofday>总是有很多会要开。</botnlgtag>'.indexOf('</botnlgtag>'));

        expect(_lib.findCloseTag('<timeofday><botnlgtag class="ng-scope">嘘，刘晓江他在开会，你知道<timeofday data="date" class="ng-isolate-scope">下午</timeofday>总是有很多会要开。</botnlgtag></timeofday>'
            , '<timeofday>'.length, 'timeofday')).to.equal('<timeofday><botnlgtag class="ng-scope">嘘，刘晓江他在开会，你知道<timeofday data="date" class="ng-isolate-scope">下午</timeofday>总是有很多会要开。</botnlgtag></timeofday>'.length - '</timeofday>'.length);

        expect(_lib.findCloseTag('<timeofday><botnlgtag class="ng-scope">嘘，刘晓江他在开会，你知道<timeofday data="date" class="ng-isolate-scope">下午</timeofday>总是有很多会要开。</botnlgtag>'
            , '<timeofday>'.length, 'timeofday')).to.equal(-1);            
    });
    
    it('remove html tags', function() {
        expect(_lib.removengtags('我？我是他的机器人。我就是他，他就是我。'))
            .to.equal('我？我是他的机器人。我就是他，他就是我。');
        expect(_lib.removengtags('<botnlgtag class="ng-scope">我？我是他的机器人。我就是他，他就是我。</botnlgtag>'))
            .to.equal('我？我是他的机器人。我就是他，他就是我。');
        expect(_lib.removengtags('<botnlgtag class="ng-scope">我？我是他的<botnlgtag class="ng-scope">机器人</botnlgtag>。我就是他，他就是我。</botnlgtag>'))
            .to.equal('我？我是他的机器人。我就是他，他就是我。');
        expect(_lib.removengtags('<botnlgtag class="ng-scope">嘘，刘晓江他在开会，你知道<timeofday data="date" class="ng-isolate-scope">下午</timeofday>总是有很多会要开。</botnlgtag>'))
            .to.equal('嘘，刘晓江他在开会，你知道下午总是有很多会要开。');
    });
});