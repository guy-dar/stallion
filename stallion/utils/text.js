

 function stallionRegexpMatch(query, contents, qGroup){
        var matches = [];
        var matchLengths = [];
        var matchNames = [];

        for(let matchInfo of contents.matchAll(query)){
            var match = matchInfo.index;
            matches.push(match);
            matchLengths.push(matchInfo[0].length);
            matchNames.push(matchInfo[qGroup])
        }
        return {matches, matchLengths, matchNames}
}


export {stallionRegexpMatch};