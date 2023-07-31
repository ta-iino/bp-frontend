<template>
  <div>
    <v-container class="pb-0">
      <v-row>
        <v-col cols="12" class="px-0 my-3" style="background-color: darkgray;">
          <VCardTitle class="headline front-weight-bold">買いニーズマッチング結果</VCardTitle>
        </v-col>
      </v-row>
      <v-row>
        <h3>DM送付先企業</h3>
        <v-col>
          <span>企業名：</span>
          <NuxtLink to="">{{ sellCompanyData.Name }}</NuxtLink>
          <span>所在地：</span>
          <span>{{ sellCompanyData.Address }}</span>
          <span>代表者名：</span>
          <span>{{ sellCompanyData.RepresentativeName }}</span>
          <span>代表者年齢：</span>
          <span>{{ sellCompanyData.RepresentativeAge }}</span>
        </v-col>
        <v-col>
          <span>業種１：</span>
          <span> {{ sellCompanyData.IndustryOne }}</span>
          <span>業種２：</span>
          <span>{{ sellCompanyData.IndustryTwo }}</span>
          <span>業種３：</span>
          <span>{{ sellCompanyData.IndustryThree }}</span>
          <span>営業種目：</span>
          <span>{{ sellCompanyData.Items }}</span>
        </v-col>
        <v-col>
          <span>売上：</span>
          <span>{{ sellCompanyData.Sales }} 百万円</span>
          <span>営業利益：</span>
          <span>{{ sellCompanyData.Income }} 百万円</span>
          <span>従業員数：</span>
          <span>{{ sellCompanyData.Employees }} 名</span>
        </v-col>
      </v-row>
    </v-container>
    <v-container style="background-color: skyblue;">
      <h3>処理日時</h3>
      <span>{{ matchingResult?.created_at }}</span>
      <v-container style="background-color: lightslategray;">
        <v-col v-for="result in buyCompany" :key="result.id">
          <h3>買手第{{ result.companyNumber }}候補</h3>
          <v-row>
            <span>企業名：</span>
            <NuxtLink to="">{{ result.name }}</NuxtLink>
            <span>買収実績：</span>
            <span>{{ result.acquisitionsRecord }}</span>
          </v-row>
          <v-row>
            <span>都道府県：</span>
            <span>{{ result.address }}</span>
            <span>業種：</span>
            <span>{{ result.industry }}</span>
            <span>営業種目：</span>
            <span>{{ result.items }}</span>
          </v-row>
          <v-row>
            <span>売上高:</span>
              <span>{{ result.sales }} 百万円</span>
          </v-row>
        </v-col>
        <v-row v-for="needs in buyNeeds" :key="needs.id">
          <span>買収希望エリア：</span>
          <span>{{ needs.prefs }}</span>
          <span>買収希望業種：</span>
            <span>{{ needs.industries }}</span>
          <span>希望コメント：</span>
          <span>{{ needs.remarks }}</span>
        </v-row>
      </v-container>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { VDataTable } from 'vuetify/lib/labs/components.mjs';
import { ref } from 'vue';
import { NuxtLink } from '.nuxt/components';

interface MatchResult {
  id: number
  send_company_history_id: number
  buyneeds_id: number
  candidates_company_id: number
  created_at: string
}

interface BuyNeeds {
  id: number,
  industries: string,
  prefs: string,
  remarks: string,
}


inject: ['sellCompanyData', 'matchingHistoryId']

const { data: matchingResult, error: matchingResultError } = 
await useFetch<MatchResult>(`${process.env.API_URL}/matchingResult/${this.matchingHistoryId}`)
if (matchingResultError.value) {
  throw matchingResultError.value
}

const { data: buyCompany, error: getCompanyError } = 
await useFetch<any>(`${process.env.API_URL}/${matchingResult.candidates_company_id}`)
if (getCompanyError.value) {
  throw getCompanyError.value
}

const { data: buyNeeds, error: getBuyneedsError } = 
await useFetch<BuyNeeds>(`${process.env.API_URL}/${matchingResult.buyneeds_id}`)
if (getBuyneedsError.value) {
  throw getBuyneedsError.value
}







</script>