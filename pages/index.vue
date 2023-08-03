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
            clearable
          ></v-select>
        </v-col>
        <v-col cols="2" class="px-0 py-5">
          <v-select
            v-model="searchParams.chargeOfConsultant"
            label="担当コンサルタント"
            :items="pulldownChargeOfConsultant"
            clearable
          ></v-select>
        </v-col>
        <v-col cols="2" class="px-0 py-5">
          <v-text-field
            v-model="searchParams.listName"
            label="リスト名"
            class="input-color-red-class"
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="2" class="px-0 py-5">
          <v-select
            v-model="searchParams.approachPurpose"
            label="アプローチ区分"
            :items="pulldownApproachPurpose"
            clearable
          ></v-select>
        </v-col>
        <!--<v-col cols="2" class="px-0">
          <v-text-field v-model="searchParams.registrationDateFrom" clearable label="登録日(from)" filled></v-text-field>
        </v-col>-->
        <v-col cols="2" class="px-0">
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
            clearable
          ></VueDatePicker>
        </v-col>
        <v-col cols="2" class="px-0">
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
            clearable
          </VueDatePicker>
        </v-col>
<!--        <v-col cols="2" class="px-0">
          <v-text-field v-model="searchParams.registrationDateTo" clearable label="登録日(to)" filled></v-text-field>
        </v-col>-->
      </v-row>
      <v-row justify="center" class="ma-4">
        <v-btn class="ui-btn" depressed color="grey-darken-4" @click="searchButton(searchParams)">検索</v-btn>
      </v-row>
    </v-container>
    <!-- 検索フォーム ここまで -->
    <!-- 一覧表示 ここから -->
    <v-container class="ui-vcontaoner" >
      <v-data-table
          class="ui-vdatatable"
          :items="dmListData"
          :headers="headers"
          :height="528"
          :items-per-page="-1"
          fixed-header
      >
      <template v-slot:item.listName="{ item }">
        <!--<nuxt-link :to="`/`">{{ item.raw.listName }}</nuxt-link>-->
        <span class="link" @click="clickListName(item.raw.id)">{{ item.raw.listName }}</span>
      </template>
      <!-- フッター削除 -->
      <template v-slot:bottom></template>
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
const dateFrom = ref()
const dateTo = ref()

const route = useRoute();
const router = useRouter();

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
 * 初期表示と検索で条件分岐特定のアプローチリストIDの有無により取得を分ける。
 */
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

// アプローチリスト取得API呼出
const { data: approachList} = await useAsyncData(
  'approachList',
  (approachListIdList) => $fetch('/api/approachLists')
)

// ユーザー取得API呼出
const { data: user} = await useAsyncData(
  'user',
  (userId) => $fetch('/api/user')
)

/**
 * プルダウンリスト生成
 * 各APIの結果を使って以下を作成する
 * チームリスト(アプローチリスト取得APIの結果から作成)
 * 担当コンサルタントリスト(ユーザー取得APIの結果から作成)
 * アプローチ区分リスト(アプローチリスト取得APIの結果から作成)
 * 構想：各リストを取り出した配列を作成し、Setリストに格納する。（重複削除）
 */
const jsonApproachList = approachList
const pulldownChargeOfTeam1: any = []
const pulldownChargeOfConsultant1: any = []
const pulldownApproachPurpose1: any = []

/**
 * プルダウンリスト取得(削除予定)
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
  // アプローチリスト取得APIの呼出
  
  // DMリスト取得APIの呼出

}


</script>
<style>
.link {
    color: -webkit-link;
    cursor: pointer;
    text-decoration: underline;
}
.ui-datepicker div .dp__input_wrap {
  padding-top: 8px;
}
.ui-datepicker div .dp__input_wrap div .dp__icon {
  padding-top: 20px;
}
.ui-datepicker div .dp__input_wrap .dp__icon {
  padding-top: 20px;
}
.ui-datepicker div .dp__input_wrap .dp__input_reg {
  padding-top: 20px; 
  padding-bottom: 12px;
}
.v-btn {
  border: 4px outset black;
}
.v-data-table__th {
  background-color: #ffeccc !important;
}
</style>