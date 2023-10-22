class CodeHighlighter {
	constructor(options) {
		if (options?.rules) for (let rule of options.rules) this.RULES.push(rule)
	}
	
	RULES = [
		/* [ /&/g, '&amp;' ], */
		[ /</g, '&lt;' ],
		[ />/g, '&gt;' ],
		[ /"/g, '&quot;' ],
    [ /=/g, '&#61;'],
    [ /'/g, '&#39;'],
		[/\\\\/g, '<u92>'],
		[ /\\\*/g, '<u42>'],
		[ /\\#/g, '<u35>'],
		[ /\\_/g, '<u95>'],
		[ /\\~/g, '<u126>'],
		[ /\\`/g, '<u96>'],
		[ /\\\|/g, '<u124>'],
		[ /\\\[/g, '<91>'],
		[ /\\\]/g, '<u93>'],
		[ /\\\(/g, '<u40>'],
		[ /\\\)/g, '<u41>'],
		[ /&lt;br&gt;/g, '<br>' ],
    [ /(?<=&lt;\w+\s.*?)(&quot;.*?&quot;)(?=.*&gt;)/g, "<span class='string'>$1</span>"],
    [ /(?<=&lt;\w+\s)(.*?)(?=&gt;)/g, "<span class='tagInside'>$1</span>"],
    [ /(?<=&lt;.*)(&#61;)(?=.*&gt;)/g, "<span class='operator'>$1</span>"],
    [ /(?<=&lt;)(.*?)(?=\s|&gt;)/g, "<span class='tagName'>$1</span>"],
    [/(&lt;|&gt;)/g, "<span class='tagBracket'>$1</span>"],
		[/<u(\d+)>/g, '&#$1;']
	]
	
	parse(str) {
		for (let rule of this.RULES) str = str.replace(...rule)
		return str;
	}
}

export { CodeHighlighter };