# botnlg

natural language generation for chat bot

# why botnlg?

Refer to **./test/botnlg.test.js**

# features

1. Supporting custom tags

Make custom tags as directives in botnlg.tag.js. 
Refer to **botnlg.tag.js** to see how to implement a custom tag **timeofday** 

2. Supporting custom function

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