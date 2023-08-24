// 買いニーズマッチング履歴取得APIモック
export default defineEventHandler(() => {

    const data = {
        "dmListId": 10,
        "buyneedsMatchingHistories":[
          {
            // 買いニーズマッチング履歴ID	
            // 処理日時	
            // マッチング状況	
            // ジョブID
            // 発送社数
            "id": 3,
            "processedDatetime": "2023-10-10 11:22:33",
            "matchingStatus": 1,
            "jobId": "xxxxxx-xxxxx-xxxxx",
            "sendCompanyCount": 1000
          },
          {
            "id": 1,
            "processedDatetime": "2023-08-10 00:10:11",
            "matchingStatus": 2,
            "jobId": "xxxxxx-xxxxx-xxxxx",
            "sendCompanyCount": 100
          },
          {
            "id": 4,
            "processedDatetime": "2023-08-01 00:01:02",
            "matchingStatus": 2,
            "jobId": "xxxxxx-xxxxx-xxxxx",
            "sendCompanyCount": 100
          }

        ]
      }

      return data;
    
  });