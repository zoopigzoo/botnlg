# botnlg

natural language generation for chat bot

# how to use

Refer to **./test/botnlg.test.js**

# features

## Supporting custom tags

Make custom tags as directives in botnlg.tag.js. 
Refer to **botnlg.tag.js** to see how to implement a custom tag **timeofday** 

## Supporting custom function

Make custom functions in botnlg.func.js. 
Refer to **botnlg.func.js** to see how to implement a custom function **domainIsLinkedIn** 

```javascript

var context = {
    refer: {
        url: 'https://www.linkedin.com/',
        domain: 'www.linkedin.com'
    }
};

_lib.isSat("domainIsLinkedIn(refer) === true", context) === true

```