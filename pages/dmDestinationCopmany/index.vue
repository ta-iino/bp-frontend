<template>
  <div id="app">
    <!-- ヘッダ部分 ここから -->
    <v-container class="pb-0">
      <v-row>
        <v-col cols="12" class="px-0 my-3" style="background-color: #d3d3d3">
          <v-card-title class="headline font-weight-bold">DM発送企業一覧</v-card-title>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="4" class="d-flex px-0 py-0" v-for="(item) in items" :key="item.title">
          <v-col cols="6" class="px-0 py-1">
            {{item.title}}
          </v-col>
          <v-col cols="6" class="px-0 py-1">
            {{item.value}}
          </v-col>
        </v-col>     
      </v-row>
      <v-row class="py-3">
        <v-col cols="3" class="px-0">
          <v-select
            v-model="selectedBuyneedsHistoryId"
            clearable
            label="マッチング処理日時"
            filled
            :items="processingDateList"
            item-value="id"
            item-title="processingDate"
          ></v-select>
        </v-col>
        <v-col cols="1" class="px-0"></v-col>
        <v-col cols="4" class="px-0 d-flex">
          <div class="px-4">
            <v-btn class="v-btn" depressed color="grey-darken-4" @click="matchingStart(0)">ニーズマッチング</v-btn>
          </div>
          <div class="px-4">
            <v-btn class="v-btn" depressed color="grey-darken-4" @click="downloadCsv">ダウンロード</v-btn>
          </div>
        </v-col>
        <v-col cols="4" class="pt-4 pl-10">
          <!-- <h2>企業数:　　{{ destinationCompanyList.data.length }}社</h2> -->
          <h2>企業数:　　{{ destinationCompanyList.length }}社</h2>
          <!-- <v-pagination v-model="page" :length="totalPageNum" ></v-pagination> -->
        </v-col>
      </v-row>
    </v-container>
    <!-- ヘッダ部分 ここまで -->
    <!-- 一覧表示 ここから -->
    <v-container class="pt-0 mb-4">
      <v-row>
        <v-data-table
          :headers="headers"
          :items="destinationCompanyList"
          :height="528"
          :items-per-page="-1"
          fixed-header
        >
          <template v-slot:item.masterId="{ item }">
            <span class="link" @click="clickCompanyId(item.raw.masterId)">{{ item.raw.masterId }}</span>
          </template>
          <template v-slot:item.matchingResult="{ item }">
              <v-btn width="120" small class="mr-2 ui-matching-btn" @click="matchingResult(item.raw.masterId)" color="grey-darken-4">マッチング結果</v-btn>
          </template>
          <!-- フッターの不要な文字を消す為に記載 -->
          <template v-slot:bottom></template>
        </v-data-table>
      </v-row>
          <!-- 一覧表示 ここまで -->
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { VDataTable } from 'vuetify/lib/labs/components.mjs';
import { ref } from 'vue'
import {useRoute, useRouter} from "vue-router";

const route = useRoute();
const router = useRouter();
const dmListId = route.query;
/**
 * マッチングプルダウンリスト
 */
 // mock用
const { data : processingDateListData } = await useFetch('/api/processingDateList');

// マッチング処理日時リスト取得API（backend）

//TODO マッチング履歴取得APIからfront側でmap形式のリストを作るよう修正。
// const { data : processingDateListData } = await useFetch('エンドポイントのURL', {
//   baseURL: 'バックエンドのベースURL（envフィルから引っ張る)',
//   params: {'dm_list_id': dmListId}
// })

const processingDateList: any = ref(processingDateListData.value);
// 選択されたプルダウンのデータ格納用
const selectedBuyneedsHistoryId: Number = ref(processingDateList.value[0].id);


/**
 * DMリスト
 */

// mock用

// const { data : dmListsData }  = await useFetch('/api/approachLists');
const { data : dmListsData }  = await useFetch('/api/sample')
const dmLists: any = ref(dmListsData.value);
const dmList: any = ref(dmLists.value[0]);

//TODO 本データ取得はDMリスト一覧画面から引っ張る。
// ⇒共通処理化して処理が重複しないように気を付ける。

const items: any = [
        {title:'担当チーム：', value: dmList.value.chargeOfTeam},
        {title:'担当コンサルタント：', value: dmList.value.chargeOfConsultant},
        {title:'リスト名：', value: dmList.value.listName},
        {title:'アプローチ区分：', value: dmList.value.approachPurpose},
        {title:'業種：', value: dmList.value.companyIndustry},
        {title:'地域：', value: dmList.value.companyRegion},
        {title:'売上：', value: dmList.value.companySales},
        {title:'送付社数：', value: dmList.value.sendCompanyCount},
        {title:'利用業者名：', value: dmList.value.useCompanyName},
        {title:'備考：', value: dmList.value.remarks},
        {title:'', value: ''}, // 画面レイアウト上空欄を作るため
        {title:'', value: ''}, // 画面レイアウト上空欄を作るため
        {title:'送付日：', value: dmList.value.sendMailDate},
        {title:'登録日：', value: dmList.value.created_at},
        {title:'状況：', value: dmList.value.matchingStatus},
      ];

/**
 * 発送企業リスト一覧
 */

// mock用
// const { data : destinationCompanyData }  = await useFetch('api/sample2')
const { data : sendCompanyHistoryListData }  = await useFetch('api/dmDestinationCopmanyList');


// DM送付先企業リスト取得API（backend）
// refreshを取得しておき、ニーズマッチング実行時に使用する。
// const { data : sendCompanyHistoryListData } = await useFetch(
//   'エンドポイントのURL', 
//   {
//     baseURL: 'バックエンドのベースURL（envフィルから引っ張る)',
//     params: {'buyneedsMatchingHistoryId': selectedProcessingDate}
//   }
// );
const sendCompanyHistoryList: any = ref(sendCompanyHistoryListData.value);
const sendCompanyHistoryIdList: number[] = ref(sendCompanyHistoryList["idList"]);
const sendCompanyIdList: number[]  = ref(sendCompanyHistoryList["companyIdList"]);

//mock用
// const { data : destinationCompanyListData }  = await useFetch('api/copmanyMasterList');
const { data : destinationCompanyListData }  = await useFetch('api/sample2');

// 企業マスタ取得用API(社内ポータル)
// const { data : destinationCompanyData } = await useFetch(
//   'エンドポイントのURL', 
//   {
//     baseURL: '社内ポータルのベースURL（envフィルから引っ張る)',
//     headers: {'Authorization': 'Bearer アクセストークン(Cookieに保存かな、、)'},
//     query: {'id': companyIdList}
//   }
// );
const destinationCompanyList: any = ref(destinationCompanyListData.value);



// ヘッダ
const headers: any = 
    [
      // title,keyでないとヘッダーが消える
      { title: 'マスタID', key: 'masterId', sortable: false, width: 100 },
      { title: '企業名', key: 'companyName', sortable: false, width: 200 },
      { title: '代表者名', key: 'representativeName', sortable: false, width: 150 },
      { title: '郵便番号', key: 'postCode', sortable: false, width: 150 },
      { title: '所在地', key: 'address', sortable: false, width: 250 },
      { title: '売上　(百万円)', key: 'sales', sortable: false, width: 100},
      { title: '営業利益(百万円)', key: 'operatingIncome', sortable: false, width: 100},
      { title: '業種1', key: 'industry1', sortable: false, width: 150},
      { title: '業種2', key: 'industry2', sortable: false, width: 150},
      { title: '業種3', key: 'industry3', sortable: false, width: 150},
      { title: '営業種目', key: 'businessItems', sortable: false, width: 200},
      { title: '代表者年齢', key: 'representativeAge', sortable: false, width: 120},
      { title: '従業員数', key: 'numberOfEmployee', sortable: false, width: 100},
      { title: '', key: 'matchingResult', sortable: false, width: 50 },      
    ]


/**
 * ニーズマッチングボタン押下時の処理
 */
const matchingStart = async (count: number): Promise<void> => {
  // マッチング処理開始APIの呼び出し
  const { data : isJobCreatedData, error: jobCreatedError } = await useFetch(
    'エンドポイントのURL', 
    {
      baseURL: 'バックエンドのベースURL（envフィルから引っ張る)',
      params: {'dmListId': dmListId}
    }
  );
  // エラー時の処理
  if(jobCreatedError) {
    console.log(jobCreatedError)
  };
  const isJobCreated: any = ref(isJobCreatedData.value);
  // ジョブ作成が成功したら再度初期表示を行う。
  if(isJobCreated) {
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
  const { data : downloadListData, error:  downloadListError } = await useFetch(
    'エンドポイントのURL', 
    {
      baseURL: 'バックエンドのベースURL',
      params: {
        'buyneeds_history_id': selectedBuyneedsHistoryId,
      }
    }
  );
  const downloadList: any = ref(downloadListData.value);

  // ファイルをBlob形式で取得
  const blobData = new Blob(downloadList.value.csv);
  // ダウンロードリンクを作成
  const downloadLink = document.createElement('a');
  downloadLink.href = URL.createObjectURL(blobData);
   // ダウンロード時のファイル名
  downloadLink.download = '発送先企業一覧'+new Date().toLocaleString()+'.csv';
  downloadLink.click();
  URL.revokeObjectURL(downloadLink.href); // 不要になったURLを解放

};


// 
/**
 * マッチング結果押下時の処理
 * @param companyId 企業マスタId
 */
const matchingResult = (companyId: Number): void => {
  router.push({ 

    // path: `/マッチング結果画面のpath/${[companyId]}`
    path: `/matchResultList`
  });
};

/**
 * 会社ID押下時の処理
 * @param companyId 
 */
const clickCompanyId = (companyId: Number): void => {

  let compnayUrl = router.resolve({
    path: `社内ポータルフロントURL` + `/company/` + companyId,
  });
  window.open(compnayUrl.href, '_blank');
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
</style>
