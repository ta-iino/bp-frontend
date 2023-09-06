// utils配下は自動importされる

/**
 * オブジェクトのvalueを配列で取り出し、表示する
 */
// TODO 空判定
export const getValueObject = (arrayValue: any): string => {
  if(!arrayValue) {
    return arrayValue
 }
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
  if (codeValue === "1") {
    return 'マッチング中'
  } else if (codeValue === "2") {
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
// TODO 空判定
export const getCeoAge = (ceoBirthday: any) => {
  if (!ceoBirthday || ceoBirthday == undefined) {
    return ''
  }
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

/**
 * 取得したオブジェクトがnullまたはundefinedだった場合の回避処理
 * @param リストに表示するデータ
 */
export const confirmationData = (objectData: any) => {
  if (objectData === null || objectData === undefined) {
    return ''
  }
  return getValueObject(Object.values(objectData))
  
}