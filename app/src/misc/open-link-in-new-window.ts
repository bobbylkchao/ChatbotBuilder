export const addTargetAttrToHyperLink = (htmlString: string) => {
  return htmlString.replace(/<a\s+([^>]*?)>/gi, function (match, p1) {
    if (/href\s*=\s*['"]?tel:/i.test(p1)) {
      return match
    }
    if (!/target\s*=\s*['"]?_blank['"]?/i.test(p1)) {
      return `<a ${p1} target='_blank'>`
    }
    return match
  })
}
