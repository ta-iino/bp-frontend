export default defineEventHandler(() => {

    const data = [
      { created_at: "2018-11-18T08:35:38.000000Z",
        deleted_at: null,
        departments: [
            {
                "code" : "officer",
                "id" : 1,
                "name" : "役員"
            },
            {
                "code" : "consul",
                "id" : 2,
                "name" : "コンサルティング本部"
            }
        ],
        display_name: "武元 義幸",
        email: "y.takemoto@xxxxx.xx.jp",
        first_name: "義幸",
        first_name_kana: "よしゆき",
        id: 1,
        is_experienced : 1,
        last_name : "武元",
        last_name_kana : "たけもと",
        name : "武元 義幸",
        position_id : 0,
        role : {
            chikyu_id : "5ea17123f49aba0001c7b46e",
            code : "initial_role",
            id : 1,
            name : "管理者ロール"
        },
        role_id : 1,
        teams : [
            {
            chatwork_room_id : "",
            code : "consul-financial-team",
            deleted_at : null,
            department_id : 2,
            group : "consul-succession-group",
            id : 16,
            main : 1,
            name : "金融法人T",
            parent_id : 26,
            short_name : "金融法人"
            }
        ],
        tel : "09072035688",
        updated_at : "2023-05-17T11:30:12.000000Z"
      },
    ]
  
      return data
  
    });
    