<template>
  <v-app>
    <div id="app">
      <v-container class="pb-0">
        <!-- ヘッダ部分 ここから -->
        <v-row>
          <v-col cols="12" class="px-0 my-3 py-0" style="background-color: #81D4FA">
            <v-card-title class="headline font-weight-bold">
              レター作成
            </v-card-title>
          </v-col>
        </v-row>
        <v-row>
          <v-col v-for="(item) in items" :key="item.title" cols="4" class="d-flex px-0 py-0 bordered-column">
            <v-col cols="4" class="px-0 py-1 bg-blue-grey-lighten-4 d-flex align-center justify-center font-weight-bold">
              {{ item.title }}
            </v-col>
            <v-col cols="8" class="px-0 py-1 pl-2">
              {{ item.value }}
            </v-col>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="3">
            <v-autocomplete
              label="雛形"
              clearable
               v-model="selectedTemplates"
               :items="templates"
            ></v-autocomplete>
          </v-col>
          <v-col cols="1" class="d-flex align-center justify-center">
            <div class="pr-3">
              <v-btn
                class="v-btn"
                depressed
                color="light-blue-darken-4"
              >
                DL
              </v-btn>
            </div>
          </v-col>
          <v-col cols="1" class="d-flex align-center justify-center">
            <div class="pr-3">
              <v-btn
                class="v-btn"
                depressed
                color="light-blue-darken-4"
                @click="nextBtnClickEvent"
              >
                次へ
              </v-btn>
            </div>
          </v-col>
          <v-col cols="5"></v-col>
          <v-col cols="2" class="d-flex align-center justify-center">
            <div class="pr-3">
              <v-btn class="v-btn bg-grey-lighten-2" depressed @click="navigateTo('/')">
                DMリスト一覧へ
              </v-btn>
            </div>
          </v-col>
        </v-row>
        <!-- ヘッダ部分 ここまで -->
        <!-- 編集エリア ここから -->
        <v-row>
          <!-- 編集エリア ここから -->
          <v-container v-if="editAreaVisible">
            <v-row>
              <v-card class="w-100">
                <v-card-text>
                  <v-row>
                    <v-col cols="12" class="px-0 my-3 py-0" style="background-color: #81D4FA">
                      <v-card-title class="headline font-weight-bold">
                        差込み文章編集
                      </v-card-title>
                    </v-col>
                  </v-row>
                  <v-row v-if="confirmMsgVisible">
                    <v-text>
                      以下差込み文章でレターを作成します。
                    </v-text>
                  </v-row>
                  <v-row justify="start">
                    <v-col cols="12" class="font-weight-bold">
                        <v-text>差込み文章①</v-text>
                    </v-col>
                  </v-row>
                  <v-row justify="start">
                    <v-col cols="3">
                      <v-row>
                        <v-text-field v-model="mergeField_1" :disabled="isMergeFieldDisabled"></v-text-field>
                      </v-row>
                    </v-col>
                    <v-col cols="3">
                      <v-row>
                        <v-col>
                          <v-text class="text-center" :style="{ fontSize: '20px' }">設立年月</v-text>
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col cols="4">
                      <v-row>
                        <v-text-field v-model="mergeField_2" :disabled="isMergeFieldDisabled"></v-text-field>
                      </v-row>
                      <v-row>
                        <v-text-field v-model="mergeField_3" :disabled="isMergeFieldDisabled"></v-text-field>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-row>
            <v-row>
              <v-col cols="11"></v-col>
              <v-col cols="1">
                <v-btn class="v-btn bg-grey-lighten-2" depressed @click="clickCreateBtn">
                  作成
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
          <!-- 編集エリア ここまで -->
          <!-- エラー表示 ここから -->
          <v-container v-if="dataCheckErrorVisible">
            <v-row>
              <v-card class="w-100">
                <v-card-text>
                  <v-row>
                    <v-col cols="12" class="px-0 my-3 py-0 bg-grey-lighten-2">
                      <v-card-title class="headline font-weight-bold">
                        以下項目の情報が不足しています。必須項目の情報を入力してください。
                      </v-card-title>
                    </v-col>
                  </v-row>
                  <v-row justify="center">
                    <v-col cols="2"><v-text class="font-weight-bold">企業</v-text></v-col>
                    <v-col cols="2"><v-text class="font-weight-bold">不足項目</v-text></v-col>
                    <v-col cols="1"></v-col>
                  </v-row>
                  <div v-for="(rowComponent, index) in missingItemComponents" :key="index">
                    <component :is="rowComponent"></component><!-- 不足項目コンポーネントを描画 -->
                  </div>
                </v-card-text>
              </v-card>
            </v-row>
            <v-row>
              <v-col cols="10"></v-col>
              <v-col cols="2">
                <v-btn class="v-btn bg-grey-lighten-2" depressed @click="toDmDestinationCompanyClickEvent">
                  DM発送先企業一覧へ
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
          <!-- エラー表示 ここまで -->
        </v-row>
      </v-container>
    </div>
  </v-app>
</template>

<script setup lang="ts">
import { ref, defineComponent, h } from 'vue';
import { useRoute, useRouter } from 'vue-router'
import camelcaseKeys from 'camelcase-keys'

import { get_header_items } from './Scripts'

const route = useRoute()
const router = useRouter()
const { $approach, $jmssPortal } = useNuxtApp()
const approachListId: string = String(route.params.id)

/**
 * マッチング処理日時リスト作成
 */
const matchingHistories: any = await $approach.getBuyneedsMatchingHistory(Number(approachListId))

/**
 * ヘッダ部(アプローチ情報)
 */
const approachListData: any = await $jmssPortal.getApproachLists(approachListId)
// 取得したデータのキーをキャメルケースに変換する
const approachListCamelData = camelcaseKeys(approachListData.value.data[0], { deep: true })
const items = get_header_items(approachListCamelData, matchingHistories)

/**
 * 「DM発送先企業一覧へ」ボタンのクリックイベント
 * @param approachListId
 */
const toDmDestinationCompanyClickEvent = () => {
  router.push(`/dmDestinationCompany/${approachListId}`);
}

/**
 * 雛形リスト取得処理
 */
const templatesResponse: any = await $approach.getTemplateList()
const templates: any = ref(
  // 雛形情報から雛形名を取得する
  templatesResponse.value.template_lists.map((template: any) => template.templateName)
)

// 選択された雛形を保持するための変数
const selectedTemplates = ref<string | null>(null);

// コンテナの表示状態を管理するリアクティブ変数
const editAreaVisible = ref(false);
const dataCheckErrorVisible = ref(false);

/**
 * 「次へ」ボタンのクリックイベント
 */
const nextBtnClickEvent = () => {
  // 仮の分岐処理を実装
  switch (selectedTemplates.value) {
    case 'テスト雛形_1.docx':
    case 'テスト雛形_3.docx':
    case 'テスト雛形_5.docx':
      editAreaVisible.value = true;
      dataCheckErrorVisible.value = false;
      break
    case 'テスト雛形_2.docx':
    case 'テスト雛形_4.docx':
    default:
      editAreaVisible.value = false;
      dataCheckErrorVisible.value = true;
      addMissingItemComponent();
      break
  }
}

const isMergeFieldDisabled = ref(false);
const confirmMsgVisible = ref(false);


/**
 * 作成ボタン押下時の処理
 */
const clickCreateBtn = async () => {
  if (!isMergeFieldDisabled.value) {
    isMergeFieldDisabled.value = true;
    confirmMsgVisible.value = true;
  } else {
    const formData = new FormData()
    formData.append('approachLIstId', approachListId);
    formData.append('templateName', selectedTemplates.value);
    formData.append('dmListName', approachListCamelData.name);
    formData.append('cousultantName', confirmationData(approachListCamelData.requestUsers));
    formData.append('teamName', confirmationData(approachListCamelData.requestTeam));
    await $approach.dmLetterRegist(formData)
  }
};

// 不足項目コンポーネントを管理するリスト
const missingItemComponents = ref([]);

// 不足項目コンポーネントを配置するメソッド
const addMissingItemComponent = () => {
  missingItemComponents.length = 0  // 不足項目コンポーネント管理リストをclear
  missingItemComponents.value.push(getComponents());
};
</script>

<script lang="ts">

export default {
  data() {
    return {
      mergeField_1: '貴社におかれましては',
      mergeField_2: 'ますますご清栄のこととお慶び申し上げます。',
      mergeField_3: 'ますますご清栄のこととお慶び申し上げます。',
    };
  }
};

</script>

<style>
.bordered-column {
  border: 1px solid #ECEFF1;
}

.text-center {
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>