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
          <v-btn class="ui-btn" depressed color="light-blue-darken-3" @click="searchButton(searchParams)">
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
        :items="dmLists"
        :items-per-page="parPage"
        hide-default-footer
        class="elevation-1 ui-vdatatable"
        :height="528"
        fixed-header
      >
        <template v-slot:[`item.createdAt`]="{ item }">
          {{ formatDate(item.raw.createdAt) }}
        </template>
        <template v-slot:[`item.requestTeam`]="{ item }">
          {{ getValueObject(Object.values(item.raw.requestTeam)) }}
        </template>
        <template v-slot:[`item.jmssIndustries`]="{ item }">
          {{ getValueObject(Object.values(item.raw.jmssIndustries)) }}
        </template>
        <template v-slot:[`item.matchingStatus`]="{ item }">
          {{ getTableDmListData(item.raw.id, 'matchingStatus') }}
        </template>
        <template v-slot:[`item.sendCompanyCount`]="{ item }">
          {{ getTableDmListData(item.raw.id, 'sendCompanyCount') }}
        </template>
        <template v-slot:[`item.chargeOfConsultant`]="{ item }">
          {{ getTableUserData(Object.keys(item.raw.createdBy), 'name') }}
        </template>
        <!-- ページネーション ここから -->
        <template v-slot:bottom>
          <div class="text-center pt-2">
            <v-pagination
              cols="12"
              v-model="page"
              :length="totalPageNum()"
              :input="onChangePage(page, searchParams)"
              :total-visible="22"
            ></v-pagination>
          </div>
        </template>
        <!-- ページネーション ここまで -->
        <template v-slot:[`item.listName`]="{ item }">
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
      approachListIds: null,
      chargeOfTeam : null,
      chargeOfConsultant : null,
      listName : null,
      approachPurpose : null,
      registrationDateFrom : null,
      registrationDateTo : null,
      limit : 50,
      page: 1
  }
)
const dateFrom = ref()
const dateTo = ref()

const route = useRoute();
const router = useRouter();
const approachListId = route.query

const { $api } = useNuxtApp();

/**
 * 初期表示処理
 */
const promiseApproachListDatas = getApproachListDatas(searchParams)

const promiseToArray = new Array()
promiseToArray.push(promiseApproachListDatas)

// getApproachListDatasの戻り値であるPromiseからPromiseresultを配列として取得する。
let dmLists = await Promise.all(promiseToArray).then(results => {
  return results[0];
})

/**
 * 一覧に表示するデータをアプローチリスト取得APIから取得する処理
 * @param searchParams 
 */
async function getApproachListDatas (searchParams: any) {
  // アプローチリスト取得API呼出
  const { data: approachList} = await useFetch('/api/approachLists')

  // 社内ポータルからのアプローチリスト取得
  // const { data: approachList} = await $api.jmssPortal.getApproachList('', searchParams, 50)
  // console.log(approachList)

  let unrefApproachLists: any = unref(approachList)

  // 取得したデータのキーをキャメルケースに変換する
  const tmpData = camelcaseKeys(unrefApproachLists[0].data, { deep: true })

  // 一覧表示データのソート処理
  let approachListItems = tmpData.sort(function(a: any, b: any) {
    //オブジェクトを登録日が新しい順にソートする
    return (a.createdAt < b.createdAt) ? 1 : -1;  
  });

  return approachListItems

}

// DMリスト取得API呼出
const { data: dmListList} = await useFetch('/api/dmList')
// const { data: dmListList} = await $api.approach.getDmList([String(approachListId)])


// ユーザー取得APIに渡すuserIDのリストを生成する
let userIds: any = new Array()
// dmListsに格納されているデータからuserIDだけを取り出して配列に格納する
for(let i =0; i < dmLists.length; i++) {
  let tmpIds = Object.keys(dmLists[i].createdBy)
  userIds.push(tmpIds[0])
}

// ユーザー取得API呼出
const { data: user} = await useFetch('/api/user')

// const { data: user} = await $api.jmssPortal.getUsersById(userIds)

let tmpDmListData:any = unref(dmListList)
let dmListDatas:any = tmpDmListData[0].dmLists
let userDatas:any = unref(user)

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
 * 取得したデータのトータルページ数を設定する
 */
// TODO アプローチリスト取得APIの戻り値の総数または最終ページ数を設定したい
 function totalPageNum() {
  console.log('ページの総数', dmLists)
  return Number(2)
}

/**
 * ページネーション用
 * ページ数クリック時の処理
 */
async function onChangePage(num: Number, searchParams: any) {  
  // serchParamsにクリックされたページ数をセットする
  searchParams.page = num
  
  // テーブルデータ表示用のデータを取得するメソッドを呼び出す
  const changePageData = getApproachListDatas(searchParams)

  // PromiseからArrayに変換する
  const promiseToArray = new Array()
  promiseToArray.push(changePageData)

  console.log('promiseToArray', promiseToArray)
  console.log('searchParams.page', searchParams.page)

  // getApproachListDatasの戻り値であるPromiseからPromiseresultを配列として取得する
  const getPageDmLists = await Promise.all(promiseToArray).then(results => {
    return results;
  })
  console.log('getPageDmLists', getPageDmLists)
  
  // テーブルデータにページ指定して取得したデータを格納する
  // TODO これ入れるとpromiseToArrayと,searchParams.pageのconsole.logが見れなくなる。そして動作確認どうする？
  // dmLists = getPageDmLists

}


/**
 * プルダウンリスト生成
 */
// 部・チーム情報取得API呼出
const { data: tmpDepTeam} = await useFetch('/api/depTeam')
const depTeamsLists: any = unref(tmpDepTeam)

// 重複削除のためSetオブジェクトを生成
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
for(let i = 0; i < userDatas.length; i++) {
  pulldownChargeOfConsultant.add(userDatas[i].name)
}
// アプローチ区分のプルダウンを作成
for(let i = 0; i < dmLists.length; i++) {
  pulldownApproachPurpose.add(dmLists[i].type)
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
async function searchButton(searchParams: any) {
  // 一覧に表示するアプローチリストのデータを取得する
  const searchApproachLists =  getApproachListDatas(searchParams)

  // Promiseで返ってきたアプローチリスト取得結果を配列に入れる
  const promiseToArray = new Array()
  promiseToArray.push(promiseApproachListDatas)

  // getApproachListDatasの戻り値であるPromiseからPromiseresultを配列として取得する。
  let searchResultDmLists = await Promise.all(promiseToArray).then(results => {
    return results[0];
  })

  dmLists = searchResultDmLists

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