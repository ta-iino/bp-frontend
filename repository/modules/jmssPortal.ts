import BaseApiFactory from '../factory'
import { useCookies } from 'vue3-cookies'

class JmssPortalModule extends BaseApiFactory {
  private urls: any = {
    getApproachLists: '/api/v1/approach_lists',
    getApproachCompanyList: (approachListId: number) => `/api/v1/approach_lists/${approachListId}`,
    getBuyneeds: '/api/v1/buyers',
    getUsers: '/api/v1/users',
    getCompanies: '/api/v1/companies',
    getTeams: '/api/v1/teams'
  }

  private jmssPortalBaseURL: string
  private options: any = {} 
  constructor (jmssPortalBaseURL: string) {
    super()
    this.jmssPortalBaseURL = jmssPortalBaseURL
  }

  /**
   * アプローチリスト取得用API
   * @param approachListId
   * @param searchParams
   * @param limit
   * @returns アプローチリスト
   */
  async getApproachLists (approachListId?: string, searchParams?: any, page?: number, limit?: Number) {
    this.options.body = {
      id: approachListId,
      // method: 1,
      team_id: searchParams?.chargeOfTeam,
      user_id: searchParams?.chargeOfConsultant,
      name: searchParams?.listName,
      type: searchParams?.approachPurpose,
      created_at_min: searchParams?.registrationDateFrom,
      created_at_max: searchParams?.registrationDateTo,
      page: page,
      limit: limit,
    }
    delete this.options.params
    this.options = { headers: { 'Authorization': `Bearer ${useCookies().cookies.get('jmss_portal_access_token')}` } }
    this.options.credentials = 'omit'
    this.options.method = 'POST'
    return this.call(this.urls.getApproachLists, this.jmssPortalBaseURL, this.options)
  }

  /**
   * アプローチリスト企業取得用API
   * @param approachListId
   * @returns アプローチリスト企業
   */
  getApproachCompanyList (approachListId: number) {
    delete this.options.body
    this.options = { headers: { 'Authorization': `Bearer ${useCookies().cookies.get('jmss_portal_access_token')}` } }
    this.options.credentials = 'omit'
    this.options.method = 'GET'
    return this.call(this.urls.getApproachCompanyList(approachListId), this.jmssPortalBaseURL)
  }

  // 買いニーズ取得API
  /**
   *
   * @param buyneedsId
   * @returns
   */
  getBuyneeds (buyneedsIds?: string, page?: number, limit?: number) {
    this.options.body = {
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
    delete this.options.params
    this.options = { headers: { 'Authorization': `Bearer ${useCookies().cookies.get('jmss_portal_access_token')}` } }
    this.options.credentials = 'omit'
    this.options.method = 'POST'
    return this.call(this.urls.getBuyneeds, this.jmssPortalBaseURL, this.options)
  }

  /**
   * ユーザ取得API
   * @param userIds
   * @param page
   * @param limit
   * @returns
   */
  getUsersById (userIds?: number[], page?: number, limit?: number) {
    this.options.params = {
      id: userIds,
      page: page,
      limit: limit,
    }
    delete this.options.body
    this.options = { headers: { 'Authorization': `Bearer ${useCookies().cookies.get('jmss_portal_access_token')}` } }
    this.options.credentials = 'omit'
    this.options.method = 'GET'
    return this.call(this.urls.getUsers, this.jmssPortalBaseURL, this.options)
  }

  /**
   * 企業マスタ取得API(POST通信)
   * @param companyIds
   * @param name
   * @param page
   * @param limit
   * @returns
   */
  getCompanies (companyIds?: string, page?: number, limit?: number, name?: string) {
    this.options.body = {
      id: companyIds,
      name: name,
      page: page,
      limit: limit,
    }
    delete this.options.params
    this.options = { headers: { 'Authorization': `Bearer ${useCookies().cookies.get('jmss_portal_access_token')}` } }
    this.options.credentials = 'omit'
    this.options.method = 'POST'
    return this.call(this.urls.getCompanies, this.jmssPortalBaseURL, this.options)
    
  }

  /**
   * チーム取得API
   * @param department_id
   * @param page
   * @param limit
   * @returns
   */
  getTeams (department_id?: number[], page?: number, limit?: number) {
    this.options.params = {
      department_id: department_id,
      page: page,
      limit: limit,
    }
    delete this.options.body
    this.options = { headers: { 'Authorization': `Bearer ${useCookies().cookies.get('jmss_portal_access_token')}` } }
    this.options.credentials = 'omit'
    this.options.method = 'GET'
    return this.call(this.urls.getTeams, this.jmssPortalBaseURL, this.options)
  }
}

export default JmssPortalModule
