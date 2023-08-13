// utils配下は自動importされる

/**
 * 企業取得APIで取得したデータの業種名の配列を返す
 */ 

export const getCompanyIndustryNameArray = (indutries: string): string[] => {
    const industriesArray: string[] = indutries.split("\n");
    const indutryNameArray: string[] = industriesArray.filter(item => item.trim() != "").map(item => item.split(" ").slice(1).join(" "))
    return indutryNameArray;
}

/**
 * オブジェクトのvalueを配列で取り出し、表示する
 */
export const  getValueObject = (arrayValue: any): string => {
    let joinObject = arrayValue.join(",")
    return joinObject;
}

/**
 *  APIから取得した日時をYYYY-MM-DDにフォーマットする
 */
export const formatDate = (date: any): any => {
    return date.slice(0, 10)
}