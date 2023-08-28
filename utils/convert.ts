// utils配下は自動importされる

/**
 * 企業取得APIで取得したデータの業種名の配列を返す
 */
// TODO 以前のAPI戻り値仕様の名残なので削除してもよい。
export const getCompanyIndustryNameArray = (indutries: string): string[] => {
  const industriesArray: string[] = indutries.split('\n')
  const indutryNameArray: string[] = industriesArray.filter(item => item.trim() !== '').map(item => item.split(' ').slice(1).join(' '))
  return indutryNameArray
}

/**
 * オブジェクトのvalueを配列で取り出し、表示する
 */
export const getValueObject = (arrayValue: any): string => {
  const joinObject = arrayValue.join(',')
  return joinObject
}

/**
 *  APIから取得した日時をYYYY-MM-DDにフォーマットする
 */
export const formatDate = (date: any): any => {
  return date.slice(0, 10)
}

/**
 *  マッチングステータスのコードに紐づくを文字列に変換する処理
 */
export const getMatchngStatusStr = (codeValue: any): any => {
  if (codeValue === 1) {
    return 'マッチング中'
  } else if (codeValue === 2) {
    return 'マッチング済'
  }
  return ' - '
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
export const getCeoAge = (ceoBirthday: any) => {
  if (ceoBirthday !== null || ceoBirthday !== undefined) {
    const year = ceoBirthday.substring(0, 4)
    const month = ceoBirthday.substring(5, 7)
    const date = ceoBirthday.substring(8, 10)

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
}
