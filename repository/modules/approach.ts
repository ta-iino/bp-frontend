// エンドポイントが増えてきたら分割する
import BaseApiFactory from '../factory'
import { useCookies } from 'vue3-cookies'

export class ApproachModule extends BaseApiFactory {
  private urls: any = {
    getDmList: '/approach/api/get_dm_list/',
    getSendCompanyHistory: '/approach/api/send_company_history/',
    getBuyneedsMatchingHistory: '/approach/api/buyneeds_matching_history/',
    getBuyneedsMatchingResultCsv: '/approach/api/buyneeds_matching_result_csv/',
    getBuyneedsMatchingResult: '/approach/api/buyneeds_matching_result/',
    startBuyneedsMatching: '/approach/api//buyneeds_matching_start/',
    getJmssPortalAccessToken: '/approach/api/create_jmss_portal_access_token',
  }

  private baseURL
  private options: any = {}
  constructor (baseURL: string) {
    super()
    this.baseURL = baseURL
  }

  /**
   * DMリスト取得API
   * @param approachListIds
   * @param searchCondition
   * @returns DMリストのリスト
   */
  async getDmList (approachListIds?: number[], searchCondition?: any) {
    this.options.params = {
      approach_list_ids: approachListIds,
      search_condition: searchCondition
    }
    return this.call(this.urls.getDmList, this.baseURL, this.options)
  }

  /**
   * 発送企業履歴取得API
   * @param buyneedsMatchingHistoryId
   * @returns 発送企業履歴リスト
   */
  async getSendCompanyHistory (buyneedsMatchingHistoryId: Number) {
    // パスパラメータで飛ばしてもよさそう。
    this.options.params = {
      buyneeds_matching_history_id: buyneedsMatchingHistoryId
    }
    return this.call(
      this.urls.getSendCompanyHistory,
      this.baseURL,
      this.options
    )
  }

  /**
   * 買いニーズマッチング履歴取得API
   * @param approachListId
   * @returns 買いニーズマッチング履歴リスト
   */
  async getBuyneedsMatchingHistory (approachListId: Number) {
    this.options.params = {
      approach_list_id: approachListId
    }
    return this.call(
      this.urls.getBuyneedsMatchingHistory,
      this.baseURL,
      this.options
    )
  }

  /**
   * 買いニーズマッチング結果CSV取得API
   * @param buyneedsMatchingHistoryId
   * @returns 買いニーズマッチング結果CSVファイル
   */
  async getBuyneedsMatchingResultCsv (buyneedsMatchingHistoryId: Number) {
    this.options.params = {
      buyneeds_matching_history_id: buyneedsMatchingHistoryId
    }
    return this.call(
      this.urls.getBuyneedsMatchingResultCsv,
      this.baseURL,
      this.options
    )
  }

  /**
   * 買いニーズマッチング結果取得API
   * @param sendCompanyHistoryId
   * @returns 買いニーズマッチング結果JSON形式
   */
  async getBuyneedsMatchingResult (sendCompanyHistoryId: Number) {
    this.options.params = {
      send_company_history_id: sendCompanyHistoryId
    }
    return this.call(
      this.urls.getBuyneedsMatchingResult,
      this.baseURL,
      this.options
    )
  }

  /**
   * マッチング処理開始API(post通信のためベースapi使えず)
   * @param dmListId
   * @returns メッセージ
   */
  async startBuyneedsMatching (dmListId: Number) {
    // パスパラメータに変更する
    this.options.body = {
      dm_list_id: dmListId
    }
    this.options.method = 'POST'
    return this.call(
      this.urls.startBuyneedsMatching,
      this.baseURL,
      this.options
    )
  }
  
  /**
   * 社内ポータル接続用アクセストークン取得メソッド
   * @returns 社内ポータル接続用アクセストークン
   */
  async getJmssPortalAccessToken (): Promise<string> {
    const cookies = useCookies()
    // cookieが存在しない場合、アクセストークンの発行を行う
    if (!cookies.cookies.isKey('jmss_portal_access_token')) {
      // アクセストークン取得用API
      // APIキーをフロントで持たないためにBackendからアクセスする。
      const {data: data}: any = await this.call(this.urls.getJmssPortalAccessToken, this.baseURL, this.options)
      cookies.cookies.set('jmss_portal_access_token', data.value.accessToken, data.value.expiresIn)
    }
    return cookies.cookies.get('jmss_portal_access_token')
  }
}

export default ApproachModule
