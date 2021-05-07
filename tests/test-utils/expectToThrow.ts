export const expectToThrow = async (fn: () => Promise<any>) => {
    await expect(fn()).rejects.toThrow();
};
