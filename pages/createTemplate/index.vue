<template>
  <v-app>
    <div id="app">
      <v-container class="pb-0">
        <!-- ヘッダ部分 ここから -->
        <v-row>
          <v-col cols="12" class="px-0 my-3 py-0" style="background-color: #81D4FA">
            <v-card-title class="headline font-weight-bold">
              雛形登録
            </v-card-title>
          </v-col>
        </v-row>
        <!-- ヘッダ部分 ここまで -->
        <!-- ファイルアップロード部分 ここから -->
        <v-row>
          <v-col cols="12">
            <text class="font-weight-bold">
              雛形ファイル
            </text>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-btn
              @dragover.prevent="isDragged = true"
              @dragleave.prevent="isDragged = false"
              @drop.prevent="onFileDropped"
              class="text-none upload_area_border h-screen w-100"
              :variant="!isDragged ? 'contained' : 'outlined'"
              depressed
              @click="openFileSelect"
            >
              <v-row v-if="!isSelecting" class="text-center" justify="center">
                <v-col cols="12">
                  <text id="displayText" class="display_text">{{ uploadAreaMsg }}</text>
                </v-col>
              </v-row>
            </v-btn>
            <v-file-input
              ref="uploader"
              class="d-none"
              type="file"
              accept=".docx"
              @change="onFileSelectChange"
            />
          </v-col>
        </v-row>
        <!-- ファイルアップロード部分 ここまで -->
        <!-- エラーメッセージ部分 ここから -->
        <v-row>
          <v-col>
            <text id="errMsg" class="font-weight-bold" style="visibility : hidden">
              <font color="red">ファイルの形式が正しくありません（アップロード可能なファイル形式は、docxのみです）</font>
            </text>
          </v-col>
        </v-row>
        <!-- エラーメッセージ部分 ここまで -->
        <!-- ボタン部分 ここから -->
        <v-row>
          <v-col col="10" />
          <v-col cols="1">
            <v-btn class="ui-btn bg-grey-lighten-2" width="100%" depressed @click="clickCreateBtn">
              登録
            </v-btn>
          </v-col>
          <v-col cols="1">
            <v-btn class="ui-btn bg-grey-lighten-2" width="100%" depressed @click="$router.back()">
              戻る
            </v-btn>
          </v-col>
        </v-row>
        <!-- ボタン部分 ここまで -->
      </v-container>
    </div>
  </v-app>
</template>

<script setup lang="ts">
const { $approach }: any = useNuxtApp()

interface Emits {
  (e: "update:File", value: File): void;
}
const emits = defineEmits<Emits>()

const isSelecting = ref<boolean>(false)
const isDragged = ref<boolean>(false)
const selectedFile = ref<File | null>(null)

const uploadAreaMsg = "ファイルをドラッグ&ドロップ\nor\nここをクリック"

const formData = new FormData()

// ボタンクリックでファイル選択を開く
const uploader = ref<HTMLInputElement>()
const openFileSelect= () => {
  isSelecting.value = true
  window.addEventListener('focus', () => {
    isSelecting.value = false
  }, { once: true })
  uploader.value?.click()
}

// ファイル選択確定時イベント
const onFileSelectChange = (e: Event) => {
    const target = e.target as HTMLInputElement
    const files = target.files
    const file = files![0]
    fileEmit(file)
}

// D&D時イベント
const onFileDropped = (e: DragEvent) => {
    isDragged.value = false
    if (!e) {
      return
    }

    if (!e.dataTransfer) {
      return
    }

    if (e.dataTransfer.files.length === 0) {
      return
    }
    const file = e.dataTransfer.files[0]
    fileEmit(file)
}

// ファイル拡張子を確認しdocxであればEmit、docx以外ならエラーメッセージ表示
function fileEmit(file: object){
  const fileName = file.name  //選択したファイル名取得
  const fileExtension = fileName.split(".").slice(-1)[0]  // ファイル名を.(ピリオド)で分割した配列を作成し、最後の要素を取得することで拡張子を取得

  const errMsg = document.getElementById("errMsg")  // エラーメッセージ表示コンポーネント取得
  const displayText = document.getElementById("displayText")  // ファイルアップロードエリアのテキスト表示コンポーネント取得

  if(fileExtension === "docx") {
    errMsg.style.visibility = 'hidden'
    displayText.textContent = fileName

    selectedFile.value = file
    emits("update:File", file)
  } else {
    errMsg.style.visibility = 'visible'
    displayText.textContent = uploadAreaMsg
  }
}

/**
 * 登録ボタン押下時の処理
 */
const clickCreateBtn = async (): Promise<void> => {
  formData.append('file', selectedFile.value, selectedFile.value.name);
  // 新規雛形情報登録処理APIの呼び出し
  await $approach.newTemplateInfoRegist(formData)
}

</script>

<style>

.upload_area_border {
  border: dashed 3px;
  color: #81D4FA;
}

.display_text {
  font-size: 24px;
  color: grey;
}

</style>
