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
              v-model="searchParams.dmListId"
              label="DMリスト"
              item-title="name"
              item-value="id"
              :items="pulldownDmList"
              clearable
            ></v-autocomplete>
          </v-col>
          <v-col cols="2" class="px-0 py-0">
            <v-autocomplete
              v-model="searchParams.consultantId"
              label="担当コンサルタント"
              item-title="name"
              item-value="id"
              :items="pulldownConsultant"
              clearable
            ></v-autocomplete>
          </v-col>
          <v-col cols="2" class="px-0 py-0">
            <v-autocomplete
              v-model="searchParams.templateId"
              label="雛形名"
              item-title="name"
              item-value="id"
              :items="pulldownTemplate"
              clearable
            />
          </v-col>
          <v-col cols="2" class="px-0 py-0">
            <v-select
              v-model="searchParams.letterStatusId"
              label="ステータス"
              item-title="name"
              item-value="id"
              :items="letterStatus"
              clearable
            />
          </v-col>
          <v-col cols="2" class="px-0 py-0">
            <v-autocomplete
              v-model="searchParams.createdBy"
              label="作成者"
              item-title="name"
              item-value="id"              
              :items="pulldownConsultant"
              clearable
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col col="11" />
          <v-col class="pt-2" cols="1">
            <v-btn class="ui-btn" depressed color="light-blue-darken-3" @click="searchButton()">
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
            :items="dmLetters"
            hide-default-footer
            class="elevation-1 ui-vdatatable"
            show-select
          >
            <template #[`item.createAt`]="{ item }">
              {{ formatDate(item.raw.createAt) }}
            </template>
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
import { ref } from 'vue';
import { VDataTable } from 'vuetify/lib/labs/components.mjs'
import '@mdi/font/css/materialdesignicons.css'
import camelcaseKeys from 'camelcase-keys'

const { $approach, $jmssPortal } = useNuxtApp()
const page: Ref<number> = ref(1) //現在のページ番号
const perPage: Ref<number> = ref(50) //1ページ当たりのアイテム数
const totalPage: Ref<number> = ref(0) //全体のページ数
watch(page ,() => {
  getDmLetter(searchParams)
})
const isPageLoading: Ref<boolean> = ref(false)
const searchParams: Ref<any> = ref(
  {
    dmListId: null,
    consultantId: null,
    templateId: null,
    letterStatusId: null,
    createdBy: null
  }
)

/**
 * 全てのユーザー、DMリストを取得
 */
const allUsers: any = await $jmssPortal.getUsersById(undefined, page.value, perPage.value)
const allDmLists: any = await $jmssPortal.getApproachLists(undefined, undefined, page.value, perPage.value)

/**
 * プルダウンリスト作成メソッド
 * @param array
 */
const createPulldown = (array: any): {id: number, name: string}[] => {
  const pulldownMap = array.map((value: any) => ({id: value.id, name: value.name}))
  return pulldownMap.filter((item, index, self) =>
    index === self.findIndex((t) => (
      t.name === item.name
    ))
  )
}

/**
 * 雛形ファイル取得メソッド
 * @returns 雛形ファイル一覧
 */
const getTemplate = async () => {
  const templatesResponce = await $approach.getTemplate()
  console.log(templatesResponce.value.templates)
  pulldownTemplate.value = templatesResponce.value.templates
}

// 各プルダウンを作成
const pulldownDmList: {id: number, name: string}[] = createPulldown(allDmLists.value.data);
const pulldownConsultant: {id: number, name: string}[] = createPulldown(allUsers.value);
const pulldownTemplate: Ref<any> = ref()
getTemplate()

const letterStatus = [
  { id: '1', name: 'レター登録済み' },
  { id: '2', name: 'レター作成中' },
  { id: '3', name: '完了' },
  { id: '4', name: 'レター作成失敗' }
]

const dmLetters: Ref<any> = ref()

/**
 * DMレター取得メソッド
 * @param searchParams?
 */
const getDmLetter = async (searchParams?: any): Promise<void> => {
  const dmLettersResponce = await $approach.getDmLetter(searchParams?.value)
  dmLetters.value = dmLettersResponce.value.dmLetters
}

// 初期表示用に呼び出し
getDmLetter()

// ヘッダ
const headers = ref(
  [
    { title: 'DMリスト', key: 'dmListName'　},
    { title: 'コンサルタント', key: 'consultantName'　},
    { title: '雛形', key: 'templateName'　},
    { title: 'レター作成者', key: 'createdBy'　},
    { title: 'ステータス', key: 'letterStatus'　},
    { title: '日付', key: 'createAt'　}
  ]
)

/**
 * 検索ボタン押下時処理
*/
const searchButton = (): void => {
  page.value = 1
  // 一覧に表示するアプローチリストのデータを取得する
  getDmLetter(searchParams)
}

</script>