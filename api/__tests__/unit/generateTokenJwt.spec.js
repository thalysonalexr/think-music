import { generateTokenJwt } from "../../src/app/utils";

describe("Generate JWT", () => {
  it("should be generate a token JWT with secretKey", () => {
    const token = generateTokenJwt("mysecret@key");

    expect(token).toEqual(expect.any(String));
    expect(token.split(".").length).toBe(3);
  });

  it("should be generate a token JWT and store payload", () => {
    const token = generateTokenJwt("mysecret@key", { id: 5 });

    expect(token).toEqual(expect.any(String));
    expect(token.split(".").length).toBe(3);
  });
});
