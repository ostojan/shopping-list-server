export const expectNotToThrow = async (fn: () => Promise<any>) => {
    await expect(fn()).resolves.not.toThrow();
};
