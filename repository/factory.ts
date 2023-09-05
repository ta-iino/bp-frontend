/**
 * 各APIのベースファクトリ(必要なものがあれば随時追加する。)
 */
class BaseApiFactory {
  async call (url: string, baseURL: string, options?: any) {
    console.log(url)
    console.log(baseURL)
    const { data, error } = await useFetch(
      url, {
        baseURL: baseURL,
        method: options.method,
        headers: options.headers,
        body: options.body,
        params: options.params
      }
    )
    // API通信時のエラーハンドリング
    if(error.value) {
      throw createError({
        statusCode: error.value.statusCode,
        statusMessage: error.value.statusMessage,
      });
    }
    return data
  }
}

export default BaseApiFactory
