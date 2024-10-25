import EmailPasswordNode from "supertokens-node/recipe/emailpassword";
import ThirdPartyNode from "supertokens-node/recipe/thirdparty";
import PasswordlessNode from "supertokens-node/recipe/passwordless";
import SessionNode from "supertokens-node/recipe/session";
import Dashboard from "supertokens-node/recipe/dashboard";
import UserRoles from "supertokens-node/recipe/userroles";
import { appInfo } from "./appInfo";
import { TypeInput } from "supertokens-node/types";
import SuperTokens from "supertokens-node";

export let backendConfig = (): TypeInput => {
    return {
        supertokens: {
            // this is the location of the SuperTokens core.
            connectionURI: "https://try.supertokens.com",
        },
        appInfo,
        // recipeList contains all the modules that you want to
        // use from SuperTokens. See the full list here: https://supertokens.com/docs/guides
        recipeList: [
            EmailPasswordNode.init(),
            ThirdPartyNode.init({
                signInAndUpFeature: {
                    providers: [
                        {
                            config: {
                                thirdPartyId: "google",
                                clients: [
                                    {
                                        clientId: process.env.GOOGLE_ID!,
                                        clientSecret:
                                            process.env.GOOGLE_SECRET!,
                                    },
                                ],
                            },
                        },
                        {
                            config: {
                                thirdPartyId: "github",
                                clients: [
                                    {
                                        clientId: process.env.GITHUB_ID!,
                                        clientSecret:
                                            process.env.GITHUB_SECRET!,
                                    },
                                ],
                            },
                        },
                        {
                            config: {
                                thirdPartyId: "apple",
                                clients: [
                                    {
                                        clientId: process.env.APPLE_ID!,
                                        additionalConfig: {
                                            keyId: process.env.APPLE_KEYID!,
                                            privateKey:
                                                process.env.APPLE_PRIVATEKEY!,
                                            teamId: process.env.APPLE_TEAMID!,
                                        },
                                    },
                                ],
                            },
                        },
                        {
                            config: {
                                thirdPartyId: "twitter",
                                clients: [
                                    {
                                        clientId: process.env.TWITTER_ID!,
                                        clientSecret:
                                            process.env.TWITTER_SECRET!,
                                    },
                                ],
                            },
                        },
                    ],
                },
            }),
            PasswordlessNode.init({
                contactMethod: "EMAIL_OR_PHONE",
                flowType: "USER_INPUT_CODE_AND_MAGIC_LINK",
            }),
            SessionNode.init({
                override: {
                    functions: (originalImplementation) => {
                        return {
                            ...originalImplementation,
                            createNewSession: async (input) => {
                                const response =
                                    await originalImplementation.createNewSession(
                                        input
                                    );
                                response.getAccessTokenPayload({
                                    redirectToPath:
                                        input.userContext.redirectToPath ??
                                        "/dash",
                                });
                                return response;
                            },
                        };
                    },
                },
            }),
            Dashboard.init(),
            UserRoles.init(),
        ],
        isInServerlessEnv: true,
        framework: "custom",
    };
};

let initialized = false;
export function ensureSuperTokensInit() {
    if (!initialized) {
        SuperTokens.init(backendConfig());
        initialized = true;
    }
}
