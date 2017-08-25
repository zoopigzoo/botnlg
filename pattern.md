# Semantic Pattern

Semantic Pattern is a token based matching syntax used in Deep IE (Deep Information Extraction) to do rule based information extraction from texts. 
For example, you could use a semantic pattern to extract spouse relationship with the following pattern:

```
($) (\e{1}) (is|was) (the) (wife|spouse|ex-wife) (of) (\e{1})
```

Specificly, Semantic Pattern library provides the supports for:

1. A token based pattern matching syntax
2. An information extraction library for matching texts and extracting specific information from text
3. A library for automatically suggesting patterns
4. An easy-to-use Web interface for crafting and modifying patterns, also evaluation and publishing.


## Current Version

1.0

## Installation

NuGet Package Manager is required to install the library.

> If not, refere to NuGet website to see how to instal it.

Add TextWrapper nuget source to your 'Package Sources'

> click Tools -> NuGet Package Manager -> Package Manager -> Package Sources in Visual Studio
> click Add button on the top-right, and input 'http://zoolib.azurewebsites.net/nuget' in the Source input box
> click Update to add the source

Add Semantic Pattern Library to your project

> Right click on the project name, and click 'Manage NuGet Packages'
> Select **xiaojiang** & **TextWrapperLib** if you only want to use pattern matching
> Select **TextWrapper Viewer** (applicable to Web Applications) if you want have a Web Interface to view & modify the patterns


## Usage

### Import Library

```c#
using TextWrapperLib;
```

### Test if a sentence matches with a pattern

```c#
string testSentence = "Bill Gates is the founder of Microsoft";
var tokenSentence = TokenSentence.BuildEnglishFromString(testSentence);
var matchingPattern = new TokenPattern(@"(\e{1}) (is|was) (\p{POS}) (founder) (of) (\e{3})");
var matchResults = matchingPattern.Matches(tokenSentence);
Assert.IsTrue(matchResults.Count > 0);
```

### Get groups from matched text

```c#
string testSentence = "Bill Gates is the founder of Microsoft";
var tokenSentence = TokenSentence.BuildEnglishFromString(testSentence);
var matchingPattern = new TokenPattern(@"(:[p1]\e{1}) (is|was) (\p{POS}) (:[rel]founder) (of) (:[p2]\e{3})");
var matchResults = matchingPattern.Matches(tokenSentence);
Assert.IsTrue(matchResults.Count > 0);
foreach(var match in matchResults)
{
    string person1 = match.GroupString("p1");
    string person2 = match.GroupString("p2");
    string relation = match.GroupString("rel");
    // store the results
}
```

### Information Extraction using multiple patterns

```c#

List<Tuple<int,string,string>> pts = new List<Tuple<int,string,string>>() {
    new Tuple<int,string,string>(-1,@"(:[o]\e{3}) (:[t]$TITLE) (and) (\e{3}) ($TITLE) (:[p]\e{1})",""),
    new Tuple<int,string,string>(-1,@"(:[o]\e{3}) (:[t]$TITLE) (and) ($TITLE) (:[p]\e{1})",""),
    new Tuple<int,string,string>(-1,@"(:[o]\e{3}) (:[t]$TITLE) (:[p]\e{1})",""),
};
Dictionary<string,string> wordset = new Dictionary<string,string>() {
    {"$TITLE","founder|ceo|cfo|coo|researcher"}
};
string testSentence = "Bill Gates is the founder of Microsoft";
var tokenSentence = TokenSentence.BuildEnglishFromString(testSentence);
SemanticExtractor titleExtractor = new SemanticExtractor(-1,"TITLE","Profession Extraction", "p:Person;t:Title;o:Orgnization", pts, wordset, var extractions = titleExtractor.Extract(tokenSentence);
foreach(var ex in extractions)
{
    var personGroup = ex.GetGrpInfo("p");
    var titleGroup = ex.GetGrpInfo("t");
    var orgGroup = ex.GetGrpInfo("o");
    // store the results
}

```

## Pattern Syntax

A semantic pattern is a string built from semantic tokens, while every semantic token is surrounded by **(** and **)**. Right after **(**, there could be **repetition** identifiers and **group** identifiers.

### Supported Semantic Tokens

Semantic tokens are the basic elements for building a semantic pattern.

| *Syntax* | *Meaning* | *Example* |
|---|---|---|
| (w1) | match tokens with string w1 | (founder) |
| (\p{POS}) | match a token with POS Tag **POS** | (\p{JJ}) matches with a Adjective token |
| (\n{PHRASE}) | match tokens with phrase tag **PHRASE** | (\n{VP}) matches with a verb phrase |
| (\e{ETYPE}) | match tokens with named entity type | (\e{1}) matches with a peson name |
| (\r{regex}) | match tokens with regex expressions | (\r{[A-Z]*}) matches a full capitialized token |
| (\m{pattern}) | match tokens with nested patterns | (\m{($TITLE) (\e{1})}) matches with inner pattern |
| (×) | match any token | (×) matches with any token |

### Quantifiers

quantifiers are defined right after the ( to specify the group properties, multiple quantifiers could be used together

| *Syntax* | *Meaning* | *Example* |
|---|---|---|
| ? | could be skipped | (?\p{JJ}) matches with a Adjective token or skip it |
| * | multiple none or more | (?\p{JJ}) matches with none or more Adjective tokens |
| + | multiple none or more | (?\p{JJ}) matches with none or more Adjective tokens |
| {n1,n2} | match n1 to n2 | ({1,2}\p{JJ}) matches with 1-2 Adjective tokens |
| {,n2} | match 0 to n2 | ({,2}\p{JJ}) matches with 0-2 Adjective tokens |
| {n1,} | match at least n1 | ({1,}\p{JJ}) matches with at least 1 Adjective tokens |
| {n} | match n  | ({2}\p{JJ}) matches with 2 Adjective tokens |

### Groups

groups are used to retrieve the extraction results, should be right after ( or the quantifiers

| *Syntax* | *Meaning* | *Example* |
|---|---|---|
| :[gp] | specify group name | (:[t]founder) |


## Visualization Library

DOC TODO

## Change Logs

### v1.0

1. Initial release


## Contact Information

Ping 7*24 assistant xiaojl at microsoft.com if you have any problems
