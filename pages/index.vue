<template>
  <div id="app">
    <div class="ma-3" style="background-color: #d3d3d3">
      <v-card-title class="headline font-weight-bold">DMリスト一覧</v-card-title>
    </div>
    <!-- 検索フォーム ここから -->
    <v-container>
      <v-row>
        <v-col cols="2" class="px-0">
          <v-select
            v-model="searchParams.chargeOfTeam"
            clearable
            label="チーム"
            filled
            :items="pulldownChargeOfTeam"
          ></v-select>
        </v-col>
        <v-col cols="2" class="px-0">
          <v-select
            v-model="searchParams.chargeOfConsultant"
            clearable
            label="担当コンサルタント"
            filled
            :items="pulldownChargeOfConsultant"
          ></v-select>
        </v-col>
        <v-col cols="2" class="px-0">
          <v-text-field v-model="searchParams.listName" clearable label="リスト名" filled></v-text-field>
        </v-col>
        <v-col cols="2" class="px-0">
          <v-select
            v-model="searchParams.approachPurpose"
            clearable
            label="アプローチ区分"
            filled
            :items="pulldownApproachPurpose"
          ></v-select>
        </v-col>
        <v-col cols="2" class="px-0">
          <v-text-field v-model="searchParams.registrationDateFrom" clearable label="登録日(from)" filled></v-text-field>
        </v-col>
        <v-col cols="2" class="px-0">
          <v-text-field v-model="searchParams.registrationDateTo" clearable label="登録日(to)" filled></v-text-field>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-btn depressed color="primary" @click="searchButton(searchParams)">検索</v-btn>
      </v-row>
    </v-container>
    <!-- 検索フォーム ここまで -->
    <!-- 一覧表示 ここから -->
    <v-data-table
        :headers="headers"
        :items="dmListData"
        disable-pagination
    >
    <!-- フッター削除 -->
    <template v-slot:bottom></template>
    <template v-slot:[`item.listName`]="{ item }">
      <nuxt-link :to="`/`">{{ item.raw.listName }}</nuxt-link>
    </template>
    </v-data-table>
    <!-- ページネーション -->
    <div class="text-center pt-2">
      <v-pagination v-model="searchParams.page" :length="totalPageNum" ></v-pagination>
    </div>
    <!-- 一覧表示 ここまで -->
  </div>
</template>

<script setup lang="ts">
import { VDataTable } from 'vuetify/lib/labs/components.mjs';
import { ref } from 'vue'

/**
 * 初期値設定
 */
const totalPageNum = ref(1)
const perpage = ref(30)
const searchParams = ref(
  {
      chargeOfTeam : null,
      chargeOfConsultant : null,
      listName : "",
      approachPurpose : null,
      registrationDateFrom : null,
      registrationDateTo : null,
      page: 1
  }
)
/**
 * テーブルデータ取得（仮）
 */
const { data }  = await useAsyncData(
  'dmList',
  () => $fetch('api/sample')
)
const dmListData: any = ref(data.value)

/**
 * テーブルデータ取得
 */
let resultData = []
/**
 * DMリスト取得API呼出
 * return dmListId  DMリストID
 *        approachListId アプローチリストID
 *        sendCompanyCount 送付社数
 *        matchingStatus マッチング状況
 */
const { data: dmListList} = await useAsyncData(
  'dmListList',
  (approachListIdList) => $fetch('/api/dmList')
)
console.log('DMリスト取得API')
console.log(dmListList.value)
resultData.push(dmListList)
console.log(resultData)

// アプローチリスト取得API呼出
const { data: approachList} = await useAsyncData(
  'approachList',
  (approachListIdList) => $fetch('/api/approachLists')
)
console.log('アプローチリスト取得API')
console.log(approachList.value)
resultData.push(approachList)
console.log(resultData)

// ユーザー取得API呼出
const { data: user} = await useAsyncData(
  'user',
  (userId) => $fetch('/api/user')
)
console.log('ユーザー取得API')
console.log(user.value)
resultData.push(user)
console.log(resultData)

/**
 * プルダウンリスト取得
*/ 
const { data: data1 } = await useAsyncData(
  'pulldownLists',
  () => $fetch('/api/pulldownList')
)
const data1_1: any = ref(data1)
const pulldownChargeOfTeam = data1_1.value.teamList
const pulldownChargeOfConsultant = data1_1.value.consultantList
const pulldownApproachPurpose = data1_1.value.approachPurpose

/**
 * 一覧表示ヘッダー設定
 */
const headers = ref(
    [
      // title,keyじゃないとヘッダーが消える
      { title: 'ID', key: 'id', sortable: false, width: 30 },
      { title: '登録日', key: 'registrationDate', sortable: false, width: 100 },
      { title: '発送日', key: 'sendMailDate', sortable: false, width: 100 },
      { title: '送付社数', key: 'sendCompanyCount', sortable: false, width: 100 },
      { title: 'リスト名', key: 'listName', sortable: false, width: 100 },
      { title: 'アプローチ区分', key: 'approachPurpose', sortable: false, width: 100},
      { title: '担当チーム', key: 'chargeOfTeam', sortable: false, width: 100},
      { title: '担当コンサルタント', key: 'chargeOfConsultant', sortable: false, width: 100},
      { title: '業種', key: 'ompanyIndustry', sortable: false, width: 100},
      { title: '地域', key: 'companyRegion', sortable: false, width: 100},
      { title: '売上', key: 'companySales', sortable: false, width: 100},
      { title: '状況', key: 'matchingStatus', sortable: false, width: 100},
    ]
  )

/**
 * 検索ボタン押下時処理
*/ 
const searchButton = (searchParams: any) :void => {
  console.log("searchButtonClicked")
  // アプローチリスト取得APIの呼出
  // const { data } = useAsyncData(
  //   'approachLists',
  //   () => $fetch('api/approachLists')
  // )
  // const approachLists = ref(data)
}


</script>