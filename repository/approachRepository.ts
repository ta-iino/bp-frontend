// エンドポイントが増えてきたら分割する

const runtimeConfig = useRuntimeConfig()

export const Urls = {
    getDmList: `/api/dm_list`,
    getSendCompanyHisotry: `/api/send_comapny_history`,
    getBuyneedsMatchingResultCsv: `/api/buyneeds_matching_result_csv`,
    getBuyneedsMatchingResult: `/api/buyneeds_matching_result`,
    startBuyneedsMatching: `/api//buyneeds_matching_start`,
}


export class jmssPortalRepository {

  /**
   * DMリスト取得API
   * @param approachListIds
   * @param searchCondition
   * @returns DMリストのリスト
   */
  async getDmList(approachListIds: string[], searchCondition: any) {
    const params: any = {
      approach_list_ids: approachListIds,
      search_condition: searchCondition
    };
    return this.baseApi(Urls.getDmList, params);
  }

  /**
   * 発送企業履歴取得API
   * @param buyneedsMatchingHistoryId
   * @returns 発送企業履歴リスト
   */
  async getSendCompanyHisotry(buyneedsMatchingHistoryId: Number) {
    const params: any = {
      buyneeds_matching_history_id: buyneedsMatchingHistoryId,
    }
    return this.baseApi(Urls.getSendCompanyHisotry, params);
  }

  /**
   * 買いニーズマッチング結果CSV取得API
   * @param buyneedsMatchingHistoryId 
   * @returns 買いニーズマッチング結果CSVファイル
   */
  async getBuyneedsMatchingResultCsv(buyneedsMatchingHistoryId: Number) {
    const params: any = {
      buyneeds_matching_history_id: buyneedsMatchingHistoryId,
    }
    return this.baseApi(Urls.getBuyneedsMatchingResultCsv, params);
  }


  /**
   * 買いニーズマッチング結果取得API
   * @param sendCompanyHistoryId 
   * @returns 買いニーズマッチング結果JSON形式
   */
  async getBuyneedsMatchingResult(sendCompanyHistoryId: Number) {
    const params: any = {
      send_company_history_id: sendCompanyHistoryId,
    }
    return this.baseApi(Urls.getBuyneedsMatchingResult, params);
  }


  /**
   * マッチング処理開始API(post通信のためベースapi使えず)
   * @param dm_list_id 
   * @returns メッセージ
   */
  async startBuyneedsMatching(dm_list_id: Number) {
    const {data, error} = await useFetch(
      Urls.startBuyneedsMatching, {
        baseURL:  runtimeConfig.public.approachBaseURL,
        params: {
          dm_list_id: dm_list_id,
        },
        method: 'POST'
      }
    );
    return {data, error};
  }

  // 各APIのベースメソッド
  async baseApi(url: string, params: any) {
    const {data, error} = await useFetch(
      url, {
        baseURL:  runtimeConfig.public.jmssPortalbaseURL,
        params: params
      }
    );
    return {data, error};
  }


}