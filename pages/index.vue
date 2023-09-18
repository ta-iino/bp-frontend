<template>
  <v-app>
    <div id="app">
      <v-container>
        <v-row>
          <v-col cols="12" class="px-0 my-3 py-0" style="background-color: #81D4FA">
            <v-card-title class="headline font-weight-bold">
              DMリスト一覧
            </v-card-title>
          </v-col>
        </v-row>
        <!-- 検索フォーム ここから -->
        <v-row>
          <v-col cols="2" class="px-0 py-0">
            <v-select
              v-model="searchParams.chargeOfTeam"
              label="チーム"
              item-title="name"
              item-value="id"
              :items="pulldownChargeOfTeam"
              clearable
            />
          </v-col>
          <v-col cols="2" class="px-0 py-0">
            <v-select
              v-model="searchParams.chargeOfConsultant"
              label="担当コンサルタント"
              item-title="name"
              item-value="id"
              :items="pulldownChargeOfConsultant"
              clearable
            />
          </v-col>
          <v-col cols="2" class="px-0 py-0">
            <v-text-field
              v-model="searchParams.listName"
              label="リスト名"
              class="input-color-red-class"
              clearable
              maxlength="50"
            />
          </v-col>
          <v-col cols="2" class="px-0 py-0">
            <v-select
              v-model="searchParams.approachPurpose"
              label="アプローチ区分"
              item-title="name"
              item-value="id"
              :items="pulldownApproachPurpose"
              clearable
            />
          </v-col>
          <v-col cols="2" class="px-0 py-0">
            <VueDatePicker
              v-model="searchParams.registrationDateFrom"
              class="ui-datepicker"
              locale="ja"
              format="yyyy-MM-dd"
              model-type="yyyy-MM-dd"
              select-text="OK"
              cancel-text="Cancel"
              placeholder="登録日(from)"
              :offset="20"
              :enable-time-picker="false"
              clearable
            />
          </v-col>
          <v-col cols="2" class="px-0 py-0">
            <VueDatePicker
              v-model="searchParams.registrationDateTo"
              class="ui-datepicker"
              locale="jp"
              format="yyyy-MM-dd"
              model-type="yyyy-MM-dd"
              select-text="OK"
              cancel-text="Cancel"
              placeholder="登録日(to)"
              :offset="20"
              :enable-time-picker="false"
            />
          </v-col>
          <v-col col="11" />
          <v-col class="pt-2 " cols="1">
            <v-btn class="ui-btn" depressed color="light-blue-darken-3" @click="searchButton()">
              <v-icon dark size="large">
                mdi-magnify
              </v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
      <!-- 検索フォーム ここまで -->
      <!-- 一覧表示 ここから -->
      <v-container class="ui-vcontaoner pt-3">
        <v-data-table
          :headers="headers"
          :items="approachLists"
          :items-per-page="perPage"
          hide-default-footer
          class="elevation-1 ui-vdatatable"
          :height="528"
          fixed-header
        >
          <template #[`item.id`]="{ item }">
            {{ getTableDmListData(item.raw.id, 'id') }}
          </template>
          <template #[`item.createdAt`]="{ item }">
            {{ formatDate(item.raw.createdAt) }}
          </template>
          <template #[`item.name`]="{ item }">
            <span class="link" @click="clickListName(item.raw.id)">{{ item.raw.name }}</span>
          </template>
          <template #[`item.requestTeam`]="{ item }">
            {{ confirmationData(item.raw.requestTeam) }}
          </template>
          <template #[`item.jmssIndustries`]="{ item }">
            {{ confirmationData(item.raw.jmssIndustries) }}
          </template>
          <template #[`item.matchingStatus`]="{ item }">
            {{ getTableDmListData(item.raw.id, 'matchingStatus') }}
          </template>
          <template #[`item.sendCompanyCount`]="{ item }">
            {{ getTableDmListData(item.raw.id, 'sendCompanyCount') }}
          </template>
          <template #[`item.chargeOfConsultant`]="{ item }">
            {{ confirmationData(item.raw.requestUsers), 'name' }}
          </template>
          <!-- ページネーション ここから -->
          <template #bottom>
            <div class="text-center pt-2">
              <v-pagination
                v-model="page"
                cols="12"
                :length="totalPage"
                :total-visible="15"
              ></v-pagination>
            </div>
          </template>
          <!-- ページネーション ここまで -->
        </v-data-table>
      </v-container>
      <!-- 一覧表示 ここまで -->
    </div>
  </v-app>
</template>

<script setup lang="ts">
import { VDataTable } from 'vuetify/lib/labs/components.mjs'
import { ref, watch } from 'vue'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import '@mdi/font/css/materialdesignicons.css'
import camelcaseKeys from 'camelcase-keys'

/**
 * 初期値設定
 */
const router = useRouter()
const { $approach, $jmssPortal } = useNuxtApp()
const page: Ref<number> = ref(1) //現在のページ番号
const perPage: Ref<number> = ref(50) //1ページ当たりのアイテム数
const totalPage: Ref<number> = ref(0) //全体のページ数
watch(page ,() => {
  getApproachListsData(searchParams)
})
const searchParams: Ref<any> = ref(
  {
    approachListIds: null,
    chargeOfTeam: null,
    chargeOfConsultant: null,
    listName: null,
    approachPurpose: null,
    registrationDateFrom: null,
    registrationDateTo: null
  }
)
const approachLists: Ref<any> = ref()
/**
 * 全てのチーム、ユーザ、DMリストテーブルに登録されているアプローチIDリスト
 */
const allTeams: any = await $jmssPortal.getTeams()
const allUsers: any= await $jmssPortal.getUsersById(undefined, page.value, perPage.value)
const dmLists: any = await $approach.getDmList()
// 初期表示時から変化しないため、状態管理不要
const allApproachListIds: number[] = dmLists.value.dmLists.map((dmList: any) => dmList.approachListId)

/**
 * プルダウンリスト生成
 */
const pulldownChargeOfTeamArray: any = []
const pulldownChargeOfConsultantArray: any = []
const pulldownApproachPurposeArray: any = []

// チームのプルダウンに必要なリストを取得
for (let i = 0; i < allTeams.value.length; i++) {
  if (allTeams.value[i].parent_id !== 0) {
    pulldownChargeOfTeamArray.push({ id: allTeams.value[i].id, name: allTeams.value[i].name })
  }
}
// 担当コンサルタントのプルダウンに必要なリストを取得
for (let i = 0; i < allUsers.value.length; i++) {
  pulldownChargeOfConsultantArray.push({ id: allUsers.value[i].id, name: allUsers.value[i].name })
}

// 各プルダウンを作成
const pulldownChargeOfTeam = removeDuplicate(pulldownChargeOfTeamArray)
const pulldownChargeOfConsultant = removeDuplicate(pulldownChargeOfConsultantArray)
const pulldownApproachPurpose = getApproachTypeCode(pulldownApproachPurposeArray)

// 重複を削除するメソッドを定義する
function removeDuplicate (dataArray: any) {
  const seenNames = new Set()
  const uniqueArray = []

  for (const item of dataArray) {
    if (!seenNames.has(item.name)) {
      seenNames.add(item.name)
      uniqueArray.push(item)
    }
  }
  return uniqueArray
}

/**
 * 一覧表示用データ取得処理(アプローチリスト取得API)
 * @param searchParams
 */
const getApproachListsData = async (searchParams?: any): Promise<void> => {
  // 社内ポータルからのアプローチリスト取得
  const approachListsResponse: any = await $jmssPortal.getApproachLists(allApproachListIds.join(), searchParams?.value, page.value, perPage.value)

  // 合計ページ(total÷1ページ当たりの表示数)をtotalPageに格納する（切り上げ）
  totalPage.value = Math.ceil(approachListsResponse.value.total / perPage.value)
  // 取得したデータのキーをキャメルケースに変換する
  const tmpData = camelcaseKeys(approachListsResponse.value.data, { deep: true })
  // 一覧表示データを登録日が新しい順にソートする
  approachLists.value = tmpData.sort(function (a: any, b: any) {
    return (getTableDmListData(a.id, 'id') < getTableDmListData(b.id, 'id')) ? 1 : -1
  })
}

// 初期表示用に呼び出し
getApproachListsData()

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
    { title: '状況', key: 'matchingStatus', sortable: false, width: 150 }
  ]
)

/**
 * 一覧のアプローチリストIDをキーにDMリストを検索する。
 * @param approachListId // アプローチリストID
 * @param targetKey // ターゲットとなる項目のキー
 */
const getTableDmListData = (approachListId:any, targetKey:any): any => {
  const result = (dmLists.value.dmLists).filter((dmListData: any) => approachListId === dmListData.approachListId)[0]
  if (result) {
    if (targetKey === 'matchingStatus') {
      return getMatchngStatusStr(result[targetKey])
    }
    return result[targetKey]
  }
}

/**
 * 検索ボタン押下時処理
*/
const searchButton = (): void => {
  page.value = 1
  // 一覧に表示するアプローチリストのデータを取得する
  getApproachListsData(searchParams)
}

/**
 * リスト名押下時の処理
 * @param approachListId
 */
const clickListName = (approachListId: number):void => {
  const dmDestinationCompanyUrl = router.resolve({
    path: `/dmDestinationCompany/${approachListId}`
  })
  window.open(dmDestinationCompanyUrl.href, '_blank')
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