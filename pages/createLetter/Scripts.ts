import { defineComponent, h } from 'vue';

const editBtnClass = 'v-btn v-btn--elevated v-theme--light v-btn--density-default v-btn--size-default v-btn--variant-elevated v-btn bg-grey-lighten-2'

export const getComponents = (approachListId: string, neccessaryItems: []) => { 
  return defineComponent({
    setup() {
      return {};
    },
    render() {
      // v-row コンポーネントを h 関数を使って生成する
      return createMissingItemsComponents(approachListId, neccessaryItems);
    }
  }
)};

const createMissingItemsComponents = (approachListId: string, neccessaryItems: []) => {
  const missingItemsComponents = []
  const companyList = getCompanyList(approachListId);
  for (const company of companyList) {
    const missingItemsList = getMissingItemsList(neccessaryItems);
    for (const missingItem of missingItemsList) {
      missingItemsComponents.push(
        h('div', {class: "v-row justify-center"}, [
          h('div', { class: "v-col v-col-2" }, [h('v-text', {}, company)]),
          h('div', { class: "v-col v-col-2" }, [h('v-text', {}, missingItem)]),
          h('div', { class: "v-col v-col-1" }, [h('button', {class: editBtnClass}, '編集')])
        ])
      )
    }
  }
  return missingItemsComponents;
}

const getCompanyList = (approachListId: string) => {
  // TODO DM発送先企業リストを取得する
  return [
    '企業A',
    '企業B',
    '企業C'
  ]
}

const getMissingItemsList = (neccessaryItems: []) => {
  // TODO 企業の不足項目リストを取得する
  return [
    '不足項目1',
    '不足項目2',
    '不足項目3'
  ]
}