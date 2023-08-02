<template>
  <VApp>
    <v-container class="pb-0">
      <v-row>
        <v-col cols="16" class="px-0 my-3">
          <VCardTitle class="headline front-weight-bold" style="background-color: lightgray;">買いニーズマッチング結果</VCardTitle>
        </v-col>
      </v-row>
      <h3 class="px-5 my-0">DM送付先企業</h3>
      <v-row class="px-3 my-5 ">
        <v-col cols="4" v-for="(item) in tableHeaders" :key="item.title">
          <v-row v-if="item.title === '企業名'" @click="clickCompanyName(sellCompany['id'])">
            <v-col cols="10" class="px-0 py-1">
              {{ item.title }}
            </v-col>
            <v-col cols="6" class="px-0 py-1">
              {{ item.value }}
            </v-col>
          </v-row>
          <v-row v-else>
            <v-col class="px-10 py-0">
              {{ item.title }}
            </v-col>
            <v-col class="px-10 py-0">
              {{ item.value }} {{ item.bottom }}
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
    <!-- v-for以下にcssを適用させるとjustifyが効かなくなる。結果一覧にflex-columnが効かない。 -->
    <v-container style="background-color: rgb(212, 238, 251);">
      <v-row class="mx-8 py-1" justify="end">
        <h3>処理日時</h3>
        <span class="mx-10">{{ processDate }}</span>
      </v-row>
      <v-col v-for="(data, i) in tableBodyData" style="background-color: lightgray;" cols="11" class="mx-6 my-2">
        <v-row>
          <h3>買手第{{ i + 1 }}候補</h3>
        </v-row>
        <v-row justify="center">
          <v-col cols="12" class="ml-16">
            <v-row>
              <span class="ml-8">企業:</span>
              <NuxtLink class="mx-16" @click.native="clickCompanyName(buyCompanyId[i])">{{ data[0].value }}</NuxtLink>
              <span class="ml-16">都道府県:</span>
              <span class="mx-8">{{ data[1].value }}</span>
              <span class="mx-16">売上高:</span>
              <span class="ml-16">{{ data[2].value }} 百万円</span>
            </v-row>
          </v-col>
          <v-col cols="12" class="ml-16">
            <v-row>
              <span class="ml-8">買収実績:</span>
              <span class="mx-16">{{ data[3].value }}</span>
              <span class="mx-16">業種:</span>
              <span class="mx-8">{{ data[4].value }}</span>
            </v-row>
          </v-col>
          <v-col cols="12">
            <v-row justify="end">
              <span>営業種目:</span>
              <span class="mx-8">{{ data[6].value }}</span>
            </v-row>
          </v-col>
          <v-col cols="12" class="ml-16">
            <v-row>
              <span class="ml-8">買収希望エリア:</span>
              <span class="mx-4">{{ data[7].value }}</span>
            </v-row>
          </v-col>
          <v-col cols="12" class="ml-16">
            <v-row>
              <span class="ml-8">買収希望業種:</span>
              <span class="mx-8">{{ data[8].value }}</span>
            </v-row>
          </v-col>
          <v-col cols="12" class="ml-16">
            <v-row>
              <span class="ml-8">希望コメント:</span>
              <span class="mx-8" id="comment">{{ data[9].value }}</span>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
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
const tableHeaders: any = [
  { title: '企業名:', value: sellCompany.value.name },
  { title: '業種１:', value: sellCompany.value.industry1 },
  { title: '売上:', value: sellCompany.value.sales, bottom: "百万円" },
  { title: '所在地:', value: sellCompany.value.address },
  { title: '業種２:', value: sellCompany.value.industry2 },
  { title: '営業利益:', value: sellCompany.value.income, bottom: "百万円" },
  { title: '代表者名:', value: sellCompany.value.representativeName },
  { title: '業種３:', value: sellCompany.value.industry3 },
  { title: '従業員数:', value: sellCompany.value.employees, bottom: "名" },
  { title: '代表者年齢:', value: sellCompany.value.representativeAge },
  { title: '営業種目:', value: sellCompany.value.items },
]

// ボディ部のデータ
const tableBodyData: any = []
for (let i = 0; i < buyCompanys.value.length; i++) {
  const buyCompany = buyCompanys.value[i]
  const buyNeeds = buyNeedsList.value[i]

// 業種の文字部分だけを抽出
  let industryLine = buyCompany.industry.match(/[^\x01-\x7Eｧ-ﾝﾞﾟ]+/g)
  let industry = industryLine.join(",")

  const tableBody: any = [
    { title: '企業名:', value: buyCompany.name },
    { title: '都道府県:', value: buyCompany.pref },
    { title: '売上高:', value: buyCompany.sales },
    { title: '買収実績:', value: buyNeeds.accuracy },
    { title: '業種:', value: industry },
    { title: '', value: '' },// スペース用
    { title: '営業種目:', value: buyCompany.tsr["営業種目"] },
    { title: '買収希望エリア:', value: buyNeeds.prefs },
    { title: '買収希望業種:', value: buyNeeds.industries },
    { title: '希望コメント:', value: buyNeeds.remarks },
  ]
  tableBodyData.push(tableBody)
}

// itemにリンクをどうやって貼るか→v-ifで対応できるか？
const clickCompanyName = (companyId: number) :void => {
  let companyUrl = router.resolve({
    path: "/",
    query: { id: companyId },
  })

  window.open(companyUrl.href, "_blank")
}
</script>

<style>
#comment {
white-space: pre-line;
}
</style>
