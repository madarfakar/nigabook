; /*FB_PKG_DELIM*/

__d("DOMControl", ["$", "DataStore"], (function(a, b, c, d, e, f) {
    a = function() {
        "use strict";

        function a(a) {
            this.root = b("$").fromIDOrElement(a), this.updating = !1, b("DataStore").set(a, "DOMControl", this)
        }
        var c = a.prototype;
        c.getRoot = function() {
            return this.root
        };
        c.beginUpdate = function() {
            if (this.updating) return !1;
            this.updating = !0;
            return !0
        };
        c.endUpdate = function() {
            this.updating = !1
        };
        c.update = function(a) {
            if (!this.beginUpdate()) return this;
            this.onupdate(a);
            this.endUpdate()
        };
        c.onupdate = function(a) {};
        a.getInstance = function(a) {
            return b("DataStore").get(a, "DOMControl")
        };
        return a
    }();
    e.exports = a
}), null);
__d("Input", ["CSS", "DOMControl", "DOMQuery"], (function(a, b, c, d, e, f, g) {
    function h(a) {
        return !/\S/.test(a || "")
    }

    function i(a) {
        return h(a.value)
    }

    function a(a) {
        return i(a) ? "" : a.value
    }

    function b(a) {
        return a.value
    }

    function e(a, b) {
        a.value = b || "";
        b = c("DOMControl").getInstance(a);
        b && b.resetHeight && b.resetHeight()
    }

    function f(a, b) {
        b || (b = ""), a.setAttribute("aria-label", b), a.setAttribute("placeholder", b)
    }

    function j(a) {
        a.value = "", a.style.height = ""
    }

    function k(a, b) {
        d("CSS").conditionClass(a, "enter_submit", b)
    }

    function l(a) {
        return d("CSS").hasClass(a, "enter_submit")
    }

    function m(a, b) {
        b > 0 ? a.setAttribute("maxlength", b.toString()) : a.removeAttribute("maxlength")
    }
    g.isWhiteSpaceOnly = h;
    g.isEmpty = i;
    g.getValue = a;
    g.getValueRaw = b;
    g.setValue = e;
    g.setPlaceholder = f;
    g.reset = j;
    g.setSubmitOnEnter = k;
    g.getSubmitOnEnter = l;
    g.setMaxLength = m
}), 98);
__d("Form", ["DOM", "DOMQuery", "DTSG", "DTSGUtils", "DataStore", "FBLogger", "Input", "LSD", "PHPQuerySerializer", "Random", "SprinkleConfig", "URI", "getElementPosition", "isFacebookURI", "isNode"], (function(a, b, c, d, e, f, g) {
    var h, i, j = "FileList" in window,
        k = "FormData" in window;

    function l(a) {
        var b = {};
        (h || (h = c("PHPQuerySerializer"))).serialize(a).split("&").forEach(function(a) {
            if (a) {
                a = /^([^=]*)(?:=(.*))?$/.exec(a);
                var d = (i || (i = c("URI"))).decodeComponent(a[1]),
                    e = a[2] !== void 0;
                e = e ? (i || (i = c("URI"))).decodeComponent(a[2]) : null;
                b[d] = e
            }
        });
        return b
    }
    var m = {
        getInputs: function(a) {
            a === void 0 && (a = document);
            return [].concat(d("DOMQuery").scry(a, "input"), d("DOMQuery").scry(a, "select"), d("DOMQuery").scry(a, "textarea"), d("DOMQuery").scry(a, "button"))
        },
        getInputsByName: function(a) {
            var b = {};
            m.getInputs(a).forEach(function(a) {
                var c = b[a.name];
                b[a.name] = c === void 0 ? a : [a].concat(c)
            });
            return b
        },
        getSelectValue: function(a) {
            return a.options[a.selectedIndex].value
        },
        setSelectValue: function(a, b) {
            for (var c = 0; c < a.options.length; ++c)
                if (a.options[c].value === b) {
                    a.selectedIndex = c;
                    break
                }
        },
        getRadioValue: function(a) {
            for (var b = 0; b < a.length; b++)
                if (a[b].checked) return a[b].value;
            return null
        },
        getElements: function(a) {
            return a.tagName === "FORM" && a.elements !== a ? Array.from(a.elements) : m.getInputs(a)
        },
        getAttribute: function(a, b) {
            return (a.getAttributeNode(b) || {}).value || null
        },
        setDisabled: function(a, b) {
            m.getElements(a).forEach(function(a) {
                if (a.disabled !== void 0) {
                    var d = c("DataStore").get(a, "origDisabledState");
                    b ? (d === void 0 && c("DataStore").set(a, "origDisabledState", a.disabled), a.disabled = b) : d === !1 && (a.disabled = !1)
                }
            })
        },
        forEachValue: function(a, b, c) {
            m.getElements(a).forEach(function(a) {
                if (!a.name || a.disabled) return;
                if (a.type === "submit") return;
                if (a.type === "reset" || a.type === "button" || a.type === "image") return;
                if ((a.type === "radio" || a.type === "checkbox") && !a.checked) return;
                if (a.nodeName === "SELECT") {
                    for (var b = 0, e = a.options.length; b < e; b++) {
                        var f = a.options[b];
                        f.selected && c("select", a.name, f.value)
                    }
                    return
                }
                if (a.type === "file") {
                    if (j) {
                        f = a.files;
                        for (b = 0; b < f.length; b++) c("file", a.name, f.item(b))
                    }
                    return
                }
                c(a.type, a.name, d("Input").getValue(a))
            }), b && b.name && b.type === "submit" && d("DOMQuery").contains(a, b) && d("DOMQuery").isNodeOfType(b, ["input", "button"]) && c("submit", b.name, b.value)
        },
        createFormData: function(a, b) {
            if (!k) return null;
            var d = new FormData();
            if (a)
                if (c("isNode")(a)) m.forEachValue(a, b, function(a, b, c) {
                    d.append(b, c)
                });
                else {
                    b = l(a);
                    for (a in b) b[a] == null ? d.append(a, "") : d.append(a, b[a])
                }
            return d
        },
        serialize: function(a, b) {
            var c = {};
            m.forEachValue(a, b, function(a, b, d) {
                if (a === "file") return;
                m._serializeHelper(c, b, d)
            });
            return m._serializeFix(c)
        },
        _serializeHelper: function(a, b, c) {
            var d = Object.prototype.hasOwnProperty,
                e = /([^\]]+)\[([^\]]*)\](.*)/.exec(b);
            if (e) {
                if (!a[e[1]] || !d.call(a, e[1])) {
                    a[e[1]] = d = {};
                    if (a[e[1]] !== d) return
                }
                d = 0;
                if (e[2] === "")
                    while (a[e[1]][d] !== void 0) d++;
                else d = e[2];
                e[3] === "" ? a[e[1]][d] = c : m._serializeHelper(a[e[1]], d.concat(e[3]), c)
            } else a[b] = c
        },
        _serializeFix: function(a) {
            for (var b in a) a[b] instanceof Object && (a[b] = m._serializeFix(a[b]));
            b = Object.keys(a);
            if (b.length === 0 || b.some(isNaN)) return a;
            b.sort(function(a, b) {
                return a - b
            });
            var c = 0,
                d = b.every(function(a) {
                    return +a === c++
                });
            return d ? b.map(function(b) {
                return a[b]
            }) : a
        },
        post: function(a, b, e, f) {
            f === void 0 && (f = !0);
            a = new(i || (i = c("URI")))(a);
            var g = document.createElement("form");
            g.action = a.toString();
            g.method = "POST";
            g.style.display = "none";
            var h = !c("isFacebookURI")(a);
            if (e) {
                if (h) {
                    g.rel = "noreferrer";
                    if (e === "_blank") {
                        e = btoa(c("Random").uint32());
                        var j = window.open("about:blank", e);
                        j !== void 0 && (j.opener = null)
                    }
                }
                g.target = e
            }
            if (f && (!h && a.getSubdomain() !== "apps")) {
                j = d("DTSG").getToken();
                j && (b.fb_dtsg = j, c("SprinkleConfig").param_name && (b[c("SprinkleConfig").param_name] = c("DTSGUtils").getNumericValue(j)));
                c("LSD").token && (b.lsd = c("LSD").token, c("SprinkleConfig").param_name && !j && (b[c("SprinkleConfig").param_name] = c("DTSGUtils").getNumericValue(c("LSD").token)))
            }
            m.createHiddenInputs(b, g);
            d("DOMQuery").getRootElement().appendChild(g);
            g.submit();
            return !1
        },
        post_UNSAFE_LET_ANYONE_IMPERSONATE_THE_USER_FOR_THESE_WRITES: function(a, b, c) {
            m.post(a, b, c)
        },
        createHiddenInputs: function(a, b, d, e) {
            e === void 0 && (e = !1);
            d = d || {};
            a = l(a);
            for (var f in a) {
                if (a[f] === null) continue;
                if (d[f] && e) d[f].value = a[f];
                else {
                    var g = c("DOM").create("input", {
                        type: "hidden",
                        name: f,
                        value: a[f]
                    });
                    d[f] = g;
                    b.appendChild(g)
                }
            }
            return d
        },
        getFirstElement: function(a, b) {
            b === void 0 && (b = ['input[type="text"]', "textarea", 'input[type="password"]', 'input[type="button"]', 'input[type="submit"]']);
            var e = [];
            for (var f = 0; f < b.length; f++) {
                e = d("DOMQuery").scry(a, b[f]);
                for (var g = 0; g < e.length; g++) {
                    var h = e[g];
                    try {
                        var i = c("getElementPosition")(h);
                        if (i.y > 0 && i.x > 0) return h
                    } catch (a) {}
                }
            }
            return null
        },
        focusFirst: function(a) {
            a = m.getFirstElement(a);
            if (a) {
                a.focus();
                return !0
            }
            return !1
        }
    };
    f.exports = m
}), 34);