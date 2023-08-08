// エンドポイントが増えてきたら分割する
import BaseApiFactory from '../factory';
import { useCookies } from "vue3-cookies";

class JmssPortalModule extends BaseApiFactory {
  private urls: any = {
    getAccessToken: `/api/jmss_portal_auth`,
    getApproachList: `/api/v1/approach_lists`,
    getApproachCompanyList: (approachListId: string) => `/api/v1/approach_lists/${approachListId}`,
    getBuyneeds: `/api/v1/buyers`,
    getUsers: `/api/v1/users`,
    getCompanies: `/api/v1/companies`,
  }
  private baseURL;
  private approachBaseURL;
  private options: any = { headers: {'Authorization': `Bearer ${this.authJmssPortalToken()}`}}
  constructor(baseURL: string, approachBaseURL: string) {
    super();
    this.baseURL = baseURL,
    this.approachBaseURL = approachBaseURL
  }

  /**
   * アプローチリスト取得用API
   * @param approachListId 
   * @param searchParams 
   * @param limit 
   * @returns アプローチリスト
   */
  async getApproachList(approachListId: string, searchParams: any, limit: Number) {
    this.options.params = {
      id: approachListId,
      method: 1,
      team_id: searchParams.chargeOfTeam,
      user_id: searchParams.chargeOfConsultant,
      name: searchParams.listName,
      type: searchParams.approachPurpose,
      created_at_min: searchParams.registrationDateFrom,
      created_at_max: searchParams.registrationDateTo,
      limit: limit
    };
    return this.call(this.urls.getApproachList, this.baseURL, this.options);
  }

  // 
  /**
   * アプローチリスト企業取得用API
   * @param approachListId 
   * @returns アプローチリスト企業
   */
  getApproachCompanyList(approachListId: string) {
    return this.call(this.urls.getApproachCompanyList(approachListId), this.baseURL);
  }  

  // 買いニーズ取得API
  /**
   * 
   * @param buyneedsId 
   * @returns 
   */
  getBuyneeds(buyneedsId: string) {
    this.options.params = {
      id: buyneedsId,
      // source_type: sourceType,
      // company_industry_id: companyIndustryId,
      // company_pref_id: companyPrefId,
      // industry_id: industryId,
      // pref_id: prefId,
      // company_sales_min: companySalesMin,
      // company_sales_max: companySalesMax,
      // remarks: remarks,
      // limit: limit
    }
    return this.call(this.urls.getBuyneeds, this.baseURL, this.options);
  }

  // ユーザ取得API
  getUsersById(userIds: string[]) {
    this.options.params = {
      id: userIds,
    }
    return this.call(this.urls.getUsers, this.baseURL, this.options);
  }
  
  // 企業マスタ取得用API
  getComanies(companyIdList: number[]) {
    this.options.params = {
      id: companyIdList
    };
    return this.call(this.urls.getCompanies, this.baseURL, this.options);
  }

  // 社内ポータルで使用するため一旦こちらに入れている。
  // 社内ポータル接続用アクセストークン取得メソッド
  async authJmssPortalToken() {
    const cookies = useCookies();
    // cookieが存在しない場合、アクセストークンの発行を行う
    if(!cookies.cookies.isKey('jmss_portal_access_token')) {
      // アクセストークン取得用API
      // APIキーをフロントで持たないためにBackendからアクセスする。
      const data: any = await useFetch(
        this.urls.getAccessToken, {
            baseURL: this.approachBaseURL
        }
      );
      // TODO access_tokenの値をエンコードする必要あり？
      cookies.cookies.set('jmss_portal_access_token', data.access_token, data.expires_in)
    }

    return cookies.cookies.get('jmss_portal_access_token');
  }
}

export default JmssPortalModule;