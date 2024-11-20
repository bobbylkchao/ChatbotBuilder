export const getDomainFromUrl = (url: string): string => {
  const regex =
    /^(?:https?:\/\/)?(?:[^/:]+\.)?([a-zA-Z0-9-]+\.[a-zA-Z]+|localhost|[0-9.]+)(?::\d+)?(?:\/|$)/
  const match = url.match(regex)
  return match?.[1] || ''
}
