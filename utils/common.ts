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
  return arrayValue ? arrayValue.join(', ') : arrayValue
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
 * 閉じるボタン押下時の処理
 */
export const clickCloseButton = (): void => {
  window.close()
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