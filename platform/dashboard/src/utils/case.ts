export function toSentenceCase(str: string) {
  return str.replace(
    /(^\s*[a-z])|([.!?]\s+[a-z])/g,
    match => match.toUpperCase()
  );
}
