const config = useRuntimeConfig()

/**
 * 会社ID押下時の処理
 * @param companyId
 */
export const clickCompany = (companyId: number): void => {
    const url = config.public.jmssPortalBaseURL + '/company/' + companyId
    window.open(url)
}


/**
 * 取得したオブジェクトがnullまたはundefinedだった場合の回避処理
 * @param リストに表示するデータ
 */
export const confirmationData = (objectData: any) => {
  return (objectData === null || objectData === undefined) ? '' : getValueObject(Object.values(objectData))
}


/**
 * オブジェクトのvalueを配列で取り出し、表示する
 */
export const getValueObject = (arrayValue: any): string => {
  return arrayValue ? arrayValue.join(',') : arrayValue
}

/**
 *  アプローチ区分の文字列に紐づくコードを設定する処理
 */
export const getApproachTypeCode = (array: any) => {
    array.push({ id: 1, name: '売り打診' })
    array.push({ id: 2, name: '買い打診' })
    array.push({ id: 3, name: '提携打診' })
    array.push({ id: 99, name: 'その他' })
  
    return array
}

/**
 * 代表者年齢算出処理
 */
export const getCeoAge = (ceoBirthday: string) => {
    if (!ceoBirthday || ceoBirthday == undefined) {
      return ''
    }
    const year: number = Number(ceoBirthday.substring(0, 4))
    const month: number = Number(ceoBirthday.substring(5, 7))
    const date: number = Number(ceoBirthday.substring(8, 10))
  
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

/**
 *  tsr内のvalueを取得する処理
 * @param value: 対象データ
 * @param targetKey: ターゲットとなるtsr情報のキー値
 */
export const getTsrData = (value: any, targetKey: string) => {
    // 一覧表示用のデータからidをキーにtsr情報を取得して、targetKeyを添え字にしたvalueを取得する
    return (value && value.tsr) ? value.tsr[targetKey] : ''
}

/**
 * 業種表示変換用処理
 * @param buyneeds
 * @param index
 */
export const getIndutryNames = (industry: any, index?: number): string => {
  const industryNames: string = confirmationData(industry)
  return index === undefined ? industryNames : industryNames.split(",")[index];
}

  