import commons from '@/plugins/commons'

const falsyArr = [ null, undefined ]

describe('Commons Test', () => {
    const OLD_ENV = process.env;
    beforeEach(() => {
      jest.resetModules()
      process.env = { ...OLD_ENV }
    })
    afterAll(() => {
      process.env = OLD_ENV
    })
    
    test('copy test', () => {
        const testCase = [
            {
                name: 'testMan',
                age: 30,
                sincere: false,
                greedy: true
            },
            [ 'arrayTestCase', 'test', ...falsyArr ],
            'StringTest',
            123,
            false,
            true
        ]
        const invalidTestCase = [
            null,
            undefined
        ]
        for (const tc of testCase) {
            expect(commons.copy(tc)).toStrictEqual(tc)
        }
        for (const tc of invalidTestCase) {
            try {
                commons.copy(tc)
            } catch (error) {
                expect(error.name).toBe('TypeError')
            }
        }
    })
    test('has test', () => {
        const testCase = [
            {
                arr: ['str', '', ...falsyArr ],
                toFind: 'str',
                result: true
            },
            {
                arr: [ 123, 53, 345, 939 ],
                toFind: 123,
                result: true
            },
            {
                arr: [ 123, 53, 345, 939 ],
                toFind: '123',
                result: false
            },
            {
                arr: [ true, true, true, true, ...falsyArr ],
                toFind: false,
                result: false
            }
        ]
        for (const tc of testCase) {
            expect(commons.has(tc.arr, tc.toFind)).toBe(tc.result)
        }
    })
    test('isUpperCase test', () => {
        const testCase = [
            {
                text: 'abc',
                result: false
            },
            {
                text: 'ABC',
                result: true
            },
            {
                text: 123,
                result: false
            },
            {
                text: true,
                result: false
            },
        ]
        for (const tc of testCase) {
            expect(commons.isUpperCase(tc.text)).toBe(tc.result)
        }
    })
    test('isNull test', () => {
        const testCase = [
            {
                obj: null,
                result: true
            },
            {
                obj: undefined,
                result: true
            },
            {
                obj: 'undefined',
                result: true
            },
            {
                obj: false,
                result: false
            },
        ]
        for (const tc of testCase) {
            expect(commons.isNull(tc.obj)).toBe(tc.result)
        }
    })
    test('isValidData test', () => {
        const testCase = [
            {
                obj: {
                    one: null,
                    two: undefined,
                    three: 123
                },
                result: false
            },
            {
                obj: {
                    one: 'null',
                    two: 'undefined',
                    three: 123
                },
                result: true
            },
            {
                obj: null,
                result: false
            },
            {
                obj: undefined,
                result: false
            },
        ]
        for (const tc of testCase) {
            expect(commons.isValidData(tc.obj).result).toBe(tc.result)
        }
    })
    test('isValidString test', () => {
        const testCase = [
            {
                obj: 'asdfsadf',
                result: true
            },
            {
                obj: false,
                result: false
            },
            {
                obj: true,
                result: false
            },
            {
                obj: 123,
                result: false
            },
            {
                obj: null,
                result: false
            },
            {
                obj: undefined,
                result: false
            },
        ]
        for (const tc of testCase) {
            expect(commons.isValidStr(tc.obj)).toBe(tc.result)
        }
    })
    test('isSorting test', () => {
        const testCase = [
            {
                sortBy: [1],
                sortDesc: null,
                result: false
            },
            {
                sortBy: undefined,
                sortDesc: null,
                result: false
            },{
                sortBy: [1],
                sortDesc: undefined,
                result: false
            },{
                sortBy: [1],
                sortDesc: [1],
                result: true
            }
        ]
        for (const tc of testCase) {
            expect(commons.isSorting(tc.sortBy, tc.sortDesc)).toBe(tc.result)
        }
    })
    test('getPageInfoText test', () => {
        const failResult = '0 to 0, 0 in total'
        const testCase = [
            {
                headers: undefined,
                result: failResult
            },
            {
                headers: null,
                result: failResult
            },
            {
                headers: 123,
                result: failResult
            },
            {
                headers: 'asd',
                result: failResult
            }
        ]
        for (const tc of testCase) {
            expect(commons.getPageInfoText(tc.headers)).toBe(tc.result)
        }
    })
})