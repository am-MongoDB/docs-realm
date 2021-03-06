import Realm from "realm";

const app = new Realm.App({ id: "example-testers-kvjdy" });

describe("user authentication", () => {
  afterEach(async () => {
    await app.currentUser?.logOut();
    jest.runAllTimers();
  });

  test("anonymous login", async () => {
    // Create an anonymous credential
    const credentials = Realm.Credentials.anonymous();
    try {
      const user: Realm.User = await app.logIn(credentials);
      console.log("Successfully logged in!", user.id);
      return user;
    } catch (err) {
      console.error("Failed to log in", err.message);
    }
  });

  test("email/password login", async () => {
    // Create an email/password credential
    const credentials = Realm.Credentials.emailPassword(
      "joe.jasper@example.com",
      "passw0rd"
    );
    try {
      const user: Realm.User = await app.logIn(credentials);
      console.log("Successfully logged in!", user.id);
      return user;
    } catch (err) {
      console.error("Failed to log in", err.message);
    }
  });

  test("server api key login", async () => {
    // Get the API key from the local environment
    const apiKey = process.env?.realmServerApiKey;
    if (!apiKey) {
      throw new Error("Could not find a Realm Server API Key.");
    }
    // Create an api key credential
    const credentials = Realm.Credentials.serverApiKey(apiKey);
    try {
      const user: Realm.User = await app.logIn(credentials);
      console.log("Successfully logged in!", user.id);
      return user;
    } catch (err) {
      console.error("Failed to log in", err.message);
    }
  });

  test("custom function login", async () => {
    // Create a custom function credential
    const credentials = Realm.Credentials.function({ username: "mongolover" });
    try {
      const user: Realm.User = await app.logIn(credentials);
      console.log("Successfully logged in!", user.id);
      return user;
    } catch (err) {
      console.error("Failed to log in", err.message);
    }
  });

  test("custom jwt login", async () => {
    const authenticateWithExternalSystem = () => {
      // Simulates returning the following JWT information from an external auth service
      // JWT: {
      //   header: {
      //     "alg": "HS256",
      //     "typ": "JWT",
      //   },
      //   payload: {
      //     "aud": "example-testers-kvjdy",
      //     "sub": "example-user",
      //     "exp": 1918062398,
      //     "name": "Joe Jasper",
      //   },
      //   secret: "E7DE0D13D66BF64EC9A9A74A3D600E840D39B4C12832D380E48ECE02070865AB"
      // }
      //
      return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJleGFtcGxlLXRlc3RlcnMta3ZqZHkiLCJzdWIiOiJleGFtcGxlLXVzZXIiLCJuYW1lIjoiSm9lIEphc3BlciIsImV4cCI6MTkxODA2MjM5OH0.3wR1cJN4zlbbDh7IaYyDX0fasNEW3grJCdv_7lQFnPI";
    };
    // Create a custom jwt credential
    const jwt: string = await authenticateWithExternalSystem();
    const credentials = Realm.Credentials.jwt(jwt);
    try {
      const user: Realm.User = await app.logIn(credentials);
      console.log("Successfully logged in!", user.id);
      return user;
    } catch (err) {
      console.error("Failed to log in", err.message);
    }
  });

  test("logout", async () => {
    const emailPasswordCredentials = Realm.Credentials.emailPassword(
      "joe.jasper@example.com",
      "passw0rd"
    );
    const functionCredentials = Realm.Credentials.function({
      username: "mongolover",
    });
    try {
      const emailPasswordUser: Realm.User = await app.logIn(
        emailPasswordCredentials
      );
      const functionUser: Realm.User = await app.logIn(functionCredentials);
      expect(functionUser.id).toBe(app.currentUser?.id);

      // Log out the current user
      await app.currentUser?.logOut();
      // Log out a specific user by ID
      if (app.currentUser) {
        await app.allUsers[app.currentUser.id].logOut();
      }
    } catch (err) {
      console.error(err.message);
    }
  });
});
