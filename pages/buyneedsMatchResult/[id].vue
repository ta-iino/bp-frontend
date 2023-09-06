<template>
  <VApp>
    <v-container fluid>
      <!-- 現状だと上半分くらい固定されてしまって若干見づらいので何とかしたい -->
      <v-row id="sticky">
        <v-row class="px-6">
          <v-col cols="12" class="my-3">
            <VCardTitle style="background-color: #81d4fa;">
              <h4 class="mt-n1 ml-n2">
              買いニーズマッチング結果
              </h4>
            </VCardTitle>
          </v-col>
        </v-row>
        <v-sheet color="white" class="px-6">
          <v-card-title style="background-color: #b3e5fc;" class="header-back">
            <h4 class="mt-n2 ml-n2">
              DM発送先企業
            </h4>
          </v-card-title>
          <v-row class="px-4 mb-6 mt-auto">
            <v-col v-for="(item) in items" :key="item.title" cols="4">
              <v-row v-if="item.title === '企業名:'">
                <v-col cols="3" class="px-0 py-1">
                  {{ item.title }}
                </v-col>
                <v-col class="pl-4 py-0 link" @click="clickCompanyName(item.value.id)">
                  {{ item.value.value }}
                </v-col>
              </v-row>
              <v-row v-else>
                <v-col cols="3" class="px-0 py-1">
                  {{ item.title }}
                </v-col>
                <v-col cols="9" class="px-0 py-1">
                  {{ item.value }} {{ item.bottom }}
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-row justify="center" class="mt-n6">
            <!-- DM送付先画面で別タブで開かれたら閉じれるはず -->
            <v-btn color="light-blue-darken-4" class="mb-4" border="0" @click="clickCloseButton()">
              閉じる
            </v-btn>
          </v-row>
        </v-sheet>
        </v-row>
          <!-- そのままではヘッダーの下に潜ってしまうので無理やりスペースを作る
      <v-row class="my-16 comment">
        <br>
        <br>
        <br>
        <br>
      </v-row> -->
      <v-row>
        <v-row class="pt-5" justify="end">
          <h3>処理日時</h3>
          <span class="mx-10">{{ processDate }}</span>
        </v-row>
        <v-sheet
          v-for="(buyneeds, i) in buyneedsList.data"
          :key="i"
          cols="16"
          class="mx-6 my-2"
          elevation="1"
          height="auto"
        >
          <v-card-title style="background-color: #e1f5fe;" class="header-back">
            <h4 class="mt-n2 ml-n2">
              買手第{{ i + 1 }}候補
            </h4>
          </v-card-title>
          <v-row>
            <v-col cols="12" class="mb-n6">
              <v-row>
                <v-col cols="1" />
                <v-col cols="2">
                  企業:
                </v-col>
                <v-col cols="3">
                  <span class="link" @click="clickCompanyName(getValueObject(Object.keys(buyneeds.company)))">
                    {{ getTargetBuyComapnyData(buyneeds, "name") }}
                  </span>
                </v-col>
                <v-col cols="2">
                  都道府県:
                </v-col>
                <v-col cols="3">
                  {{ getTargetBuyComapnyData(buyneeds, 'pref') }}
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" class="mb-n6">
              <v-row>
                <v-col cols="1" />
                <v-col cols="2">
                  買収実績:
                </v-col>
                <v-col cols="3">
                  {{ buyneeds.accuracy }}
                </v-col>
                <v-col cols="2">
                  業種:
                </v-col>
                <v-col cols="3">
                  {{ getCompanyIndutryNames(buyneeds) }}
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" class="mb-n6">
              <v-row>
                <v-col cols="1" />
                <v-col cols="2">
                  売上高:
                </v-col>
                <v-col cols="3">
                  {{ getTargetBuyComapnyData(buyneeds, 'sales') }} 百万円
                </v-col>
                <v-col cols="2">
                  営業種目:
                </v-col>
                <v-col cols="3">
                  {{ getTargetBuyComapnyData(buyneeds, 'tsr')['営業種目'] }}
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" class="mb-n6">
              <v-row>
                <v-col cols="1" />
                <v-col cols="2">
                  買収希望エリア:
                </v-col>
                <v-col cols="3">
                  {{ getValueObject(Object.values(buyneeds.prefs)) }}
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" class="mb-n6">
              <v-row>
                <v-col cols="1" />
                <v-col cols="2">
                  買収希望業種:
                </v-col>
                <v-col cols="3">
                  {{ getValueObject(Object.values(buyneeds.industries)) }}
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12">
              <v-row>
                <v-col cols="1" />
                <v-col cols="2">
                  希望コメント:
                </v-col>
                <v-col cols="3">
                  <span id="comment">{{ buyneeds.remarks }}</span>
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
import { ref } from 'vue'
import { useRoute } from 'vue-router'

/**
 * 初期値設定
 */
const route = useRoute()
const { $approach, $jmssPortal } = useNuxtApp()
const config = useRuntimeConfig()
const sellCompanyId = Number(route.params.id)
const sendCompanyHistoryId = 4
const processDate = String(route.query)


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
// const { data: buyNeedsList } = await useFetch('api/buyNeeds')
/**
 * /モック終了
 */

/**
 * ヘッダ部のデータ作成
 */
// 売手企業情報取得APIの呼び出し
const sellCompany: any = await $jmssPortal.getCompanies([sellCompanyId])
// const sellCompany: any = ref(sellCompanyData.value)
// UT用モック
// const { data: sellCompanyData } = await useFetch('/api/companies')
// const sellCompany: any = ref(sellCompanyData.value)
// 表示タイトルとバリューの作成
const items: any = [
  // fix リンク押下時に企業IDを渡したかったので修正した
  { title: '企業名:', value: confirmationData({ id: sellCompany.value.data[0].id, value: sellCompany.value.data[0].name } )},
  { title: '業種１:', value: confirmationData(sellCompany.value.data[0].industry)[0] },
  { title: '売上:', value: sellCompany.value.data[0].sales, bottom: '百万円' },
  { title: '所在地:', value: sellCompany.value.data[0].address },
  { title: '業種２:', value: confirmationData(sellCompany.value.data[0].industry)[1] },
  { title: '営業利益:', value: sellCompany.value.data[0].profit, bottom: '百万円' },
  { title: '代表者名:', value: sellCompany.value.data[0].representative_name },
  { title: '業種３:', value: confirmationData(sellCompany.value.data[0].industry)[2] },
  { title: '従業員数:', value: sellCompany.value.data[0].employees, bottom: '名' },
  { title: '代表者年齢:', value: getCeoAge(sellCompany.value.data[0].tsr['生年月日']) },
  { title: '営業種目:', value: sellCompany.value.data[0].tsr['営業種目'] }
]


// /**
//  *  tsr内のvalueを取得する処理
//  * @param id: 一覧表示データのマスタID
//  * @param targetKey: ターゲットとなるtsr情報のキー値
//  */
//  const getTsrData = (targetKey: any) => {
//   // 一覧表示用のデータからidをキーにtsr情報を取得して、targetKeyを添え字にしたvalueを取得する
//   const result = (sellCompany.value).filter((destinationCompanyData: any) => id === destinationCompanyData.id)[0]
//   if (id || targetKey === null || id || targetKey === undefined) {
//     return ''
//   }
//   if (result) {
//     return result.tsr[targetKey]
//   }
//   return ''
// }
// /**
//  * ボディ部のデータ作成
//  */
// マッチング結果取得APIの呼び出し
const buyneedsMatchingResult: any = (await $approach.getBuyneedsMatchingResult(sendCompanyHistoryId))
// const buyneedsMatchingResult: any = ref(buyneedsMatchingResultData.value)

// // 買い手企業情報取得APIの呼び出し
const buyCompanyIds: number[] = (
  buyneedsMatchingResult.value.buyneedsMatchingResults.map((item: { candidateCompanyId: number; }) => item.candidateCompanyId)
)
console.log(buyneedsMatchingResult)
console.log(buyCompanyIds)
const buyCompanyList: any = await $jmssPortal.getCompanies(buyCompanyIds.join())
console.log(buyCompanyList)
// const buyCompanyList: any = ref(buyCompanyData.value)

// // 買いニーズ情報取得APIの呼び出し
const buyneedsIds: number[] = (
  buyneedsMatchingResult.value.buyneedsMatchingResults.map((item: { buyneedsId: number; }) => item.buyneedsId)
)
console.log(buyneedsMatchingResult)
console.log(buyneedsIds)
const buyneedsList: any = await $jmssPortal.getBuyneeds(buyneedsIds.join())
console.log(buyneedsList)
// const buyneedsList: any = ref(buyneedsData.value)

/**
 * UT用モック
 * ボディ部のデータ作成
 */
// マッチング結果取得APIの呼び出し
// const { data: buyneedsMatchingResultData } = await useFetch('/api/matchingResult')
// const buyneedsMatchingResult: any = ref(buyneedsMatchingResultData.value)

// 買い手企業情報取得APIの呼び出し
// const buyCompanyIds: number[] = ref(
//   // fix 元のコードのままだとmapが呼び出せなかったので修正
//   buyneedsMatchingResult.buyneedsMatchingResults.map((item: { candidateCompanyId: number; }) => item.candidateCompanyId)
// )
// const buyCompanyList: any= await useFetch('/api/copmanyMasterList')
// // const buyCompanyList: any = ref(buyCompanyData.value)

// // 買いニーズ情報取得APIの呼び出し
// const buyneedsIds: number[] = ref(
//   // fix 元のコードのままだとmapが呼び出せなかったので修正
//   buyneedsMatchingResult.value.buyneedsMatchingResults.map((item: { buyneeds_id: number; }) => item.buyneeds_id)
// )
// const buyneedsList: any = await useFetch('/api/buyNeeds')
// // const tmpBuyneedsList: any = ref(buyneedsData.value)
// // const buyneedsList: any = ref(tmpBuyneedsList.value.data)

/**
 * 買いニーズに紐づく買手企業から特定データを取得する
 * @param buyneeds
 * @param targetKey
 */
const getTargetBuyComapnyData = (buyneeds:any, targetKey:any): any => {
  // fix 元のコードのままだとmapが呼び出せなかったので修正
  console.log(buyneeds)
  const result: any = buyCompanyList.value.data.filter((buyCompany: any) => Object.keys(buyneeds.company)[0] === buyCompany.id)[0]
  if (result !== undefined) {
    return result[targetKey]
  }
  return ''
}

/**
 * 買手企業の業種表示用(複数処理が必要なためmethods化した)
 * @param buyneeds
 */
// fix getCompanyIndustryNameArrayは昔の名残のため削除した。null回避のためif文を追加。
const getCompanyIndutryNames = (buyneeds: any): string => {
  const industry: string = getTargetBuyComapnyData(buyneeds, 'industry')
  if (industry) {
    const industryNames: string = getValueObject(Object.values(industry))
    return industryNames
  }
  return ''
}

/**
 * 会社名押下時の処理
 * @param companyId
 */
const clickCompanyName = (companyId: number): void => {
  const url = config.public.jmssPortalBaseURL + '/company/' + companyId
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
  position: sticky;
  top: 0;
  z-index: 1;
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
