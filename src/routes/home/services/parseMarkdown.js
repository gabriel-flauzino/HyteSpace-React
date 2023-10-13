import { Markdown } from "../../../classes/Markdown";
import { setConfig, sanitize } from "dompurify";

const markdown = new Markdown()

setConfig({
  ALLOWED_TAGS: ['b', 'i', 'u', 'code', 'h1', 'h2', 'h3', 's', 'div', 'spoiler', 'a', 'br', 'span', 'sup', 'target'],
  ALLOWED_ATTR: ['href', 'class', 'target']
});

export default function parseMarkdown(str) {
  return sanitize(markdown.parse(str))
}