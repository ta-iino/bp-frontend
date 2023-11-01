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
export const getMatchngStatusStr = (codeValue: string): string => {
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

/**
 * 現在時刻をyyyymmdd_hhmm形式で取得する
 */

export const getCurrentTime = (): string => {
  // 現在の時刻を取得
  const currentDate = new Date();

  // 年、月、日、時、分を取得
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // 月は0から始まるため、+1する
  const day = String(currentDate.getDate()).padStart(2, '0');
  const hours = String(currentDate.getHours()).padStart(2, '0');
  const minutes = String(currentDate.getMinutes()).padStart(2, '0');
  
  // yyyymmdd_hhmm形式で表示
  const formattedDate = `${year}${month}${day}_${hours}${minutes}`;
  return formattedDate
}