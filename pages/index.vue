<template>
  <v-app>
  <div id="app">
    <v-container>
      <v-row>
        <v-col cols="12" class="px-0 my-3 py-0" style="background-color: #81D4FA">
          <v-card-title class="headline font-weight-bold">DMリスト一覧</v-card-title>
        </v-col>
      </v-row>
      <!-- 検索フォーム ここから -->
      <v-row>
        <v-col cols="2" class="px-0 py-0">
          <v-select
            v-model="searchParams.chargeOfTeam"
            label="チーム"
            :items="pulldownChargeOfTeam"
            clearable
          ></v-select>
        </v-col>
        <v-col cols="2" class="px-0 py-0">
          <v-select
            v-model="searchParams.chargeOfConsultant"
            label="担当コンサルタント"
            :items="pulldownChargeOfConsultant"
            clearable
          ></v-select>
        </v-col>
        <v-col cols="2" class="px-0 py-0">
          <v-text-field
            v-model="searchParams.listName"
            label="リスト名"
            class="input-color-red-class"
            clearable
            maxlength=50
          ></v-text-field>
        </v-col>
        <v-col cols="2" class="px-0 py-0">
          <v-select
            v-model="searchParams.approachPurpose"
            label="アプローチ区分"
            :items="pulldownApproachPurpose"
            clearable
          ></v-select>
        </v-col>
        <v-col cols="2" class="px-0 py-0">
          <VueDatePicker
            class="ui-datepicker"
            v-model="searchParams.registrationDateFrom"
            locale="ja"
            format="yyyy-MM-dd"
            model-type="yyyy-MM-dd"
            select-text="OK"
            cancel-text="Cancel"
            placeholder="登録日(from)"
            :offset="20"
            :enable-time-picker="false"
            clearable
          ></VueDatePicker>
        </v-col>
        <v-col cols="2" class="px-0 py-0" >
          <VueDatePicker 
            class="ui-datepicker"
            v-model="searchParams.registrationDateTo"
            locale="jp"
            format="yyyy-MM-dd"
            model-type="yyyy-MM-dd"
            select-text="OK"
            cancel-text="Cancel"
            placeholder="登録日(to)"
            :offset="20"
            :enable-time-picker="false"
            >
            clearable
          </VueDatePicker>
        </v-col>
        <v-col col="11"></v-col>
        <v-col class="pt-2 " cols="1">
          <v-btn class="ui-btn" depressed color="light-blue-darken-3" @click="searchButton()">
            <v-icon dark size="large">mdi-magnify</v-icon>
          </v-btn>  
        </v-col>
      </v-row>
    </v-container>
    <!-- 検索フォーム ここまで -->
    <!-- 一覧表示 ここから -->
    <v-container class="ui-vcontaoner pt-3" >
      <v-data-table
        v-model:page="page"
        :headers="headers"
        :items="approachListItems"
        :items-per-page="parPage"
        hide-default-footer
        class="elevation-1 ui-vdatatable"
        :height="528"
        fixed-header
      >
        <template v-slot:item.createdAt="{ item }">
          {{ formatDate(item.raw.createdAt) }}
        </template>
        <template v-slot:item.requestTeam="{ item }">
          {{ getValueObject(Object.values(item.raw.requestTeam)) }}
        </template>
        <template v-slot:item.jmssIndustries="{ item }">
          {{ getValueObject(Object.values(item.raw.jmssIndustries)) }}
        </template>
        <template v-slot:item.matchingStatus="{ item }">
          {{ getTableDmListData(item.raw.id, 'matchingStatus') }}
        </template>
        <template v-slot:item.sendCompanyCount="{ item }">
          {{ getTableDmListData(item.raw.id, 'sendCompanyCount') }}
        </template>
        <template v-slot:item.chargeOfConsultant="{ item }">
          {{ getTableUserData(Object.keys(item.raw.createdBy), 'name') }}
        </template>
        <template v-slot:bottom>
          <div class="text-center pt-2">
            <v-pagination
              cols="12"
              v-model="page"
              :length="totalPage"
              @input="onChangePage"
              :total-visible="22"
            ></v-pagination>
          </div>
        </template>
        <template v-slot:item.listName="{ item }">
        <!--<nuxt-link :to="`/`">{{ item.raw.listName }}</nuxt-link>-->
        <span class="link" @click="clickListName(item.raw.id)">{{ item.raw.listName }}</span>
        </template>
      <!-- フッター削除 -->
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
import '@mdi/font/css/materialdesignicons.css'
import camelcaseKeys from 'camelcase-keys'

/**
 * 初期値設定
 */
const page = ref(1)
const parPage = ref(50)
const searchParams = ref(
  {
      chargeOfTeam : null,
      chargeOfConsultant : null,
      listName : "",
      approachPurpose : null,
      registrationDateFrom : null,
      registrationDateTo : null,
      page : 1
  }
)
const dateFrom = ref()
const dateTo = ref()

const route = useRoute();
const router = useRouter();

/**
 * テーブルデータ取得（仮）
 */
const { data }  = await useFetch('api/sample')
const dmListData: any = data.value

/**
 * 初期表示処理
 */
// DMリスト取得API呼出
const { data: dmListList} = await useFetch('/api/dmList')
// アプローチリスト取得API呼出
const { data: approachList} = await useFetch('/api/approachLists')
// ユーザー取得API呼出
const { data: user} = await useFetch('/api/user')

let tmpDmListData:any = unref(dmListList)
let dmListDatas:any = tmpDmListData[0].dmLists
let userDatas:any = unref(user)
let approachLists: any = unref(approachList)

// 取得したデータのキーをキャメルケースに変換する
const tmpData = camelcaseKeys(approachLists, { deep: true })
let a = 'consulNagoyaTeam'
console.log(tmpData[0].requestTeam[a])

// 一覧表示データのソート処理
let approachListItems = tmpData.sort(function(a, b) {
  //オブジェクトを登録日が新しい順にソートする
  return (a.createdAt < b.createdAt) ? 1 : -1;  
});

/**
 * 一覧のアプローチリストIDをキーにDMリストを検索する。
 * @param approachListId // アプローチリストID
 * @param targetKey // ターゲットとなる項目のキー
 */
function getTableDmListData(approachListId:any, targetKey:any) {
  let result = dmListDatas.filter((dmListData: any) => approachListId == dmListData.approachListId)[0]
  if(result) {
    if(targetKey == 'matchingStatus') {
      // TODO utilとかtypeフォルダ作ってメソッド呼出にしたい
      if(result[targetKey] == 1) {
        return 'マッチング中'
      }else {
        return 'マッチング済'
      }
    }
    return result[targetKey]
  } 
}

/**
 * 一覧のユーザーIDをキーにユーザーリストを検索する。
 * @param userId // ユーザーID
 * @param targetKey // ターゲットとなる項目のキー
 */
 function getTableUserData(userId:any, targetKey:any) {
  let result = userDatas.filter((userData: any) => userId[0] == userData.id)[0]
  if(result) {
    return result[targetKey]
  }
}

/**
 *  APIから取得した日時をYYYY-MM-DDにフォーマットする
 */
function formatDate(date: any) {
  return date.slice(0, 10)
}

/**
 * オブジェクトのvalueを配列で取り出し、表示する
 */
function getValueObject(arrayValue: any) {
  let joinObject = arrayValue.join(",")
  return joinObject;
}

/**
 * ページネーション用
 * 取得した一覧データの量でページの長さを設定する
 */
 function totalPageNum() {
  return Math.ceil(dmListData.length / parPage.value)
}
let totalPage = totalPageNum();

/**
 * ページネーション用
 * ページ数クリック時の処理
 */
function onChangePage() {
  
}

/**
 * プルダウンリスト生成
 */
// 部・チーム情報取得API呼出
const { data: tmpDepTeam} = await useFetch('/api/depTeam')
const depTeamsLists: any = unref(tmpDepTeam)
const dataUserLists: any = unref(user)
const approachLists1: any = unref(approachList)
let pulldownChargeOfTeam: any = new Set()
let pulldownChargeOfConsultant: any = new Set()
let pulldownApproachPurpose: any = new Set()
// チームのプルダウンリストを生成
for(let i =0; i < depTeamsLists.length; i++) {
  if(depTeamsLists[i].parent_id !== 0) {
    pulldownChargeOfTeam.add(depTeamsLists[i].name)
  }
}
// 担当コンサルタントのプルダウンリストを作成
for(let i = 0; i < dataUserLists.length; i++) {
  pulldownChargeOfConsultant.add(dataUserLists[i].name)
}
// アプローチ区分のプルダウンを作成
for(let i = 0; i < approachLists1.length; i++) {
  pulldownApproachPurpose.add(approachLists1[i].type)
}

/**
 * リスト名押下時の処理
 * @param listId
 */
const clickListName = ( listId: Number ):void => {
  // let dmDestinationCopmanyUrl = router.resolve({
  //   path: `/dmDestinationCopmany`,
  //   // query: { id: Number(listId)},
  // });
  // window.open(dmDestinationCopmanyUrl.href, '_blank')
  router.push({ 
      path: `/dmDestinationCopmany`,
      // query: { 
      //   dmListId: Number(dmListId), 

      //   selectedProcessingDate: Number(selectedBuyneedsHistoryId)
      // }
    });    
}

/**
 * 一覧表示ヘッダー設定
 */
const headers = ref(
    [
      // title,keyじゃないとヘッダーが消える
      { title: 'ID', key: 'id', sortable: false, width: 100 },
      { title: '登録日', key: 'createdAt', sortable: false, width: 150 },
      { title: '発送日', key: 'dmDate', sortable: false, width: 150 },
      { title: '発送社数', key: 'sendCompanyCount', sortable: false, width: 100 },
      { title: 'リスト名', key: 'name', sortable: false, width: 250 },
      { title: 'アプローチ区分', key: 'type', sortable: false, width: 150 },
      { title: '担当チーム', key: 'requestTeam', sortable: false, width: 150 },
      { title: '担当コンサルタント', key: 'chargeOfConsultant', sortable: false, width: 150 },
      { title: '業種', key: 'jmssIndustries', sortable: false, width: 100 },
      { title: '地域', key: 'areas', sortable: false, width: 100 },
      { title: '売上', key: 'salesRanges', sortable: false, width: 100 },
      { title: '状況', key: 'matchingStatus', sortable: false, width: 150 },
    ]
  )

/**
 * 検索ボタン押下時処理
*/ 
const searchButton = () :void => {
  // DMリスト取得APIの呼出（引数はアプローチリストIDのリスト）
  // アプローチリスト取得APIの呼出（引数はserchParams）
  // ユーザー取得APIの呼出（引数はユーザーIDのリスト）
  // 初期表示の処理と同じなので共通処理化したい。
}


</script>
<style>
.link {
    color: -webkit-link;
    cursor: pointer;
    text-decoration: underline;
}
.ui-datepicker div .dp__input_wrap .dp__input_reg {
  padding-top: 20px; 
  padding-bottom: 12px;
}
.v-data-table__th {
  background-color: #B3E5FC !important;
}
.v-input .v-input__details {
  display: none;
}
</style>