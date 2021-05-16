export const expectToThrow = async (fn: () => Promise<any>, expectedError?: Error) => {
    await expect(fn()).rejects.toThrow(expectedError);
};
