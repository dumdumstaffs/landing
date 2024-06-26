/*! Investorm v1.1.0 | Copyright by Softnio. */ ! function(a, b) {
    "use strict";

    function c() {
        let c = b("#update-profile"),
            e = b("#update-address"),
            f = b("#update-unverified-email"),
            g = b(".quick-update-profile"),
            h = b(".clear-profile-log"),
            i = b(".form-profile");
        a.Form.states(i), d(c), d(e), d(f), g.on("click", function(c) {
            let d, e, f = b(this),
                g = f.data("key"),
                h = f.attr("name"),
                i = f.attr("type"),
                j = f.attr("href");
            j !== void 0 && c.preventDefault(), i === y && (d = f.prop("checked") ? "on" : "off"), g && (e = g + "_" + h), h && profileSetting && a.Form.toPost(profileSetting, {
                profile_settings: {
                    option: e,
                    value: d
                }
            })
        }), h.on("click", function(c) {
            let d = b(this).attr("href"),
                e = b(this).data("action"),
                f = !!(typeof msgs != z && typeof msgs.logs != z && msgs.logs) && msgs.logs;
            d && f ? a.Ask(f.title, f.context, f.btn, "danger").then(function(b) {
                b && ("ajax" == e ? a.Form.toPost(d, {}) : window.location.href = d)
            }) : a.Toast(A, "error", {
                ui: "is-dark"
            }), c.preventDefault()
        })
    }

    function d(a) {
        let c = b(a);
        c.on("click", function(a) {
            a.preventDefault(), f(b(this))
        })
    }

    function e() {
        let c = b("#update-email"),
            d = b("#email-confirm-msg"),
            e = b("#email-modal-tgl"),
            f = b(".email-rq-verify"),
            g = "#confirm-email";
        c.on("click", function() {
            let c = b(this),
                f = c.closest("form.form-authentic"),
                h = c.closest(".modal");
            if (f.valid()) {
                let i = f.serialize(),
                    j = f.attr("action");
                c.prop("disabled", !0), a.Form.toPost(j, i, {
                    btn: c,
                    onSuccess: function(a) {
                        f[0].reset(), h.modal("hide"), d.text(a.msg), e.attr("data-target", g), b(g).modal({
                            show: !0,
                            backdrop: "static"
                        })
                    }
                })
            }
        }), f.on("click", function() {
            let c = b(this),
                d = c.data("url"),
                e = c.data("action");
            if (e) {
                let b = {
                    request_type: "cancel" === e ? "cancel" : "verification"
                };
                a.Form.toPost(d, b, {
                    btn: c,
                    reload: !("cancel" !== e),
                    after: function() {
                        setTimeout(function() {
                            a.Form.button(c, !0, !1)
                        }, 1e3)
                    }
                })
            }
        });
        let h = b("#update-password"),
            i = b("#change-password-success");
        h.on("click", function() {
            let c = b(this),
                d = c.closest("form.form-authentic"),
                e = c.closest(".modal");
            if (d.valid()) {
                let b = d.serialize(),
                    f = d.attr("action");
                c.prop("disabled", !0), a.Form.toPost(f, b, {
                    btn: c,
                    onSuccess: function() {
                        d[0].reset(), e.modal("hide"), i.modal({
                            show: !0
                        })
                    }
                })
            }
        })
    }

    function f(c) {
        let d = b(c),
            e = d.closest(".form-profile");
        e.valid() && a.Form.toSubmit(e, {
            btn: d,
            reload: !0
        })
    }

    function g() {
        let c = "#pm-step-container";
        w.on("click", "#deposit-now", function(d) {
            d.preventDefault();
            var e = b(this),
                f = e.closest("form"),
                g = f.find("#payment-option-list"),
                h = f.find("input[name=deposit_amount]"),
                j = f.find("input[name=deposit_method]:checked").val();
            j ? i(f, e, c) : (g.addClass("border-danger"), a.Toast(f.data("required_msg"), "warning"))
        }), w.on("click", "#proceed-btn", function(a) {
            a.preventDefault();
            let d = b(this),
                e = d.closest("form"),
                f = e.find("input[name=deposit_amount]"),
                g = parseFloat(f.val());
            g && 0 < g ? i(e, d, c) : f.addClass("border-danger")
        }), w.on("click", "#confirm-deposit", function(d) {
            d.preventDefault();
            let e = b(this),
                f = e.data("url");
            a.Form.toForward(f, {
                confirm: !0
            }, {
                btn: e,
                container: c
            })
        })
    }

    function h() {
        w.on("click", ".switch-currency", function() {
            let c = b(this),
                d = c.data("switch"),
                e = c.data("currency").toUpperCase();
            b("#" + d + "-currency-name").text(e), b("#" + d + "-currency").val(e), b("#" + d + "-min").val(e), a.Helper.du2v(c, e, {
                cfx: fxCur
            })
        })
    }

    function i(b, c, d) {
        let e = b.attr("action"),
            f = b.serialize();
        a.Form.toForward(e, f, {
            btn: c,
            container: d,
            after: p("input[name=deposit_amount]")
        })
    }

    function j() {
        let c = "#wd-step-container";
        w.on("click", "#withdraw-now", function(d) {
            d.preventDefault();
            var e = b(this),
                f = e.closest("form"),
                g = f.find("#wd-option-list"),
                h = f.find("input[name=withdraw_method]:checked").val();
            h ? m(f, e, c) : (g.addClass("border-danger"), a.Toast(f.data("required_msg"), "warning"))
        }), w.on("click", "#wdm-continue", function(d) {
            d.preventDefault();
            let e = b(this),
                f = e.closest("form"),
                g = f.find("input[name=wd_amount]"),
                h = parseFloat(g.val()),
                i = !0,
                j = "";
            (!h || 0 >= h) && (i = !1, j = reqMsg.required), !0 === i ? m(f, e, c) : (g.addClass("border-danger"), a.Toast(j, "warning"))
        }), w.on("click", "#wd-confirm", function(d) {
            d.preventDefault();
            let e = b(this),
                f = e.data("url");
            a.Form.toForward(f, {
                confirm: !0
            }, {
                btn: e,
                container: c
            })
        })
    }

    function k() {
        let c = "#wdm-amount-from";
        w.on("click", ".wdm-change", function() {
            let d = b(this),
                e = d.data("currency").toUpperCase();
            typeof fxCur == z ? a.Toast(A, "error", {
                ui: "is-dark"
            }) : (b(".wdm-change").parent().removeClass("selected"), d.parent().addClass("selected"), a.Helper.du2c(d, e), a.Helper.ufx(c, !1, {
                key: "wdm",
                cfx: fxCur
            }))
        }), w.on("input", ".wd-amount", function() {
            let d = b(this),
                e = d.val(),
                f = !d.is(c);
            d.val(e.replace(/[^\d.]/g, "")), a.Helper.ufx(d, f, {
                key: "wdm",
                cfx: fxCur
            })
        })
    }

    function l() {
        w.on("click", ".wd-view-account", function() {
            let c = b(this),
                d = c.data("action"),
                e = "#" + c.data("modal");
            a.Form.toModal(d, [], {
                modal: e
            })
        }), w.on("click", ".wd-new-account", function() {
            let c = b(this),
                d = c.data("action"),
                e = "#" + c.data("modal");
            a.Form.toModal(d, [], {
                modal: e
            })
        }), w.on("click", "#save-user-wd-account", function() {
            let c = b(this),
                d = c.closest("form"),
                e = c.closest(".modal"),
                f = d.attr("action"),
                g = d.serialize(),
                h = c.data("redirect");
            a.Form.button(c, !1, !0), "yes" == h ? a.Form.toForward(f, g, {
                btn: c,
                container: "#wd-step-container",
                modal: e
            }) : a.Form.toPost(f, g, {
                btn: c,
                reload: !0
            })
        }), w.on("click", "#delete-wd-account", function() {
            let c = b(this),
                d = c.data("url"),
                e = c.closest(".modal"),
                f = !!(typeof msgs != z && typeof msgs.wdm != z && msgs.wdm) && msgs.wdm;
            d && f ? a.Ask(f.title, f.context, f.btn, "danger").then(function(b) {
                b && a.Form.toPost(d, [], {
                    reload: 1e3,
                    position: "bottom-center",
                    hide: e
                })
            }) : a.Toast(A, "error", {
                ui: "is-dark"
            })
        })
    }

    function m(b, c, d) {
        let e = b.attr("action"),
            f = b.serialize();
        a.Form.toForward(e, f, {
            btn: c,
            container: d,
            after: p("input.wd-amount")
        })
    }

    function n() {
        let c = b(".update-meta a");
        c.on("click", function(c) {
            let d = b(this),
                e = d.data("meta"),
                f = d.data("value"),
                g = d.data("type"),
                h = d.data("update"),
                i = !(h && "silent" == h) && 500,
                j = !d.parent().hasClass("active");
            if (e && f && updateSetting && j) {
                a.Form.toPost(updateSetting, {
                    meta: e,
                    value: f,
                    type: g
                }, {
                    onSuccess: function(b) {
                        "warning" === b.type ? a.Toast(b.msg, b.type) : (i && setTimeout(function() {
                            window.location.reload()
                        }, i), console.log(b))
                    }
                })
            }
            c.preventDefault()
        })
    }

    function o() {
        let a = b(".pagination-dropdown");
        a.on("change", function() {
            window.location.href = b(this).val()
        })
    }

    function p(a) {
        w.on("input", a, function() {
            let a = b(this).val();
            b(this).val(a.replace(/[^\d.]/g, ""))
        })
    }

    function q() {
        w.on("click", ".tnx-details", function() {
            let c = b(this),
                d = {
                    id: c.data("tnx")
                };
            a.Form.toModal(getTnxDetails, d, {
                modal: x,
                backdrop: !0
            })
        }), w.on("click", "#make-paypal-payment", function() {
            let c = b(this),
                d = {
                    id: c.data("tnx")
                },
                e = c.data("url");
            e && a.Form.toPost(e, d, {
                btn: c,
                onSuccess: function(a) {
                    a.redirect && (window.location.href = a.approve_url.href)
                }
            })
        })
    }

    function r() {
        let c = b(".iv-payout");
        c.on("click", function(c) {
            c.preventDefault();
            let d = b(this),
                e = d.attr("href");
            a.Form.toModal(e, [], {
                modal: x
            })
        }), w.on("click", ".iv-payout-proceed", function() {
            let c = b(this),
                d = c.parents("form"),
                e = d.attr("action"),
                f = d.serialize();
            e && a.Form.toPost(e, f, {
                btn: c,
                after: function() {
                    setTimeout(function() {
                        c.parents(".modal").modal("hide")
                    }, 800)
                }
            })
        })
    }

    function s() {
        function c(c, d, e) {
            a.Form.toPost(c, d, {
                btn: b(e),
                reload: !0
            })
        }
        let d = "#iv-step-container";
        w.on("click", ".iv-plan-change", function() {
            let c = b(this),
                d = c.data("plan"),
                e = c.data("uid"),
                f = c.data("change"),
                g = b("." + f + "-min"),
                h = b("." + f + "-max"),
                i = b("." + f + "-fixed"),
                j = b("." + f + "-lb-amount"),
                k = b("." + f + "-lb-fixed"),
                l = b("." + f + "-amount");
            if (typeof plans != z && typeof plans[e] != z) {
                b(".iv-plan-change").parent().removeClass("selected"), c.parent().addClass("selected"), b("#" + f).val(d), b("#" + f + "-scheme").html(c.html());
                let a = plans[e].min,
                    m = plans[e].max,
                    n = plans[e].amount,
                    o = plans[e].fixed;
                1 == o ? (l.val(n).removeAttr("placeholder").attr("readonly", !0), h.add(g).add(h).add(j).addClass("hide"), i.add(k).removeClass("hide")) : (l.attr("placeholder", n).removeAttr("readonly").val(""), h.add(g).add(h).add(j).removeClass("hide"), i.add(k).addClass("hide"), 0 == a ? g.addClass("hide") : g.removeClass("hide").find(".amount").html(a), 0 == m ? h.addClass("hide") : h.removeClass("hide").find(".amount").html(m))
            } else a.Toast(A, "error", {
                ui: "is-dark"
            })
        }), w.on("click", ".iv-get-started", function(c) {
            c.preventDefault();
            let e = b(this),
                f = e.parents("form"),
                g = f.attr("action"),
                h = f.serialize();
            a.Form.toForward(g, h, {
                btn: e,
                container: d
            })
        }), w.on("click", ".iv-invest-confirm", function(c) {
            c.preventDefault(), typeof routes.confirm == z ? a.Toast(A, "error", {
                ui: "is-dark"
            }) : a.Form.toPost(routes.confirm, {
                action: "confirm"
            }, {
                btn: b(this),
                onSuccess: function(a) {
                    b(d).html(a)
                }
            })
        }), w.on("click", ".iv-invest-cancel", function(d) {
            d.preventDefault();
            let e = b(this),
                f = e.data("action"),
                g = e.data("confirm");
            console.log(f, g), typeof routes[f] == z ? a.Toast(A, "error", {
                ui: "is-dark"
            }) : g && typeof msgs[f] != z && msgs[f] ? a.Ask(msgs[f].title, msgs[f].context, msgs[f].btn, msgs[f].custom, msgs[f].type).then(function(a) {
                a && c(routes[f], {
                    action: "cancel"
                }, e)
            }) : c(routes[f], {
                action: "cancel"
            }, e)
        })
    }

    function t() {
        let c = b(".submit-form");
        c.on("click", function(d) {
            d.preventDefault();
            let e = b(this).parents("form");
            e.valid() && (a.Form.button(c, !1, !0), a.Form.toSubmit(e, {
                btn: c
            }))
        })
    }

    function u() {
        let c = b(".ajax-submit");
        c.on("click", function(c) {
            let d = b(this),
                e = d.parents("form"),
                f = e.attr("action"),
                g = e.serialize();
            f && g && a.Form.toPost(f, g, {
                btn: d
            }), c.preventDefault()
        })
    }

    function v() {
        let c = b(".validate-username"),
            d = null;
        c.on("input", function() {
            let c = b(this),
                e = typeof routes != z && routes,
                f = c.val(),
                g = c.parent("div").find(".validate-username-loader"),
                h = c.parent("div").find(".validate-username-error");
            d && clearTimeout(d), g.removeClass("hide"), h.addClass("hide"), e.validate ? d = setTimeout(function() {
                a.Form.toPost(e.validate, {
                    username: f
                }, {
                    onSuccess: function(a) {
                        g.addClass("hide"), h.removeClass("hide"), a.note && h.attr("data-original-title", a.note), a.error ? h.removeClass("ni-check").addClass("ni-alert") : h.removeClass("ni-alert").addClass("ni-check")
                    }
                })
            }, 300) : a.Toast(A, "error", {
                ui: "is-dark"
            })
        })
    }
    let w = b(document),
        x = b("#ajax-modal"),
        y = "checkbox",
        z = "undefined",
        A = "Something is wrong or may invalid action.";
    b.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": b("meta[name=\"csrf-token\"]").attr("content")
        }
    }), w.ready(function() {
        g(), h(), j(), k(), l(), c(), e(), n(), o(), q(), s(), r(), v(), t(), u()
    })
}(NioApp, jQuery);