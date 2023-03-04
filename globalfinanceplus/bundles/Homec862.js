!(function (n, t, i, r) {
    function u(t, i) {
        this.settings = null;
        this.options = n.extend({}, u.Defaults, i);
        this.$element = n(t);
        this._handlers = {};
        this._plugins = {};
        this._supress = {};
        this._current = null;
        this._speed = null;
        this._coordinates = [];
        this._breakpoint = null;
        this._width = null;
        this._items = [];
        this._clones = [];
        this._mergers = [];
        this._widths = [];
        this._invalidated = {};
        this._pipe = [];
        this._drag = {
            time: null,
            target: null,
            pointer: null,
            stage: { start: null, current: null },
            direction: null,
        };
        this._states = {
            current: {},
            tags: {
                initializing: ["busy"],
                animating: ["busy"],
                dragging: ["interacting"],
            },
        };
        n.each(
            ["onResize", "onThrottledResize"],
            n.proxy(function (t, i) {
                this._handlers[i] = n.proxy(this[i], this);
            }, this)
        );
        n.each(
            u.Plugins,
            n.proxy(function (n, t) {
                this._plugins[n.charAt(0).toLowerCase() + n.slice(1)] = new t(this);
            }, this)
        );
        n.each(
            u.Workers,
            n.proxy(function (t, i) {
                this._pipe.push({ filter: i.filter, run: n.proxy(i.run, this) });
            }, this)
        );
        this.setup();
        this.initialize();
    }
    u.Defaults = {
        items: 3,
        loop: !1,
        center: !1,
        rewind: !1,
        mouseDrag: !0,
        touchDrag: !0,
        pullDrag: !0,
        freeDrag: !1,
        margin: 0,
        stagePadding: 0,
        merge: !1,
        mergeFit: !0,
        autoWidth: !1,
        startPosition: 0,
        rtl: !1,
        smartSpeed: 250,
        fluidSpeed: !1,
        dragEndSpeed: !1,
        responsive: {},
        responsiveRefreshRate: 200,
        responsiveBaseElement: t,
        fallbackEasing: "swing",
        info: !1,
        nestedItemSelector: !1,
        itemElement: "div",
        stageElement: "div",
        refreshClass: "owl-refresh",
        loadedClass: "owl-loaded",
        loadingClass: "owl-loading",
        rtlClass: "owl-rtl",
        responsiveClass: "owl-responsive",
        dragClass: "owl-drag",
        itemClass: "owl-item",
        stageClass: "owl-stage",
        stageOuterClass: "owl-stage-outer",
        grabClass: "owl-grab",
    };
    u.Width = { Default: "default", Inner: "inner", Outer: "outer" };
    u.Type = { Event: "event", State: "state" };
    u.Plugins = {};
    u.Workers = [
        {
            filter: ["width", "settings"],
            run: function () {
                this._width = this.$element.width();
            },
        },
        {
            filter: ["width", "items", "settings"],
            run: function (n) {
                n.current = this._items && this._items[this.relative(this._current)];
            },
        },
        {
            filter: ["items", "settings"],
            run: function () {
                this.$stage.children(".cloned").remove();
            },
        },
        {
            filter: ["width", "items", "settings"],
            run: function (n) {
                var t = this.settings.margin || "",
                    u = !this.settings.autoWidth,
                    i = this.settings.rtl,
                    r = {
                        width: "auto",
                        "margin-left": i ? t : "",
                        "margin-right": i ? "" : t,
                    };
                u || this.$stage.children().css(r);
                n.css = r;
            },
        },
        {
            filter: ["width", "items", "settings"],
            run: function (n) {
                var r =
                    (this.width() / this.settings.items).toFixed(3) -
                    this.settings.margin,
                    t = null,
                    i = this._items.length,
                    f = !this.settings.autoWidth,
                    u = [];
                for (n.items = { merge: !1, width: r }; i--;)
                    (t = this._mergers[i]),
                        (t =
                            (this.settings.mergeFit && Math.min(t, this.settings.items)) ||
                            t),
                        (n.items.merge = t > 1 || n.items.merge),
                        (u[i] = f ? r * t : this._items[i].width());
                this._widths = u;
            },
        },
        {
            filter: ["items", "settings"],
            run: function () {
                var t = [],
                    i = this._items,
                    r = this.settings,
                    f = Math.max(2 * r.items, 4),
                    s = 2 * Math.ceil(i.length / 2),
                    e = r.loop && i.length ? (r.rewind ? f : Math.max(f, s)) : 0,
                    o = "",
                    u = "";
                for (e /= 2; e--;)
                    t.push(this.normalize(t.length / 2, !0)),
                        (o += i[t[t.length - 1]][0].outerHTML),
                        t.push(this.normalize(i.length - 1 - (t.length - 1) / 2, !0)),
                        (u = i[t[t.length - 1]][0].outerHTML + u);
                this._clones = t;
                n(o).addClass("cloned").appendTo(this.$stage);
                n(u).addClass("cloned").prependTo(this.$stage);
            },
        },
        {
            filter: ["width", "items", "settings"],
            run: function () {
                for (
                    var u = this.settings.rtl ? 1 : -1,
                    f = this._clones.length + this._items.length,
                    n = -1,
                    i = 0,
                    r = 0,
                    t = [];
                    ++n < f;

                )
                    (i = t[n - 1] || 0),
                        (r = this._widths[this.relative(n)] + this.settings.margin),
                        t.push(i + r * u);
                this._coordinates = t;
            },
        },
        {
            filter: ["width", "items", "settings"],
            run: function () {
                var n = this.settings.stagePadding,
                    t = this._coordinates,
                    i = {
                        width: Math.ceil(Math.abs(t[t.length - 1])) + 2 * n,
                        "padding-left": n || "",
                        "padding-right": n || "",
                    };
                this.$stage.css(i);
            },
        },
        {
            filter: ["width", "items", "settings"],
            run: function (n) {
                var t = this._coordinates.length,
                    i = !this.settings.autoWidth,
                    r = this.$stage.children();
                if (i && n.items.merge)
                    for (; t--;)
                        (n.css.width = this._widths[this.relative(t)]), r.eq(t).css(n.css);
                else i && ((n.css.width = n.items.width), r.css(n.css));
            },
        },
        {
            filter: ["items"],
            run: function () {
                this._coordinates.length < 1 && this.$stage.removeAttr("style");
            },
        },
        {
            filter: ["width", "items", "settings"],
            run: function (n) {
                n.current = n.current ? this.$stage.children().index(n.current) : 0;
                n.current = Math.max(
                    this.minimum(),
                    Math.min(this.maximum(), n.current)
                );
                this.reset(n.current);
            },
        },
        {
            filter: ["position"],
            run: function () {
                this.animate(this.coordinates(this._current));
            },
        },
        {
            filter: ["width", "position", "items", "settings"],
            run: function () {
                for (
                    var t,
                    i,
                    f = this.settings.rtl ? 1 : -1,
                    e = 2 * this.settings.stagePadding,
                    r = this.coordinates(this.current()) + e,
                    o = r + this.width() * f,
                    s = [],
                    n = 0,
                    u = this._coordinates.length;
                    n < u;
                    n++
                )
                    (t = this._coordinates[n - 1] || 0),
                        (i = Math.abs(this._coordinates[n]) + e * f),
                        ((this.op(t, "<=", r) && this.op(t, ">", o)) ||
                            (this.op(i, "<", r) && this.op(i, ">", o))) &&
                        s.push(n);
                this.$stage.children(".active").removeClass("active");
                this.$stage
                    .children(":eq(" + s.join("), :eq(") + ")")
                    .addClass("active");
                this.settings.center &&
                    (this.$stage.children(".center").removeClass("center"),
                        this.$stage.children().eq(this.current()).addClass("center"));
            },
        },
    ];
    u.prototype.initialize = function () {
        if (
            (this.enter("initializing"),
                this.trigger("initialize"),
                this.$element.toggleClass(this.settings.rtlClass, this.settings.rtl),
                this.settings.autoWidth && !this.is("pre-loading"))
        ) {
            var t, i, u;
            t = this.$element.find("img");
            i = this.settings.nestedItemSelector
                ? "." + this.settings.nestedItemSelector
                : r;
            u = this.$element.children(i).width();
            t.length && u <= 0 && this.preloadAutoWidthImages(t);
        }
        this.$element.addClass(this.options.loadingClass);
        this.$stage = n(
            "<" +
            this.settings.stageElement +
            ' class="' +
            this.settings.stageClass +
            '"/>'
        ).wrap('<div class="' + this.settings.stageOuterClass + '"/>');
        this.$element.append(this.$stage.parent());
        this.replace(this.$element.children().not(this.$stage.parent()));
        this.$element.is(":visible") ? this.refresh() : this.invalidate("width");
        this.$element
            .removeClass(this.options.loadingClass)
            .addClass(this.options.loadedClass);
        this.registerEventHandlers();
        this.leave("initializing");
        this.trigger("initialized");
    };
    u.prototype.setup = function () {
        var u = this.viewport(),
            r = this.options.responsive,
            i = -1,
            t = null;
        r
            ? (n.each(r, function (n) {
                n <= u && n > i && (i = Number(n));
            }),
                (t = n.extend({}, this.options, r[i])),
                "function" == typeof t.stagePadding &&
                (t.stagePadding = t.stagePadding()),
                delete t.responsive,
                t.responsiveClass &&
                this.$element.attr(
                    "class",
                    this.$element
                        .attr("class")
                        .replace(
                            new RegExp(
                                "(" + this.options.responsiveClass + "-)\\S+\\s",
                                "g"
                            ),
                            "$1" + i
                        )
                ))
            : (t = n.extend({}, this.options));
        this.trigger("change", { property: { name: "settings", value: t } });
        this._breakpoint = i;
        this.settings = t;
        this.invalidate("settings");
        this.trigger("changed", {
            property: { name: "settings", value: this.settings },
        });
    };
    u.prototype.optionsLogic = function () {
        this.settings.autoWidth &&
            ((this.settings.stagePadding = !1), (this.settings.merge = !1));
    };
    u.prototype.prepare = function (t) {
        var i = this.trigger("prepare", { content: t });
        return (
            i.data ||
            (i.data = n("<" + this.settings.itemElement + "/>")
                .addClass(this.options.itemClass)
                .append(t)),
            this.trigger("prepared", { content: i.data }),
            i.data
        );
    };
    u.prototype.update = function () {
        for (
            var t = 0,
            i = this._pipe.length,
            r = n.proxy(function (n) {
                return this[n];
            }, this._invalidated),
            u = {};
            t < i;

        )
            (this._invalidated.all || n.grep(this._pipe[t].filter, r).length > 0) &&
                this._pipe[t].run(u),
                t++;
        this._invalidated = {};
        this.is("valid") || this.enter("valid");
    };
    u.prototype.width = function (n) {
        switch ((n = n || u.Width.Default)) {
            case u.Width.Inner:
            case u.Width.Outer:
                return this._width;
            default:
                return (
                    this._width - 2 * this.settings.stagePadding + this.settings.margin
                );
        }
    };
    u.prototype.refresh = function () {
        this.enter("refreshing");
        this.trigger("refresh");
        this.setup();
        this.optionsLogic();
        this.$element.addClass(this.options.refreshClass);
        this.update();
        this.$element.removeClass(this.options.refreshClass);
        this.leave("refreshing");
        this.trigger("refreshed");
    };
    u.prototype.onThrottledResize = function () {
        t.clearTimeout(this.resizeTimer);
        this.resizeTimer = t.setTimeout(
            this._handlers.onResize,
            this.settings.responsiveRefreshRate
        );
    };
    u.prototype.onResize = function () {
        return (
            !!this._items.length &&
            this._width !== this.$element.width() &&
            !!this.$element.is(":visible") &&
            (this.enter("resizing"),
                this.trigger("resize").isDefaultPrevented()
                    ? (this.leave("resizing"), !1)
                    : (this.invalidate("width"),
                        this.refresh(),
                        this.leave("resizing"),
                        void this.trigger("resized")))
        );
    };
    u.prototype.registerEventHandlers = function () {
        n.support.transition &&
            this.$stage.on(
                n.support.transition.end + ".owl.core",
                n.proxy(this.onTransitionEnd, this)
            );
        this.settings.responsive !== !1 &&
            this.on(t, "resize", this._handlers.onThrottledResize);
        this.settings.mouseDrag &&
            (this.$element.addClass(this.options.dragClass),
                this.$stage.on("mousedown.owl.core", n.proxy(this.onDragStart, this)),
                this.$stage.on("dragstart.owl.core selectstart.owl.core", function () {
                    return !1;
                }));
        this.settings.touchDrag &&
            (this.$stage.on("touchstart.owl.core", n.proxy(this.onDragStart, this)),
                this.$stage.on("touchcancel.owl.core", n.proxy(this.onDragEnd, this)));
    };
    u.prototype.onDragStart = function (t) {
        var r = null;
        3 !== t.which &&
            (n.support.transform
                ? ((r = this.$stage
                    .css("transform")
                    .replace(/.*\(|\)| /g, "")
                    .split(",")),
                    (r = {
                        x: r[16 === r.length ? 12 : 4],
                        y: r[16 === r.length ? 13 : 5],
                    }))
                : ((r = this.$stage.position()),
                    (r = {
                        x: this.settings.rtl
                            ? r.left +
                            this.$stage.width() -
                            this.width() +
                            this.settings.margin
                            : r.left,
                        y: r.top,
                    })),
                this.is("animating") &&
                (n.support.transform ? this.animate(r.x) : this.$stage.stop(),
                    this.invalidate("position")),
                this.$element.toggleClass(this.options.grabClass, "mousedown" === t.type),
                this.speed(0),
                (this._drag.time = new Date().getTime()),
                (this._drag.target = n(t.target)),
                (this._drag.stage.start = r),
                (this._drag.stage.current = r),
                (this._drag.pointer = this.pointer(t)),
                n(i).on(
                    "mouseup.owl.core touchend.owl.core",
                    n.proxy(this.onDragEnd, this)
                ),
                n(i).one(
                    "mousemove.owl.core touchmove.owl.core",
                    n.proxy(function (t) {
                        var r = this.difference(this._drag.pointer, this.pointer(t));
                        n(i).on(
                            "mousemove.owl.core touchmove.owl.core",
                            n.proxy(this.onDragMove, this)
                        );
                        (Math.abs(r.x) < Math.abs(r.y) && this.is("valid")) ||
                            (t.preventDefault(), this.enter("dragging"), this.trigger("drag"));
                    }, this)
                ));
    };
    u.prototype.onDragMove = function (n) {
        var t = null,
            i = null,
            u = null,
            f = this.difference(this._drag.pointer, this.pointer(n)),
            r = this.difference(this._drag.stage.start, f);
        this.is("dragging") &&
            (n.preventDefault(),
                this.settings.loop
                    ? ((t = this.coordinates(this.minimum())),
                        (i = this.coordinates(this.maximum() + 1) - t),
                        (r.x = ((((r.x - t) % i) + i) % i) + t))
                    : ((t = this.settings.rtl
                        ? this.coordinates(this.maximum())
                        : this.coordinates(this.minimum())),
                        (i = this.settings.rtl
                            ? this.coordinates(this.minimum())
                            : this.coordinates(this.maximum())),
                        (u = this.settings.pullDrag ? f.x / -5 : 0),
                        (r.x = Math.max(Math.min(r.x, t + u), i + u))),
                (this._drag.stage.current = r),
                this.animate(r.x));
    };
    u.prototype.onDragEnd = function (t) {
        var r = this.difference(this._drag.pointer, this.pointer(t)),
            f = this._drag.stage.current,
            u = (r.x > 0) ^ this.settings.rtl ? "left" : "right";
        n(i).off(".owl.core");
        this.$element.removeClass(this.options.grabClass);
        ((0 !== r.x && this.is("dragging")) || !this.is("valid")) &&
            (this.speed(this.settings.dragEndSpeed || this.settings.smartSpeed),
                this.current(this.closest(f.x, 0 !== r.x ? u : this._drag.direction)),
                this.invalidate("position"),
                this.update(),
                (this._drag.direction = u),
                (Math.abs(r.x) > 3 || new Date().getTime() - this._drag.time > 300) &&
                this._drag.target.one("click.owl.core", function () {
                    return !1;
                }));
        this.is("dragging") && (this.leave("dragging"), this.trigger("dragged"));
    };
    u.prototype.closest = function (t, i) {
        var r = -1,
            u = 30,
            e = this.width(),
            f = this.coordinates();
        return (
            this.settings.freeDrag ||
            n.each(
                f,
                n.proxy(function (n, o) {
                    return (
                        "left" === i && t > o - u && t < o + u
                            ? (r = n)
                            : "right" === i && t > o - e - u && t < o - e + u
                                ? (r = n + 1)
                                : this.op(t, "<", o) &&
                                this.op(t, ">", f[n + 1] || o - e) &&
                                (r = "left" === i ? n + 1 : n),
                        r === -1
                    );
                }, this)
            ),
            this.settings.loop ||
            (this.op(t, ">", f[this.minimum()])
                ? (r = t = this.minimum())
                : this.op(t, "<", f[this.maximum()]) && (r = t = this.maximum())),
            r
        );
    };
    u.prototype.animate = function (t) {
        var i = this.speed() > 0;
        this.is("animating") && this.onTransitionEnd();
        i && (this.enter("animating"), this.trigger("translate"));
        n.support.transform3d && n.support.transition
            ? this.$stage.css({
                transform: "translate3d(" + t + "px,0px,0px)",
                transition: this.speed() / 1e3 + "s",
            })
            : i
                ? this.$stage.animate(
                    { left: t + "px" },
                    this.speed(),
                    this.settings.fallbackEasing,
                    n.proxy(this.onTransitionEnd, this)
                )
                : this.$stage.css({ left: t + "px" });
    };
    u.prototype.is = function (n) {
        return this._states.current[n] && this._states.current[n] > 0;
    };
    u.prototype.current = function (n) {
        if (n === r) return this._current;
        if (0 === this._items.length) return r;
        if (((n = this.normalize(n)), this._current !== n)) {
            var t = this.trigger("change", {
                property: { name: "position", value: n },
            });
            t.data !== r && (n = this.normalize(t.data));
            this._current = n;
            this.invalidate("position");
            this.trigger("changed", {
                property: { name: "position", value: this._current },
            });
        }
        return this._current;
    };
    u.prototype.invalidate = function (t) {
        return (
            "string" === n.type(t) &&
            ((this._invalidated[t] = !0), this.is("valid") && this.leave("valid")),
            n.map(this._invalidated, function (n, t) {
                return t;
            })
        );
    };
    u.prototype.reset = function (n) {
        n = this.normalize(n);
        n !== r &&
            ((this._speed = 0),
                (this._current = n),
                this.suppress(["translate", "translated"]),
                this.animate(this.coordinates(n)),
                this.release(["translate", "translated"]));
    };
    u.prototype.normalize = function (n, t) {
        var i = this._items.length,
            u = t ? 0 : this._clones.length;
        return (
            !this.isNumeric(n) || i < 1
                ? (n = r)
                : (n < 0 || n >= i + u) && (n = ((((n - u / 2) % i) + i) % i) + u / 2),
            n
        );
    };
    u.prototype.relative = function (n) {
        return (n -= this._clones.length / 2), this.normalize(n, !0);
    };
    u.prototype.maximum = function (n) {
        var t,
            u,
            f,
            i = this.settings,
            r = this._coordinates.length;
        if (i.loop) r = this._clones.length / 2 + this._items.length - 1;
        else if (i.autoWidth || i.merge) {
            for (
                t = this._items.length,
                u = this._items[--t].width(),
                f = this.$element.width();
                t-- && ((u += this._items[t].width() + this.settings.margin), !(u > f));

            );
            r = t + 1;
        } else r = i.center ? this._items.length - 1 : this._items.length - i.items;
        return n && (r -= this._clones.length / 2), Math.max(r, 0);
    };
    u.prototype.minimum = function (n) {
        return n ? 0 : this._clones.length / 2;
    };
    u.prototype.items = function (n) {
        return n === r
            ? this._items.slice()
            : ((n = this.normalize(n, !0)), this._items[n]);
    };
    u.prototype.mergers = function (n) {
        return n === r
            ? this._mergers.slice()
            : ((n = this.normalize(n, !0)), this._mergers[n]);
    };
    u.prototype.clones = function (t) {
        var i = this._clones.length / 2,
            f = i + this._items.length,
            u = function (n) {
                return n % 2 == 0 ? f + n / 2 : i - (n + 1) / 2;
            };
        return t === r
            ? n.map(this._clones, function (n, t) {
                return u(t);
            })
            : n.map(this._clones, function (n, i) {
                return n === t ? u(i) : null;
            });
    };
    u.prototype.speed = function (n) {
        return n !== r && (this._speed = n), this._speed;
    };
    u.prototype.coordinates = function (t) {
        var i,
            f = 1,
            u = t - 1;
        return t === r
            ? n.map(
                this._coordinates,
                n.proxy(function (n, t) {
                    return this.coordinates(t);
                }, this)
            )
            : (this.settings.center
                ? (this.settings.rtl && ((f = -1), (u = t + 1)),
                    (i = this._coordinates[t]),
                    (i += ((this.width() - i + (this._coordinates[u] || 0)) / 2) * f))
                : (i = this._coordinates[u] || 0),
                (i = Math.ceil(i)));
    };
    u.prototype.duration = function (n, t, i) {
        return 0 === i
            ? 0
            : Math.min(Math.max(Math.abs(t - n), 1), 6) *
            Math.abs(i || this.settings.smartSpeed);
    };
    u.prototype.to = function (n, t) {
        var f = this.current(),
            r = null,
            i = n - this.relative(f),
            s = (i > 0) - (i < 0),
            e = this._items.length,
            o = this.minimum(),
            u = this.maximum();
        this.settings.loop
            ? (!this.settings.rewind && Math.abs(i) > e / 2 && (i += s * -1 * e),
                (n = f + i),
                (r = ((((n - o) % e) + e) % e) + o),
                r !== n &&
                r - i <= u &&
                r - i > 0 &&
                ((f = r - i), (n = r), this.reset(f)))
            : this.settings.rewind
                ? ((u += 1), (n = ((n % u) + u) % u))
                : (n = Math.max(o, Math.min(u, n)));
        this.speed(this.duration(f, n, t));
        this.current(n);
        this.$element.is(":visible") && this.update();
    };
    u.prototype.next = function (n) {
        n = n || !1;
        this.to(this.relative(this.current()) + 1, n);
    };
    u.prototype.prev = function (n) {
        n = n || !1;
        this.to(this.relative(this.current()) - 1, n);
    };
    u.prototype.onTransitionEnd = function (n) {
        if (
            n !== r &&
            (n.stopPropagation(),
                (n.target || n.srcElement || n.originalTarget) !== this.$stage.get(0))
        )
            return !1;
        this.leave("animating");
        this.trigger("translated");
    };
    u.prototype.viewport = function () {
        var r;
        return (
            this.options.responsiveBaseElement !== t
                ? (r = n(this.options.responsiveBaseElement).width())
                : t.innerWidth
                    ? (r = t.innerWidth)
                    : i.documentElement && i.documentElement.clientWidth
                        ? (r = i.documentElement.clientWidth)
                        : console.warn("Can not detect viewport width."),
            r
        );
    };
    u.prototype.replace = function (t) {
        this.$stage.empty();
        this._items = [];
        t && (t = t instanceof jQuery ? t : n(t));
        this.settings.nestedItemSelector &&
            (t = t.find("." + this.settings.nestedItemSelector));
        t.filter(function () {
            return 1 === this.nodeType;
        }).each(
            n.proxy(function (n, t) {
                t = this.prepare(t);
                this.$stage.append(t);
                this._items.push(t);
                this._mergers.push(
                    1 *
                    t.find("[data-merge]").addBack("[data-merge]").attr("data-merge") ||
                    1
                );
            }, this)
        );
        this.reset(
            this.isNumeric(this.settings.startPosition)
                ? this.settings.startPosition
                : 0
        );
        this.invalidate("items");
    };
    u.prototype.add = function (t, i) {
        var u = this.relative(this._current);
        i = i === r ? this._items.length : this.normalize(i, !0);
        t = t instanceof jQuery ? t : n(t);
        this.trigger("add", { content: t, position: i });
        t = this.prepare(t);
        0 === this._items.length || i === this._items.length
            ? (0 === this._items.length && this.$stage.append(t),
                0 !== this._items.length && this._items[i - 1].after(t),
                this._items.push(t),
                this._mergers.push(
                    1 *
                    t.find("[data-merge]").addBack("[data-merge]").attr("data-merge") ||
                    1
                ))
            : (this._items[i].before(t),
                this._items.splice(i, 0, t),
                this._mergers.splice(
                    i,
                    0,
                    1 *
                    t.find("[data-merge]").addBack("[data-merge]").attr("data-merge") ||
                    1
                ));
        this._items[u] && this.reset(this._items[u].index());
        this.invalidate("items");
        this.trigger("added", { content: t, position: i });
    };
    u.prototype.remove = function (n) {
        n = this.normalize(n, !0);
        n !== r &&
            (this.trigger("remove", { content: this._items[n], position: n }),
                this._items[n].remove(),
                this._items.splice(n, 1),
                this._mergers.splice(n, 1),
                this.invalidate("items"),
                this.trigger("removed", { content: null, position: n }));
    };
    u.prototype.preloadAutoWidthImages = function (t) {
        t.each(
            n.proxy(function (t, i) {
                this.enter("pre-loading");
                i = n(i);
                n(new Image())
                    .one(
                        "load",
                        n.proxy(function (n) {
                            i.attr("src", n.target.src);
                            i.css("opacity", 1);
                            this.leave("pre-loading");
                            !this.is("pre-loading") &&
                                !this.is("initializing") &&
                                this.refresh();
                        }, this)
                    )
                    .attr(
                        "src",
                        i.attr("src") || i.attr("data-src") || i.attr("data-src-retina")
                    );
            }, this)
        );
    };
    u.prototype.destroy = function () {
        this.$element.off(".owl.core");
        this.$stage.off(".owl.core");
        n(i).off(".owl.core");
        this.settings.responsive !== !1 &&
            (t.clearTimeout(this.resizeTimer),
                this.off(t, "resize", this._handlers.onThrottledResize));
        for (var r in this._plugins) this._plugins[r].destroy();
        this.$stage.children(".cloned").remove();
        this.$stage.unwrap();
        this.$stage.children().contents().unwrap();
        this.$stage.children().unwrap();
        this.$element
            .removeClass(this.options.refreshClass)
            .removeClass(this.options.loadingClass)
            .removeClass(this.options.loadedClass)
            .removeClass(this.options.rtlClass)
            .removeClass(this.options.dragClass)
            .removeClass(this.options.grabClass)
            .attr(
                "class",
                this.$element
                    .attr("class")
                    .replace(
                        new RegExp(this.options.responsiveClass + "-\\S+\\s", "g"),
                        ""
                    )
            )
            .removeData("owl.carousel");
    };
    u.prototype.op = function (n, t, i) {
        var r = this.settings.rtl;
        switch (t) {
            case "<":
                return r ? n > i : n < i;
            case ">":
                return r ? n < i : n > i;
            case ">=":
                return r ? n <= i : n >= i;
            case "<=":
                return r ? n >= i : n <= i;
        }
    };
    u.prototype.on = function (n, t, i, r) {
        n.addEventListener
            ? n.addEventListener(t, i, r)
            : n.attachEvent && n.attachEvent("on" + t, i);
    };
    u.prototype.off = function (n, t, i, r) {
        n.removeEventListener
            ? n.removeEventListener(t, i, r)
            : n.detachEvent && n.detachEvent("on" + t, i);
    };
    u.prototype.trigger = function (t, i, r) {
        var o = { item: { count: this._items.length, index: this.current() } },
            e = n.camelCase(
                n
                    .grep(["on", t, r], function (n) {
                        return n;
                    })
                    .join("-")
                    .toLowerCase()
            ),
            f = n.Event(
                [t, "owl", r || "carousel"].join(".").toLowerCase(),
                n.extend({ relatedTarget: this }, o, i)
            );
        return (
            this._supress[t] ||
            (n.each(this._plugins, function (n, t) {
                t.onTrigger && t.onTrigger(f);
            }),
                this.register({ type: u.Type.Event, name: t }),
                this.$element.trigger(f),
                this.settings &&
                "function" == typeof this.settings[e] &&
                this.settings[e].call(this, f)),
            f
        );
    };
    u.prototype.enter = function (t) {
        n.each(
            [t].concat(this._states.tags[t] || []),
            n.proxy(function (n, t) {
                this._states.current[t] === r && (this._states.current[t] = 0);
                this._states.current[t]++;
            }, this)
        );
    };
    u.prototype.leave = function (t) {
        n.each(
            [t].concat(this._states.tags[t] || []),
            n.proxy(function (n, t) {
                this._states.current[t]--;
            }, this)
        );
    };
    u.prototype.register = function (t) {
        if (t.type === u.Type.Event) {
            if (
                (n.event.special[t.name] || (n.event.special[t.name] = {}),
                    !n.event.special[t.name].owl)
            ) {
                var i = n.event.special[t.name]._default;
                n.event.special[t.name]._default = function (n) {
                    return !i ||
                        !i.apply ||
                        (n.namespace && n.namespace.indexOf("owl") !== -1)
                        ? n.namespace && n.namespace.indexOf("owl") > -1
                        : i.apply(this, arguments);
                };
                n.event.special[t.name].owl = !0;
            }
        } else
            t.type === u.Type.State &&
                ((this._states.tags[t.name] = this._states.tags[t.name]
                    ? this._states.tags[t.name].concat(t.tags)
                    : t.tags),
                    (this._states.tags[t.name] = n.grep(
                        this._states.tags[t.name],
                        n.proxy(function (i, r) {
                            return n.inArray(i, this._states.tags[t.name]) === r;
                        }, this)
                    )));
    };
    u.prototype.suppress = function (t) {
        n.each(
            t,
            n.proxy(function (n, t) {
                this._supress[t] = !0;
            }, this)
        );
    };
    u.prototype.release = function (t) {
        n.each(
            t,
            n.proxy(function (n, t) {
                delete this._supress[t];
            }, this)
        );
    };
    u.prototype.pointer = function (n) {
        var i = { x: null, y: null };
        return (
            (n = n.originalEvent || n || t.event),
            (n =
                n.touches && n.touches.length
                    ? n.touches[0]
                    : n.changedTouches && n.changedTouches.length
                        ? n.changedTouches[0]
                        : n),
            n.pageX
                ? ((i.x = n.pageX), (i.y = n.pageY))
                : ((i.x = n.clientX), (i.y = n.clientY)),
            i
        );
    };
    u.prototype.isNumeric = function (n) {
        return !isNaN(parseFloat(n));
    };
    u.prototype.difference = function (n, t) {
        return { x: n.x - t.x, y: n.y - t.y };
    };
    n.fn.owlCarousel = function (t) {
        var i = Array.prototype.slice.call(arguments, 1);
        return this.each(function () {
            var f = n(this),
                r = f.data("owl.carousel");
            r ||
                ((r = new u(this, "object" == typeof t && t)),
                    f.data("owl.carousel", r),
                    n.each(
                        [
                            "next",
                            "prev",
                            "to",
                            "destroy",
                            "refresh",
                            "replace",
                            "add",
                            "remove",
                        ],
                        function (t, i) {
                            r.register({ type: u.Type.Event, name: i });
                            r.$element.on(
                                i + ".owl.carousel.core",
                                n.proxy(function (n) {
                                    n.namespace &&
                                        n.relatedTarget !== this &&
                                        (this.suppress([i]),
                                            r[i].apply(this, [].slice.call(arguments, 1)),
                                            this.release([i]));
                                }, r)
                            );
                        }
                    ));
            "string" == typeof t && "_" !== t.charAt(0) && r[t].apply(r, i);
        });
    };
    n.fn.owlCarousel.Constructor = u;
})(window.Zepto || window.jQuery, window, document),
    (function (n, t) {
        var i = function (t) {
            this._core = t;
            this._interval = null;
            this._visible = null;
            this._handlers = {
                "initialized.owl.carousel": n.proxy(function (n) {
                    n.namespace && this._core.settings.autoRefresh && this.watch();
                }, this),
            };
            this._core.options = n.extend({}, i.Defaults, this._core.options);
            this._core.$element.on(this._handlers);
        };
        i.Defaults = { autoRefresh: !0, autoRefreshInterval: 500 };
        i.prototype.watch = function () {
            this._interval ||
                ((this._visible = this._core.$element.is(":visible")),
                    (this._interval = t.setInterval(
                        n.proxy(this.refresh, this),
                        this._core.settings.autoRefreshInterval
                    )));
        };
        i.prototype.refresh = function () {
            this._core.$element.is(":visible") !== this._visible &&
                ((this._visible = !this._visible),
                    this._core.$element.toggleClass("owl-hidden", !this._visible),
                    this._visible &&
                    this._core.invalidate("width") &&
                    this._core.refresh());
        };
        i.prototype.destroy = function () {
            var n, i;
            t.clearInterval(this._interval);
            for (n in this._handlers) this._core.$element.off(n, this._handlers[n]);
            for (i in Object.getOwnPropertyNames(this))
                "function" != typeof this[i] && (this[i] = null);
        };
        n.fn.owlCarousel.Constructor.Plugins.AutoRefresh = i;
    })(window.Zepto || window.jQuery, window, document),
    (function (n, t, i, r) {
        var u = function (t) {
            this._core = t;
            this._loaded = [];
            this._handlers = {
                "initialized.owl.carousel change.owl.carousel resized.owl.carousel":
                    n.proxy(function (t) {
                        if (
                            t.namespace &&
                            this._core.settings &&
                            this._core.settings.lazyLoad &&
                            ((t.property && "position" == t.property.name) ||
                                "initialized" == t.type)
                        )
                            for (
                                var i = this._core.settings,
                                f = (i.center && Math.ceil(i.items / 2)) || i.items,
                                e = (i.center && f * -1) || 0,
                                u =
                                    (t.property && t.property.value !== r
                                        ? t.property.value
                                        : this._core.current()) + e,
                                o = this._core.clones().length,
                                s = n.proxy(function (n, t) {
                                    this.load(t);
                                }, this);
                                e++ < f;

                            )
                                this.load(o / 2 + this._core.relative(u)),
                                    o && n.each(this._core.clones(this._core.relative(u)), s),
                                    u++;
                    }, this),
            };
            this._core.options = n.extend({}, u.Defaults, this._core.options);
            this._core.$element.on(this._handlers);
        };
        u.Defaults = { lazyLoad: !1 };
        u.prototype.load = function (i) {
            var r = this._core.$stage.children().eq(i),
                u = r && r.find(".owl-lazy");
            !u ||
                n.inArray(r.get(0), this._loaded) > -1 ||
                (u.each(
                    n.proxy(function (i, r) {
                        var e,
                            u = n(r),
                            f =
                                (t.devicePixelRatio > 1 && u.attr("data-src-retina")) ||
                                u.attr("data-src");
                        this._core.trigger("load", { element: u, url: f }, "lazy");
                        u.is("img")
                            ? u
                                .one(
                                    "load.owl.lazy",
                                    n.proxy(function () {
                                        u.css("opacity", 1);
                                        this._core.trigger(
                                            "loaded",
                                            { element: u, url: f },
                                            "lazy"
                                        );
                                    }, this)
                                )
                                .attr("src", f)
                            : ((e = new Image()),
                                (e.onload = n.proxy(function () {
                                    u.css({
                                        "background-image": 'url("' + f + '")',
                                        opacity: "1",
                                    });
                                    this._core.trigger("loaded", { element: u, url: f }, "lazy");
                                }, this)),
                                (e.src = f));
                    }, this)
                ),
                    this._loaded.push(r.get(0)));
        };
        u.prototype.destroy = function () {
            var n, t;
            for (n in this.handlers) this._core.$element.off(n, this.handlers[n]);
            for (t in Object.getOwnPropertyNames(this))
                "function" != typeof this[t] && (this[t] = null);
        };
        n.fn.owlCarousel.Constructor.Plugins.Lazy = u;
    })(window.Zepto || window.jQuery, window, document),
    (function (n) {
        var t = function (i) {
            this._core = i;
            this._handlers = {
                "initialized.owl.carousel refreshed.owl.carousel": n.proxy(function (
                    n
                ) {
                    n.namespace && this._core.settings.autoHeight && this.update();
                },
                    this),
                "changed.owl.carousel": n.proxy(function (n) {
                    n.namespace &&
                        this._core.settings.autoHeight &&
                        "position" == n.property.name &&
                        this.update();
                }, this),
                "loaded.owl.lazy": n.proxy(function (n) {
                    n.namespace &&
                        this._core.settings.autoHeight &&
                        n.element.closest("." + this._core.settings.itemClass).index() ===
                        this._core.current() &&
                        this.update();
                }, this),
            };
            this._core.options = n.extend({}, t.Defaults, this._core.options);
            this._core.$element.on(this._handlers);
        };
        t.Defaults = { autoHeight: !1, autoHeightClass: "owl-height" };
        t.prototype.update = function () {
            var t = this._core._current,
                u = t + this._core.settings.items,
                f = this._core.$stage.children().toArray().slice(t, u),
                i = [],
                r = 0;
            n.each(f, function (t, r) {
                i.push(n(r).height());
            });
            r = Math.max.apply(null, i);
            this._core.$stage
                .parent()
                .height(r)
                .addClass(this._core.settings.autoHeightClass);
        };
        t.prototype.destroy = function () {
            var n, t;
            for (n in this._handlers) this._core.$element.off(n, this._handlers[n]);
            for (t in Object.getOwnPropertyNames(this))
                "function" != typeof this[t] && (this[t] = null);
        };
        n.fn.owlCarousel.Constructor.Plugins.AutoHeight = t;
    })(window.Zepto || window.jQuery, window, document),
    (function (n, t, i) {
        var r = function (t) {
            this._core = t;
            this._videos = {};
            this._playing = null;
            this._handlers = {
                "initialized.owl.carousel": n.proxy(function (n) {
                    n.namespace &&
                        this._core.register({
                            type: "state",
                            name: "playing",
                            tags: ["interacting"],
                        });
                }, this),
                "resize.owl.carousel": n.proxy(function (n) {
                    n.namespace &&
                        this._core.settings.video &&
                        this.isInFullScreen() &&
                        n.preventDefault();
                }, this),
                "refreshed.owl.carousel": n.proxy(function (n) {
                    n.namespace &&
                        this._core.is("resizing") &&
                        this._core.$stage.find(".cloned .owl-video-frame").remove();
                }, this),
                "changed.owl.carousel": n.proxy(function (n) {
                    n.namespace &&
                        "position" === n.property.name &&
                        this._playing &&
                        this.stop();
                }, this),
                "prepared.owl.carousel": n.proxy(function (t) {
                    if (t.namespace) {
                        var i = n(t.content).find(".owl-video");
                        i.length && (i.css("display", "none"), this.fetch(i, n(t.content)));
                    }
                }, this),
            };
            this._core.options = n.extend({}, r.Defaults, this._core.options);
            this._core.$element.on(this._handlers);
            this._core.$element.on(
                "click.owl.video",
                ".owl-video-play-icon",
                n.proxy(function (n) {
                    this.play(n);
                }, this)
            );
        };
        r.Defaults = { video: !1, videoHeight: !1, videoWidth: !1 };
        r.prototype.fetch = function (n, t) {
            var u = (function () {
                return n.attr("data-vimeo-id")
                    ? "vimeo"
                    : n.attr("data-vzaar-id")
                        ? "vzaar"
                        : "youtube";
            })(),
                i =
                    n.attr("data-vimeo-id") ||
                    n.attr("data-youtube-id") ||
                    n.attr("data-vzaar-id"),
                f = n.attr("data-width") || this._core.settings.videoWidth,
                e = n.attr("data-height") || this._core.settings.videoHeight,
                r = n.attr("href");
            if (!r) throw new Error("Missing video URL.");
            if (
                ((i = r.match(
                    /(http:|https:|)\/\/(player.|www.|app.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com)|vzaar\.com)\/(video\/|videos\/|embed\/|channels\/.+\/|groups\/.+\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/
                )),
                    i[3].indexOf("youtu") > -1)
            )
                u = "youtube";
            else if (i[3].indexOf("vimeo") > -1) u = "vimeo";
            else {
                if (!(i[3].indexOf("vzaar") > -1))
                    throw new Error("Video URL not supported.");
                u = "vzaar";
            }
            i = i[6];
            this._videos[r] = { type: u, id: i, width: f, height: e };
            t.attr("data-video", r);
            this.thumbnail(n, this._videos[r]);
        };
        r.prototype.thumbnail = function (t, i) {
            var o,
                s,
                r,
                c =
                    i.width && i.height
                        ? 'style="width:' + i.width + "px;height:" + i.height + 'px;"'
                        : "",
                f = t.find("img"),
                e = "src",
                h = "",
                l = this._core.settings,
                u = function (n) {
                    s = '<div class="owl-video-play-icon"></div>';
                    o = l.lazyLoad
                        ? '<div class="owl-video-tn ' + h + '" ' + e + '="' + n + '"></div>'
                        : '<div class="owl-video-tn" style="opacity:1;background-image:url(' +
                        n +
                        ')"></div>';
                    t.after(o);
                    t.after(s);
                };
            if (
                (t.wrap('<div class="owl-video-wrapper"' + c + "></div>"),
                    this._core.settings.lazyLoad && ((e = "data-src"), (h = "owl-lazy")),
                    f.length)
            )
                return u(f.attr(e)), f.remove(), !1;
            "youtube" === i.type
                ? ((r = "//img.youtube.com/vi/" + i.id + "/hqdefault.jpg"), u(r))
                : "vimeo" === i.type
                    ? n.ajax({
                        type: "GET",
                        url: "//vimeo.com/api/v2/video/" + i.id + ".json",
                        jsonp: "callback",
                        dataType: "jsonp",
                        success: function (n) {
                            r = n[0].thumbnail_large;
                            u(r);
                        },
                    })
                    : "vzaar" === i.type &&
                    n.ajax({
                        type: "GET",
                        url: "//vzaar.com/api/videos/" + i.id + ".json",
                        jsonp: "callback",
                        dataType: "jsonp",
                        success: function (n) {
                            r = n.framegrab_url;
                            u(r);
                        },
                    });
        };
        r.prototype.stop = function () {
            this._core.trigger("stop", null, "video");
            this._playing.find(".owl-video-frame").remove();
            this._playing.removeClass("owl-video-playing");
            this._playing = null;
            this._core.leave("playing");
            this._core.trigger("stopped", null, "video");
        };
        r.prototype.play = function (t) {
            var u,
                o = n(t.target),
                r = o.closest("." + this._core.settings.itemClass),
                i = this._videos[r.attr("data-video")],
                f = i.width || "100%",
                e = i.height || this._core.$stage.height();
            this._playing ||
                (this._core.enter("playing"),
                    this._core.trigger("play", null, "video"),
                    (r = this._core.items(this._core.relative(r.index()))),
                    this._core.reset(r.index()),
                    "youtube" === i.type
                        ? (u =
                            '<iframe width="' +
                            f +
                            '" height="' +
                            e +
                            '" src="//www.youtube.com/embed/' +
                            i.id +
                            "?autoplay=1&rel=0&v=" +
                            i.id +
                            '" frameborder="0" allowfullscreen></iframe>')
                        : "vimeo" === i.type
                            ? (u =
                                '<iframe src="//player.vimeo.com/video/' +
                                i.id +
                                '?autoplay=1" width="' +
                                f +
                                '" height="' +
                                e +
                                '" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>')
                            : "vzaar" === i.type &&
                            (u =
                                '<iframe frameborder="0"height="' +
                                e +
                                '"width="' +
                                f +
                                '" allowfullscreen mozallowfullscreen webkitAllowFullScreen src="//view.vzaar.com/' +
                                i.id +
                                '/player?autoplay=true"></iframe>'),
                    n('<div class="owl-video-frame">' + u + "</div>").insertAfter(
                        r.find(".owl-video")
                    ),
                    (this._playing = r.addClass("owl-video-playing")));
        };
        r.prototype.isInFullScreen = function () {
            var t =
                i.fullscreenElement ||
                i.mozFullScreenElement ||
                i.webkitFullscreenElement;
            return t && n(t).parent().hasClass("owl-video-frame");
        };
        r.prototype.destroy = function () {
            var n, t;
            this._core.$element.off("click.owl.video");
            for (n in this._handlers) this._core.$element.off(n, this._handlers[n]);
            for (t in Object.getOwnPropertyNames(this))
                "function" != typeof this[t] && (this[t] = null);
        };
        n.fn.owlCarousel.Constructor.Plugins.Video = r;
    })(window.Zepto || window.jQuery, window, document),
    (function (n, t, i, r) {
        var u = function (t) {
            this.core = t;
            this.core.options = n.extend({}, u.Defaults, this.core.options);
            this.swapping = !0;
            this.previous = r;
            this.next = r;
            this.handlers = {
                "change.owl.carousel": n.proxy(function (n) {
                    n.namespace &&
                        "position" == n.property.name &&
                        ((this.previous = this.core.current()),
                            (this.next = n.property.value));
                }, this),
                "drag.owl.carousel dragged.owl.carousel translated.owl.carousel":
                    n.proxy(function (n) {
                        n.namespace && (this.swapping = "translated" == n.type);
                    }, this),
                "translate.owl.carousel": n.proxy(function (n) {
                    n.namespace &&
                        this.swapping &&
                        (this.core.options.animateOut || this.core.options.animateIn) &&
                        this.swap();
                }, this),
            };
            this.core.$element.on(this.handlers);
        };
        u.Defaults = { animateOut: !1, animateIn: !1 };
        u.prototype.swap = function () {
            if (
                1 === this.core.settings.items &&
                n.support.animation &&
                n.support.transition
            ) {
                this.core.speed(0);
                var t,
                    i = n.proxy(this.clear, this),
                    f = this.core.$stage.children().eq(this.previous),
                    e = this.core.$stage.children().eq(this.next),
                    r = this.core.settings.animateIn,
                    u = this.core.settings.animateOut;
                this.core.current() !== this.previous &&
                    (u &&
                        ((t =
                            this.core.coordinates(this.previous) -
                            this.core.coordinates(this.next)),
                            f
                                .one(n.support.animation.end, i)
                                .css({ left: t + "px" })
                                .addClass("animated owl-animated-out")
                                .addClass(u)),
                        r &&
                        e
                            .one(n.support.animation.end, i)
                            .addClass("animated owl-animated-in")
                            .addClass(r));
            }
        };
        u.prototype.clear = function (t) {
            n(t.target)
                .css({ left: "" })
                .removeClass("animated owl-animated-out owl-animated-in")
                .removeClass(this.core.settings.animateIn)
                .removeClass(this.core.settings.animateOut);
            this.core.onTransitionEnd();
        };
        u.prototype.destroy = function () {
            var n, t;
            for (n in this.handlers) this.core.$element.off(n, this.handlers[n]);
            for (t in Object.getOwnPropertyNames(this))
                "function" != typeof this[t] && (this[t] = null);
        };
        n.fn.owlCarousel.Constructor.Plugins.Animate = u;
    })(window.Zepto || window.jQuery, window, document),
    (function (n, t, i) {
        var r = function (t) {
            this._core = t;
            this._timeout = null;
            this._paused = !1;
            this._handlers = {
                "changed.owl.carousel": n.proxy(function (n) {
                    n.namespace && "settings" === n.property.name
                        ? this._core.settings.autoplay
                            ? this.play()
                            : this.stop()
                        : n.namespace &&
                        "position" === n.property.name &&
                        this._core.settings.autoplay &&
                        this._setAutoPlayInterval();
                }, this),
                "initialized.owl.carousel": n.proxy(function (n) {
                    n.namespace && this._core.settings.autoplay && this.play();
                }, this),
                "play.owl.autoplay": n.proxy(function (n, t, i) {
                    n.namespace && this.play(t, i);
                }, this),
                "stop.owl.autoplay": n.proxy(function (n) {
                    n.namespace && this.stop();
                }, this),
                "mouseover.owl.autoplay": n.proxy(function () {
                    this._core.settings.autoplayHoverPause &&
                        this._core.is("rotating") &&
                        this.pause();
                }, this),
                "mouseleave.owl.autoplay": n.proxy(function () {
                    this._core.settings.autoplayHoverPause &&
                        this._core.is("rotating") &&
                        this.play();
                }, this),
                "touchstart.owl.core": n.proxy(function () {
                    this._core.settings.autoplayHoverPause &&
                        this._core.is("rotating") &&
                        this.pause();
                }, this),
                "touchend.owl.core": n.proxy(function () {
                    this._core.settings.autoplayHoverPause && this.play();
                }, this),
            };
            this._core.$element.on(this._handlers);
            this._core.options = n.extend({}, r.Defaults, this._core.options);
        };
        r.Defaults = {
            autoplay: !1,
            autoplayTimeout: 5e3,
            autoplayHoverPause: !1,
            autoplaySpeed: !1,
        };
        r.prototype.play = function () {
            this._paused = !1;
            this._core.is("rotating") ||
                (this._core.enter("rotating"), this._setAutoPlayInterval());
        };
        r.prototype._getNextTimeout = function (r, u) {
            return (
                this._timeout && t.clearTimeout(this._timeout),
                t.setTimeout(
                    n.proxy(function () {
                        this._paused ||
                            this._core.is("busy") ||
                            this._core.is("interacting") ||
                            i.hidden ||
                            this._core.next(u || this._core.settings.autoplaySpeed);
                    }, this),
                    r || this._core.settings.autoplayTimeout
                )
            );
        };
        r.prototype._setAutoPlayInterval = function () {
            this._timeout = this._getNextTimeout();
        };
        r.prototype.stop = function () {
            this._core.is("rotating") &&
                (t.clearTimeout(this._timeout), this._core.leave("rotating"));
        };
        r.prototype.pause = function () {
            this._core.is("rotating") && (this._paused = !0);
        };
        r.prototype.destroy = function () {
            var n, t;
            this.stop();
            for (n in this._handlers) this._core.$element.off(n, this._handlers[n]);
            for (t in Object.getOwnPropertyNames(this))
                "function" != typeof this[t] && (this[t] = null);
        };
        n.fn.owlCarousel.Constructor.Plugins.autoplay = r;
    })(window.Zepto || window.jQuery, window, document),
    (function (n) {
        "use strict";
        var t = function (i) {
            this._core = i;
            this._initialized = !1;
            this._pages = [];
            this._controls = {};
            this._templates = [];
            this.$element = this._core.$element;
            this._overrides = {
                next: this._core.next,
                prev: this._core.prev,
                to: this._core.to,
            };
            this._handlers = {
                "prepared.owl.carousel": n.proxy(function (t) {
                    t.namespace &&
                        this._core.settings.dotsData &&
                        this._templates.push(
                            '<div class="' +
                            this._core.settings.dotClass +
                            '">' +
                            n(t.content)
                                .find("[data-dot]")
                                .addBack("[data-dot]")
                                .attr("data-dot") +
                            "</div>"
                        );
                }, this),
                "added.owl.carousel": n.proxy(function (n) {
                    n.namespace &&
                        this._core.settings.dotsData &&
                        this._templates.splice(n.position, 0, this._templates.pop());
                }, this),
                "remove.owl.carousel": n.proxy(function (n) {
                    n.namespace &&
                        this._core.settings.dotsData &&
                        this._templates.splice(n.position, 1);
                }, this),
                "changed.owl.carousel": n.proxy(function (n) {
                    n.namespace && "position" == n.property.name && this.draw();
                }, this),
                "initialized.owl.carousel": n.proxy(function (n) {
                    n.namespace &&
                        !this._initialized &&
                        (this._core.trigger("initialize", null, "navigation"),
                            this.initialize(),
                            this.update(),
                            this.draw(),
                            (this._initialized = !0),
                            this._core.trigger("initialized", null, "navigation"));
                }, this),
                "refreshed.owl.carousel": n.proxy(function (n) {
                    n.namespace &&
                        this._initialized &&
                        (this._core.trigger("refresh", null, "navigation"),
                            this.update(),
                            this.draw(),
                            this._core.trigger("refreshed", null, "navigation"));
                }, this),
            };
            this._core.options = n.extend({}, t.Defaults, this._core.options);
            this.$element.on(this._handlers);
        };
        t.Defaults = {
            nav: !1,
            navText: ["prev", "next"],
            navSpeed: !1,
            navElement: "div",
            navContainer: !1,
            navContainerClass: "owl-nav",
            navClass: ["owl-prev", "owl-next"],
            slideBy: 1,
            dotClass: "owl-dot",
            dotsClass: "owl-dots",
            dots: !0,
            dotsEach: !1,
            dotsData: !1,
            dotsSpeed: !1,
            dotsContainer: !1,
        };
        t.prototype.initialize = function () {
            var i,
                t = this._core.settings;
            this._controls.$relative = (
                t.navContainer
                    ? n(t.navContainer)
                    : n("<div>").addClass(t.navContainerClass).appendTo(this.$element)
            ).addClass("disabled");
            this._controls.$previous = n("<" + t.navElement + ">")
                .addClass(t.navClass[0])
                .html(t.navText[0])
                .prependTo(this._controls.$relative)
                .on(
                    "click",
                    n.proxy(function () {
                        this.prev(t.navSpeed);
                    }, this)
                );
            this._controls.$next = n("<" + t.navElement + ">")
                .addClass(t.navClass[1])
                .html(t.navText[1])
                .appendTo(this._controls.$relative)
                .on(
                    "click",
                    n.proxy(function () {
                        this.next(t.navSpeed);
                    }, this)
                );
            t.dotsData ||
                (this._templates = [
                    n("<div>").addClass(t.dotClass).append(n("<span>")).prop("outerHTML"),
                ]);
            this._controls.$absolute = (
                t.dotsContainer
                    ? n(t.dotsContainer)
                    : n("<div>").addClass(t.dotsClass).appendTo(this.$element)
            ).addClass("disabled");
            this._controls.$absolute.on(
                "click",
                "div",
                n.proxy(function (i) {
                    var r = n(i.target).parent().is(this._controls.$absolute)
                        ? n(i.target).index()
                        : n(i.target).parent().index();
                    i.preventDefault();
                    this.to(r, t.dotsSpeed);
                }, this)
            );
            for (i in this._overrides) this._core[i] = n.proxy(this[i], this);
        };
        t.prototype.destroy = function () {
            var n, r, t, i;
            for (n in this._handlers) this.$element.off(n, this._handlers[n]);
            for (r in this._controls) this._controls[r].remove();
            for (i in this.overides) this._core[i] = this._overrides[i];
            for (t in Object.getOwnPropertyNames(this))
                "function" != typeof this[t] && (this[t] = null);
        };
        t.prototype.update = function () {
            var t,
                i,
                f,
                r = this._core.clones().length / 2,
                o = r + this._core.items().length,
                u = this._core.maximum(!0),
                n = this._core.settings,
                e = n.center || n.autoWidth || n.dotsData ? 1 : n.dotsEach || n.items;
            if (
                ("page" !== n.slideBy && (n.slideBy = Math.min(n.slideBy, n.items)),
                    n.dots || "page" == n.slideBy)
            )
                for (this._pages = [], t = r, i = 0, f = 0; t < o; t++) {
                    if (i >= e || 0 === i) {
                        if (
                            (this._pages.push({
                                start: Math.min(u, t - r),
                                end: t - r + e - 1,
                            }),
                                Math.min(u, t - r) === u)
                        )
                            break;
                        i = 0;
                        ++f;
                    }
                    i += this._core.mergers(this._core.relative(t));
                }
        };
        t.prototype.draw = function () {
            var i,
                t = this._core.settings,
                r = this._core.items().length <= t.items,
                u = this._core.relative(this._core.current()),
                f = t.loop || t.rewind;
            this._controls.$relative.toggleClass("disabled", !t.nav || r);
            t.nav &&
                (this._controls.$previous.toggleClass(
                    "disabled",
                    !f && u <= this._core.minimum(!0)
                ),
                    this._controls.$next.toggleClass(
                        "disabled",
                        !f && u >= this._core.maximum(!0)
                    ));
            this._controls.$absolute.toggleClass("disabled", !t.dots || r);
            t.dots &&
                ((i = this._pages.length - this._controls.$absolute.children().length),
                    t.dotsData && 0 !== i
                        ? this._controls.$absolute.html(this._templates.join(""))
                        : i > 0
                            ? this._controls.$absolute.append(
                                new Array(i + 1).join(this._templates[0])
                            )
                            : i < 0 && this._controls.$absolute.children().slice(i).remove(),
                    this._controls.$absolute.find(".active").removeClass("active"),
                    this._controls.$absolute
                        .children()
                        .eq(n.inArray(this.current(), this._pages))
                        .addClass("active"));
        };
        t.prototype.onTrigger = function (t) {
            var i = this._core.settings;
            t.page = {
                index: n.inArray(this.current(), this._pages),
                count: this._pages.length,
                size:
                    i &&
                    (i.center || i.autoWidth || i.dotsData ? 1 : i.dotsEach || i.items),
            };
        };
        t.prototype.current = function () {
            var t = this._core.relative(this._core.current());
            return n
                .grep(
                    this._pages,
                    n.proxy(function (n) {
                        return n.start <= t && n.end >= t;
                    }, this)
                )
                .pop();
        };
        t.prototype.getPosition = function (t) {
            var i,
                r,
                u = this._core.settings;
            return (
                "page" == u.slideBy
                    ? ((i = n.inArray(this.current(), this._pages)),
                        (r = this._pages.length),
                        t ? ++i : --i,
                        (i = this._pages[((i % r) + r) % r].start))
                    : ((i = this._core.relative(this._core.current())),
                        (r = this._core.items().length),
                        t ? (i += u.slideBy) : (i -= u.slideBy)),
                i
            );
        };
        t.prototype.next = function (t) {
            n.proxy(this._overrides.to, this._core)(this.getPosition(!0), t);
        };
        t.prototype.prev = function (t) {
            n.proxy(this._overrides.to, this._core)(this.getPosition(!1), t);
        };
        t.prototype.to = function (t, i, r) {
            var u;
            !r && this._pages.length
                ? ((u = this._pages.length),
                    n.proxy(this._overrides.to, this._core)(
                        this._pages[((t % u) + u) % u].start,
                        i
                    ))
                : n.proxy(this._overrides.to, this._core)(t, i);
        };
        n.fn.owlCarousel.Constructor.Plugins.Navigation = t;
    })(window.Zepto || window.jQuery, window, document),
    (function (n, t, i, r) {
        "use strict";
        var u = function (i) {
            this._core = i;
            this._hashes = {};
            this.$element = this._core.$element;
            this._handlers = {
                "initialized.owl.carousel": n.proxy(function (i) {
                    i.namespace &&
                        "URLHash" === this._core.settings.startPosition &&
                        n(t).trigger("hashchange.owl.navigation");
                }, this),
                "prepared.owl.carousel": n.proxy(function (t) {
                    if (t.namespace) {
                        var i = n(t.content)
                            .find("[data-hash]")
                            .addBack("[data-hash]")
                            .attr("data-hash");
                        if (!i) return;
                        this._hashes[i] = t.content;
                    }
                }, this),
                "changed.owl.carousel": n.proxy(function (i) {
                    if (i.namespace && "position" === i.property.name) {
                        var u = this._core.items(this._core.relative(this._core.current())),
                            r = n
                                .map(this._hashes, function (n, t) {
                                    return n === u ? t : null;
                                })
                                .join();
                        if (!r || t.location.hash.slice(1) === r) return;
                        t.location.hash = r;
                    }
                }, this),
            };
            this._core.options = n.extend({}, u.Defaults, this._core.options);
            this.$element.on(this._handlers);
            n(t).on(
                "hashchange.owl.navigation",
                n.proxy(function () {
                    var i = t.location.hash.substring(1),
                        u = this._core.$stage.children(),
                        n = this._hashes[i] && u.index(this._hashes[i]);
                    n !== r &&
                        n !== this._core.current() &&
                        this._core.to(this._core.relative(n), !1, !0);
                }, this)
            );
        };
        u.Defaults = { URLhashListener: !1 };
        u.prototype.destroy = function () {
            var i, r;
            n(t).off("hashchange.owl.navigation");
            for (i in this._handlers) this._core.$element.off(i, this._handlers[i]);
            for (r in Object.getOwnPropertyNames(this))
                "function" != typeof this[r] && (this[r] = null);
        };
        n.fn.owlCarousel.Constructor.Plugins.Hash = u;
    })(window.Zepto || window.jQuery, window, document),
    (function (n, t, i, r) {
        function u(t, i) {
            var u = !1,
                f = t.charAt(0).toUpperCase() + t.slice(1);
            return (
                n.each((t + " " + h.join(f + " ") + f).split(" "), function (n, t) {
                    if (s[t] !== r) return (u = !i || t), !1;
                }),
                u
            );
        }
        function e(n) {
            return u(n, !0);
        }
        var s = n("<support>").get(0).style,
            h = "Webkit Moz O ms".split(" "),
            o = {
                transition: {
                    end: {
                        WebkitTransition: "webkitTransitionEnd",
                        MozTransition: "transitionend",
                        OTransition: "oTransitionEnd",
                        transition: "transitionend",
                    },
                },
                animation: {
                    end: {
                        WebkitAnimation: "webkitAnimationEnd",
                        MozAnimation: "animationend",
                        OAnimation: "oAnimationEnd",
                        animation: "animationend",
                    },
                },
            },
            f = {
                csstransforms: function () {
                    return !!u("transform");
                },
                csstransforms3d: function () {
                    return !!u("perspective");
                },
                csstransitions: function () {
                    return !!u("transition");
                },
                cssanimations: function () {
                    return !!u("animation");
                },
            };
        f.csstransitions() &&
            ((n.support.transition = new String(e("transition"))),
                (n.support.transition.end = o.transition.end[n.support.transition]));
        f.cssanimations() &&
            ((n.support.animation = new String(e("animation"))),
                (n.support.animation.end = o.animation.end[n.support.animation]));
        f.csstransforms() &&
            ((n.support.transform = new String(e("transform"))),
                (n.support.transform3d = f.csstransforms3d()));
    })(window.Zepto || window.jQuery, window, document);
$(document).ready(function () {
    var t = $("body").hasClass("rtl-page") ? !0 : !1,
        i = $(".carousel .owl-carousel"),
        n;
    $(i).owlCarousel({
        items: 1,
        loop: !0,
        autoplay: !0,
        nav: !1,
        dots: !0,
        autoplayTimeout: 7e4,
        autoplayHoverPause: !1,
        mouseDrag: !1,
        rtl: t,
        animateOut: "fadeOut",
        animateIn: "fadeIn",
    });
    objectFitImages(".carousel img", { watchMQ: !0 });
    n = $("body").hasClass("rtl-page") ? "right" : "left";
    $(".quote__container").initQuotes({
        liMarqueOpts: {
            circular: !0,
            loop: -1,
            direction: n,
            scrollamount: 50,
            hoverstop: !1,
            startShow: !0,
        },
    });
});
$.fn.initQuotes = function (n) {
    return $(this).each(function () {
        function o(n, i) {
            i == 200 && s(t.responseText);
        }
        function e() {
            t = window.XMLHttpRequest
                ? new XMLHttpRequest()
                : new ActiveXObject("Microsoft.XMLHTTP");
            t.onreadystatechange = function () {
                if (t.readyState == 4) {
                    var n = this.responseURL;
                    ~n.indexOf("error") && t.abort();
                    o(this, this.status);
                }
            };
            t.open("GET", "/Widgets/GetQuotes/", !0);
            t.timeout = u - 1e3;
            t.send();
        }
        function s(t) {
            var e = $("<div></div>"),
                u = "";
            t = t.replace(/\s+(<)/gi, "<");
            e.html(t);
            u = e.find(".quotes").html();
            f
                ? (i.find(".str_origin, .str_move_clone").find(">.quote").remove(),
                    i.find(".str_origin, .str_move_clone").prepend(u),
                    r())
                : (i.html(u).liMarquee(n.liMarqueOpts), r(), (f = !0));
        }
        function r() {
            i.find(".str_move_clone").each(function () {
                $(this).width(i.find(".str_origin").outerWidth());
            });
        }
        var i = $(this),
            u = 4e3,
            f = !1,
            t;
        setInterval(e, u);
        e();
        $(window).on("load", function () {
            r();
        });
    });
};
