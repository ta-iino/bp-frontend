export const get_header_items = (approachListCamelData: any, matchingHistories: any) => {
  return [
    { title: '担当チーム', value: confirmationData(approachListCamelData.requestTeam) },
    { title: '担当コンサル', value: confirmationData(approachListCamelData.requestUsers) },
    { title: 'リスト名', value: approachListCamelData.name },
    { title: 'アプローチ区分', value: approachListCamelData.type },
    { title: '業種', value: confirmationData(approachListCamelData.jmssIndustries) },
    { title: '地域', value: confirmationData(approachListCamelData.areas) },
    { title: '売上', value: confirmationData(approachListCamelData.salesRanges) },
    { title: '発送社数', value: matchingHistories.value.buyneedsMatchingHistories[0].sendCompanyCount },
    { title: '利用業者名', value: approachListCamelData.venderName },
    { title: '備考', value: approachListCamelData.note },
    { title: '', value: '' }, // 画面レイアウト上空欄を作るため
    { title: '', value: '' }, // 画面レイアウト上空欄を作るため
    { title: '発送日', value: approachListCamelData.dmDate },
    { title: '登録日', value: formatDate(approachListCamelData.createdAt) },
    { title: '状況', value: getMatchingStatusStr(matchingHistories.value.buyneedsMatchingHistories[0].matchingStatus) }
  ]
}
