<template>
  <v-app>
  <div id="app">
    <v-container>
      <v-row>
        <v-col cols="12" class="px-0 my-3" style="background-color: #d3d3d3">
          <v-card-title class="headline font-weight-bold">DMリスト一覧</v-card-title>
        </v-col>
      </v-row>
    <!-- 検索フォーム ここから -->
      <v-row>
        <v-col cols="2" class="px-0 py-5">
          <v-select
            v-model="searchParams.chargeOfTeam"
            label="チーム"
            :items="pulldownChargeOfTeam"
          ></v-select>
        </v-col>
        <v-col cols="2" class="px-0 py-5">
          <v-select
            v-model="searchParams.chargeOfConsultant"
            label="担当コンサルタント"
            :items="pulldownChargeOfConsultant"
          ></v-select>
        </v-col>
        <v-col cols="2" class="px-0 py-5">
          <v-text-field
            v-model="searchParams.listName"
            label="リスト名"
            class="input-color-red-class"
          ></v-text-field>
        </v-col>
        <v-col cols="2" class="px-0 py-5">
          <v-select
            v-model="searchParams.approachPurpose"
            label="アプローチ区分"
            :items="pulldownApproachPurpose"
          ></v-select>
        </v-col>
        <!--<v-col cols="2" class="px-0">
          <v-text-field v-model="searchParams.registrationDateFrom" clearable label="登録日(from)" filled></v-text-field>
        </v-col>-->
        <v-col cols="2" class="px-0">
          <v-text-field class="my-2 ui-textfield">
            <VueDatePicker
              class="ui-datepicker"
              v-model="dateFrom"
              locale="ja"
              format="yyyy/MM/dd"
              select-text="OK"
              cancel-text="Cancel"
              placeholder="登録日(from)"
              :offset="20"
              :enable-time-picker="false"
            ></VueDatePicker>
          </v-text-field>
        </v-col>
        <v-col cols="2" class="px-0">
          <v-text-field class="my-2 ui-textfield">
            <VueDatePicker 
              class="ui-datepicker"
              v-model="dateTo"
              locale="jp"
              format="yyyy/MM/dd"
              select-text="OK"
              cancel-text="Cancel"
              placeholder="登録日(to)"
              :offset="20"
              :enable-time-picker="false"
              >
            </VueDatePicker>
          </v-text-field>
        </v-col>
<!--        <v-col cols="2" class="px-0">
          <v-text-field v-model="searchParams.registrationDateTo" clearable label="登録日(to)" filled></v-text-field>
        </v-col>-->
      </v-row>
      <v-row justify="center" class="ma-4">
        <v-btn depressed color="primary" @click="searchButton(searchParams)">検索</v-btn>
      </v-row>
    </v-container>
    <!-- 検索フォーム ここまで -->
    <!-- 一覧表示 ここから -->
    <v-container class="ui-vcontaoner" >
      <v-data-table
          class="ui-vdatatable"
          :headers="headers"
          :items="dmListData"
          :height="528"
          :items-per-page="-1"
          fixed-header
      >
      <!-- フッター削除 -->
      <template v-slot:bottom></template>
      <template v-slot:item.listName="{ item }">
        <nuxt-link :to="`/`">{{ item.raw.listName }}</nuxt-link>
      </template>
      </v-data-table>
    </v-container>
    <!-- 一覧表示 ここまで -->
  </div>
  </v-app>
</template>

<script setup lang="ts">
import { VDataTable } from 'vuetify/lib/labs/components.mjs';
import { ref } from 'vue'
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

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
  }
)
const dateFrom = ref("")
const dateTo = ref("")

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
      { title: 'ID', key: 'id', sortable: false, width: 100 },
      { title: '登録日', key: 'registrationDate', sortable: false, width: 150 },
      { title: '発送日', key: 'sendMailDate', sortable: false, width: 150 },
      { title: '送付社数', key: 'sendCompanyCount', sortable: false, width: 100 },
      { title: 'リスト名', key: 'listName', sortable: false, width: 250 },
      { title: 'アプローチ区分', key: 'approachPurpose', sortable: false, width: 150 },
      { title: '担当チーム', key: 'chargeOfTeam', sortable: false, width: 150 },
      { title: '担当コンサルタント', key: 'chargeOfConsultant', sortable: false, width: 150 },
      { title: '業種', key: 'ompanyIndustry', sortable: false, width: 100 },
      { title: '地域', key: 'companyRegion', sortable: false, width: 100 },
      { title: '売上', key: 'companySales', sortable: false, width: 100 },
      { title: '状況', key: 'matchingStatus', sortable: false, width: 150 },
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
<style>
.ui-textfield .v-input__control .v-field .v-field__field .v-field__input {
  padding: 0 0 !important;
}
.v-data-table__th {
  background-color: #ffeccc !important;
}
.ui-vcontaoner .v-table--fixed-header {
  z-index: 1 !important;
}
.ui-datepicker .dp__outer_menu_wrap .dp__menu {
  z-index: 10000;
}
/* .dp__instance_calendar {
  z-index: 1000 !important;
} */
</style>