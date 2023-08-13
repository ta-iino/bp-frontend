<template>
  <div id="app">
    <!-- ヘッダ部分 ここから -->
    <v-container class="pb-0">
      <v-row>
        <v-col cols="12" class="px-0 my-3 py-0" style="background-color: #81D4FA">
          <v-card-title class="headline font-weight-bold">DM発送企業一覧</v-card-title>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="4" class="d-flex px-0 py-0" v-for="(item) in items" :key="item.title">
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
          <v-select v-model="selectedBuyneedsHistoryId" clearable label="マッチング処理日時" filled :items="processingDateList"
            item-value="id" item-title="processingDate" @change="getBodyData()"></v-select>
        </v-col>
        <v-col cols="1" class="px-0"></v-col>
        <v-col cols="4" class="px-0 d-flex">
          <div class="ml-n8 mr-2">
            <v-btn class="v-btn" depressed color="light-blue-darken-4" border="0"
              @click="matchingStart()">ニーズマッチング</v-btn>
          </div>
          <div class="px-2">
            <v-btn class="v-btn" depressed color="light-blue-darken-4" border="0" @click="downloadCsv()">ダウンロード</v-btn>
          </div>
          <div class="px-2">
            <v-btn class="v-btn" depressed color="light-blue-darken-4" border="0" @click="pageBack()">戻る</v-btn>
          </div>
        </v-col>
        <v-col cols="4" class="pt-4 pl-10">
          <v-form @submit.prevent="searchCompany()">
            <v-text-field v-model="searchCompanyName" label="企業名検索" append-inner-icon="mdi-magnify">
            </v-text-field>
          </v-form>
        </v-col>
      </v-row>
    </v-container>
    <!-- ヘッダ部分 ここまで -->
    <!-- 一覧表示 ここから -->
    <v-container class="ui-vcontaoner pt-0 mb-4" >
      <v-data-table
        v-model:page="page"
        :headers="destinationCompanyHeaders"
        :items="destinationCompanies"
        :items-per-page="perPage"
        hide-default-footer
        class="elevation-1 ui-vdatatable"
        :height="528"
        fixed-header
      >
        <template v-slot:bottom>
          <div class="text-center pt-2">
            <v-pagination
              v-model="page"
              :length="totalPage"
              @input="onChangePage"
            ></v-pagination>
<!--            <v-text-field
              :model-value="perPage"
              class="pa-2"
              label="Items per page"
              type="number"
              min="-1"
              max="15"
              hide-details
              @update:model-value="perPage = parseInt($event, 10)"
            ></v-text-field>-->
          </div>
        </template>
        <template v-slot:item.id="{ item }">
            <span class="link" @click="clickCompanyId(item.raw.id)">{{ item.raw.id }}</span>
          </template>
          <template v-slot:item.matchingResult="{ item }">
              <v-btn width="120" small class="mr-2 ui-matching-btn ui-btn" @click="showMatchingResult(item.raw.id)" color="light-blue-darken-3">マッチング結果</v-btn>
          </template>
      </v-data-table>
      <!-- 一覧表示 ここまで -->
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { VDataTable } from 'vuetify/lib/labs/components.mjs';
import { ref } from 'vue'
import {useRoute, useRouter} from "vue-router";
import '@mdi/font/css/materialdesignicons.css'

/**
 * 初期値設定
 */
const route = useRoute();
const router = useRouter();
const { $api } = useNuxtApp();
const config = useRuntimeConfig();
const page: Ref<number> = ref(1);
const perPage: Ref<number> = ref(50);
const approachListId: number = Number(route.params.id);
const searchCompanyName: Ref<string> = ref('');
const totalPage: Ref<number> = ref(0);
// 発送企業データ(社内ポータル接続)
const destinationCompanies: Ref<any> = ref();
// 発送企業履歴データ（バックエンド接続）
const sendCompanyHistories: Ref<any> = ref();
const sendCompanyIds: Ref<number[]> = ref([]);


/**
 * モック
 */

 // マッチングプルダウンリスト
 // const { data: matchingHistoryList } = await useFetch('/api/processingDateList');

 // DMリスト
 // // const { data : dmListsData }  = await useFetch('/api/approachLists');
 // props: ["dmListsData"]
 // const dmLists: any = ref(dmListsData.value);
 // const dmList: any = ref(dmLists.value[0]);

 // 発送企業履歴一覧
 // const { data : destinationCompanyData }  = await useFetch('api/sample2')
 // const { data: sendCompanyHistoryListData } = await useFetch('api/dmDestinationCopmanyList');
// const { data : destinationCompanyListData }  = await useFetch('api/copmanyMasterList');

/**
 * マッチング処理日時リスト作成
 */
// マッチング履歴リスト取得
const { data : matchingHistoriesData } = await $api.approach.getBuyneedsMatchingHistory(approachListId);
const matchingHistories: any = ref(matchingHistoriesData.value);
const dmListId: number = ref(matchingHistories);
// json形式のリスト{id: 買いニーズマッチング履歴テーブルID, processingDate: マッチング処理日時}を作成
const processingDateList: any = ref(
  (matchingHistories.value).filter((matchingHistories: any) => matchingHistories.id && matchingHistories.processed_datetime)
  .map((matchingHistories: any) => ({ id: matchingHistories.id, processingDate: matchingHistories.processed_datetime }))
);
// 最新のマッチング処理日時をAPIに渡す
const selectedBuyneedsHistoryId: number = ref(processingDateList.value[0].id);

/**
 * ヘッダ部
 */
const { data : approachListsData } = await $api.jmssPortal.getApproachLists([approachListId]);
const approachData :any = ref(approachListsData.value);
const items: any = [
  { title: '担当チーム：', value: approachData.value.request_team.value },
  { title: '担当コンサルタント：', value: approachData.value.request_users },
  { title: 'リスト名：', value: approachData.value.name },
  { title: 'アプローチ区分：', value: approachData.value.purpose },
  { title: '業種：', value: approachData.value.jmss_industries.value },
  { title: '地域：', value: approachData.value.areas},
  { title: '売上：', value: approachData.value.sales_ranges },
  { title: '送付社数：', value: matchingHistories.value[0].send_company_count },
  { title: '利用業者名：', value: approachData.value.notification_users },
  { title: '備考：', value: approachData.value.remarks },
  { title: '', value: '' }, // 画面レイアウト上空欄を作るため
  { title: '', value: '' }, // 画面レイアウト上空欄を作るため
  { title: '送付日：', value: approachData.value.dm_date },
  { title: '登録日：', value: approachData.value.created_at },
  { title: '状況：', value: matchingHistories.value[0].matching_status },
];

/**
 * ボディ部
 */
/**
 * ボディ部のデータ取得メソッド
 */
 const getBodyData  = async(): Promise<any> => {
  getSendCompanyIds;
  getCompanyData();
}

/**
 * 発送対象企業の企業マスタID群を取得する
 */
const getSendCompanyIds = computed(async(): Promise<any> => {
  // 発送企業履歴リスト取得
  const { data: sendCompanyHistoriesData } = await $api.approach.getSendCompanyHistory(selectedBuyneedsHistoryId);
  sendCompanyHistories.value = ref(sendCompanyHistoriesData.value)

  // 発送企業履歴リストから会社IDの配列を作成する
  sendCompanyIds.value = (sendCompanyHistories.value).map((sendCompanyHistory: any)  => sendCompanyHistory.companyId);
})

/**
 * 企業情報取得共通処理(企業検索時以外は会社名を渡さないのでmethodsで実装)
 * @param searchCompanyName 
 */
 const getCompanyData = async(searchCompanyName?: string): Promise<any> => {
  const { data: companiesData } = (
    await $api.jmssPortal.getCompanies(sendCompanyIds.value, searchCompanyName, page.value, perPage.value)
  );
  const companies: any = ref(companiesData.value);
  // 戻り値のdataを表示リストに格納、合計ページ(total÷1ページ当たりの表示数)をtotalPageに格納する
  destinationCompanies.value = companies.value.data 
  totalPage.value = (companies.value.total / perPage.value)
}
// ヘッダ
const destinationCompanyHeaders: any = [
  // title,keyでないとヘッダーが消える
  { title: '', key: 'matchingResult', sortable: false, width: 50, color: '#b3e5fc' },
  { title: 'マスタID', key: 'id', sortable: false, width: 100 },
  { title: '企業名', key: 'companyName', sortable: false, width: 200 },
  { title: '代表者名', key: 'representativeName', sortable: false, width: 150 },
  { title: '郵便番号', key: 'postCode', sortable: false, width: 150 },
  { title: '所在地', key: 'address', sortable: false, width: 250 },
  { title: '売上　(百万円)', key: 'sales', sortable: false, width: 100 },
  { title: '営業利益(百万円)', key: 'operatingIncome', sortable: false, width: 100 },
  { title: '業種1', key: 'industry1', sortable: false, width: 150 },
  { title: '業種2', key: 'industry2', sortable: false, width: 150 },
  { title: '業種3', key: 'industry3', sortable: false, width: 150 },
  { title: '営業種目', key: 'businessItems', sortable: false, width: 200 },
  { title: '代表者年齢', key: 'representativeAge', sortable: false, width: 120 },
  { title: '従業員数', key: 'numberOfEmployee', sortable: false, width: 100 },
]
// 初期表示時、表示データの呼び出し
getBodyData();


/**
 * 企業名の検索処理
 */
const searchCompany = () => {
  page.value = 1;
  getCompanyData(searchCompanyName.value);
};

/**
 * ニーズマッチングボタン押下時の処理
 */
const matchingStart = async (): Promise<void> => {
  // マッチング処理開始APIの呼び出し
  await $api.approach.startBuyneedsMatching(dmListId);
  // データ作成及びジョブ送信が完了したら(エラーが起こらなければ)再表示処理を行う
  router.push({
    path: `/dmDestinationCopmany/${approachListId}}`,
  });
};

/**
 * ダウンロード押下時の処理
 */
const downloadCsv = async (): Promise<void> => {
  // 買いニーズマッチング結果CSV取得APIの呼び出し
  const { data: downloadListData } = await $api.approach.getBuyneedsMatchingResultCsv(selectedBuyneedsHistoryId);
  const downloadList: any = ref(downloadListData.value);

  // ファイルをBlob形式で取得
  const blobData = new Blob(downloadList.value.csv);
  // ダウンロードリンクを作成
  const downloadLink = document.createElement('a');
  downloadLink.href = URL.createObjectURL(blobData);
  // ダウンロード時のファイル名
  downloadLink.download = '発送先企業一覧' + new Date().toLocaleString() + '.csv';
  downloadLink.click();
  // 不要になったURLを解放
  URL.revokeObjectURL(downloadLink.href);
};


/**
 * マッチング結果押下時の処理
 * @param companyId
 */
const showMatchingResult = (companyId: number): void => {
  // 引数の会社IDに紐づく発送企業歴IDを取得する
  const targetSendCompanyHistory = (
    (sendCompanyHistories.value).filter((sendCompanyHistory: any) => 
    Object.keys(sendCompanyHistory.companyId)[0] == String(companyId))[0]
  )
  // 選択されている処理日時を取得
  const targetProcessDate = (
    processingDateList.filter((processingDate: any) => 
    Object.keys(processingDate.id)[0] == String(selectedBuyneedsHistoryId))[0]
  )
  // マッチング履歴画面へ遷移する
  let matchResultUrl = router.resolve({
    path: `/buyneedsMatchResult/${companyId}`,
    query: {
      "sendCompanyHistoryId": targetSendCompanyHistory.id,
      "processDate": targetProcessDate.processingDate
    }
  });
  window.open(matchResultUrl.href, '_blank');
};

/**
 * 会社ID押下時の処理
 * @param companyId 
 */
const clickCompanyId = (companyId: number): void => {
  const url = config.public.jmssPortalbaseURL + '/company/' + companyId;
  window.open(url)
};

/**
 * 戻るボタン押下時の処理用
 */
const pageBack = (): void => {
  router.go(-1);
};

/**
 * ページネーションで違うページ押下時の処理
 * @param tagetPage クリックしたページネーションの番号
 */
const onChangePage = (tagetPage: number): void => {
  page.value = tagetPage
  getCompanyData()
}
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
