<template>
  <div id="app">
    <!-- ヘッダ部分 ここから -->
    <v-container class="pb-0">
      <v-row>
        <v-col cols="12" class="px-0 my-3 py-0" style="background-color: #81D4FA">
          <v-card-title class="headline font-weight-bold">
            DM発送先企業一覧
          </v-card-title>
        </v-col>
      </v-row>
      <v-row>
        <v-col v-for="(item) in items" :key="item.title" cols="4" class="d-flex px-0 py-0">
          <!-- 上が少しはみ出るのでv-if:0<=i, i<=2で対応？ -->
          <v-col cols="6" class="px-0 py-1">
            {{ item.title }}
          </v-col>
          <v-col cols="6" class="px-0 py-1">
            {{ item.value }}
          </v-col>
        </v-col>
      </v-row>
      <v-row class="py-3">
        <v-col cols="3" class="px-0">
          <v-select
            v-model="selectedBuyneedsHistoryId"
            label="マッチング処理日時"
            filled
            :items="processingDateList"
            item-value="id"
            item-title="processingDate"
            @update:modelValue="getBodyData"
          />
        </v-col>
        <v-col cols="1" class="px-0" />
        <v-col cols="4" class="px-0 d-flex">
          <div class="ml-n8 mr-2">
            <v-btn
              class="v-btn"
              depressed
              color="light-blue-darken-4"
              border="0"
              :disabled="activeBtn"
              @click="matchingStart()"
            >
              ニーズマッチング
            </v-btn>
          </div>
          <div class="px-2">
            <v-btn
              class="v-btn"
              depressed
              color="light-blue-darken-4"
              border="0"
              :disabled="activeBtn"
              @click="downloadCsv()"
            >
              ダウンロード
            </v-btn>
          </div>
          <div class="px-2">
            <v-btn class="v-btn" depressed color="light-blue-darken-4" border="0" @click="clickCloseButton()">
              閉じる
            </v-btn>
          </div>
        </v-col>
        <v-col cols="4" class="pt-4 pl-10">
          <v-row>
            <v-text-field cols="10" v-model="searchCompanyName" label="企業名検索" />
            <v-col cols="2">
              <v-btn class="ui-btn" depressed color="light-blue-darken-3" @click="searchCompany()">
                  <v-icon dark size="large">
                    mdi-magnify
                  </v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
        
    </v-row>
        
    </v-container>
    <!-- ヘッダ部分 ここまで -->
    <!-- 一覧表示 ここから -->
    <v-container v-if="filteredMatchingHistory.matchingStatus == 2" class="ui-vcontaoner pt-0 mb-4">
      <v-data-table
        :headers="destinationCompanyHeaders"
        :items="destinationCompanies"
        :items-per-page="perPage"
        hide-default-footer
        class="elevation-1 ui-vdatatable"
        :height="528"
        fixed-header
      >
        <template #[`item.zip`]="{ item }">
          {{ putHyphen(item.raw.zip) }}
        </template>
        <template #[`item.industry1`]="{ item }">
          {{ getIndutryNames(item.raw.industries, 0) }}
        </template>
        <template #[`item.industry2`]="{ item }">
          {{ getIndutryNames(item.raw.industries, 1) }}
        </template>
        <template #[`item.industry3`]="{ item }">
          {{ getIndutryNames(item.raw.industries, 2) }}
        </template>
        <template #[`item.businessItems`]="{ item }">
          {{ getTsrData(item.raw.tsr, '営業種目') }}
        </template>
        <template #[`item.representativeAge`]="{ item }">
          {{ getCeoAge(getTsrData(item.raw.tsr, '生年月日')) }}
        </template>
        <template #bottom>
          <div class="text-center pt-2">
            <v-pagination
              v-model="page"
              cols="12"
              :length="totalPage"
              :total-visible="12"
            />
          </div>
        </template>
        <template #[`item.id`]="{ item }">
          <span class="link" @click="clickCompany(item.raw.id)">{{ item.raw.id }}</span>
        </template>
        <template #[`item.matchingResult`]="{ item }">
          <v-btn width="120" small class="mr-2 ui-matching-btn ui-btn" color="light-blue-darken-3" @click="showMatchingResult(item.raw.id)">
            マッチング結果
          </v-btn>
        </template>
      </v-data-table>
      <!-- 一覧表示 ここまで -->
    </v-container>
    <v-row v-else>
      <v-col cols="12" class="pt-4 pl-10 text-center">
        表示中です。なお、マッチング中の場合には表示されませんので、完了後に再表示ください。
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { VDataTable } from 'vuetify/lib/labs/components.mjs'
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import '@mdi/font/css/materialdesignicons.css'
import camelcaseKeys from 'camelcase-keys'

/**
 * 初期値設定
 */
const route = useRoute()
const router = useRouter()
const { $approach, $jmssPortal } = useNuxtApp()
const page: Ref<number> = ref(1)
const perPage: Ref<number> = ref(50)
const totalPage: Ref<number> = ref(0)
const searchCompanyName: Ref<string> = ref('')
watch(page ,() => {
  getCompanyData(searchCompanyName.value)
})
const approachListId: string = String(route.params.id)
// 発送企業データ(社内ポータル接続)
const destinationCompanies: Ref<any> = ref()
// 発送企業履歴データ（バックエンド接続）
const sendCompanyHistories: Ref<any> = ref()
const sendCompanyIds: any = []

/**
 * マッチング処理日時リスト作成
 */
const matchingHistories: any = await $approach.getBuyneedsMatchingHistory(Number(approachListId))
const dmListId: number = ref(matchingHistories.value.dmListId)
// json形式のリスト{id: 買いニーズマッチング履歴テーブルID, processingDate: マッチング処理日時}を作成
const processingDateList: any = ref(
  (matchingHistories.value.buyneedsMatchingHistories).filter((matchingHistories: any) => matchingHistories.id && matchingHistories.processedDatetime)
  .map((matchingHistories: any) => ({ id: matchingHistories.id, processingDate: matchingHistories.processedDatetime }))
)
// 最新のマッチング処理日時をAPIに渡す
const selectedBuyneedsHistoryId: Ref<number> = ref(processingDateList.value[0].id)

/**
 * ヘッダ部
 */
const approachListData: any = await $jmssPortal.getApproachLists(approachListId)
// 取得したデータのキーをキャメルケースに変換する
const approachListCamelData = camelcaseKeys(approachListData.value.data[0], { deep: true })
const items = [
  { title: '担当チーム：', value: confirmationData(approachListCamelData.requestTeam) },
  { title: '担当コンサルタント：', value: confirmationData(approachListCamelData.requestUsers) },
  { title: 'リスト名：', value: approachListCamelData.name },
  { title: 'アプローチ区分：', value: approachListCamelData.type },
  { title: '業種：', value: confirmationData(approachListCamelData.jmssIndustries) },
  { title: '地域：', value: confirmationData(approachListCamelData.areas) },
  { title: '売上：', value: confirmationData(approachListCamelData.salesRanges) },
  { title: '発送社数：', value: matchingHistories.value.buyneedsMatchingHistories[0].sendCompanyCount },
  { title: '利用業者名：', value: approachListCamelData.venderName },
  { title: '備考：', value: approachListCamelData.note },
  { title: '', value: '' }, // 画面レイアウト上空欄を作るため
  { title: '', value: '' }, // 画面レイアウト上空欄を作るため
  { title: '発送日：', value: approachListCamelData.dmDate },
  { title: '登録日：', value: formatDate(approachListCamelData.createdAt) },
  { title: '状況：', value: getMatchngStatusStr(matchingHistories.value.buyneedsMatchingHistories[0].matchingStatus) }
]




/**
 * ボディ部のデータ取得メソッド
 */
const getBodyData = async (): Promise<void> => {
  // 発送企業履歴リストから会社IDの配列を作成する
  const sendCompanyHistoryResponse: any = await $approach.getSendCompanyHistory(selectedBuyneedsHistoryId.value);
  if(sendCompanyHistoryResponse === undefined) {
    initBodyData();
  }
  sendCompanyHistories.value = sendCompanyHistoryResponse.value.sendCompanyHistories;
  sendCompanyIds.value = sendCompanyHistories.value.map((sendCompanyHistory: any) => sendCompanyHistory.companyId);
  getCompanyData();
}

/**
 * ボディ部の初期化処理
 */
const initBodyData = (): void => {
  sendCompanyHistories.value = null;
  sendCompanyIds.value = null;
  destinationCompanies.value = null;
  totalPage.value = 0;
}

/**
 * 企業情報取得共通処理(企業検索時以外は会社名を渡さないのでmethodsで実装)
 * @param searchCompanyName
 */
const getCompanyData = async (searchCompanyName?: string): Promise<any> => {
  const companies: any = (
    await $jmssPortal.getCompanies((sendCompanyIds.value).join(), page.value, perPage.value, searchCompanyName)
  )
  // キャメルケースに変換
  destinationCompanies.value = camelcaseKeys(companies.value.data, { deep: true })
  // 合計ページ(total÷1ページ当たりの表示数)をtotalPageに格納する
  totalPage.value = Math.ceil(companies.value.total / perPage.value)
}
// ヘッダ
const destinationCompanyHeaders = [
  { title: '', key: 'matchingResult', sortable: false, width: 50, color: '#b3e5fc' },
  { title: 'マスタID', key: 'id', sortable: false, width: 100 },
  { title: '企業名', key: 'name', sortable: false, width: 200 },
  { title: '代表者名', key: 'representativeName', sortable: false, width: 150 },
  { title: '郵便番号', key: 'zip', sortable: false, width: 150 },
  { title: '所在地', key: 'address', sortable: false, width: 250 },
  { title: '売上　(百万円)', key: 'sales', sortable: false, width: 100 },
  { title: '営業利益(百万円)', key: 'profit', sortable: false, width: 100 },
  { title: '業種1', key: 'industry1', sortable: false, width: 150 },
  { title: '業種2', key: 'industry2', sortable: false, width: 150 },
  { title: '業種3', key: 'industry3', sortable: false, width: 150 },
  { title: '営業種目', key: 'businessItems', sortable: false, width: 200 },
  { title: '代表者年齢', key: 'representativeAge', sortable: false, width: 120 },
  { title: '従業員数', key: 'employees', sortable: false, width: 100 }
]
// 初期表示時、表示データの呼び出し
getBodyData();


/**
 * 一覧表示用郵便番号の「-」追加処理
 * @param zip: 一覧表示データの郵便番号
 */
const putHyphen = (zip: any) => {
  if (zip === null || zip === undefined) {
    return ''
  }
  const startNum = zip.substring(0, 3)
  const endNum = zip.substring(3, 7)
  const newZip = startNum + '-' + endNum
  return newZip
}

/**
 * 企業名の検索処理
 */
const searchCompany = () => {
  page.value = 1
  getCompanyData(searchCompanyName.value)
}

/**
 * ニーズマッチングボタン押下時の処理
 */
const matchingStart = async (): Promise<void> => {
  // マッチング処理開始APIの呼び出し
  await $approach.startBuyneedsMatching(dmListId)
  // データ作成及びジョブ送信が完了したら(エラーが起こらなければ)リロードする
  location.reload();
}

/**
 * ダウンロード押下時の処理
 */
const downloadCsv = async (): Promise<void> => {
  // 事前データの取得
  var sendCompanyHistoryMap: any = {};
  sendCompanyHistories.value.map((sendCompanyHistory: any) => sendCompanyHistoryMap[sendCompanyHistory["id"]] = sendCompanyHistory["companyId"]);
  const sendCompanyDataList: any = await callUpToTotalNum(sendCompanyIds.value.join(), false);
  const sendCompanyDataValues: any = Object.values(sendCompanyDataList);
  const buyneedsMatchingResults: any = await $approach.getBuyneedsMatchingResult(Object.keys(sendCompanyHistoryMap).map(Number));
  var buyCompanyList:any = [];
  var buyneedsList: any = [];
  if (buyneedsMatchingResults.value) {
    const buyCompanyIds: number[] = buyneedsMatchingResults.value.map((item: { candidateCompanyId: number; }) => item.candidateCompanyId);
    const buyneedsIds: number[] = buyneedsMatchingResults.value.map((item: { buyneedsId: number; }) => item.buyneedsId);
    buyCompanyList = await callUpToTotalNum(buyCompanyIds.join(), false);
    buyneedsList = await callUpToTotalNum( buyneedsIds.join());
  }

  const relationKeyDict = createRelationKeyDict(buyneedsMatchingResults, sendCompanyHistoryMap)
  const [buyCompanyCount, csvDataList]: any = createCsvDataList(sendCompanyDataValues, relationKeyDict, buyCompanyList, buyneedsList);
  var output: any = []
  output.push(createCsvHeader(buyCompanyCount));
  csvDataList.map((csvData: any) => output.push(csvData))
  // 先頭に,が入らないよう処理する
  const csvContent = output.map((row: any) => row.map(csvEscape).join(",")).join("\n");
  const title = approachListId + '_' + approachListCamelData.name + '_発送先企業一覧_' + getCurrentTime() + '.csv'
  createCsv(csvContent, title)
}

/**
 * CSVの出力データ作成
 * @param sendCompanyDataValues
 * @param relationKeyDict 
 * @param buyCompanyList 
 * @param buyneedsList 
 */
const createCsvDataList = (sendCompanyDataValues: any, relationKeyDict: any, buyCompanyList: any, buyneedsList: any): any => {
  var buyCompanyCount = 0;
  const csvDataList: any = []
  // idの降順に並び替え
  sendCompanyDataValues.sort((a: any, b: any) => b.id - a.id)
  sendCompanyDataValues.map((sendCompanyData: any) => {
    var csvData = createSendCompanyData(sendCompanyData)
    const matchedRelationKeyDict = relationKeyDict[sendCompanyData["id"]]
    // # 買手候補企業数を取得する(ヘッダ作成に使用する)
    if (buyCompanyCount < matchedRelationKeyDict.length) {
      buyCompanyCount = matchedRelationKeyDict.length
    }
        
    // # 評価スコアの降順, 買いニーズの昇順にソート
    matchedRelationKeyDict.sort((a: any, b: any) => {
      return a.valuationScore !== b.valuationScore ? b.valuationScore - a.valuationScore : a.buyneedsId - b.buyneedsId
    })
    // # マッチング結果の分だけ処理が実行される
    matchedRelationKeyDict.map((targetDataKey: any) => {
      const buyCompanyData: any = buyCompanyList[targetDataKey["candidateCompanyId"]]
      if (buyCompanyData !== null && buyCompanyData.length !== 0) {
        csvData = csvData.concat(createBuyCompanyData(buyCompanyData))
      }

      const buyneedsData: any = buyneedsList[targetDataKey["buyneedsId"]]
      if (buyneedsData !== null && buyneedsData.length !== 0) {
        csvData = csvData.concat(createBuyneedsData(buyneedsData))
      }
    })
    csvDataList.push(csvData)
  })
  return [buyCompanyCount, csvDataList]
}

/**
 * 発送企業履歴ID毎にマッチング結果をまとめる
 * relationKeyDictのkeyには発送企業の社内ポータル側企業マスタIDをセットしておく
 * @param buyneedsMatchingResults 
 * @param sendCompanyHistoryMap 
 */
const createRelationKeyDict = (buyneedsMatchingResults: any, sendCompanyHistoryMap: any): any => {
  var sendCompanyHistoryId = 0;
  var befSendCompanyId = buyneedsMatchingResults.value[0].sendCompanyHistoryId;
  var relationKeyDict: any = {};
  var matchingResultDicts: any = [];
  buyneedsMatchingResults.value.map((buyneedsMatchingResult: any) => {
    sendCompanyHistoryId = buyneedsMatchingResult.sendCompanyHistoryId;
    if(befSendCompanyId !== sendCompanyHistoryId) {
      relationKeyDict[sendCompanyHistoryMap[befSendCompanyId]] = matchingResultDicts;
      matchingResultDicts = [];
      befSendCompanyId = sendCompanyHistoryId;
    }
    matchingResultDicts.push(buyneedsMatchingResult);
  })
  relationKeyDict[sendCompanyHistoryMap[befSendCompanyId]] = matchingResultDicts;
  return relationKeyDict;
}

/**
 * 上限数まで社内ポータルAPIを叩く(utilsに持っていくとfuncメソッド内のthisがnullになる)
 * @param ids 
 * @param isBuyneeds 
 * @param limitNum 
 * @param pageNum 
 * @param toNum 
 * @param totalNum 
 */
const callUpToTotalNum = async (ids: string, isBuyneeds=true, limitNum=500, pageNum=1, toNum=0, totalNum=1): Promise<{}>  => {
  var outputData: any = {}

  while (toNum < totalNum) {
    // funcを引数に渡したやり方がうまくいかないため、条件分岐でそれぞれ呼び出している。
    var data_json: any = {}
    if(isBuyneeds) {
      data_json = await $jmssPortal.getBuyneeds(ids, pageNum, limitNum);
    } else {
      data_json = await $jmssPortal.getCompanies(ids, pageNum, limitNum);
    }
    
    const data: any = data_json.value.data
    if (data === undefined || data === null || data.length === 0) {
      break
    }
    totalNum = data_json.value.total
    toNum = data_json.value.to
    if (toNum === null) {
      break
    }
    data.map((data2: any) => outputData[data2["id"]] = data2)
    pageNum += 1
  }

  return outputData
}

/**
 * CSV出力用発送企業データ作成メソッド
 * @param sendCompanyData 
 */
const createSendCompanyData = (sendCompanyData: any): any => {
  const tsrData = sendCompanyData["tsr"];
  const csvSendCompanyData = [
    sendCompanyData["id"],
    sendCompanyData["corporate_number"],
    sendCompanyData["duns_number"],
    sendCompanyData["listed_on"],
    sendCompanyData["name"],
    sendCompanyData["representative_name"],
    sendCompanyData["representative_birthday"],
    sendCompanyData["zip"],
    sendCompanyData["pref"],
    sendCompanyData["address"],
    sendCompanyData["tel"],
    sendCompanyData["fax"],
    sendCompanyData["email"],
    sendCompanyData["url"],
    sendCompanyData["established_date"],
    getTsrData(tsrData, "創業年月"),
    sendCompanyData["capital"],
    sendCompanyData["employees"],
    getIndutryCodes(sendCompanyData["industries"], 0),
    getIndutryCodes(sendCompanyData["industries"], 1),
    getIndutryCodes(sendCompanyData["industries"], 2),
    getTsrData(tsrData, "営業種目"),
    sendCompanyData["officers"],
    sendCompanyData["shareholders"],
    sendCompanyData["sales"],
    sendCompanyData["profit"],
    getTsrData(tsrData, "営業所・支店"),
    getTsrData(tsrData, "仕入先"),
    getTsrData(tsrData, "販売先"),
    getTsrData(tsrData, "取引銀行"),
    getTsrData(tsrData, "概況"),
  ]
  return csvSendCompanyData
}

/**
 * CSV出力用買手候補企業データ作成メソッド
 * @param buyCompanyData 
 */
const createBuyCompanyData = (buyCompanyData: any): any => {
  const tsrData = buyCompanyData["tsr"];
  const csvBuyCompanyData = [
    buyCompanyData["id"],
    buyCompanyData["name"],
    buyCompanyData["pref"],
    getIndutryCodes(buyCompanyData["industries"], 0),
    getTsrData(tsrData, "営業種目"),
    buyCompanyData["sales"]
  ];
  return csvBuyCompanyData
}

/**
 * CSV出力用買いニーズデータ作成メソッド
 * @param buyneedsData 
 */
const createBuyneedsData = (buyneedsData: any): any => {
  const csvBuyneedsData = [
    buyneedsData["accuracy"],
    confirmationData(buyneedsData["prefs"]),
    getIndutryCodes(buyneedsData["industries"]),
    buyneedsData["remarks"],
  ];
  return csvBuyneedsData
}

/**
 * csvヘッダ作成メソッド
 * @param buyCompanyCount 
 */
const createCsvHeader = (buyCompanyCount: number): any => {
  var csvHeader = [
    "企業マスタID",
    "法人番号",
    "TSR企業コード",
    "株式市場",
    "企業名",
    "代表者名",
    "代表者生年月日",
    "郵便番号",
    "都道府県",
    "所在地",
    "電話番号",
    "FAX番号",
    "Email",
    "URL",
    "設立年月",
    "創業年月",
    "資本金",
    "従業員数",
    "業種1",
    "業種2",
    "業種3",
    "営業種目",
    "役員",
    "株主構成",
    "売上",
    "利益",
    "営業所・支店",
    "仕入先",
    "販売先",
    "取引銀行",
    "概況",
  ]
  const csvHeaderBuyneeds = [
    "企業マスタID",
    "買手候補",
    "都道府県",
    "業種",
    "営業種目",
    "売上高（百万円）",
    "買収実績",
    "買収希望エリア",
    "買収希望業種",
    "買いニーズ登録コメント",
  ]
  for(var i = 0; i < buyCompanyCount; i++) {
    csvHeader = csvHeader.concat(csvHeaderBuyneeds)
  }
  return csvHeader
}

/**
 * マッチング結果押下時の処理
 * @param companyId
 */
const showMatchingResult = (companyId: number): void => {
  // 引数の会社IDに紐づく発送企業歴IDを取得する
  const targetSendCompanyHistory = (
    sendCompanyHistories.value.filter((sendCompanyHistory: any) => sendCompanyHistory.companyId === companyId)
  )
  // マッチング履歴画面へ遷移する
  const matchResultUrl = router.resolve({
    path: `/buyneedsMatchResult/${targetSendCompanyHistory[0].id}`,
  })
  window.open(matchResultUrl.href, '_blank')
}

/**
 *  ニーズマッチングボタン、ダウンロードボタンの活性/非活性制御
 *  マッチングステータスがマッチング中だった場合は非活性（true）
 */
const activeBtn = computed((): boolean => {
  if (matchingHistories.value.buyneedsMatchingHistories[0].matchingStatus === "1") {
    // マッチング中（ステータスが「1（マッチング中）」）の場合は非活性
    return true
  }
  return false
})

/**
 * マッチング処理日時のidを取得する
 */
const filteredMatchingHistory: any = (matchingHistories.value.buyneedsMatchingHistories).filter((history: any) => selectedBuyneedsHistoryId.value === history.id)[0]

</script>

<style>
.link {
  color: -webkit-link;
  cursor: pointer;
  text-decoration: underline;
}

.ui-matching-btn {
  border-radius: 10px;
}

.v-data-table__th {
  background-color: #B3E5FC !important;
}

.msg {
  text-align: center;
  display: none;
}
</style>