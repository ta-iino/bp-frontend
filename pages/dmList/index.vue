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
        :items="approachLists"
        :items-per-page="perPage"
        hide-default-footer
        class="elevation-1 ui-vdatatable"
        :height="528"
        fixed-header
      >
        <template v-slot:[`item.createdAt`]="{ item }">
          {{ formatDate(item.raw.createdAt) }}
        </template>
        <template v-slot:[`item.name`]="{ item }">
          <!-- <nuxt-link :to="`/dmDestinationCopmany/${item.raw.id}`">{{ item.raw.name }}</nuxt-link> -->
          <span class="link" @click="clickListName(item.raw.id)">{{ item.raw.name }}</span>
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
              :length="totalPage"
              :input="onChangePage(page)"
              :total-visible="22"
            ></v-pagination>
          </div>
        </template>
        <!-- ページネーション ここまで -->
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
const router = useRouter();
const { $api } = useNuxtApp();
const page: Ref<number> = ref(1);
const perPage: Ref<number> = ref(50);
const totalPage: Ref<number> = ref(0);
const searchParams: Ref<any> = ref(
  {
      approachListIds: null,
      chargeOfTeam : null,
      chargeOfConsultant : null,
      listName : null,
      approachPurpose : null,
      registrationDateFrom : null,
      registrationDateTo : null,
  }
)
const approachLists: Ref<any> = ref();
/**
 * 全てのチームリスト
 */
const {data: allTeamsData}: any = await $api.jmssPortal.getTeams();
const allTeams: any = ref(allTeamsData);
/**
 * 全てのユーザリスト
 */
const {data: allUsersData} = await $api.jmssPortal.getUsersById(undefined, page.value, perPage.value);
const allUsers: any = ref(allUsersData.value);

/**
 * DMリストテーブルに格納されている全てのアプローチリストIDリスト
 */
const {data: dmListsData} = await $api.approach.getDmList()
const dmLists: any = ref(dmListsData.value)
const allApproachListIds: number[] = (dmLists.value).map((dmList: any)  => dmList.dmList.companyId);
/**
 * モック
 */
// DMリスト取得API呼出
// const { data: dmListList} = await useFetch('/api/dmList')
// ユーザー取得API呼出
// const { data: user} = await useFetch('/api/user')
// アプローチリスト
// const { data: approachList} = await useFetch('/api/approachLists')
// チーム
// const { data: tmpDepTeam} = await useFetch('/api/depTeam')

/**
 * プルダウンリスト生成
 * TODO アプローチリスト取得APIにはコードで渡さないといけない。
 * ⇒なので、key=id, value=nameのjson型のリストにする。searchParamsに入れる値はkeyのコードにする
 */
// 重複削除のためSetオブジェクトを生成
let pulldownChargeOfTeam: any = new Set()
let pulldownChargeOfConsultant: any = new Set()
let pulldownApproachPurpose: any = new Set()

// チームのプルダウンリストを生成
for(let i =0; i < allTeams.length; i++) {
  if(allTeams[i].parent_id !== 0) {
    pulldownChargeOfTeam.add(allTeams[i].name)
  }
}
// 担当コンサルタントのプルダウンリストを作成
for(let i = 0; i < allUsers.length; i++) {
  pulldownChargeOfConsultant.add(allUsers[i].name)
}
// アプローチ区分のプルダウンを作成
for(let i = 0; i < dmLists.length; i++) {
  pulldownApproachPurpose.add(dmLists[i].type)
}

/**
 * 一覧表示用データ取得処理(アプローチリスト取得API)
 * @param searchParams 
 */
const getApproachListDatas = async (searchParams?: any): Promise<void> => {

  // 社内ポータルからのアプローチリスト取得
  const { data: approachListData} = await $api.jmssPortal.getApproachLists(allApproachListIds, searchParams, page.value, perPage.value);
  const approachListsResponse: any = ref(approachListData.value);
  // 合計ページ(total÷1ページ当たりの表示数)をtotalPageに格納する
  totalPage.value = (approachListsResponse.value.total / perPage.value);
  // 取得したデータのキーをキャメルケースに変換する
  const tmpData = camelcaseKeys(approachListsResponse.value.data, { deep: true });

  // 一覧表示データを登録日が新しい順にソートする
  approachLists.value = tmpData.sort(function(a: any, b: any) {
    return (a.createdAt < b.createdAt) ? 1 : -1;  
  });
}

// // ユーザー取得APIに渡すuserIDのリストを生成する
// const userIds: number[] = (
//   (approachLists.value).map((approachList: any)  => Object.keys(approachList.createdBy))
// );

// ヘッダ
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
    { title: '担当コンサルタント', key: 'chargeOfConsultant', sortable: false, width: 180 },
    { title: '業種', key: 'jmssIndustries', sortable: false, width: 100 },
    { title: '地域', key: 'areas', sortable: false, width: 100 },
    { title: '売上', key: 'salesRanges', sortable: false, width: 100 },
    { title: '状況', key: 'matchingStatus', sortable: false, width: 150 },
  ]
)

/**
 * 一覧のアプローチリストIDをキーにDMリストを検索する。
 * @param approachListId // アプローチリストID
 * @param targetKey // ターゲットとなる項目のキー
 */
const getTableDmListData = (approachListId:any, targetKey:any): any => {
  let result = dmLists.value.filter((dmListData: any) => approachListId == dmListData.dmList.approachListId)[0]
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
 const getTableUserData = (userId:any, targetKey:any): any => {
  let result = allUsers.filter((user: any) => userId[0] == user.id)[0]
  if(result) {
    return result[targetKey]
  }
}

/**
 * 検索ボタン押下時処理
*/ 
const searchButton = (): void => {
  page.value = 1;
  // 一覧に表示するアプローチリストのデータを取得する
  getApproachListDatas(searchParams);
}

/**
 * ページネーションで違うページ押下時の処理
 * @param tagetPage クリックしたページネーションの番号
 */
 const onChangePage = (tagetPage: number): void => {
  page.value = tagetPage
  getApproachListDatas(searchParams);
}

/**
 * リスト名押下時の処理
 * @param approachListId
 */
 const clickListName = ( approachListId: number ):void => {
  router.push({ 
      path: `/dmDestinationCopmany/${approachListId}`,
  });
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