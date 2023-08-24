// 発送企業履歴取得APIモック
export default defineEventHandler(() => {

    const data = {
        "buyneedsMatchingHistoryId": 5,
        "sendCompanyHistories":[
            {
                // 発送企業履歴ID
                // 企業マスタID
                "id": 9,
                "companyId": "15"
            },
            {
                "id": 2,
                "companyId": "21"
            }
        ]
    }
    
    return data;
})