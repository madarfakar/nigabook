; /*FB_PKG_DELIM*/

__d("Nectar", ["Env", "getContextualParent"], (function(a, b, c, d, e, f) {
    var g;

    function h(a) {
        a.nctr || (a.nctr = {})
    }

    function i(a) {
        if ((g || (g = b("Env"))).module || !a) return (g || (g = b("Env"))).module;
        var c = {
                fbpage_fan_confirm: !0,
                photos_snowlift: !0
            },
            d;
        while (a && a.getAttribute) {
            var e = a.getAttribute("id");
            if (e != null && e.startsWith("pagelet_")) return e;
            !d && c[e] && (d = e);
            a = b("getContextualParent")(a)
        }
        return d
    }
    a = {
        addModuleData: function(a, b) {
            b = i(b);
            b && (h(a), a.nctr._mod = b)
        }
    };
    e.exports = a
}), null);
__d("AsyncRequestNectarLogging", ["AsyncRequest", "Nectar"], (function(a, b, c, d, e, f, g) {
    Object.assign(c("AsyncRequest").prototype, {
        setNectarModuleData: function(a) {
            this.method == "POST" && d("Nectar").addModuleData(this.data, a)
        }
    })
}), 34);
__d("DamerauLevenshtein", [], (function(a, b, c, d, e, f) {
    function a(a, b) {
        if (a.length === 0) return b.length;
        if (b.length === 0) return a.length;
        if (a === b) return 0;
        var c, d, e = [];
        e[0] = [];
        e[1] = [];
        e[2] = [];
        for (d = 0; d <= b.length; d++) e[0][d] = d;
        for (c = 1; c <= a.length; c++)
            for (d = 1; d <= b.length; d++) {
                e[c % 3][0] = c;
                var f = a.charAt(c - 1) === b.charAt(d - 1) ? 0 : 1;
                e[c % 3][d] = Math.min(e[(c - 1) % 3][d] + 1, e[c % 3][d - 1] + 1, e[(c - 1) % 3][d - 1] + f);
                c > 1 && d > 1 && a.charAt(c - 1) == b.charAt(d - 2) && a.charAt(c - 2) == b.charAt(d - 1) && (e[c % 3][d] = Math.min(e[c % 3][d], e[(c - 2) % 3][d - 2] + f))
            }
        return e[a.length % 3][b.length]
    }
    f.DamerauLevenshteinDistance = a
}), 66);
__d("BrowserPrefillLogging", ["DamerauLevenshtein", "ge"], (function(a, b, c, d, e, f) {
    "use strict";
    var g = {
        initContactpointFieldLogging: function(a) {
            g.contactpointFieldID = a.contactpointFieldID;
            g._updateContactpoint();
            g.serverPrefillContactpoint = a.serverPrefill;
            a = b("ge")(g.contactpointFieldID);
            if (a == null) return;
            a.addEventListener("input", g._mayLogContactpointPrefillViaDropdown.bind(g));
            window.addEventListener("load", g._mayLogContactpointPrefillOnload.bind(g));
            return
        },
        registerCallback: function(a) {
            g.regeisteredCallbacks = g.regeisteredCallbacks || [], g.regeisteredCallbacks.push(a)
        },
        _invokeCallbacks: function(a, b) {
            if (g.regeisteredCallbacks == null || g.regeisteredCallbacks.size === 0) return;
            g.regeisteredCallbacks.forEach(function(c) {
                c(a, b)
            })
        },
        initPasswordFieldLogging: function(a) {
            g.passwordFieldID = a.passwordFieldID;
            g._updatePassword();
            a = b("ge")(g.passwordFieldID);
            if (a == null) return;
            a.addEventListener("input", g._mayLogPasswordPrefillViaDropdown.bind(g));
            window.addEventListener("load", g._mayLogPasswordPrefillOnload.bind(g))
        },
        updatePrefill: function(a, c, d) {
            var e, f = (e = b("ge"))("prefill_source"),
                g = e("prefill_type"),
                h = e("first_prefill_source"),
                i = e("first_prefill_type"),
                j = e("had_cp_prefilled"),
                k = e("had_password_prefilled");
            e = e("prefill_contact_point");
            f != null && (f.value = c);
            g != null && (g.value = d);
            e != null && a != null && (e.value = a);
            i != null && (i.value == null || i.value == "") && (i.value = d);
            h != null && (h.value == null || h.value == "") && (h.value = c);
            j != null && (j.value == null || j.value === "false") && d === "contact_point" && (j.value = "true");
            k != null && (k.value == null || k.value === "false") && d === "password" && (k.value = "true")
        },
        _mayLogContactpointPrefillOnload: function() {
            g._updateContactpoint();
            if (g.previousContactpoint == null || g.previousContactpoint === "") return;
            var a = g.previousContactpoint === g.serverPrefillContactpoint ? "server_prefill" : "browser_onload";
            g._logBrowserPrefill(a, "contact_point");
            g._invokeCallbacks(a, "contact_point")
        },
        _mayLogPasswordPrefillOnload: function() {
            g._updatePassword();
            if (g.previousPassword == null || g.previousPassword === "") return;
            g._logBrowserPrefill("browser_onload", "password");
            g._invokeCallbacks("browser_onload", "password")
        },
        _mayLogContactpointPrefillViaDropdown: function() {
            var a = b("ge")(g.contactpointFieldID);
            if (a == null || a.value == null) return;
            if (g._isBrowserPrefill(g.previousContactpoint, a.value) === !1) {
                g._updateContactpoint();
                return
            }
            g._updateContactpoint();
            g._logBrowserPrefill("browser_dropdown", "contact_point");
            g._invokeCallbacks("browser_dropdown", "contact_point")
        },
        _mayLogPasswordPrefillViaDropdown: function() {
            var a = b("ge")(g.passwordFieldID);
            if (a == null || a.value == null) return;
            if (g._isBrowserPrefill(g.previousPassword, a.value) === !1) {
                g._updatePassword();
                return
            }
            g._updatePassword();
            g._logBrowserPrefill("browser_dropdown", "password");
            g._invokeCallbacks("browser_dropdown", "password")
        },
        _isBrowserPrefill: function(a, c) {
            if (c === "") return !1;
            if (c === a) return !1;
            if (c.length === 1 || a.length === c.length + 1 || c.length === a.length + 1) return !1;
            var d = b("DamerauLevenshtein").DamerauLevenshteinDistance(c, a);
            return d === a.length - c.length ? !1 : !0
        },
        _updateContactpoint: function() {
            var a = b("ge")(g.contactpointFieldID);
            g.previousContactpoint = a != null && a.value != null ? a.value : ""
        },
        _updatePassword: function() {
            var a = b("ge")(g.passwordFieldID);
            g.previousPassword = a != null && a.value != null ? a.value : ""
        },
        _logBrowserPrefill: function(a, b) {
            var c = null;
            b === "contact_point" && (c = g.previousContactpoint);
            a !== "server_prefill" && g.updatePrefill(c, a, b)
        }
    };
    e.exports = g
}), null);
/**
 * License: https://www.facebook.com/legal/license/OKBVmODmb-W/
 */
__d("tweetnacl-1.0.1", [], (function(a, b, c, d, e, f) {
    "use strict";
    b = {};
    var g = {
        exports: b
    };

    function h() {
        (function(a) {
            var b = function(a) {
                    var b, c = new Float64Array(16);
                    if (a)
                        for (b = 0; b < a.length; b++) c[b] = a[b];
                    return c
                },
                c = function() {
                    throw new Error("no PRNG")
                },
                d = new Uint8Array(16),
                e = new Uint8Array(32);
            e[0] = 9;
            var f = b(),
                g = b([1]),
                h = b([56129, 1]),
                i = b([30883, 4953, 19914, 30187, 55467, 16705, 2637, 112, 59544, 30585, 16505, 36039, 65139, 11119, 27886, 20995]),
                j = b([61785, 9906, 39828, 60374, 45398, 33411, 5274, 224, 53552, 61171, 33010, 6542, 64743, 22239, 55772, 9222]),
                k = b([54554, 36645, 11616, 51542, 42930, 38181, 51040, 26924, 56412, 64982, 57905, 49316, 21502, 52590, 14035, 8553]),
                l = b([26200, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214]),
                m = b([41136, 18958, 6951, 50414, 58488, 44335, 6150, 12099, 55207, 15867, 153, 11085, 57099, 20417, 9344, 11139]);

            function n(a, b, c, d) {
                a[b] = c >> 24 & 255, a[b + 1] = c >> 16 & 255, a[b + 2] = c >> 8 & 255, a[b + 3] = c & 255, a[b + 4] = d >> 24 & 255, a[b + 5] = d >> 16 & 255, a[b + 6] = d >> 8 & 255, a[b + 7] = d & 255
            }

            function o(a, b, c, d, e) {
                var f, g = 0;
                for (f = 0; f < e; f++) g |= a[b + f] ^ c[d + f];
                return (1 & g - 1 >>> 8) - 1
            }

            function p(a, b, c, d) {
                return o(a, b, c, d, 16)
            }

            function q(a, b, c, d) {
                return o(a, b, c, d, 32)
            }

            function r(a, b, c, d) {
                var e = d[0] & 255 | (d[1] & 255) << 8 | (d[2] & 255) << 16 | (d[3] & 255) << 24,
                    f = c[0] & 255 | (c[1] & 255) << 8 | (c[2] & 255) << 16 | (c[3] & 255) << 24,
                    g = c[4] & 255 | (c[5] & 255) << 8 | (c[6] & 255) << 16 | (c[7] & 255) << 24,
                    h = c[8] & 255 | (c[9] & 255) << 8 | (c[10] & 255) << 16 | (c[11] & 255) << 24,
                    i = c[12] & 255 | (c[13] & 255) << 8 | (c[14] & 255) << 16 | (c[15] & 255) << 24,
                    j = d[4] & 255 | (d[5] & 255) << 8 | (d[6] & 255) << 16 | (d[7] & 255) << 24,
                    k = b[0] & 255 | (b[1] & 255) << 8 | (b[2] & 255) << 16 | (b[3] & 255) << 24,
                    l = b[4] & 255 | (b[5] & 255) << 8 | (b[6] & 255) << 16 | (b[7] & 255) << 24,
                    m = b[8] & 255 | (b[9] & 255) << 8 | (b[10] & 255) << 16 | (b[11] & 255) << 24;
                b = b[12] & 255 | (b[13] & 255) << 8 | (b[14] & 255) << 16 | (b[15] & 255) << 24;
                var n = d[8] & 255 | (d[9] & 255) << 8 | (d[10] & 255) << 16 | (d[11] & 255) << 24,
                    o = c[16] & 255 | (c[17] & 255) << 8 | (c[18] & 255) << 16 | (c[19] & 255) << 24,
                    p = c[20] & 255 | (c[21] & 255) << 8 | (c[22] & 255) << 16 | (c[23] & 255) << 24,
                    q = c[24] & 255 | (c[25] & 255) << 8 | (c[26] & 255) << 16 | (c[27] & 255) << 24;
                c = c[28] & 255 | (c[29] & 255) << 8 | (c[30] & 255) << 16 | (c[31] & 255) << 24;
                d = d[12] & 255 | (d[13] & 255) << 8 | (d[14] & 255) << 16 | (d[15] & 255) << 24;
                var r = e,
                    s = f,
                    t = g,
                    u = h,
                    v = i,
                    w = j,
                    x = k,
                    y = l,
                    z = m,
                    A = b,
                    B = n,
                    C = o,
                    D = p,
                    E = q,
                    F = c,
                    G = d,
                    H;
                for (var I = 0; I < 20; I += 2) H = r + D | 0, v ^= H << 7 | H >>> 32 - 7, H = v + r | 0, z ^= H << 9 | H >>> 32 - 9, H = z + v | 0, D ^= H << 13 | H >>> 32 - 13, H = D + z | 0, r ^= H << 18 | H >>> 32 - 18, H = w + s | 0, A ^= H << 7 | H >>> 32 - 7, H = A + w | 0, E ^= H << 9 | H >>> 32 - 9, H = E + A | 0, s ^= H << 13 | H >>> 32 - 13, H = s + E | 0, w ^= H << 18 | H >>> 32 - 18, H = B + x | 0, F ^= H << 7 | H >>> 32 - 7, H = F + B | 0, t ^= H << 9 | H >>> 32 - 9, H = t + F | 0, x ^= H << 13 | H >>> 32 - 13, H = x + t | 0, B ^= H << 18 | H >>> 32 - 18, H = G + C | 0, u ^= H << 7 | H >>> 32 - 7, H = u + G | 0, y ^= H << 9 | H >>> 32 - 9, H = y + u | 0, C ^= H << 13 | H >>> 32 - 13, H = C + y | 0, G ^= H << 18 | H >>> 32 - 18, H = r + u | 0, s ^= H << 7 | H >>> 32 - 7, H = s + r | 0, t ^= H << 9 | H >>> 32 - 9, H = t + s | 0, u ^= H << 13 | H >>> 32 - 13, H = u + t | 0, r ^= H << 18 | H >>> 32 - 18, H = w + v | 0, x ^= H << 7 | H >>> 32 - 7, H = x + w | 0, y ^= H << 9 | H >>> 32 - 9, H = y + x | 0, v ^= H << 13 | H >>> 32 - 13, H = v + y | 0, w ^= H << 18 | H >>> 32 - 18, H = B + A | 0, C ^= H << 7 | H >>> 32 - 7, H = C + B | 0, z ^= H << 9 | H >>> 32 - 9, H = z + C | 0, A ^= H << 13 | H >>> 32 - 13, H = A + z | 0, B ^= H << 18 | H >>> 32 - 18, H = G + F | 0, D ^= H << 7 | H >>> 32 - 7, H = D + G | 0, E ^= H << 9 | H >>> 32 - 9, H = E + D | 0, F ^= H << 13 | H >>> 32 - 13, H = F + E | 0, G ^= H << 18 | H >>> 32 - 18;
                r = r + e | 0;
                s = s + f | 0;
                t = t + g | 0;
                u = u + h | 0;
                v = v + i | 0;
                w = w + j | 0;
                x = x + k | 0;
                y = y + l | 0;
                z = z + m | 0;
                A = A + b | 0;
                B = B + n | 0;
                C = C + o | 0;
                D = D + p | 0;
                E = E + q | 0;
                F = F + c | 0;
                G = G + d | 0;
                a[0] = r >>> 0 & 255;
                a[1] = r >>> 8 & 255;
                a[2] = r >>> 16 & 255;
                a[3] = r >>> 24 & 255;
                a[4] = s >>> 0 & 255;
                a[5] = s >>> 8 & 255;
                a[6] = s >>> 16 & 255;
                a[7] = s >>> 24 & 255;
                a[8] = t >>> 0 & 255;
                a[9] = t >>> 8 & 255;
                a[10] = t >>> 16 & 255;
                a[11] = t >>> 24 & 255;
                a[12] = u >>> 0 & 255;
                a[13] = u >>> 8 & 255;
                a[14] = u >>> 16 & 255;
                a[15] = u >>> 24 & 255;
                a[16] = v >>> 0 & 255;
                a[17] = v >>> 8 & 255;
                a[18] = v >>> 16 & 255;
                a[19] = v >>> 24 & 255;
                a[20] = w >>> 0 & 255;
                a[21] = w >>> 8 & 255;
                a[22] = w >>> 16 & 255;
                a[23] = w >>> 24 & 255;
                a[24] = x >>> 0 & 255;
                a[25] = x >>> 8 & 255;
                a[26] = x >>> 16 & 255;
                a[27] = x >>> 24 & 255;
                a[28] = y >>> 0 & 255;
                a[29] = y >>> 8 & 255;
                a[30] = y >>> 16 & 255;
                a[31] = y >>> 24 & 255;
                a[32] = z >>> 0 & 255;
                a[33] = z >>> 8 & 255;
                a[34] = z >>> 16 & 255;
                a[35] = z >>> 24 & 255;
                a[36] = A >>> 0 & 255;
                a[37] = A >>> 8 & 255;
                a[38] = A >>> 16 & 255;
                a[39] = A >>> 24 & 255;
                a[40] = B >>> 0 & 255;
                a[41] = B >>> 8 & 255;
                a[42] = B >>> 16 & 255;
                a[43] = B >>> 24 & 255;
                a[44] = C >>> 0 & 255;
                a[45] = C >>> 8 & 255;
                a[46] = C >>> 16 & 255;
                a[47] = C >>> 24 & 255;
                a[48] = D >>> 0 & 255;
                a[49] = D >>> 8 & 255;
                a[50] = D >>> 16 & 255;
                a[51] = D >>> 24 & 255;
                a[52] = E >>> 0 & 255;
                a[53] = E >>> 8 & 255;
                a[54] = E >>> 16 & 255;
                a[55] = E >>> 24 & 255;
                a[56] = F >>> 0 & 255;
                a[57] = F >>> 8 & 255;
                a[58] = F >>> 16 & 255;
                a[59] = F >>> 24 & 255;
                a[60] = G >>> 0 & 255;
                a[61] = G >>> 8 & 255;
                a[62] = G >>> 16 & 255;
                a[63] = G >>> 24 & 255
            }

            function s(a, b, c, d) {
                var e = d[0] & 255 | (d[1] & 255) << 8 | (d[2] & 255) << 16 | (d[3] & 255) << 24,
                    f = c[0] & 255 | (c[1] & 255) << 8 | (c[2] & 255) << 16 | (c[3] & 255) << 24,
                    g = c[4] & 255 | (c[5] & 255) << 8 | (c[6] & 255) << 16 | (c[7] & 255) << 24,
                    h = c[8] & 255 | (c[9] & 255) << 8 | (c[10] & 255) << 16 | (c[11] & 255) << 24,
                    i = c[12] & 255 | (c[13] & 255) << 8 | (c[14] & 255) << 16 | (c[15] & 255) << 24,
                    j = d[4] & 255 | (d[5] & 255) << 8 | (d[6] & 255) << 16 | (d[7] & 255) << 24,
                    k = b[0] & 255 | (b[1] & 255) << 8 | (b[2] & 255) << 16 | (b[3] & 255) << 24,
                    l = b[4] & 255 | (b[5] & 255) << 8 | (b[6] & 255) << 16 | (b[7] & 255) << 24,
                    m = b[8] & 255 | (b[9] & 255) << 8 | (b[10] & 255) << 16 | (b[11] & 255) << 24;
                b = b[12] & 255 | (b[13] & 255) << 8 | (b[14] & 255) << 16 | (b[15] & 255) << 24;
                var n = d[8] & 255 | (d[9] & 255) << 8 | (d[10] & 255) << 16 | (d[11] & 255) << 24,
                    o = c[16] & 255 | (c[17] & 255) << 8 | (c[18] & 255) << 16 | (c[19] & 255) << 24,
                    p = c[20] & 255 | (c[21] & 255) << 8 | (c[22] & 255) << 16 | (c[23] & 255) << 24,
                    q = c[24] & 255 | (c[25] & 255) << 8 | (c[26] & 255) << 16 | (c[27] & 255) << 24;
                c = c[28] & 255 | (c[29] & 255) << 8 | (c[30] & 255) << 16 | (c[31] & 255) << 24;
                d = d[12] & 255 | (d[13] & 255) << 8 | (d[14] & 255) << 16 | (d[15] & 255) << 24;
                e = e;
                f = f;
                g = g;
                h = h;
                i = i;
                j = j;
                k = k;
                l = l;
                m = m;
                b = b;
                n = n;
                o = o;
                p = p;
                q = q;
                c = c;
                d = d;
                var r;
                for (var s = 0; s < 20; s += 2) r = e + p | 0, i ^= r << 7 | r >>> 32 - 7, r = i + e | 0, m ^= r << 9 | r >>> 32 - 9, r = m + i | 0, p ^= r << 13 | r >>> 32 - 13, r = p + m | 0, e ^= r << 18 | r >>> 32 - 18, r = j + f | 0, b ^= r << 7 | r >>> 32 - 7, r = b + j | 0, q ^= r << 9 | r >>> 32 - 9, r = q + b | 0, f ^= r << 13 | r >>> 32 - 13, r = f + q | 0, j ^= r << 18 | r >>> 32 - 18, r = n + k | 0, c ^= r << 7 | r >>> 32 - 7, r = c + n | 0, g ^= r << 9 | r >>> 32 - 9, r = g + c | 0, k ^= r << 13 | r >>> 32 - 13, r = k + g | 0, n ^= r << 18 | r >>> 32 - 18, r = d + o | 0, h ^= r << 7 | r >>> 32 - 7, r = h + d | 0, l ^= r << 9 | r >>> 32 - 9, r = l + h | 0, o ^= r << 13 | r >>> 32 - 13, r = o + l | 0, d ^= r << 18 | r >>> 32 - 18, r = e + h | 0, f ^= r << 7 | r >>> 32 - 7, r = f + e | 0, g ^= r << 9 | r >>> 32 - 9, r = g + f | 0, h ^= r << 13 | r >>> 32 - 13, r = h + g | 0, e ^= r << 18 | r >>> 32 - 18, r = j + i | 0, k ^= r << 7 | r >>> 32 - 7, r = k + j | 0, l ^= r << 9 | r >>> 32 - 9, r = l + k | 0, i ^= r << 13 | r >>> 32 - 13, r = i + l | 0, j ^= r << 18 | r >>> 32 - 18, r = n + b | 0, o ^= r << 7 | r >>> 32 - 7, r = o + n | 0, m ^= r << 9 | r >>> 32 - 9, r = m + o | 0, b ^= r << 13 | r >>> 32 - 13, r = b + m | 0, n ^= r << 18 | r >>> 32 - 18, r = d + c | 0, p ^= r << 7 | r >>> 32 - 7, r = p + d | 0, q ^= r << 9 | r >>> 32 - 9, r = q + p | 0, c ^= r << 13 | r >>> 32 - 13, r = c + q | 0, d ^= r << 18 | r >>> 32 - 18;
                a[0] = e >>> 0 & 255;
                a[1] = e >>> 8 & 255;
                a[2] = e >>> 16 & 255;
                a[3] = e >>> 24 & 255;
                a[4] = j >>> 0 & 255;
                a[5] = j >>> 8 & 255;
                a[6] = j >>> 16 & 255;
                a[7] = j >>> 24 & 255;
                a[8] = n >>> 0 & 255;
                a[9] = n >>> 8 & 255;
                a[10] = n >>> 16 & 255;
                a[11] = n >>> 24 & 255;
                a[12] = d >>> 0 & 255;
                a[13] = d >>> 8 & 255;
                a[14] = d >>> 16 & 255;
                a[15] = d >>> 24 & 255;
                a[16] = k >>> 0 & 255;
                a[17] = k >>> 8 & 255;
                a[18] = k >>> 16 & 255;
                a[19] = k >>> 24 & 255;
                a[20] = l >>> 0 & 255;
                a[21] = l >>> 8 & 255;
                a[22] = l >>> 16 & 255;
                a[23] = l >>> 24 & 255;
                a[24] = m >>> 0 & 255;
                a[25] = m >>> 8 & 255;
                a[26] = m >>> 16 & 255;
                a[27] = m >>> 24 & 255;
                a[28] = b >>> 0 & 255;
                a[29] = b >>> 8 & 255;
                a[30] = b >>> 16 & 255;
                a[31] = b >>> 24 & 255
            }

            function t(a, b, c, d) {
                r(a, b, c, d)
            }

            function u(a, b, c, d) {
                s(a, b, c, d)
            }
            var v = new Uint8Array([101, 120, 112, 97, 110, 100, 32, 51, 50, 45, 98, 121, 116, 101, 32, 107]);

            function w(a, b, c, d, e, f, g) {
                var h = new Uint8Array(16),
                    i = new Uint8Array(64),
                    j;
                for (j = 0; j < 16; j++) h[j] = 0;
                for (j = 0; j < 8; j++) h[j] = f[j];
                while (e >= 64) {
                    t(i, h, g, v);
                    for (j = 0; j < 64; j++) a[b + j] = c[d + j] ^ i[j];
                    f = 1;
                    for (j = 8; j < 16; j++) f = f + (h[j] & 255) | 0, h[j] = f & 255, f >>>= 8;
                    e -= 64;
                    b += 64;
                    d += 64
                }
                if (e > 0) {
                    t(i, h, g, v);
                    for (j = 0; j < e; j++) a[b + j] = c[d + j] ^ i[j]
                }
                return 0
            }

            function x(a, b, c, d, e) {
                var f = new Uint8Array(16),
                    g = new Uint8Array(64),
                    h;
                for (h = 0; h < 16; h++) f[h] = 0;
                for (h = 0; h < 8; h++) f[h] = d[h];
                while (c >= 64) {
                    t(g, f, e, v);
                    for (h = 0; h < 64; h++) a[b + h] = g[h];
                    d = 1;
                    for (h = 8; h < 16; h++) d = d + (f[h] & 255) | 0, f[h] = d & 255, d >>>= 8;
                    c -= 64;
                    b += 64
                }
                if (c > 0) {
                    t(g, f, e, v);
                    for (h = 0; h < c; h++) a[b + h] = g[h]
                }
                return 0
            }

            function y(a, b, c, d, e) {
                var f = new Uint8Array(32);
                u(f, d, e, v);
                e = new Uint8Array(8);
                for (var g = 0; g < 8; g++) e[g] = d[g + 16];
                return x(a, b, c, e, f)
            }

            function z(a, b, c, d, e, f, g) {
                var h = new Uint8Array(32);
                u(h, f, g, v);
                g = new Uint8Array(8);
                for (var i = 0; i < 8; i++) g[i] = f[i + 16];
                return w(a, b, c, d, e, g, h)
            }
            var A = function(a) {
                this.buffer = new Uint8Array(16);
                this.r = new Uint16Array(10);
                this.h = new Uint16Array(10);
                this.pad = new Uint16Array(8);
                this.leftover = 0;
                this.fin = 0;
                var b, c;
                b = a[0] & 255 | (a[1] & 255) << 8;
                this.r[0] = b & 8191;
                c = a[2] & 255 | (a[3] & 255) << 8;
                this.r[1] = (b >>> 13 | c << 3) & 8191;
                b = a[4] & 255 | (a[5] & 255) << 8;
                this.r[2] = (c >>> 10 | b << 6) & 7939;
                c = a[6] & 255 | (a[7] & 255) << 8;
                this.r[3] = (b >>> 7 | c << 9) & 8191;
                b = a[8] & 255 | (a[9] & 255) << 8;
                this.r[4] = (c >>> 4 | b << 12) & 255;
                this.r[5] = b >>> 1 & 8190;
                c = a[10] & 255 | (a[11] & 255) << 8;
                this.r[6] = (b >>> 14 | c << 2) & 8191;
                b = a[12] & 255 | (a[13] & 255) << 8;
                this.r[7] = (c >>> 11 | b << 5) & 8065;
                c = a[14] & 255 | (a[15] & 255) << 8;
                this.r[8] = (b >>> 8 | c << 8) & 8191;
                this.r[9] = c >>> 5 & 127;
                this.pad[0] = a[16] & 255 | (a[17] & 255) << 8;
                this.pad[1] = a[18] & 255 | (a[19] & 255) << 8;
                this.pad[2] = a[20] & 255 | (a[21] & 255) << 8;
                this.pad[3] = a[22] & 255 | (a[23] & 255) << 8;
                this.pad[4] = a[24] & 255 | (a[25] & 255) << 8;
                this.pad[5] = a[26] & 255 | (a[27] & 255) << 8;
                this.pad[6] = a[28] & 255 | (a[29] & 255) << 8;
                this.pad[7] = a[30] & 255 | (a[31] & 255) << 8
            };
            A.prototype.blocks = function(a, b, c) {
                var d = this.fin ? 0 : 1 << 11,
                    e, f, g, h, i, j, k, l, m, n, o, p = this.h[0],
                    q = this.h[1],
                    r = this.h[2],
                    s = this.h[3],
                    t = this.h[4],
                    u = this.h[5],
                    v = this.h[6],
                    w = this.h[7],
                    x = this.h[8],
                    y = this.h[9],
                    z = this.r[0],
                    A = this.r[1],
                    B = this.r[2],
                    C = this.r[3],
                    D = this.r[4],
                    E = this.r[5],
                    F = this.r[6],
                    G = this.r[7],
                    H = this.r[8],
                    I = this.r[9];
                while (c >= 16) e = a[b + 0] & 255 | (a[b + 1] & 255) << 8, p += e & 8191, f = a[b + 2] & 255 | (a[b + 3] & 255) << 8, q += (e >>> 13 | f << 3) & 8191, e = a[b + 4] & 255 | (a[b + 5] & 255) << 8, r += (f >>> 10 | e << 6) & 8191, f = a[b + 6] & 255 | (a[b + 7] & 255) << 8, s += (e >>> 7 | f << 9) & 8191, e = a[b + 8] & 255 | (a[b + 9] & 255) << 8, t += (f >>> 4 | e << 12) & 8191, u += e >>> 1 & 8191, f = a[b + 10] & 255 | (a[b + 11] & 255) << 8, v += (e >>> 14 | f << 2) & 8191, e = a[b + 12] & 255 | (a[b + 13] & 255) << 8, w += (f >>> 11 | e << 5) & 8191, f = a[b + 14] & 255 | (a[b + 15] & 255) << 8, x += (e >>> 8 | f << 8) & 8191, y += f >>> 5 | d, e = 0, f = e, f += p * z, f += q * (5 * I), f += r * (5 * H), f += s * (5 * G), f += t * (5 * F), e = f >>> 13, f &= 8191, f += u * (5 * E), f += v * (5 * D), f += w * (5 * C), f += x * (5 * B), f += y * (5 * A), e += f >>> 13, f &= 8191, g = e, g += p * A, g += q * z, g += r * (5 * I), g += s * (5 * H), g += t * (5 * G), e = g >>> 13, g &= 8191, g += u * (5 * F), g += v * (5 * E), g += w * (5 * D), g += x * (5 * C), g += y * (5 * B), e += g >>> 13, g &= 8191, h = e, h += p * B, h += q * A, h += r * z, h += s * (5 * I), h += t * (5 * H), e = h >>> 13, h &= 8191, h += u * (5 * G), h += v * (5 * F), h += w * (5 * E), h += x * (5 * D), h += y * (5 * C), e += h >>> 13, h &= 8191, i = e, i += p * C, i += q * B, i += r * A, i += s * z, i += t * (5 * I), e = i >>> 13, i &= 8191, i += u * (5 * H), i += v * (5 * G), i += w * (5 * F), i += x * (5 * E), i += y * (5 * D), e += i >>> 13, i &= 8191, j = e, j += p * D, j += q * C, j += r * B, j += s * A, j += t * z, e = j >>> 13, j &= 8191, j += u * (5 * I), j += v * (5 * H), j += w * (5 * G), j += x * (5 * F), j += y * (5 * E), e += j >>> 13, j &= 8191, k = e, k += p * E, k += q * D, k += r * C, k += s * B, k += t * A, e = k >>> 13, k &= 8191, k += u * z, k += v * (5 * I), k += w * (5 * H), k += x * (5 * G), k += y * (5 * F), e += k >>> 13, k &= 8191, l = e, l += p * F, l += q * E, l += r * D, l += s * C, l += t * B, e = l >>> 13, l &= 8191, l += u * A, l += v * z, l += w * (5 * I), l += x * (5 * H), l += y * (5 * G), e += l >>> 13, l &= 8191, m = e, m += p * G, m += q * F, m += r * E, m += s * D, m += t * C, e = m >>> 13, m &= 8191, m += u * B, m += v * A, m += w * z, m += x * (5 * I), m += y * (5 * H), e += m >>> 13, m &= 8191, n = e, n += p * H, n += q * G, n += r * F, n += s * E, n += t * D, e = n >>> 13, n &= 8191, n += u * C, n += v * B, n += w * A, n += x * z, n += y * (5 * I), e += n >>> 13, n &= 8191, o = e, o += p * I, o += q * H, o += r * G, o += s * F, o += t * E, e = o >>> 13, o &= 8191, o += u * D, o += v * C, o += w * B, o += x * A, o += y * z, e += o >>> 13, o &= 8191, e = (e << 2) + e | 0, e = e + f | 0, f = e & 8191, e = e >>> 13, g += e, p = f, q = g, r = h, s = i, t = j, u = k, v = l, w = m, x = n, y = o, b += 16, c -= 16;
                this.h[0] = p;
                this.h[1] = q;
                this.h[2] = r;
                this.h[3] = s;
                this.h[4] = t;
                this.h[5] = u;
                this.h[6] = v;
                this.h[7] = w;
                this.h[8] = x;
                this.h[9] = y
            };
            A.prototype.finish = function(a, b) {
                var c = new Uint16Array(10),
                    d, e;
                if (this.leftover) {
                    e = this.leftover;
                    this.buffer[e++] = 1;
                    for (; e < 16; e++) this.buffer[e] = 0;
                    this.fin = 1;
                    this.blocks(this.buffer, 0, 16)
                }
                d = this.h[1] >>> 13;
                this.h[1] &= 8191;
                for (e = 2; e < 10; e++) this.h[e] += d, d = this.h[e] >>> 13, this.h[e] &= 8191;
                this.h[0] += d * 5;
                d = this.h[0] >>> 13;
                this.h[0] &= 8191;
                this.h[1] += d;
                d = this.h[1] >>> 13;
                this.h[1] &= 8191;
                this.h[2] += d;
                c[0] = this.h[0] + 5;
                d = c[0] >>> 13;
                c[0] &= 8191;
                for (e = 1; e < 10; e++) c[e] = this.h[e] + d, d = c[e] >>> 13, c[e] &= 8191;
                c[9] -= 1 << 13;
                d = (d ^ 1) - 1;
                for (e = 0; e < 10; e++) c[e] &= d;
                d = ~d;
                for (e = 0; e < 10; e++) this.h[e] = this.h[e] & d | c[e];
                this.h[0] = (this.h[0] | this.h[1] << 13) & 65535;
                this.h[1] = (this.h[1] >>> 3 | this.h[2] << 10) & 65535;
                this.h[2] = (this.h[2] >>> 6 | this.h[3] << 7) & 65535;
                this.h[3] = (this.h[3] >>> 9 | this.h[4] << 4) & 65535;
                this.h[4] = (this.h[4] >>> 12 | this.h[5] << 1 | this.h[6] << 14) & 65535;
                this.h[5] = (this.h[6] >>> 2 | this.h[7] << 11) & 65535;
                this.h[6] = (this.h[7] >>> 5 | this.h[8] << 8) & 65535;
                this.h[7] = (this.h[8] >>> 8 | this.h[9] << 5) & 65535;
                c = this.h[0] + this.pad[0];
                this.h[0] = c & 65535;
                for (e = 1; e < 8; e++) c = (this.h[e] + this.pad[e] | 0) + (c >>> 16) | 0, this.h[e] = c & 65535;
                a[b + 0] = this.h[0] >>> 0 & 255;
                a[b + 1] = this.h[0] >>> 8 & 255;
                a[b + 2] = this.h[1] >>> 0 & 255;
                a[b + 3] = this.h[1] >>> 8 & 255;
                a[b + 4] = this.h[2] >>> 0 & 255;
                a[b + 5] = this.h[2] >>> 8 & 255;
                a[b + 6] = this.h[3] >>> 0 & 255;
                a[b + 7] = this.h[3] >>> 8 & 255;
                a[b + 8] = this.h[4] >>> 0 & 255;
                a[b + 9] = this.h[4] >>> 8 & 255;
                a[b + 10] = this.h[5] >>> 0 & 255;
                a[b + 11] = this.h[5] >>> 8 & 255;
                a[b + 12] = this.h[6] >>> 0 & 255;
                a[b + 13] = this.h[6] >>> 8 & 255;
                a[b + 14] = this.h[7] >>> 0 & 255;
                a[b + 15] = this.h[7] >>> 8 & 255
            };
            A.prototype.update = function(a, b, c) {
                var d, e;
                if (this.leftover) {
                    e = 16 - this.leftover;
                    e > c && (e = c);
                    for (d = 0; d < e; d++) this.buffer[this.leftover + d] = a[b + d];
                    c -= e;
                    b += e;
                    this.leftover += e;
                    if (this.leftover < 16) return;
                    this.blocks(this.buffer, 0, 16);
                    this.leftover = 0
                }
                c >= 16 && (e = c - c % 16, this.blocks(a, b, e), b += e, c -= e);
                if (c) {
                    for (d = 0; d < c; d++) this.buffer[this.leftover + d] = a[b + d];
                    this.leftover += c
                }
            };

            function B(a, b, c, d, e, f) {
                f = new A(f);
                f.update(c, d, e);
                f.finish(a, b);
                return 0
            }

            function C(a, b, c, d, e, f) {
                var g = new Uint8Array(16);
                B(g, 0, c, d, e, f);
                return p(a, b, g, 0)
            }

            function D(a, b, c, d, e) {
                if (c < 32) return -1;
                z(a, 0, b, 0, c, d, e);
                B(a, 16, a, 32, c - 32, a);
                for (b = 0; b < 16; b++) a[b] = 0;
                return 0
            }

            function E(a, b, c, d, e) {
                var f = new Uint8Array(32);
                if (c < 32) return -1;
                y(f, 0, 32, d, e);
                if (C(b, 16, b, 32, c - 32, f) !== 0) return -1;
                z(a, 0, b, 0, c, d, e);
                for (f = 0; f < 32; f++) a[f] = 0;
                return 0
            }

            function F(a, b) {
                var c;
                for (c = 0; c < 16; c++) a[c] = b[c] | 0
            }

            function G(a) {
                var b, c, d = 1;
                for (b = 0; b < 16; b++) c = a[b] + d + 65535, d = Math.floor(c / 65536), a[b] = c - d * 65536;
                a[0] += d - 1 + 37 * (d - 1)
            }

            function H(a, b, c) {
                var d;
                c = ~(c - 1);
                for (var e = 0; e < 16; e++) d = c & (a[e] ^ b[e]), a[e] ^= d, b[e] ^= d
            }

            function I(a, c) {
                var d, e, f = b(),
                    g = b();
                for (d = 0; d < 16; d++) g[d] = c[d];
                G(g);
                G(g);
                G(g);
                for (c = 0; c < 2; c++) {
                    f[0] = g[0] - 65517;
                    for (d = 1; d < 15; d++) f[d] = g[d] - 65535 - (f[d - 1] >> 16 & 1), f[d - 1] &= 65535;
                    f[15] = g[15] - 32767 - (f[14] >> 16 & 1);
                    e = f[15] >> 16 & 1;
                    f[14] &= 65535;
                    H(g, f, 1 - e)
                }
                for (d = 0; d < 16; d++) a[2 * d] = g[d] & 255, a[2 * d + 1] = g[d] >> 8
            }

            function J(a, b) {
                var c = new Uint8Array(32),
                    d = new Uint8Array(32);
                I(c, a);
                I(d, b);
                return q(c, 0, d, 0)
            }

            function K(a) {
                var b = new Uint8Array(32);
                I(b, a);
                return b[0] & 1
            }

            function L(a, b) {
                var c;
                for (c = 0; c < 16; c++) a[c] = b[2 * c] + (b[2 * c + 1] << 8);
                a[15] &= 32767
            }

            function M(a, b, c) {
                for (var d = 0; d < 16; d++) a[d] = b[d] + c[d]
            }

            function N(a, b, c) {
                for (var d = 0; d < 16; d++) a[d] = b[d] - c[d]
            }

            function O(a, b, c) {
                var d, e = 0,
                    f = 0,
                    g = 0,
                    h = 0,
                    i = 0,
                    j = 0,
                    k = 0,
                    l = 0,
                    m = 0,
                    n = 0,
                    o = 0,
                    p = 0,
                    q = 0,
                    r = 0,
                    s = 0,
                    t = 0,
                    u = 0,
                    v = 0,
                    w = 0,
                    x = 0,
                    y = 0,
                    z = 0,
                    A = 0,
                    B = 0,
                    C = 0,
                    D = 0,
                    E = 0,
                    F = 0,
                    G = 0,
                    H = 0,
                    I = 0,
                    J = c[0],
                    K = c[1],
                    L = c[2],
                    M = c[3],
                    N = c[4],
                    O = c[5],
                    P = c[6],
                    Q = c[7],
                    R = c[8],
                    S = c[9],
                    T = c[10],
                    U = c[11],
                    V = c[12],
                    W = c[13],
                    X = c[14];
                c = c[15];
                d = b[0];
                e += d * J;
                f += d * K;
                g += d * L;
                h += d * M;
                i += d * N;
                j += d * O;
                k += d * P;
                l += d * Q;
                m += d * R;
                n += d * S;
                o += d * T;
                p += d * U;
                q += d * V;
                r += d * W;
                s += d * X;
                t += d * c;
                d = b[1];
                f += d * J;
                g += d * K;
                h += d * L;
                i += d * M;
                j += d * N;
                k += d * O;
                l += d * P;
                m += d * Q;
                n += d * R;
                o += d * S;
                p += d * T;
                q += d * U;
                r += d * V;
                s += d * W;
                t += d * X;
                u += d * c;
                d = b[2];
                g += d * J;
                h += d * K;
                i += d * L;
                j += d * M;
                k += d * N;
                l += d * O;
                m += d * P;
                n += d * Q;
                o += d * R;
                p += d * S;
                q += d * T;
                r += d * U;
                s += d * V;
                t += d * W;
                u += d * X;
                v += d * c;
                d = b[3];
                h += d * J;
                i += d * K;
                j += d * L;
                k += d * M;
                l += d * N;
                m += d * O;
                n += d * P;
                o += d * Q;
                p += d * R;
                q += d * S;
                r += d * T;
                s += d * U;
                t += d * V;
                u += d * W;
                v += d * X;
                w += d * c;
                d = b[4];
                i += d * J;
                j += d * K;
                k += d * L;
                l += d * M;
                m += d * N;
                n += d * O;
                o += d * P;
                p += d * Q;
                q += d * R;
                r += d * S;
                s += d * T;
                t += d * U;
                u += d * V;
                v += d * W;
                w += d * X;
                x += d * c;
                d = b[5];
                j += d * J;
                k += d * K;
                l += d * L;
                m += d * M;
                n += d * N;
                o += d * O;
                p += d * P;
                q += d * Q;
                r += d * R;
                s += d * S;
                t += d * T;
                u += d * U;
                v += d * V;
                w += d * W;
                x += d * X;
                y += d * c;
                d = b[6];
                k += d * J;
                l += d * K;
                m += d * L;
                n += d * M;
                o += d * N;
                p += d * O;
                q += d * P;
                r += d * Q;
                s += d * R;
                t += d * S;
                u += d * T;
                v += d * U;
                w += d * V;
                x += d * W;
                y += d * X;
                z += d * c;
                d = b[7];
                l += d * J;
                m += d * K;
                n += d * L;
                o += d * M;
                p += d * N;
                q += d * O;
                r += d * P;
                s += d * Q;
                t += d * R;
                u += d * S;
                v += d * T;
                w += d * U;
                x += d * V;
                y += d * W;
                z += d * X;
                A += d * c;
                d = b[8];
                m += d * J;
                n += d * K;
                o += d * L;
                p += d * M;
                q += d * N;
                r += d * O;
                s += d * P;
                t += d * Q;
                u += d * R;
                v += d * S;
                w += d * T;
                x += d * U;
                y += d * V;
                z += d * W;
                A += d * X;
                B += d * c;
                d = b[9];
                n += d * J;
                o += d * K;
                p += d * L;
                q += d * M;
                r += d * N;
                s += d * O;
                t += d * P;
                u += d * Q;
                v += d * R;
                w += d * S;
                x += d * T;
                y += d * U;
                z += d * V;
                A += d * W;
                B += d * X;
                C += d * c;
                d = b[10];
                o += d * J;
                p += d * K;
                q += d * L;
                r += d * M;
                s += d * N;
                t += d * O;
                u += d * P;
                v += d * Q;
                w += d * R;
                x += d * S;
                y += d * T;
                z += d * U;
                A += d * V;
                B += d * W;
                C += d * X;
                D += d * c;
                d = b[11];
                p += d * J;
                q += d * K;
                r += d * L;
                s += d * M;
                t += d * N;
                u += d * O;
                v += d * P;
                w += d * Q;
                x += d * R;
                y += d * S;
                z += d * T;
                A += d * U;
                B += d * V;
                C += d * W;
                D += d * X;
                E += d * c;
                d = b[12];
                q += d * J;
                r += d * K;
                s += d * L;
                t += d * M;
                u += d * N;
                v += d * O;
                w += d * P;
                x += d * Q;
                y += d * R;
                z += d * S;
                A += d * T;
                B += d * U;
                C += d * V;
                D += d * W;
                E += d * X;
                F += d * c;
                d = b[13];
                r += d * J;
                s += d * K;
                t += d * L;
                u += d * M;
                v += d * N;
                w += d * O;
                x += d * P;
                y += d * Q;
                z += d * R;
                A += d * S;
                B += d * T;
                C += d * U;
                D += d * V;
                E += d * W;
                F += d * X;
                G += d * c;
                d = b[14];
                s += d * J;
                t += d * K;
                u += d * L;
                v += d * M;
                w += d * N;
                x += d * O;
                y += d * P;
                z += d * Q;
                A += d * R;
                B += d * S;
                C += d * T;
                D += d * U;
                E += d * V;
                F += d * W;
                G += d * X;
                H += d * c;
                d = b[15];
                t += d * J;
                u += d * K;
                v += d * L;
                w += d * M;
                x += d * N;
                y += d * O;
                z += d * P;
                A += d * Q;
                B += d * R;
                C += d * S;
                D += d * T;
                E += d * U;
                F += d * V;
                G += d * W;
                H += d * X;
                I += d * c;
                e += 38 * u;
                f += 38 * v;
                g += 38 * w;
                h += 38 * x;
                i += 38 * y;
                j += 38 * z;
                k += 38 * A;
                l += 38 * B;
                m += 38 * C;
                n += 38 * D;
                o += 38 * E;
                p += 38 * F;
                q += 38 * G;
                r += 38 * H;
                s += 38 * I;
                b = 1;
                d = e + b + 65535;
                b = Math.floor(d / 65536);
                e = d - b * 65536;
                d = f + b + 65535;
                b = Math.floor(d / 65536);
                f = d - b * 65536;
                d = g + b + 65535;
                b = Math.floor(d / 65536);
                g = d - b * 65536;
                d = h + b + 65535;
                b = Math.floor(d / 65536);
                h = d - b * 65536;
                d = i + b + 65535;
                b = Math.floor(d / 65536);
                i = d - b * 65536;
                d = j + b + 65535;
                b = Math.floor(d / 65536);
                j = d - b * 65536;
                d = k + b + 65535;
                b = Math.floor(d / 65536);
                k = d - b * 65536;
                d = l + b + 65535;
                b = Math.floor(d / 65536);
                l = d - b * 65536;
                d = m + b + 65535;
                b = Math.floor(d / 65536);
                m = d - b * 65536;
                d = n + b + 65535;
                b = Math.floor(d / 65536);
                n = d - b * 65536;
                d = o + b + 65535;
                b = Math.floor(d / 65536);
                o = d - b * 65536;
                d = p + b + 65535;
                b = Math.floor(d / 65536);
                p = d - b * 65536;
                d = q + b + 65535;
                b = Math.floor(d / 65536);
                q = d - b * 65536;
                d = r + b + 65535;
                b = Math.floor(d / 65536);
                r = d - b * 65536;
                d = s + b + 65535;
                b = Math.floor(d / 65536);
                s = d - b * 65536;
                d = t + b + 65535;
                b = Math.floor(d / 65536);
                t = d - b * 65536;
                e += b - 1 + 37 * (b - 1);
                b = 1;
                d = e + b + 65535;
                b = Math.floor(d / 65536);
                e = d - b * 65536;
                d = f + b + 65535;
                b = Math.floor(d / 65536);
                f = d - b * 65536;
                d = g + b + 65535;
                b = Math.floor(d / 65536);
                g = d - b * 65536;
                d = h + b + 65535;
                b = Math.floor(d / 65536);
                h = d - b * 65536;
                d = i + b + 65535;
                b = Math.floor(d / 65536);
                i = d - b * 65536;
                d = j + b + 65535;
                b = Math.floor(d / 65536);
                j = d - b * 65536;
                d = k + b + 65535;
                b = Math.floor(d / 65536);
                k = d - b * 65536;
                d = l + b + 65535;
                b = Math.floor(d / 65536);
                l = d - b * 65536;
                d = m + b + 65535;
                b = Math.floor(d / 65536);
                m = d - b * 65536;
                d = n + b + 65535;
                b = Math.floor(d / 65536);
                n = d - b * 65536;
                d = o + b + 65535;
                b = Math.floor(d / 65536);
                o = d - b * 65536;
                d = p + b + 65535;
                b = Math.floor(d / 65536);
                p = d - b * 65536;
                d = q + b + 65535;
                b = Math.floor(d / 65536);
                q = d - b * 65536;
                d = r + b + 65535;
                b = Math.floor(d / 65536);
                r = d - b * 65536;
                d = s + b + 65535;
                b = Math.floor(d / 65536);
                s = d - b * 65536;
                d = t + b + 65535;
                b = Math.floor(d / 65536);
                t = d - b * 65536;
                e += b - 1 + 37 * (b - 1);
                a[0] = e;
                a[1] = f;
                a[2] = g;
                a[3] = h;
                a[4] = i;
                a[5] = j;
                a[6] = k;
                a[7] = l;
                a[8] = m;
                a[9] = n;
                a[10] = o;
                a[11] = p;
                a[12] = q;
                a[13] = r;
                a[14] = s;
                a[15] = t
            }

            function P(a, b) {
                O(a, b, b)
            }

            function Q(a, c) {
                var d = b(),
                    e;
                for (e = 0; e < 16; e++) d[e] = c[e];
                for (e = 253; e >= 0; e--) P(d, d), e !== 2 && e !== 4 && O(d, d, c);
                for (e = 0; e < 16; e++) a[e] = d[e]
            }

            function R(a, c) {
                var d = b(),
                    e;
                for (e = 0; e < 16; e++) d[e] = c[e];
                for (e = 250; e >= 0; e--) P(d, d), e !== 1 && O(d, d, c);
                for (e = 0; e < 16; e++) a[e] = d[e]
            }

            function S(a, c, d) {
                var e = new Uint8Array(32),
                    f = new Float64Array(80),
                    g, i = b(),
                    j = b(),
                    k = b(),
                    l = b(),
                    m = b(),
                    n = b();
                for (g = 0; g < 31; g++) e[g] = c[g];
                e[31] = c[31] & 127 | 64;
                e[0] &= 248;
                L(f, d);
                for (g = 0; g < 16; g++) j[g] = f[g], l[g] = i[g] = k[g] = 0;
                i[0] = l[0] = 1;
                for (g = 254; g >= 0; --g) c = e[g >>> 3] >>> (g & 7) & 1, H(i, j, c), H(k, l, c), M(m, i, k), N(i, i, k), M(k, j, l), N(j, j, l), P(l, m), P(n, i), O(i, k, i), O(k, j, m), M(m, i, k), N(i, i, k), P(j, i), N(k, l, n), O(i, k, h), M(i, i, l), O(k, k, i), O(i, l, n), O(l, j, f), P(j, m), H(i, j, c), H(k, l, c);
                for (g = 0; g < 16; g++) f[g + 16] = i[g], f[g + 32] = k[g], f[g + 48] = j[g], f[g + 64] = l[g];
                d = f.subarray(32);
                c = f.subarray(16);
                Q(d, d);
                O(c, c, d);
                I(a, c);
                return 0
            }

            function T(a, b) {
                return S(a, b, e)
            }

            function U(a, b) {
                c(b, 32);
                return T(a, b)
            }

            function V(a, b, c) {
                var e = new Uint8Array(32);
                S(e, c, b);
                return u(a, d, e, v)
            }
            var W = D,
                X = E;

            function aa(a, b, c, d, e, f) {
                var g = new Uint8Array(32);
                V(g, e, f);
                return W(a, b, c, d, g)
            }

            function ba(a, b, c, d, e, f) {
                var g = new Uint8Array(32);
                V(g, e, f);
                return X(a, b, c, d, g)
            }
            var ca = [1116352408, 3609767458, 1899447441, 602891725, 3049323471, 3964484399, 3921009573, 2173295548, 961987163, 4081628472, 1508970993, 3053834265, 2453635748, 2937671579, 2870763221, 3664609560, 3624381080, 2734883394, 310598401, 1164996542, 607225278, 1323610764, 1426881987, 3590304994, 1925078388, 4068182383, 2162078206, 991336113, 2614888103, 633803317, 3248222580, 3479774868, 3835390401, 2666613458, 4022224774, 944711139, 264347078, 2341262773, 604807628, 2007800933, 770255983, 1495990901, 1249150122, 1856431235, 1555081692, 3175218132, 1996064986, 2198950837, 2554220882, 3999719339, 2821834349, 766784016, 2952996808, 2566594879, 3210313671, 3203337956, 3336571891, 1034457026, 3584528711, 2466948901, 113926993, 3758326383, 338241895, 168717936, 666307205, 1188179964, 773529912, 1546045734, 1294757372, 1522805485, 1396182291, 2643833823, 1695183700, 2343527390, 1986661051, 1014477480, 2177026350, 1206759142, 2456956037, 344077627, 2730485921, 1290863460, 2820302411, 3158454273, 3259730800, 3505952657, 3345764771, 106217008, 3516065817, 3606008344, 3600352804, 1432725776, 4094571909, 1467031594, 275423344, 851169720, 430227734, 3100823752, 506948616, 1363258195, 659060556, 3750685593, 883997877, 3785050280, 958139571, 3318307427, 1322822218, 3812723403, 1537002063, 2003034995, 1747873779, 3602036899, 1955562222, 1575990012, 2024104815, 1125592928, 2227730452, 2716904306, 2361852424, 442776044, 2428436474, 593698344, 2756734187, 3733110249, 3204031479, 2999351573, 3329325298, 3815920427, 3391569614, 3928383900, 3515267271, 566280711, 3940187606, 3454069534, 4118630271, 4000239992, 116418474, 1914138554, 174292421, 2731055270, 289380356, 3203993006, 460393269, 320620315, 685471733, 587496836, 852142971, 1086792851, 1017036298, 365543100, 1126000580, 2618297676, 1288033470, 3409855158, 1501505948, 4234509866, 1607167915, 987167468, 1816402316, 1246189591];

            function da(a, b, c, d) {
                var e = new Int32Array(16),
                    f = new Int32Array(16),
                    g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z, A, B, C, D, E, F, G = a[0],
                    H = a[1],
                    I = a[2],
                    J = a[3],
                    K = a[4],
                    L = a[5],
                    M = a[6],
                    N = a[7],
                    O = b[0],
                    P = b[1],
                    Q = b[2],
                    R = b[3],
                    S = b[4],
                    T = b[5],
                    U = b[6],
                    V = b[7],
                    W = 0;
                while (d >= 128) {
                    for (y = 0; y < 16; y++) z = 8 * y + W, e[y] = c[z + 0] << 24 | c[z + 1] << 16 | c[z + 2] << 8 | c[z + 3], f[y] = c[z + 4] << 24 | c[z + 5] << 16 | c[z + 6] << 8 | c[z + 7];
                    for (y = 0; y < 80; y++) {
                        g = G;
                        h = H;
                        i = I;
                        j = J;
                        k = K;
                        l = L;
                        m = M;
                        N;
                        o = O;
                        p = P;
                        q = Q;
                        r = R;
                        s = S;
                        t = T;
                        u = U;
                        V;
                        A = N;
                        B = V;
                        C = B & 65535;
                        D = B >>> 16;
                        E = A & 65535;
                        F = A >>> 16;
                        A = (K >>> 14 | S << 32 - 14) ^ (K >>> 18 | S << 32 - 18) ^ (S >>> 41 - 32 | K << 32 - (41 - 32));
                        B = (S >>> 14 | K << 32 - 14) ^ (S >>> 18 | K << 32 - 18) ^ (K >>> 41 - 32 | S << 32 - (41 - 32));
                        C += B & 65535;
                        D += B >>> 16;
                        E += A & 65535;
                        F += A >>> 16;
                        A = K & L ^ ~K & M;
                        B = S & T ^ ~S & U;
                        C += B & 65535;
                        D += B >>> 16;
                        E += A & 65535;
                        F += A >>> 16;
                        A = ca[y * 2];
                        B = ca[y * 2 + 1];
                        C += B & 65535;
                        D += B >>> 16;
                        E += A & 65535;
                        F += A >>> 16;
                        A = e[y % 16];
                        B = f[y % 16];
                        C += B & 65535;
                        D += B >>> 16;
                        E += A & 65535;
                        F += A >>> 16;
                        D += C >>> 16;
                        E += D >>> 16;
                        F += E >>> 16;
                        w = E & 65535 | F << 16;
                        x = C & 65535 | D << 16;
                        A = w;
                        B = x;
                        C = B & 65535;
                        D = B >>> 16;
                        E = A & 65535;
                        F = A >>> 16;
                        A = (G >>> 28 | O << 32 - 28) ^ (O >>> 34 - 32 | G << 32 - (34 - 32)) ^ (O >>> 39 - 32 | G << 32 - (39 - 32));
                        B = (O >>> 28 | G << 32 - 28) ^ (G >>> 34 - 32 | O << 32 - (34 - 32)) ^ (G >>> 39 - 32 | O << 32 - (39 - 32));
                        C += B & 65535;
                        D += B >>> 16;
                        E += A & 65535;
                        F += A >>> 16;
                        A = G & H ^ G & I ^ H & I;
                        B = O & P ^ O & Q ^ P & Q;
                        C += B & 65535;
                        D += B >>> 16;
                        E += A & 65535;
                        F += A >>> 16;
                        D += C >>> 16;
                        E += D >>> 16;
                        F += E >>> 16;
                        n = E & 65535 | F << 16;
                        v = C & 65535 | D << 16;
                        A = j;
                        B = r;
                        C = B & 65535;
                        D = B >>> 16;
                        E = A & 65535;
                        F = A >>> 16;
                        A = w;
                        B = x;
                        C += B & 65535;
                        D += B >>> 16;
                        E += A & 65535;
                        F += A >>> 16;
                        D += C >>> 16;
                        E += D >>> 16;
                        F += E >>> 16;
                        j = E & 65535 | F << 16;
                        r = C & 65535 | D << 16;
                        H = g;
                        I = h;
                        J = i;
                        K = j;
                        L = k;
                        M = l;
                        N = m;
                        G = n;
                        P = o;
                        Q = p;
                        R = q;
                        S = r;
                        T = s;
                        U = t;
                        V = u;
                        O = v;
                        if (y % 16 === 15)
                            for (z = 0; z < 16; z++) A = e[z], B = f[z], C = B & 65535, D = B >>> 16, E = A & 65535, F = A >>> 16, A = e[(z + 9) % 16], B = f[(z + 9) % 16], C += B & 65535, D += B >>> 16, E += A & 65535, F += A >>> 16, w = e[(z + 1) % 16], x = f[(z + 1) % 16], A = (w >>> 1 | x << 32 - 1) ^ (w >>> 8 | x << 32 - 8) ^ w >>> 7, B = (x >>> 1 | w << 32 - 1) ^ (x >>> 8 | w << 32 - 8) ^ (x >>> 7 | w << 32 - 7), C += B & 65535, D += B >>> 16, E += A & 65535, F += A >>> 16, w = e[(z + 14) % 16], x = f[(z + 14) % 16], A = (w >>> 19 | x << 32 - 19) ^ (x >>> 61 - 32 | w << 32 - (61 - 32)) ^ w >>> 6, B = (x >>> 19 | w << 32 - 19) ^ (w >>> 61 - 32 | x << 32 - (61 - 32)) ^ (x >>> 6 | w << 32 - 6), C += B & 65535, D += B >>> 16, E += A & 65535, F += A >>> 16, D += C >>> 16, E += D >>> 16, F += E >>> 16, e[z] = E & 65535 | F << 16, f[z] = C & 65535 | D << 16
                    }
                    A = G;
                    B = O;
                    C = B & 65535;
                    D = B >>> 16;
                    E = A & 65535;
                    F = A >>> 16;
                    A = a[0];
                    B = b[0];
                    C += B & 65535;
                    D += B >>> 16;
                    E += A & 65535;
                    F += A >>> 16;
                    D += C >>> 16;
                    E += D >>> 16;
                    F += E >>> 16;
                    a[0] = G = E & 65535 | F << 16;
                    b[0] = O = C & 65535 | D << 16;
                    A = H;
                    B = P;
                    C = B & 65535;
                    D = B >>> 16;
                    E = A & 65535;
                    F = A >>> 16;
                    A = a[1];
                    B = b[1];
                    C += B & 65535;
                    D += B >>> 16;
                    E += A & 65535;
                    F += A >>> 16;
                    D += C >>> 16;
                    E += D >>> 16;
                    F += E >>> 16;
                    a[1] = H = E & 65535 | F << 16;
                    b[1] = P = C & 65535 | D << 16;
                    A = I;
                    B = Q;
                    C = B & 65535;
                    D = B >>> 16;
                    E = A & 65535;
                    F = A >>> 16;
                    A = a[2];
                    B = b[2];
                    C += B & 65535;
                    D += B >>> 16;
                    E += A & 65535;
                    F += A >>> 16;
                    D += C >>> 16;
                    E += D >>> 16;
                    F += E >>> 16;
                    a[2] = I = E & 65535 | F << 16;
                    b[2] = Q = C & 65535 | D << 16;
                    A = J;
                    B = R;
                    C = B & 65535;
                    D = B >>> 16;
                    E = A & 65535;
                    F = A >>> 16;
                    A = a[3];
                    B = b[3];
                    C += B & 65535;
                    D += B >>> 16;
                    E += A & 65535;
                    F += A >>> 16;
                    D += C >>> 16;
                    E += D >>> 16;
                    F += E >>> 16;
                    a[3] = J = E & 65535 | F << 16;
                    b[3] = R = C & 65535 | D << 16;
                    A = K;
                    B = S;
                    C = B & 65535;
                    D = B >>> 16;
                    E = A & 65535;
                    F = A >>> 16;
                    A = a[4];
                    B = b[4];
                    C += B & 65535;
                    D += B >>> 16;
                    E += A & 65535;
                    F += A >>> 16;
                    D += C >>> 16;
                    E += D >>> 16;
                    F += E >>> 16;
                    a[4] = K = E & 65535 | F << 16;
                    b[4] = S = C & 65535 | D << 16;
                    A = L;
                    B = T;
                    C = B & 65535;
                    D = B >>> 16;
                    E = A & 65535;
                    F = A >>> 16;
                    A = a[5];
                    B = b[5];
                    C += B & 65535;
                    D += B >>> 16;
                    E += A & 65535;
                    F += A >>> 16;
                    D += C >>> 16;
                    E += D >>> 16;
                    F += E >>> 16;
                    a[5] = L = E & 65535 | F << 16;
                    b[5] = T = C & 65535 | D << 16;
                    A = M;
                    B = U;
                    C = B & 65535;
                    D = B >>> 16;
                    E = A & 65535;
                    F = A >>> 16;
                    A = a[6];
                    B = b[6];
                    C += B & 65535;
                    D += B >>> 16;
                    E += A & 65535;
                    F += A >>> 16;
                    D += C >>> 16;
                    E += D >>> 16;
                    F += E >>> 16;
                    a[6] = M = E & 65535 | F << 16;
                    b[6] = U = C & 65535 | D << 16;
                    A = N;
                    B = V;
                    C = B & 65535;
                    D = B >>> 16;
                    E = A & 65535;
                    F = A >>> 16;
                    A = a[7];
                    B = b[7];
                    C += B & 65535;
                    D += B >>> 16;
                    E += A & 65535;
                    F += A >>> 16;
                    D += C >>> 16;
                    E += D >>> 16;
                    F += E >>> 16;
                    a[7] = N = E & 65535 | F << 16;
                    b[7] = V = C & 65535 | D << 16;
                    W += 128;
                    d -= 128
                }
                return d
            }

            function Y(a, b, c) {
                var d = new Int32Array(8),
                    e = new Int32Array(8),
                    f = new Uint8Array(256),
                    g, h = c;
                d[0] = 1779033703;
                d[1] = 3144134277;
                d[2] = 1013904242;
                d[3] = 2773480762;
                d[4] = 1359893119;
                d[5] = 2600822924;
                d[6] = 528734635;
                d[7] = 1541459225;
                e[0] = 4089235720;
                e[1] = 2227873595;
                e[2] = 4271175723;
                e[3] = 1595750129;
                e[4] = 2917565137;
                e[5] = 725511199;
                e[6] = 4215389547;
                e[7] = 327033209;
                da(d, e, b, c);
                c %= 128;
                for (g = 0; g < c; g++) f[g] = b[h - c + g];
                f[c] = 128;
                c = 256 - 128 * (c < 112 ? 1 : 0);
                f[c - 9] = 0;
                n(f, c - 8, h / 536870912 | 0, h << 3);
                da(d, e, f, c);
                for (g = 0; g < 8; g++) n(a, 8 * g, d[g], e[g]);
                return 0
            }

            function ea(a, c) {
                var d = b(),
                    e = b(),
                    f = b(),
                    g = b(),
                    h = b(),
                    i = b(),
                    k = b(),
                    l = b(),
                    m = b();
                N(d, a[1], a[0]);
                N(m, c[1], c[0]);
                O(d, d, m);
                M(e, a[0], a[1]);
                M(m, c[0], c[1]);
                O(e, e, m);
                O(f, a[3], c[3]);
                O(f, f, j);
                O(g, a[2], c[2]);
                M(g, g, g);
                N(h, e, d);
                N(i, g, f);
                M(k, g, f);
                M(l, e, d);
                O(a[0], h, i);
                O(a[1], l, k);
                O(a[2], k, i);
                O(a[3], h, l)
            }

            function fa(a, b, c) {
                var d;
                for (d = 0; d < 4; d++) H(a[d], b[d], c)
            }

            function ga(a, c) {
                var d = b(),
                    e = b(),
                    f = b();
                Q(f, c[2]);
                O(d, c[0], f);
                O(e, c[1], f);
                I(a, e);
                a[31] ^= K(d) << 7
            }

            function ha(a, b, c) {
                var d, e;
                F(a[0], f);
                F(a[1], g);
                F(a[2], g);
                F(a[3], f);
                for (e = 255; e >= 0; --e) d = c[e / 8 | 0] >> (e & 7) & 1, fa(a, b, d), ea(b, a), ea(a, a), fa(a, b, d)
            }

            function ia(a, c) {
                var d = [b(), b(), b(), b()];
                F(d[0], k);
                F(d[1], l);
                F(d[2], g);
                O(d[3], k, l);
                ha(a, d, c)
            }

            function ja(a, d, e) {
                var f = new Uint8Array(64),
                    g = [b(), b(), b(), b()];
                e || c(d, 32);
                Y(f, d, 32);
                f[0] &= 248;
                f[31] &= 127;
                f[31] |= 64;
                ia(g, f);
                ga(a, g);
                for (e = 0; e < 32; e++) d[e + 32] = a[e];
                return 0
            }
            var ka = new Float64Array([237, 211, 245, 92, 26, 99, 18, 88, 214, 156, 247, 162, 222, 249, 222, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 16]);

            function la(a, b) {
                var c, d, e, f;
                for (d = 63; d >= 32; --d) {
                    c = 0;
                    for (e = d - 32, f = d - 12; e < f; ++e) b[e] += c - 16 * b[d] * ka[e - (d - 32)], c = b[e] + 128 >> 8, b[e] -= c * 256;
                    b[e] += c;
                    b[d] = 0
                }
                c = 0;
                for (e = 0; e < 32; e++) b[e] += c - (b[31] >> 4) * ka[e], c = b[e] >> 8, b[e] &= 255;
                for (e = 0; e < 32; e++) b[e] -= c * ka[e];
                for (d = 0; d < 32; d++) b[d + 1] += b[d] >> 8, a[d] = b[d] & 255
            }

            function ma(a) {
                var b = new Float64Array(64),
                    c;
                for (c = 0; c < 64; c++) b[c] = a[c];
                for (c = 0; c < 64; c++) a[c] = 0;
                la(a, b)
            }

            function na(a, c, d, e) {
                var f = new Uint8Array(64),
                    g = new Uint8Array(64),
                    h = new Uint8Array(64),
                    i, j = new Float64Array(64),
                    k = [b(), b(), b(), b()];
                Y(f, e, 32);
                f[0] &= 248;
                f[31] &= 127;
                f[31] |= 64;
                var l = d + 64;
                for (i = 0; i < d; i++) a[64 + i] = c[i];
                for (i = 0; i < 32; i++) a[32 + i] = f[32 + i];
                Y(h, a.subarray(32), d + 32);
                ma(h);
                ia(k, h);
                ga(a, k);
                for (i = 32; i < 64; i++) a[i] = e[i];
                Y(g, a, d + 64);
                ma(g);
                for (i = 0; i < 64; i++) j[i] = 0;
                for (i = 0; i < 32; i++) j[i] = h[i];
                for (i = 0; i < 32; i++)
                    for (c = 0; c < 32; c++) j[i + c] += g[i] * f[c];
                la(a.subarray(32), j);
                return l
            }

            function oa(a, c) {
                var d = b(),
                    e = b(),
                    h = b(),
                    j = b(),
                    k = b(),
                    l = b(),
                    n = b();
                F(a[2], g);
                L(a[1], c);
                P(h, a[1]);
                O(j, h, i);
                N(h, h, a[2]);
                M(j, a[2], j);
                P(k, j);
                P(l, k);
                O(n, l, k);
                O(d, n, h);
                O(d, d, j);
                R(d, d);
                O(d, d, h);
                O(d, d, j);
                O(d, d, j);
                O(a[0], d, j);
                P(e, a[0]);
                O(e, e, j);
                J(e, h) && O(a[0], a[0], m);
                P(e, a[0]);
                O(e, e, j);
                if (J(e, h)) return -1;
                K(a[0]) === c[31] >> 7 && N(a[0], f, a[0]);
                O(a[3], a[0], a[1]);
                return 0
            }

            function pa(a, c, d, e) {
                var f, g = new Uint8Array(32),
                    h = new Uint8Array(64),
                    i = [b(), b(), b(), b()],
                    j = [b(), b(), b(), b()];
                if (d < 64) return -1;
                if (oa(j, e)) return -1;
                for (f = 0; f < d; f++) a[f] = c[f];
                for (f = 0; f < 32; f++) a[f + 32] = e[f];
                Y(h, a, d);
                ma(h);
                ha(i, j, h);
                ia(j, c.subarray(32));
                ea(i, j);
                ga(g, i);
                d -= 64;
                if (q(c, 0, g, 0)) {
                    for (f = 0; f < d; f++) a[f] = 0;
                    return -1
                }
                for (f = 0; f < d; f++) a[f] = c[f + 64];
                e = d;
                return e
            }
            var qa = 32,
                ra = 24,
                sa = 32,
                ta = 16,
                ua = 32,
                va = 32,
                wa = 32,
                xa = 32,
                ya = 32,
                za = ra,
                Aa = sa,
                Ba = ta,
                Z = 64,
                Ca = 32,
                Da = 64,
                Ea = 32,
                Fa = 64;
            a.lowlevel = {
                crypto_core_hsalsa20: u,
                crypto_stream_xor: z,
                crypto_stream: y,
                crypto_stream_salsa20_xor: w,
                crypto_stream_salsa20: x,
                crypto_onetimeauth: B,
                crypto_onetimeauth_verify: C,
                crypto_verify_16: p,
                crypto_verify_32: q,
                crypto_secretbox: D,
                crypto_secretbox_open: E,
                crypto_scalarmult: S,
                crypto_scalarmult_base: T,
                crypto_box_beforenm: V,
                crypto_box_afternm: W,
                crypto_box: aa,
                crypto_box_open: ba,
                crypto_box_keypair: U,
                crypto_hash: Y,
                crypto_sign: na,
                crypto_sign_keypair: ja,
                crypto_sign_open: pa,
                crypto_secretbox_KEYBYTES: qa,
                crypto_secretbox_NONCEBYTES: ra,
                crypto_secretbox_ZEROBYTES: sa,
                crypto_secretbox_BOXZEROBYTES: ta,
                crypto_scalarmult_BYTES: ua,
                crypto_scalarmult_SCALARBYTES: va,
                crypto_box_PUBLICKEYBYTES: wa,
                crypto_box_SECRETKEYBYTES: xa,
                crypto_box_BEFORENMBYTES: ya,
                crypto_box_NONCEBYTES: za,
                crypto_box_ZEROBYTES: Aa,
                crypto_box_BOXZEROBYTES: Ba,
                crypto_sign_BYTES: Z,
                crypto_sign_PUBLICKEYBYTES: Ca,
                crypto_sign_SECRETKEYBYTES: Da,
                crypto_sign_SEEDBYTES: Ea,
                crypto_hash_BYTES: Fa
            };

            function Ga(a, b) {
                if (a.length !== qa) throw new Error("bad key size");
                if (b.length !== ra) throw new Error("bad nonce size")
            }

            function Ha(a, b) {
                if (a.length !== wa) throw new Error("bad public key size");
                if (b.length !== xa) throw new Error("bad secret key size")
            }

            function $() {
                for (var a = 0; a < arguments.length; a++)
                    if (!(arguments[a] instanceof Uint8Array)) throw new TypeError("unexpected type, use Uint8Array")
            }

            function Ia(a) {
                for (var b = 0; b < a.length; b++) a[b] = 0
            }
            a.randomBytes = function(a) {
                var b = new Uint8Array(a);
                c(b, a);
                return b
            };
            a.secretbox = function(a, b, c) {
                $(a, b, c);
                Ga(c, b);
                var d = new Uint8Array(sa + a.length),
                    e = new Uint8Array(d.length);
                for (var f = 0; f < a.length; f++) d[f + sa] = a[f];
                D(e, d, d.length, b, c);
                return e.subarray(ta)
            };
            a.secretbox.open = function(a, b, c) {
                $(a, b, c);
                Ga(c, b);
                var d = new Uint8Array(ta + a.length),
                    e = new Uint8Array(d.length);
                for (var f = 0; f < a.length; f++) d[f + ta] = a[f];
                if (d.length < 32) return null;
                return E(e, d, d.length, b, c) !== 0 ? null : e.subarray(sa)
            };
            a.secretbox.keyLength = qa;
            a.secretbox.nonceLength = ra;
            a.secretbox.overheadLength = ta;
            a.scalarMult = function(a, b) {
                $(a, b);
                if (a.length !== va) throw new Error("bad n size");
                if (b.length !== ua) throw new Error("bad p size");
                var c = new Uint8Array(ua);
                S(c, a, b);
                return c
            };
            a.scalarMult.base = function(a) {
                $(a);
                if (a.length !== va) throw new Error("bad n size");
                var b = new Uint8Array(ua);
                T(b, a);
                return b
            };
            a.scalarMult.scalarLength = va;
            a.scalarMult.groupElementLength = ua;
            a.box = function(b, c, d, e) {
                d = a.box.before(d, e);
                return a.secretbox(b, c, d)
            };
            a.box.before = function(a, b) {
                $(a, b);
                Ha(a, b);
                var c = new Uint8Array(ya);
                V(c, a, b);
                return c
            };
            a.box.after = a.secretbox;
            a.box.open = function(b, c, d, e) {
                d = a.box.before(d, e);
                return a.secretbox.open(b, c, d)
            };
            a.box.open.after = a.secretbox.open;
            a.box.keyPair = function() {
                var a = new Uint8Array(wa),
                    b = new Uint8Array(xa);
                U(a, b);
                return {
                    publicKey: a,
                    secretKey: b
                }
            };
            a.box.keyPair.fromSecretKey = function(a) {
                $(a);
                if (a.length !== xa) throw new Error("bad secret key size");
                var b = new Uint8Array(wa);
                T(b, a);
                return {
                    publicKey: b,
                    secretKey: new Uint8Array(a)
                }
            };
            a.box.publicKeyLength = wa;
            a.box.secretKeyLength = xa;
            a.box.sharedKeyLength = ya;
            a.box.nonceLength = za;
            a.box.overheadLength = a.secretbox.overheadLength;
            a.sign = function(a, b) {
                $(a, b);
                if (b.length !== Da) throw new Error("bad secret key size");
                var c = new Uint8Array(Z + a.length);
                na(c, a, a.length, b);
                return c
            };
            a.sign.open = function(a, b) {
                $(a, b);
                if (b.length !== Ca) throw new Error("bad public key size");
                var c = new Uint8Array(a.length);
                a = pa(c, a, a.length, b);
                if (a < 0) return null;
                b = new Uint8Array(a);
                for (a = 0; a < b.length; a++) b[a] = c[a];
                return b
            };
            a.sign.detached = function(b, c) {
                b = a.sign(b, c);
                c = new Uint8Array(Z);
                for (var d = 0; d < c.length; d++) c[d] = b[d];
                return c
            };
            a.sign.detached.verify = function(a, b, c) {
                $(a, b, c);
                if (b.length !== Z) throw new Error("bad signature size");
                if (c.length !== Ca) throw new Error("bad public key size");
                var d = new Uint8Array(Z + a.length),
                    e = new Uint8Array(Z + a.length),
                    f;
                for (f = 0; f < Z; f++) d[f] = b[f];
                for (f = 0; f < a.length; f++) d[f + Z] = a[f];
                return pa(e, d, d.length, c) >= 0
            };
            a.sign.keyPair = function() {
                var a = new Uint8Array(Ca),
                    b = new Uint8Array(Da);
                ja(a, b);
                return {
                    publicKey: a,
                    secretKey: b
                }
            };
            a.sign.keyPair.fromSecretKey = function(a) {
                $(a);
                if (a.length !== Da) throw new Error("bad secret key size");
                var b = new Uint8Array(Ca);
                for (var c = 0; c < b.length; c++) b[c] = a[32 + c];
                return {
                    publicKey: b,
                    secretKey: new Uint8Array(a)
                }
            };
            a.sign.keyPair.fromSeed = function(a) {
                $(a);
                if (a.length !== Ea) throw new Error("bad seed size");
                var b = new Uint8Array(Ca),
                    c = new Uint8Array(Da);
                for (var d = 0; d < 32; d++) c[d] = a[d];
                ja(b, c, !0);
                return {
                    publicKey: b,
                    secretKey: c
                }
            };
            a.sign.publicKeyLength = Ca;
            a.sign.secretKeyLength = Da;
            a.sign.seedLength = Ea;
            a.sign.signatureLength = Z;
            a.hash = function(a) {
                $(a);
                var b = new Uint8Array(Fa);
                Y(b, a, a.length);
                return b
            };
            a.hash.hashLength = Fa;
            a.verify = function(a, b) {
                $(a, b);
                if (a.length === 0 || b.length === 0) return !1;
                return a.length !== b.length ? !1 : o(a, 0, b, 0, a.length) === 0 ? !0 : !1
            };
            a.setPRNG = function(a) {
                c = a
            };
            (function() {
                var b = typeof self !== "undefined" ? self.crypto || self.msCrypto : null;
                if (b && b.getRandomValues) {
                    var c = 65536;
                    a.setPRNG(function(a, d) {
                        var e, f = new Uint8Array(d);
                        for (e = 0; e < d; e += c) b.getRandomValues(f.subarray(e, e + Math.min(d - e, c)));
                        for (e = 0; e < d; e++) a[e] = f[e];
                        Ia(f)
                    })
                }
            })()
        })(typeof g !== "undefined" && g.exports ? g.exports : self.nacl = self.nacl || {})
    }
    var i = !1;

    function j() {
        i || (i = !0, h());
        return g.exports
    }

    function a(a) {
        switch (a) {
            case void 0:
                return j()
        }
    }
    e.exports = a
}), null);
__d("EnvelopeEncryption", ["Promise", "tweetnacl-sealedbox-js"], (function(a, b, c, d, e, f, g) {
    "use strict";
    var h, i = window.crypto || window.msCrypto,
        j = 64,
        k = 1,
        l = 1,
        m = 1,
        n = 2,
        o = 32,
        p = 16,
        q = l + m + n + o + c("tweetnacl-sealedbox-js").overheadLength + p;

    function r(a, b) {
        return c("tweetnacl-sealedbox-js").seal(a, b)
    }

    function s(a) {
        var b = [];
        for (var c = 0; c < a.length; c += 2) b.push(parseInt(a.slice(c, c + 2), 16));
        return new Uint8Array(b)
    }

    function a(a, d, e, f) {
        var g = q + e.length;
        if (d.length != j) throw new Error("public key is not a valid hex sting");
        var t = s(d);
        if (!t) throw new Error("public key is not a valid hex string");
        var u = new Uint8Array(g),
            v = 0;
        u[v] = k;
        v += l;
        u[v] = a;
        v += m;
        d = {
            name: "AES-GCM",
            length: o * 8
        };
        var w = {
            name: "AES-GCM",
            iv: new Uint8Array(12),
            additionalData: f,
            tagLen: p
        };
        return i.subtle.generateKey(d, !0, ["encrypt", "decrypt"]).then(function(a) {
            var c = i.subtle.exportKey("raw", a);
            a = i.subtle.encrypt(w, a, e.buffer);
            return (h || (h = b("Promise"))).all([c, a])
        }).then(function(a) {
            var b = new Uint8Array(a[0]);
            b = r(b, t);
            u[v] = b.length & 255;
            u[v + 1] = b.length >> 8 & 255;
            v += n;
            u.set(b, v);
            v += o;
            v += c("tweetnacl-sealedbox-js").overheadLength;
            if (b.length !== o + c("tweetnacl-sealedbox-js").overheadLength) throw new Error("encrypted key is the wrong length");
            b = new Uint8Array(a[1]);
            a = b.slice(-p);
            b = b.slice(0, -p);
            u.set(a, v);
            v += p;
            u.set(b, v);
            return u
        })["catch"](function(a) {
            throw a
        })
    }
    g.encrypt = a
}), 98);
__d("ErrorMessageConsole", ["ErrorPubSub", "cr:1458113"], (function(a, b, c, d, e, f, g) {
    "use strict";
    var h;

    function a(a) {
        if (a.type !== "fatal") return;
        b("cr:1458113") && b("cr:1458113").showErrorDialog(a)
    }
    var i = !1;

    function d() {
        if (i) return;
        i = !0;
        (h || (h = c("ErrorPubSub"))).addListener(j)
    }

    function j(a) {
        if (a.type !== "fatal") return;
        b("cr:1458113") && b("cr:1458113").showErrorDialog(a)
    }
    g.addError = a;
    g.listenForUncaughtErrors = d
}), 98);
__d("FBBrowserPasswordEncryption", ["EnvelopeEncryption", "tweetnacl-util"], (function(a, b, c, d, e, f, g) {
    "use strict";
    var h = "#PWD_BROWSER",
        i = 5;

    function a(a, b, e, f, g, j) {
        g === void 0 && (g = i);
        j === void 0 && (j = h);
        e = c("tweetnacl-util").decodeUTF8(e);
        var k = c("tweetnacl-util").decodeUTF8(f);
        return d("EnvelopeEncryption").encrypt(a, b, e, k).then(function(a) {
            return [j, g, f, c("tweetnacl-util").encodeBase64(a)].join(":")
        })
    }
    g.encryptPassword = a
}), 98);
__d("FlipDirection", ["DOM", "Input", "Style"], (function(a, b, c, d, e, f) {
    a = {
        setDirection: function(a, c, d) {
            c === void 0 && (c = 5);
            d === void 0 && (d = !1);
            var e = b("DOM").isNodeOfType(a, "input") && a.type == "text",
                f = b("DOM").isNodeOfType(a, "textarea");
            if (!(e || f) || a.getAttribute("data-prevent-auto-flip")) return;
            e = b("Input").getValue(a);
            f = a.style && a.style.direction;
            if (!f || d) {
                f = 0;
                d = !0;
                for (var g = 0; g < e.length; g++) {
                    var h = e.charCodeAt(g);
                    if (h >= 48) {
                        d && (d = !1, f++);
                        if (h >= 1470 && h <= 1920) {
                            b("Style").set(a, "direction", "rtl");
                            a.setAttribute("dir", "rtl");
                            return
                        }
                        if (f == c) {
                            b("Style").set(a, "direction", "ltr");
                            a.setAttribute("dir", "ltr");
                            return
                        }
                    } else d = !0
                }
            } else e.length === 0 && (b("Style").set(a, "direction", ""), a.removeAttribute("dir"))
        }
    };
    e.exports = a
}), null);
__d("FlipDirectionOnKeypress", ["Event", "FlipDirection"], (function(a, b, c, d, e, f, g) {
    a = function(a) {
        a = a.getTarget();
        d("FlipDirection").setDirection(a)
    };
    c("Event").listen(document.documentElement, {
        keyup: a,
        input: a
    })
}), 34);
__d("VirtualCursorStatus", ["UserAgent", "cr:5662", "emptyFunction", "setImmediate"], (function(a, b, c, d, e, f) {
    var g = null,
        h = null;

    function i() {
        h || (h = b("cr:5662").listen(window, "blur", function() {
            g = null, j()
        }))
    }

    function j() {
        h && (h.remove(), h = null)
    }

    function a(a) {
        g = a.keyCode, i()
    }

    function c() {
        g = null, j()
    }
    if (typeof window !== "undefined" && window.document && window.document.createElement) {
        d = document.documentElement;
        if (d)
            if (d.addEventListener) d.addEventListener("keydown", a, !0), d.addEventListener("keyup", c, !0);
            else if (d.attachEvent) {
            f = d.attachEvent;
            f("onkeydown", a);
            f("onkeyup", c)
        }
    }
    var k = {
            isKeyDown: function() {
                return !!g
            },
            getKeyDownCode: function() {
                return g
            }
        },
        l = !1,
        m = !1,
        n = null,
        o = !1;

    function p(a) {
        var c = new Set(),
            d = k.isKeyDown(),
            e = a.clientX,
            f = a.clientY,
            g = a.isTrusted,
            h = a.offsetX,
            i = a.offsetY,
            j = a.mozInputSource,
            n = a.WEBKIT_FORCE_AT_MOUSE_DOWN,
            o = a.webkitForce;
        a = a.target;
        var p = a.clientWidth;
        a = a.clientHeight;
        e === 0 && f === 0 && h >= 0 && i >= 0 && m && g && j == null && c.add("Chrome");
        l && m && !d && o != null && o < n && h === 0 && i === 0 && j == null && c.add("Safari-edge");
        e === 0 && f === 0 && h < 0 && i < 0 && m && j == null && c.add("Safari-old");
        !l && !m && !d && g && b("UserAgent").isBrowser("IE >= 10") && j == null && (e < 0 && f < 0 ? c.add("IE") : (h < 0 || h > p) && (i < 0 || i > a) && c.add("MSIE"));
        j === 0 && g && c.add("Firefox");
        return c
    }

    function q() {
        l = !0, b("setImmediate")(function() {
            l = !1
        })
    }

    function r() {
        m = !0, b("setImmediate")(function() {
            m = !1
        })
    }

    function s(a, c) {
        n === null && (n = p(a));
        o = n.size > 0;
        a = a.target.getAttribute("data-accessibilityid") === "virtual_cursor_trigger";
        c(o, n, a);
        b("setImmediate")(function() {
            o = !1, n = null
        })
    }
    d = {
        isVirtualCursorTriggered: function() {
            return o
        },
        add: function(a, c) {
            c === void 0 && (c = b("emptyFunction"));
            var d = function(a) {
                return s(a, c)
            };
            a.addEventListener("click", d);
            var e = b("cr:5662").listen(a, "mousedown", q),
                f = b("cr:5662").listen(a, "mouseup", r);
            return {
                remove: function() {
                    a.removeEventListener("click", d), e.remove(), f.remove()
                }
            }
        }
    };
    e.exports = d
}), null);
__d("FocusRing", ["cx", "CSS", "Event", "KeyEventController", "Keys", "VirtualCursorStatus", "emptyFunction"], (function(a, b, c, d, e, f, g, h) {
    var i = ["mousedown", "mouseup"],
        j = [(e = c("Keys")).UP, e.RIGHT, e.DOWN, e.LEFT, e.TAB, e.RETURN, e.SPACE, e.ESC];

    function a() {
        if (n) return;
        o = !1;
        k();
        m();
        document.body && d("CSS").addClass(document.body, "_19_u");
        n = !0
    }

    function b() {
        return o
    }

    function k() {
        document.documentElement && d("VirtualCursorStatus").add(document.documentElement, s)
    }

    function l() {
        q = i.map(function(a) {
            return c("Event").listen(document.documentElement, a, p)
        })
    }

    function m() {
        w = c("Event").listen(document.documentElement, "keydown", t)
    }
    var n = !1,
        o = !0;

    function p() {
        v()
    }
    var q = i.map(function(a) {
        return {
            remove: c("emptyFunction")
        }
    });

    function r() {
        q.forEach(function(a) {
            return a.remove()
        })
    }

    function s(a) {
        a && u()
    }

    function t(a) {
        j.indexOf(c("Event").getKeyCode(a)) > -1 && c("KeyEventController").filterEventTargets(a, "keydown") && u()
    }

    function u() {
        w.remove(), l(), o = !0, document.body && d("CSS").removeClass(document.body, "_19_u")
    }

    function v() {
        r(), m(), o = !1, document.body && d("CSS").addClass(document.body, "_19_u")
    }
    var w = {
        remove: c("emptyFunction")
    };
    ({
        remove: c("emptyFunction")
    });
    g.KEY_CODES = j;
    g.init = a;
    g.usingKeyboardNavigation = b;
    g._attachVirtualCursorListener = k;
    g._attachMouseListeners = l;
    g._attachKeyDownListener = m;
    g._onMouseEvent = p;
    g._removeMouseListeners = r;
    g._onClick = s;
    g._onKeyDown = t;
    g._showFocusRing = u;
    g._hideFocusRing = v
}), 98);
__d("FormTypeABTester", ["Base64", "Event"], (function(a, b, c, d, e, f, g) {
    a = function(a) {
        var b = 32,
            d = 65,
            e = 90,
            f = 48,
            g = 57,
            h = 58,
            i = 63,
            j = 91,
            k = 94,
            l = 0,
            m = 0,
            n = 0,
            o = 0,
            p = [],
            q = null,
            r = [],
            s = [],
            t = [],
            u = [];
        for (var v = 0; v < 10; v++) r.push(0), s.push(0);
        for (v = 0; v < 10; v++) s.push(0), t.push(0), u.push(0);
        var w = function(a) {
                var c = window.event ? Date.now() : a.timeStamp;
                a = window.event ? window.event.keyCode : a.which;
                a %= 128;
                a >= d && a <= e || a == b ? l++ : a >= f && a <= g ? m++ : a >= h && a <= i || a >= j && a <= k ? n++ : o++;
                p[a] = c;
                if (q != null && q !== 0) {
                    var r = c - q;
                    r >= 0 && (a >= d && a <= e || a == b) && (r < 400 ? s[Math.floor(r / 20)]++ : r < 1e3 ? t[Math.floor((r - 400) / 60)]++ : r < 3e3 && u[Math.floor((r - 1e3) / 200)]++)
                }
                q = c
            },
            x = function(a) {
                var b = window.event ? Date.now() : a.timeStamp;
                a = window.event ? window.event.keyCode : a.which;
                b = b - p[a % 128];
                b >= 50 && b < 250 && r[Math.floor((b - 50) / 20)]++
            },
            y = function(a) {
                var b = Math.max.apply(Math, a),
                    c = [];
                a.forEach(function(a) {
                    c.push(Math.floor(a * 63 / (b || 1)))
                });
                return c
            };
        this.getDataVect = function() {
            var a = s.concat(t, u);
            return y(a).concat(y(r), [l / 2, m / 2, n / 2, o / 2])
        };
        this.getData = function() {
            return c("Base64").encodeNums(this.getDataVect())
        };
        c("Event").listen(a, {
            keyup: function(a) {
                return x(a)
            },
            keydown: function(a) {
                return w(a)
            }
        })
    };
    g["default"] = a
}), 98);
__d("FourOhFourJSTypedLogger", ["Banzai", "GeneratedLoggerUtils", "nullthrows"], (function(a, b, c, d, e, f) {
    "use strict";
    a = function() {
        function a() {
            this.$1 = {}
        }
        var c = a.prototype;
        c.log = function(a) {
            b("GeneratedLoggerUtils").log("logger:FourOhFourJSLoggerConfig", this.$1, b("Banzai").BASIC, a)
        };
        c.logVital = function(a) {
            b("GeneratedLoggerUtils").log("logger:FourOhFourJSLoggerConfig", this.$1, b("Banzai").VITAL, a)
        };
        c.logImmediately = function(a) {
            b("GeneratedLoggerUtils").log("logger:FourOhFourJSLoggerConfig", this.$1, {
                signal: !0
            }, a)
        };
        c.clear = function() {
            this.$1 = {};
            return this
        };
        c.getData = function() {
            return babelHelpers["extends"]({}, this.$1)
        };
        c.updateData = function(a) {
            this.$1 = babelHelpers["extends"]({}, this.$1, a);
            return this
        };
        c.setFbid = function(a) {
            this.$1.fbid = a;
            return this
        };
        c.setOriginalURI = function(a) {
            this.$1.original_uri = a;
            return this
        };
        c.setScriptPath = function(a) {
            this.$1.script_path = a;
            return this
        };
        c.updateExtraData = function(a) {
            a = b("nullthrows")(b("GeneratedLoggerUtils").serializeMap(a));
            b("GeneratedLoggerUtils").checkExtraDataFieldNames(a, g);
            this.$1 = babelHelpers["extends"]({}, this.$1, a);
            return this
        };
        c.addToExtraData = function(a, b) {
            var c = {};
            c[a] = b;
            return this.updateExtraData(c)
        };
        return a
    }();
    var g = {
        fbid: !0,
        original_uri: !0,
        script_path: !0
    };
    f["default"] = a
}), 66);
__d("FourOhFourJSLogger", ["FourOhFourJSTypedLogger", "ScriptPath"], (function(a, b, c, d, e, f) {
    a = {
        log: function() {
            window.onload = function() {
                var a = new(b("FourOhFourJSTypedLogger"))();
                a.setOriginalURI(window.location.href);
                a.setScriptPath(b("ScriptPath").getScriptPath());
                a.logVital()
            }
        }
    };
    e.exports = a
}), null);
__d("FullScreen", ["ArbiterMixin", "CSS", "Event", "Keys", "UserAgent", "UserAgent_DEPRECATED", "mixin", "throttle"], (function(a, b, c, d, e, f, g) {
    var h = {},
        i = !1;

    function j(a) {
        c("Event").getKeyCode(a) === c("Keys").ESC && a.stopPropagation()
    }

    function k() {
        i || (document.addEventListener("keydown", j, !0), i = !0)
    }

    function l() {
        i && (document.removeEventListener("keydown", j, !0), i = !1)
    }
    a = function(a) {
        babelHelpers.inheritsLoose(b, a);

        function b() {
            var b, c;
            for (var e = arguments.length, f = new Array(e), g = 0; g < e; g++) f[g] = arguments[g];
            return (b = c = a.call.apply(a, [this].concat(f)) || this, c.onChange = function() {
                var a = c.isFullScreen(),
                    b = document.body;
                b && d("CSS").conditionClass(b, "fullScreen", a);
                c.inform("changed");
                a || l()
            }, b) || babelHelpers.assertThisInitialized(c)
        }
        var e = b.prototype;
        e.listenForEvent = function(a) {
            var b = c("throttle")(this.onChange, 0, this);
            h[a.id] || (h[a.id] = !0, c("Event").listen(a, {
                webkitfullscreenchange: b,
                mozfullscreenchange: b,
                MSFullscreenChange: b,
                fullscreenchange: b
            }))
        };
        e.enableFullScreen = function(a) {
            this.listenForEvent(a);
            a = a;
            if (a.webkitRequestFullScreen) d("UserAgent_DEPRECATED").chrome() ? a.webkitRequestFullScreen == null ? void 0 : a.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT) : a.webkitRequestFullScreen == null ? void 0 : a.webkitRequestFullScreen();
            else if (a.mozRequestFullScreen) a.mozRequestFullScreen();
            else if (a.msRequestFullscreen) k(), a.msRequestFullscreen == null ? void 0 : a.msRequestFullscreen();
            else if (a.requestFullScreen) a.requestFullScreen == null ? void 0 : a.requestFullScreen();
            else return !1;
            return !0
        };
        e.disableFullScreen = function() {
            var a = document;
            if (a.webkitCancelFullScreen) a.webkitCancelFullScreen();
            else if (a.mozCancelFullScreen) a.mozCancelFullScreen();
            else if (a.msExitFullscreen) a.msExitFullscreen();
            else if (a.cancelFullScreen) a.cancelFullScreen();
            else if (a.exitFullScreen) a.exitFullScreen();
            else return !1;
            return !0
        };
        e.isFullScreen = function() {
            var a = document;
            return Boolean(a.webkitIsFullScreen || a.fullScreen || a.mozFullScreen || a.msFullscreenElement)
        };
        e.toggleFullScreen = function(a) {
            if (this.isFullScreen()) {
                this.disableFullScreen();
                return !1
            } else return this.enableFullScreen(a)
        };
        e.isSupportedWithKeyboardInput = function() {
            return this.isSupported() && !c("UserAgent").isBrowser("Safari")
        };
        e.isSupported = function() {
            var a = document,
                b = a.webkitFullscreenEnabled || a.mozFullScreenEnabled || a.msFullscreenEnabled || a.fullscreenEnabled;
            return Boolean(b || a.webkitCancelFullScreen || a.mozCancelFullScreen || a.msExitFullscreen || a.cancelFullScreen || a.exitFullScreen)
        };
        return b
    }(c("mixin")(c("ArbiterMixin")));
    b = new a();
    e = c("throttle")(b.onChange, 0, b);
    c("Event").listen(document, {
        webkitfullscreenchange: e,
        mozfullscreenchange: e,
        MSFullscreenChange: e,
        fullscreenchange: e
    });
    f = b;
    g["default"] = f
}), 98);
__d("LoggedOutSwitchingLocaleTypedLogger", ["Banzai", "GeneratedLoggerUtils"], (function(a, b, c, d, e, f) {
    "use strict";
    a = function() {
        function a() {
            this.$1 = {}
        }
        var c = a.prototype;
        c.log = function(a) {
            b("GeneratedLoggerUtils").log("logger:LoggedOutSwitchingLocaleLoggerConfig", this.$1, b("Banzai").BASIC, a)
        };
        c.logVital = function(a) {
            b("GeneratedLoggerUtils").log("logger:LoggedOutSwitchingLocaleLoggerConfig", this.$1, b("Banzai").VITAL, a)
        };
        c.logImmediately = function(a) {
            b("GeneratedLoggerUtils").log("logger:LoggedOutSwitchingLocaleLoggerConfig", this.$1, {
                signal: !0
            }, a)
        };
        c.clear = function() {
            this.$1 = {};
            return this
        };
        c.getData = function() {
            return babelHelpers["extends"]({}, this.$1)
        };
        c.updateData = function(a) {
            this.$1 = babelHelpers["extends"]({}, this.$1, a);
            return this
        };
        c.setIndex = function(a) {
            this.$1.index = a;
            return this
        };
        c.setNewLocale = function(a) {
            this.$1.new_locale = a;
            return this
        };
        c.setOldLocale = function(a) {
            this.$1.old_locale = a;
            return this
        };
        c.setReferrer = function(a) {
            this.$1.referrer = a;
            return this
        };
        return a
    }();
    c = {
        index: !0,
        new_locale: !0,
        old_locale: !0,
        referrer: !0
    };
    f["default"] = a
}), 66);
__d("XControllerURIBuilder", ["invariant", "URI", "gkx", "isInternalFBURI"], (function(a, b, c, d, e, f, g, h) {
    var i;
    a = function() {
        function a(a, b) {
            this.$1 = {}, this.$2 = a, this.$3 = b
        }
        var b = a.prototype;
        b.setInt = function(a, b) {
            return this.__setParam(a, "Int", b)
        };
        b.setFBID = function(a, b) {
            return this.__setParam(a, "FBID", b)
        };
        b.setFloat = function(a, b) {
            return this.__setParam(a, "Float", b)
        };
        b.setString = function(a, b) {
            return this.__setParam(a, "String", b)
        };
        b.setExists = function(a, b) {
            b === !1 && (b = void 0);
            return this.__setParam(a, "Exists", b)
        };
        b.setBool = function(a, b) {
            return this.__setParam(a, "Bool", b)
        };
        b.setBoolVector = function(a, b) {
            return this.__setParam(a, "BoolVector", b)
        };
        b.setEnum = function(a, b) {
            return this.__setParam(a, "Enum", b)
        };
        b.setPath = function(a, b) {
            return this.__setParam(a, "Path", b)
        };
        b.setIntVector = function(a, b) {
            return this.__setParam(a, "IntVector", b)
        };
        b.setIntKeyset = function(a, b) {
            return this.__setParam(a, "IntKeyset", b)
        };
        b.setIntSet = function(a, b) {
            return this.__setParam(a, "IntSet", b.join(","))
        };
        b.setFloatVector = function(a, b) {
            return this.__setParam(a, "FloatVector", b)
        };
        b.setFloatSet = function(a, b) {
            return this.__setParam(a, "FloatSet", b.join(","))
        };
        b.setStringVector = function(a, b) {
            return this.__setParam(a, "StringVector", b)
        };
        b.setStringKeyset = function(a, b) {
            return this.__setParam(a, "StringKeyset", b)
        };
        b.setStringSet = function(a, b) {
            return this.__setParam(a, "StringSet", b)
        };
        b.setFBIDVector = function(a, b) {
            return this.__setParam(a, "FBIDVector", b)
        };
        b.setFBIDSet = function(a, b) {
            return this.__setParam(a, "FBIDSet", b)
        };
        b.setFBIDKeyset = function(a, b) {
            return this.__setParam(a, "FBIDKeyset", b)
        };
        b.setEnumVector = function(a, b) {
            return this.__setParam(a, "EnumVector", b)
        };
        b.setEnumSet = function(a, b) {
            return this.__setParam(a, "EnumSet", b)
        };
        b.setEnumKeyset = function(a, b) {
            return this.__setParam(a, "EnumKeyset", b)
        };
        b.setIntToIntMap = function(a, b) {
            return this.__setParam(a, "IntToIntMap", b)
        };
        b.setIntToFloatMap = function(a, b) {
            return this.__setParam(a, "IntToFloatMap", b)
        };
        b.setIntToStringMap = function(a, b) {
            return this.__setParam(a, "IntToStringMap", b)
        };
        b.setIntToBoolMap = function(a, b) {
            return this.__setParam(a, "IntToBoolMap", b)
        };
        b.setStringToIntMap = function(a, b) {
            return this.__setParam(a, "StringToIntMap", b)
        };
        b.setStringToFloatMap = function(a, b) {
            return this.__setParam(a, "StringToFloatMap", b)
        };
        b.setStringToStringMap = function(a, b) {
            return this.__setParam(a, "StringToStringMap", b)
        };
        b.setStringToNullableStringMap = function(a, b) {
            return this.__setParam(a, "StringToNullableStringMap", b)
        };
        b.setStringToBoolMap = function(a, b) {
            return this.__setParam(a, "StringToBoolMap", b)
        };
        b.setStringToEnumMap = function(a, b) {
            return this.__setParam(a, "StringToEnumMap", b)
        };
        b.setEnumToStringVectorMap = function(a, b) {
            return this.__setParam(a, "EnumToStringVectorMap", b)
        };
        b.setEnumToStringMap = function(a, b) {
            return this.__setParam(a, "EnumToStringMap", b)
        };
        b.setEnumToBoolMap = function(a, b) {
            return this.__setParam(a, "EnumToBoolMap", b)
        };
        b.setEnumToEnumMap = function(a, b) {
            return this.__setParam(a, "EnumToEnumMap", b)
        };
        b.setEnumToIntMap = function(a, b) {
            return this.__setParam(a, "EnumToIntMap", b)
        };
        b.setEnumToFBIDVectorMap = function(a, b) {
            return this.__setParam(a, "EnumToFBIDVectorMap", b)
        };
        b.setStringToIntDict = function(a, b) {
            return this.__setParam(a, "StringToIntDict", b)
        };
        b.setStringToNullableIntDict = function(a, b) {
            return this.__setParam(a, "StringToNullableIntDict", b)
        };
        b.setStringToFloatDict = function(a, b) {
            return this.__setParam(a, "StringToFloatDict", b)
        };
        b.setStringToStringKeysetDict = function(a, b) {
            return this.__setParam(a, "StringToStringKeysetDict", b)
        };
        b.setStringToNullableFloatDict = function(a, b) {
            return this.__setParam(a, "StringToNullableFloatDict", b)
        };
        b.setStringToStringDict = function(a, b) {
            return this.__setParam(a, "StringToStringDict", b)
        };
        b.setStringToNullableStringDict = function(a, b) {
            return this.__setParam(a, "StringToNullableStringDict", b)
        };
        b.setStringToBoolDict = function(a, b) {
            return this.__setParam(a, "StringToBoolDict", b)
        };
        b.setStringToEnumDict = function(a, b) {
            return this.__setParam(a, "StringToEnumDict", b)
        };
        b.setEnumToIntDict = function(a, b) {
            return this.__setParam(a, "EnumToIntDict", b)
        };
        b.setEnumToStringDict = function(a, b) {
            return this.__setParam(a, "EnumToStringDict", b)
        };
        b.setHackType = function(a, b) {
            return this.__setParam(a, "HackType", b)
        };
        b.setTypeAssert = function(a, b) {
            return this.__setParam(a, "TypeAssert", b)
        };
        b.__validateRequiredParamsExistence = function() {
            for (var a in this.$3) !this.$3[a].required || Object.prototype.hasOwnProperty.call(this.$1, a) || h(0, 903, a)
        };
        b.setParams = function(a) {
            for (var b in a) {
                this.__assertParamExists(b);
                var c = this.$3[b].type;
                this.__setParam(b, c, a[b])
            }
            return this
        };
        b.__assertParamExists = function(a) {
            a in this.$3 || h(0, 37339, a)
        };
        b.__setParam = function(a, b, c) {
            this.__assertParamExists(a);
            var d = this.$3[a].type,
                e = {
                    StringOrPFBID: "String",
                    IntOrPFBID: "Int",
                    FBIDOrPFBID: "FBID",
                    PaymentLegacyAdAccountID: "Int"
                };
            e = e[d];
            d === b || e === b || h(0, 37340, a, b, d);
            this.__setParamInt(a, c);
            return this
        };
        b.__setParamInt = function(a, b) {
            this.$1[a] = b
        };
        b.getRequest_LEGACY_UNTYPED = function(a) {
            return a.setReplaceTransportMarkers().setURI(this.getURI())
        };
        b.setPreviousActorIsPageVoice = function(a) {
            this.__setParamInt("paipv", a ? 1 : 0);
            return this
        };
        b.getURI = function() {
            this.__validateRequiredParamsExistence();
            var a = {},
                b = "",
                d = /^(.*)?\{(\?)?(\*)?(.+?)\}(.*)?$/,
                e = this.$2.split("/"),
                f = !1;
            for (var g = 0; g < e.length; g++) {
                var j = e[g];
                if (j === "") continue;
                var k = d.exec(j);
                if (!k) b += "/" + j;
                else {
                    j = k[2] === "?";
                    var l = k[4],
                        m = this.$3[l];
                    m || h(0, 11837, l, this.$2);
                    if (j && f) continue;
                    if (this.$1[l] == null && j) {
                        f = !0;
                        continue
                    }
                    j = this.$1[l] != null ? this.$1[l] : m.defaultValue;
                    j != null || h(0, 907, l);
                    m = k[1] ? k[1] : "";
                    k = k[5] ? k[5] : "";
                    b += "/" + m + j + k;
                    a[l] = !0
                }
            }
            this.$2.slice(-1) === "/" && (b += "/");
            b === "" && (b = "/");
            m = new(i || (i = c("URI")))(b);
            for (j in this.$1) {
                k = this.$1[j];
                if (!a[j] && k != null) {
                    l = this.$3[j];
                    m.addQueryData(j, l && l.type === "Exists" ? null : k)
                }
            }
            return m
        };
        b.getLookasideURI = function() {
            var a = "lookaside.facebook.com";
            c("isInternalFBURI")((i || (i = c("URI"))).getRequestURI()) ? a = "lookaside.internalfb.com" : c("gkx")("21116") && (a = "lookaside.internmc.facebook.com");
            return this.getURI().setDomain(a).setProtocol("https")
        };
        a.create = function(b, c) {
            return function() {
                return new a(b, c)
            }
        };
        return a
    }();
    a.prototype.getRequest = function(a) {
        return this.getRequest_LEGACY_UNTYPED(a)
    };
    g["default"] = a
}), 98);
__d("XRequest", ["invariant"], (function(a, b, c, d, e, f, g) {
    var h = function a(b, c, d) {
        var e;
        switch (b) {
            case "Bool":
                e = c && c !== "false" && c !== "0" || !1;
                break;
            case "Int":
                e = c.toString();
                /-?\d+/.test(e) || g(0, 11839, c);
                break;
            case "Float":
                e = parseFloat(c, 10);
                isNaN(e) && g(0, 11840, c);
                break;
            case "FBID":
                e = c.toString();
                for (var f = 0; f < e.length; ++f) {
                    var h = e.charCodeAt(f);
                    48 <= h && h <= 57 || g(0, 11841, c)
                }
                break;
            case "String":
                e = c.toString();
                break;
            case "Enum":
                d === 0 ? e = a("Int", c, null) : d === 1 ? e = a("String", c, null) : d === 2 ? e = c : g(0, 5044, d);
                break;
            default:
                if (h = /^Nullable(\w+)$/.exec(b)) c === null ? e = null : e = a(h[1], c, d);
                else if (f = /^(\w+)Vector$/.exec(b)) {
                    !Array.isArray(c) ? (e = c.toString(), e = e === "" ? [] : e.split(",")) : e = c;
                    var i = f[1];
                    typeof i === "string" || g(0, 5045);
                    e = e.map(function(b) {
                        return a(i, b, d && d.member)
                    })
                } else if (h = /^(\w+)(Set|Keyset)$/.exec(b)) !Array.isArray(c) ? (e = c.toString(), e = e === "" ? [] : e.split(",")) : e = c, e = e.reduce(function(a, b) {
                    a[b] = b;
                    return a
                }, {}), i = h[1], typeof i === "string" || g(0, 5045), e = Object.keys(e).map(function(b) {
                    return a(i, e[b], d && d.member)
                });
                else if (f = /^(\w+)To(\w+)Map$/.exec(b)) {
                    e = {};
                    var j = f[1],
                        k = f[2];
                    typeof j === "string" && typeof k === "string" || g(0, 5045);
                    Object.keys(c).forEach(function(b) {
                        e[a(j, b, d && d.key)] = a(k, c[b], d && d.value)
                    })
                } else g(0, 11842, b)
        }
        return e
    };
    a = function() {
        function a(a, b, c) {
            var d = this;
            this.$1 = b;
            this.$2 = babelHelpers["extends"]({}, c.getQueryData());
            b = a.split("/").filter(function(a) {
                return a
            });
            a = c.getPath().split("/").filter(function(a) {
                return a
            });
            var e;
            for (var f = 0; f < b.length; ++f) {
                var h = /^\{(\?)?(\*)?(\w+)\}$/.exec(b[f]);
                if (!h) {
                    b[f] === a[f] || g(0, 5047, c.getPath());
                    continue
                }
                var i = !!h[1],
                    j = !!h[2];
                !j || f === b.length - 1 || g(0, 11843, e);
                e = h[3];
                Object.prototype.hasOwnProperty.call(this.$1, e) || g(0, 11844, e);
                this.$1[e].required ? i && g(0, 5050, e) : i || this.$1[e].defaultValue != null || g(0, 5057, e);
                a[f] && (this.$2[e] = j ? a.slice(f).join("/") : a[f])
            }
            Object.keys(this.$1).forEach(function(a) {
                !d.$1[a].required || Object.prototype.hasOwnProperty.call(d.$2, a) || g(0, 5051)
            })
        }
        var b = a.prototype;
        b.getExists = function(a) {
            return this.$2[a] !== void 0
        };
        b.getBool = function(a) {
            return this.$3(a, "Bool")
        };
        b.getInt = function(a) {
            return this.$3(a, "Int")
        };
        b.getFloat = function(a) {
            return this.$3(a, "Float")
        };
        b.getFBID = function(a) {
            return this.$3(a, "FBID")
        };
        b.getString = function(a) {
            return this.$3(a, "String")
        };
        b.getEnum = function(a) {
            return this.$3(a, "Enum")
        };
        b.getOptionalInt = function(a) {
            return this.$4(a, "Int")
        };
        b.getOptionalFloat = function(a) {
            return this.$4(a, "Float")
        };
        b.getOptionalFBID = function(a) {
            return this.$4(a, "FBID")
        };
        b.getOptionalString = function(a) {
            return this.$4(a, "String")
        };
        b.getOptionalEnum = function(a) {
            return this.$4(a, "Enum")
        };
        b.getIntVector = function(a) {
            return this.$3(a, "IntVector")
        };
        b.getFloatVector = function(a) {
            return this.$3(a, "FloatVector")
        };
        b.getFBIDVector = function(a) {
            return this.$3(a, "FBIDVector")
        };
        b.getStringVector = function(a) {
            return this.$3(a, "StringVector")
        };
        b.getEnumVector = function(a) {
            return this.$3(a, "EnumVector")
        };
        b.getOptionalIntVector = function(a) {
            return this.$4(a, "IntVector")
        };
        b.getOptionalFloatVector = function(a) {
            return this.$4(a, "FloatVector")
        };
        b.getOptionalFBIDVector = function(a) {
            return this.$4(a, "FBIDVector")
        };
        b.getOptionalStringVector = function(a) {
            return this.$4(a, "StringVector")
        };
        b.getOptionalEnumVector = function(a) {
            return this.$4(a, "EnumVector")
        };
        b.getIntSet = function(a) {
            return this.$3(a, "IntSet")
        };
        b.getFBIDSet = function(a) {
            return this.$3(a, "FBIDSet")
        };
        b.getFBIDKeyset = function(a) {
            return this.$3(a, "FBIDKeyset")
        };
        b.getStringSet = function(a) {
            return this.$3(a, "StringSet")
        };
        b.getEnumKeyset = function(a) {
            return this.$3(a, "EnumKeyset")
        };
        b.getOptionalIntSet = function(a) {
            return this.$4(a, "IntSet")
        };
        b.getOptionalFBIDSet = function(a) {
            return this.$4(a, "FBIDSet")
        };
        b.getOptionalFBIDKeyset = function(a) {
            return this.$4(a, "FBIDKeyset")
        };
        b.getOptionalStringSet = function(a) {
            return this.$4(a, "StringSet")
        };
        b.getEnumToBoolMap = function(a) {
            return this.$3(a, "EnumToBoolMap")
        };
        b.getEnumToEnumMap = function(a) {
            return this.$3(a, "EnumToEnumMap")
        };
        b.getEnumToFloatMap = function(a) {
            return this.$3(a, "EnumToFloatMap")
        };
        b.getEnumToIntMap = function(a) {
            return this.$3(a, "EnumToIntMap")
        };
        b.getEnumToStringMap = function(a) {
            return this.$3(a, "EnumToStringMap")
        };
        b.getIntToBoolMap = function(a) {
            return this.$3(a, "IntToBoolMap")
        };
        b.getIntToEnumMap = function(a) {
            return this.$3(a, "IntToEnumMap")
        };
        b.getIntToFloatMap = function(a) {
            return this.$3(a, "IntToFloatMap")
        };
        b.getIntToIntMap = function(a) {
            return this.$3(a, "IntToIntMap")
        };
        b.getIntToStringMap = function(a) {
            return this.$3(a, "IntToStringMap")
        };
        b.getStringToBoolMap = function(a) {
            return this.$3(a, "StringToBoolMap")
        };
        b.getStringToEnumMap = function(a) {
            return this.$3(a, "StringToEnumMap")
        };
        b.getStringToFloatMap = function(a) {
            return this.$3(a, "StringToFloatMap")
        };
        b.getStringToIntMap = function(a) {
            return this.$3(a, "StringToIntMap")
        };
        b.getStringToStringMap = function(a) {
            return this.$3(a, "StringToStringMap")
        };
        b.getOptionalEnumToBoolMap = function(a) {
            return this.$4(a, "EnumToBoolMap")
        };
        b.getOptionalEnumToEnumMap = function(a) {
            return this.$4(a, "EnumToEnumMap")
        };
        b.getOptionalEnumToFloatMap = function(a) {
            return this.$4(a, "EnumToFloatMap")
        };
        b.getOptionalEnumToIntMap = function(a) {
            return this.$4(a, "EnumToIntMap")
        };
        b.getOptionalEnumToStringMap = function(a) {
            return this.$4(a, "EnumToStringMap")
        };
        b.getOptionalIntToBoolMap = function(a) {
            return this.$4(a, "IntToBoolMap")
        };
        b.getOptionalIntToEnumMap = function(a) {
            return this.$4(a, "IntToEnumMap")
        };
        b.getOptionalIntToFloatMap = function(a) {
            return this.$4(a, "IntToFloatMap")
        };
        b.getOptionalIntToIntMap = function(a) {
            return this.$4(a, "IntToIntMap")
        };
        b.getOptionalIntToStringMap = function(a) {
            return this.$4(a, "IntToStringMap")
        };
        b.getOptionalStringToBoolMap = function(a) {
            return this.$4(a, "StringToBoolMap")
        };
        b.getOptionalStringToEnumMap = function(a) {
            return this.$4(a, "StringToEnumMap")
        };
        b.getOptionalStringToFloatMap = function(a) {
            return this.$4(a, "StringToFloatMap")
        };
        b.getOptionalStringToIntMap = function(a) {
            return this.$4(a, "StringToIntMap")
        };
        b.getOptionalStringToStringMap = function(a) {
            return this.$4(a, "StringToStringMap")
        };
        b.getEnumToNullableEnumMap = function(a) {
            return this.$3(a, "EnumToNullableEnumMap")
        };
        b.getEnumToNullableFloatMap = function(a) {
            return this.$3(a, "EnumToNullableFloatMap")
        };
        b.getEnumToNullableIntMap = function(a) {
            return this.$3(a, "EnumToNullableIntMap")
        };
        b.getEnumToNullableStringMap = function(a) {
            return this.$3(a, "EnumToNullableStringMap")
        };
        b.getIntToNullableEnumMap = function(a) {
            return this.$3(a, "IntToNullableEnumMap")
        };
        b.getIntToNullableFloatMap = function(a) {
            return this.$3(a, "IntToNullableFloatMap")
        };
        b.getIntToNullableIntMap = function(a) {
            return this.$3(a, "IntToNullableIntMap")
        };
        b.getIntToNullableStringMap = function(a) {
            return this.$3(a, "IntToNullableStringMap")
        };
        b.getStringToNullableEnumMap = function(a) {
            return this.$3(a, "StringToNullableEnumMap")
        };
        b.getStringToNullableFloatMap = function(a) {
            return this.$3(a, "StringToNullableFloatMap")
        };
        b.getStringToNullableIntMap = function(a) {
            return this.$3(a, "StringToNullableIntMap")
        };
        b.getStringToNullableStringMap = function(a) {
            return this.$3(a, "StringToNullableStringMap")
        };
        b.getOptionalEnumToNullableEnumMap = function(a) {
            return this.$4(a, "EnumToNullableEnumMap")
        };
        b.getOptionalEnumToNullableFloatMap = function(a) {
            return this.$4(a, "EnumToNullableFloatMap")
        };
        b.getOptionalEnumToNullableIntMap = function(a) {
            return this.$4(a, "EnumToNullableIntMap")
        };
        b.getOptionalEnumToNullableStringMap = function(a) {
            return this.$4(a, "EnumToNullableStringMap")
        };
        b.getOptionalIntToNullableEnumMap = function(a) {
            return this.$4(a, "IntToNullableEnumMap")
        };
        b.getOptionalIntToNullableFloatMap = function(a) {
            return this.$4(a, "IntToNullableFloatMap")
        };
        b.getOptionalIntToNullableIntMap = function(a) {
            return this.$4(a, "IntToNullableIntMap")
        };
        b.getOptionalIntToNullableStringMap = function(a) {
            return this.$4(a, "IntToNullableStringMap")
        };
        b.getOptionalStringToNullableEnumMap = function(a) {
            return this.$4(a, "StringToNullableEnumMap")
        };
        b.getOptionalStringToNullableFloatMap = function(a) {
            return this.$4(a, "StringToNullableFloatMap")
        };
        b.getOptionalStringToNullableIntMap = function(a) {
            return this.$4(a, "StringToNullableIntMap")
        };
        b.getOptionalStringToNullableStringMap = function(a) {
            return this.$4(a, "StringToNullableStringMap")
        };
        b.$3 = function(a, b) {
            this.$5(a, b);
            var c = this.$1[a];
            if (!Object.prototype.hasOwnProperty.call(this.$2, a) && c.defaultValue != null) {
                c.required && g(0, 5052);
                return h(b, c.defaultValue, c.enumType)
            }
            c.required || b === "Bool" || c.defaultValue != null || g(0, 11845, b, a, b, a);
            return h(b, this.$2[a], c.enumType)
        };
        b.$4 = function(a, b) {
            this.$5(a, b);
            var c = this.$1[a];
            c.required && g(0, 11846, b, a, b, a);
            c.defaultValue && g(0, 5052);
            return Object.prototype.hasOwnProperty.call(this.$2, a) ? h(b, this.$2[a], c.enumType) : null
        };
        b.$5 = function(a, b) {
            Object.prototype.hasOwnProperty.call(this.$1, a) || g(0, 37317, a), this.$1[a].type === b || g(0, 11848, a, b, this.$1[a].type)
        };
        return a
    }();
    f["default"] = a
}), 66);
__d("XController", ["XControllerURIBuilder", "XRequest"], (function(a, b, c, d, e, f, g) {
    a = function() {
        function a(a, b) {
            this.$1 = a, this.$2 = b
        }
        var b = a.prototype;
        b.getURIBuilder = function(a) {
            var b = this,
                d = new(c("XControllerURIBuilder"))(this.$1, this.$2);
            if (a) {
                var e = this.getRequest(a);
                Object.keys(this.$2).forEach(function(a) {
                    var c = b.$2[a],
                        f = "";
                    !c.required && !Object.prototype.hasOwnProperty.call(c, "defaultValue") && (f = "Optional");
                    f = "get" + f + c.type;
                    f = e[f](a);
                    if (f == null || Object.prototype.hasOwnProperty.call(c, "defaultValue") && f === c.defaultValue) return;
                    c = "set" + c.type;
                    d[c](a, f)
                })
            }
            return d
        };
        b.getRequest = function(a) {
            return new(c("XRequest"))(this.$1, this.$2, a)
        };
        a.create = function(b, c) {
            return new a(b, c)
        };
        return a
    }();
    g["default"] = a
}), 98);
__d("XIntlAccountSetLocaleAsyncController", ["XController"], (function(a, b, c, d, e, f) {
    e.exports = b("XController").create("/intl/ajax/save_locale/", {
        loc: {
            type: "String"
        },
        href: {
            type: "String"
        },
        index: {
            type: "Int"
        },
        ref: {
            type: "String"
        },
        ls_ref: {
            type: "Enum",
            defaultValue: "unknown",
            enumType: 1
        },
        should_redirect: {
            type: "Bool",
            defaultValue: !0
        },
        is_caa: {
            type: "Bool",
            defaultValue: !1
        }
    })
}), null);
__d("XIntlSaveXModeAsyncController", ["XController"], (function(a, b, c, d, e, f) {
    e.exports = b("XController").create("/ajax/intl/save_xmode/", {})
}), null);
__d("IntlUtils", ["invariant", "AsyncRequest", "Cookie", "LoggedOutSwitchingLocaleTypedLogger", "ReloadPage", "XIntlAccountSetLocaleAsyncController", "XIntlSaveXModeAsyncController", "goURI"], (function(a, b, c, d, e, f, g, h) {
    var i = c("XIntlSaveXModeAsyncController").getURIBuilder().getURI();

    function a(a) {
        new(c("AsyncRequest"))().setURI(i).setData({
            xmode: a
        }).setHandler(function() {
            d("ReloadPage").now()
        }).send()
    }

    function b(a) {
        return a.replace(new RegExp("\xa0", "g"), "&nbsp;")
    }

    function e(a) {
        return a.replace(new RegExp("&nbsp;", "g"), "\xa0")
    }

    function f(a) {
        new(c("AsyncRequest"))().setURI(i).setData({
            rmode: a
        }).setHandler(function() {
            d("ReloadPage").now()
        }).send()
    }

    function j(a) {
        new(c("AsyncRequest"))().setURI(i).setData({
            string_manager_mode: a
        }).setHandler(function() {
            d("ReloadPage").now()
        }).send()
    }

    function k(a, b, e, f) {
        f = e;
        f || (a != null || h(0, 19476), f = a.options[a.selectedIndex].value);
        e = c("XIntlAccountSetLocaleAsyncController").getURIBuilder().getURI();
        new(c("AsyncRequest"))().setURI(e).setData({
            loc: f,
            ref: b,
            should_redirect: !1
        }).setHandler(function(a) {
            d("ReloadPage").now()
        }).send()
    }

    function l(a) {
        var b = "lh",
            d = c("Cookie").get(b),
            e = [],
            f = 5;
        if (d != null && d != "") {
            e = d.split(",");
            e.push(a);
            for (d = 0; d < e.length - 1; d++) e[d] == e[d + 1] && e.splice(d, 1);
            e.length >= f && e.slice(1, f)
        } else e.push(a);
        c("Cookie").set(b, e.toString())
    }

    function m(a, b, d, e, f) {
        e === void 0 && (e = "unknown"), f === void 0 && (f = null), c("Cookie").setWithoutCheckingUserConsent_DANGEROUS("locale", a), l(a), new(c("LoggedOutSwitchingLocaleTypedLogger"))().setNewLocale(a).setOldLocale(b).setIndex(f).setReferrer(e).log(), c("goURI")(d)
    }
    g.setXmode = a;
    g.encodeSpecialCharsForXController = b;
    g.decodeSpecialCharsFromXController = e;
    g.setRmode = f;
    g.setSmode = j;
    g.setLocale = k;
    g.appendCookieLocaleHistory = l;
    g.setCookieLocale = m
}), 98);
__d("KeyboardActivityTypedLogger", ["Banzai", "GeneratedLoggerUtils"], (function(a, b, c, d, e, f) {
    "use strict";
    a = function() {
        function a() {
            this.$1 = {}
        }
        var c = a.prototype;
        c.log = function(a) {
            b("GeneratedLoggerUtils").log("logger:KeyboardActivityLoggerConfig", this.$1, b("Banzai").BASIC, a)
        };
        c.logVital = function(a) {
            b("GeneratedLoggerUtils").log("logger:KeyboardActivityLoggerConfig", this.$1, b("Banzai").VITAL, a)
        };
        c.logImmediately = function(a) {
            b("GeneratedLoggerUtils").log("logger:KeyboardActivityLoggerConfig", this.$1, {
                signal: !0
            }, a)
        };
        c.clear = function() {
            this.$1 = {};
            return this
        };
        c.getData = function() {
            return babelHelpers["extends"]({}, this.$1)
        };
        c.updateData = function(a) {
            this.$1 = babelHelpers["extends"]({}, this.$1, a);
            return this
        };
        c.setDuration = function(a) {
            this.$1.duration = a;
            return this
        };
        c.setKey = function(a) {
            this.$1.key = a;
            return this
        };
        return a
    }();
    c = {
        duration: !0,
        key: !0
    };
    f["default"] = a
}), 66);
__d("KeyboardActivityLogger", ["Event", "KeyboardActivityTypedLogger", "Keys", "isElementInteractive"], (function(a, b, c, d, e, f, g) {
    b = ["tab", "right", "left", "up", "down", "enter"];
    var h = b.reduce(function(a, b) {
            a[b] = {
                count: 0,
                startTS: 0
            };
            return a
        }, {}),
        i = 20;

    function a() {
        document.addEventListener("keydown", j)
    }

    function j(a) {
        var b = a.getTarget();
        if (c("isElementInteractive")(b)) return;
        switch (c("Event").getKeyCode(a)) {
            case c("Keys").TAB:
                k("tab");
                break;
            case c("Keys").RIGHT:
                k("right");
                break;
            case c("Keys").LEFT:
                k("left");
                break;
            case c("Keys").UP:
                k("up");
                break;
            case c("Keys").DOWN:
                k("down");
                break;
            case c("Keys").RETURN:
                k("enter");
                break
        }
    }

    function k(a) {
        var b = h[a];
        b.count++;
        b.startTS === 0 && (b.startTS = Date.now());
        b.count === i && (l(a), b.count = 0, b.startTS = 0)
    }

    function l(a) {
        var b = h[a];
        b = Date.now() - b.startTS;
        new(c("KeyboardActivityTypedLogger"))().setKey(a).setDuration(b).log()
    }
    g.init = a;
    g._listenForKey = j;
    g._checkKeyActivity = k;
    g._log = l
}), 98);
__d("LoginServicePasswordEncryptDecryptEventTypedLogger", ["Banzai", "GeneratedLoggerUtils"], (function(a, b, c, d, e, f) {
    "use strict";
    a = function() {
        function a() {
            this.$1 = {}
        }
        var c = a.prototype;
        c.log = function(a) {
            b("GeneratedLoggerUtils").log("logger:LoginServicePasswordEncryptDecryptEventLoggerConfig", this.$1, b("Banzai").BASIC, a)
        };
        c.logVital = function(a) {
            b("GeneratedLoggerUtils").log("logger:LoginServicePasswordEncryptDecryptEventLoggerConfig", this.$1, b("Banzai").VITAL, a)
        };
        c.logImmediately = function(a) {
            b("GeneratedLoggerUtils").log("logger:LoginServicePasswordEncryptDecryptEventLoggerConfig", this.$1, {
                signal: !0
            }, a)
        };
        c.clear = function() {
            this.$1 = {};
            return this
        };
        c.getData = function() {
            return babelHelpers["extends"]({}, this.$1)
        };
        c.updateData = function(a) {
            this.$1 = babelHelpers["extends"]({}, this.$1, a);
            return this
        };
        c.setAccountID = function(a) {
            this.$1.account_id = a;
            return this
        };
        c.setCredentialsType = function(a) {
            this.$1.credentials_type = a;
            return this
        };
        c.setDebugInfo = function(a) {
            this.$1.debug_info = a;
            return this
        };
        c.setDecryptMethod = function(a) {
            this.$1.decrypt_method = a;
            return this
        };
        c.setDeviceID = function(a) {
            this.$1.device_id = a;
            return this
        };
        c.setError = function(a) {
            this.$1.error = a;
            return this
        };
        c.setErrorMessage = function(a) {
            this.$1.error_message = a;
            return this
        };
        c.setGrowthFlow = function(a) {
            this.$1.growth_flow = a;
            return this
        };
        c.setPasswordEncryptionVersion = function(a) {
            this.$1.password_encryption_version = a;
            return this
        };
        c.setPasswordTag = function(a) {
            this.$1.password_tag = a;
            return this
        };
        c.setPasswordTimestamp = function(a) {
            this.$1.password_timestamp = a;
            return this
        };
        c.setStacktrace = function(a) {
            this.$1.stacktrace = b("GeneratedLoggerUtils").serializeVector(a);
            return this
        };
        c.setUniverse = function(a) {
            this.$1.universe = a;
            return this
        };
        return a
    }();
    c = {
        account_id: !0,
        credentials_type: !0,
        debug_info: !0,
        decrypt_method: !0,
        device_id: !0,
        error: !0,
        error_message: !0,
        growth_flow: !0,
        password_encryption_version: !0,
        password_tag: !0,
        password_timestamp: !0,
        stacktrace: !0,
        universe: !0
    };
    f["default"] = a
}), 66);
__d("LoginFormController", ["AsyncRequest", "BDClientSignalCollectionTrigger", "BDSignalCollectionData", "Base64", "Button", "Cookie", "DOM", "DeferredCookie", "Event", "FBBrowserPasswordEncryption", "FBLogger", "Form", "FormTypeABTester", "LoginServicePasswordEncryptDecryptEventTypedLogger", "WebStorage", "bx", "ge", "goURI", "guid", "promiseDone"], (function(a, b, c, d, e, f, g) {
    var h, i = {
        init: function(a, b, d, e, f, g) {
            g === void 0 && (g = !1), i._initShared(a, b, d, e, f, g), i.isCredsManagerEnabled = !1, !f || !f.pubKey ? c("Event").listen(a, "submit", i._sendLoginShared.bind(i)) : c("Event").listen(a, "submit", function(b) {
                b.preventDefault(), i._sendLoginShared.bind(i)(), i._encryptBeforeSending(function() {
                    a.submit()
                })
            })
        },
        initAsync: function(a, b, d, e, f, g) {
            g === void 0 && (g = !1), i._initShared(a, b, d, e, f, g), i.isCredsManagerEnabled = !0, i.emailInput = c("DOM").scry(a, 'input[id="email"]')[0], i.passwordInput = c("DOM").scry(a, 'input[id="pass"]')[0], i.errorBox = c("DOM").scry(a, 'input[id="error_box"]')[0], c("Event").listen(a, "submit", function(a) {
                a.preventDefault(), i._sendLoginRequest()
            }), i._initSmartLockAccountChooser()
        },
        _initShared: function(a, b, d, e, f, g) {
            g === void 0 && (g = !1);
            i.loginForm = a;
            i.loginButton = b;
            i.abTesting = e;
            i.loginFormParams = f;
            i.sharedPrefs = g;
            i.loginForm.shared_prefs_data && void c("BDClientSignalCollectionTrigger").startLoginTimeSignalCollection(c("BDSignalCollectionData"));
            i.abTesting && (i.formABTest = new(c("FormTypeABTester"))(a));
            b = c("ge")("lgnjs");
            e = Math.floor(Date.now() / 1e3);
            b && (b.value = e);
            var j = (h || (h = c("WebStorage"))).getSessionStorage();
            f = j != null ? parseInt(j.getItem("LoginPollRateLimit"), 10) : 0;
            g = d != null;
            f > e - 60 && (g = !1);
            if (g) {
                var k;
                a = function() {
                    c("Cookie").get("c_user") != null && (window.clearInterval(k), j != null && j.setItem("LoginPollRateLimit", Math.floor(Date.now() / 1e3).toString()), c("goURI")(d))
                };
                k = window.setInterval(a, 1e3);
                a()
            }
        },
        _encryptBeforeSending: function(a) {
            a = a.bind(i);
            var d = i.loginFormParams && i.loginFormParams.pubKey;
            if ((window.crypto || window.msCrypto) && d) {
                var e = c("DOM").scry(i.loginForm, 'input[id="pass"]')[0],
                    f = b("FBBrowserPasswordEncryption"),
                    g = Math.floor(Date.now() / 1e3).toString();
                c("promiseDone")(f.encryptPassword(d.keyId, d.publicKey, e.value, g), function(b) {
                    b = c("DOM").create("input", {
                        type: "hidden",
                        name: "encpass",
                        value: b
                    });
                    i.loginForm.appendChild(b);
                    e.disabled = !0;
                    a()
                }, function(c) {
                    var d = "#PWD_BROWSER",
                        e = 5,
                        f = b("LoginServicePasswordEncryptDecryptEventTypedLogger");
                    new f().setError("BrowserEncryptionFailureInLoginFormControllerWWW").setGrowthFlow("Bluebar/main login WWW").setErrorMessage(c.message).setPasswordTag(d).setPasswordEncryptionVersion(e).setPasswordTimestamp(g).logVital();
                    a()
                })
            } else a()
        },
        _sendLoginShared: function() {
            i.abTesting && i.loginForm.ab_test_data && (i.loginForm.ab_test_data.value = i.formABTest.getData());
            i.sharedPrefs && i.loginForm.shared_prefs_data && (i.loginForm.shared_prefs_data.value = c("Base64").encode(c("BDClientSignalCollectionTrigger").getSignalsAsJSONString()));
            var a = c("guid")();
            i.loginForm.guid && (i.loginForm.guid.value = a);
            window.__cookieReload && window.clearInterval(window.__cookieReload);
            try {
                c("Button").setEnabled(i.loginButton, !1)
            } catch (a) {
                i.loginButton.disabled = !0
            }
            window.setTimeout(function() {
                (function() {
                    try {
                        c("Button").setEnabled(i.loginButton, !0)
                    } catch (a) {
                        i.loginButton.disabled = !1
                    }
                })
            }, 15e3);
            c("DeferredCookie").flushAllCookiesWithoutRecordingConsentDONOTCALLBEFORECONSENT()
        },
        _sendLoginRequest: function() {
            i._sendLoginShared();
            if (i.login_form_params && i.login_form_params.pubKey) i._encryptBeforeSending(function() {
                var a = d("Form").serialize(i.loginForm);
                new(c("AsyncRequest"))().setURI(i.loginForm).setData(a).setHandler(i._onLoginResponse.bind(i)).send()
            });
            else {
                var a = d("Form").serialize(i.loginForm);
                new(c("AsyncRequest"))().setURI(i.loginForm.action).setData(a).setHandler(i._onLoginResponse.bind(i)).send()
            }
        },
        _onLoginResponse: function(a) {
            a = a.getPayload();
            if (a === null || a.error === null) return;
            c("DOM").replace(i.errorBox, a.error);
            c("Button").setEnabled(i.loginButton, !0)
        },
        redirect: function(a) {
            if (i.isCredsManagerEnabled) {
                var b = c("bx").getURL(c("bx")("875231"));
                b = new window.PasswordCredential({
                    id: i.emailInput.value,
                    password: i.passwordInput.value,
                    iconURL: b
                });
                navigator.credentials && navigator.credentials.store(b).then(function() {
                    window.setTimeout(function() {
                        window.location.replace(a)
                    }, 3e3)
                })["catch"](function() {
                    window.location.replace(a)
                })
            } else window.location.replace(a)
        },
        _initSmartLockAccountChooser: function(a) {
            a === void 0 && (a = "silent"), window.PasswordCredential && (navigator.credentials !== null && navigator.credentials.get({
                password: !0,
                mediation: a
            }).then(function(b) {
                b !== null && b.type === "password" && b.password !== null && b.id !== null ? (i.emailInput.setAttribute("value", b.id), i.passwordInput.setAttribute("value", b.password), a === "required" && i._sendLoginRequest()) : (i.passwordInput.setAttribute("value", ""), a === "silent" && i._initSmartLockAccountChooser("required"))
            })["catch"](function(a) {
                c("FBLogger")("login").catching(a).warn("smart lock promise fail")
            }))
        }
    };
    a = i;
    g["default"] = a
}), 98);
__d("LoginbarPopover", ["CSS", "ge", "getActiveElement"], (function(a, b, c, d, e, f) {
    var g = 1e3;
    a = {
        init: function(a, c, d) {
            var e = this,
                f = b("ge")("email", d);
            setTimeout(function() {
                return e.show(a, d, f)
            }, g);
            c.addEventListener("click", function(a) {
                a.kill(), e.toggle(d, f)
            });
            a.style.visibility = "visible"
        },
        show: function(a, c, d) {
            b("CSS").show(c);
            a = b("getActiveElement")().tagName.toLowerCase();
            a !== "input" && a !== "textarea" && d.focus()
        },
        toggle: function(a, c) {
            b("CSS").toggle(a), b("CSS").shown(a) && c.focus()
        }
    };
    e.exports = a
}), null);
__d("NoscriptOverride", ["Cookie", "goURI"], (function(a, b, c, d, e, f) {
    a = {
        redirectToJSPage: function(a) {
            b("Cookie").clear("noscript"), b("goURI")(a)
        }
    };
    e.exports = a
}), null);
__d("ResetScrollOnUnload", ["Run"], (function(a, b, c, d, e, f, g) {
    function a() {
        d("Run").onUnload(function() {
            window.history.scrollRestoration = "manual"
        })
    }

    function b(a) {
        d("Run").onUnload(function() {
            window.history.scrollRestoration = "manual", a.style.opacity = "0", window.scrollTo(0, 0)
        })
    }
    g.disableScrollRestoration = a;
    g.init = b
}), 98);
__d("ScreenDimensionsAutoSet", [], (function(a, b, c, d, e, f) {
    function g() {
        if (!window.btoa) return "";
        var a = {
            w: screen.width,
            h: screen.height,
            aw: screen.availWidth,
            ah: screen.availHeight,
            c: screen.colorDepth
        };
        return btoa(JSON.stringify(a))
    }

    function a(a) {
        a.value = g()
    }
    f.getScreenDimensions = g;
    f.setInputValue = a
}), 66);
__d("jsExtraRouteBuilder", ["jsRouteBuilder", "unrecoverableViolation"], (function(a, b, c, d, e, f, g) {
    "use strict";

    function a(a, b, d, e) {
        var f = c("jsRouteBuilder")(a, b, e),
            g = d.reduce(function(a, d) {
                a === void 0 && (a = {});
                typeof d === "string" && (a[d] = c("jsRouteBuilder")(d, b, e, null, !0).buildURL);
                return a
            }, {});
        return {
            buildExtraURL: function(a, b) {
                if (typeof a !== "string" || g[a] == null) throw c("unrecoverableViolation")("Route builder for extra path does not exist", "comet_infra");
                return g[a](b)
            },
            buildUri: function(a) {
                return f.buildUri(a)
            },
            buildURL: function(a) {
                return f.buildURL(a)
            }
        }
    }
    g["default"] = a
}), 98);
__d("XUpdateTimezoneControllerRouteBuilder", ["jsExtraRouteBuilder"], (function(a, b, c, d, e, f, g) {
    a = c("jsExtraRouteBuilder")("/ajax/autoset_timezone_ajax/", Object.freeze({
        is_forced: !1
    }), ["/ajax/autoset_timezone_ajax.php", "/ajax/timezone/update/", "/ajax/timezone/update.php"], void 0);
    b = a;
    g["default"] = b
}), 98);
__d("getBrowserGMTOffsetAdjustedForSkew", ["DateConsts", "FBLogger"], (function(a, b, c, d, e, f, g) {
    "use strict";

    function a(a) {
        var b, e = (b = d("DateConsts")).MIN_PER_HOUR * b.HOUR_PER_DAY,
            f = new Date(),
            g = f.getTimezoneOffset();
        f = f.getTime() / b.MS_PER_SEC;
        var h = 15;
        a = a - f;
        f = Math.round(a / (h * b.SEC_PER_MIN)) * h;
        f != 0 && c("FBLogger")("TimezoneAutoset").info("Adjusting timezone offset for clock skew. Browser offset: %s. Raw skew %s. Rounded skew %s", g, a, f);
        b = Math.round(g + f) % e;
        b > 12 * d("DateConsts").MIN_PER_HOUR ? b -= e : b < -14 * d("DateConsts").MIN_PER_HOUR && (b += e);
        return b
    }
    g["default"] = a
}), 98);
__d("getBrowserTimezone", ["FBLogger"], (function(a, b, c, d, e, f, g) {
    "use strict";

    function a() {
        try {
            var a;
            a = ((a = window.Intl) == null ? void 0 : a.DateTimeFormat) && Intl.DateTimeFormat();
            a = (a == null ? void 0 : a.resolvedOptions) && a.resolvedOptions();
            return a == null ? void 0 : a.timeZone
        } catch (a) {
            c("FBLogger")("TimezoneAutoset").catching(a).warn("Could not read IANA timezone from browser");
            return null
        }
    }
    g["default"] = a
}), 98);
__d("TimezoneAutoset", ["AsyncRequest", "XUpdateTimezoneControllerRouteBuilder", "emptyFunction", "getBrowserGMTOffsetAdjustedForSkew", "getBrowserTimezone", "killswitch"], (function(a, b, c, d, e, f) {
    var g = !1;

    function a(a, b, c) {
        h({
            serverTimestamp: a,
            serverTimezone: null,
            serverGmtOffset: b,
            forceUpdate: c
        })
    }

    function h(a) {
        var c = a.serverTimestamp,
            d = a.serverTimezone,
            e = a.serverGmtOffset;
        a = a.forceUpdate;
        if (!c || e == null) return;
        if (g) return;
        g = !0;
        c = -b("getBrowserGMTOffsetAdjustedForSkew")(c);
        var f = b("killswitch")("TIMEZONE_SET_IANA_ZONE_NAME") ? null : b("getBrowserTimezone")();
        if (a || c != e || f != null && f != d) {
            e = b("XUpdateTimezoneControllerRouteBuilder").buildExtraURL("/ajax/timezone/update.php", {});
            new(b("AsyncRequest"))().setURI(e).setData({
                tz: f,
                gmt_off: c,
                is_forced: a
            }).setErrorHandler(b("emptyFunction")).setTransportErrorHandler(b("emptyFunction")).setOption("suppressErrorAlerts", !0).send()
        }
    }
    c = {
        setInputValue: function(a, c) {
            a.value = b("getBrowserGMTOffsetAdjustedForSkew")(c).toString()
        },
        setTimezone: a,
        getBrowserTimezone: b("getBrowserTimezone"),
        setTimezoneAndOffset: h
    };
    e.exports = c
}), null);
__d("UITinyViewportAction", ["Arbiter", "ArbiterMixin", "CSS", "Event", "FullScreen", "getDocumentScrollElement", "queryThenMutateDOM", "throttle"], (function(a, b, c, d, e, f) {
    var g = document.documentElement,
        h, i, j, k, l = !1,
        m = !1,
        n = !1,
        o = {
            init: function(a) {
                a = b("throttle")(function() {
                    if (b("FullScreen").isFullScreen()) return;
                    b("queryThenMutateDOM")(function() {
                        k = k || b("getDocumentScrollElement")(), i = g.clientWidth < k.scrollWidth - 1, j = g.clientHeight < 400, h = j || i
                    }, function() {
                        if (h !== l || i !== m || j !== n) {
                            var a;
                            (a = b("CSS")).conditionClass(g, "tinyViewport", h);
                            a.conditionClass(g, "tinyWidth", i);
                            a.conditionClass(g, "tinyHeight", j);
                            a.conditionClass(g, "canHaveFixedElements", !h);
                            o.inform("change", h);
                            b("Arbiter").inform("tinyViewport/change", {
                                tiny: h,
                                tinyWidth: i,
                                tinyHeight: j
                            }, "state");
                            l = h;
                            m = i;
                            n = j
                        }
                    }, "TinyViewport")
                });
                a();
                b("Arbiter").subscribe("quickling/response", a);
                b("Event").listen(window, "resize", a);
                b("FullScreen").subscribe("changed", a)
            },
            isTiny: function() {
                return h
            },
            isTinyWidth: function() {
                return i
            },
            isTinyHeight: function() {
                return j
            }
        };
    Object.assign(o, b("ArbiterMixin"));
    e.exports = o
}), null);
__d("legacy:intl-base", ["IntlUtils"], (function(a, b, c, d, e, f, g) {
    a.intl_set_string_manager_mode = (b = d("IntlUtils")).setSmode;
    a.intl_set_xmode = b.setXmode;
    a.intl_set_rmode = b.setRmode;
    a.intl_set_locale = b.setLocale
}), 35);