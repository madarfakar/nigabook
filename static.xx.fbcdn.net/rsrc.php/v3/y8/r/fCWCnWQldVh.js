; /*FB_PKG_DELIM*/

__d("Button", ["csx", "cx", "invariant", "CSS", "DOM", "DataStore", "Event", "Parent", "emptyFunction", "isNode"], (function(a, b, c, d, e, f, g, h, i, j) {
    var k = "uiButtonDisabled",
        l = "uiButtonDepressed",
        m = "_42fr",
        n = "_42fs",
        o = "button:blocker",
        p = "href",
        q = "ajaxify";

    function r(a, b) {
        var e = d("DataStore").get(a, o);
        b ? e && (e.remove(), d("DataStore").remove(a, o)) : e || d("DataStore").set(a, o, c("Event").listen(a, "click", c("emptyFunction").thatReturnsFalse, c("Event").Priority.URGENT))
    }

    function s(a) {
        a = d("Parent").byClass(a, "uiButton") || d("Parent").bySelector(a, "._42ft");
        if (!a) throw new Error("invalid use case");
        return a
    }

    function t(a) {
        return c("DOM").isNodeOfType(a, "a")
    }

    function u(a) {
        return c("DOM").isNodeOfType(a, "button")
    }

    function v(a) {
        return d("CSS").matchesSelector(a, "._42ft")
    }
    var w = {
        getInputElement: function(a) {
            a = s(a);
            if (t(a)) throw new Error("invalid use case");
            if (u(a)) {
                a instanceof HTMLButtonElement || j(0, 21261);
                return a
            }
            return c("DOM").find(a, "input")
        },
        isEnabled: function(a) {
            return !(d("CSS").hasClass(s(a), k) || d("CSS").hasClass(s(a), m))
        },
        setEnabled: function(a, b) {
            a = s(a);
            var c = v(a) ? m : k;
            d("CSS").conditionClass(a, c, !b);
            if (t(a)) {
                c = a.getAttribute("href");
                var e = a.getAttribute("ajaxify"),
                    f = d("DataStore").get(a, p, "#"),
                    g = d("DataStore").get(a, q);
                b ? (c || a.setAttribute("href", f), !e && g && a.setAttribute("ajaxify", g), a.removeAttribute("tabIndex")) : (c && c !== f && d("DataStore").set(a, p, c), e && e !== g && d("DataStore").set(a, q, e), a.removeAttribute("href"), a.removeAttribute("ajaxify"), a.setAttribute("tabIndex", "-1"));
                r(a, b)
            } else {
                f = w.getInputElement(a);
                f.disabled = !b;
                r(f, b)
            }
        },
        setDepressed: function(a, b) {
            a = s(a);
            var c = v(a) ? n : l;
            d("CSS").conditionClass(a, c, b)
        },
        isDepressed: function(a) {
            a = s(a);
            var b = v(a) ? n : l;
            return d("CSS").hasClass(a, b)
        },
        setLabel: function(a, b) {
            a = s(a);
            if (v(a)) {
                var e = [];
                b && e.push(b);
                var f = c("DOM").scry(a, ".img");
                for (var g = 0; g < f.length; g++) {
                    var h = f[g],
                        i = h.parentNode;
                    i.classList && (i.classList.contains("_4o_3") || i.classList.contains("_-xe")) ? a.firstChild === i ? e.unshift(i) : e.push(i) : a.firstChild == h ? e.unshift(h) : e.push(h)
                }
                c("DOM").setContent(a, e)
            } else if (t(a)) {
                i = c("DOM").find(a, "span.uiButtonText");
                c("DOM").setContent(i, b)
            } else w.getInputElement(a).value = b;
            h = v(a) ? "_42fv" : "uiButtonNoText";
            d("CSS").conditionClass(a, h, !b)
        },
        getIcon: function(a) {
            a = s(a);
            return c("DOM").scry(a, ".img")[0]
        },
        setIcon: function(a, b) {
            if (b && !c("isNode")(b)) return;
            var e = w.getIcon(a);
            if (!b) {
                e && c("DOM").remove(e);
                return
            }
            d("CSS").addClass(b, "customimg");
            e != b && (e ? c("DOM").replace(e, b) : c("DOM").prependContent(s(a), b))
        }
    };
    a = w;
    g["default"] = a
}), 98);
__d("CSTXCookieRecordConsentControllerRouteBuilder", ["jsRouteBuilder"], (function(a, b, c, d, e, f, g) {
    a = c("jsRouteBuilder")("/cookie/consent/", Object.freeze({}), void 0);
    b = a;
    g["default"] = b
}), 98);
__d("MaybeSymbol", [], (function(a, b, c, d, e, f) {
    "use strict";
    b = a.Symbol ? a.Symbol : null;
    c = b;
    f["default"] = c
}), 66);
__d("URLSearchParams", ["MaybeSymbol"], (function(a, b, c, d, e, f, g) {
    var h = /\+/g,
        i = /[!\'()*]/g,
        j = /%20/g,
        k = c("MaybeSymbol") ? c("MaybeSymbol").iterator : null;

    function l(a) {
        return encodeURIComponent(a).replace(j, "+").replace(i, function(a) {
            return "%" + a.charCodeAt(0).toString(16)
        })
    }

    function m(a) {
        return decodeURIComponent((a = a) != null ? a : "").replace(h, " ")
    }

    function n(a) {
        var b = a.slice(0),
            c = {
                next: function() {
                    var a = b.length,
                        c = b.shift();
                    return {
                        done: c === void 0 && a <= 0,
                        value: c
                    }
                }
            };
        k && (c[k] = function() {
            return c
        });
        return c
    }
    a = function() {
        function a(a) {
            a === void 0 && (a = "");
            a = a;
            a[0] === "?" && (a = a.substr(1));
            this.$1 = a.length ? a.split("&").map(function(a) {
                a = a.split("=");
                var b = a[0];
                a = a[1];
                return [m(b), m(a)]
            }) : []
        }
        var b = a.prototype;
        b.append = function(a, b) {
            this.$1.push([a, String(b)])
        };
        b["delete"] = function(a) {
            for (var b = 0; b < this.$1.length; b++) this.$1[b][0] === a && (this.$1.splice(b, 1), b--)
        };
        b.entries = function() {
            if (k) return this.$1[k]();
            var a = this.$1.slice(0);
            return n(a)
        };
        b.get = function(a) {
            for (var b = 0, c = this.$1.length; b < c; b++)
                if (this.$1[b][0] === a) return this.$1[b][1];
            return null
        };
        b.getAll = function(a) {
            var b = [];
            for (var c = 0, d = this.$1.length; c < d; c++) this.$1[c][0] === a && b.push(this.$1[c][1]);
            return b
        };
        b.has = function(a) {
            for (var b = 0, c = this.$1.length; b < c; b++)
                if (this.$1[b][0] === a) return !0;
            return !1
        };
        b.keys = function() {
            var a = this.$1.map(function(a) {
                var b = a[0];
                a[1];
                return b
            });
            return k ? a[k]() : n(a)
        };
        b.set = function(a, b) {
            var c = !1;
            for (var d = 0; d < this.$1.length; d++) this.$1[d][0] === a && (c ? (this.$1.splice(d, 1), d--) : (this.$1[d][1] = String(b), c = !0));
            c || this.$1.push([a, String(b)])
        };
        b.toString = function() {
            return this.$1.map(function(a) {
                var b = a[0];
                a = a[1];
                return l(b) + "=" + l(a)
            }).join("&")
        };
        b.values = function() {
            var a = this.$1.map(function(a) {
                a[0];
                a = a[1];
                return a
            });
            return k ? a[k]() : n(a)
        };
        b[k] = function() {
            return this.entries()
        };
        return a
    }();
    g["default"] = a
}), 98);
__d("DeferredCookie", ["CSTXCookieRecordConsentControllerRouteBuilder", "Cookie", "CookieConsent", "SubscriptionList", "URLSearchParams", "cr:1083116", "cr:1083117", "cr:3376", "flattenPHPQueryData", "nullthrows", "promiseDone"], (function(a, b, c, d, e, f, g) {
    "use strict";
    var h, i = new Map(),
        j = !1,
        k = new Map(),
        l = new Map(),
        m = {
            addToQueue: function(a, b, d, e, f, g, j, k) {
                if ((h || (h = c("CookieConsent"))).hasConsent_DEPRECATED(1)) {
                    f ? c("Cookie").setWithoutChecksIfFirstPartyContext(a, b, d, e, j, k) : c("Cookie").setWithoutChecks(a, b, d, e, j, k);
                    return
                }
                if (i.has(a)) return;
                i.set(a, {
                    name: a,
                    value: b,
                    nMilliSecs: d,
                    path: e,
                    firstPartyOnly: f,
                    secure: j,
                    domain: k
                })
            },
            getIsDeferredCookieInQueue: function(a) {
                return i.has(a)
            },
            flushAllCookiesWithoutRecordingConsentDONOTCALLBEFORECONSENT: function() {
                i.forEach(function(a, b) {
                    a.firstPartyOnly ? c("Cookie").setWithoutChecksIfFirstPartyContext(a.name, a.value, a.nMilliSecs, a.path, a.secure, a.domain) : c("Cookie").setWithoutChecks(a.name, a.value, a.nMilliSecs, a.path, a.secure, a.domain)
                });
                i.clear();
                (h || (h = c("CookieConsent"))).setConsented();
                for (var a = k, b = Array.isArray(a), d = 0, a = b ? a : a[typeof Symbol === "function" ? Symbol.iterator : "@@iterator"]();;) {
                    var e;
                    if (b) {
                        if (d >= a.length) break;
                        e = a[d++]
                    } else {
                        d = a.next();
                        if (d.done) break;
                        e = d.value
                    }
                    e = e;
                    e[1].fireCallbacks()
                }
                for (e = l, d = Array.isArray(e), b = 0, e = d ? e : e[typeof Symbol === "function" ? Symbol.iterator : "@@iterator"]();;) {
                    if (d) {
                        if (b >= e.length) break;
                        a = e[b++]
                    } else {
                        b = e.next();
                        if (b.done) break;
                        a = b.value
                    }
                    a = a;
                    (h || (h = c("CookieConsent"))).hasIndividualThirdPartyIntegrationConsent(a[0]) && a[1].fireCallbacks()
                }
            },
            flushAllCookiesINTERNALONLY: function(a, d, e, f, g, h, i) {
                a === void 0 && (a = !1);
                e === void 0 && (e = !1);
                f === void 0 && (f = !1);
                h === void 0 && (h = !1);
                m.flushAllCookiesWithoutRecordingConsentDONOTCALLBEFORECONSENT();
                var k = {
                    accept_only_essential: f,
                    opted_in_controls: g,
                    consent_to_everything: h
                };
                d != null && (d = Object.fromEntries(d), k = {
                    optouts: d,
                    accept_only_essential: f,
                    opted_in_controls: g,
                    consent_to_everything: h
                });
                d = c("flattenPHPQueryData")(k);
                if (!j) {
                    f = c("CSTXCookieRecordConsentControllerRouteBuilder").buildUri({});
                    g = new(c("URLSearchParams"))(location.search).get("ig_3p_controls");
                    if (g === "on") {
                        h = f.addQueryParam("ig_3p_controls", "on");
                        f = (k = h) != null ? k : f
                    }
                    j = !0;
                    var l = function() {
                        i && i();
                        a && location.reload();
                        if (e) {
                            var b = document.getElementsByTagName("iframe");
                            b.length > 0 && location.reload()
                        }
                    };
                    b("cr:3376") != null ? c("promiseDone")(b("cr:3376")(f.toString(), {
                        data: d,
                        method: "POST"
                    }), function() {
                        return l()
                    }, function(a) {
                        b("cr:1083117") && b("cr:1083117")("Cookie consent has not been set successfully: " + a.errorMsg, "comet_infra")
                    }) : b("cr:1083116") != null && new(b("cr:1083116"))(f.toString()).setData(d).setHandler(function() {
                        return l()
                    }).send()
                }
            },
            registerCallbackOnCookieFlush_DEPRECATED: function(a, b) {
                (h || (h = c("CookieConsent"))).hasConsent_DEPRECATED(a) ? b() : (k.has(a) || k.set(a, new(c("SubscriptionList"))()), c("nullthrows")(k.get(a)).add(b))
            },
            registerCallbackOnFirstPartyCookieFlush: function(a) {
                (h || (h = c("CookieConsent"))).hasFirstPartyConsent() ? a() : (k.has(1) || k.set(1, new(c("SubscriptionList"))()), c("nullthrows")(k.get(1)).add(a))
            },
            registerCallbackOnCookieFlushWithIntegrations: function(a, b) {
                var d = (h || (h = c("CookieConsent"))).hasThirdPartyConsent([a]);
                d.get(a) === !0 ? b() : (l.has(a) || l.set(a, new(c("SubscriptionList"))()), c("nullthrows")(l.get(a)).add(b))
            }
        };
    a = m;
    g["default"] = a
}), 98);
__d("XAsyncRequest", ["cr:1042"], (function(a, b, c, d, e, f, g) {
    "use strict";
    g["default"] = b("cr:1042")
}), 98);
__d("XAsyncRequestWWW", ["AsyncRequest"], (function(a, b, c, d, e, f, g) {
    a = function() {
        function a(a) {
            var b = this;
            this.setAllowCrossPageTransition = function(a) {
                b.$1.setAllowCrossPageTransition(a);
                return b
            };
            this.$1 = new(c("AsyncRequest"))(a)
        }
        var b = a.prototype;
        b.setURI = function(a) {
            this.$1.setURI(a);
            return this
        };
        b.setTimeoutHandler = function(a, b) {
            this.$1.setTimeoutHandler(a, b);
            return this
        };
        b.setOption = function(a, b) {
            this.$1.setOption(a, b);
            return this
        };
        b.setMethod = function(a) {
            this.$1.setMethod(a);
            return this
        };
        b.setAutoProcess = function(a) {
            this.$1.setOption("suppressEvaluation", a);
            return this
        };
        b.setData = function(a) {
            this.$1.setData(a);
            return this
        };
        b.setHandler = function(a) {
            this.$1.setHandler(a);
            return this
        };
        b.setPayloadHandler = function(a) {
            this.setHandler(function(b) {
                return a(b.payload)
            });
            return this
        };
        b.setErrorHandler = function(a) {
            this.$1.setErrorHandler(a);
            return this
        };
        b.send = function() {
            this.$1.send();
            return this
        };
        b.abort = function() {
            this.$1.abort()
        };
        b.setReadOnly = function(a) {
            this.$1.setReadOnly(a);
            return this
        };
        b.setAllowCrossOrigin = function(a) {
            this.$1.setAllowCrossOrigin(a);
            return this
        };
        b.setAllowCredentials = function(a) {
            this.$1.setAllowCredentials(a);
            return this
        };
        return a
    }();
    g["default"] = a
}), 98);
__d("queryThenMutateDOM", ["ErrorUtils", "Run", "TimeSlice", "emptyFunction", "gkx", "requestAnimationFrame"], (function(a, b, c, d, e, f) {
    var g, h, i, j = [],
        k = {};

    function l(a, c, d) {
        if (!a && !c) return {
            cancel: b("emptyFunction")
        };
        if (d && Object.prototype.hasOwnProperty.call(k, d)) return {
            cancel: b("emptyFunction")
        };
        else d && (k[d] = 1);
        c = b("TimeSlice").guard(c || b("emptyFunction"), "queryThenMutateDOM mutation callback", {
            propagationType: b("TimeSlice").PropagationType.CONTINUATION,
            registerCallStack: !0
        });
        a = b("TimeSlice").guard(a || b("emptyFunction"), "queryThenMutateDOM query callback", {
            propagationType: b("TimeSlice").PropagationType.CONTINUATION,
            registerCallStack: !0
        });
        var e = {
            queryFunction: a,
            mutateFunction: c,
            output: null,
            deleted: !1
        };
        j.push(e);
        n();
        h || (h = !0, b("gkx")("20935") || b("Run").onLeave(function() {
            h = !1, i = !1, k = {}, j.length = 0
        }));
        return {
            cancel: function() {
                e.deleted = !0, d && delete k[d]
            }
        }
    }
    l.prepare = function(a, b, c) {
        return function() {
            for (var d = arguments.length, e = new Array(d), f = 0; f < d; f++) e[f] = arguments[f];
            e.unshift(this);
            var g = Function.prototype.bind.apply(a, e),
                h = b.bind(this);
            l(g, h, c)
        }
    };
    var m = b("TimeSlice").guard(function() {
        while (j.length) {
            k = {};
            var a = [];
            window.document.body.getClientRects();
            while (j.length) {
                var b = j.shift();
                b.deleted || (b.output = o(b.queryFunction), a.push(b))
            }
            while (a.length) {
                b = a.shift();
                b.deleted || o(b.mutateFunction, null, [b.output])
            }
        }
        i = !1
    }, "queryThenMutateDOM runScheduledQueriesAndMutations", {
        propagationType: b("TimeSlice").PropagationType.ORPHAN
    });

    function n() {
        !i && j.length && (i = !0, b("requestAnimationFrame")(m))
    }

    function o(a, c, d, e, f) {
        return (g || (g = b("ErrorUtils"))).applyWithGuard(a, c, d, e, f)
    }
    e.exports = l
}), null);