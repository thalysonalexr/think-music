import { generateTokenCrypto } from "../../src/app/utils";

describe("Generate Token with Crypto module", () => {
  it("should be generate token with 20 random bytes", () => {
    const token = generateTokenCrypto();

    expect(token).toEqual(expect.any(String));
    expect(token).toHaveLength(40);
  });

  it("should be generate token passing size", () => {
    const size = Math.floor(Math.random() * (100 - 1)) + 1;
    const token = generateTokenCrypto(size);

    expect(token).toHaveLength(size * 2);
    expect(token).toEqual(expect.any(String));
  });
});
