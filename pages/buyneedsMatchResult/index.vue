<template>
  <VApp>
    <v-container>
      <v-row id="sticky" style="box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);">
        <v-row class="px-6">
          <v-col cols="12" class="my-3">
            <VCardTitle style="background-color: #81d4fa;">
              <h4 class="mt-n1 ml-n2">
              買いニーズマッチング結果
              </h4>
            </VCardTitle>
          </v-col>
        </v-row>
        <v-sheet color="white" class="px-6" width="100%">
          <v-card-title style="background-color: #b3e5fc;" class="header-back">
            <h4 class="mt-n2 ml-n2">
              DM発送先企業
            </h4>
          </v-card-title>
          <v-row class="px-3 mb-6 mt-auto">
            <v-col v-for="(item) in items" :key="item.title" cols="4" class="bordered-column d-flex">
              <v-row v-if="item.title === '企業名'">
                <v-col cols="3" class="px-0 py-1 bg-blue-grey-lighten-4 d-flex align-center justify-center font-weight-bold">
                  {{ item.title }}
                </v-col>
                <v-col cols="9" class="px-0 py-1 pl-2 link" @click="clickCompany(sellCompanyId)">
                  {{ item.value }}
                </v-col>
              </v-row>
              <v-row v-else>
                <v-col cols="3" class="px-0 py-1 bg-blue-grey-lighten-4 d-flex align-center justify-center font-weight-bold">
                  {{ item.title }}
                </v-col>
                <v-col cols="9" class="px-0 py-1 pl-2">
                  {{ item.value }} {{ item.bottom }}
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-row justify="center" class="mt-n6">
            <!-- DM送付先画面で別タブで開かれたら閉じれるはず -->
            <v-btn color="light-blue-darken-4" class="mb-4 my-10 bg-grey-lighten-2" border="0" @click="clickCloseButton()">
              ページを閉じる
            </v-btn>
          </v-row>
        </v-sheet>
      </v-row>

      <v-container v-if="buyneedsMatchingResults" class="ui-vcontaoner pt-0 mb-4">
        <v-row>
          <v-row class="pt-10" justify="end">
            <h3>処理日時</h3>
            <span class="mx-10">{{ processDate }}</span>
          </v-row>
          <v-sheet
            v-for="(matchingResult, i) in buyneedsMatchingResults"
            :key="i"
            cols="16"
            class="mx-6 my-2"
            elevation="1"
            height="auto"
            width="100%"
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
                    <span class="link" @click="clickCompany(getTargetBuyComapnyData(matchingResult, 'id'))">
                      {{ getTargetBuyComapnyData(matchingResult, "name") }}
                    </span>
                  </v-col>
                  <v-col cols="2">
                    都道府県:
                  </v-col>
                  <v-col cols="3">
                    {{ getTargetBuyComapnyData(matchingResult, 'pref') }}
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
                    {{ getTargetBuyneedsData(matchingResult, 'accuracy') }}
                  </v-col>
                  <v-col cols="2">
                    業種:
                  </v-col>
                  <v-col cols="3">
                    {{ getIndutryNames(getTargetBuyComapnyData(matchingResult, 'industries')) }}
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
                    {{ getTargetBuyComapnyData(matchingResult, 'sales') }} 百万円
                  </v-col>
                  <v-col cols="2">
                    営業種目:
                  </v-col>
                  <v-col cols="3">
                    {{ getTsrData(getTargetBuyComapnyData(matchingResult, "tsr"), '営業種目') }}
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
                    {{ confirmationData(getTargetBuyneedsData(matchingResult, 'prefs')) }}
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
                    {{ getIndutryNames(getTargetBuyneedsData(matchingResult, 'industries')) }}
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
                    <span id="comment">{{ getTargetBuyneedsData(matchingResult, 'remarks') }}</span>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-sheet>
        </v-row>
      </v-container>
      <v-container v-else>
        <v-row >
          <v-col cols="12" class="pt-10 pl-10 text-center">
            マッチング結果はありません
          </v-col>
        </v-row>
      </v-container>
    </v-container>

  </VApp>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

/**
 * 初期値設定
 */
const route = useRoute()
const { $approach, $jmssPortal }: any = useNuxtApp()
const sendCompanyHistoryId: number = Number(route.params.id)
const buyCompanyListData: Ref<any> = ref()
const buyneedsListData: Ref<any> = ref()

// TODO 全てをawaitするとパフォーマンスが悪いらしい。
// 以下などを参考に先にリクエストだけ送っておくようにしたい
// https://qiita.com/im36-123/items/c0678a46ee0f8e44e150 https://makky12.hatenablog.com/entry/2020/01/11/175931

/**
 * ヘッダ部のデータ作成
 */
const sellCompanyHistory: any = await $approach.getSendCompanyHistory(undefined, sendCompanyHistoryId)
const sellCompanyId: number = sellCompanyHistory.value.sendCompanyHistories[0].companyId
const sellCompany: any = await $jmssPortal.getCompanies(String(sellCompanyId))
// 表示タイトルとバリューの作成
const items: any = [
  { title: '企業名', value: sellCompany.value.data[0].name},
  { title: '業種１', value: getIndutryNames(sellCompany.value.data[0].industries, 0) },
  { title: '売上', value: sellCompany.value.data[0].sales, bottom: '百万円' },
  { title: '所在地', value: sellCompany.value.data[0].address },
  { title: '業種２', value: getIndutryNames(sellCompany.value.data[0].industries, 1) },
  { title: '営業利益', value: sellCompany.value.data[0].profit, bottom: '百万円' },
  { title: '代表者名', value: sellCompany.value.data[0].representative_name },
  { title: '業種３', value: getIndutryNames(sellCompany.value.data[0].industries, 2) },
  { title: '従業員数', value: sellCompany.value.data[0].employees, bottom: '名' },
  { title: '代表者年齢', value: getCeoAge(getTsrData(sellCompany.value.data[0].tsr,'生年月日')) },
  { title: '営業種目', value: getTsrData(sellCompany.value.data[0].tsr,'営業種目') }
]
// 処理日時の取得
const buyneedsMatchingHistories: any = await $approach.getBuyneedsMatchingHistory(undefined, sellCompanyHistory.value.buyneedsMatchingHistoryId)
const processDate: string = buyneedsMatchingHistories.value.buyneedsMatchingHistories[0].processedDatetime

// /**
//  * ボディ部のデータ作成.
//  */
// マッチング結果取得APIの呼び出し
const buyneedsMatchingResults: any = await $approach.getBuyneedsMatchingResult(sendCompanyHistoryId)

// マッチング結果が存在する場合のみ取得処理を行う
if(buyneedsMatchingResults) {
    // 買い手企業情報取得APIの呼び出し
  const buyCompanyIds: number[] = buyneedsMatchingResults.value.map((item: { candidateCompanyId: number; }) => item.candidateCompanyId)
  const buyCompanyList: any = await $jmssPortal.getCompanies(buyCompanyIds.join())
  buyCompanyListData.value = buyCompanyList.value.data

  // 買いニーズ情報取得APIの呼び出し
  const buyneedsIds: number[] = buyneedsMatchingResults.value.map((item: { buyneedsId: number; }) => item.buyneedsId)
  const buyneedsList: any = await $jmssPortal.getBuyneeds(buyneedsIds.join())
  buyneedsListData.value = buyneedsList.value.data
}

/**
 * 買手企業の情報を取得する
 * @param matchingResult
 * @param targetKey
 */
const getTargetBuyComapnyData = (matchingResult:any, targetKey:any): any => {
  const result: any = buyCompanyListData.value.filter((buyCompany: any) => matchingResult.candidateCompanyId === buyCompany.id)[0]
  if (result || result !== undefined) {
    return result[targetKey]
  }
  return ''
}

/**
 * 買いニーズの情報を取得する
 * @param matchingResult
 * @param targetKey
 */
 const getTargetBuyneedsData = (matchingResult:any, targetKey:any): any => {
  const result: any = buyneedsListData.value.filter((buyneeds: any) => matchingResult.buyneedsId === buyneeds.id)[0]
  if (result || result !== undefined) {
    return result[targetKey]
  }
  return ''
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

.bordered-column {
  border: 1px solid #ECEFF1;
}
</style>
