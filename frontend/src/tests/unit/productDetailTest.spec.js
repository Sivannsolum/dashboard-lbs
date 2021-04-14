import ProductDetail from '../../views/Product/modal/ProductDetail'

describe('Product Info test', () => {
  const productDetailTester = {
    $t: (val) => {
      if (val.includes('It can\'t find template with the value')) return '해당 값이 있는 템플릿을 찾을 수 없습니다.'
      if (val.includes('label is not in the whiteList: station')) return '해당 라벨이 whiteList : station에 없습니다'
      return val
    }
  }
  test('getTranslatedErrorMsg test', () => {
    const error = {
      response: {
        status: 404,
        data: {
          responseMessage: 'It can\'t find template with the value \'01020307AC98\'.',
          responseCode: '404'
        }
      }
    }
    const getTranslatedErrorMsg = ProductDetail.methods.getTranslatedErrorMsg.bind(productDetailTester)
    expect(getTranslatedErrorMsg(error)).toBe(`해당 값이 있는 템플릿을 찾을 수 없습니다. '01020307AC98'.`)
  })
  test('getTranslatedErrorMsg test: lable is not in the whitelist', () => {
    const error = {
      response: {
        status: 404,
        data: {
          responseMessage: '03647564B291 label is not in the whiteList: station(QUEENS)',
          responseCode: '404'
        }
      }
    }
    const getTranslatedErrorMsg = ProductDetail.methods.getTranslatedErrorMsg.bind(productDetailTester)
    expect(getTranslatedErrorMsg(error)).toBe(`03647564B291 해당 라벨이 whiteList : station에 없습니다 (QUEENS)`)
  })
})
