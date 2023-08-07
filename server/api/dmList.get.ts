export default defineEventHandler(() => {

  const data = [
    { 
      dmLists: [
        {
          id: 1,
          approachListId: 441,
          sendCompanyCount: 1000,
          matchingStatus: 1
        },
        {
          id: 2,
          approachListId: 442,
          sendCompanyCount: 400,
          matchingStatus: 2
        },
        {
          id: 3,
          approachListId: 443,
          sendCompanyCount: 400,
          matchingStatus: 1
        },
        {
          id: 4,
          approachListId: 444,
          sendCompanyCount: 400,
          matchingStatus: 2
        },
        {
          id: 5,
          approachListId: 445,
          sendCompanyCount: 400,
          matchingStatus: 0
        },
      ],
      message: "処理に成功しました。"
    }
  ]
  return data
  });
  