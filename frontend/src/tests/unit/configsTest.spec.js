import configs from '@/plugins/configs'
import codes from '@/plugins/codes'

describe('configs test', () => {
    const OLD_ENV = process.env;
    global.fetch = jest.fn(() => {
      return new Promise((resolve) => {
        const result = { 
          json () {
            return { 
              default: {
                ApiUrl: codes.LOCALHOST 
              }
            }
          }
        } 
        resolve(result)
      })
    })

    beforeEach(() => {
      jest.resetModules()
      fetch.mockClear()
      process.env = { ...OLD_ENV }
    })
    afterAll(() => {
      process.env = OLD_ENV
    })

    test('init test', async () => {
        const runtimeConfig = await configs.init()
        expect(runtimeConfig.ApiUrl).toBe(`http://${codes.LOCALHOST}:9001/`)
    })
})