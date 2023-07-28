<template>
  <div id="app">
    <div class="ma-3" style="background-color: #d3d3d3">
      <v-card-title class="headline font-weight-bold">DMリスト一覧</v-card-title>
    </div>
    <!-- 検索フォーム ここから -->
    <v-container>
      <v-row>
        <v-col cols="2" class="px-0">
          <v-select
            v-model="searchParams.team"
            clearable
            label="チーム"
            filled
          ></v-select>
        </v-col>
        <v-col cols="2" class="px-0">
          <v-select
            v-model="searchParams.consultant"
            clearable
            label="担当コンサルタント"
            filled
          ></v-select>
        </v-col>
        <v-col cols="2" class="px-0">
          <v-text-field v-model="searchParams.listName" clearable label="リスト名" filled></v-text-field>
        </v-col>
        <v-col cols="2" class="px-0">
          <v-select
            v-model="searchParams.approachDivision"
            clearable
            label="アプローチ区分"
            filled
          ></v-select>
        </v-col>
        <v-col cols="2" class="px-0">
          <v-text-field v-model="searchParams.createdAtFrom" clearable label="登録日(from)" filled></v-text-field>
        </v-col>
        <v-col cols="2" class="px-0">
          <v-text-field v-model="searchParams.createdAtTo" clearable label="登録日(to)" filled></v-text-field>
        </v-col>
      </v-row>
      <v-row justify="center">
        <!--確認用 後で消す-->
        <p>{{ sample }}</p>
        <v-btn depressed color="primary" @click="serchButton">検索</v-btn>
      </v-row>
    </v-container>
    <!-- 検索フォーム ここまで -->
    <!-- 一覧表示 ここから -->
    <v-data-table
        :headers="headers"
        :items="dmListData"
        hide-default-footer
        disable-pagination
    >
    <template v-slot:item.listName="{ item }">
      <nuxt-link :to="`/dmList/${item.dmListId}`">{{ item.listName }}</nuxt-link>
    </template>
    </v-data-table>
    <!-- ページネーション -->
    <div class="text-center pt-2">
      <v-pagination v-model="searchParams.page" :length="totalPageNum" ></v-pagination>
    </div>
    <!-- 一覧表示 ここまで -->
      <v-row>
        {{ dmListData }}
      </v-row>
  </div>
</template>

<script setup lang="ts">
import { VDataTable } from 'vuetify/lib/labs/components.mjs';
import { ref } from 'vue'

const totalPageNum = ref(1)
const perpage = ref(30)
const sample = ref("click")
const searchParams = ref(
  {
      team : null,
      consultant : null,
      listName : "",
      approachDivision : null,
      createdAtFrom : null,
      createdAtTo : null,
      page: 1
  }
)
const { data }  = await useAsyncData(
  'dmList',
  () => $fetch('api/dmList')
)
const dmListData: any = ref(data.value)
const headers = ref(
    [
      // title,key出ないとヘッダーが消える
      { title: 'ID', key: 'dmListId', sortable: false, width: 30 },
      { title: '登録日', key: 'createdAt', sortable: false, width: 100 },
      { title: '送付日', key: 'sendDate', sortable: false, width: 100 },
      { title: '送付社数', key: 'sendCompanyNum', sortable: false, width: 100 },
      { title: 'リスト名', key: 'listName', sortable: false, width: 100 },
      { title: 'アプローチ区分', key: 'approachCategory', sortable: false, width: 100},
      { title: '担当チーム', key: 'team', sortable: false, width: 100},
      { title: '担当コンサルタント', key: 'Consultant', sortable: false, width: 100},
      { title: '業種', key: 'Industry', sortable: false, width: 100},
      { title: '地域', key: 'region', sortable: false, width: 100},
      { title: '売上', key: 'sales', sortable: false, width: 100},
      { title: '状況', key: 'matchingStatus', sortable: false, width: 100},
    ]
  )
</script>