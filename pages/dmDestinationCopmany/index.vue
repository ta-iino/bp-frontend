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
      <!-- <v-row>
        <v-col cols="2" class="px-0 py-1">
          <span>担当チーム：</span>
        </v-col>
        <v-col cols="2" class="px-0 py-1">
          <span>{{ dmList.chargeOfTeam }}</span>
        </v-col>
        <v-col cols="2" class="px-0 py-1">
          <span>担当コンサルタント：</span>
        </v-col>
        <v-col cols="2" class="px-0 py-1">
          <span>{{ dmList.chargeOfConsultant }}</span>
        </v-col>        
        <v-col cols="2" class="px-0 py-1">
          <span>リスト名：</span>
        </v-col>
        <v-col cols="2" class="px-0 py-1">
          <span>{{ dmList.listName }}</span>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="2" class="px-0 py-1">
          <span>アプローチ区分：</span>
        </v-col>
        <v-col cols="2" class="px-0 py-1">
          <span>{{ dmList.approachPurpose }}</span>
        </v-col>        
        <v-col cols="2" class="px-0 py-1">
          <span>業種：</span>
        </v-col>
        <v-col cols="2" class="px-0 py-1">
          <span>{{ dmList.companyIndustry }}</span>
        </v-col>        
        <v-col cols="2" class="px-0 py-1">
          <span>地域：</span>
        </v-col>
        <v-col cols="2" class="px-0 py-1">
          <span>{{ dmList.companyRegion }}</span>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="2" class="px-0 py-1">
          <span>売上：</span>
        </v-col>
        <v-col cols="2" class="px-0 py-1">
          <span>{{ dmList.companySales }}</span>
        </v-col>          
        <v-col cols="2" class="px-0 py-1">
          <span>送付社数：</span>
        </v-col>
        <v-col cols="2" class="px-0 py-1">
          <span>{{ dmList.sendCompanyCount }}</span>
        </v-col>        
        <v-col cols="2" class="px-0 py-1">
          <span>利用業者名：</span>
        </v-col>
        <v-col cols="2" class="px-0 py-">
          <span>{{ dmList.useCompanyName }}</span>
        </v-col>       
      </v-row>
      <v-row>
        <v-col cols="2" class="px-0 py-1">
          <span>備考：</span>
        </v-col>
        <v-col cols="2" class="px-0 py-1">
          <span>{{ dmList.remarks }}</span>
        </v-col> 
      </v-row>
      <v-row>
        <v-col cols="2" class="px-0 py-1">
          <span>送付日：</span>
        </v-col>
        <v-col cols="2" class="px-0 py-1">
          <span>{{ dmList.sendMailDate }}</span>
        </v-col>
        <v-col cols="2" class="px-0 py-1">
          <span>登録日：</span>
        </v-col>
        <v-col cols="2" class="px-0 py-1">
          <span>{{ dmList.registrationDate }}</span>
        </v-col>
        <v-col cols="2" class="px-0 py-1">
          <span>状況：</span>
        </v-col>
        <v-col cols="2" class="px-0 py-1">
          <span>{{ dmList.matchingStatus }}</span>
        </v-col>
      </v-row>      -->
      <v-row class="py-3">
        <v-col cols="3" class="px-0">
          <!-- v-model="selectedProcessingDate" -->
          <v-select
            v-model="selectedProcessingDate"
            clearable
            label="マッチング処理日時"
            filled
            :items="processingDateList"
            item-value="id"
            item-title="processingDate"
          ></v-select>
          <!-- <p>{{ selectedProcessingDate }}</p> -->
        </v-col>
        <v-col cols="1" class="px-0"></v-col>
        <v-col cols="4" class="px-0 d-flex">
          <div class="px-4">
            <v-btn  depressed color="black" @click="matchingStart(0)">ニーズマッチング</v-btn>
          </div>
          <div class="px-4">
            <v-btn depressed color="black" @click="download">ダウンロード</v-btn>
          </div>
        </v-col>
        <v-col cols="4" class="pt-4 pl-10">
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
          <!-- TODO アクセストークン送る必要あり？その場合、router.pushに書き換える？その場合vue-router必要 -->
          <!-- <template v-slot:item.listName="{ item }">
            <nuxt-link :to="">{{ item.masterId }}</nuxt-link>
          </template> -->
          <template v-slot:item.masterId="{ item }">
            <nuxt-link :to="`/`">{{ item.raw.masterId }}</nuxt-link>
          </template>
          <template v-slot:item.matchingResult="{ item }">
              <v-btn width="120" small class="mr-2" @click="matchingResult(item.raw.masterId)">マッチング結果</v-btn>
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
import { appendFile } from 'fs';

/**
 * マッチングプルダウンリスト
 */

 // mock用
 const { data : processingDateData }  = await useAsyncData(
  'processingDateList',
  () => $fetch('api/processingDateList')
)
const processingDateList: any = ref(processingDateData.value)

// マッチング処理日時リスト取得API（backend）

const selectedProcessingDate: Number = ref(processingDateList.value[0].id)

// クエリパラメータにある場合はそれを取る（マッチング処理日時の変更）ない場合はマッチングプルダウンの最新のキーを入れる
// const targetBuyNeedsMachingHistoryId = 


/**
 * DMリスト
 */

// mock用
const { data : dmListData }  = await useAsyncData(
  'dmList',
  () => $fetch('api/dmList')
)
const dmListData2: any = ref(dmListData.value)
const dmList: any = ref(dmListData2.value[0])

// アプローチリスト取得用API




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
        {title:'登録日：', value: dmList.value.registrationDate},
        {title:'状況：', value: dmList.value.matchingStatus},
      ]

/**
 * 発送企業リスト一覧
 */

// mock用
const { data : destinationCompanyData }  = await useAsyncData(
  'destinationCompanyList',
  () => $fetch('api/destinationCompanyList')
)
const destinationCompanyList: any = ref(destinationCompanyData.value)

// 



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
  const { data : isJobCreatedData }  = await useAsyncData(
    'matchingStart',
    () => $fetch('/matchingStart')
  )
  const isJobCreated: any = ref(isJobCreatedData.value)
  // ジョブ作成が成功したら再度初期表示を行う。
  if(isJobCreated) {
    // 本画面の初期表示処理
    // 現在のマッチング処理日時のIDをパラメータに載せる
  }
};

// ダウンロード押下時の処理
const download = (count: number): void => {
  // 1. 発送企業履歴IDリストの作成

  // 2. 企業マスタIDリストの作成
  // ※1と2はmap形式で持っても良いかも。

  // 3.マッチング結果取得APIを呼び出す

  // 4.買いニーズ取得APIの呼び出し

  // 5.企業情報APIの呼び出し

  // 6.DM発送先企業一覧ダウンロードAPIの呼び出し

  // 7. csvダウンロードさせる
};

// マッチング結果押下時の処理
const matchingResult = (masterId: Number): void => {
  // 1. マッチング結果画面への遷移
  // 発送企業IDリストはルートパラメータ or クエリパラメータで前の画面から情報を取得する。
  // ヘッダーに必要な情報（発送先企業情報）も前画面から引き継がれる。
};

</script>

