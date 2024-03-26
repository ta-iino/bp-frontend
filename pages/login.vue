<template>
    <div class="pt-12">
      <v-card
        class="mx-auto pa-12 pb-8"
        elevation="8"
        max-width="448"
        rounded="lg"
      >
        <v-text-field
            v-model="email"
            density="compact"
            placeholder="メールアドレス"
            prepend-inner-icon="mdi-email-outline"
            variant="outlined"
        ></v-text-field>  
        <v-text-field
            v-model="password"
            density="compact"
            placeholder="パスワード"
            prepend-inner-icon="mdi-lock-outline"
            variant="outlined"
        ></v-text-field>
  
        <v-btn
          class="mb-8"
          color="blue"
          size="large"
          variant="tonal"
          block
          @click="onClickSignin"
        >
          ログイン
        </v-btn>
        <p class="text-center text-red" v-if="message"> {{ message }}</p>
      </v-card>
    </div>
</template>
<script setup lang="ts">
import { ref  } from 'vue'
import '@vuepic/vue-datepicker/dist/main.css'
import '@mdi/font/css/materialdesignicons.css'
import { useCookies } from 'vue3-cookies'
const router = useRouter()
const { $approach } = useNuxtApp()
const email: Ref<string> = ref('')
const password: Ref<string> = ref('')
const message: Ref<string> = ref('')
/**
 * ログインボタン押下時の処理
 */
const onClickSignin = async (): Promise<void> => {
// マッチング処理開始APIの呼び出し
const data:any = await $approach.login(email.value, password.value);
    if(data.message) {
        message.value = data.message
        return
    }
    await $approach.getJmssPortalAccessToken();
    router.push('/');
}
</script>
<style lang="scss" scoped>
.sample-input {
border: 2px solid #ddd;
}
</style>