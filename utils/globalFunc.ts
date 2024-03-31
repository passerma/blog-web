export const generateTime = process.env.generate_time

export function translateText(text: string) {
  return text.replace(/&nbsp;/gi, '')
}

export default {}
