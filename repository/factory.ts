/**
 * 各APIのベースファクトリ(必要なものがあれば随時追加する。)
 */
class BaseApiFactory {
  async call (url: string, baseURL?: string, options?: any) {
    const config = useRuntimeConfig()
    const { data, error } = await useFetch(
      url, {
        baseURL: baseURL,
        method: options?.method,
        headers: options?.headers,
        body: options?.body,
        params: options?.params,
        credentials: options?.credentials
      }
    )
    // API通信時のエラーハンドリング
    if(error.value) {
      // 401の場合、HENNGEへアクセスする
      // backendのCustomAuthMiddleware以外でも401を返すようになったら修正する
      if (error.value.statusCode == 401 && baseURL === config.public.baseURL) {
        window.location.href = error.value.data
        return
      } else if(error.value.statusCode == 404 && error.value.data) {
        // undefinedでのエラーを避けるため先にdataの有無を確認しておく
        if(error.value.data.not_transition_error) {
          // 404且つエラー画面へ遷移しない場合
          return
        }
      } else {
        throw createError({
          statusCode: error.value.statusCode,
          statusMessage: error.value.statusMessage,
          fatal: true
        });
      }
    }
    return data
  }
}

export default BaseApiFactory
