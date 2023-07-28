export default defineEventHandler(() => {

  const data = [
    { 
      DmListList: [
        {
          dmListId: 1,
          approachListId: 111111111111,
          sendCompanyCount: 1000
        },
        {
          dmListId: 2,
          approachListId: 2222222222,
          sendCompanyCount: 400
        },
      ],
      message: "処理に成功しました。"
    }
  ]
  return data
  });
  