<template>
  <div id="app">
    <!-- ヘッダ部分 ここから -->
    <v-container class="pb-0">
      <v-row>
        <v-col cols="12" class="px-0 my-3 py-0" style="background-color: #81D4FA">
          <v-card-title class="headline font-weight-bold">
            DM発送企業一覧
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
            <v-btn class="v-btn" depressed color="light-blue-darken-4" border="0" @click="pageBack()">
              戻る
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
    <v-container v-if="destinationCompanies && destinationCompanies.length" class="ui-vcontaoner pt-0 mb-4">
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
          {{ getIndutryNames(getTargetData(item.raw.id).industries, 0) }}
        </template>
        <template #[`item.industry2`]="{ item }">
          {{ getIndutryNames(getTargetData(item.raw.id).industries, 1) }}
        </template>
        <template #[`item.industry3`]="{ item }">
          {{ getIndutryNames(getTargetData(item.raw.id).industries, 2) }}
        </template>
        <template #[`item.businessItems`]="{ item }">
          {{ getTsrData(getTargetData(item.raw.id), '営業種目') }}
        </template>
        <template #[`item.representativeAge`]="{ item }">
          {{ getCeoAge(getTsrData(getTargetData(item.raw.id), '生年月日')) }}
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
        マッチング中です
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
const items: any = [
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
  { title: '登録日：', value: formatDate(approachListCamelData.createdAt) },
  { title: '状況：', value: getMatchngStatusStr(matchingHistories.value.buyneedsMatchingHistories[0].matchingStatus) }
]

/**
 * ボディ部のデータ取得メソッド
 */
const getBodyData = async (): Promise<any> => {
  await getSendCompanyIds();
  await getCompanyData();
}

/**
 * 発送対象企業の企業マスタID群を取得する
 */
const getSendCompanyIds = async () => {
  // 発送企業履歴リストから会社IDの配列を作成する
  const sendCompanyHistoryResponse: any = await $approach.getSendCompanyHistory(selectedBuyneedsHistoryId.value)
  sendCompanyHistories.value = sendCompanyHistoryResponse.value.sendCompanyHistories
  sendCompanyIds.value = (sendCompanyHistories.value).map((sendCompanyHistory: any) => sendCompanyHistory.companyId)
}

/**
 * 企業情報取得共通処理(企業検索時以外は会社名を渡さないのでmethodsで実装)
 * @param searchCompanyName
 */
const getCompanyData = async (searchCompanyName?: string): Promise<any> => {
  const companies: any = (
    await $jmssPortal.getCompanies((sendCompanyIds.value).join(), searchCompanyName, page.value, perPage.value)
  )
  // キャメルケースに変換
  const tmpData: any = camelcaseKeys(companies.value.data, { deep: true })
  // マスタIDが小さい順にソートする
  destinationCompanies.value = tmpData.sort(function (a: any, b: any) {
    return (a.id > b.id) ? 1 : -1
  })
  // 合計ページ(total÷1ページ当たりの表示数)をtotalPageに格納する
  totalPage.value = Math.ceil(companies.value.total / perPage.value)
}
// ヘッダ
const destinationCompanyHeaders: any = [
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
  // データ作成及びジョブ送信が完了したら(エラーが起こらなければ)再表示処理を行う
  router.push({
    path: `/dmDestinationCopmany/${approachListId}}`
  })
}

/**
 * ダウンロード押下時の処理
 */
const downloadCsv = async (): Promise<void> => {
  // 買いニーズマッチング結果CSV取得APIの呼び出し
  const csv: any = await $approach.getBuyneedsMatchingResultCsv(selectedBuyneedsHistoryId.value)
  // ファイルをBlob形式で取得
  const blobData = new Blob([csv.value], { type: "text/csv" })
  // ダウンロードリンクを作成
  const downloadLink = document.createElement('a')
  downloadLink.href = window.URL.createObjectURL(blobData)
  // ダウンロード時のファイル名
  downloadLink.download = '発送先企業一覧' + getCurrentTime() + '.csv'
  downloadLink.click()
  // 不要になったURLを解放
  URL.revokeObjectURL(downloadLink.href)
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
 * 戻るボタン押下時の処理用
 */
const pageBack = (): void => {
  router.go(-1)
}

/**
 * 対象発送企業データの取得処理
 * @param id 対象企業のID
 */
const getTargetData = (id: number): any => {
  const targetData = destinationCompanies.value.filter((destinationCompanyData: any) => id === destinationCompanyData.id)[0]
  return targetData
}

/**
 *  ニーズマッチングボタン、ダウンロードボタンの活性/非活性制御
 *  マッチングステータスがマッチング中だった場合は非活性（true）
 */
const activeBtn = computed((): boolean => {
  const result = (
    matchingHistories.value.buyneedsMatchingHistories.filter(
      (buyneedsMatchingHistoriy: any) => buyneedsMatchingHistoriy.id === selectedBuyneedsHistoryId.value
    )
  )
  if (result[0].matchingStatus === "1") {
    // マッチング中（ステータスが「1（マッチング中）」）の場合は非活性
    return true
  }
  return false
})
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