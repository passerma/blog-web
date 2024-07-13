import Log from "./log"

export const generateTime = process.env.generate_time

Log.info('网站构建时间', generateTime)

export function translateText(text: string) {
  return text.replace(/&nbsp;/gi, '')
}

export default {}
