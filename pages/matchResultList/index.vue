<template>
  <VApp>
    <v-container>
      <!-- 現状だと上半分くらい固定されてしまって若干見づらいので何とかしたい -->
      <v-row id="sticky" class="my-n6">
        <v-row>
          <v-col cols="16" class="px-0 my-3">
            <VCardTitle class="ml-3 mr-9" style="background-color: #81d4fa;">買いニーズマッチング結果</VCardTitle>
          </v-col>
        </v-row>
        <v-sheet color="white" elevation="1" height="172" class="mr-6">
          <v-card-title style="background-color: #b3e5fc;" class="header-back">
            <h4 class="mt-n2 ml-n2">DM送付先企業</h4>
          </v-card-title>
          <v-row class="px-16 mb-6 mt-2">
            <v-col cols="4" v-for="(item, i) in tableHeaders" :key="item.title">
              <v-row v-if="i === 0">
                <v-divider class="border-opacity-25" vertical></v-divider>
                <v-col class="px-10 py-0">
                  {{ item.title }}
                </v-col>
                <v-col class="pl-4 py-0" @click="clickCompanyName(sellCompany['id'])">
                  {{ item.value }}
                </v-col>
                <v-divider class="border-opacity-25" vertical></v-divider>
                <v-divider class="border-opacity-25"></v-divider>
              </v-row>
              <v-row v-else>
                <v-divider class="border-opacity-25" vertical></v-divider>
                <v-col class="px-10 py-0">
                  {{ item.title }}
                </v-col>
                <v-col class="px-10 py-0">
                  {{ item.value }} {{ item.bottom }}
                </v-col>
                <v-divider class="border-opacity-25" vertical></v-divider>
                <v-divider class="border-opacity-25"></v-divider>
              </v-row>
            </v-col>
          </v-row>
          <v-row justify="center" class="mt-n6">
            <!-- DM送付先画面で別タブで開かれたら閉じれるはず -->
            <v-btn color="light-blue-darken-4" class="mb-4" border="0" @click="clickCloseButton()">閉じる</v-btn>
          </v-row>
        </v-sheet>
      </v-row>
      <!-- そのままではヘッダーの下に潜ってしまうので無理やりスペースを作る -->
      <v-row class="my-16 comment">
        <br>
        <br>
        <br>
        <br>
      </v-row>
      <v-row class="mt-16 mr-8">
        <v-row class="mr-n16 pt-1" justify="end">
          <h3>処理日時</h3>
          <span class="mx-10">{{ processDate }}</span>
        </v-row>
        <v-sheet v-for="(data, i) in tableBodyData" :key="i" cols="16" class="mx-6 my-2" elevation="1" height="230">
          <v-card-title style="background-color: #e1f5fe;" class="header-back">
            <h4 class="mt-n2 ml-n2">買手第{{ i + 1 }}候補</h4>
          </v-card-title>
          <v-row>
            <v-col cols="12" class="mb-n6">
              <v-row>
                <v-col cols="2">
                  企業:
                </v-col>
                <v-col cols="3">
                  <NuxtLink @click="clickCompanyName(buyCompanyId[i])">{{ data[0].value }}</NuxtLink>
                </v-col>
                <v-divider class="border-opacity-25 my-3" vertical></v-divider>
                <v-col cols="2">
                  都道府県:
                </v-col>
                <v-col cols="2">
                  {{ data[1].value }}
                </v-col>
                <v-col cols="3"></v-col>
              </v-row>
              <v-divider class="border-opacity-25"></v-divider>
            </v-col>
            <v-col cols="12" class="mb-n6">
              <v-row>
                <v-col cols="2">
                  買収実績:
                </v-col>
                <v-col cols="3">
                  {{ data[3].value }}
                </v-col>
                <v-divider class="border-opacity-25 my-3" vertical></v-divider>
                <v-col cols="2">
                  業種:
                </v-col>
                <v-col cols="5">
                  {{ data[4].value }}
                </v-col>
              </v-row>
              <v-divider class="border-opacity-25"></v-divider>
            </v-col>
            <v-col cols="12" class="mb-n6">
              <v-row>
                <v-col cols="2">
                  売上高:
                </v-col>
                <v-col cols="3">
                  {{ data[2].value }} 百万円
                </v-col>
                <v-divider class="border-opacity-25 my-3" vertical></v-divider>
                <v-col cols="2">
                  営業種目:
                </v-col>
                <v-col cols="5">
                  {{ data[6].value }}
                </v-col>
              </v-row>
              <v-divider class="border-opacity-25"></v-divider>
            </v-col>
            <v-col cols="12" class="mb-n6">
              <v-row>
                <v-col cols="2">
                  買収希望エリア:
                </v-col>
                <v-col cols="3">
                  {{ data[7].value }}
                </v-col>
                <v-divider class="border-opacity-25 my-3" vertical></v-divider>
                <v-col cols="7">
                  <v-spacer></v-spacer>
                </v-col>
              </v-row>
              <v-divider class="border-opacity-25"></v-divider>
            </v-col>
            <v-col cols="12" class="mb-n6">
              <v-row>
                <v-col cols="2">
                  買収希望業種:
                </v-col>
                <v-col cols="3">
                  {{ data[8].value }}
                </v-col>
                <v-divider class="border-opacity-25 my-3" vertical></v-divider>
                <v-col cols="7">
                  <v-spacer></v-spacer>
                </v-col>
              </v-row>
              <v-divider class="border-opacity-25"></v-divider>
            </v-col>
            <v-col cols="12">
              <v-row>
                <v-col cols="2">
                  希望コメント:
                </v-col>
                <v-col cols="3">
                  <span id="comment">{{ data[9].value }}</span>
                </v-col>
                <v-divider class="border-opacity-25 my-3" vertical></v-divider>
                <v-col cols="7">
                  <v-spacer></v-spacer>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-sheet>
      </v-row>
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

// itemにリンクをどうやって貼るか→v-ifで対応
const clickCompanyName = (companyId: number): void => {
  let companyUrl = router.resolve({
    path: "/",
    query: { id: companyId },
  })

  window.open(companyUrl.href, "_blank")
}
const clickCloseButton = (): void => {
  window.close()
}
</script>

<style>
#comment {
  white-space: pre-line;
}

#sticky {
  position: fixed;
  z-index: 1;
  width: 1200px;
  background-color: white;
}

.header-back {
  height: 30px;
}
</style>
