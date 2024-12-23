import EmailPasswordReact from "supertokens-auth-react/recipe/emailpassword";
import ThirdPartyReact from "supertokens-auth-react/recipe/thirdparty";
import PasswordlessReact from "supertokens-auth-react/recipe/passwordless";
import Session from "supertokens-auth-react/recipe/session";
import { appInfo } from "./appInfo";
import { useRouter } from "next/navigation";
import { SuperTokensConfig } from "supertokens-auth-react/lib/build/types";
import { ThirdPartyPreBuiltUI } from "supertokens-auth-react/recipe/thirdparty/prebuiltui";
import { PasswordlessPreBuiltUI } from "supertokens-auth-react/recipe/passwordless/prebuiltui";
import { EmailPasswordPreBuiltUI } from "supertokens-auth-react/recipe/emailpassword/prebuiltui";

const routerInfo: { router?: ReturnType<typeof useRouter>; pathName?: string } =
    {};

export function setRouter(
    router: ReturnType<typeof useRouter>,
    pathName: string
) {
    routerInfo.router = router;
    routerInfo.pathName = pathName;
}

export const frontendConfig = (): SuperTokensConfig => {
    return {
        appInfo,
        recipeList: [
            EmailPasswordReact.init(),
            ThirdPartyReact.init({
                signInAndUpFeature: {
                    providers: [
                        ThirdPartyReact.Github.init(),
                        ThirdPartyReact.Google.init(),
                        ThirdPartyReact.Apple.init(),
                    ],
                },
            }),
            PasswordlessReact.init({
                contactMethod: "EMAIL_OR_PHONE",
            }),
            Session.init(),
        ],
        windowHandler: (orig) => {
            return {
                ...orig,
                location: {
                    ...orig.location,
                    getPathName: () => routerInfo.pathName!,
                    assign: (url) => routerInfo.router!.push(url.toString()),
                    setHref: (url) => routerInfo.router!.push(url.toString()),
                },
            };
        },
        // style: `        [data-supertokens~=container] {
        //     --palette-background: 51, 51, 51;
        //     --palette-inputBackground: 41, 41, 41;
        //     --palette-inputBorder: 41, 41, 41;
        //     --palette-textTitle: 255, 255, 255;
        //     --palette-textLabel: 255, 255, 255;
        //     --palette-textPrimary: 255, 255, 255;
        //     --palette-error: 173, 46, 46;
        //     --palette-textInput: 169, 169, 169;
        //     --palette-textLink: 169, 169, 169;
        // }`,
        style: `
         [data-supertokens~=superTokensBranding] {
            display: none;
        }`,
    };
};

export const recipeDetails = {
    docsLink:
        "https://supertokens.com/docs/thirdpartypasswordless/introduction",
};

export const PreBuiltUIList = [
    EmailPasswordPreBuiltUI,
    ThirdPartyPreBuiltUI,
    PasswordlessPreBuiltUI,
];
