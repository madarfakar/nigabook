; /*FB_PKG_DELIM*/

__d("Deferred", ["Promise"], (function(a, b, c, d, e, f) {
    "use strict";
    var g;
    (g || (g = b("Promise"))).resolve();
    a = function() {
        function a(a) {
            var c = this;
            a = a || g || (g = b("Promise"));
            this.$1 = !1;
            this.$2 = new a(function(a, b) {
                c.$3 = a, c.$4 = b
            })
        }
        var c = a.prototype;
        c.getPromise = function() {
            return this.$2
        };
        c.resolve = function(a) {
            this.$1 = !0, this.$3(a)
        };
        c.reject = function(a) {
            this.$1 = !0, this.$4(a)
        };
        c.isSettled = function() {
            return this.$1
        };
        return a
    }();
    f["default"] = a
}), 66);
__d("isArDotMetaDotComURI", [], (function(a, b, c, d, e, f) {
    var g = new RegExp("(^|\\.)ar\\.meta\\.com$", "i"),
        h = ["https"];

    function a(a) {
        if (a.isEmpty() && a.toString() !== "#") return !1;
        return !a.getDomain() && !a.getProtocol() ? !1 : h.indexOf(a.getProtocol()) !== -1 && g.test(a.getDomain())
    }
    f["default"] = a
}), 66);
__d("isHorizonDotMetaDotComURI", [], (function(a, b, c, d, e, f) {
    var g = new RegExp("(^|\\.)horizon\\.meta\\.com$", "i"),
        h = ["https"];

    function a(a) {
        if (a.isEmpty() && a.toString() !== "#") return !1;
        return !a.getDomain() && !a.getProtocol() ? !1 : h.indexOf(a.getProtocol()) !== -1 && g.test(a.getDomain())
    }
    f["default"] = a
}), 66);
__d("isWorkDotMetaDotComURI", [], (function(a, b, c, d, e, f) {
    var g = new RegExp("(^|\\.)work\\.meta\\.com$", "i"),
        h = ["https"];

    function a(a) {
        if (a.isEmpty() && a.toString() !== "#") return !1;
        return !a.getDomain() && !a.getProtocol() ? !1 : h.indexOf(a.getProtocol()) !== -1 && g.test(a.getDomain())
    }
    f["default"] = a
}), 66);
__d("isWorkroomsDotComURI", [], (function(a, b, c, d, e, f) {
    var g = new RegExp("(^|\\.)workrooms\\.com$", "i"),
        h = ["https"];

    function a(a) {
        if (a.isEmpty() && a.toString() !== "#") return !1;
        return !a.getDomain() && !a.getProtocol() ? !1 : h.indexOf(a.getProtocol()) !== -1 && g.test(a.getDomain())
    }
    f["default"] = a
}), 66);
__d("IntlCLDRNumberType01", ["IntlVariations"], (function(a, b, c, d, e, f, g) {
    "use strict";
    a = {
        getVariation: function(a) {
            return c("IntlVariations").NUMBER_OTHER
        }
    };
    b = a;
    g["default"] = b
}), 98);
__d("getContextualParent", ["ge"], (function(a, b, c, d, e, f, g) {
    function a(a, b) {
        b === void 0 && (b = !1);
        var d = !1;
        a = a;
        do {
            if (a instanceof Element) {
                var e = a.getAttribute("data-ownerid");
                if (e) {
                    a = c("ge")(e);
                    d = !0;
                    continue
                }
            }
            a = a.parentNode
        } while (b && a && !d);
        return a
    }
    g["default"] = a
}), 98);