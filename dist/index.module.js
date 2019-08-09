import e from "auth0-js";
import t, {
    createContext as r,
    useReducer as o,
    useContext as n
} from "react";
var a = function (e, t) {
        switch (t.type) {
            case "login":
                var r = t.authResult,
                    o = t.user,
                    n = 1e3 * r.expiresIn + (new Date).getTime();
                return "undefined" != typeof localStorage && (localStorage.setItem("access_token", r.accessToken), localStorage.setItem("id_token", r.idToken), localStorage.setItem("expires_at", JSON.stringify(n)), localStorage.setItem("user", JSON.stringify(o))), {
                    user: o,
                    expiresAt: n
                };
            case "logout":
                return "undefined" != typeof localStorage && (localStorage.removeItem("access_token"), localStorage.removeItem("id_token"), localStorage.removeItem("expires_at"), localStorage.removeItem("user")), {
                    user: {},
                    expiresAt: null
                };
            case "error":
                return {
                    user: {}, expiresAt: null, errorType: t.errorType, error: t.error
                };
            default:
                return e
        }
    },
    i = r(null),
    s = function (r) {
        var n = r.children,
            s = r.navigate,
            u = r.auth0_domain,
            l = "undefined" != typeof window ? window.location.protocol + "//" + window.location.host : "http://localhost:8000",
            c = new e.WebAuth(Object.assign({}, {
                domain: u,
                clientID: r.auth0_client_id,
                redirectUri: l + "/auth0_callback",
                audience: "https://" + u + "/api/v2/",
                responseType: "token id_token",
                scope: "openid profile email"
            }, r.auth0_params)),
            p = o(a, {
                user: "undefined" != typeof localStorage ? JSON.parse(localStorage.getItem("user")) : {},
                expiresAt: "undefined" != typeof localStorage ? JSON.parse(localStorage.getItem("expires_at")) : null
            });
        return t.createElement(i.Provider, {
            value: {
                state: p[0],
                dispatch: p[1],
                auth0: c,
                navigate: s
            }
        }, n)
    },
    u = function () {
        var e = n(i),
            t = e.state,
            r = e.dispatch,
            o = e.auth0,
            a = e.navigate;
        return {
            isAuthenticated: function () {
                return t.expiresAt && (new Date).getTime() < t.expiresAt
            },
            user: t.user,
            userId: t.user ? t.user.sub : null,
            login: function () {
                o.authorize()
            },
            logout: function () {
                r({
                    type: "logout"
                }), a("/")
            },
            handleAuthentication: function () {
                "undefined" != typeof window && o.parseHash(function (e, t) {
                    t && t.accessToken && t.idToken ? function (e) {
                        o.client.userInfo(e.accessToken, function (t, o) {
                            t ? (console.error(t), r({
                                type: "error",
                                errorType: "userInfo",
                                error: t
                            })) : r({
                                type: "login",
                                authResult: e,
                                user: o
                            }), a("/")
                        })
                    }(t) : e && (console.error(e), r({
                        type: "error",
                        error: e,
                        errorType: "authResult"
                    }))
                })
            }
        }
    };
export {
    s as AuthProvider, u as useAuth
};
//# sourceMappingURL=index.module.js.map