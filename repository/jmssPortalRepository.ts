import { useCookies } from "vue3-cookies";

const runtimeConfig = useRuntimeConfig()

export const Urls = {
    getAccessToken: `/api/jmss_portal_auth`,
    getApproachList: `/api/v1/approach_lists`,
    getApproachCompanyList: (approachListId: string) => `/api/v1/approach_lists/${approachListId}`,
    getBuyneeds: `/api/v1/buyers`,
    getUsers: `/api/v1/users`,
    getCompanies: `/api/v1/companies`,
}

export class jmssPortalRepository {
  
  /**
   * アプローチリスト取得用API
   * @param approachListId 
   * @param searchParams 
   * @param limit 
   * @returns アプローチリスト
   */
  getApproachList(approachListId: string, searchParams: any, limit: Number) {
    const params: any = {
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
    return this.baseApi(Urls.getApproachList, params);      
  }

  // 
  /**
   * アプローチリスト企業取得用API
   * @param approachListId 
   * @returns アプローチリスト企業
   */
  getApproachCompanyList(approachListId: string) {
    return this.baseApi(Urls.getApproachCompanyList(approachListId), null);      
  }  

  // 買いニーズ取得API
  /**
   * 
   * @param buyneedsId 
   * @returns 
   */
  getBuyneeds(buyneedsId: string) {
    const params: any = {
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
    return this.baseApi(Urls.getBuyneeds, params);
  }

  // ユーザ取得API
  getUsers(userIds: string[]) {
    const params: any = {
      id: userIds,
    }
    return this.baseApi(Urls.getBuyneeds, params);
  }
  
  // 企業マスタ取得用API
  getComanies(companyIdList: number[]) {
    const params: any = {id: companyIdList};
    return this.baseApi(Urls.getCompanies, params);
  }


  // 各APIのベースメソッド
  async baseApi(url: string, params: any) {
    const {data, error} = await useFetch(
      url, {
        baseURL:  runtimeConfig.public.jmssPortalbaseURL,
        headers: {'Authorization': `Bearer ${this.authJmssPortalToken()}`},
        params: params
      }
    );
    return {data, error};
  }

  // 社内ポータル接続用アクセストークン取得メソッド
  async authJmssPortalToken() {
    const cookies = useCookies();
    // cookieが存在しない場合、アクセストークンの発行を行う
    if(!cookies.cookies.isKey('jmss_portal_access_token')) {
      // アクセストークン取得用API
      // APIキーをフロントで持たないためにBackendからアクセスする。
      const data: any = await useFetch(
        Urls.getAccessToken, {
            baseURL:  runtimeConfig.public.approachBaseURL
        }
      );
      // TODO access_tokenの値をエンコードする必要あり？
      cookies.cookies.set('jmss_portal_access_token', data.access_token, data.expires_in)
    }

    return cookies.cookies.get('jmss_portal_access_token');
  }

    
}