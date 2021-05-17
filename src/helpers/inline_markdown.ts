import { parseInline } from 'marked';

export default function (text: string): string {
  return parseInline(text, { gfm: true, sanitize: false, xhtml: true });
}