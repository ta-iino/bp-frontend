const config = useRuntimeConfig()
const { $approach, $jmssPortal }: any = useNuxtApp()

/**
 * 会社ID押下時の処理
 * @param companyId
 */
export const clickCompany = (companyId: number): void => {
  const url = config.public.jmssPortalBaseURL + '/company/' + companyId
  window.open(url)
}

/**
 *  tsr内のvalueを取得する処理
 * @param value: 対象データ
 * @param targetKey: ターゲットとなるtsr情報のキー値
 */
export const getTsrData = (value: any, targetKey: string) => {
  // 一覧表示用のデータからidをキーにtsr情報を取得して、targetKeyを添え字にしたvalueを取得する
  return value ? value[targetKey] : ''
}

/**
 * 業種表示変換用処理(業種名)
 * @param industries
 * @param index
 */
export const getIndutryNames = (industries: any, index?: number): string => {
  if (industries === null || industries === undefined) {
    return ''
  }
  const industryNames: [] = industries.map((industry: any) => Object.values(industry)[0]);
  const res: string = (index === undefined ? industryNames.join(',') : industryNames[index])
  return res
}

/**
 * 業種表示変換用処理(業種コード)
 * @param industries
 * @param index
 */
export const getIndutryCodes = (industries: any, index?: number): string => {
  if (industries === null || industries === undefined) {
    return ''
  }
  const industryCodes: [] = industries.map((industry: any) => Object.keys(industry)[0]);
  const res: string = (index === undefined ? industryCodes.join(', ') : industryCodes[index])
  return res
}

/**
 * 代表者年齢算出処理
 */
export const getCeoAge = (ceoBirthday: string) => {
  if (!ceoBirthday || ceoBirthday == undefined) {
    return ''
  }
  const year = Number(ceoBirthday.substring(0, 4))
  const month = Number(ceoBirthday.substring(5, 7))
  const date = Number(ceoBirthday.substring(8, 10))

  // 今日
  const today = new Date()
  // 生年月日の日付データを取得
  const birthday = new Date(year, month - 1, date)
  // 今年の誕生日の日付データを取得
  const thisYearsBirthday = new Date(today.getFullYear(), birthday.getMonth(), birthday.getDate())
  // 年齢
  let age = today.getFullYear() - birthday.getFullYear()
  if (today < thisYearsBirthday) {
    // 今年まだ誕生日が来ていない
    age--
  }
  return age
}