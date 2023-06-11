export function stripHtml(html: string): string {
  return html.replace(/(<([^>]+)>)/gi, '');
}

export function stripHtmlAndNewLineAndExtraSpace(html: string): string {
  return stripHtml(html)
    .replace(/\n/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}
