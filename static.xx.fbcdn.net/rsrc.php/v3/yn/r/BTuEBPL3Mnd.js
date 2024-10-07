; /*FB_PKG_DELIM*/

__d("forEachObject", [], (function(a, b, c, d, e, f) {
    "use strict";
    var g = Object.prototype.hasOwnProperty;

    function a(a, b, c) {
        for (var d in a) {
            var e = d;
            g.call(a, e) && b.call(c, a[e], e, a)
        }
    }
    f["default"] = a
}), 66);
__d("BasicVector", [], (function(a, b, c, d, e, f) {
    a = function() {
        function a(a, b) {
            this.x = a, this.y = b
        }
        var b = a.prototype;
        b.derive = function(b, c) {
            return new a(b, c)
        };
        b.toString = function() {
            return "(" + this.x + ", " + this.y + ")"
        };
        b.add = function(a, b) {
            b === void 0 && (b = a.y, a = a.x);
            a = parseFloat(a);
            b = parseFloat(b);
            return this.derive(this.x + a, this.y + b)
        };
        b.mul = function(a, b) {
            b === void 0 && (b = a);
            return this.derive(this.x * a, this.y * b)
        };
        b.div = function(a, b) {
            b === void 0 && (b = a);
            return this.derive(this.x * 1 / a, this.y * 1 / b)
        };
        b.sub = function(a, b) {
            if (arguments.length === 1) return this.add(a.mul(-1));
            else return this.add(-a, -b)
        };
        b.distanceTo = function(a) {
            return this.sub(a).magnitude()
        };
        b.magnitude = function() {
            return Math.sqrt(this.x * this.x + this.y * this.y)
        };
        b.rotate = function(a) {
            return this.derive(this.x * Math.cos(a) - this.y * Math.sin(a), this.x * Math.sin(a) + this.y * Math.cos(a))
        };
        return a
    }();
    f["default"] = a
}), 66);
__d("DataAttributeUtils", ["cr:6669"], (function(a, b, c, d, e, f) {
    var g = [];

    function h(a, b) {
        a = a;
        while (a) {
            if (b(a)) return a;
            a = a.parentNode
        }
        return null
    }

    function i(a, b) {
        a = h(a, function(a) {
            return a instanceof Element && !!a.getAttribute(b)
        });
        return a instanceof Element ? a : null
    }
    var j = {
            LEGACY_CLICK_TRACKING_ATTRIBUTE: "data-ft",
            CLICK_TRACKING_DATASTORE_KEY: "data-ft",
            ENABLE_STORE_CLICK_TRACKING: "data-fte",
            IMPRESSION_TRACKING_CONFIG_ATTRIBUTE: "data-xt-vimp",
            IMPRESSION_TRACKING_CONFIG_DATASTORE_KEY: "data-xt-vimp",
            REMOVE_LEGACY_TRACKING: "data-ftr",
            getDataAttribute: function(a, b) {
                return k[b] ? k[b](a) : a.getAttribute(b)
            },
            setDataAttribute: function(a, b, c) {
                return l[b] ? l[b](a, c) : a.setAttribute(b, c)
            },
            getDataFt: function(a) {
                if (a.getAttribute(j.ENABLE_STORE_CLICK_TRACKING)) {
                    var c = b("cr:6669").get(a, j.CLICK_TRACKING_DATASTORE_KEY);
                    c || (c = j.moveClickTrackingToDataStore(a, a.getAttribute(j.REMOVE_LEGACY_TRACKING)));
                    return c
                }
                return a.getAttribute(j.LEGACY_CLICK_TRACKING_ATTRIBUTE)
            },
            setDataFt: function(a, c) {
                if (a.getAttribute(j.ENABLE_STORE_CLICK_TRACKING)) {
                    b("cr:6669").set(a, j.CLICK_TRACKING_DATASTORE_KEY, c);
                    return
                }
                a.setAttribute(j.LEGACY_CLICK_TRACKING_ATTRIBUTE, c)
            },
            moveXTVimp: function(a) {
                j.moveAttributeToDataStore(a, j.IMPRESSION_TRACKING_CONFIG_ATTRIBUTE, j.IMPRESSION_TRACKING_CONFIG_DATASTORE_KEY), g.push(a.id)
            },
            getXTrackableElements: function() {
                var a = g.map(function(a) {
                        return document.getElementById(a)
                    }).filter(function(a) {
                        return !!a
                    }),
                    b = document.querySelectorAll("[data-xt-vimp]");
                for (var c = 0; c < b.length; c++) a.push(b[c]);
                return a
            },
            getDataAttributeGeneric: function(a, c, d) {
                d = b("cr:6669").get(a, d);
                return d !== void 0 ? d : a.getAttribute(c)
            },
            moveAttributeToDataStore: function(a, c, d) {
                var e = a.getAttribute(c);
                e && (b("cr:6669").set(a, d, e), a.removeAttribute(c))
            },
            moveClickTrackingToDataStore: function(a, c) {
                var d = a.getAttribute(j.LEGACY_CLICK_TRACKING_ATTRIBUTE);
                d && (b("cr:6669").set(a, j.CLICK_TRACKING_DATASTORE_KEY, d), c && a.removeAttribute(j.LEGACY_CLICK_TRACKING_ATTRIBUTE));
                return d
            },
            getClickTrackingParent: function(a) {
                a = i(a, j.LEGACY_CLICK_TRACKING_ATTRIBUTE) || i(a, j.ENABLE_STORE_CLICK_TRACKING);
                return a
            },
            getClickTrackingElements: function(a) {
                return a.querySelectorAll("[" + j.LEGACY_CLICK_TRACKING_ATTRIBUTE + "], [" + j.ENABLE_STORE_CLICK_TRACKING + "]")
            },
            getParentByAttributeOrDataStoreKey: function(a, c, d) {
                while (a && (!a.getAttribute || !a.getAttribute(c)) && b("cr:6669").get(a, d) === void 0) a = a.parentNode;
                return a
            }
        },
        k = {
            "data-ft": j.getDataFt,
            "data-xt-vimp": function(a) {
                return j.getDataAttributeGeneric(a, "data-xt-vimp", "data-xt-vimp")
            },
            "data-ad": function(a) {
                return j.getDataAttributeGeneric(a, "data-ad", "data-ad")
            },
            "data-xt": function(a) {
                return j.getDataAttributeGeneric(a, "data-xt", "data-xt")
            }
        },
        l = {
            "data-ft": j.setDataFt,
            "data-xt": function(a, c) {
                b("cr:6669").set(a, "data-xt", c)
            }
        };
    e.exports = j
}), null);
__d("getUnboundedScrollPosition", ["Scroll"], (function(a, b, c, d, e, f) {
    "use strict";

    function a(a) {
        if (a === window) {
            var c;
            return {
                x: (c = window.pageXOffset) != null ? c : b("Scroll").getLeft(document.documentElement),
                y: (c = window.pageYOffset) != null ? c : b("Scroll").getTop(document.documentElement)
            }
        }
        return {
            x: b("Scroll").getLeft(a),
            y: b("Scroll").getTop(a)
        }
    }
    e.exports = a
}), null);
__d("getViewportDimensions", ["UserAgent"], (function(a, b, c, d, e, f, g) {
    "use strict";
    var h = function() {
        var a = null;
        return function() {
            var b = document.body;
            if (b == null) return null;
            (a == null || !b.contains(a)) && (a = document.createElement("div"), a.style.left = Number.MAX_SAFE_INTEGER + "px", a.style.width = "100%", a.style.height = "100%", a.style.position = "fixed", b.appendChild(a));
            return a
        }
    }();

    function i() {
        var a;
        document.documentElement && (a = document.documentElement.clientWidth);
        a == null && document.body && (a = document.body.clientWidth);
        return a || 0
    }

    function j() {
        var a;
        document.documentElement && (a = document.documentElement.clientHeight);
        a == null && document.body && (a = document.body.clientHeight);
        return a || 0
    }

    function k() {
        return {
            width: window.innerWidth || i(),
            height: window.innerHeight || j()
        }
    }
    k.withoutScrollbars = function() {
        return c("UserAgent").isPlatform("Android") ? k() : {
            width: i(),
            height: j()
        }
    };
    k.layout = function() {
        var a, b = h();
        return {
            width: (a = b == null ? void 0 : b.clientWidth) != null ? a : i(),
            height: (a = b == null ? void 0 : b.clientHeight) != null ? a : j()
        }
    };
    g["default"] = k
}), 98);
__d("DOMVector", ["BasicVector", "getDocumentScrollElement", "getElementPosition", "getUnboundedScrollPosition", "getViewportDimensions"], (function(a, b, c, d, e, f, g) {
    a = function(a) {
        babelHelpers.inheritsLoose(b, a);

        function b(b, c, d) {
            b = a.call(this, b, c) || this;
            b.domain = d || "pure";
            return b
        }
        var d = b.prototype;
        d.derive = function(a, c, d) {
            return new b(a, c, d || this.domain)
        };
        d.add = function(c, d) {
            c instanceof b && c.getDomain() !== "pure" && (c = c.convertTo(this.domain));
            return a.prototype.add.call(this, c, d)
        };
        d.convertTo = function(a) {
            if (a != "pure" && a != "viewport" && a != "document") return this.derive(0, 0);
            if (a == this.domain) return this.derive(this.x, this.y, this.domain);
            if (a == "pure") return this.derive(this.x, this.y);
            if (this.domain == "pure") return this.derive(0, 0);
            var c = b.getScrollPosition("document"),
                d = this.x,
                e = this.y;
            this.domain == "document" ? (d -= c.x, e -= c.y) : (d += c.x, e += c.y);
            return this.derive(d, e, a)
        };
        d.getDomain = function() {
            return this.domain
        };
        b.from = function(a, c, d) {
            return new b(a, c, d)
        };
        b.getScrollPosition = function(a) {
            a = a || "document";
            var b = c("getUnboundedScrollPosition")(window);
            return this.from(b.x, b.y, "document").convertTo(a)
        };
        b.getElementPosition = function(a, b) {
            b = b || "document";
            a = c("getElementPosition")(a);
            return this.from(a.x, a.y, "viewport").convertTo(b)
        };
        b.getElementDimensions = function(a) {
            return this.from(a.offsetWidth || 0, a.offsetHeight || 0)
        };
        b.getViewportDimensions = function() {
            var a = c("getViewportDimensions")();
            return this.from(a.width, a.height, "viewport")
        };
        b.getLayoutViewportDimensions = function() {
            var a = c("getViewportDimensions").layout();
            return this.from(a.width, a.height, "viewport")
        };
        b.getViewportWithoutScrollbarDimensions = function() {
            var a = c("getViewportDimensions").withoutScrollbars();
            return this.from(a.width, a.height, "viewport")
        };
        b.getDocumentDimensions = function(a) {
            a = c("getDocumentScrollElement")(a);
            return this.from(a.scrollWidth, a.scrollHeight, "document")
        };
        return b
    }(c("BasicVector"));
    g["default"] = a
}), 98);
__d("Vector", ["DOMEvent", "DOMVector", "Scroll", "getDocumentScrollElement"], (function(a, b, c, d, e, f, g) {
    a = function(a) {
        babelHelpers.inheritsLoose(b, a);

        function b(b, c, d) {
            return a.call(this, parseFloat(b), parseFloat(c), d) || this
        }
        var e = b.prototype;
        e.derive = function(a, c, d) {
            return new b(a, c, d || this.domain)
        };
        e.setElementPosition = function(a) {
            var b = this.convertTo("document");
            a.style.left = parseInt(b.x, 10) + "px";
            a.style.top = parseInt(b.y, 10) + "px";
            return this
        };
        e.setElementDimensions = function(a) {
            return this.setElementWidth(a).setElementHeight(a)
        };
        e.setElementWidth = function(a) {
            a.style.width = parseInt(this.x, 10) + "px";
            return this
        };
        e.setElementHeight = function(a) {
            a.style.height = parseInt(this.y, 10) + "px";
            return this
        };
        e.scrollElementBy = function(a) {
            if (a == document.body) window.scrollBy(this.x, this.y);
            else {
                var b;
                (b = d("Scroll")).setLeft(a, b.getLeft(a) + this.x);
                b.setTop(a, b.getTop(a) + this.y)
            }
            return this
        };
        b.from = function(a, c, d) {
            return new b(a, c, d)
        };
        b.getEventPosition = function(a, b) {
            b === void 0 && (b = "document");
            a = new(c("DOMEvent"))(a).event;
            var e = c("getDocumentScrollElement")(),
                f = a.clientX + d("Scroll").getLeft(e);
            a = a.clientY + d("Scroll").getTop(e);
            e = this.from(f, a, "document");
            return e.convertTo(b)
        };
        b.getTouchEventPosition = function(a, b) {
            b === void 0 && (b = "document");
            a = a.touches[0];
            a = this.from(a.pageX, a.pageY, "document");
            return a.convertTo(b)
        };
        b.deserialize = function(a) {
            a = a.split(",");
            return this.from(a[0], a[1])
        };
        return b
    }(c("DOMVector"));
    g["default"] = a
}), 98);
__d("collectDataAttributes", ["DataAttributeUtils", "getContextualParent"], (function(a, b, c, d, e, f) {
    var g = "normal";

    function a(a, c, d) {
        var e = {},
            f = [],
            h = c.length,
            i;
        for (i = 0; i < h; ++i) e[c[i]] = {}, f.push("data-" + c[i]);
        if (d) {
            e[g] = {};
            for (i = 0; i < (d || []).length; ++i) f.push(d[i])
        }
        d = {
            tn: "",
            "tn-debug": ","
        };
        a = a;
        while (a) {
            if (a.getAttribute)
                for (i = 0; i < f.length; ++i) {
                    var j = f[i],
                        k = b("DataAttributeUtils").getDataAttribute(a, j);
                    if (k) {
                        if (i >= h) {
                            e[g][j] === void 0 && (e[g][j] = k);
                            continue
                        }
                        j = JSON.parse(k);
                        for (k in j) d[k] !== void 0 ? (e[c[i]][k] === void 0 && (e[c[i]][k] = []), e[c[i]][k].push(j[k])) : e[c[i]][k] === void 0 && (e[c[i]][k] = j[k])
                    }
                }
            a = b("getContextualParent")(a)
        }
        for (k in e)
            for (j in d) e[k][j] !== void 0 && (e[k][j] = e[k][j].join(d[j]));
        return e
    }
    e.exports = a
}), null);
__d("CometEventListener", ["unrecoverableViolation"], (function(a, b, c, d, e, f, g) {
    "use strict";

    function h(a, b, d, e) {
        if (a.addEventListener) {
            a.addEventListener(b, d, e);
            return {
                remove: function() {
                    a.removeEventListener(b, d, e)
                }
            }
        } else throw c("unrecoverableViolation")('Attempted to listen to eventType "' + b + '" on a target that does not have addEventListener.', "comet_ui")
    }
    a = {
        addListenerWithOptions: function(a, b, c, d) {
            return h(a, b, c, d)
        },
        bubbleWithPassiveFlag: function(a, b, c, d) {
            return h(a, b, c, {
                capture: !1,
                passive: d
            })
        },
        capture: function(a, b, c) {
            return h(a, b, c, !0)
        },
        captureWithPassiveFlag: function(a, b, c, d) {
            return h(a, b, c, {
                capture: !0,
                passive: d
            })
        },
        listen: function(a, b, c) {
            return h(a, b, c, !1)
        },
        registerDefault: function(a, b) {
            throw c("unrecoverableViolation")("EventListener.registerDefault is not implemented.", "comet_ui")
        },
        suppress: function(a) {
            a.preventDefault(), a.stopPropagation()
        }
    };
    g["default"] = a
}), 98);
__d("EventListenerImplForBlue", ["Event", "TimeSlice", "emptyFunction", "setImmediateAcrossTransitions"], (function(a, b, c, d, e, f, g) {
    function h(a, b, d, e) {
        var f = c("TimeSlice").guard(d, "EventListener capture " + b);
        if (a.addEventListener) {
            a.addEventListener(b, f, e);
            return {
                remove: function() {
                    a.removeEventListener(b, f, e)
                }
            }
        } else return {
            remove: c("emptyFunction")
        }
    }
    a = {
        listen: function(a, b, d) {
            return c("Event").listen(a, b, d)
        },
        capture: function(a, b, c) {
            return h(a, b, c, !0)
        },
        captureWithPassiveFlag: function(a, b, c, d) {
            return h(a, b, c, {
                passive: d,
                capture: !0
            })
        },
        bubbleWithPassiveFlag: function(a, b, c, d) {
            return h(a, b, c, {
                passive: d,
                capture: !1
            })
        },
        registerDefault: function(a, b) {
            var d, e = c("Event").listen(document.documentElement, a, f, c("Event").Priority._BUBBLE);

            function f() {
                g(), d = c("Event").listen(document, a, b), c("setImmediateAcrossTransitions")(g)
            }

            function g() {
                d && d.remove(), d = null
            }
            return {
                remove: function() {
                    g(), e && e.remove(), e = null
                }
            }
        },
        suppress: function(a) {
            c("Event").kill(a)
        }
    };
    b = a;
    g["default"] = b
}), 98);
__d("EventListenerWWW", ["cr:1353359"], (function(a, b, c, d, e, f, g) {
    "use strict";
    g["default"] = b("cr:1353359")
}), 98);
__d("RDFDRequireDeferredReference", ["RequireDeferredReference"], (function(a, b, c, d, e, f, g) {
    "use strict";
    a = function(a) {
        babelHelpers.inheritsLoose(b, a);

        function b() {
            return a.apply(this, arguments) || this
        }
        return b
    }(c("RequireDeferredReference"));
    g["default"] = a
}), 98);
__d("requireDeferredForDisplay", ["RDFDRequireDeferredReference"], (function(a, b, c, d, e, f, g) {
    "use strict";

    function a(a) {
        return new(c("RDFDRequireDeferredReference"))(a)
    }
    g["default"] = a
}), 98);
__d("SchedulerFeatureFlags", ["qex"], (function(a, b, c, d, e, f, g) {
    var h, i;
    a = !0;
    b = !1;
    d = b;
    e = 10;
    f = 10;
    var j = 10;
    h = (h = c("qex")._("526")) != null ? h : 250;
    i = (i = c("qex")._("538")) != null ? i : 5e3;
    c = (c = c("qex")._("543")) != null ? c : 1e4;
    g.enableSchedulerDebugging = a;
    g.enableIsInputPending = b;
    g.enableIsInputPendingContinuous = d;
    g.frameYieldMs = e;
    g.continuousYieldMs = f;
    g.maxYieldMs = j;
    g.userBlockingPriorityTimeout = h;
    g.normalPriorityTimeout = i;
    g.lowPriorityTimeout = c
}), 98);
__d("Scheduler-dev.classic", ["SchedulerFeatureFlags"], (function(a, b, c, d, e, f) {
    "use strict"
}), null);
__d("Scheduler-profiling.classic", ["SchedulerFeatureFlags"], (function(c, d, e, f, g, h) {
    "use strict";
    "undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ && "function" === typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error());
    var i = d("SchedulerFeatureFlags").userBlockingPriorityTimeout,
        j = d("SchedulerFeatureFlags").normalPriorityTimeout,
        k = d("SchedulerFeatureFlags").lowPriorityTimeout;

    function l(c, d) {
        var e = c.length;
        c.push(d);
        a: for (; 0 < e;) {
            var f = e - 1 >>> 1,
                g = c[f];
            if (0 < o(g, d)) c[f] = d, c[e] = g, e = f;
            else break a
        }
    }

    function m(c) {
        return 0 === c.length ? null : c[0]
    }

    function n(c) {
        if (0 === c.length) return null;
        var d = c[0],
            e = c.pop();
        if (e !== d) {
            c[0] = e;
            a: for (var f = 0, g = c.length, h = g >>> 1; f < h;) {
                var i = 2 * (f + 1) - 1,
                    j = c[i],
                    k = i + 1,
                    l = c[k];
                if (0 > o(j, e)) k < g && 0 > o(l, j) ? (c[f] = l, c[k] = e, f = k) : (c[f] = j, c[i] = e, f = i);
                else if (k < g && 0 > o(l, e)) c[f] = l, c[k] = e, f = k;
                else break a
            }
        }
        return d
    }

    function o(c, d) {
        var e = c.sortIndex - d.sortIndex;
        return 0 !== e ? e : c.id - d.id
    }
    h.unstable_now = void 0;
    if ("object" === typeof performance && "function" === typeof performance.now) {
        var p = performance;
        h.unstable_now = function() {
            return p.now()
        }
    } else {
        var q = Date,
            r = q.now();
        h.unstable_now = function() {
            return q.now() - r
        }
    }
    var s = [],
        t = [],
        u = 1,
        v = !1;
    c = null;
    var w = 3,
        x = !1,
        y = !1,
        z = !1,
        A = "function" === typeof setTimeout ? setTimeout : null,
        B = "function" === typeof clearTimeout ? clearTimeout : null,
        C = "undefined" !== typeof setImmediate ? setImmediate : null;

    function D(c) {
        for (var d = m(t); null !== d;) {
            if (null === d.callback) n(t);
            else if (d.startTime <= c) n(t), d.sortIndex = d.expirationTime, l(s, d);
            else break;
            d = m(t)
        }
    }

    function E(c) {
        z = !1;
        D(c);
        if (!y)
            if (null !== m(s)) y = !0, N();
            else {
                var d = m(t);
                null !== d && O(E, d.startTime - c)
            }
    }
    var F = !1,
        G = -1,
        H = 10,
        I = -1;

    function J() {
        return h.unstable_now() - I < H ? !1 : !0
    }

    function K() {
        if (F) {
            var d = h.unstable_now();
            I = d;
            var e = !0;
            try {
                a: {
                    y = !1;z && (z = !1, B(G), G = -1);x = !0;
                    var f = w;
                    try {
                        b: {
                            D(d);
                            for (c = m(s); !(null === c || v || c.expirationTime > d && J());) {
                                var g = c.callback;
                                if ("function" === typeof g) {
                                    c.callback = null;
                                    w = c.priorityLevel;
                                    g = g(c.expirationTime <= d);
                                    d = h.unstable_now();
                                    if ("function" === typeof g) {
                                        c.callback = g;
                                        D(d);
                                        e = !0;
                                        break b
                                    }
                                    c === m(s) && n(s);
                                    D(d)
                                } else n(s);
                                c = m(s)
                            }
                            if (null !== c) e = !0;
                            else {
                                g = m(t);
                                null !== g && O(E, g.startTime - d);
                                e = !1
                            }
                        }
                        break a
                    }
                    finally {
                        c = null, w = f, x = !1
                    }
                    e = void 0
                }
            }
            finally {
                e ? L() : F = !1
            }
        }
    }
    var L;
    if ("function" === typeof C) L = function() {
        C(K)
    };
    else if ("undefined" !== typeof MessageChannel) {
        e = new MessageChannel();
        var M = e.port2;
        e.port1.onmessage = K;
        L = function() {
            M.postMessage(null)
        }
    } else L = function() {
        A(K, 0)
    };

    function N() {
        F || (F = !0, L())
    }

    function O(c, d) {
        G = A(function() {
            c(h.unstable_now())
        }, d)
    }
    h.unstable_IdlePriority = 5;
    h.unstable_ImmediatePriority = 1;
    h.unstable_LowPriority = 4;
    h.unstable_NormalPriority = 3;
    h.unstable_Profiling = null;
    h.unstable_UserBlockingPriority = 2;
    h.unstable_cancelCallback = function(c) {
        c.callback = null
    };
    h.unstable_continueExecution = function() {
        v = !1, y || x || (y = !0, N())
    };
    h.unstable_forceFrameRate = function(c) {
        0 > c || 125 < c ? !1 : H = 0 < c ? Math.floor(1e3 / c) : 10
    };
    h.unstable_getCurrentPriorityLevel = function() {
        return w
    };
    h.unstable_getFirstCallbackNode = function() {
        return m(s)
    };
    h.unstable_next = function(c) {
        switch (w) {
            case 1:
            case 2:
            case 3:
                var d = 3;
                break;
            default:
                d = w
        }
        var e = w;
        w = d;
        try {
            return c()
        } finally {
            w = e
        }
    };
    h.unstable_pauseExecution = function() {
        v = !0
    };
    h.unstable_requestPaint = function() {};
    h.unstable_runWithPriority = function(c, d) {
        switch (c) {
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
                break;
            default:
                c = 3
        }
        var e = w;
        w = c;
        try {
            return d()
        } finally {
            w = e
        }
    };
    h.unstable_scheduleCallback = function(c, d, e) {
        var f = h.unstable_now();
        "object" === typeof e && null !== e ? (e = e.delay, e = "number" === typeof e && 0 < e ? f + e : f) : e = f;
        switch (c) {
            case 1:
                var g = -1;
                break;
            case 2:
                g = i;
                break;
            case 5:
                g = 1073741823;
                break;
            case 4:
                g = k;
                break;
            default:
                g = j
        }
        g = e + g;
        c = {
            id: u++,
            callback: d,
            priorityLevel: c,
            startTime: e,
            expirationTime: g,
            sortIndex: -1
        };
        e > f ? (c.sortIndex = e, l(t, c), null === m(s) && c === m(t) && (z ? (B(G), G = -1) : z = !0, O(E, e - f))) : (c.sortIndex = g, l(s, c), y || x || (y = !0, N()));
        return c
    };
    h.unstable_shouldYield = J;
    h.unstable_wrapCallback = function(c) {
        var d = w;
        return function() {
            var e = w;
            w = d;
            try {
                return c.apply(this, arguments)
            } finally {
                w = e
            }
        }
    };
    "undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ && "function" === typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error())
}), null);
__d("SchedulerFb-Internals_DO_NOT_USE", ["Scheduler-dev.classic", "Scheduler-profiling.classic", "ifRequireable", "requestAnimationFramePolyfill"], (function(a, b, c, d, e, f) {
    "use strict";
    a.requestAnimationFrame === void 0 && (a.requestAnimationFrame = b("requestAnimationFramePolyfill"));
    var g;
    g = b("Scheduler-profiling.classic");
    e.exports = {
        unstable_ImmediatePriority: g.unstable_ImmediatePriority,
        unstable_UserBlockingPriority: g.unstable_UserBlockingPriority,
        unstable_NormalPriority: g.unstable_NormalPriority,
        unstable_LowPriority: g.unstable_LowPriority,
        unstable_IdlePriority: g.unstable_IdlePriority,
        unstable_getCurrentPriorityLevel: g.unstable_getCurrentPriorityLevel,
        unstable_runWithPriority: g.unstable_runWithPriority,
        unstable_now: g.unstable_now,
        unstable_scheduleCallback: function(a, c, d) {
            var e = b("ifRequireable")("TimeSlice", function(a) {
                return a.guard(c, "unstable_scheduleCallback", {
                    propagationType: a.PropagationType.CONTINUATION,
                    registerCallStack: !0
                })
            }, function() {
                return c
            });
            return g.unstable_scheduleCallback(a, e, d)
        },
        unstable_cancelCallback: function(a) {
            return g.unstable_cancelCallback(a)
        },
        unstable_wrapCallback: function(a) {
            var c = b("ifRequireable")("TimeSlice", function(b) {
                return b.guard(a, "unstable_wrapCallback", {
                    propagationType: b.PropagationType.CONTINUATION,
                    registerCallStack: !0
                })
            }, function() {
                return a
            });
            return g.unstable_wrapCallback(c)
        },
        unstable_pauseExecution: function() {
            return g.unstable_pauseExecution()
        },
        unstable_continueExecution: function() {
            return g.unstable_continueExecution()
        },
        unstable_shouldYield: g.unstable_shouldYield,
        unstable_requestPaint: g.unstable_requestPaint,
        unstable_forceFrameRate: g.unstable_forceFrameRate,
        unstable_Profiling: g.unstable_Profiling
    }
}), null);
__d("JSScheduler", ["SchedulerFb-Internals_DO_NOT_USE"], (function(a, b, c, d, e, f) {
    "use strict";
    var g = {
            unstable_Idle: (c = b("SchedulerFb-Internals_DO_NOT_USE")).unstable_IdlePriority,
            unstable_Immediate: c.unstable_ImmediatePriority,
            unstable_Low: c.unstable_LowPriority,
            unstable_Normal: c.unstable_NormalPriority,
            unstable_UserBlocking: c.unstable_UserBlockingPriority
        },
        h = !1,
        i = c.unstable_scheduleCallback,
        j = c.unstable_cancelCallback,
        k = {
            cancelCallback: function(a) {
                j(a)
            },
            cancelDelayedCallback_DO_NOT_USE: function(a) {
                a = a;
                return j(a)
            },
            defer: function(a) {
                var b = k.getCurrentPriorityLevel();
                return i(b, a)
            },
            deferUserBlockingRunAtCurrentPri_DO_NOT_USE: function(a) {
                var c = k.getCurrentPriorityLevel();
                return i(g.unstable_UserBlocking, function() {
                    b("SchedulerFb-Internals_DO_NOT_USE").unstable_runWithPriority(c, a)
                })
            },
            getCallbackScheduler: function() {
                var a = k.getCurrentPriorityLevel();
                return function(b) {
                    return i(a, b)
                }
            },
            getCurrentPriorityLevel: c.unstable_getCurrentPriorityLevel,
            getUserBlockingRunAtCurrentPriCallbackScheduler_DO_NOT_USE: function() {
                var a = k.getCurrentPriorityLevel();
                return function(c) {
                    return i(g.unstable_UserBlocking, function() {
                        b("SchedulerFb-Internals_DO_NOT_USE").unstable_runWithPriority(a, c)
                    })
                }
            },
            makeSchedulerGlobalEntry: function(c, d, e) {
                c === void 0 && (c = null);
                d === void 0 && (d = !1);
                e === void 0 && (e = !1);
                c != null && b("SchedulerFb-Internals_DO_NOT_USE").unstable_forceFrameRate(c);
                d && k.startEventProfiling();
                if (e === !0) return;
                a.ScheduleJSWork = function(a) {
                    return function() {
                        for (var b = arguments.length, c = new Array(b), d = 0; d < b; d++) c[d] = arguments[d];
                        h ? a.apply(void 0, c) : k.deferUserBlockingRunAtCurrentPri_DO_NOT_USE(function() {
                            h = !0;
                            try {
                                a.apply(void 0, c)
                            } finally {
                                h = !1
                            }
                        })
                    }
                }
            },
            priorities: g,
            runWithPriority: c.unstable_runWithPriority,
            runWithPriority_DO_NOT_USE: c.unstable_runWithPriority,
            scheduleDelayedCallback_DO_NOT_USE: function(a, b, c) {
                a = i(a, c, {
                    delay: b
                });
                return a
            },
            scheduleImmediatePriCallback: function(a) {
                return i(g.unstable_Immediate, a)
            },
            scheduleLoggingPriCallback: function(a) {
                return i(g.unstable_Low, a)
            },
            scheduleNormalPriCallback: function(a) {
                return i(g.unstable_Normal, a)
            },
            scheduleSpeculativeCallback: function(a) {
                return i(g.unstable_Idle, a)
            },
            scheduleUserBlockingPriCallback: function(a) {
                return i(g.unstable_UserBlocking, a)
            },
            shouldYield: c.unstable_shouldYield,
            startEventProfiling: function() {
                var a;
                a = (a = b("SchedulerFb-Internals_DO_NOT_USE").unstable_Profiling) == null ? void 0 : a.startLoggingProfilingEvents;
                typeof a === "function" && a()
            },
            stopEventProfiling: function() {
                var a;
                a = (a = b("SchedulerFb-Internals_DO_NOT_USE").unstable_Profiling) == null ? void 0 : a.stopLoggingProfilingEvents;
                return typeof a === "function" ? a() : null
            }
        };
    e.exports = k
}), null);
__d("LogHistory", [], (function(a, b, c, d, e, f) {
    var g = 500,
        h = {},
        i = [];

    function j(a, b, c, d) {
        var e = d[0];
        if (typeof e !== "string" || d.length !== 1) return;
        i.push({
            date: Date.now(),
            level: a,
            category: b,
            event: c,
            args: e
        });
        i.length > g && i.shift()
    }
    var k = function() {
        function a(a) {
            this.category = a
        }
        var b = a.prototype;
        b.debug = function(a) {
            for (var b = arguments.length, c = new Array(b > 1 ? b - 1 : 0), d = 1; d < b; d++) c[d - 1] = arguments[d];
            j("debug", this.category, a, c);
            return this
        };
        b.log = function(a) {
            for (var b = arguments.length, c = new Array(b > 1 ? b - 1 : 0), d = 1; d < b; d++) c[d - 1] = arguments[d];
            j("log", this.category, a, c);
            return this
        };
        b.warn = function(a) {
            for (var b = arguments.length, c = new Array(b > 1 ? b - 1 : 0), d = 1; d < b; d++) c[d - 1] = arguments[d];
            j("warn", this.category, a, c);
            return this
        };
        b.error = function(a) {
            for (var b = arguments.length, c = new Array(b > 1 ? b - 1 : 0), d = 1; d < b; d++) c[d - 1] = arguments[d];
            j("error", this.category, a, c);
            return this
        };
        return a
    }();

    function a(a) {
        h[a] || (h[a] = new k(a));
        return h[a]
    }

    function b() {
        return i
    }

    function c() {
        i.length = 0
    }

    function d(a) {
        return a.map(function(a) {
            var b = new Date(a.date).toISOString();
            return [b, a.level, a.category, a.event, a.args].join(" | ")
        }).join("\n")
    }
    f.getInstance = a;
    f.getEntries = b;
    f.clearEntries = c;
    f.formatEntries = d
}), 66);
__d("QuickMarkersSrcFalcoEvent", ["FalcoLoggerInternal", "getFalcoLogPolicy_DO_NOT_USE"], (function(a, b, c, d, e, f, g) {
    "use strict";
    a = c("getFalcoLogPolicy_DO_NOT_USE")("1836368");
    b = d("FalcoLoggerInternal").create("quick_markers_src", a);
    e = b;
    g["default"] = e
}), 98);
__d("UserActivity", ["cr:1634616"], (function(a, b, c, d, e, f) {
    e.exports = b("cr:1634616")
}), null);
__d("isTruthy", [], (function(a, b, c, d, e, f) {
    "use strict";

    function a(a) {
        return a != null && Boolean(a)
    }
    f["default"] = a
}), 66);
__d("UserActivityBlue", ["Arbiter", "Event", "isTruthy"], (function(a, b, c, d, e, f) {
    var g = 5e3,
        h = 500,
        i = -5,
        j = Date.now(),
        k = j,
        l = !1,
        m = Date.now(),
        n = document.hasFocus ? document.hasFocus() : !0,
        o = 0,
        p = Date.now(),
        q = -1,
        r = -1,
        s = !1,
        t = !1,
        u = {
            EVENT_INTERVAL_MS: h,
            subscribeOnce: function(a) {
                var b = u.subscribe(function(c, d) {
                    u.unsubscribe(b), a(d)
                });
                return b
            },
            subscribe: function(a) {
                return b("Arbiter").subscribe("useractivity/activity", a)
            },
            unsubscribe: function(a) {
                a.unsubscribe()
            },
            isActive: function(a) {
                return new Date().getTime() - j < (b("isTruthy")(a) ? a : g)
            },
            isOnTab: function() {
                return n
            },
            hasBeenInactive: function() {
                return l
            },
            resetActiveStatus: function() {
                n = !0, l = !1
            },
            getLastInActiveEnds: function() {
                return m
            },
            getLastActive: function() {
                return j
            },
            setIdleTime: function(a) {
                o = a
            },
            getLastLeaveTime: function() {
                return p
            },
            getLastInformTime: function() {
                return k
            },
            hasClicked: function() {
                return s
            },
            hasInteractedWithKeyboard: function() {
                return t
            },
            reset: function() {
                j = Date.now(), k = j, l = !1, m = Date.now(), n = document.hasFocus ? document.hasFocus() : !0, o = 0, p = Date.now(), q = -1, r = -1, s = !1, t = !1
            }
        };

    function v(a) {
        x(a, h)
    }

    function w(a) {
        x(a, 0)
    }

    function x(c, d) {
        d === void 0 && (d = 0);
        var e = a.KeyboardEvent,
            f = a.MouseEvent;
        if (f && c instanceof f) {
            if (/^mouse(enter|leave|move|out|over)$/.test(c.type) && c.pageX == q && c.pageY == r) return;
            q = c.pageX;
            r = c.pageY
        } else e && c instanceof e && (t = !0);
        (c.type === "click" || c.type === "dblclick" || c.type === "contextmenu") && (s = !0);
        j = Date.now();
        f = j - k;
        f > d ? (k = j, n || (p = j), f >= (o || g) && (l = !0, m = j), b("Arbiter").inform("useractivity/activity", {
            event: c,
            idleness: f,
            last_inform: k
        })) : f < i && (k = j)
    }

    function c(a) {
        n = !0, m = Date.now(), w(a)
    }

    function d(a) {
        n = !1, l = !0, p = Date.now()
    }
    b("Event").listen(window, "scroll", v);
    b("Event").listen(window, "focus", c);
    b("Event").listen(window, "blur", d);
    b("Event").listen(document.documentElement, {
        keydown: v,
        mouseover: v,
        mousemove: v,
        click: v
    }, void 0, void 0, {
        passive: !0
    });
    b("Arbiter").subscribe("Event/stop", function(a, b) {
        v(b.event)
    });
    e.exports = u
}), null);