import { buildParamsTxt, getRequestConfig } from '@/plugins/exporter'
import codes from '@/plugins/codes'

describe('exporter test', () => {
    const OLD_ENV = process.env;
    beforeEach(() => {
      jest.resetModules()
      process.env = { ...OLD_ENV }
    })
    afterAll(() => {
      process.env = OLD_ENV
    })
    
    test('buildParamsTxt test', () => {
        let params = {
            store: 'store1',
            status: 'failed'
        }
        expect(buildParamsTxt(params)).toBe(`store=store1&status=failed&size=${codes.EXPORT_SIZE}`)
        params = {
            store: null,
            status: undefined
        }
        expect(buildParamsTxt(params)).toBe(`store=&status=&size=${codes.EXPORT_SIZE}`)
    })

    test('getRequestConfig test', () => {
        const config = {
            url: '',
            method: '',
            params: '',
            etc: null,
            a: 2
        }
        expect(getRequestConfig(config)).toStrictEqual({
            url: config.url,
            method: config.method,
            params: config.params
        })
    })
})
