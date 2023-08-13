// エンドポイントが増えてきたら分割する
// TODO 社内ポータルの受け取り方によって変数の型定義変更の可能性あり

import BaseApiFactory from '../factory';
import { useCookies } from "vue3-cookies";

class JmssPortalModule extends BaseApiFactory {
  private urls: any = {
    getAccessToken: `/api/jmss_portal_auth`,
    getApproachLists: `/api/v1/approach_lists`,
    getApproachCompanyList: (approachListId: number) => `/api/v1/approach_lists/${approachListId}`,
    getBuyneeds: `/api/v1/buyers`,
    getUsers: `/api/v1/users`,
    getCompanies: `/api/v1/companies`,
    getTeams:`/api/v1/teams`,
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
  async getApproachLists(approachListId?: number[], searchParams?: any, page?: number, limit?: Number) {
    this.options.params = {
      id: approachListId,
      method: 1,
      team_id: searchParams.chargeOfTeam,
      user_id: searchParams.chargeOfConsultant,
      name: searchParams.listName,
      type: searchParams.approachPurpose,
      created_at_min: searchParams.registrationDateFrom,
      created_at_max: searchParams.registrationDateTo,
      page: page,
      limit: limit
    };
    return this.call(this.urls.getApproachLists, this.baseURL, this.options);
  }

  // 
  /**
   * アプローチリスト企業取得用API
   * @param approachListId 
   * @returns アプローチリスト企業
   */
  getApproachCompanyList(approachListId: number) {
    return this.call(this.urls.getApproachCompanyList(approachListId), this.baseURL);
  }  

  // 買いニーズ取得API
  /**
   * 
   * @param buyneedsId 
   * @returns 
   */
  getBuyneeds(buyneedsIds?: number[], page?: number, limit?: number) {
    this.options.params = {
      id: buyneedsIds,
      // source_type: sourceType,
      // company_industry_id: companyIndustryId,
      // company_pref_id: companyPrefId,
      // industry_id: industryId,
      // pref_id: prefId,
      // company_sales_min: companySalesMin,
      // company_sales_max: companySalesMax,
      // remarks: remarks,
      page: page,
      limit: limit
    }
    return this.call(this.urls.getBuyneeds, this.baseURL, this.options);
  }

  /**
   * ユーザ取得API
   * @param userIds 
   * @param page 
   * @param limit 
   * @returns 
   */
  getUsersById(userIds?: number[], page?: number, limit?: number) {
    this.options.params = {
      id: userIds,
      page: page,
      limit: limit      
    }
    return this.call(this.urls.getUsers, this.baseURL, this.options);
  }
  
  /**
   * 企業マスタ取得API
   * @param companyIds 
   * @param name 
   * @param page 
   * @param limit 
   * @returns 
   */
  getCompanies(companyIds?: number[], name?: string, page?: number, limit?: number) {
    this.options.params = {
      id: companyIds,
      name: name,
      page: page,
      limit: limit
    };
    return this.call(this.urls.getCompanies, this.baseURL, this.options);
  }

  /**
   * チーム取得API
   * @param department_id
   * @param page 
   * @param limit 
   * @returns 
   */
  getTeams(department_id?: number[], page?: number, limit?: number) {
    this.options.params = {
      department_id: department_id,
      page: page,
      limit: limit
    };
    return this.call(this.urls.getTeams, this.baseURL, this.options);
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