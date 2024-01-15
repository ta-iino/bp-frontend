// utils配下は自動importされる

/**
 *  APIから取得した日時をYYYY-MM-DDにフォーマットする
 */
export const formatDate = (date: string): string => {
  return date.slice(0, 10)
}

/**
 *  マッチングステータスのコードに紐づくを文字列に変換する処理
 */
export const getMatchingStatusStr = (codeValue: string): string => {
  switch (codeValue) {
    case "1":
      return 'マッチング中'
    case "2":
      return 'マッチング済'
    case "3":
      return 'マッチング失敗'
    default:
      return ' - '
  }
}