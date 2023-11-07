/**
 * CSVファイルの作成
 * @param csvContent 
 * @param title 
 */
export const createCsv = (csvContent: any, title: string): void => {
    const bom = new Uint8Array([0xef, 0xbb, 0xbf])
    const blobData = new Blob([bom, csvContent], { type: "text/csv" })
    const downloadLink = document.createElement('a')
    downloadLink.href = window.URL.createObjectURL(blobData)
    downloadLink.download = title
    downloadLink.click()
    URL.revokeObjectURL(downloadLink.href)
}
  
/**
 * エスケープ処理(Excelの同じセル内に収まるようにする)
 * @param value 
 */
export const csvEscape = (value: any) => {
    if (value === null || value === undefined) {
        return value
    }
    if (typeof value === "string" || value instanceof String) {
        if (value.includes(', ') || value.includes('\n')) {
        return `"${value}"`;
        }
    }
    return value;
}