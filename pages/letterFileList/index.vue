<template>
  <v-app>
    <div id="app">
      <v-container class="pb-0">
        <!-- ヘッダ部分 ここから -->
        <v-row>
          <v-col cols="12" class="px-0 my-3 py-0" style="background-color: #81D4FA">
            <v-card-title class="headline font-weight-bold">
              レターファイル一覧
            </v-card-title>
          </v-col>
        </v-row>
        <!-- ヘッダ部分 ここまで -->
        <!-- 一覧表示部分 ここから -->
      　<v-row>
          <v-data-table
            :headers="headers"
            hide-default-footer
            class="elevation-1 ui-vdatatable"
            show-select
          >
            <!-- ページネーション ここから -->
            <template #bottom>
              <div class="text-center pt-2">
                <v-pagination
                  v-model="page"
                  cols="12"
                  :length="totalPage"
                  :total-visible="15"
                ></v-pagination>
              </div>
            </template>
            <!-- ページネーション ここまで -->
          </v-data-table>
        </v-row>
        <!-- 一覧表示 ここまで -->
        <!-- 一覧表示部分 ここまで -->
        <!-- ボタンエリア ここから -->
        <v-row>
          <v-col cols="9" />
          <v-col cols="1">
            <v-btn class="ui-btn bg-grey-lighten-2" width="100%" @click="$router.back()">
              戻る
            </v-btn>
          </v-col>
          <v-col cols="2">
            <v-btn class="ui-btn bg-grey-lighten-2" width="100%">
              ダウンロード
            </v-btn>
          </v-col>
        </v-row>
        <!-- ボタンエリア ここまで -->
      </v-container>
    </div>
  </v-app>
</template>

<script setup lang="ts">
import { VDataTable } from 'vuetify/lib/labs/components.mjs'

// ヘッダ
const headers = ref(
  [
    { title: 'タイトル', key: 'title'　},
    { title: 'DMリスト', key: 'dmList'　},
    { title: 'レター作成日時', key: 'datetime'　},
    { title: '依頼者', key: 'requester'　},
    { title: 'ステータス', key: 'status'　}
  ]
)

</script>