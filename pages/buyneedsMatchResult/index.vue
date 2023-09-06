<template>
  <VApp>
    <v-container>
      <!-- 現状だと上半分くらい固定されてしまって若干見づらいので何とかしたい -->
      <v-row id="sticky" class="my-n6">
        <v-row>
          <v-col cols="16" class="px-0 my-3">
            <VCardTitle class="ml-3 mr-9" style="background-color: #81d4fa;">
              買いニーズマッチング結果
            </VCardTitle>
          </v-col>
        </v-row>
        <v-sheet color="white" elevation="1" height="172" class="mr-6">
          <v-card-title style="background-color: #b3e5fc;" class="header-back">
            <h4 class="mt-n2 ml-n2">
              DM発送先企業
            </h4>
          </v-card-title>
          <v-row class="px-16 mb-6 mt-2">
            <v-col v-for="(item) in items" :key="item.title" cols="4">
              <v-row v-if="item.title === '企業名:'">
                <v-col class="px-10 py-0">
                  {{ item.title }}
                </v-col>
                <v-col class="pl-4 py-0 link" @click="clickCompanyName()">
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
          <v-row justify="center" class="mt-n6">
            <!-- DM送付先画面で別タブで開かれたら閉じれるはず -->
            <v-btn color="light-blue-darken-4" class="mb-4" border="0" @click="clickCloseButton()">
              閉じる
            </v-btn>
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
                  <span class="link" @click="clickCompanyName(getTargetBuyComapnyData(buyneeds, 'id'))">
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
                  {{ confirmationData(buyneeds.industries) }}
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
const sendCompanyHistoryId: string = String(route.params.id)
const processDate: string = String(route.query)

/**
 * ヘッダ部のデータ作成
 */
const sellCompanyHistory: any = await $approach.getSendCompanyHistory(undefined, sendCompanyHistoryId)
const sellCompanyId: number = sellCompanyHistory.value.sendCompanyHistories[0].companyId
// 売手企業情報取得APIの呼び出し
const sellCompany: any = await $jmssPortal.getCompanies(String(sellCompanyId))
// 表示タイトルとバリューの作成
const items: any = [
  { title: '企業名:', value: sellCompany.value.data[0].name},
  // { title: '業種１:', value: confirmationData(sellCompany.value.data[0].industries) },
  { title: '売上:', value: sellCompany.value.data[0].sales, bottom: '百万円' },
  { title: '所在地:', value: sellCompany.value.data[0].address },
  // { title: '業種２:', value: confirmationData(sellCompany.value.data[0].industries) },
  { title: '営業利益:', value: sellCompany.value.data[0].profit, bottom: '百万円' },
  { title: '代表者名:', value: sellCompany.value.data[0].representative_name },
  // { title: '業種３:', value: confirmationData(sellCompany.value.data[0].industries) },
  { title: '従業員数:', value: sellCompany.value.data[0].employees, bottom: '名' },
  { title: '代表者年齢:', value: getCeoAge(sellCompany.value.data[0].tsr['生年月日']) },
  { title: '営業種目:', value: sellCompany.value.data[0].tsr['営業種目'] }
]

// /**
//  * ボディ部のデータ作成.
//  */
// マッチング結果取得APIの呼び出し
const buyneedsMatchingResult: any = await $approach.getBuyneedsMatchingResult(sendCompanyHistoryId)

// // 買い手企業情報取得APIの呼び出し
const buyCompanyIds: number[] = buyneedsMatchingResult.value.buyneedsMatchingResults.map((item: { candidateCompanyId: number; }) => item.candidateCompanyId)
const buyCompanyList: any = await $jmssPortal.getCompanies(buyCompanyIds.join())

// // 買いニーズ情報取得APIの呼び出し
const buyneedsIds: number[] = buyneedsMatchingResult.value.buyneedsMatchingResults.map((item: { buyneedsId: number; }) => item.buyneedsId)
const buyneedsList: any = await $jmssPortal.getBuyneeds(buyneedsIds.join())

/**
 * 買いニーズに紐づく買手企業から特定データを取得する
 * @param buyneeds
 * @param targetKey
 */
const getTargetBuyComapnyData = (buyneeds:any, targetKey:any): any => {
  const result: any = buyCompanyList.value.data.filter((buyCompany: any) => Object.keys(buyneeds.company)[0] === String(buyCompany.id))[0]
  if (result || result !== undefined) {
    return result[targetKey]
  }
  return ''
}

/**
 * 買手企業の業種表示用(複数処理が必要なためmethods化した)
 * @param buyneeds
 */
const getCompanyIndutryNames = (buyneeds: any): string => {
  const industry: string = getTargetBuyComapnyData(buyneeds, 'industry')
  const industryNames: string = confirmationData(industry)
  return industryNames
}
/**
 *  tsr内のvalueを取得する処理
 * @param id: 一覧表示データのマスタID
 * @param targetKey: ターゲットとなるtsr情報のキー値
 */
 const getTsrData = (id: any, targetKey: any) => {
  // 一覧表示用のデータからidをキーにtsr情報を取得して、targetKeyを添え字にしたvalueを取得する
  const result = (destinationCompanies.value).filter((destinationCompanyData: any) => id === destinationCompanyData.id)[0]
  if (result && result.tsr) {
    return result.tsr[targetKey]
  }
  return ''
}
/**
 * 会社名押下時の処理
 * @param companyId 引数に値が渡されなければ売手企業IDを渡す
 */
const clickCompanyName = (companyId: number=sellCompanyId): void => {
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
  position: fixed;
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
