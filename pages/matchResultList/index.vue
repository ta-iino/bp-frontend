<template>
  <VApp>
    <v-container class="pb-0">
      <v-row>
        <v-col cols="16" class="px-0 my-3">
          <VCardTitle class="headline front-weight-bold" style="background-color: lightgray;">買いニーズマッチング結果</VCardTitle>
        </v-col>
      </v-row>
      <h3 class="px-5 my-0">DM送付先企業</h3>
      <!-- <v-row>
        <v-row class="px-3 my-5 ">
          <v-col cols="5" v-for="(item) in tableHeaders" :key="item.title" >
            <v-col v-if="item.title==='企業名'" @click="clickCompanyName(sellCompany['id'])">
              {{ item.title }}
              {{ item.value }}
            </v-col>
            <v-col v-else cols="6" class="px-0 py-1">
              {{ item.title }}
              {{ item.value }}
            </v-col>
          </v-col>
        </v-row>
      </v-row> -->
      <v-row class="px-16 py-3">
        <v-col class="d-flex flex-column">
          <span>企業名：
            <span @click="clickCompanyName(sellCompany['id'])" class="px-16 my-0">{{ sellCompany.name }}</span>
          </span>
          <span>所在地：
            <span class="px-16 my-0">{{ sellCompany.address }}</span>
          </span>
          <span>代表者名：
            <span class="px-12 my-0">{{ sellCompany.representativeName }}</span>
          </span>
          <span>代表者年齢：
            <span class="px-8 my-0">{{ sellCompany.representativeAge }}</span>
          </span>
        </v-col>
        <v-col class="d-flex flex-column">
          <span>業種１：
            <span class="px-6 my-0"> {{ sellCompany.industry1 }}</span>
          </span>
          <span>業種２：
            <span class="px-6 my-0">{{ sellCompany.industry2 }}</span>
          </span>
          <span>業種３：
            <span class="px-6 my-0">{{ sellCompany.industry3 }}</span>
          </span>
          <span>営業種目：
            <span class="px-2 my-0">{{ sellCompany.items }}</span>
          </span>
        </v-col>
        <!-- 親要素のクラスが優先されるためかオブジェクト要素のみを後ろ揃えに出来ない -->
        <v-col class="d-flex flex-column">
          <span>売上：
            <span class="px-16 my-0" style="text-align: right;">{{ sellCompany.sales }}
              <span>百万円</span>
            </span>
          </span>
          <span>営業利益：
            <span class="px-8 my-0" style="text-align: right;">{{ sellCompany.income }}
              <span>百万円</span>
            </span>
          </span>
          <span>従業員数：
            <span class="px-8 my-0" style="text-align: right;">{{ sellCompany.employees }}
              <span>名</span>
            </span>
          </span>
        </v-col>
      </v-row>
    </v-container>
    <!-- v-for以下にcssを適用させるとjustifyが効かなくなる。結果一覧にflex-columnが効かない。 -->
    <v-container style="background-color: rgb(212, 238, 251);">
      <v-row class="mx-8 py-0" justify="end">
        <h3 class="mx-8 py-0">処理日時</h3>
        <span>{{ processDate }}</span>
      </v-row>
      <v-container v-for="(data, i) in tableBodyData" style="background-color: lightgray;" >
        <v-row>
          <h3>買手第{{ i + 1 }}候補</h3>
        </v-row>
        <v-row>
          <!-- <v-col> -->
            <v-col cols="4" v-for="item in data" :key="item.title">
              <ul>{{ item.title }}{{ item.value }}</ul>
            </v-col>
          <!-- </v-col> -->
        </v-row>
      </v-container>
    </v-container>
  </VApp>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute()
const router = useRouter()
const matchingHistoryId = route.query

// 前画面からのデータ受け取り
props: ['sellCompany', 'processDate']

// モック
const sellCompanyData = {
  id: 1,
  name: '株式会社テスト',
  address: '東京都渋谷区',
  representativeName: 'テスト太郎',
  representativeAge: 50,
  industry1: 'IT',
  industry2: 'ソフトウェア',
  industry3: 'システム開発',
  items: 'システム開発',
  sales: 100,
  income: 30,
  employees: 100
}

const sellCompany = ref(sellCompanyData)
const processDate = ref('2021/09/01 12:00:00')

// マッチング結果取得APIの呼び出し
// const { data: matchingResultData, error: matchingResultError } =
//   await useFetch('エンドポイントのURL',
//     {
//       baseURL: `${process.env.API_URL}/matchingResult/`,
//       query: { matching_history_id: matchingHistoryId }
//     })
// if (matchingResultError.value) {
//   throw matchingResultError.value
// }

// モック
const { data: matchingResultData } =
  await useFetch('api/matchingResult')

const matchingResult: any = ref(matchingResultData.value)
const buyCompanyId: number[] = ref(matchingResult["candidates_company_id"])
const buyNeedsId: number[] = ref(matchingResult["buyneeds_id"])

// 買い手企業情報取得APIの呼び出し
// const { data: buyCompanyData, error: getCompanyError } =
//   await useFetch("エンドポイントのURL",
//     {
//       baseURL: `${process.env.API_URL}`,
//       query: { "id": buyCompanyId }
//     })
// if (getCompanyError.value) {
//   throw getCompanyError.value
// }

// モック
const { data: buyCompanyData } =
  await useFetch('api/buyCompany')

const buyCompanys: any = ref(buyCompanyData.value)

// 買いニーズ情報取得APIの呼び出し
// const { data: buyNeedsData, error: getBuyneedsError } =
//   await useFetch("エンドポイントのURL", {
//     baseURL: `${process.env.API_URL}`,
//     query: { "id": buyNeedsId }
//   })
// if (getBuyneedsError.value) {
//   throw getBuyneedsError.value
// }

// モック
const { data: buyNeedsData } =
  await useFetch('api/buyNeeds')

const buyNeedsList: any = ref(buyNeedsData.value)

// // テーブルヘッダー
// const tableHeaders: any = [
//   { title: '企業名:', value: sellCompany.value.name },
//   { title: '所在地:', value: sellCompany.value.address },
//   { title: '代表者名:', value: sellCompany.value.representativeName },
//   { title: '代表者年齢:', value: sellCompany.value.representativeAge },
//   { title: '業種１:', value: sellCompany.value.industry1 },
//   { title: '業種２:', value: sellCompany.value.industry2 },
//   { title: '業種３:', value: sellCompany.value.industry3 },
//   { title: '営業種目:', value: sellCompany.value.items },
//   { title: '売上:', value: sellCompany.value.sales },
//   { title: '営業利益:', value: sellCompany.value.income },
//   { title: '従業員数:', value: sellCompany.value.employees },
// ]

// ボディ部のデータ
const tableBodyData: any = []
for (let i = 0; i < buyCompanys.value.length; i++) {
  const buyCompany = buyCompanys.value[i]
  const buyNeeds = buyNeedsList.value[i]
  const tableBody: any = [
  { title: '企業名:', value: buyCompany.name },
  { title: '買収実績:', value: buyNeeds.accuracy },
  { title: '', value: '' },// スペース用
  { title: '買収希望エリア:', value: buyNeeds.prefs },
  { title: '買収希望業種:', value: buyNeeds.industries },
  { title: '希望コメント:', value: buyNeeds.remarks },
  { title: '都道府県:', value: buyCompany.address },
  { title: '業種:', value: buyCompany.industry },
  { title: '営業種目:', value: buyCompany.items },
  { title: '売上高:', value: buyCompany.sales },
  ]
  tableBodyData.push(tableBody)
}



// const tableBody: any = [
//   { title: '企業名:', value: buyCompany.name },
//   { title: '買収実績:', value: buyNeeds.accuracy },
//   { title: '', value: '' },// スペース用
//   { title: '買収希望エリア:', value: buyNeeds.prefs },
//   { title: '買収希望業種:', value: buyNeeds.industries },
//   { title: '希望コメント:', value: buyNeeds.remarks },
//   { title: '都道府県', value: buyCompany.address },
//   { title: '業種', value: buyCompany.industry },
//   { title: '営業種目', value: buyCompany.items },
//   { title: '売上高', value: buyCompany.sales },
// ]

// let candidateNumber: number = 0
// for (let i = 1; i < buyCompany.value.length; i++) {
//   candidateNumber = i + 1
// }

// itemにリンクをどうやって貼るか→v-ifで対応できるか？
const clickCompanyName = (companyId: number) => {
  let companyUrl = router.resolve({
    path: "/",
    query: { id: companyId },
  })

  window.open(companyUrl.href, "_blank")
}
</script>

<style>
.result {
  display: flex;
  flex-direction: column;

}
</style>
