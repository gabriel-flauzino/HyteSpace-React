class Markdown {
	constructor(options) {
		if (options?.rules) for (let rule of options.rules) this.RULES.push(rule)
	}
	
	RULES = [
		[/\&/g, '&amp;'],
		[ /\</g, '&lt;' ],
		[ /\>/g, '&gt;' ],
		[ /\"/g, '&quot;' ],
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
		[ /^#{3}\s?([^\n]+)/gm, '<h3 class="markdown-h3">$1</h3>' ],
		[ /^#{2}\s?([^\n]+)/gm, '<h2 class="markdown-h2">$1</h2>' ],
		[ /^#{1}\s?([^\n]+)/gm, '<h1 class="markdown-h1">$1</h1>'],
		[ /\*\*((?:(?:.|\s)(?!\*\*))+(?:.|\s)|(.|\s))\*\*/g, '<b class="markdown-bold">$1</b>' ],
		[ /\*([^\*]+)\*/g, '<i class="markdown-italic">$1</i>' ],
		[ /__((?:(?:.|\s)(?!__))+(?:.|\s)|(.|\s))__/g, '<i class="markdown-italic">$1</i>' ],
		[ /_([^_]+)_/g, '<u class="markdown-underline">$1</u>' ],
		[ /~~((?:(?:.|\s)(?!~~))+(?:.|\s)|(.|\s))~~/g, '<s class="markdown-strikethrough">$1</s>' ],
		[ /\`\`\`\s?((?:(?:.|\s)(?!\`\`\`))+(?:.|\s)|(.|\s))\`\`\`\n?/g, '<div class="markdown-code-block"><code>$1</code></div>' ],
		[ /`([^`]+)`/g, '<code class="markdown-inline-code">$1</code>' ],
		[ /\|\|((?:(?:.|\s)(?!\|\|))+(?:.|\s)|(.|\s))\|\|/g, '<spoiler class="markdown-spoiler hidden"><span class="hidden-spoiler-text">$1</span></spoiler>' ],
		[ /\[([^\n]+)\]\(([^\n]+)\)|((https?:\/\/[^\s<]+))/g, '<a class="markdown-link" href="$2$4" target="_blank">$1$3</a>' ],
		// [ /(https?:\/\/[^\s\)]+)/g, '<a class="markdown-link" href="$1" target="_blank">$1</a>' ],
		// [ /\[([^\n]+)\]\(\s*<a class="markdown-link" href="(.+)">(?:.+)<\/a>\)/g, '<a class="markdown-link" href="$2" target="_blank">$1</a>' ],
		[/(\d+)\^(\d+)/g, '$1<sup class="markdown-super">$2</sup>'],
		[ /\n/g, '<br>' ],
		[/<u(\d+)>/g, '&#$1;']
	]
	
	parse(str) {
		for (let rule of this.RULES) str = str.replace(...rule)
		return str;
	}
}

export { Markdown };