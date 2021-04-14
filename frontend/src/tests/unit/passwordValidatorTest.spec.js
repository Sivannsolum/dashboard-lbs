// ### Password Policy 적용시 유효성 검사 테스트
import { getPasswordValidation, getEmailValidation } from '@/plugins/passwordValidator'

// Dummy data for tests
let passwords = [
    {val: 'Solum1!673abc', expectedResult: false } ,
    {val: 'Solum1!kjhi', expectedResult: false } ,
    {val: 'Solum1!567', expectedResult: false },
    {val: 'Pe@te127!538', expectedResult: true },
    {val: 'Dton@ic!257', expectedResult: true },
    {val: 'ConSecutive!123123', expectedResult: false },
    {val: 'Same!111111', expectedResult: false },
    {val: 'ConSeCutiveQqwerty!1261', expectedResult: false },
]
let userId = 'solum'
let user = { pwMinimumLength: 8, pwPolicyEnable: 'true' }

let emails = [
    {val: '', expectedResult: true },
    {val: null, expectedResult: true },
    {val: 'peter@naver.com', expectedResult: true },
    {val: '123sf@yahoo.com', expectedResult: true },
    {val: 'testEmailLongEmailAddress@longlongDomain.com', expectedResult: true },
    {val: 'specialChractorIncludes!!$%^&@specital2424$&!.coms&*&%538', expectedResult: true },
    {val: '21312323213123@214312124.12412', expectedResult: true },
    {val: '@@@@@@@', expectedResult: false },
    {val: '!%!%!%!@^^^%%%52', expectedResult: false },
    {val: 'withoutdot@sakdfcom', expectedResult: false },
    {val: 'withoutatmark.com', expectedResult: false },
]

// Test
describe('Password validator test', () => {
    for(let password of passwords) {
        let passwordCheck = () => {
            expect(getPasswordValidation(userId, password.val, user).result)
            .toBe(password.expectedResult)
        }
        test('Password validation test', passwordCheck)
    }
    for(let email of emails) {
        let emailCheck = () => {
            expect(getEmailValidation(email.val).result)
            .toBe(email.expectedResult)
        }
        test('Email validation test', emailCheck)
    }
})

