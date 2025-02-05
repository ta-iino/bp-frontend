// 企業取得APIモック
export default defineEventHandler(() => {

    const data = {
        "current_page": 1,
        "data": [
            {
                "id": "00001",
                "category": "一般",
                "source": "TSR",
                "name": "企業名１",
                "lbc": null,
                "corporate_number": null,
                "duns_number": "280215754",
                "tel": "05017430310",
                "fax": null,
                "zip": "1234567",
                "pref": "茨城県",
                "address": "所在地１",
                "url": null,
                "email": null,
                "listed_on": "未上場",
                "representative_name": "代表者名1",
                "representative_post": null,
                "representative_birthday": "1969-06-16",
                "representative_zip": "3000845",
                "representative_pref": "茨城県",
                "representative_address": "茨城県テスト市テスト２－９－２７",
                "officers": "テスト　太郎, テスト　次郎",
                "major_shareholder_name": null,
                "major_shareholder_age": null,
                "shareholders": "テスト",
                "owner_type": "不明・その他",
                "successor_type": null,
                "capital": 90,
                "net_assets": null,
                "sales": 100,
                "sales_range": "1,000百万～2,000百万円",
                "profit": 200,
                "income_range": "0～500万円",
                "employees": 205,
                "industry": {
                    "2734": "業種1",
                    "6099": "業種2",
                    "7431": "業種3"
                },
                "established_date": "1990-08-01",
                "referrer_type": null,
                "referrer_name": null,
                "referral_date": null,
                "referral_exp_date": null,
                "referrer_type_old": null,
                "referrer_name_old": null,
                "customer_type": null,
                "error_type": "既存先",
                "features": null,
                "score": null,
                "tags": null,
                "created_by": null,
                "created_at": "2022-01-09T15:21:26",
                "updated_at": "2023-02-17T00:03:04",
                "tsr": {
                    "上場": "9 未上場",
                    "干支": "10 酉",
                    "役員": "テスト",
                    "業種": "2734 精密測定器製造業\n6099 他に分類されないその他の小売業\n7431 機械設計業",
                    "業績": "決算年月 売上（千円） 税込引 利益（千円）配当",
                    "概況": "",
                    "仕入先": "",
                    "代表者": "",
                    "出身地": "35 東京都",
                    "出身校": "",
                    "大株主": "",
                    "所在地": "",
                    "現住所": "",
                    "販売先": "",
                    "資本金": "90,000 千円",
                    "創業年月": "1990/08",
                    "取引銀行": "",
                    "営業種目": "営業種目１",
                    "従業員数": "300 人",
                    "生年月日": "1983/08/22 生",
                    "設立年月": "1990/08",
                    "郵便番号": "〒123-4567",
                    "電話番号": "050-1111-2222",
                    "代表者カナ": "",
                    "代表者氏名": "テスト 太郎",
                    "企業コード": "111111111",
                    "利益伸長率": "371％",
                    "売上伸長率": "142％",
                    "調査年月日": "2022/12/19",
                    "商号（カナ）": "ﾃｽﾄﾃｽﾄﾃｽﾄ",
                    "商号（漢字）": "テストテストテスト",
                    "営業所・支店": "営業所テスト"
                }
            }
        ],
        "first_page_url": "https://intra.dev.jms-support.jp/api/v1/companies?source=tsr&limit=2&key=Zpi5G7ugxYUHGL7MiAKpYmN5MDjLSiV8fUQY2jJD7DkuCESzKrJAzQW8uazJEM6h&page=1",
        "from": 1,
        "next_page_url": "https://intra.dev.jms-support.jp/api/v1/companies?source=tsr&limit=2&key=Zpi5G7ugxYUHGL7MiAKpYmN5MDjLSiV8fUQY2jJD7DkuCESzKrJAzQW8uazJEM6h&page=2",
        "path": "https://intra.dev.jms-support.jp/api/v1/companies",
        "per_page": "2",
        "prev_page_url": null,
        "to": 2,
        "total": 650
    }
    return data;
})
