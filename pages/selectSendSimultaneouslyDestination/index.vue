<template>
  <v-app>
    <div id="app">
      <v-container class="pb-0">
        <!-- ヘッダ部分 ここから -->
        <v-row>
          <v-col cols="12" class="px-0 my-3 py-0" style="background-color: #81D4FA">
            <v-card-title class="headline font-weight-bold">
              DM同時発送先選択
            </v-card-title>
          </v-col>
        </v-row>
        <!-- ヘッダ部分 ここまで -->
        <!-- 検索フォーム ここから -->
        <v-row>
          <v-col cols="2" class="px-0 py-0">
            <v-autocomplete
              label="DMリスト"
              clearable
            ></v-autocomplete>
          </v-col>
          <v-col cols="2" class="px-0 py-0">
            <v-autocomplete
              label="担当コンサルタント"
              item-title="consultantName"
              clearable
            ></v-autocomplete>
          </v-col>
          <v-col cols="2" class="px-0 py-0">
            <v-autocomplete
              label="雛形名"
              item-title="templateName"
              clearable
            />
          </v-col>
          <v-col cols="2" class="px-0 py-0">
            <v-select
              label="ステータス"
              item-title="status"
              clearable
            />
          </v-col>
          <v-col cols="2" class="px-0 py-0">
            <v-select
              label="作成者"
              item-title="creatorName"
              clearable
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col col="11" />
          <v-col class="pt-2" cols="1">
            <v-btn class="ui-btn" depressed color="light-blue-darken-3">
              <v-icon dark size="large">
                mdi-magnify
              </v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <!-- 検索フォーム ここまで -->
      </v-container>
      <!-- 一覧表示 ここから -->
      <v-container class="ui-vcontaoner">
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
      </v-container>
      <!-- 一覧表示 ここまで -->
      <!-- ボタンエリア ここから -->
      <v-container>
        <v-row>
          <v-col cols="8" />
          <v-col cols="2">
            <v-btn class="ui-btn bg-grey-lighten-2" width="100%" @click="navigateTo('/letterFileList')">
              レターファイル一覧
            </v-btn>
          </v-col>
          <v-col cols="1">
            <v-btn class="ui-btn bg-grey-lighten-2" width="100%" @click="$router.back()">
              戻る
            </v-btn>
          </v-col>
          <v-col cols="1">
            <v-dialog max-width="500">
              <template v-slot:activator="{ props: activatorProps }">
                <v-btn class="ui-btn bg-grey-lighten-2" width="100%" v-bind="activatorProps">
                  作成
                </v-btn>
              </template>
              <!-- タイトル入力ダイアログ ここから -->
              <template v-slot:default="{ isActive }">
                <v-card>
                  <v-card-title class="headline font-weight-bold" style="background-color: #81D4FA">
                    タイトル入力
                  </v-card-title>
                  <v-card-text>
                    <v-text-field label="タイトル">
                    </v-text-field>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn class="ui-btn bg-grey-lighten-2" @click="isActive.value = false">
                      戻る
                    </v-btn>
                    <v-btn class="ui-btn bg-grey-lighten-2">
                      作成
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </template>
              <!-- タイトル入力ダイアログ ここまで -->
            </v-dialog>
          </v-col>
        </v-row>
      </v-container>
      <!-- ボタンエリア ここまで -->
    </div>
  </v-app>
</template>

<script setup lang="ts">
import { VDataTable } from 'vuetify/lib/labs/components.mjs'
import '@mdi/font/css/materialdesignicons.css'

// ヘッダ
const headers = ref(
  [
    { title: 'DMリスト', key: 'dmList'　},
    { title: 'コンサルタント', key: 'consultantName'　},
    { title: '雛形', key: 'template'　},
    { title: 'レター作成者', key: 'letterCreator'　},
    { title: 'ステータス', key: 'status'　},
    { title: '日付', key: 'datetime'　}
  ]
)

</script>