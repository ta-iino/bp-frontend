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
            item-value="id" item-title="processingDate" @change="getSendCompanyListData"></v-select>
        </v-col>
        <v-col cols="1" class="px-0"></v-col>
        <v-col cols="4" class="px-0 d-flex">
          <div class="ml-n8 mr-2">
            <v-btn class="v-btn" depressed color="light-blue-darken-4" border="0"
              @click="matchingStart(0)">ニーズマッチング</v-btn>
          </div>
          <div class="px-2">
            <v-btn class="v-btn" depressed color="light-blue-darken-4" border="0" @click="downloadCsv">ダウンロード</v-btn>
          </div>
          <div class="px-2">
            <v-btn class="v-btn" depressed color="light-blue-darken-4" border="0" @click="pageBack">戻る</v-btn>
          </div>
        </v-col>
        <v-col cols="4" class="pt-4 pl-10">
          <v-form @submit.prevent="searchCompany">
            <v-text-field v-model="search" label="企業名検索" append-inner-icon="mdi-magnify">
            </v-text-field>
          </v-form>
        </v-col>
      </v-row>
    </v-container>
    <!-- ヘッダ部分 ここまで -->
    <!-- ニーズマッチングボタン押下時メッセージ表示 -->
    <v-row>
      <v-col col="12" class="pt-0">
        <p class="msg" id="msg">{{ msg }}</p>
      </v-col>
    </v-row>
    <!-- 一覧表示 ここから -->
    <v-container class="ui-vcontaoner pt-0 mb-4" >
      <v-data-table
        v-model:page="page"
        :headers="headers"
        :items="destinationCompanyList"
        :items-per-page="parPage"
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
              :model-value="parPage"
              class="pa-2"
              label="Items per page"
              type="number"
              min="-1"
              max="15"
              hide-details
              @update:model-value="parPage = parseInt($event, 10)"
            ></v-text-field>-->
          </div>
        </template>
        <template v-slot:item.masterId="{ item }">
            <span class="link" @click="clickCompanyId(item.raw.masterId)">{{ item.raw.masterId }}</span>
          </template>
          <template v-slot:item.matchingResult="{ item }">
              <v-btn width="120" small class="mr-2 ui-matching-btn ui-btn" @click="matchingResult(item.raw.masterId)" color="light-blue-darken-3">マッチング結果</v-btn>
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

const page = ref(1)
const parPage = ref(10)

const route = useRoute();
const router = useRouter();
const dmListId = route.query;
const { $api } = useNuxtApp();
const msg: string = "マッチング処理を開始しました。時間をおいて再度開いてください。"
/**
 * マッチングプルダウンリスト
 */
// mock用
// const { data: matchingHistoryList } = await useFetch('/api/processingDateList');

// DM送付先企業リスト取得API（backend）
// refreshを取得しておき、ニーズマッチング実行時に使用する。

const companyInfoList: any[] = [];
const getSendCompanyListData = async(selectedBuyneedsHistoryId: number): Promise<any> => {
  const QUERY = selectedBuyneedsHistoryId;
  const { data: sendCompanyHistoryListData } = await $api.approach.getBuyneedsMatchingResult(QUERY);

  const sendCompanyInfoList: any[] = ref(ref(sendCompanyHistoryListData.value).filter((sendCompanyHistoryListData: any) => 
  sendCompanyHistoryListData.id && sendCompanyHistoryListData.companyId).map((sendCompanyHistoryListData: any) => sendCompanyHistoryListData.value)));
  companyInfoList.values = sendCompanyInfoList.values;
}
const companyIdList: number[] = companyInfoList.map((companyInfoList: any) => companyInfoList.companyId);


// マッチング処理日時リスト取得API（backend）

//TODO 買いニーズマッチング履歴取得APIからfront側でmap形式のリストを作るよう修正。
const { data : matchingHistoryListData } = await $api.approach.getSendCompanyHistory([String(dmListId)]);

const matchingHistoryList = ref(matchingHistoryListData.value);

const processingDateList: any = ref((matchingHistoryList.value)
  .filter((matchingHistoryList: any) => matchingHistoryList.id && matchingHistoryList.processed_datetime)
  .map((matchingHistoryList: any) => ({ id: matchingHistoryList.id, processingDate: matchingHistoryList.processed_datetime }))
);

// 最新のマッチング処理日時をAPIに渡す
const selectedBuyneedsHistoryId: number = ref(processingDateList.value[0].id);
getSendCompanyListData(selectedBuyneedsHistoryId);

// const processingDateList: any = ref(matchingHistoryList.value);
// // 選択されたプルダウンのデータ格納用
// 


/**
 * DMリスト
 * 
 */

const { data : dmListData } = await $api.approach.getDMList([String(dmListId)]);
const approachId: number = dmListData.value[0].approachId;

const { data : approachListsData } = await $api.jmssPortal.getApproachLists([String(approachId)]);
const approachData :any = ref(approachListsData.value);

// // mock用

// // const { data : dmListsData }  = await useFetch('/api/approachLists');
// props: ["dmListsData"]
// const dmLists: any = ref(dmListsData.value);
// const dmList: any = ref(dmLists.value[0]);

//TODO 本データ取得はDMリスト一覧画面から引っ張る。
// ⇒共通処理化して処理が重複しないように気を付ける。

const items: any = [
  { title: '担当チーム：', value: approachData.value.request_team.value },
  { title: '担当コンサルタント：', value: approachData.value.request_users },
  { title: 'リスト名：', value: approachData.value.name },
  { title: 'アプローチ区分：', value: approachData.value.purpose },
  { title: '業種：', value: approachData.value.jmss_industries.value },
  { title: '地域：', value: approachData.value.areas},
  { title: '売上：', value: approachData.value.sales_ranges },
  { title: '送付社数：', value: matchingHistoryList.value[0].send_company_count },
  { title: '利用業者名：', value: approachData.value.notification_users },
  { title: '備考：', value: approachData.value.remarks },
  { title: '', value: '' }, // 画面レイアウト上空欄を作るため
  { title: '', value: '' }, // 画面レイアウト上空欄を作るため
  { title: '送付日：', value: approachData.value.dm_date },
  { title: '登録日：', value: approachData.value.created_at },
  { title: '状況：', value: matchingHistoryList.value[0].matching_status },
];

/**
 * 発送企業リスト一覧
 */

// mock用
// const { data : destinationCompanyData }  = await useFetch('api/sample2')
// const { data: sendCompanyHistoryListData } = await useFetch('api/dmDestinationCopmanyList');

/**
 * リスト取得して最新の日時の発送履歴IDを結果取得APIに渡す
 * →受け取った企業マスタIDをリスト化して企業取得APIに渡す
 * →受け取ったデータを整理して一覧表示
 */




// const sendCompanyHistoryList: any = ref(sendCompanyHistoryListData.value);
// const sendCompanyHistoryIdList: number[] = ref(sendCompanyHistoryList["idList"]);
// const sendCompanyIdList: number[] = ref(sendCompanyHistoryList["companyIdList"]);

//mock用
// const { data : destinationCompanyListData }  = await useFetch('api/copmanyMasterList');
// const { data: destinationCompanyListData } = await useFetch('api/sample2');

// 企業マスタ取得用API(社内ポータル)
const companyList: any[] = [];
const getCompanyData = async(companyIdList: number[], searchCompanyName: string, page: number, totalPage: number): Promise<any> => {
  const QUERY = {'id': companyIdList, 'name': searchCompanyName};
  const PARAMS = {'page': page, 'totalPage': totalPage};
  const { data: destinationCompanyListData } = await $api.jmssPortal.getCompanies(QUERY, PARAMS);
  const destinationCompanyList: any[] = ref(destinationCompanyListData.value);
  companyList.values = destinationCompanyList.values;
}


// ヘッダ
//空itemを一番上にすることで、左端にマッチング結果ボタンが表示される。
const headers: any =
  [
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

// 企業名検索
const search: Ref<string> = ref('');

const searchCompany = () => {
  const searchCompanyName = search.value;
  getCompanyData(companyIdList, searchCompanyName, page, totalPage);
  search.value = '';
  };


/**
 * ページネーション用
 * 取得した一覧データの量でページの長さを設定する
 */
 const destinationCompanyLists: any = destinationCompanyListData.value
 function totalPageNum() {
  return Math.ceil(destinationCompanyLists.length / parPage.value)
}
let totalPage = totalPageNum();


/**
 * ニーズマッチングボタン押下時の処理
 */
const matchingStart = async (count: number): Promise<void> => {
  // メッセージの表示
  var change = document.getElementById("msg")
  change.style.display ="block";
  // マッチング処理開始APIの呼び出し
  const { data: isJobCreatedData, error: jobCreatedError } = await $api.approach.startBuyneedsMatching([String(dmListId)]);
  // エラー時の処理
  if (jobCreatedError) {
    console.log(jobCreatedError)
  };
  const isJobCreated: any = ref(isJobCreatedData.value);
  // ジョブ作成が成功したら再度初期表示を行う。
  if (isJobCreated) {
    // 外部からの接続もあるためクエリパラメータを使用する
    router.push({
      path: `/本画面のURL`,
      query: {
        dmListId: Number(dmListId),
        selectedProcessingDate: Number(selectedBuyneedsHistoryId)
      }
    });
  };
};

/**
 * ダウンロード押下時の処理
 */

const downloadCsv = async (): Promise<void> => {

  // 買いニーズマッチング結果CSV取得APIの呼び出し
  const { data: downloadListData, error: downloadListError } = await $api.approach.getBuyneedsMatchingResultCsv([String(selectedBuyneedsHistoryId)]);
  const downloadList: any = ref(downloadListData.value);

  // ファイルをBlob形式で取得
  const blobData = new Blob(downloadList.value.csv);
  // ダウンロードリンクを作成
  const downloadLink = document.createElement('a');
  downloadLink.href = URL.createObjectURL(blobData);
  // ダウンロード時のファイル名
  downloadLink.download = '発送先企業一覧' + new Date().toLocaleString() + '.csv';
  downloadLink.click();
  URL.revokeObjectURL(downloadLink.href); // 不要になったURLを解放

};


// 
/**
 * マッチング結果押下時の処理
 * @param companyId 企業マスタId
 */
const matchingResult = (companyId: number, sendCompanyHistoryId: any, processDate: number): void => {
  let matchResultUrl = router.resolve({

    // path: `/マッチング結果画面のpath/${[companyId]}`
    path: `/matchResultList`,
    query: {
      "companyId": companyId,
      "sendCompanyHistoryId": sendCompanyHistoryId,
      "processDate": processDate
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

const pageBack = (): void => {
  router.go(-1);
};

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
