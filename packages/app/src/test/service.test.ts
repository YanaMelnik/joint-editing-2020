import { testHello } from "./service";

test('is service work correct', () => {
    expect(testHello()).toBe("Test is working correct");
})
