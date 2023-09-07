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
      // 401エラーの場合、HENNGEへアクセスする
      // backendのCustomAuthMiddleware以外でも401を返すようになったら修正する
      if (error.value.statusCode == 401 && baseURL === config.public.baseURL) {
        window.location.href = error.value.data
        return
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
