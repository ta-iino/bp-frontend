export default defineEventHandler(() => {

    const data = [
        {
            "id": 15,
            "code": "consul-ap-team",
            "group": "consul-succession-group",
            "name": "Aチーム",
            "short_name": "AP",
            "parent_id": 26,
            "department_id": 2
        },
        {
            "id": 14,
            "code": "consul-is-team",
            "group": "consul-plan-group",
            "name": "Bチーム",
            "short_name": "IS",
            "parent_id": 27,
            "department_id": 2
        },
        {
            "id": 17,
            "code": "consul-direct-team",
            "group": "consul-succession-group",
            "name": "Cチーム",
            "short_name": "ダイレクト",
            "parent_id": 32,
            "department_id": 2
        },
        {
            "id": 22,
            "code": "consul-healthcare-team",
            "group": "consul-specific-group",
            "name": "Bチーム",
            "short_name": "ヘルスケア",
            "parent_id": 29,
            "department_id": 2
        },
        {
            "id": 20,
            "code": "consul-bs-team",
            "group": "consul-bs-group",
            "name": "Aチーム",
            "short_name": "BS",
            "parent_id": 27,
            "department_id": 2
        },
        {
            "id": 27,
            "code": "consul-bs-group",
            "group": "",
            "name": "事業戦略部",
            "short_name": "BS",
            "parent_id": 0,
            "department_id": 2
        },
        {
            "id": 26,
            "code": "consul-succession-group",
            "group": "",
            "name": "事業承継第一部",
            "short_name": "事業承継１",
            "parent_id": 0,
            "department_id": 2
        },
        {
            "id": 32,
            "code": "consul-succession-group2",
            "group": "",
            "name": "事業承継第二部",
            "short_name": "事業承継２",
            "parent_id": 0,
            "department_id": 2
        },
        {
            "id": 24,
            "code": "consul-support-group",
            "group": "",
            "name": "業務支援部",
            "short_name": "業務支援部",
            "parent_id": 0,
            "department_id": 2
        },
    ]

    return data

});