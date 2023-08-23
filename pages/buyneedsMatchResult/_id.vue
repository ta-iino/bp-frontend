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
            <v-col cols="4" v-for="(item, i) in items" :key="item.title">
              <v-row v-if="item.title === '企業名:'">
                <v-col class="px-10 py-0">{{ item.title }}</v-col>
                <v-col class="pl-4 py-0 link" @click="clickCompanyName(item.value)">{{ item.value }}</v-col>
              </v-row>
              <v-row v-else>
                <v-col class="px-10 py-0">{{ item.title }}</v-col>
                <v-col class="px-10 py-0">{{ item.value }} {{ item.bottom }}</v-col>
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
        <v-sheet v-for="(buyneeds, i) in buyneedsList" :key="i" cols="16" class="mx-6 my-2" elevation="1" height="230">
          <v-card-title style="background-color: #e1f5fe;" class="header-back">
            <h4 class="mt-n2 ml-n2">買手第{{ i + 1 }}候補</h4>
          </v-card-title>
          <v-row>
            <v-col cols="12" class="mb-n6">
              <v-row>
                <v-col cols="2">企業:</v-col>
                <v-col cols="3">
                  <span class="link" @click="clickCompanyName(Number(Object.keys(buyneeds.raw.company)))">
                    {{ getTargetBuyComapnyData(buyneeds, 'name') }}
                  </span>
                </v-col>
                <v-col cols="2">都道府県:</v-col>
                <v-col cols="2">
                  {{ getTargetBuyComapnyData(buyneeds, 'pref') }}
                </v-col>
                <v-col cols="3"></v-col>
              </v-row>
            </v-col>
            <v-col cols="12" class="mb-n6">
              <v-row>
                <v-col cols="2">買収実績:</v-col>
                <v-col cols="3">{{ buyneeds.raw.accuracy }}</v-col>
                <v-col cols="2">業種:</v-col>
                <v-col cols="5">{{ getCompanyIndutryNames(buyneeds) }}</v-col>
              </v-row>
            </v-col>
            <v-col cols="12" class="mb-n6">
              <v-row>
                <v-col cols="2">売上高:</v-col>
                <v-col cols="3">
                  {{ getTargetBuyComapnyData(buyneeds, 'sales') }} 百万円
                </v-col>
                <v-col cols="2">営業種目:</v-col>
                <v-col cols="5">
                  {{ getValueObject(getTargetBuyComapnyData(buyneeds, 'tsr')["営業種目"]) }}
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" class="mb-n6">
              <v-row>
                <v-col cols="2">買収希望エリア:</v-col>
                <v-col cols="3">{{ getValueObject(Object.values(buyneeds.raw.prefs)) }}</v-col>
                <v-col cols="7"><v-spacer></v-spacer></v-col>
              </v-row>
            </v-col>
            <v-col cols="12" class="mb-n6">
              <v-row>
                <v-col cols="2">買収希望業種:</v-col>
                <v-col cols="3">{{ getValueObject(Object.values(buyneeds.raw.industries)) }}</v-col>
                <v-col cols="7"><v-spacer></v-spacer></v-col>
              </v-row>
            </v-col>
            <v-col cols="12">
              <v-row>
                <v-col cols="2">希望コメント:</v-col>
                <v-col cols="3"><span id="comment">{{ buyneeds.raw.remarks }}</span></v-col>
                <v-col cols="7"><v-spacer></v-spacer></v-col>
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
import { useRoute } from 'vue-router';

/**
 * 初期値設定
 */
const route = useRoute();
const { $api } = useNuxtApp();
const config = useRuntimeConfig();
const sellCompanyId = Number(route.params.id);
const sendCompanyHistoryId = Number(route.query.sendCompanyHistoryId);
const processDate = String(route.query);

/**
 * モック
 */
// 発送企業情報
// const sellCompany = {
//   id: 1,
//   name: '株式会社テスト',
//   address: '東京都渋谷区',
//   representativeName: 'テスト太郎',
//   representativeAge: 50,
//   industry1: 'IT',
//   industry2: 'ソフトウェア',
//   industry3: 'システム開発',
//   items: 'システム開発',
//   sales: 100,
//   income: 30,
//   employees: 100
// }
// マッチング結果テーブル情報
// const { data: buyneedsMatchingResultData } = await useFetch('api/matchingResult')

// 買手企業情報
// const { data: buyCompanyList } = await useFetch('api/buyCompany')

// 買いニーズ情報
// const { data: buyNeedsList } =　await useFetch('api/buyNeeds')
/**
 * /モック終了
 */



/**
 * ヘッダ部のデータ作成
 */
// 売手企業情報取得APIの呼び出し
const { data: sellCompanyData } = await $api.jmssPortal.getCompanies([sellCompanyId])
const sellCompany: any = ref(sellCompanyData.value)
// 表示タイトルとバリューの作成
const items: any = [
  { title: '企業名:', value: sellCompany.name },
  { title: '業種１:', value: getCompanyIndustryNameArray(sellCompany.industry)[0] },
  { title: '売上:', value: sellCompany.sales, bottom: "百万円" },
  { title: '所在地:', value: sellCompany.address },
  { title: '業種２:', value: getCompanyIndustryNameArray(sellCompany.industry)[1] },
  { title: '営業利益:', value: sellCompany.income, bottom: "百万円" },
  { title: '代表者名:', value: sellCompany.representativeName },
  { title: '業種３:', value: getCompanyIndustryNameArray(sellCompany.industry)[2] },
  { title: '従業員数:', value: sellCompany.employees, bottom: "名" },
  { title: '代表者年齢:', value: sellCompany.representativeAge },
  { title: '営業種目:', value: getValueObject(sellCompany.tsr["営業種目"])  },
]


/**
 * ボディ部のデータ作成
 */
// マッチング結果取得APIの呼び出し
const { data: buyneedsMatchingResultData } = (
  await $api.approach.getBuyneedsMatchingResult(sendCompanyHistoryId)
)
const buyneedsMatchingResult: any = ref(buyneedsMatchingResultData.value)

// 買い手企業情報取得APIの呼び出し
const buyCompanyIds: number[] = ref(
  buyneedsMatchingResult.map((item: { candidateCompanyId: number; }) => item.candidateCompanyId)
);
const { data: buyCompanyData } = await $api.jmssPortal.getCompanies(buyCompanyIds)
const buyCompanyList: any = ref(buyCompanyData.value)

// 買いニーズ情報取得APIの呼び出し
const buyneedsIds: number[] = ref(
  buyneedsMatchingResult.map((item: { buyneeds_id: number; }) => item.buyneeds_id)
);
const { data: buyneedsData } = await $api.jmssPortal.getBuyneeds(buyneedsIds)
const buyneedsList: any = ref(buyneedsData.value)

/**
 * 買いニーズに紐づく買手企業から特定データを取得する
 * @param buyneeds
 * @param targetKey
 */
const getTargetBuyComapnyData = (buyneeds:any, targetKey:any): any => {
  let result: any = buyCompanyList.filter((buyCompany: any) => Object.keys(buyneeds.raw.company)[0] == buyCompany.id)[0]
  if(result) {
    return result[targetKey]
  }
}

/**
 * 買手企業の業種表示用(複数処理が必要なためmethods化した)
 * @param buyneeds 
 */
const getCompanyIndutryNames = (buyneeds: any): string => {
  const industry: string = getTargetBuyComapnyData(Object.keys(buyneeds.raw.company), 'industry')
  const industryNameArray: string[] = getCompanyIndustryNameArray(industry)
  const industryNames: string = getValueObject(industryNameArray)
  return industryNames
}

/**
 * 会社名押下時の処理
 * @param companyId 
 */
const clickCompanyName = (companyId: number): void => {
  const url = config.public.jmssPortalbaseURL + '/company/' + companyId;
  window.open(url)
}

/**
 * 閉じるボタン押下時の処理
 */
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

.link {
    color: -webkit-link;
    cursor: pointer;
    text-decoration: underline;
}
</style>
