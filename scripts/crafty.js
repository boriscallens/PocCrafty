/*!
* Crafty v0.4.9
* http://craftyjs.com
*
* Copyright 2010, Louis Stowasser
* Dual licensed under the MIT or GPL licenses.
*/
(function (k, h) {
    var r = function (x) {
        return new r.fn.init(x)
    }, w = 1, e = 50, o = 1, n = {}, c = {}, p = {}, s = [], t, i, a, g = 0, f = 1000 / e, b = (new Date).getTime(), q = Array.prototype.slice, d = /\s*,\s*/, u = /\s+/;
    r.fn = r.prototype = {
        init: function (B) {
            if (typeof B === "string") {
                var z = 0, F, G, E = false, D = false, H, x, y, C, A;
                if (B === "*") {
                    for (F in c) {
                        this[+F] = c[F];
                        z++
                    }
                    this.length = z;
                    return this
                }
                if (B.indexOf(",") !== -1) {
                    D = true;
                    H = d
                } else {
                    if (B.indexOf(" ") !== -1) {
                        E = true;
                        H = u
                    }
                }
                for (F in c) {
                    if (!c.hasOwnProperty(F)) {
                        continue
                    }
                    G = c[F];
                    if (E || D) {
                        x = B.split(H);
                        C = 0;
                        A = x.length;
                        y = 0;
                        for (; C < A; C++) {
                            if (G.__c[x[C]]) {
                                y++
                            }
                        }
                        if (E && y === A || D && y > 0) {
                            this[z++] = +F
                        }
                    } else {
                        if (G.__c[B]) {
                            this[z++] = +F
                        }
                    }
                }
                if (z > 0 && !E && !D) {
                    this.extend(n[B])
                }
                if (x && E) {
                    for (C = 0; C < A; C++) {
                        this.extend(n[x[C]])
                    }
                }
                this.length = z
            } else {
                if (!B) {
                    B = 0;
                    if (!(B in c)) {
                        c[B] = this
                    }
                }
                if (!(B in c)) {
                    this.length = 0;
                    return this
                }
                this[0] = B;
                this.length = 1;
                if (!this.__c) {
                    this.__c = {}
                }
                if (!c[B]) {
                    c[B] = this
                }
                return c[B]
            }
            return this
        },
        setName: function (x) {
            var y = String(x);
            this._entityName = y;
            this.trigger("NewEntityName", y);
            return this
        },
        addComponent: function (D) {
            var A = [], C = 0, z, y = 0, x, B;
            if (arguments.length > 1) {
                x = arguments.length;
                for (; y < x; y++) {
                    this.__c[arguments[y]] = true;
                    A.push(arguments[y])
                }
            } else {
                if (D.indexOf(",") !== -1) {
                    B = D.split(d);
                    x = B.length;
                    for (; y < x; y++) {
                        this.__c[B[y]] = true;
                        A.push(B[y])
                    }
                } else {
                    this.__c[D] = true;
                    A.push(D)
                }
            }
            z = A.length;
            for (; C < z; C++) {
                comp = n[A[C]];
                this.extend(comp);
                if (comp && "init" in comp) {
                    comp.init.call(this)
                }
            }
            this.trigger("NewComponent", z);
            return this
        },
        toggleComponent: function (x) {
            var z = 0, y, A;
            if (arguments.length > 1) {
                y = arguments.length;
                for (; z < y; z++) {
                    if (this.has(arguments[z])) {
                        this.removeComponent(arguments[z])
                    } else {
                        this.addComponent(arguments[z])
                    }
                }
            } else {
                if (x.indexOf(",") !== -1) {
                    A = x.split(d);
                    y = A.length;
                    for (; z < y; z++) {
                        if (this.has(A[z])) {
                            this.removeComponent(A[z])
                        } else {
                            this.addComponent(A[z])
                        }
                    }
                } else {
                    if (this.has(x)) {
                        this.removeComponent(x)
                    } else {
                        this.addComponent(x)
                    }
                }
            }
            return this
        },
        requires: function (A) {
            var B = A.split(d), z = 0, x = B.length, y;
            for (; z < x; ++z) {
                y = B[z];
                if (!this.has(y)) {
                    this.addComponent(y)
                }
            }
            return this
        },
        removeComponent: function (A, x) {
            if (x === false) {
                var y = n[A], z;
                for (z in y) {
                    delete this[z]
                }
            }
            delete this.__c[A];
            this.trigger("RemoveComponent", A);
            return this
        },
        has: function (x) {
            return !!this.__c[x]
        },
        attr: function (x, y) {
            if (arguments.length === 1) {
                if (typeof x === "string") {
                    return this[x]
                }
                this.extend(x);
                this.trigger("Change", x);
                return this
            }
            this[x] = y;
            var z = {};

            z[x] = y;
            this.trigger("Change", z);
            return this
        },
        toArray: function () {
            return q.call(this, 0)
        },
        timeout: function (y, x) {
            this.each(function () {
                var z = this;
                setTimeout(function () {
                    y.call(z)
                }, x)
            });
            return this
        },
        bind: function (y, z) {
            if (this.length === 1) {
                if (!p[y]) {
                    p[y] = {}
                }
                var x = p[y];
                if (!x[this[0]]) {
                    x[this[0]] = []
                }
                x[this[0]].push(z);
                return this
            }
            this.each(function () {
                if (!p[y]) {
                    p[y] = {}
                }
                var A = p[y];
                if (!A[this[0]]) {
                    A[this[0]] = []
                }
                A[this[0]].push(z)
            });
            return this
        },
        unbind: function (x, y) {
            this.each(function () {
                var B = p[x], A = 0, z, C;
                if (B && B[this[0]]) {
                    z = B[this[0]].length
                } else {
                    return this
                }
                if (!y) {
                    delete B[this[0]];
                    return this
                }
                for (; A < z; A++) {
                    C = B[this[0]];
                    if (C[A] == y) {
                        C.splice(A, 1);
                        A--
                    }
                }
            });
            return this
        },
        trigger: function (A, B) {
            if (this.length === 1) {
                if (p[A] && p[A][this[0]]) {
                    var z = p[A][this[0]], y = 0, x = z.length;
                    for (; y < x; y++) {
                        z[y].call(this, B)
                    }
                }
                return this
            }
            this.each(function () {
                if (p[A] && p[A][this[0]]) {
                    var E = p[A][this[0]], D = 0, C = E.length;
                    for (; D < C; D++) {
                        E[D].call(this, B)
                    }
                }
            });
            return this
        },
        each: function (z) {
            var y = 0, x = this.length;
            for (; y < x; y++) {
                if (!c[this[y]]) {
                    continue
                }
                z.call(c[this[y]], y)
            }
            return this
        },
        clone: function () {
            var A = this.__c, x, z, y = r.e();
            for (x in A) {
                y.addComponent(x)
            }
            for (z in this) {
                if (z != "0" && z != "_global" && z != "_changed" && typeof this[z] != "function" && typeof this[z] != "object") {
                    y[z] = this[z]
                }
            }
            return y
        },
        setter: function (y, x) {
            if (r.support.setter) {
                this.__defineSetter__(y, x)
            } else {
                if (r.support.defineProperty) {
                    Object.defineProperty(this, y, {
                        set: x,
                        configurable: true
                    })
                } else {
                    a.push({
                        prop: y,
                        obj: this,
                        fn: x
                    })
                }
            }
            return this
        },
        destroy: function () {
            this.each(function () {
                this.trigger("Remove");
                for (var x in p) {
                    this.unbind(x)
                }
                delete c[this[0]]
            })
        }
    };

    r.fn.init.prototype = r.fn;
    r.extend = r.fn.extend = function (z) {
        var y = this, x;
        if (!z) {
            return y
        }
        for (x in z) {
            if (y === z[x]) {
                continue
            }
            y[x] = z[x]
        }
        return y
    };

    r.extend({
        init: function (x, y) {
            r.viewport.init(x, y);
            this.trigger("Load");
            this.timer.init();
            return this
        },
        getVersion: function () {
            return "0.4.8"
        },
        stop: function () {
            this.timer.stop();
            r.stage.elem.parentNode.removeChild(r.stage.elem);
            return this
        },
        pause: function (x) {
            if (arguments.length == 1 ? x : !this._paused) {
                this.trigger("Pause");
                this._paused = true;
                r.timer.stop();
                r.keydown = {}
            } else {
                this.trigger("Unpause");
                this._paused = false;
                r.timer.init()
            }
            return this
        },
        isPaused: function () {
            return this._paused
        },
        timer: {
            prev: (+new Date),
            current: (+new Date),
            curTime: Date.now(),
            init: function () {
                var x = k.requestAnimationFrame || k.webkitRequestAnimationFrame || k.mozRequestAnimationFrame || k.oRequestAnimationFrame || k.msRequestAnimationFrame || null;
                if (x) {
                    t = function () {
                        r.timer.step();
                        i = x(t)
                    };

                    t()
                } else {
                    t = setInterval(r.timer.step, 1000 / e)
                }
            },
            stop: function () {
                r.trigger("CraftyStop");
                if (typeof t === "number") {
                    clearInterval(t)
                }
                var x = k.cancelRequestAnimationFrame || k.webkitCancelRequestAnimationFrame || k.mozCancelRequestAnimationFrame || k.oCancelRequestAnimationFrame || k.msCancelRequestAnimationFrame || null;
                if (x) {
                    x(i)
                }
                t = null
            },
            step: function () {
                g = 0;
                this.curTime = Date.now();
                if (this.curTime - b > 60 * f) {
                    b = this.curTime - f
                } while (this.curTime > b) {
                    r.trigger("EnterFrame", {
                        frame: o++
                    });
                    b += f;
                    g++
                }
                if (g) {
                    r.DrawManager.draw()
                }
            },
            getFPS: function () {
                return e
            },
            simulateFrames: function (x) {
                while (x-- > 0) {
                    r.trigger("EnterFrame", {
                        frame: o++
                    })
                }
                r.DrawManager.draw()
            }
        },
        e: function () {
            var y = m(), x;
            c[y] = null;
            c[y] = x = r(y);
            if (arguments.length > 0) {
                x.addComponent.apply(x, arguments)
            }
            x.setName("Entity #" + y);
            x.addComponent("obj");
            r.trigger("NewEntity", {
                id: y
            });
            return x
        },
        c: function (y, x) {
            n[y] = x
        },
        trigger: function (B, C) {
            var A = p[B], z, y, x;
            for (z in A) {
                if (!A.hasOwnProperty(z)) {
                    continue
                }
                for (y = 0, x = A[z].length; y < x; y++) {
                    if (A[z] && A[z][y]) {
                        if (c[z]) {
                            A[z][y].call(r(+z), C)
                        } else {
                            A[z][y].call(r, C)
                        }
                    }
                }
            }
        },
        bind: function (y, z) {
            if (!p[y]) {
                p[y] = {}
            }
            var x = p[y];
            if (!x.global) {
                x.global = []
            }
            return x.global.push(z) - 1
        },
        unbind: function (B, C) {
            var A = p[B], z, y, x;
            for (z in A) {
                if (!A.hasOwnProperty(z)) {
                    continue
                }
                if (typeof C === "number") {
                    delete A[z][C];
                    return true
                }
                for (y = 0, x = A[z].length; y < x; y++) {
                    if (A[z][y] === C) {
                        delete A[z][y];
                        return true
                    }
                }
            }
            return false
        },
        frame: function () {
            return o
        },
        components: function () {
            return n
        },
        isComp: function (x) {
            return x in n
        },
        debug: function () {
            return c
        },
        settings: (function () {
            var x = {}, y = {};

            return {
                register: function (z, A) {
                    y[z] = A
                },
                modify: function (z, A) {
                    if (!y[z]) {
                        return
                    }
                    y[z].call(x[z], A);
                    x[z] = A
                },
                get: function (z) {
                    return x[z]
                }
            }
        })(),
        clone: v
    });
    function m() {
        var x = w++;
        if (x in c) {
            return m()
        }
        return x
    }
    function v(z) {
        if (z === null || typeof (z) != "object") {
            return z
        }
        var x = z.constructor();
        for (var y in z) {
            x[y] = v(z[y])
        }
        return x
    }
    r.bind("Load", function () {
        if (!r.support.setter && r.support.defineProperty) {
            a = [];
            r.bind("EnterFrame", function () {
                var y = 0, x = a.length, z;
                for (; y < x; ++y) {
                    z = a[y];
                    if (z.obj[z.prop] !== z.obj["_" + z.prop]) {
                        z.fn.call(z.obj, z.obj[z.prop])
                    }
                }
            })
        }
    });
    k.Crafty = r;
})(window);
(function (Crafty, window, document) {
    (function (parent) {
        function HashMap(cell) {
			this.cellsize = cell || 64;
            this.maxCol= 1;
            this.minCol= 1;
            this.map = {};
            this.maxX = 0;
            this.maxY = 0;
            this.minX = 0;
            this.minY = 0;
		};
        SPACE = " ";
        HashMap.prototype = {
            key: function (obj) {
                if (obj.hasOwnProperty("mbr")) {
                    obj = obj.mbr();
                }
                return {
                    x1: Math.floor(obj._x / this.cellsize),
                    y1: Math.floor(obj._y / this.cellsize),
                    x2: Math.floor((obj._w + obj._x) / this.cellsize),
                    y2: Math.floor((obj._h + obj._y) / this.cellsize)
                };
            },
            insert: function (obj) {
				var keys = this.key(obj);
				var entry = new Entry(keys, obj, this);
                var col, row, currentCol, currentRow;
                this.minCol = Math.min(this.minCol, keys.x1);
                this.maxCol = Math.max(this.maxCol, keys.x2);
                
                for (col = keys.x1; col <= keys.x2; col++) {
					currentCol = this.map[col];
					if (!currentCol) {
					    currentCol = { minRow: keys.y1, maxRow: keys.y2 };
					    this.map[col] = currentCol;
					} else {
					    currentCol.minRow = Math.min(currentCol.minRow, keys.y1);
					    currentCol.maxRow = Math.max(currentCol.maxRow, keys.y2);    
					}
					
					for (row = keys.y1; row <= keys.y2; row++) {
						currentRow = currentCol[row];
						if (!currentRow) {
						    currentRow = [];
						    this.map[col][row] = currentRow;
						}
					    currentRow.push(entry);
					    this.maxX = Math.max(this.maxX, obj._x+obj._w);
                        this.maxY = Math.max(this.maxY, obj._y+obj._h);
                        this.minX = Math.min(this.minX, obj._x);
                        this.minY = Math.min(this.minY, obj._y);
					}
				}
                return entry;
            },
            search: function (rect, filter) {
                var results = [];
				var keys = this.key(rect);
				var startCol = Math.max(keys.x1, this.minCol);
				var endCol = Math.min(keys.x2, this.maxCol);
				var currentCol, currentRow, startRow, endRow, col, row;

				if (filter === undefined) {
					filter = true;
				}

				for (col = startCol; col <= endCol; col++) {
					currentCol = this.map[col];
					if (!col) continue;

					startRow = Math.max(keys.y1, currentCol.minRow);
					endRow = Math.min(keys.y2, currentCol.maxRow);
					for (row = startRow; row <= endRow; row++) {
						currentRow = currentCol[row];
						if (currentRow) {
							results = results.concat(currentRow);
						}
					}
				}
				if (filter) {
					var i, l, obj, id, finalresult = [], found = {};

					for (i = 0, l = results.length; i < l; i++) {
						obj = results[i];
						if (!obj) {
							continue;
						}
						id = obj[0];
						if (!found[id] && obj.x < rect._x + rect._w && obj._x + obj._w > rect._x && obj.y < rect._y + rect._h && obj._h + obj._y > rect._y) {
							found[id] = results[i];
						}
					}
					for (obj in found) {
						finalresult.push(found[obj]);
					}
					return finalresult;
				} else {
					return results;
				}
            },
            remove: function (keys, obj) {
				var currentCol, currentRow, len, col, row, cell;
				var myMap = this.map
				if (arguments.length == 1) {
					obj = keys;
					keys = HashMap.key(obj);
				}
				for (col = keys.x1; col <= keys.x2; col++) {
					currentCol = this.map[col];
					if (!currentCol) continue;

					for (row = keys.y1; row <= keys.y2; row++) {
						currentRow = currentCol[row];
						if (!currentRow) continue;

						len = currentRow.length;
						for (cell = len-1; cell >= 0; cell--) {
							if (currentRow[cell] && currentRow[cell].obj[0] === obj[0]) {
								currentRow.splice(cell, 1);
							}
						}
					}
					 //recalculate minrow and maxrow
					var keys = Object.keys(currentCol).map(Number).filter(function(a){
						return isFinite(a) && currentCol[a] && currentCol[a].len > 0;
					});
					currentCol.minRow = Math.min.apply(Math, keys);
					currentCol.maxRow = Math.max.apply(Math, keys);
				}
				var keys = Object.keys(myMap).map(Number);
				keys = keys.filter(function(a){
						return isFinite(a) && myMap[a] && isFinite(myMap[a].minRow);
				});
				
				this.minCol = Math.min.apply(Math, keys);
				this.maxCol = Math.max.apply(Math, keys);
            },
            boundaries: function () {
                var minX = 0, maxX = 0, minY = 0, maxY = 0;
                var ent, col, row, currentCol, currentRow;
                //console.log(this);
	            for (col = this.minCol; col <= this.maxCol; col++) {
		            currentCol = this.map[col];
		            if (!currentCol) continue;
		
		            for (row = currentCol.minRow; row <= currentCol.maxRow; row++) {
			            currentRow = currentCol[row];
			            if (!currentRow) continue;
			
			            for (ent in currentRow) {
				            if (typeof ent == "object" && "requires" in ent) {
					            maxX = Math.max(maxX, ent.x + ent.w);
					            maxY = Math.max(maxY, ent.y + ent.h);
				            }
			            }
		            }
                }
                return {
                    max: {x: maxX, y: maxY},
                    min: {x: minX, y: minY}
                };
            }
        };
        HashMap.hash = function (keys) {
            return [keys.x1, keys.y1, keys.x2, keys.y2].join(SPACE);
        };

        function Entry (keys, obj, map) {
            this.keys = keys;
            this.map = map;
            this.obj = obj;
        }
        Entry.prototype = {
            update: function (rect) {
               if (HashMap.hash(HashMap.prototype.key(rect)) != HashMap.hash(this.keys)) {
                    this.map.remove(this.keys, this.obj);
                    var e = this.map.insert(this.obj);
                    this.keys = e.keys;
               }
            }
        };
        parent.HashMap = HashMap;
    })(Crafty);
    
    Crafty.map = new Crafty.HashMap();
    var M = Math, Mc = M.cos, Ms = M.sin, PI = M.PI, DEG_TO_RAD = PI / 180;
    Crafty.c("2D", {
        _x: 0,
        _y: 0,
        _w: 0,
        _h: 0,
        _z: 0,
        _rotation: 0,
        _alpha: 1,
        _visible: true,
        _globalZ: null,
        _origin: null,
        _mbr: null,
        _entry: null,
        _children: null,
        _parent: null,
        _changed: false,
        _defineGetterSetter_setter: function () {
            this.__defineSetter__("x", function (v) {
                this._attr("_x", v)
            });
            this.__defineSetter__("y", function (v) {
                this._attr("_y", v)
            });
            this.__defineSetter__("w", function (v) {
                this._attr("_w", v)
            });
            this.__defineSetter__("h", function (v) {
                this._attr("_h", v)
            });
            this.__defineSetter__("z", function (v) {
                this._attr("_z", v)
            });
            this.__defineSetter__("rotation", function (v) {
                this._attr("_rotation", v)
            });
            this.__defineSetter__("alpha", function (v) {
                this._attr("_alpha", v)
            });
            this.__defineSetter__("visible", function (v) {
                this._attr("_visible", v)
            });
            this.__defineGetter__("x", function () {
                return this._x
            });
            this.__defineGetter__("y", function () {
                return this._y
            });
            this.__defineGetter__("w", function () {
                return this._w
            });
            this.__defineGetter__("h", function () {
                return this._h
            });
            this.__defineGetter__("z", function () {
                return this._z
            });
            this.__defineGetter__("rotation", function () {
                return this._rotation
            });
            this.__defineGetter__("alpha", function () {
                return this._alpha
            });
            this.__defineGetter__("visible", function () {
                return this._visible
            });
            this.__defineGetter__("parent", function () {
                return this._parent
            });
            this.__defineGetter__("numChildren", function () {
                return this._children.length
            })
        },
        _defineGetterSetter_defineProperty: function () {
            Object.defineProperty(this, "x", {
                set: function (v) {
                    this._attr("_x", v)
                },
                get: function () {
                    return this._x
                },
                configurable: true
            });
            Object.defineProperty(this, "y", {
                set: function (v) {
                    this._attr("_y", v)
                },
                get: function () {
                    return this._y
                },
                configurable: true
            });
            Object.defineProperty(this, "w", {
                set: function (v) {
                    this._attr("_w", v)
                },
                get: function () {
                    return this._w
                },
                configurable: true
            });
            Object.defineProperty(this, "h", {
                set: function (v) {
                    this._attr("_h", v)
                },
                get: function () {
                    return this._h
                },
                configurable: true
            });
            Object.defineProperty(this, "z", {
                set: function (v) {
                    this._attr("_z", v)
                },
                get: function () {
                    return this._z
                },
                configurable: true
            });
            Object.defineProperty(this, "rotation", {
                set: function (v) {
                    this._attr("_rotation", v)
                },
                get: function () {
                    return this._rotation
                },
                configurable: true
            });
            Object.defineProperty(this, "alpha", {
                set: function (v) {
                    this._attr("_alpha", v)
                },
                get: function () {
                    return this._alpha
                },
                configurable: true
            });
            Object.defineProperty(this, "visible", {
                set: function (v) {
                    this._attr("_visible", v)
                },
                get: function () {
                    return this._visible
                },
                configurable: true
            })
        },
        _defineGetterSetter_fallback: function () {
            this.x = this._x;
            this.y = this._y;
            this.w = this._w;
            this.h = this._h;
            this.z = this._z;
            this.rotation = this._rotation;
            this.alpha = this._alpha;
            this.visible = this._visible;
            this.bind("EnterFrame", function () {
                if (this.x !== this._x || this.y !== this._y || this.w !== this._w || this.h !== this._h || this.z !== this._z || this.rotation !== this._rotation || this.alpha !== this._alpha || this.visible !== this._visible) {
                    var old = this.mbr() || this.pos();
                    if (this.rotation !== this._rotation) {
                        this._rotate(this.rotation)
                    } else {
                        var mbr = this._mbr, moved = false;
                        if (mbr) {
                            if (this.x !== this._x) {
                                mbr._x -= this.x - this._x;
                                moved = true
                            } else {
                                if (this.y !== this._y) {
                                    mbr._y -= this.y - this._y;
                                    moved = true
                                } else {
                                    if (this.w !== this._w) {
                                        mbr._w -= this.w - this._w;
                                        moved = true
                                    } else {
                                        if (this.h !== this._h) {
                                            mbr._h -= this.h - this._h;
                                            moved = true
                                        } else {
                                            if (this.z !== this._z) {
                                                mbr._z -= this.z - this._z;
                                                moved = true
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        if (moved) {
                            this.trigger("Move", old)
                        }
                    }
                    this._x = this.x;
                    this._y = this.y;
                    this._w = this.w;
                    this._h = this.h;
                    this._z = this.z;
                    this._rotation = this.rotation;
                    this._alpha = this.alpha;
                    this._visible = this.visible;
                    this.trigger("Change", old);
                    this.trigger("Move", old)
                }
            })
        },
        init: function () {
            this._globalZ = this[0];
            this._origin = {
                x: 0,
                y: 0
            };

            this._children = [];
            if (Crafty.support.setter) {
                this._defineGetterSetter_setter()
            } else {
                if (Crafty.support.defineProperty) {
                    this._defineGetterSetter_defineProperty()
                } else {
                    this._defineGetterSetter_fallback()
                }
            }
            this._entry = Crafty.map.insert(this);
            this.bind("Move", function (e) {
                var area = this._mbr || this;
                this._entry.update(area);
                this._cascade(e)
            });
            this.bind("Rotate", function (e) {
                var old = this._mbr || this;
                this._entry.update(old);
                this._cascade(e)
            });
            this.bind("Remove", function () {
                if (this._children) {
                    for (var i = 0; i < this._children.length; i++) {
                        if (this._children[i].destroy) {
                            this._children[i].destroy()
                        }
                    }
                    this._children = []
                }
                Crafty.map.remove(this);
                this.detach()
            })
        },
        _rotate: function (v) {
            var theta = -1 * (v % 360), rad = theta * DEG_TO_RAD, ct = Math.cos(rad), st = Math.sin(rad), o = {
                x: this._origin.x + this._x,
                y: this._origin.y + this._y
            };

            if (!theta) {
                this._mbr = null;
                if (!this._rotation % 360) {
                    return
                }
            }
            var x0 = o.x + (this._x - o.x) * ct + (this._y - o.y) * st, y0 = o.y - (this._x - o.x) * st + (this._y - o.y) * ct, x1 = o.x + (this._x + this._w - o.x) * ct + (this._y - o.y) * st, y1 = o.y - (this._x + this._w - o.x) * st + (this._y - o.y) * ct, x2 = o.x + (this._x + this._w - o.x) * ct + (this._y + this._h - o.y) * st, y2 = o.y - (this._x + this._w - o.x) * st + (this._y + this._h - o.y) * ct, x3 = o.x + (this._x - o.x) * ct + (this._y + this._h - o.y) * st, y3 = o.y - (this._x - o.x) * st + (this._y + this._h - o.y) * ct, minx = Math.floor(Math.min(x0, x1, x2, x3)), miny = Math.floor(Math.min(y0, y1, y2, y3)), maxx = Math.ceil(Math.max(x0, x1, x2, x3)), maxy = Math.ceil(Math.max(y0, y1, y2, y3));
            this._mbr = {
                _x: minx,
                _y: miny,
                _w: maxx - minx,
                _h: maxy - miny
            };

            var difference = this._rotation - v, drad = difference * DEG_TO_RAD;
            this.trigger("Rotate", {
                cos: Math.cos(drad),
                sin: Math.sin(drad),
                deg: difference,
                rad: drad,
                o: {
                    x: o.x,
                    y: o.y
                },
                matrix: {
                    M11: ct,
                    M12: st,
                    M21: -st,
                    M22: ct
                }
            })
        },
        area: function () {
            return this._w * this._h
        },
        intersect: function (x, y, w, h) {
            var rect, obj = this._mbr || this;
            if (typeof x === "object") {
                rect = x
            } else {
                rect = {
                    x: x,
                    y: y,
                    w: w,
                    h: h
                }
            }
            return obj._x < rect.x + rect.w && obj._x + obj._w > rect.x && obj._y < rect.y + rect.h && obj._h + obj._y > rect.y
        },
        within: function (x, y, w, h) {
            var rect;
            if (typeof x === "object") {
                rect = x
            } else {
                rect = {
                    x: x,
                    y: y,
                    w: w,
                    h: h
                }
            }
            return rect.x <= this.x && rect.x + rect.w >= this.x + this.w && rect.y <= this.y && rect.y + rect.h >= this.y + this.h
        },
        contains: function (x, y, w, h) {
            var rect;
            if (typeof x === "object") {
                rect = x
            } else {
                rect = {
                    x: x,
                    y: y,
                    w: w,
                    h: h
                }
            }
            return rect.x >= this.x && rect.x + rect.w <= this.x + this.w && rect.y >= this.y && rect.y + rect.h <= this.y + this.h
        },
        pos: function () {
            return {
                _x: (this._x),
                _y: (this._y),
                _w: (this._w),
                _h: (this._h)
            }
        },
        mbr: function () {
            if (!this._mbr) {
                return this.pos()
            }
            return {
                _x: (this._mbr._x),
                _y: (this._mbr._y),
                _w: (this._mbr._w),
                _h: (this._mbr._h)
            }
        },
        isAt: function (x, y) {
            if (this.mapArea) {
                return this.mapArea.containsPoint(x, y)
            } else {
                if (this.map) {
                    return this.map.containsPoint(x, y)
                }
            }
            return this.x <= x && this.x + this.w >= x && this.y <= y && this.y + this.h >= y
        },
        move: function (dir, by) {
            if (dir.charAt(0) === "n") {
                this.y -= by
            }
            if (dir.charAt(0) === "s") {
                this.y += by
            }
            if (dir === "e" || dir.charAt(1) === "e") {
                this.x += by
            }
            if (dir === "w" || dir.charAt(1) === "w") {
                this.x -= by
            }
            return this
        },
        shift: function (x, y, w, h) {
            if (x) {
                this.x += x
            }
            if (y) {
                this.y += y
            }
            if (w) {
                this.w += w
            }
            if (h) {
                this.h += h
            }
            return this
        },
        _cascade: function (e) {
            if (!e) {
                return
            }
            var i = 0, children = this._children, l = children.length, obj;
            if (e.cos) {
                for (; i < l; ++i) {
                    obj = children[i];
                    if ("rotate" in obj) {
                        obj.rotate(e)
                    }
                }
            } else {
                var rect = this._mbr || this, dx = rect._x - e._x, dy = rect._y - e._y, dw = rect._w - e._w, dh = rect._h - e._h;
                for (; i < l; ++i) {
                    obj = children[i];
                    obj.shift(dx, dy, dw, dh)
                }
            }
        },
        attach: function () {
            var i = 0, arg = arguments, l = arguments.length, obj;
            for (; i < l; ++i) {
                obj = arg[i];
                if (obj._parent) {
                    obj._parent.detach(obj)
                }
                obj._parent = this;
                this._children.push(obj)
            }
            return this
        },
        detach: function (obj) {
            if (!obj) {
                for (var i = 0; i < this._children.length; i++) {
                    this._children[i]._parent = null
                }
                this._children = [];
                return this
            }
            for (var i = 0; i < this._children.length; i++) {
                if (this._children[i] == obj) {
                    this._children.splice(i, 1)
                }
            }
            obj._parent = null;
            return this
        },
        origin: function (x, y) {
            if (typeof x === "string") {
                if (x === "centre" || x === "center" || x.indexOf(" ") === -1) {
                    x = this._w / 2;
                    y = this._h / 2
                } else {
                    var cmd = x.split(" ");
                    if (cmd[0] === "top") {
                        y = 0
                    } else {
                        if (cmd[0] === "bottom") {
                            y = this._h
                        } else {
                            if (cmd[0] === "middle" || cmd[1] === "center" || cmd[1] === "centre") {
                                y = this._h / 2
                            }
                        }
                    }
                    if (cmd[1] === "center" || cmd[1] === "centre" || cmd[1] === "middle") {
                        x = this._w / 2
                    } else {
                        if (cmd[1] === "left") {
                            x = 0
                        } else {
                            if (cmd[1] === "right") {
                                x = this._w
                            }
                        }
                    }
                }
            }
            this._origin.x = x;
            this._origin.y = y;
            return this
        },
        flip: function (dir) {
            dir = dir || "X";
            if (!this["_flip" + dir]) {
                this["_flip" + dir] = true;
                this.trigger("Change")
            }
        },
        unflip: function (dir) {
            dir = dir || "X";
            if (this["_flip" + dir]) {
                this["_flip" + dir] = false;
                this.trigger("Change")
            }
        },
        rotate: function (e) {
            this._origin.x = e.o.x - this._x;
            this._origin.y = e.o.y - this._y;
            this._attr("_rotation", e.theta)
        },
        _attr: function (name, value) {
            var pos = this.pos(), old = this.mbr() || pos;
            if (name === "_rotation") {
                this._rotate(value);
                this.trigger("Rotate")
            } else {
                if (name === "_z") {
                    this._globalZ = parseInt(value + Crafty.zeroFill(this[0], 5), 10);
                    this.trigger("reorder")
                } else {
                    if (name == "_x" || name === "_y" || name === "_w" || name === "_h") {
                        var mbr = this._mbr;
                        if (mbr) {
                            mbr[name] -= this[name] - value
                        }
                        this[name] = value;
                        this.trigger("Move", old)
                    }
                }
            }
            this[name] = value;
            this.trigger("Change", old)
        }
    });
    Crafty.c("Physics", {
        _gravity: 0.4,
        _friction: 0.2,
        _bounce: 0.5,
        gravity: function (gravity) {
            this._gravity = gravity
        }
    });
    Crafty.c("Gravity", {
        _gravityConst: 0.2,
        _gy: 0,
        _falling: true,
        _anti: null,
        init: function () {
            this.requires("2D")
        },
        gravity: function (comp) {
            if (comp) {
                this._anti = comp
            }
            this.bind("EnterFrame", this._enterFrame);
            return this
        },
        gravityConst: function (g) {
            this._gravityConst = g;
            return this
        },
        _enterFrame: function () {
            if (this._falling) {
                this._gy += this._gravityConst;
                this.y += this._gy
            } else {
                this._gy = 0
            }
            var obj, hit = false, pos = this.pos(), q, i = 0, l;
            pos._y++;
            pos.x = pos._x;
            pos.y = pos._y;
            pos.w = pos._w;
            pos.h = pos._h;
            q = Crafty.map.search(pos);
            l = q.length;
            for (; i < l; ++i) {
                obj = q[i];
                if (obj !== this && obj.has(this._anti) && obj.intersect(pos)) {
                    hit = obj;
                    break
                }
            }
            if (hit) {
                if (this._falling) {
                    this.stopFalling(hit)
                }
            } else {
                this._falling = true
            }
        },
        stopFalling: function (e) {
            if (e) {
                this.y = e._y - this._h
            }
            this._falling = false;
            if (this._up) {
                this._up = false
            }
            this.trigger("hit")
        },
        antigravity: function () {
            this.unbind("EnterFrame", this._enterFrame)
        }
    });
    Crafty.polygon = function (poly) {
        if (arguments.length > 1) {
            poly = Array.prototype.slice.call(arguments, 0)
        }
        this.points = poly
    };

    Crafty.polygon.prototype = {
        containsPoint: function (x, y) {
            var p = this.points, i, j, c = false;
            for (i = 0, j = p.length - 1; i < p.length; j = i++) {
                if (((p[i][1] > y) != (p[j][1] > y)) && (x < (p[j][0] - p[i][0]) * (y - p[i][1]) / (p[j][1] - p[i][1]) + p[i][0])) {
                    c = !c
                }
            }
            return c
        },
        shift: function (x, y) {
            var i = 0, l = this.points.length, current;
            for (; i < l; i++) {
                current = this.points[i];
                current[0] += x;
                current[1] += y
            }
        },
        rotate: function (e) {
            var i = 0, l = this.points.length, current, x, y;
            for (; i < l; i++) {
                current = this.points[i];
                x = e.o.x + (current[0] - e.o.x) * e.cos + (current[1] - e.o.y) * e.sin;
                y = e.o.y - (current[0] - e.o.x) * e.sin + (current[1] - e.o.y) * e.cos;
                current[0] = x;
                current[1] = y
            }
        }
    };

    Crafty.circle = function (x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.points = [];
        var theta;
        for (var i = 0; i < 8; i++) {
            theta = i * Math.PI / 4;
            this.points[i] = [Math.sin(theta) * radius, Math.cos(theta) * radius]
        }
    };

    Crafty.circle.prototype = {
        containsPoint: function (x, y) {
            var radius = this.radius, sqrt = Math.sqrt, deltaX = this.x - x, deltaY = this.y - y;
            return (deltaX * deltaX + deltaY * deltaY) < (radius * radius)
        },
        shift: function (x, y) {
            this.x += x;
            this.y += y;
            var i = 0, l = this.points.length, current;
            for (; i < l; i++) {
                current = this.points[i];
                current[0] += x;
                current[1] += y
            }
        },
        rotate: function () { }
    };

    Crafty.matrix = function (m) {
        this.mtx = m;
        this.width = m[0].length;
        this.height = m.length
    };

    Crafty.matrix.prototype = {
        x: function (other) {
            if (this.width != other.height) {
                return
            }
            var result = [];
            for (var i = 0; i < this.height; i++) {
                result[i] = [];
                for (var j = 0; j < other.width; j++) {
                    var sum = 0;
                    for (var k = 0; k < this.width; k++) {
                        sum += this.mtx[i][k] * other.mtx[k][j]
                    }
                    result[i][j] = sum
                }
            }
            return new Crafty.matrix(result)
        },
        e: function (row, col) {
            if (row < 1 || row > this.mtx.length || col < 1 || col > this.mtx[0].length) {
                return null
            }
            return this.mtx[row - 1][col - 1]
        }
    };

    Crafty.c("Collision", {
        init: function () {
            this.requires("2D");
            var area = this._mbr || this;
            poly = new Crafty.polygon([0, 0], [area._w, 0], [area._w, area._h], [0, area._h]);
            this.map = poly;
            this.attach(this.map);
            this.map.shift(area._x, area._y)
        },
        collision: function (poly) {
            var area = this._mbr || this;
            if (!poly) {
                return this
            }
            if (arguments.length > 1) {
                var args = Array.prototype.slice.call(arguments, 0);
                poly = new Crafty.polygon(args)
            }
            this.map = poly;
            this.attach(this.map);
            this.map.shift(area._x, area._y);
            return this
        },
        hit: function (comp) {
            var area = this._mbr || this, results = Crafty.map.search(area, false), i = 0, l = results.length, dupes = {}, id, obj, oarea, key, hasMap = ("map" in this && "containsPoint" in this.map), finalresult = [];
            if (!l) {
                return false
            }
            for (; i < l; ++i) {
                obj = results[i];
                oarea = obj._mbr || obj;
                if (!obj) {
                    continue
                }
                id = obj[0];
                if (!dupes[id] && this[0] !== id && obj.__c[comp] && oarea._x < area._x + area._w && oarea._x + oarea._w > area._x && oarea._y < area._y + area._h && oarea._h + oarea._y > area._y) {
                    dupes[id] = obj
                }
            }
            for (key in dupes) {
                obj = dupes[key];
                if (hasMap && "map" in obj) {
                    var SAT = this._SAT(this.map, obj.map);
                    SAT.obj = obj;
                    SAT.type = "SAT";
                    if (SAT) {
                        finalresult.push(SAT)
                    }
                } else {
                    finalresult.push({
                        obj: obj,
                        type: "MBR"
                    })
                }
            }
            if (!finalresult.length) {
                return false
            }
            return finalresult
        },
        onHit: function (comp, callback, callbackOff) {
            var justHit = false;
            this.bind("EnterFrame", function () {
                var hitdata = this.hit(comp);
                if (hitdata) {
                    justHit = true;
                    callback.call(this, hitdata)
                } else {
                    if (justHit) {
                        if (typeof callbackOff == "function") {
                            callbackOff.call(this)
                        }
                        justHit = false
                    }
                }
            });
            return this
        },
        _SAT: function (poly1, poly2) {
            var points1 = poly1.points, points2 = poly2.points, i = 0, l = points1.length, j, k = points2.length, normal = {
                x: 0,
                y: 0
            }, length, min1, min2, max1, max2, interval, MTV = null, MTV2 = null, MN = null, dot, nextPoint, currentPoint;
            for (; i < l; i++) {
                nextPoint = points1[(i == l - 1 ? 0 : i + 1)];
                currentPoint = points1[i];
                normal.x = -(nextPoint[1] - currentPoint[1]);
                normal.y = (nextPoint[0] - currentPoint[0]);
                length = Math.sqrt(normal.x * normal.x + normal.y * normal.y);
                normal.x /= length;
                normal.y /= length;
                min1 = min2 = -1;
                max1 = max2 = -1;
                for (j = 0; j < l; ++j) {
                    dot = points1[j][0] * normal.x + points1[j][1] * normal.y;
                    if (dot > max1 || max1 === -1) {
                        max1 = dot
                    }
                    if (dot < min1 || min1 === -1) {
                        min1 = dot
                    }
                }
                for (j = 0; j < k; ++j) {
                    dot = points2[j][0] * normal.x + points2[j][1] * normal.y;
                    if (dot > max2 || max2 === -1) {
                        max2 = dot
                    }
                    if (dot < min2 || min2 === -1) {
                        min2 = dot
                    }
                }
                if (min1 < min2) {
                    interval = min2 - max1;
                    normal.x = -normal.x;
                    normal.y = -normal.y
                } else {
                    interval = min1 - max2
                }
                if (interval >= 0) {
                    return false
                }
                if (MTV === null || interval > MTV) {
                    MTV = interval;
                    MN = {
                        x: normal.x,
                        y: normal.y
                    }
                }
            }
            for (i = 0; i < k; i++) {
                nextPoint = points2[(i == k - 1 ? 0 : i + 1)];
                currentPoint = points2[i];
                normal.x = -(nextPoint[1] - currentPoint[1]);
                normal.y = (nextPoint[0] - currentPoint[0]);
                length = Math.sqrt(normal.x * normal.x + normal.y * normal.y);
                normal.x /= length;
                normal.y /= length;
                min1 = min2 = -1;
                max1 = max2 = -1;
                for (j = 0; j < l; ++j) {
                    dot = points1[j][0] * normal.x + points1[j][1] * normal.y;
                    if (dot > max1 || max1 === -1) {
                        max1 = dot
                    }
                    if (dot < min1 || min1 === -1) {
                        min1 = dot
                    }
                }
                for (j = 0; j < k; ++j) {
                    dot = points2[j][0] * normal.x + points2[j][1] * normal.y;
                    if (dot > max2 || max2 === -1) {
                        max2 = dot
                    }
                    if (dot < min2 || min2 === -1) {
                        min2 = dot
                    }
                }
                if (min1 < min2) {
                    interval = min2 - max1;
                    normal.x = -normal.x;
                    normal.y = -normal.y
                } else {
                    interval = min1 - max2
                }
                if (interval >= 0) {
                    return false
                }
                if (MTV === null || interval > MTV) {
                    MTV = interval
                }
                if (interval > MTV2 || MTV2 === null) {
                    MTV2 = interval;
                    MN = {
                        x: normal.x,
                        y: normal.y
                    }
                }
            }
            return {
                overlap: MTV2,
                normal: MN
            }
        }
    });
    Crafty.c("WiredHitBox", {
        init: function () {
            if (Crafty.support.canvas) {
                var c = document.getElementById("HitBox");
                if (!c) {
                    c = document.createElement("canvas");
                    c.id = "HitBox";
                    c.width = Crafty.viewport.width;
                    c.height = Crafty.viewport.height;
                    c.style.position = "absolute";
                    c.style.left = "0px";
                    c.style.top = "0px";
                    c.style.zIndex = "1000";
                    Crafty.stage.elem.appendChild(c)
                }
                var ctx = c.getContext("2d");
                var drawed = 0, total = Crafty("WiredHitBox").length;
                this.requires("Collision").bind("EnterFrame", function () {
                    if (drawed == total) {
                        ctx.clearRect(0, 0, Crafty.viewport.width, Crafty.viewport.height);
                        drawed = 0
                    }
                    ctx.beginPath();
                    for (var p in this.map.points) {
                        ctx.lineTo(Crafty.viewport.x + this.map.points[p][0], Crafty.viewport.y + this.map.points[p][1])
                    }
                    ctx.closePath();
                    ctx.stroke();
                    drawed++
                })
            }
            return this
        }
    });
    Crafty.c("SolidHitBox", {
        init: function () {
            if (Crafty.support.canvas) {
                var c = document.getElementById("HitBox");
                if (!c) {
                    c = document.createElement("canvas");
                    c.id = "HitBox";
                    c.width = Crafty.viewport.width;
                    c.height = Crafty.viewport.height;
                    c.style.position = "absolute";
                    c.style.left = "0px";
                    c.style.top = "0px";
                    c.style.zIndex = "1000";
                    Crafty.stage.elem.appendChild(c)
                }
                var ctx = c.getContext("2d");
                var drawed = 0, total = Crafty("SolidHitBox").length;
                this.requires("Collision").bind("EnterFrame", function () {
                    if (drawed == total) {
                        ctx.clearRect(0, 0, Crafty.viewport.width, Crafty.viewport.height);
                        drawed = 0
                    }
                    ctx.beginPath();
                    for (var p in this.map.points) {
                        ctx.lineTo(Crafty.viewport.x + this.map.points[p][0], Crafty.viewport.y + this.map.points[p][1])
                    }
                    ctx.closePath();
                    ctx.fill();
                    drawed++
                })
            }
            return this
        }
    });
    Crafty.c("DOM", {
        _element: null,
        init: function () {
            this._element = document.createElement("div");
            Crafty.stage.inner.appendChild(this._element);
            this._element.style.position = "absolute";
            this._element.id = "ent" + this[0];
            this.bind("Change", function () {
                if (!this._changed) {
                    this._changed = true;
                    Crafty.DrawManager.add(this)
                }
            });
            function updateClass() {
                var i = 0, c = this.__c, str = "";
                for (i in c) {
                    str += " " + i
                }
                str = str.substr(1);
                this._element.className = str
            }
            this.bind("NewComponent", updateClass).bind("RemoveComponent", updateClass);
            if (Crafty.support.prefix === "ms" && Crafty.support.version < 9) {
                this._filters = {};

                this.bind("Rotate", function (e) {
                    var m = e.matrix, elem = this._element.style, M11 = m.M11.toFixed(8), M12 = m.M12.toFixed(8), M21 = m.M21.toFixed(8), M22 = m.M22.toFixed(8);
                    this._filters.rotation = "progid:DXImageTransform.Microsoft.Matrix(M11=" + M11 + ", M12=" + M12 + ", M21=" + M21 + ", M22=" + M22 + ",sizingMethod='auto expand')"
                })
            }
            this.bind("Remove", this.undraw);
            this.bind("RemoveComponent", function (compName) {
                if (compName === "DOM") {
                    this.undraw()
                }
            })
        },
        getDomId: function () {
            return this._element.id
        },
        DOM: function (elem) {
            if (elem && elem.nodeType) {
                this.undraw();
                this._element = elem;
                this._element.style.position = "absolute"
            }
            return this
        },
        draw: function () {
            var style = this._element.style, coord = this.__coord || [0, 0, 0, 0], co = {
                x: coord[0],
                y: coord[1]
            }, prefix = Crafty.support.prefix, trans = [];
            if (!this._visible) {
                style.visibility = "hidden"
            } else {
                style.visibility = "visible"
            }
            if (Crafty.support.css3dtransform) {
                trans.push("translate3d(" + (~ ~this._x) + "px," + (~ ~this._y) + "px,0)")
            } else {
                style.left = ~ ~(this._x) + "px";
                style.top = ~ ~(this._y) + "px"
            }
            style.width = ~ ~(this._w) + "px";
            style.height = ~ ~(this._h) + "px";
            style.zIndex = this._z;
            style.opacity = this._alpha;
            style[prefix + "Opacity"] = this._alpha;
            if (prefix === "ms" && Crafty.support.version < 9) {
                if (Crafty.support.version === 8) {
                    this._filters.alpha = "progid:DXImageTransform.Microsoft.Alpha(Opacity=" + (this._alpha * 100) + ")"
                } else {
                    this._filters.alpha = "alpha(opacity=" + (this._alpha * 100) + ")"
                }
            }
            if (this._mbr) {
                var origin = this._origin.x + "px " + this._origin.y + "px";
                style.transformOrigin = origin;
                style[prefix + "TransformOrigin"] = origin;
                if (Crafty.support.css3dtransform) {
                    trans.push("rotateZ(" + this._rotation + "deg)")
                } else {
                    trans.push("rotate(" + this._rotation + "deg)")
                }
            }
            if (this._flipX) {
                trans.push("scaleX(-1)");
                if (prefix === "ms" && Crafty.support.version < 9) {
                    this._filters.flipX = "fliph"
                }
            }
            if (this._flipY) {
                trans.push("scaleY(-1)");
                if (prefix === "ms" && Crafty.support.version < 9) {
                    this._filters.flipY = "flipv"
                }
            }
            if (prefix === "ms" && Crafty.support.version < 9) {
                this.applyFilters()
            }
            style.transform = trans.join(" ");
            style[prefix + "Transform"] = trans.join(" ");
            this.trigger("Draw", {
                style: style,
                type: "DOM",
                co: co
            });
            return this
        },
        applyFilters: function () {
            this._element.style.filter = "";
            var str = "";
            for (var filter in this._filters) {
                if (!this._filters.hasOwnProperty(filter)) {
                    continue
                }
                str += this._filters[filter] + " "
            }
            this._element.style.filter = str
        },
        undraw: function () {
            if (this._element) {
                Crafty.stage.inner.removeChild(this._element)
            }
            return this
        },
        css: function (obj, value) {
            var key, elem = this._element, val, style = elem.style;
            if (typeof obj === "object") {
                for (key in obj) {
                    if (!obj.hasOwnProperty(key)) {
                        continue
                    }
                    val = obj[key];
                    if (typeof val === "number") {
                        val += "px"
                    }
                    style[Crafty.DOM.camelize(key)] = val
                }
            } else {
                if (value) {
                    if (typeof value === "number") {
                        value += "px"
                    }
                    style[Crafty.DOM.camelize(obj)] = value
                } else {
                    return Crafty.DOM.getStyle(elem, obj)
                }
            }
            this.trigger("Change");
            return this
        }
    });
    try {
        document.execCommand("BackgroundImageCache", false, true)
    } catch (e) { }
    Crafty.extend({
        DOM: {
            window: {
                init: function () {
                    this.width = window.innerWidth || (window.document.documentElement.clientWidth || window.document.body.clientWidth);
                    this.height = window.innerHeight || (window.document.documentElement.clientHeight || window.document.body.clientHeight)
                },
                width: 0,
                height: 0
            },
            inner: function (obj) {
                var rect = obj.getBoundingClientRect(), x = rect.left + (window.pageXOffset ? window.pageXOffset : document.body.scrollLeft), y = rect.top + (window.pageYOffset ? window.pageYOffset : document.body.scrollTop), borderX = parseInt(this.getStyle(obj, "border-left-width") || 0, 10) || parseInt(this.getStyle(obj, "borderLeftWidth") || 0, 10) || 0, borderY = parseInt(this.getStyle(obj, "border-top-width") || 0, 10) || parseInt(this.getStyle(obj, "borderTopWidth") || 0, 10) || 0;
                x += borderX;
                y += borderY;
                return {
                    x: x,
                    y: y
                }
            },
            getStyle: function (obj, prop) {
                var result;
                if (obj.currentStyle) {
                    result = obj.currentStyle[this.camelize(prop)]
                } else {
                    if (window.getComputedStyle) {
                        result = document.defaultView.getComputedStyle(obj, null).getPropertyValue(this.csselize(prop))
                    }
                }
                return result
            },
            camelize: function (str) {
                return str.replace(/-+(.)?/g, function (match, chr) {
                    return chr ? chr.toUpperCase() : ""
                })
            },
            csselize: function (str) {
                return str.replace(/[A-Z]/g, function (chr) {
                    return chr ? "-" + chr.toLowerCase() : ""
                })
            },
            translate: function (x, y) {
                return {
                    x: (x - Crafty.stage.x + document.body.scrollLeft + document.documentElement.scrollLeft - Crafty.viewport._x) / Crafty.viewport._zoom,
                    y: (y - Crafty.stage.y + document.body.scrollTop + document.documentElement.scrollTop - Crafty.viewport._y) / Crafty.viewport._zoom
                }
            }
        }
    });
    Crafty.c("HTML", {
        inner: "",
        init: function () {
            this.requires("2D, DOM")
        },
        replace: function (new_html) {
            this.inner = new_html;
            this._element.innerHTML = new_html;
            return this
        },
        append: function (new_html) {
            this.inner += new_html;
            this._element.innerHTML += new_html;
            return this
        },
        prepend: function (new_html) {
            this.inner = new_html + this.inner;
            this._element.innerHTML = new_html + this.inner;
            return this
        }
    });
    Crafty.storage = (function () {
        var db = null, url, gameName, timestamps = {};

        function process(obj) {
            if (obj.c) {
                var d = Crafty.e(obj.c).attr(obj.attr).trigger("LoadData", obj, process);
                return d
            } else {
                if (typeof obj == "object") {
                    for (var prop in obj) {
                        obj[prop] = process(obj[prop])
                    }
                }
            }
            return obj
        }
        function unserialize(str) {
            if (typeof str != "string") {
                return null
            }
            var data = (JSON ? JSON.parse(str) : eval("(" + str + ")"));
            return process(data)
        }
        function prep(obj) {
            if (obj.__c) {
                var data = {
                    c: [],
                    attr: {}
                };

                obj.trigger("SaveData", data, prep);
                for (var i in obj.__c) {
                    data.c.push(i)
                }
                data.c = data.c.join(", ");
                obj = data
            } else {
                if (typeof obj == "object") {
                    for (var prop in obj) {
                        obj[prop] = prep(obj[prop])
                    }
                }
            }
            return obj
        }
        function serialize(e) {
            if (JSON) {
                var data = prep(e);
                return JSON.stringify(data)
            } else {
                alert("Crafty does not support saving on your browser. Please upgrade to a newer browser.");
                return false
            }
        }
        function external(setUrl) {
            url = setUrl
        }
        function openExternal() {
            if (1 && typeof url == "undefined") {
                return
            }
            var xml = new XMLHttpRequest();
            xhr.open("POST", url);
            xhr.onreadystatechange = function (evt) {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        var data = eval("(" + xhr.responseText + ")");
                        for (var i in data) {
                            if (Crafty.storage.check(data[i].key, data[i].timestamp)) {
                                loadExternal(data[i].key)
                            }
                        }
                    }
                }
            };

            xhr.send("mode=timestamps&game=" + gameName)
        }
        function saveExternal(key, data, ts) {
            if (1 && typeof url == "undefined") {
                return
            }
            var xhr = new XMLHttpRequest();
            xhr.open("POST", url);
            xhr.send("mode=save&key=" + key + "&data=" + encodeURIComponent(data) + "&ts=" + ts + "&game=" + gameName)
        }
        function loadExternal(key) {
            if (1 && typeof url == "undefined") {
                return
            }
            var xhr = new XMLHttpRequest();
            xhr.open("POST", url);
            xhr.onreadystatechange = function (evt) {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        var data = eval("(" + xhr.responseText + ")");
                        Crafty.storage.save(key, "save", data)
                    }
                }
            };

            xhr.send("mode=load&key=" + key + "&game=" + gameName)
        }
        function ts() {
            var d = new Date();
            return d.getTime()
        }
        if (typeof indexedDB != "object") {
            if (typeof mozIndexedDB == "object") {
                window.indexedDB = mozIndexedDB
            }
            if (typeof webkitIndexedDB == "object") {
                window.indexedDB = webkitIndexedDB;
                window.IDBTransaction = webkitIDBTransaction
            }
        }
        if (typeof indexedDB == "object") {
            return {
                open: function (gameName_n) {
                    gameName = gameName_n;
                    var stores = [];
                    if (arguments.length == 1) {
                        stores.push("save");
                        stores.push("cache")
                    } else {
                        stores = arguments;
                        stores.shift();
                        stores.push("save");
                        stores.push("cache")
                    }
                    if (db == null) {
                        var request = indexedDB.open(gameName, "Database for " + gameName);
                        request.onsuccess = function (e) {
                            db = e.target.result;
                            createStores();
                            getTimestamps();
                            openExternal()
                        }
                    } else {
                        createStores();
                        getTimestamps();
                        openExternal()
                    }
                    function getTimestamps() {
                        try {
                            var trans = db.transaction(["save"], IDBTransaction.READ), store = trans.objectStore("save"), request = store.getAll();
                            request.onsuccess = function (e) {
                                var i = 0, a = event.target.result, l = a.length;
                                for (; i < l; i++) {
                                    timestamps[a[i].key] = a[i].timestamp
                                }
                            }
                        } catch (e) { }
                    }
                    function createStores() {
                        var request = db.setVersion("1.0");
                        request.onsuccess = function (e) {
                            for (var i = 0; i < stores.length; i++) {
                                var st = stores[i];
                                if (db.objectStoreNames.contains(st)) {
                                    continue
                                }
                                db.createObjectStore(st, {
                                    keyPath: "key"
                                })
                            }
                        }
                    }
                },
                save: function (key, type, data) {
                    if (db == null) {
                        setTimeout(function () {
                            Crafty.storage.save(key, type, data)
                        }, 1);
                        return
                    }
                    var str = serialize(data), t = ts();
                    if (type == "save") {
                        saveExternal(key, str, t)
                    }
                    try {
                        var trans = db.transaction([type], IDBTransaction.READ_WRITE), store = trans.objectStore(type), request = store.put({
                            data: str,
                            timestamp: t,
                            key: key
                        })
                    } catch (e) {
                        console.error(e)
                    }
                },
                load: function (key, type, callback) {
                    if (db == null) {
                        setTimeout(function () {
                            Crafty.storage.load(key, type, callback)
                        }, 1);
                        return
                    }
                    try {
                        var trans = db.transaction([type], IDBTransaction.READ), store = trans.objectStore(type), request = store.get(key);
                        request.onsuccess = function (e) {
                            callback(unserialize(e.target.result.data))
                        }
                    } catch (e) {
                        console.error(e)
                    }
                },
                getAllKeys: function (type, callback) {
                    if (db == null) {
                        setTimeout(function () {
                            Crafty.storage.getAllkeys(type, callback)
                        }, 1)
                    }
                    try {
                        var trans = db.transaction([type], IDBTransaction.READ), store = trans.objectStore(type), request = store.getCursor(), res = [];
                        request.onsuccess = function (e) {
                            var cursor = e.target.result;
                            if (cursor) {
                                res.push(cursor.key);
                                cursor["continue"]()
                            } else {
                                callback(res)
                            }
                        }
                    } catch (e) {
                        console.error(e)
                    }
                },
                check: function (key, timestamp) {
                    return (timestamps[key] > timestamp)
                },
                external: external
            }
        } else {
            if (typeof openDatabase == "function") {
                return {
                    open: function (gameName_n) {
                        gameName = gameName_n;
                        if (arguments.length == 1) {
                            db = {
                                save: openDatabase(gameName_n + "_save", "1.0", "Saves games for " + gameName_n, 5 * 1024 * 1024),
                                cache: openDatabase(gameName_n + "_cache", "1.0", "Cache for " + gameName_n, 5 * 1024 * 1024)
                            }
                        } else {
                            var args = arguments, i = 0;
                            args.shift();
                            for (; i < args.length; i++) {
                                if (typeof db[args[i]] == "undefined") {
                                    db[args[i]] = openDatabase(gameName + "_" + args[i], "1.0", type, 5 * 1024 * 1024)
                                }
                            }
                        }
                        db.save.transaction(function (tx) {
                            tx.executeSql("SELECT key, timestamp FROM data", [], function (tx, res) {
                                var i = 0, a = res.rows, l = a.length;
                                for (; i < l; i++) {
                                    timestamps[a.item(i).key] = a.item(i).timestamp
                                }
                            })
                        })
                    },
                    save: function (key, type, data) {
                        if (typeof db[type] == "undefined" && gameName != "") {
                            this.open(gameName, type)
                        }
                        var str = serialize(data), t = ts();
                        if (type == "save") {
                            saveExternal(key, str, t)
                        }
                        db[type].transaction(function (tx) {
                            tx.executeSql("CREATE TABLE IF NOT EXISTS data (key unique, text, timestamp)");
                            tx.executeSql("SELECT * FROM data WHERE key = ?", [key], function (tx, results) {
                                if (results.rows.length) {
                                    tx.executeSql("UPDATE data SET text = ?, timestamp = ? WHERE key = ?", [str, t, key])
                                } else {
                                    tx.executeSql("INSERT INTO data VALUES (?, ?, ?)", [key, str, t])
                                }
                            })
                        })
                    },
                    load: function (key, type, callback) {
                        if (db[type] == null) {
                            setTimeout(function () {
                                Crafty.storage.load(key, type, callback)
                            }, 1);
                            return
                        }
                        db[type].transaction(function (tx) {
                            tx.executeSql("SELECT text FROM data WHERE key = ?", [key], function (tx, results) {
                                if (results.rows.length) {
                                    res = unserialize(results.rows.item(0).text);
                                    callback(res)
                                }
                            })
                        })
                    },
                    getAllKeys: function (type, callback) {
                        if (db[type] == null) {
                            setTimeout(function () {
                                Crafty.storage.getAllKeys(type, callback)
                            }, 1);
                            return
                        }
                        db[type].transaction(function (tx) {
                            tx.executeSql("SELECT key FROM data", [], function (tx, results) {
                                callback(results.rows)
                            })
                        })
                    },
                    check: function (key, timestamp) {
                        return (timestamps[key] > timestamp)
                    },
                    external: external
                }
            } else {
                if (typeof window.localStorage == "object") {
                    return {
                        open: function (gameName_n) {
                            gameName = gameName_n
                        },
                        save: function (key, type, data) {
                            var k = gameName + "." + type + "." + key, str = serialize(data), t = ts();
                            if (type == "save") {
                                saveExternal(key, str, t)
                            }
                            window.localStorage[k] = str;
                            if (type == "save") {
                                window.localStorage[k + ".ts"] = t
                            }
                        },
                        load: function (key, type, callback) {
                            var k = gameName + "." + type + "." + key, str = window.localStorage[k];
                            callback(unserialize(str))
                        },
                        getAllKeys: function (type, callback) {
                            var res = {}, output = [], header = gameName + "." + type;
                            for (var i in window.localStorage) {
                                if (i.indexOf(header) != -1) {
                                    var key = i.replace(header, "").replace(".ts", "");
                                    res[key] = true
                                }
                            }
                            for (i in res) {
                                output.push(i)
                            }
                            callback(output)
                        },
                        check: function (key, timestamp) {
                            var ts = window.localStorage[gameName + ".save." + key + ".ts"];
                            return (parseInt(timestamp) > parseInt(ts))
                        },
                        external: external
                    }
                } else {
                    return {
                        open: function (gameName_n) {
                            gameName = gameName_n
                        },
                        save: function (key, type, data) {
                            if (type != "save") {
                                return
                            }
                            var str = serialize(data), t = ts();
                            if (type == "save") {
                                saveExternal(key, str, t)
                            }
                            document.cookie = gameName + "_" + key + "=" + str + "; " + gameName + "_" + key + "_ts=" + t + "; expires=Thur, 31 Dec 2099 23:59:59 UTC; path=/"
                        },
                        load: function (key, type, callback) {
                            if (type != "save") {
                                return
                            }
                            var reg = new RegExp(gameName + "_" + key + "=[^;]*"), result = reg.exec(document.cookie), data = unserialize(result[0].replace(gameName + "_" + key + "=", ""));
                            callback(data)
                        },
                        getAllKeys: function (type, callback) {
                            if (type != "save") {
                                return
                            }
                            var reg = new RegExp(gameName + "_[^_=]", "g"), matches = reg.exec(document.cookie), i = 0, l = matches.length, res = {}, output = [];
                            for (; i < l; i++) {
                                var key = matches[i].replace(gameName + "_", "");
                                res[key] = true
                            }
                            for (i in res) {
                                output.push(i)
                            }
                            callback(output)
                        },
                        check: function (key, timestamp) {
                            var header = gameName + "_" + key + "_ts", reg = new RegExp(header + "=[^;]"), result = reg.exec(document.cookie), ts = result[0].replace(header + "=", "");
                            return (parseInt(timestamp) > parseInt(ts))
                        },
                        external: external
                    }
                }
            }
        }
    })();
    (function testSupport() {
        var support = Crafty.support = {}, ua = navigator.userAgent.toLowerCase(), match = /(webkit)[ \/]([\w.]+)/.exec(ua) || /(o)pera(?:.*version)?[ \/]([\w.]+)/.exec(ua) || /(ms)ie ([\w.]+)/.exec(ua) || /(moz)illa(?:.*? rv:([\w.]+))?/.exec(ua) || [], mobile = /iPad|iPod|iPhone|Android|webOS|IEMobile/i.exec(ua);
        if (mobile) {
            Crafty.mobile = mobile[0]
        }
        support.setter = ("__defineSetter__" in this && "__defineGetter__" in this);
        support.defineProperty = (function () {
            if (!"defineProperty" in Object) {
                return false
            }
            try {
                Object.defineProperty({}, "x", {})
            } catch (e) {
                return false
            }
            return true
        })();
        support.audio = ("Audio" in window);
        support.prefix = (match[1] || match[0]);
        if (support.prefix === "moz") {
            support.prefix = "Moz"
        }
        if (support.prefix === "o") {
            support.prefix = "O"
        }
        if (match[2]) {
            support.versionName = match[2];
            support.version = +(match[2].split("."))[0]
        }
        support.canvas = ("getContext" in document.createElement("canvas"));
        if (support.canvas) {
            var gl;
            try {
                gl = document.createElement("canvas").getContext("experimental-webgl");
                gl.viewportWidth = canvas.width;
                gl.viewportHeight = canvas.height
            } catch (e) { }
            support.webgl = !!gl
        } else {
            support.webgl = false
        }
        support.css3dtransform = (typeof document.createElement("div").style.Perspective !== "undefined") || (typeof document.createElement("div").style[support.prefix + "Perspective"] !== "undefined");
        support.deviceorientation = (typeof window.DeviceOrientationEvent !== "undefined") || (typeof window.OrientationEvent !== "undefined");
        support.devicemotion = (typeof window.DeviceMotionEvent !== "undefined")
    })();
    Crafty.extend({
        zeroFill: function (number, width) {
            width -= number.toString().length;
            if (width > 0) {
                return new Array(width + (/\./.test(number) ? 2 : 1)).join("0") + number
            }
            return number.toString()
        },
        sprite: function (tile, tileh, url, map, paddingX, paddingY, marginX, marginY) {
            var spriteName, temp, x, y, w, h, img;

            //if no tile value, default to 1
            if (typeof tile === "string") {

                marginY = marginX;
                marginX = paddingY;
                paddingY = paddingX;
                paddingX = map;
                map = tileh;
                url = tile;
                tile = 1;
                tileh = 1;
            }

            if (typeof tileh == "string") {

                marginY = marginX;
                marginX = paddingY;
                paddingY = paddingX;
                paddingX = map;
                map = url;
                url = tileh;
                tileh = tile;
            }

            //if no paddingY, use paddingX
            if (typeof paddingY == "undefined" && paddingX) paddingY = paddingX;
            paddingX = parseInt(paddingX || 0, 10); //just incase
            paddingY = parseInt(paddingY || 0, 10);
            //if no marginY, use marginX
            if (typeof marginY == "undefined" && marginX) marginY = marginX;
            marginX = parseInt(marginX || 0, 10); //just incase
            marginY = parseInt(marginY || 0, 10);

            img = Crafty.asset(url);
            if (!img) {
                img = new Image();
                img.src = url;
                Crafty.asset(url, img);
                img.onload = function () {
                    //all components with this img are now ready
                    for (spriteName in map) {
                        Crafty(spriteName).each(function () {
                            this.ready = true;
                            this.trigger("Change");
                        });
                    }
                };
            }

            for (spriteName in map) {
                if (!map.hasOwnProperty(spriteName)) continue;

                temp = map[spriteName];
                x = (temp[0] * (tile + paddingX));
                y = (temp[1] * (tileh + paddingY));
                w = temp[2] * tile || tile;
                h = temp[3] * tileh || tileh;

                //generates sprite components for each tile in the map
                Crafty.c(spriteName, {
                    ready: false,
                    __coord: [x, y, w, h],

                    init: function () {
                        this.requires("Sprite");
                        this.__trim = [0, 0, 0, 0];
                        this.__image = url;
                        this.__coord = [this.__coord[0], this.__coord[1], this.__coord[2], this.__coord[3]];
                        this.__tile = tile;
                        this.__tileh = tileh;
                        this.__padding = [paddingX, paddingY];
                        this.__margin = [marginX, marginY];
                        this.img = img;

                        //draw now
                        if (this.img.complete && this.img.width > 0) {
                            this.ready = true;
                            this.trigger("Change");
                        }

                        //set the width and height to the sprite size
                        this.w = this.__coord[2];
                        this.h = this.__coord[3];

                        //set the margin
                        this.x = marginX;
                        this.y = marginY;
                    }
                });
            }

            return this;
        },
        _events: {},
        addEvent: function (ctx, obj, type, callback) {
            if (arguments.length === 3) {
                callback = type;
                type = obj;
                obj = window.document
            }
            var afn = function (e) {
                var e = e || window.event;
                if (typeof callback === "function") {
                    callback.call(ctx, e)
                }
            }, id = ctx[0] || "";
            if (!this._events[id + obj + type + callback]) {
                this._events[id + obj + type + callback] = afn
            } else {
                return
            }
            if (obj.attachEvent) {
                obj.attachEvent("on" + type, afn)
            } else {
                obj.addEventListener(type, afn, false)
            }
        },
        removeEvent: function (ctx, obj, type, callback) {
            if (arguments.length === 3) {
                callback = type;
                type = obj;
                obj = window.document
            }
            var id = ctx[0] || "", afn = this._events[id + obj + type + callback];
            if (afn) {
                if (obj.detachEvent) {
                    obj.detachEvent("on" + type, afn)
                } else {
                    obj.removeEventListener(type, afn, false)
                }
                delete this._events[id + obj + type + callback]
            }
        },
        background: function (style) {
            Crafty.stage.elem.style.background = style
        },
        viewport: {
            clampToEntities: true,
            width: 0,
            height: 0,
            _x: 0,
            _y: 0,
            scroll: function (axis, v) {
                v = Math.floor(v);
                var change = v - this[axis], context = Crafty.canvas.context, style = Crafty.stage.inner.style, canvas;
                this[axis] = v;
                if (axis == "_x") {
                    if (context) {
                        context.translate(change, 0)
                    }
                } else {
                    if (context) {
                        context.translate(0, change)
                    }
                }
                if (context) {
                    Crafty.DrawManager.drawAll()
                }
                style[axis == "_x" ? "left" : "top"] = v + "px"
            },
            adjust: function (left, top, right, bottom) {
                this._x += left;
                this._y += top;
                this.width += right;
                this.height += bottom;

            },
            rect: function () {
                return {
                    _x: -this._x,
                    _y: -this._y,
                    _w: this.width,
                    _h: this.height
                }
            },
            pan: (function () {
                var tweens = {}, i, bound = false;
                function enterFrame(e) {
                    var l = 0;
                    for (i in tweens) {
                        var prop = tweens[i];
                        if (prop.remTime > 0) {
                            prop.current += prop.diff;
                            prop.remTime--;
                            Crafty.viewport[i] = Math.floor(prop.current);
                            l++
                        } else {
                            delete tweens[i]
                        }
                    }
                    if (l) {
                        Crafty.viewport._clamp()
                    }
                }
                return function (axis, v, time) {
                    Crafty.viewport.follow();
                    if (axis == "reset") {
                        for (i in tweens) {
                            tweens[i].remTime = 0
                        }
                        return
                    }
                    if (time == 0) {
                        time = 1
                    }
                    tweens[axis] = {
                        diff: -v / time,
                        current: Crafty.viewport[axis],
                        remTime: time
                    };

                    if (!bound) {
                        Crafty.bind("EnterFrame", enterFrame);
                        bound = true
                    }
                }
            })(),
            follow: (function () {
                var oldTarget, offx, offy;
                function change() {
                    Crafty.viewport.scroll("_x", -(this.x + (this.w / 2) - (Crafty.viewport.width / 2) - offx));
                    Crafty.viewport.scroll("_y", -(this.y + (this.h / 2) - (Crafty.viewport.height / 2) - offy));
                    Crafty.viewport._clamp()
                }
                return function (target, offsetx, offsety) {
                    if (oldTarget) {
                        oldTarget.unbind("Change", change)
                    }
                    if (!target || !target.has("2D")) {
                        return
                    }
                    Crafty.viewport.pan("reset");
                    oldTarget = target;
                    offx = (typeof offsetx != "undefined") ? offsetx : 0;
                    offy = (typeof offsety != "undefined") ? offsety : 0;
                    target.bind("Change", change);
                    change.call(target)
                }
            })(),
            centerOn: function (targ, time) {
                var x = targ.x, y = targ.y, mid_x = targ.w / 2, mid_y = targ.h / 2, cent_x = Crafty.viewport.width / 2, cent_y = Crafty.viewport.height / 2, new_x = x + mid_x - cent_x, new_y = y + mid_y - cent_y;
                Crafty.viewport.pan("reset");
                Crafty.viewport.pan("x", new_x, time);
                Crafty.viewport.pan("y", new_y, time)
            },
            _zoom: 1,
            zoom: (function () {
                var zoom = 1, zoom_tick = 0, dur = 0, prop = Crafty.support.prefix + "Transform", bound = false, act = {}, prct = {};

                function enterFrame() {
                    if (dur > 0) {
                        var old = {
                            width: act.width * zoom,
                            height: act.height * zoom
                        };

                        zoom += zoom_tick;
                        this._zoom = zoom;
                        var new_s = {
                            width: act.width * zoom,
                            height: act.height * zoom
                        }, diff = {
                            width: new_s.width - old.width,
                            height: new_s.height - old.height
                        };

                        Crafty.stage.inner.style[prop] = "scale(" + zoom + "," + zoom + ")";
                        if (Crafty.canvas._canvas) {
                            Crafty.canvas.context.scale(zoom, zoom);
                            Crafty.DrawManager.drawAll()
                        }
                        Crafty.viewport.x -= diff.width * prct.width;
                        Crafty.viewport.y -= diff.height * prct.height;
                        dur--
                    }
                }
                return function (amt, cent_x, cent_y, time) {
                    var bounds = Crafty.map.boundaries(), final_zoom = amt ? zoom * amt : 1;
                    act.width = bounds.max.x - bounds.min.x;
                    act.height = bounds.max.y - bounds.min.y;
                    prct.width = cent_x / act.width;
                    prct.height = cent_y / act.height;
                    if (time == 0) {
                        time = 1
                    }
                    zoom_tick = (final_zoom - zoom) / time;
                    dur = time;
                    Crafty.viewport.pan("reset");
                    if (!bound) {
                        Crafty.bind("EnterFrame", enterFrame);
                        bound = true
                    }
                }
            })(),
            scale: (function () {
                var prop = Crafty.support.prefix + "Transform", act = {};

                return function (amt) {
                    var bounds = Crafty.map.boundaries(), final_zoom = amt ? this._zoom * amt : 1;
                    this._zoom = final_zoom;
                    act.width = bounds.max.x - bounds.min.x;
                    act.height = bounds.max.y - bounds.min.y;
                    var new_s = {
                        width: act.width * final_zoom,
                        height: act.height * final_zoom
                    };

                    Crafty.viewport.pan("reset");
                    Crafty.stage.inner.style[prop] = "scale(" + this._zoom + "," + this._zoom + ")";
                    Crafty.stage.elem.style.width = new_s.width + "px";
                    Crafty.stage.elem.style.height = new_s.height + "px";
                    if (Crafty.canvas._canvas) {
                        Crafty.canvas._canvas.width = new_s.width;
                        Crafty.canvas._canvas.height = new_s.height;
                        Crafty.canvas.context.scale(this._zoom, this._zoom);
                        Crafty.DrawManager.drawAll()
                    }
                    Crafty.viewport.width = new_s.width;
                    Crafty.viewport.height = new_s.height
                }
            })(),
            mouselook: (function () {
                var active = false, dragging = false, lastMouse = {};

                old = {};

                return function (op, arg) {
                    if (typeof op == "boolean") {
                        active = op;
                        if (active) {
                            Crafty.mouseObjs++
                        } else {
                            Crafty.mouseObjs = Math.max(0, Crafty.mouseObjs - 1)
                        }
                        return
                    }
                    if (!active) {
                        return
                    }
                    switch (op) {
                        case "move": case "drag":
                            if (!dragging) {
                                return
                            }
                            diff = {
                                x: arg.clientX - lastMouse.x,
                                y: arg.clientY - lastMouse.y
                            };

                            Crafty.viewport.x += diff.x;
                            Crafty.viewport.y += diff.y;
                            Crafty.viewport._clamp();
                        case "start":
                            lastMouse.x = arg.clientX;
                            lastMouse.y = arg.clientY;
                            dragging = true;
                            break;
                        case "stop":
                            dragging = false;
                            break
                    }
                }
            })(),
            _clamp: function () {
                if (!this.clampToEntities) {
                    return
                }
                var bound = Crafty.map.boundaries();
                if (bound.max.x - bound.min.x > Crafty.viewport.width) {
                    bound.max.x -= Crafty.viewport.width;
                    if (Crafty.viewport.x < -bound.max.x) {
                        Crafty.viewport.x = -bound.max.x
                    } else {
                        if (Crafty.viewport.x > -bound.min.x) {
                            Crafty.viewport.x = -bound.min.x
                        }
                    }
                } else {
                    Crafty.viewport.x = -1 * (bound.min.x + (bound.max.x - bound.min.x) / 2 - Crafty.viewport.width / 2)
                }
                if (bound.max.y - bound.min.y > Crafty.viewport.height) {
                    bound.max.y -= Crafty.viewport.height;
                    if (Crafty.viewport.y < -bound.max.y) {
                        Crafty.viewport.y = -bound.max.y
                    } else {
                        if (Crafty.viewport.y > -bound.min.y) {
                            Crafty.viewport.y = -bound.min.y
                        }
                    }
                } else {
                    Crafty.viewport.y = -1 * (bound.min.y + (bound.max.y - bound.min.y) / 2 - Crafty.viewport.height / 2)
                }
            },
            init: function (w, h) {
                Crafty.DOM.window.init();
                this.width = (!w || Crafty.mobile) ? Crafty.DOM.window.width : w;
                this.height = (!h || Crafty.mobile) ? Crafty.DOM.window.height : h;
                var crstage = document.getElementById("cr-stage");
                Crafty.stage = {
                    x: 0,
                    y: 0,
                    fullscreen: false,
                    elem: (crstage ? crstage : document.createElement("div")),
                    inner: document.createElement("div")
                };

                if ((!w && !h) || Crafty.mobile) {
                    document.body.style.overflow = "hidden";
                    Crafty.stage.fullscreen = true
                }
                Crafty.addEvent(this, window, "resize", Crafty.viewport.reload);
                Crafty.addEvent(this, window, "blur", function () {
                    if (Crafty.settings.get("autoPause")) {
                        Crafty.pause()
                    }
                });
                Crafty.addEvent(this, window, "focus", function () {
                    if (Crafty._paused && Crafty.settings.get("autoPause")) {
                        Crafty.pause()
                    }
                });
                Crafty.settings.register("stageSelectable", function (v) {
                    Crafty.stage.elem.onselectstart = v ? function () {
                        return true
                    } : function () {
                        return false
                    }
                });
                Crafty.settings.modify("stageSelectable", false);
                Crafty.settings.register("stageContextMenu", function (v) {
                    Crafty.stage.elem.oncontextmenu = v ? function () {
                        return true
                    } : function () {
                        return false
                    }
                });
                Crafty.settings.modify("stageContextMenu", false);
                Crafty.settings.register("autoPause", function () { });
                Crafty.settings.modify("autoPause", false);
                if (!crstage) {
                    document.body.appendChild(Crafty.stage.elem);
                    Crafty.stage.elem.id = "cr-stage"
                }
                var elem = Crafty.stage.elem.style, offset;
                Crafty.stage.elem.appendChild(Crafty.stage.inner);
                Crafty.stage.inner.style.position = "absolute";
                Crafty.stage.inner.style.zIndex = "1";
                elem.width = this.width + "px";
                elem.height = this.height + "px";
                elem.overflow = "hidden";
                if (Crafty.mobile) {
                    elem.position = "absolute";
                    elem.left = "0px";
                    elem.top = "0px";
                    var meta = document.createElement("meta"), head = document.getElementsByTagName("HEAD")[0];
                    meta.setAttribute("name", "viewport");
                    meta.setAttribute("content", "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no");
                    head.appendChild(meta);
                    meta = document.createElement("meta");
                    meta.setAttribute("name", "apple-mobile-web-app-capable");
                    meta.setAttribute("content", "yes");
                    head.appendChild(meta);
                    setTimeout(function () {
                        window.scrollTo(0, 1)
                    }, 0);
                    Crafty.addEvent(this, window, "touchmove", function (e) {
                        e.preventDefault()
                    });
                    Crafty.stage.x = 0;
                    Crafty.stage.y = 0
                } else {
                    elem.position = "relative";
                    offset = Crafty.DOM.inner(Crafty.stage.elem);
                    Crafty.stage.x = offset.x;
                    Crafty.stage.y = offset.y
                }
                if (Crafty.support.setter) {
                    this.__defineSetter__("x", function (v) {
                        this.scroll("_x", v)
                    });
                    this.__defineSetter__("y", function (v) {
                        this.scroll("_y", v)
                    });
                    this.__defineGetter__("x", function () {
                        return this._x
                    });
                    this.__defineGetter__("y", function () {
                        return this._y
                    })
                } else {
                    if (Crafty.support.defineProperty) {
                        Object.defineProperty(this, "x", {
                            set: function (v) {
                                this.scroll("_x", v)
                            },
                            get: function () {
                                return this._x
                            }
                        });
                        Object.defineProperty(this, "y", {
                            set: function (v) {
                                this.scroll("_y", v)
                            },
                            get: function () {
                                return this._y
                            }
                        })
                    } else {
                        this.x = this._x;
                        this.y = this._y;
                        Crafty.e("viewport")
                    }
                }
            },
            reload: function () {
                Crafty.DOM.window.init();
                var w = Crafty.DOM.window.width, h = Crafty.DOM.window.height, offset;
                if (Crafty.stage.fullscreen) {
                    this.width = w;
                    this.height = h;
                    Crafty.stage.elem.style.width = w + "px";
                    Crafty.stage.elem.style.height = h + "px";
                    if (Crafty.canvas._canvas) {
                        Crafty.canvas._canvas.width = w;
                        Crafty.canvas._canvas.height = h;
                        Crafty.DrawManager.drawAll()
                    }
                }
                offset = Crafty.DOM.inner(Crafty.stage.elem);
                Crafty.stage.x = offset.x;
                Crafty.stage.y = offset.y
            }
        },
        keys: {
            BACKSPACE: 8,
            TAB: 9,
            ENTER: 13,
            PAUSE: 19,
            CAPS: 20,
            ESC: 27,
            SPACE: 32,
            PAGE_UP: 33,
            PAGE_DOWN: 34,
            END: 35,
            HOME: 36,
            LEFT_ARROW: 37,
            UP_ARROW: 38,
            RIGHT_ARROW: 39,
            DOWN_ARROW: 40,
            INSERT: 45,
            DELETE: 46,
            "0": 48,
            "1": 49,
            "2": 50,
            "3": 51,
            "4": 52,
            "5": 53,
            "6": 54,
            "7": 55,
            "8": 56,
            "9": 57,
            A: 65,
            B: 66,
            C: 67,
            D: 68,
            E: 69,
            F: 70,
            G: 71,
            H: 72,
            I: 73,
            J: 74,
            K: 75,
            L: 76,
            M: 77,
            N: 78,
            O: 79,
            P: 80,
            Q: 81,
            R: 82,
            S: 83,
            T: 84,
            U: 85,
            V: 86,
            W: 87,
            X: 88,
            Y: 89,
            Z: 90,
            NUMPAD_0: 96,
            NUMPAD_1: 97,
            NUMPAD_2: 98,
            NUMPAD_3: 99,
            NUMPAD_4: 100,
            NUMPAD_5: 101,
            NUMPAD_6: 102,
            NUMPAD_7: 103,
            NUMPAD_8: 104,
            NUMPAD_9: 105,
            MULTIPLY: 106,
            ADD: 107,
            SUBSTRACT: 109,
            DECIMAL: 110,
            DIVIDE: 111,
            F1: 112,
            F2: 113,
            F3: 114,
            F4: 115,
            F5: 116,
            F6: 117,
            F7: 118,
            F8: 119,
            F9: 120,
            F10: 121,
            F11: 122,
            F12: 123,
            SHIFT: 16,
            CTRL: 17,
            ALT: 18,
            PLUS: 187,
            COMMA: 188,
            MINUS: 189,
            PERIOD: 190
        },
        mouseButtons: {
            LEFT: 0,
            MIDDLE: 1,
            RIGHT: 2
        }
    });
    Crafty.c("viewport", {
        init: function () {
            this.bind("EnterFrame", function () {
                if (Crafty.viewport._x !== Crafty.viewport.x) {
                    Crafty.viewport.scroll("_x", Crafty.viewport.x)
                }
                if (Crafty.viewport._y !== Crafty.viewport.y) {
                    Crafty.viewport.scroll("_y", Crafty.viewport.y)
                }
            })
        }
    });
    Crafty.extend({
        device: {
            _deviceOrientationCallback: false,
            _deviceMotionCallback: false,
            _normalizeDeviceOrientation: function (eventData) {
                var data;
                if (window.DeviceOrientationEvent) {
                    data = {
                        tiltLR: eventData.gamma,
                        tiltFB: eventData.beta,
                        dir: eventData.alpha,
                        motUD: null
                    }
                } else {
                    if (window.OrientationEvent) {
                        data = {
                            tiltLR: eventData.x * 90,
                            tiltFB: eventData.y * -90,
                            dir: null,
                            motUD: eventData.z
                        }
                    }
                }
                Crafty.device._deviceOrientationCallback(data)
            },
            _normalizeDeviceMotion: function (eventData) {
                var acceleration = eventData.accelerationIncludingGravity, facingUp = (acceleration.z > 0) ? +1 : -1;
                var data = {
                    acceleration: acceleration,
                    rawAcceleration: "[" + Math.round(acceleration.x) + ", " + Math.round(acceleration.y) + ", " + Math.round(acceleration.z) + "]",
                    facingUp: facingUp,
                    tiltLR: Math.round(((acceleration.x) / 9.81) * -90),
                    tiltFB: Math.round(((acceleration.y + 9.81) / 9.81) * 90 * facingUp)
                };

                Crafty.device._deviceMotionCallback(data)
            },
            deviceOrientation: function (func) {
                this._deviceOrientationCallback = func;
                if (Crafty.support.deviceorientation) {
                    if (window.DeviceOrientationEvent) {
                        Crafty.addEvent(this, window, "deviceorientation", this._normalizeDeviceOrientation)
                    } else {
                        if (window.OrientationEvent) {
                            Crafty.addEvent(this, window, "MozOrientation", this._normalizeDeviceOrientation)
                        }
                    }
                }
            },
            deviceMotion: function (func) {
                this._deviceMotionCallback = func;
                if (Crafty.support.devicemotion) {
                    if (window.DeviceMotionEvent) {
                        Crafty.addEvent(this, window, "devicemotion", this._normalizeDeviceMotion)
                    }
                }
            }
        }
    });
    Crafty.c("Sprite", {
        __image: "",
        __tile: 0,
        __tileh: 0,
        __padding: null,
        __trim: null,
        img: null,
        ready: false,
        init: function () {
            this.__trim = [0, 0, 0, 0];
            var draw = function (e) {
                var co = e.co, pos = e.pos, context = e.ctx;
                if (e.type === "canvas") {
                    context.drawImage(this.img, co.x, co.y, co.w, co.h, pos._x, pos._y, pos._w, pos._h)
                } else {
                    if (e.type === "DOM") {
                        this._element.style.background = "url('" + this.__image + "') no-repeat -" + co.x + "px -" + co.y + "px"
                    }
                }
            };

            this.bind("Draw", draw).bind("RemoveComponent", function (id) {
                if (id === "Sprite") {
                    this.unbind("Draw", draw)
                }
            })
        },
        sprite: function (x, y, w, h) {
            this.__coord = [x * this.__tile + this.__padding[0] + this.__trim[0], y * this.__tileh + this.__padding[1] + this.__trim[1], this.__trim[2] || w * this.__tile || this.__tile, this.__trim[3] || h * this.__tileh || this.__tileh];
            this.trigger("Change");
            return this
        },
        crop: function (x, y, w, h) {
            var old = this._mbr || this.pos();
            this.__trim = [];
            this.__trim[0] = x;
            this.__trim[1] = y;
            this.__trim[2] = w;
            this.__trim[3] = h;
            this.__coord[0] += x;
            this.__coord[1] += y;
            this.__coord[2] = w;
            this.__coord[3] = h;
            this._w = w;
            this._h = h;
            this.trigger("Change", old);
            return this
        }
    });
    Crafty.c("Canvas", {
        init: function () {
            if (!Crafty.canvas.context) {
                Crafty.canvas.init()
            }
            Crafty.DrawManager.total2D++;
            this.bind("Change", function (e) {
                if (this._changed === false) {
                    this._changed = Crafty.DrawManager.add(e || this, this)
                } else {
                    if (e) {
                        this._changed = Crafty.DrawManager.add(e, this)
                    }
                }
            });
            this.bind("Remove", function () {
                Crafty.DrawManager.total2D--;
                Crafty.DrawManager.add(this, this)
            })
        },
        draw: function (ctx, x, y, w, h) {
            if (!this.ready) {
                return
            }
            if (arguments.length === 4) {
                h = w;
                w = y;
                y = x;
                x = ctx;
                ctx = Crafty.canvas.context
            }
            var pos = {
                _x: (this._x + (x || 0)),
                _y: (this._y + (y || 0)),
                _w: (w || this._w),
                _h: (h || this._h)
            }, context = ctx || Crafty.canvas.context, coord = this.__coord || [0, 0, 0, 0], co = {
                x: coord[0] + (x || 0),
                y: coord[1] + (y || 0),
                w: w || coord[2],
                h: h || coord[3]
            };

            if (this._mbr) {
                context.save();
                context.translate(this._origin.x + this._x, this._origin.y + this._y);
                pos._x = -this._origin.x;
                pos._y = -this._origin.y;
                context.rotate((this._rotation % 360) * (Math.PI / 180))
            }
            if (this._flipX || this._flipY) {
                context.save();
                context.scale((this._flipX ? -1 : 1), (this._flipY ? -1 : 1));
                if (this._flipX) {
                    pos._x = -(pos._x + pos._w)
                }
                if (this._flipY) {
                    pos._y = -(pos._y + pos._h)
                }
            }
            if (this._alpha < 1) {
                var globalpha = context.globalAlpha;
                context.globalAlpha = this._alpha
            }
            this.trigger("Draw", {
                type: "canvas",
                pos: pos,
                co: co,
                ctx: context
            });
            if (this._mbr || (this._flipX || this._flipY)) {
                context.restore()
            }
            if (globalpha) {
                context.globalAlpha = globalpha
            }
            return this
        }
    });
    Crafty.extend({
        canvas: {
            context: null,
            init: function () {
                if (!Crafty.support.canvas) {
                    Crafty.trigger("NoCanvas");
                    Crafty.stop();
                    return
                }
                var c;
                c = document.createElement("canvas");
                c.width = Crafty.viewport.width;
                c.height = Crafty.viewport.height;
                c.style.position = "absolute";
                c.style.left = "0px";
                c.style.top = "0px";
                Crafty.stage.elem.appendChild(c);
                Crafty.canvas.context = c.getContext("2d");
                Crafty.canvas._canvas = c
            }
        }
    });
    Crafty.extend({
        over: null,
        mouseObjs: 0,
        mousePos: {},
        lastEvent: null,
        keydown: {},
        selected: false,
        detectBlur: function (e) {
            var selected = ((e.clientX > Crafty.stage.x && e.clientX < Crafty.stage.x + Crafty.viewport.width) && (e.clientY > Crafty.stage.y && e.clientY < Crafty.stage.y + Crafty.viewport.height));
            if (!Crafty.selected && selected) {
                Crafty.trigger("CraftyFocus")
            }
            if (Crafty.selected && !selected) {
                Crafty.trigger("CraftyBlur")
            }
            Crafty.selected = selected
        },
        mouseDispatch: function (e) {
            if (!Crafty.mouseObjs) {
                return
            }
            Crafty.lastEvent = e;
            var maxz = -1, closest, q, i = 0, l, pos = Crafty.DOM.translate(e.clientX, e.clientY), x, y, dupes = {}, tar = e.target ? e.target : e.srcElement, type = e.type;
            if (e.which == null) {
                e.mouseButton = (e.button < 2) ? Crafty.mouseButtons.LEFT : ((e.button == 4) ? Crafty.mouseButtons.MIDDLE : Crafty.mouseButtons.RIGHT)
            } else {
                e.mouseButton = (e.which < 2) ? Crafty.mouseButtons.LEFT : ((e.which == 2) ? Crafty.mouseButtons.MIDDLE : Crafty.mouseButtons.RIGHT)
            }
            e.realX = x = Crafty.mousePos.x = pos.x;
            e.realY = y = Crafty.mousePos.y = pos.y;
            if (tar.nodeName != "CANVAS") {
                while (typeof (tar.id) != "string" && tar.id.indexOf("ent") == -1) {
                    tar = tar.parentNode
                }
                ent = Crafty(parseInt(tar.id.replace("ent", "")));
                if (ent.has("Mouse") && ent.isAt(x, y)) {
                    closest = ent
                }
            }
            if (!closest) {
                q = Crafty.map.search({
                    _x: x,
                    _y: y,
                    _w: 1,
                    _h: 1
                }, false);
                for (l = q.length; i < l; ++i) {
                    if (!q[i].__c.Mouse || !q[i]._visible) {
                        continue
                    }
                    var current = q[i], flag = false;
                    if (dupes[current[0]]) {
                        continue
                    } else {
                        dupes[current[0]] = true
                    }
                    if (current.mapArea) {
                        if (current.mapArea.containsPoint(x, y)) {
                            flag = true
                        }
                    } else {
                        if (current.isAt(x, y)) {
                            flag = true
                        }
                    }
                    if (flag && (current._z >= maxz || maxz === -1)) {
                        if (current._z === maxz && current[0] < closest[0]) {
                            continue
                        }
                        maxz = current._z;
                        closest = current
                    }
                }
            }
            if (closest) {
                if (type === "mousedown") {
                    closest.trigger("MouseDown", e)
                } else {
                    if (type === "mouseup") {
                        closest.trigger("MouseUp", e)
                    } else {
                        if (type == "dblclick") {
                            closest.trigger("DoubleClick", e)
                        } else {
                            if (type == "click") {
                                closest.trigger("Click", e)
                            } else {
                                if (type === "mousemove") {
                                    closest.trigger("MouseMove", e);
                                    if (this.over !== closest) {
                                        if (this.over) {
                                            this.over.trigger("MouseOut", e);
                                            this.over = null
                                        }
                                        this.over = closest;
                                        closest.trigger("MouseOver", e)
                                    }
                                } else {
                                    closest.trigger(type, e)
                                }
                            }
                        }
                    }
                }
            } else {
                if (type === "mousemove" && this.over) {
                    this.over.trigger("MouseOut", e);
                    this.over = null
                }
                if (type === "mousedown") {
                    Crafty.viewport.mouselook("start", e)
                } else {
                    if (type === "mousemove") {
                        Crafty.viewport.mouselook("drag", e)
                    } else {
                        if (type == "mouseup") {
                            Crafty.viewport.mouselook("stop")
                        }
                    }
                }
            }
            if (type === "mousemove") {
                this.lastEvent = e
            }
        },
        touchDispatch: function (e) {
            var type;
            if (e.type === "touchstart") {
                type = "mousedown"
            } else {
                if (e.type === "touchmove") {
                    type = "mousemove"
                } else {
                    if (e.type === "touchend") {
                        type = "mouseup"
                    } else {
                        if (e.type === "touchcancel") {
                            type = "mouseup"
                        } else {
                            if (e.type === "touchleave") {
                                type = "mouseup"
                            }
                        }
                    }
                }
            }
            if (e.touches && e.touches.length) {
                first = e.touches[0]
            } else {
                if (e.changedTouches && e.changedTouches.length) {
                    first = e.changedTouches[0]
                }
            }
            var simulatedEvent = document.createEvent("MouseEvent");
            simulatedEvent.initMouseEvent(type, true, true, window, 1, first.screenX, first.screenY, first.clientX, first.clientY, false, false, false, false, 0, e.relatedTarget);
            first.target.dispatchEvent(simulatedEvent)
        },
        keyboardDispatch: function (e) {
            e.key = e.keyCode || e.which;
            if (e.type === "keydown") {
                if (Crafty.keydown[e.key] !== true) {
                    Crafty.keydown[e.key] = true;
                    Crafty.trigger("KeyDown", e)
                }
            } else {
                if (e.type === "keyup") {
                    delete Crafty.keydown[e.key];
                    Crafty.trigger("KeyUp", e)
                }
            }
            if (Crafty.selected && !(e.key == 8 || e.key >= 112 && e.key <= 135)) {
                e.stopPropagation();
                if (e.preventDefault) {
                    e.preventDefault()
                } else {
                    e.returnValue = false
                }
                return false
            }
        }
    });
    Crafty.bind("Load", function () {
        Crafty.addEvent(this, "keydown", Crafty.keyboardDispatch);
        Crafty.addEvent(this, "keyup", Crafty.keyboardDispatch);
        Crafty.addEvent(this, Crafty.stage.elem, "mousedown", Crafty.mouseDispatch);
        Crafty.addEvent(this, Crafty.stage.elem, "mouseup", Crafty.mouseDispatch);
        Crafty.addEvent(this, document.body, "mouseup", Crafty.detectBlur);
        Crafty.addEvent(this, Crafty.stage.elem, "mousemove", Crafty.mouseDispatch);
        Crafty.addEvent(this, Crafty.stage.elem, "click", Crafty.mouseDispatch);
        Crafty.addEvent(this, Crafty.stage.elem, "dblclick", Crafty.mouseDispatch);
        Crafty.addEvent(this, Crafty.stage.elem, "touchstart", Crafty.touchDispatch);
        Crafty.addEvent(this, Crafty.stage.elem, "touchmove", Crafty.touchDispatch);
        Crafty.addEvent(this, Crafty.stage.elem, "touchend", Crafty.touchDispatch);
        Crafty.addEvent(this, Crafty.stage.elem, "touchcancel", Crafty.touchDispatch);
        Crafty.addEvent(this, Crafty.stage.elem, "touchleave", Crafty.touchDispatch)
    });
    Crafty.c("Mouse", {
        init: function () {
            Crafty.mouseObjs++;
            this.bind("Remove", function () {
                Crafty.mouseObjs--
            })
        },
        areaMap: function (poly) {
            if (arguments.length > 1) {
                var args = Array.prototype.slice.call(arguments, 0);
                poly = new Crafty.polygon(args)
            }
            poly.shift(this._x, this._y);
            this.mapArea = poly;
            this.attach(this.mapArea);
            return this
        }
    });
    Crafty.c("Draggable", {
        _origMouseDOMPos: null,
        _oldX: null,
        _oldY: null,
        _dragging: false,
        _dir: null,
        _ondrag: null,
        _ondown: null,
        _onup: null,
        init: function () {
            this.requires("Mouse");
            this._ondrag = function (e) {
                var pos = Crafty.DOM.translate(e.clientX, e.clientY);
                if (pos.x == 0 || pos.y == 0) {
                    return false
                }
                if (this._dir) {
                    var len = (pos.x - this._origMouseDOMPos.x) * this._dir.x + (pos.y - this._origMouseDOMPos.y) * this._dir.y;
                    this.x = this._oldX + len * this._dir.x;
                    this.y = this._oldY + len * this._dir.y
                } else {
                    this.x = this._oldX + (pos.x - this._origMouseDOMPos.x);
                    this.y = this._oldY + (pos.y - this._origMouseDOMPos.y)
                }
                this.trigger("Dragging", e)
            };

            this._ondown = function (e) {
                if (e.mouseButton !== Crafty.mouseButtons.LEFT) {
                    return
                }
                this._origMouseDOMPos = Crafty.DOM.translate(e.clientX, e.clientY);
                this._oldX = this._x;
                this._oldY = this._y;
                this._dragging = true;
                Crafty.addEvent(this, Crafty.stage.elem, "mousemove", this._ondrag);
                Crafty.addEvent(this, Crafty.stage.elem, "mouseup", this._onup);
                this.trigger("StartDrag", e)
            };

            this._onup = function upper(e) {
                if (this._dragging == true) {
                    Crafty.removeEvent(this, Crafty.stage.elem, "mousemove", this._ondrag);
                    Crafty.removeEvent(this, Crafty.stage.elem, "mouseup", this._onup);
                    this._dragging = false;
                    this.trigger("StopDrag", e)
                }
            };

            this.enableDrag()
        },
        dragDirection: function (dir) {
            if (typeof dir === "undefined") {
                this._dir = null
            } else {
                if (("" + parseInt(dir)) == dir) {
                    this._dir = {
                        x: Math.cos(dir / 180 * Math.PI),
                        y: Math.sin(dir / 180 * Math.PI)
                    }
                } else {
                    var r = Math.sqrt(dir.x * dir.x + dir.y * dir.y);
                    this._dir = {
                        x: dir.x / r,
                        y: dir.y / r
                    }
                }
            }
        },
        stopDrag: function () {
            Crafty.removeEvent(this, Crafty.stage.elem, "mousemove", this._ondrag);
            Crafty.removeEvent(this, Crafty.stage.elem, "mouseup", this._onup);
            this._dragging = false;
            this.trigger("StopDrag");
            return this
        },
        startDrag: function () {
            if (!this._dragging) {
                this._dragging = true;
                Crafty.addEvent(this, Crafty.stage.elem, "mousemove", this._ondrag)
            }
            return this
        },
        enableDrag: function () {
            this.bind("MouseDown", this._ondown);
            Crafty.addEvent(this, Crafty.stage.elem, "mouseup", this._onup);
            return this
        },
        disableDrag: function () {
            this.unbind("MouseDown", this._ondown);
            this.stopDrag();
            return this
        }
    });
    Crafty.c("Keyboard", {
        isDown: function (key) {
            if (typeof key === "string") {
                key = Crafty.keys[key]
            }
            return !!Crafty.keydown[key]
        }
    });
    Crafty.c("Multiway", {
        _speed: 3,
        _keydown: function (e) {
            if (this._keys[e.key]) {
                this._movement.x = Math.round((this._movement.x + this._keys[e.key].x) * 1000) / 1000;
                this._movement.y = Math.round((this._movement.y + this._keys[e.key].y) * 1000) / 1000;
                this.trigger("NewDirection", this._movement)
            }
        },
        _keyup: function (e) {
            if (this._keys[e.key]) {
                this._movement.x = Math.round((this._movement.x - this._keys[e.key].x) * 1000) / 1000;
                this._movement.y = Math.round((this._movement.y - this._keys[e.key].y) * 1000) / 1000;
                this.trigger("NewDirection", this._movement)
            }
        },
        _enterframe: function () {
            if (this.disableControls) {
                return
            }
            if (this._movement.x !== 0) {
                this.x += this._movement.x;
                this.trigger("Moved", {
                    x: this.x - this._movement.x,
                    y: this.y
                })
            }
            if (this._movement.y !== 0) {
                this.y += this._movement.y;
                this.trigger("Moved", {
                    x: this.x,
                    y: this.y - this._movement.y
                })
            }
        },
        init: function () {
            this._keyDirection = {};

            this._keys = {};

            this._movement = {
                x: 0,
                y: 0
            };

            this._speed = {
                x: 3,
                y: 3
            }
        },
        multiway: function (speed, keys) {
            if (keys) {
                if (speed.x && speed.y) {
                    this._speed.x = speed.x;
                    this._speed.y = speed.y
                } else {
                    this._speed.x = speed;
                    this._speed.y = speed
                }
            } else {
                keys = speed
            }
            this._keyDirection = keys;
            this.speed(this._speed);
            this.enableControl();
            for (var k in keys) {
                if (Crafty.keydown[Crafty.keys[k]]) {
                    this.trigger("KeyDown", {
                        key: Crafty.keys[k]
                    })
                }
            }
            return this
        },
        enableControl: function () {
            this.bind("KeyDown", this._keydown).bind("KeyUp", this._keyup).bind("EnterFrame", this._enterframe);
            return this
        },
        disableControl: function () {
            this.unbind("KeyDown", this._keydown).unbind("KeyUp", this._keyup).unbind("EnterFrame", this._enterframe);
            return this
        },
        speed: function (speed) {
            for (var k in this._keyDirection) {
                var keyCode = Crafty.keys[k] || k;
                this._keys[keyCode] = {
                    x: Math.round(Math.cos(this._keyDirection[k] * (Math.PI / 180)) * 1000 * speed.x) / 1000,
                    y: Math.round(Math.sin(this._keyDirection[k] * (Math.PI / 180)) * 1000 * speed.y) / 1000
                }
            }
            return this
        }
    });
    Crafty.c("Fourway", {
        init: function () {
            this.requires("Multiway")
        },
        fourway: function (speed) {
            this.multiway(speed, {
                UP_ARROW: -90,
                DOWN_ARROW: 90,
                RIGHT_ARROW: 0,
                LEFT_ARROW: 180,
                W: -90,
                S: 90,
                D: 0,
                A: 180,
                Z: -90,
                Q: 180
            });
            return this
        }
    });
    Crafty.c("Twoway", {
        _speed: 3,
        _up: false,
        init: function () {
            this.requires("Fourway, Keyboard")
        },
        twoway: function (speed, jump) {
            this.multiway(speed, {
                RIGHT_ARROW: 0,
                LEFT_ARROW: 180,
                D: 0,
                A: 180,
                Q: 180
            });
            if (speed) {
                this._speed = speed
            }
            jump = jump || this._speed * 2;
            this.bind("EnterFrame", function () {
                if (this.disableControls) {
                    return
                }
                if (this._up) {
                    this.y -= jump;
                    this._falling = true
                }
            }).bind("KeyDown", function () {
                if (this.isDown("UP_ARROW") || this.isDown("W") || this.isDown("Z")) {
                    this._up = true
                }
            });
            return this
        }
    });
    Crafty.c("SpriteAnimation", {
        _reels: null,
        _frame: null,
        _currentReelId: null,
        init: function () {
            this._reels = {}
        },
        animate: function (reelId, fromx, y, tox) {
            var reel, i, tile, tileh, duration, pos;
            if (arguments.length < 4 && typeof fromx === "number") {
                duration = fromx;
                this._currentReelId = reelId;
                currentReel = this._reels[reelId];
                this._frame = {
                    currentReel: currentReel,
                    numberOfFramesBetweenSlides: Math.ceil(duration / currentReel.length),
                    currentSlideNumber: 0,
                    frameNumberBetweenSlides: 0,
                    repeat: 0
                };

                if (arguments.length === 3 && typeof y === "number") {
                    if (y === -1) {
                        this._frame.repeatInfinitly = true
                    } else {
                        this._frame.repeat = y
                    }
                }
                pos = this._frame.currentReel[0];
                this.__coord[0] = pos[0];
                this.__coord[1] = pos[1];
                this.bind("EnterFrame", this.updateSprite);
                return this
            }
            if (typeof fromx === "number") {
                tile = this.__tile + parseInt(this.__padding[0] || 0, 10);
                tileh = this.__tileh + parseInt(this.__padding[1] || 0, 10);
                reel = [];
                i = fromx;
                if (tox > fromx) {
                    for (; i <= tox; i++) {
                        reel.push([i * tile, y * tileh])
                    }
                } else {
                    for (; i >= tox; i--) {
                        reel.push([i * tile, y * tileh])
                    }
                }
                this._reels[reelId] = reel
            } else {
                if (typeof fromx === "object") {
                    i = 0;
                    reel = [];
                    tox = fromx.length - 1;
                    tile = this.__tile + parseInt(this.__padding[0] || 0, 10);
                    tileh = this.__tileh + parseInt(this.__padding[1] || 0, 10);
                    for (; i <= tox; i++) {
                        pos = fromx[i];
                        reel.push([pos[0] * tile, pos[1] * tileh])
                    }
                    this._reels[reelId] = reel
                }
            }
            return this
        },
        updateSprite: function () {
            var data = this._frame;
            if (!data) {
                return
            }
            if (this._frame.frameNumberBetweenSlides++ === data.numberOfFramesBetweenSlides) {
                var pos = data.currentReel[data.currentSlideNumber++];
                this.__coord[0] = pos[0];
                this.__coord[1] = pos[1];
                this._frame.frameNumberBetweenSlides = 0
            }
            if (data.currentSlideNumber === data.currentReel.length) {
                if (this._frame.repeatInfinitly === true || this._frame.repeat > 0) {
                    if (this._frame.repeat) {
                        this._frame.repeat--
                    }
                    this._frame.frameNumberBetweenSlides = 0;
                    this._frame.currentSlideNumber = 0
                } else {
                    if (this._frame.frameNumberBetweenSlides === data.numberOfFramesBetweenSlides) {
                        this.trigger("AnimationEnd", {
                            reel: data.currentReel
                        });
                        this.stop();
                        return
                    }
                }
            }
            this.trigger("Change")
        },
        stop: function () {
            this.unbind("EnterFrame", this.updateSprite);
            this.unbind("AnimationEnd");
            this._currentReelId = null;
            this._frame = null;
            return this
        },
        reset: function () {
            if (!this._frame) {
                return this
            }
            var co = this._frame.currentReel[0];
            this.__coord[0] = co[0];
            this.__coord[1] = co[1];
            this.stop();
            return this
        },
        isPlaying: function (reelId) {
            if (!reelId) {
                return !!this._interval
            }
            return this._currentReelId === reelId
        }
    });
    Crafty.c("Tween", {
        _step: null,
        _numProps: 0,
        tween: function (props, duration) {
            this.each(function () {
                if (this._step == null) {
                    this._step = {};

                    this.bind("EnterFrame", tweenEnterFrame);
                    this.bind("RemoveComponent", function (c) {
                        if (c == "Tween") {
                            this.unbind("EnterFrame", tweenEnterFrame)
                        }
                    })
                }
                for (var prop in props) {
                    this._step[prop] = {
                        prop: props[prop],
                        val: (props[prop] - this[prop]) / duration,
                        rem: duration
                    };

                    this._numProps++
                }
            });
            return this
        }
    });
    function tweenEnterFrame(e) {
        if (this._numProps <= 0) {
            return
        }
        var prop, k;
        for (k in this._step) {
            prop = this._step[k];
            this[k] += prop.val;
            if (--prop.rem == 0) {
                this[k] = prop.prop;
                this.trigger("TweenEnd", k);
                if (this._step[k].rem <= 0) {
                    delete this._step[k]
                }
                this._numProps--
            }
        }
        if (this.has("Mouse")) {
            var over = Crafty.over, mouse = Crafty.mousePos;
            if (over && over[0] == this[0] && !this.isAt(mouse.x, mouse.y)) {
                this.trigger("MouseOut", Crafty.lastEvent);
                Crafty.over = null
            } else {
                if ((!over || over[0] != this[0]) && this.isAt(mouse.x, mouse.y)) {
                    Crafty.over = this;
                    this.trigger("MouseOver", Crafty.lastEvent)
                }
            }
        }
    }
    Crafty.c("Color", {
        _color: "",
        ready: true,
        init: function () {
            this.bind("Draw", function (e) {
                if (e.type === "DOM") {
                    e.style.background = this._color;
                    e.style.lineHeight = 0
                } else {
                    if (e.type === "canvas") {
                        if (this._color) {
                            e.ctx.fillStyle = this._color
                        }
                        e.ctx.fillRect(e.pos._x, e.pos._y, e.pos._w, e.pos._h)
                    }
                }
            })
        },
        color: function (color) {
            if (!color) {
                return this._color
            }
            this._color = color;
            this.trigger("Change");
            return this
        }
    });
    Crafty.c("Tint", {
        _color: null,
        _strength: 1,
        init: function () {
            var draw = function d(e) {
                var context = e.ctx || Crafty.canvas.context;
                context.fillStyle = this._color || "rgb(0,0,0)";
                context.fillRect(e.pos._x, e.pos._y, e.pos._w, e.pos._h)
            };

            this.bind("Draw", draw).bind("RemoveComponent", function (id) {
                if (id === "Tint") {
                    this.unbind("Draw", draw)
                }
            })
        },
        tint: function (color, strength) {
            this._strength = strength;
            this._color = Crafty.toRGB(color, this._strength);
            this.trigger("Change");
            return this
        }
    });
    Crafty.c("Image", {
        _repeat: "repeat",
        ready: false,
        init: function () {
            var draw = function (e) {
                if (e.type === "canvas") {
                    if (!this.ready || !this._pattern) {
                        return
                    }
                    var context = e.ctx;
                    context.fillStyle = this._pattern;
                    context.save();
                    context.translate(e.pos._x, e.pos._y);
                    context.fillRect(0, 0, this._w, this._h);
                    context.restore()
                } else {
                    if (e.type === "DOM") {
                        if (this.__image) {
                            e.style.background = "url(" + this.__image + ") " + this._repeat
                        }
                    }
                }
            };

            this.bind("Draw", draw).bind("RemoveComponent", function (id) {
                if (id === "Image") {
                    this.unbind("Draw", draw)
                }
            })
        },
        image: function (url, repeat) {
            this.__image = url;
            this._repeat = repeat || "no-repeat";
            this.img = Crafty.asset(url);
            if (!this.img) {
                this.img = new Image();
                Crafty.asset(url, this.img);
                this.img.src = url;
                var self = this;
                this.img.onload = function () {
                    if (self.has("Canvas")) {
                        self._pattern = Crafty.canvas.context.createPattern(self.img, self._repeat)
                    }
                    self.ready = true;
                    if (self._repeat === "no-repeat") {
                        self.w = self.img.width;
                        self.h = self.img.height
                    }
                    self.trigger("Change")
                };

                return this
            } else {
                this.ready = true;
                if (this.has("Canvas")) {
                    this._pattern = Crafty.canvas.context.createPattern(this.img, this._repeat)
                }
                if (this._repeat === "no-repeat") {
                    this.w = this.img.width;
                    this.h = this.img.height
                }
            }
            this.trigger("Change");
            return this
        }
    });
    Crafty.extend({
        _scenes: [],
        _current: null,
        scene: function (name, intro, outro) {
            if (arguments.length === 1) {
                Crafty("2D").each(function () {
                    if (!this.has("Persist")) {
                        this.destroy()
                    }
                });
                if (this._current !== null && "uninitialize" in this._scenes[this._current]) {
                    this._scenes[this._current].uninitialize.call(this)
                }
                this._scenes[name].initialize.call(this);
                var oldScene = this._current;
                this._current = name;
                Crafty.trigger("SceneChange", {
                    oldScene: oldScene,
                    newScene: name
                });
                return
            }
            this._scenes[name] = {};

            this._scenes[name].initialize = intro;
            if (typeof outro !== "undefined") {
                this._scenes[name].uninitialize = outro
            }
            return
        },
        toRGB: function (hex, alpha) {
            var hex = (hex.charAt(0) === "#") ? hex.substr(1) : hex, c = [], result;
            c[0] = parseInt(hex.substr(0, 2), 16);
            c[1] = parseInt(hex.substr(2, 2), 16);
            c[2] = parseInt(hex.substr(4, 2), 16);
            result = alpha === undefined ? "rgb(" + c.join(",") + ")" : "rgba(" + c.join(",") + "," + alpha + ")";
            return result
        }
    });
    Crafty.DrawManager = (function () {
        var dirty_rects = [], dom = [];
        return {
            total2D: Crafty("2D").length,
            onScreen: function (rect) {
                return Crafty.viewport._x + rect._x + rect._w > 0 && Crafty.viewport._y + rect._y + rect._h > 0 && Crafty.viewport._x + rect._x < Crafty.viewport.width && Crafty.viewport._y + rect._y < Crafty.viewport.height
            },
            merge: function (set) {
                do {
                    var newset = [], didMerge = false, i = 0, l = set.length, current, next, merger;
                    while (i < l) {
                        current = set[i];
                        next = set[i + 1];
                        if (i < l - 1 && current._x < next._x + next._w && current._x + current._w > next._x && current._y < next._y + next._h && current._h + current._y > next._y) {
                            merger = {
                                _x: ~ ~Math.min(current._x, next._x),
                                _y: ~ ~Math.min(current._y, next._y),
                                _w: Math.max(current._x, next._x) + Math.max(current._w, next._w),
                                _h: Math.max(current._y, next._y) + Math.max(current._h, next._h)
                            };

                            merger._w = merger._w - merger._x;
                            merger._h = merger._h - merger._y;
                            merger._w = (merger._w == ~ ~merger._w) ? merger._w : merger._w + 1 | 0;
                            merger._h = (merger._h == ~ ~merger._h) ? merger._h : merger._h + 1 | 0;
                            newset.push(merger);
                            i++;
                            didMerge = true
                        } else {
                            newset.push(current)
                        }
                        i++
                    }
                    set = newset.length ? Crafty.clone(newset) : set;
                    if (didMerge) {
                        i = 0
                    }
                } while (didMerge);
                return set
            },
            add: function add(old, current) {
                if (!current) {
                    dom.push(old);
                    return
                }
                var rect, before = old._mbr || old, after = current._mbr || current;
                if (old === current) {
                    rect = old.mbr() || old.pos()
                } else {
                    rect = {
                        _x: ~ ~Math.min(before._x, after._x),
                        _y: ~ ~Math.min(before._y, after._y),
                        _w: Math.max(before._w, after._w) + Math.max(before._x, after._x),
                        _h: Math.max(before._h, after._h) + Math.max(before._y, after._y)
                    };

                    rect._w = (rect._w - rect._x);
                    rect._h = (rect._h - rect._y)
                }
                if (rect._w === 0 || rect._h === 0 || !this.onScreen(rect)) {
                    return false
                }
                rect._x = ~ ~rect._x;
                rect._y = ~ ~rect._y;
                rect._w = (rect._w === ~ ~rect._w) ? rect._w : rect._w + 1 | 0;
                rect._h = (rect._h === ~ ~rect._h) ? rect._h : rect._h + 1 | 0;
                dirty_rects.push(rect);
                return true
            },
            debug: function () {
                console.log(dirty_rects, dom)
            },
            drawAll: function (rect) {
                var rect = rect || Crafty.viewport.rect(), q = Crafty.map.search(rect), i = 0, l = q.length, ctx = Crafty.canvas.context, current;
                ctx.clearRect(rect._x, rect._y, rect._w, rect._h);
                q.sort(function (a, b) {
                    return a._globalZ - b._globalZ
                });
                for (; i < l; i++) {
                    current = q[i];
                    if (current._visible && current.__c.Canvas) {
                        current.draw();
                        current._changed = false
                    }
                }
            },
            boundingRect: function (set) {
                if (!set || !set.length) {
                    return
                }
                var newset = [], i = 1, l = set.length, current, master = set[0], tmp;
                master = [master._x, master._y, master._x + master._w, master._y + master._h];
                while (i < l) {
                    current = set[i];
                    tmp = [current._x, current._y, current._x + current._w, current._y + current._h];
                    if (tmp[0] < master[0]) {
                        master[0] = tmp[0]
                    }
                    if (tmp[1] < master[1]) {
                        master[1] = tmp[1]
                    }
                    if (tmp[2] > master[2]) {
                        master[2] = tmp[2]
                    }
                    if (tmp[3] > master[3]) {
                        master[3] = tmp[3]
                    }
                    i++
                }
                tmp = master;
                master = {
                    _x: tmp[0],
                    _y: tmp[1],
                    _w: tmp[2] - tmp[0],
                    _h: tmp[3] - tmp[1]
                };

                return master
            },
            draw: function draw() {
                if (!dirty_rects.length && !dom.length) {
                    return
                }
                var i = 0, l = dirty_rects.length, k = dom.length, rect, q, j, len, dupes, obj, ent, objs = [], ctx = Crafty.canvas.context;
                for (; i < k; ++i) {
                    dom[i].draw()._changed = false
                }
                dom.length = 0;
                if (!l) {
                    return
                }
                if (l / this.total2D > 0.6) {
                    this.drawAll();
                    dirty_rects.length = 0;
                    return
                }
                dirty_rects = this.merge(dirty_rects);
                for (i = 0; i < l; ++i) {
                    rect = dirty_rects[i];
                    if (!rect) {
                        continue
                    }
                    q = Crafty.map.search(rect, false);
                    dupes = {};

                    for (j = 0, len = q.length; j < len; ++j) {
                        obj = q[j];
                        if (dupes[obj[0]] || !obj._visible || !obj.__c.Canvas) {
                            continue
                        }
                        dupes[obj[0]] = true;
                        objs.push({
                            obj: obj,
                            rect: rect
                        })
                    }
                    ctx.clearRect(rect._x, rect._y, rect._w, rect._h)
                }
                objs.sort(function (a, b) {
                    return a.obj._globalZ - b.obj._globalZ
                });
                if (!objs.length) {
                    return
                }
                for (i = 0, l = objs.length; i < l; ++i) {
                    obj = objs[i];
                    rect = obj.rect;
                    ent = obj.obj;
                    var area = ent._mbr || ent, x = (rect._x - area._x <= 0) ? 0 : ~ ~(rect._x - area._x), y = (rect._y - area._y < 0) ? 0 : ~ ~(rect._y - area._y), w = ~ ~Math.min(area._w - x, rect._w - (area._x - rect._x), rect._w, area._w), h = ~ ~Math.min(area._h - y, rect._h - (area._y - rect._y), rect._h, area._h);
                    if (h === 0 || w === 0) {
                        continue
                    }
                    ctx.save();
                    ctx.beginPath();
                    ctx.moveTo(rect._x, rect._y);
                    ctx.lineTo(rect._x + rect._w, rect._y);
                    ctx.lineTo(rect._x + rect._w, rect._h + rect._y);
                    ctx.lineTo(rect._x, rect._h + rect._y);
                    ctx.lineTo(rect._x, rect._y);
                    ctx.clip();
                    ent.draw();
                    ctx.closePath();
                    ctx.restore();
                    ent._changed = false
                }
                dirty_rects.length = 0;
                merged = {}
            }
        }
    })();
    Crafty.extend({
        isometric: {
            _tile: {
                width: 0,
                height: 0
            },
            _elements: {},
            _pos: {
                x: 0,
                y: 0
            },
            _z: 0,
            size: function (width, height) {
                this._tile.width = width;
                this._tile.height = height > 0 ? height : width / 2;
                return this
            },
            place: function (x, y, z, obj) {
                var pos = this.pos2px(x, y);
                pos.top -= z * (this._tile.width / 2);
                obj.attr({
                    x: pos.left + Crafty.viewport._x,
                    y: pos.top + Crafty.viewport._y
                }).z += z;
                return this
            },
            pos2px: function (x, y) {
                return {
                    left: x * this._tile.width + (y & 1) * (this._tile.width / 2),
                    top: y * this._tile.height / 2
                }
            },
            px2pos: function (left, top) {
                return {
                    x: Math.ceil(-left / this._tile.width - (top & 1) * 0.5),
                    y: -top / this._tile.height * 2
                }
            },
            centerAt: function (x, y) {
                if (typeof x == "number" && typeof y == "number") {
                    var center = this.pos2px(x, y);
                    Crafty.viewport._x = -center.left + Crafty.viewport.width / 2 - this._tile.width / 2;
                    Crafty.viewport._y = -center.top + Crafty.viewport.height / 2 - this._tile.height / 2;
                    return this
                } else {
                    return {
                        top: -Crafty.viewport._y + Crafty.viewport.height / 2 - this._tile.height / 2,
                        left: -Crafty.viewport._x + Crafty.viewport.width / 2 - this._tile.width / 2
                    }
                }
            },
            area: function () {
                var center = this.centerAt();
                var start = this.px2pos(-center.left + Crafty.viewport.width / 2, -center.top + Crafty.viewport.height / 2);
                var end = this.px2pos(-center.left - Crafty.viewport.width / 2, -center.top - Crafty.viewport.height / 2);
                return {
                    x: {
                        start: start.x,
                        end: end.x
                    },
                    y: {
                        start: start.y,
                        end: end.y
                    }
                }
            }
        }
    });
    Crafty.c("Particles", {
        init: function () {
            this._Particles = Crafty.clone(this._Particles)
        },
        particles: function (options) {
            if (!Crafty.support.canvas || Crafty.deactivateParticles) {
                return this
            }
            var c, ctx, relativeX, relativeY, bounding;
            c = document.createElement("canvas");
            c.width = Crafty.viewport.width;
            c.height = Crafty.viewport.height;
            c.style.position = "absolute";
            Crafty.stage.elem.appendChild(c);
            ctx = c.getContext("2d");
            this._Particles.init(options);
            this.bind("Remove", function () {
                Crafty.stage.elem.removeChild(c)
            }).bind("RemoveComponent", function (id) {
                if (id === "particles") {
                    Crafty.stage.elem.removeChild(c)
                }
            });
            relativeX = this.x + Crafty.viewport.x;
            relativeY = this.y + Crafty.viewport.y;
            this._Particles.position = this._Particles.vectorHelpers.create(relativeX, relativeY);
            var oldViewport = {
                x: Crafty.viewport.x,
                y: Crafty.viewport.y
            };

            this.bind("EnterFrame", function () {
                relativeX = this.x + Crafty.viewport.x;
                relativeY = this.y + Crafty.viewport.y;
                this._Particles.viewportDelta = {
                    x: Crafty.viewport.x - oldViewport.x,
                    y: Crafty.viewport.y - oldViewport.y
                };

                oldViewport = {
                    x: Crafty.viewport.x,
                    y: Crafty.viewport.y
                };

                this._Particles.position = this._Particles.vectorHelpers.create(relativeX, relativeY);
                if (typeof Crafty.DrawManager.boundingRect == "function") {
                    bounding = Crafty.DrawManager.boundingRect(this._Particles.register);
                    if (bounding) {
                        ctx.clearRect(bounding._x, bounding._y, bounding._w, bounding._h)
                    }
                } else {
                    ctx.clearRect(0, 0, Crafty.viewport.width, Crafty.viewport.height)
                }
                this._Particles.update();
                this._Particles.render(ctx)
            });
            return this
        },
        _Particles: {
            presets: {
                maxParticles: 150,
                size: 18,
                sizeRandom: 4,
                speed: 1,
                speedRandom: 1.2,
                lifeSpan: 29,
                lifeSpanRandom: 7,
                angle: 65,
                angleRandom: 34,
                startColour: [255, 131, 0, 1],
                startColourRandom: [48, 50, 45, 0],
                endColour: [245, 35, 0, 0],
                endColourRandom: [60, 60, 60, 0],
                sharpness: 20,
                sharpnessRandom: 10,
                spread: 10,
                duration: -1,
                fastMode: false,
                gravity: {
                    x: 0,
                    y: 0.1
                },
                jitter: 0,
                particles: [],
                active: true,
                particleCount: 0,
                elapsedFrames: 0,
                emissionRate: 0,
                emitCounter: 0,
                particleIndex: 0
            },
            init: function (options) {
                this.position = this.vectorHelpers.create(0, 0);
                if (typeof options == "undefined") {
                    var options = {}
                }
                for (key in this.presets) {
                    if (typeof options[key] != "undefined") {
                        this[key] = options[key]
                    } else {
                        this[key] = this.presets[key]
                    }
                }
                this.emissionRate = this.maxParticles / this.lifeSpan;
                this.positionRandom = this.vectorHelpers.create(this.spread, this.spread)
            },
            addParticle: function () {
                if (this.particleCount == this.maxParticles) {
                    return false
                }
                var particle = new this.particle(this.vectorHelpers);
                this.initParticle(particle);
                this.particles[this.particleCount] = particle;
                this.particleCount++;
                return true
            },
            RANDM1TO1: function () {
                return Math.random() * 2 - 1
            },
            initParticle: function (particle) {
                particle.position.x = this.position.x + this.positionRandom.x * this.RANDM1TO1();
                particle.position.y = this.position.y + this.positionRandom.y * this.RANDM1TO1();
                var newAngle = (this.angle + this.angleRandom * this.RANDM1TO1()) * (Math.PI / 180);
                var vector = this.vectorHelpers.create(Math.sin(newAngle), -Math.cos(newAngle));
                var vectorSpeed = this.speed + this.speedRandom * this.RANDM1TO1();
                particle.direction = this.vectorHelpers.multiply(vector, vectorSpeed);
                particle.size = this.size + this.sizeRandom * this.RANDM1TO1();
                particle.size = particle.size < 0 ? 0 : ~ ~particle.size;
                particle.timeToLive = this.lifeSpan + this.lifeSpanRandom * this.RANDM1TO1();
                particle.sharpness = this.sharpness + this.sharpnessRandom * this.RANDM1TO1();
                particle.sharpness = particle.sharpness > 100 ? 100 : particle.sharpness < 0 ? 0 : particle.sharpness;
                particle.sizeSmall = ~ ~((particle.size / 200) * particle.sharpness);
                var start = [this.startColour[0] + this.startColourRandom[0] * this.RANDM1TO1(), this.startColour[1] + this.startColourRandom[1] * this.RANDM1TO1(), this.startColour[2] + this.startColourRandom[2] * this.RANDM1TO1(), this.startColour[3] + this.startColourRandom[3] * this.RANDM1TO1()];
                var end = [this.endColour[0] + this.endColourRandom[0] * this.RANDM1TO1(), this.endColour[1] + this.endColourRandom[1] * this.RANDM1TO1(), this.endColour[2] + this.endColourRandom[2] * this.RANDM1TO1(), this.endColour[3] + this.endColourRandom[3] * this.RANDM1TO1()];
                particle.colour = start;
                particle.deltaColour[0] = (end[0] - start[0]) / particle.timeToLive;
                particle.deltaColour[1] = (end[1] - start[1]) / particle.timeToLive;
                particle.deltaColour[2] = (end[2] - start[2]) / particle.timeToLive;
                particle.deltaColour[3] = (end[3] - start[3]) / particle.timeToLive
            },
            update: function () {
                if (this.active && this.emissionRate > 0) {
                    var rate = 1 / this.emissionRate;
                    this.emitCounter++;
                    while (this.particleCount < this.maxParticles && this.emitCounter > rate) {
                        this.addParticle();
                        this.emitCounter -= rate
                    }
                    this.elapsedFrames++;
                    if (this.duration != -1 && this.duration < this.elapsedFrames) {
                        this.stop()
                    }
                }
                this.particleIndex = 0;
                this.register = [];
                var draw;
                while (this.particleIndex < this.particleCount) {
                    var currentParticle = this.particles[this.particleIndex];
                    if (currentParticle.timeToLive > 0) {
                        currentParticle.direction = this.vectorHelpers.add(currentParticle.direction, this.gravity);
                        currentParticle.position = this.vectorHelpers.add(currentParticle.position, currentParticle.direction);
                        currentParticle.position = this.vectorHelpers.add(currentParticle.position, this.viewportDelta);
                        if (this.jitter) {
                            currentParticle.position.x += this.jitter * this.RANDM1TO1();
                            currentParticle.position.y += this.jitter * this.RANDM1TO1()
                        }
                        currentParticle.timeToLive--;
                        var r = currentParticle.colour[0] += currentParticle.deltaColour[0];
                        var g = currentParticle.colour[1] += currentParticle.deltaColour[1];
                        var b = currentParticle.colour[2] += currentParticle.deltaColour[2];
                        var a = currentParticle.colour[3] += currentParticle.deltaColour[3];
                        draw = [];
                        draw.push("rgba(" + (r > 255 ? 255 : r < 0 ? 0 : ~ ~r));
                        draw.push(g > 255 ? 255 : g < 0 ? 0 : ~ ~g);
                        draw.push(b > 255 ? 255 : b < 0 ? 0 : ~ ~b);
                        draw.push((a > 1 ? 1 : a < 0 ? 0 : a.toFixed(2)) + ")");
                        currentParticle.drawColour = draw.join(",");
                        if (!this.fastMode) {
                            draw[3] = "0)";
                            currentParticle.drawColourEnd = draw.join(",")
                        }
                        this.particleIndex++
                    } else {
                        if (this.particleIndex != this.particleCount - 1) {
                            this.particles[this.particleIndex] = this.particles[this.particleCount - 1]
                        }
                        this.particleCount--
                    }
                    var rect = {};

                    rect._x = ~ ~currentParticle.position.x;
                    rect._y = ~ ~currentParticle.position.y;
                    rect._w = currentParticle.size;
                    rect._h = currentParticle.size;
                    this.register.push(rect)
                }
            },
            stop: function () {
                this.active = false;
                this.elapsedFrames = 0;
                this.emitCounter = 0
            },
            render: function (context) {
                for (var i = 0, j = this.particleCount; i < j; i++) {
                    var particle = this.particles[i];
                    var size = particle.size;
                    var halfSize = size >> 1;
                    if (particle.position.x + size < 0 || particle.position.y + size < 0 || particle.position.x - size > Crafty.viewport.width || particle.position.y - size > Crafty.viewport.height) {
                        continue
                    }
                    var x = ~ ~particle.position.x;
                    var y = ~ ~particle.position.y;
                    if (this.fastMode) {
                        context.fillStyle = particle.drawColour
                    } else {
                        var radgrad = context.createRadialGradient(x + halfSize, y + halfSize, particle.sizeSmall, x + halfSize, y + halfSize, halfSize);
                        radgrad.addColorStop(0, particle.drawColour);
                        radgrad.addColorStop(0.9, particle.drawColourEnd);
                        context.fillStyle = radgrad
                    }
                    context.fillRect(x, y, size, size)
                }
            },
            particle: function (vectorHelpers) {
                this.position = vectorHelpers.create(0, 0);
                this.direction = vectorHelpers.create(0, 0);
                this.size = 0;
                this.sizeSmall = 0;
                this.timeToLive = 0;
                this.colour = [];
                this.drawColour = "";
                this.deltaColour = [];
                this.sharpness = 0
            },
            vectorHelpers: {
                create: function (x, y) {
                    return {
                        x: x,
                        y: y
                    }
                },
                multiply: function (vector, scaleFactor) {
                    vector.x *= scaleFactor;
                    vector.y *= scaleFactor;
                    return vector
                },
                add: function (vector1, vector2) {
                    vector1.x += vector2.x;
                    vector1.y += vector2.y;
                    return vector1
                }
            }
        }
    });
    Crafty.extend({
        audio: {
            sounds: {},
            supported: {},
            codecs: {
                ogg: 'audio/ogg; codecs="vorbis"',
                wav: 'audio/wav; codecs="1"',
                webma: 'audio/webm; codecs="vorbis"',
                mp3: 'audio/mpeg; codecs="mp3"',
                m4a: 'audio/mp4; codecs="mp4a.40.2"'
            },
            volume: 1,
            muted: false,
            canPlay: function () {
                var audio = this.audioElement(), canplay;
                for (var i in this.codecs) {
                    canplay = audio.canPlayType(this.codecs[i]);
                    if (canplay !== "" && canplay !== "no") {
                        this.supported[i] = true
                    } else {
                        this.supported[i] = false
                    }
                }
            },
            audioElement: function () {
                return typeof Audio !== "undefined" ? new Audio("") : document.createElement("audio")
            },
            add: function (id, url) {
                Crafty.support.audio = !!this.audioElement().canPlayType;
                if (!Crafty.support.audio) {
                    return
                }
                this.canPlay();
                var audio, ext, path;
                if (arguments.length === 1 && typeof id === "object") {
                    for (var i in id) {
                        for (var src in id[i]) {
                            audio = this.audioElement();
                            audio.id = i;
                            audio.preload = "auto";
                            audio.volume = Crafty.audio.volume;
                            path = id[i][src];
                            ext = path.substr(path.lastIndexOf(".") + 1).toLowerCase();
                            if (this.supported[ext]) {
                                audio.src = path;
                                Crafty.asset(path, audio);
                                this.sounds[i] = {
                                    obj: audio,
                                    played: 0
                                }
                            }
                        }
                    }
                }
                if (typeof id === "string") {
                    audio = this.audioElement();
                    audio.id = id;
                    audio.preload = "auto";
                    audio.volume = Crafty.audio.volume;
                    if (typeof url === "string") {
                        ext = url.substr(url.lastIndexOf(".") + 1).toLowerCase();
                        if (this.supported[ext]) {
                            audio.src = url;
                            Crafty.asset(url, audio);
                            this.sounds[id] = {
                                obj: audio,
                                played: 0
                            }
                        }
                    }
                    if (typeof url === "object") {
                        for (src in url) {
                            audio = this.audioElement();
                            audio.id = id;
                            audio.preload = "auto";
                            audio.volume = Crafty.audio.volume;
                            path = url[src];
                            ext = path.substr(path.lastIndexOf(".") + 1).toLowerCase();
                            if (this.supported[ext]) {
                                audio.src = path;
                                Crafty.asset(path, audio);
                                this.sounds[id] = {
                                    obj: audio,
                                    played: 0
                                }
                            }
                        }
                    }
                }
            },
            play: function (id, repeat, volume) {
                if (repeat == 0 || !Crafty.support.audio || !this.sounds[id]) {
                    return
                }
                var s = this.sounds[id];
                s.obj.volume = volume || Crafty.audio.volume;
                if (s.obj.currentTime) {
                    s.obj.currentTime = 0
                }
                s.obj.play();
                s.played++;
                s.obj.addEventListener("ended", function () {
                    if (s.played < repeat || repeat == -1) {
                        if (this.currentTime) {
                            this.currentTime = 0
                        }
                        this.play();
                        s.played++
                    }
                }, true)
            },
            stop: function (id) {
                if (!Crafty.support.audio) {
                    return
                }
                var s;
                if (!id) {
                    for (var i in this.sounds) {
                        s = this.sounds[i];
                        if (!s.obj.paused) {
                            s.obj.pause()
                        }
                    }
                }
                if (!this.sounds[id]) {
                    return
                }
                s = this.sounds[id];
                if (!s.obj.paused) {
                    s.obj.pause()
                }
            },
            mute: function () {
                if (!Crafty.support.audio) {
                    return
                }
                var s;
                if (!this.muted) {
                    for (var i in this.sounds) {
                        s = this.sounds[i];
                        s.obj.pause()
                    }
                    this.muted = true
                } else {
                    for (var i in this.sounds) {
                        s = this.sounds[i];
                        if (s.obj.currentTime && s.obj.currentTime > 0) {
                            this.sounds[i].obj.play()
                        }
                    }
                    this.muted = false
                }
            }
        }
    });
    Crafty.c("Text", {
        _text: "",
        _textFont: {
            type: "",
            weight: "",
            size: "",
            family: ""
        },
        ready: true,
        init: function () {
            this.requires("2D");
            this.bind("Draw", function (e) {
                var font = this._textFont.type + " " + this._textFont.weight + " " + this._textFont.size + " " + this._textFont.family;
                if (e.type === "DOM") {
                    var el = this._element, style = el.style;
                    style.color = this._textColor;
                    style.font = font;
                    el.innerHTML = this._text
                } else {
                    if (e.type === "canvas") {
                        var context = e.ctx, metrics = null;
                        context.save();
                        context.fillStyle = this._textColor || "rgb(0,0,0)";
                        context.font = font;
                        context.translate(this.x, this.y + this.h);
                        context.fillText(this._text, 0, 0);
                        metrics = context.measureText(this._text);
                        this._w = metrics.width;
                        context.restore()
                    }
                }
            })
        },
        text: function (text) {
            if (!text) {
                return this._text
            }
            if (typeof (text) == "function") {
                this._text = text.call(this)
            } else {
                this._text = text
            }
            this.trigger("Change");
            return this
        },
        textColor: function (color, strength) {
            this._strength = strength;
            this._textColor = Crafty.toRGB(color, this._strength);
            this.trigger("Change");
            return this
        },
        textFont: function (key, value) {
            if (arguments.length === 1) {
                if (typeof key === "string") {
                    return this._textFont[key]
                }
                if (typeof key === "object") {
                    for (propertyKey in key) {
                        this._textFont[propertyKey] = key[propertyKey]
                    }
                }
            } else {
                this._textFont[key] = value
            }
            this.trigger("Change");
            return this
        }
    });
    Crafty.extend({
        assets: {},
        asset: function (key, value) {
            if (arguments.length === 1) {
                return Crafty.assets[key]
            }
            if (!Crafty.assets[key]) {
                Crafty.assets[key] = value;
                this.trigger("NewAsset", {
                    key: key,
                    value: value
                })
            }
        },
        load: function (data, oncomplete, onprogress, onerror) {
            var i = 0, l = data.length, current, obj, total = l, j = 0, ext = "";
            function pro() {
                var src = this.src;
                if (this.removeEventListener) {
                    this.removeEventListener("canplaythrough", pro, false)
                }
                ++j;
                if (onprogress) {
                    onprogress({
                        loaded: j,
                        total: total,
                        percent: (j / total * 100),
                        src: src
                    })
                }
                if (j === total && oncomplete) {
                    oncomplete()
                }
            }
            function err() {
                var src = this.src;
                if (onerror) {
                    onerror({
                        loaded: j,
                        total: total,
                        percent: (j / total * 100),
                        src: src
                    })
                }
                j++;
                if (j === total && oncomplete) {
                    oncomplete()
                }
            }
            for (; i < l; ++i) {
                current = data[i];
                ext = current.substr(current.lastIndexOf(".") + 1).toLowerCase();
                obj = Crafty.asset(current) || null;
                if (Crafty.support.audio && Crafty.audio.supported[ext]) {
                    if (!obj) {
                        var name = current.substr(current.lastIndexOf("/") + 1).toLowerCase();
                        obj = Crafty.audio.audioElement();
                        obj.id = name;
                        obj.src = current;
                        obj.preload = "auto";
                        obj.volume = Crafty.audio.volume;
                        Crafty.asset(current, obj);
                        Crafty.audio.sounds[name] = {
                            obj: obj,
                            played: 0
                        }
                    }
                    if (obj.addEventListener) {
                        obj.addEventListener("canplaythrough", pro, false)
                    }
                } else {
                    if (ext === "jpg" || ext === "jpeg" || ext === "gif" || ext === "png") {
                        if (!obj) {
                            obj = new Image();
                            Crafty.asset(current, obj)
                        }
                        obj.onload = pro;
                        obj.src = current
                    } else {
                        total--;
                        continue
                    }
                }
                obj.onerror = err
            }
        },
        modules: function (modulesRepository, moduleMap, oncomplete) {
            if (arguments.length === 2 && typeof modulesRepository === "object") {
                oncomplete = moduleMap;
                moduleMap = modulesRepository;
                modulesRepository = "http://cdn.craftycomponents.com";
                /*!
                * $script.js Async loader & dependency manager
                * https://github.com/ded/script.js
                * (c) Dustin Diaz, Jacob Thornton 2011
                * License: MIT
                */
            }
            var $script = (function () {
                var win = this, doc = document, head = doc.getElementsByTagName("head")[0], validBase = /^https?:\/\//, old = win.$script, list = {}, ids = {}, delay = {}, scriptpath, scripts = {}, s = "string", f = false, push = "push", domContentLoaded = "DOMContentLoaded", readyState = "readyState", addEventListener = "addEventListener", onreadystatechange = "onreadystatechange";
                function every(ar, fn, i) {
                    for (i = 0, j = ar.length; i < j; ++i) {
                        if (!fn(ar[i])) {
                            return f
                        }
                    }
                    return 1
                }
                function each(ar, fn) {
                    every(ar, function (el) {
                        return !fn(el)
                    })
                }
                if (!doc[readyState] && doc[addEventListener]) {
                    doc[addEventListener](domContentLoaded, function fn() {
                        doc.removeEventListener(domContentLoaded, fn, f);
                        doc[readyState] = "complete"
                    }, f);
                    doc[readyState] = "loading"
                }
                function $script(paths, idOrDone, optDone) {
                    paths = paths[push] ? paths : [paths];
                    var idOrDoneIsDone = idOrDone && idOrDone.call, done = idOrDoneIsDone ? idOrDone : optDone, id = idOrDoneIsDone ? paths.join("") : idOrDone, queue = paths.length;
                    function loopFn(item) {
                        return item.call ? item() : list[item]
                    }
                    function callback() {
                        if (! --queue) {
                            list[id] = 1;
                            done && done();
                            for (var dset in delay) {
                                every(dset.split("|"), loopFn) && !each(delay[dset], loopFn) && (delay[dset] = [])
                            }
                        }
                    }
                    setTimeout(function () {
                        each(paths, function (path) {
                            if (scripts[path]) {
                                id && (ids[id] = 1);
                                return scripts[path] == 2 && callback()
                            }
                            scripts[path] = 1;
                            id && (ids[id] = 1);
                            create(!validBase.test(path) && scriptpath ? scriptpath + path + ".js" : path, callback)
                        })
                    }, 0);
                    return $script
                }
                function create(path, fn) {
                    var el = doc.createElement("script"), loaded = f;
                    el.onload = el.onerror = el[onreadystatechange] = function () {
                        if ((el[readyState] && !(/^c|loade/.test(el[readyState]))) || loaded) {
                            return
                        }
                        el.onload = el[onreadystatechange] = null;
                        loaded = 1;
                        scripts[path] = 2;
                        fn()
                    };

                    el.async = 1;
                    el.src = path;
                    head.insertBefore(el, head.firstChild)
                }
                $script.get = create;
                $script.order = function (scripts, id, done) {
                    (function callback(s) {
                        s = scripts.shift();
                        if (!scripts.length) {
                            $script(s, id, done)
                        } else {
                            $script(s, callback)
                        }
                    } ())
                };

                $script.path = function (p) {
                    scriptpath = p
                };

                $script.ready = function (deps, ready, req) {
                    deps = deps[push] ? deps : [deps];
                    var missing = [];
                    !each(deps, function (dep) {
                        list[dep] || missing[push](dep)
                    }) && every(deps, function (dep) {
                        return list[dep]
                    }) ? ready() : !function (key) {
                        delay[key] = delay[key] || [];
                        delay[key][push](ready);
                        req && req(missing)
                    } (deps.join("|"));
                    return $script
                };

                $script.noConflict = function () {
                    win.$script = old;
                    return this
                };

                return $script
            })();
            var modules = [];
            var validBase = /^(https?|file):\/\//;
            for (var i in moduleMap) {
                if (validBase.test(i)) {
                    modules.push(i)
                } else {
                    modules.push(modulesRepository + "/" + i.toLowerCase() + "-" + moduleMap[i].toLowerCase() + ".js")
                }
            }
            $script(modules, function () {
                if (oncomplete) {
                    oncomplete()
                }
            })
        }
    });
    Crafty.math = {
        abs: function (x) {
            return x < 0 ? -x : x
        },
        amountOf: function (checkValue, minValue, maxValue) {
            if (minValue < maxValue) {
                return (checkValue - minValue) / (maxValue - minValue)
            } else {
                return (checkValue - maxValue) / (minValue - maxValue)
            }
        },
        clamp: function (value, min, max) {
            if (value > max) {
                return max
            } else {
                if (value < min) {
                    return min
                } else {
                    return value
                }
            }
        },
        degToRad: function (angleInDeg) {
            return angleInDeg * Math.PI / 180
        },
        distance: function (x1, y1, x2, y2) {
            var squaredDistance = Crafty.math.squaredDistance(x1, y1, x2, y2);
            return Math.sqrt(parseFloat(squaredDistance))
        },
        lerp: function (value1, value2, amount) {
            return value1 + (value2 - value1) * amount
        },
        negate: function (percent) {
            if (Math.random() < percent) {
                return -1
            } else {
                return 1
            }
        },
        radToDeg: function (angleInRad) {
            return angleInRad * 180 / Math.PI
        },
        randomElementOfArray: function (array) {
            return array[Math.floor(array.length * Math.random())]
        },
        randomInt: function (start, end) {
            return start + Math.floor((1 + end - start) * Math.random())
        },
        randomNumber: function (start, end) {
            return start + (end - start) * Math.random()
        },
        squaredDistance: function (x1, y1, x2, y2) {
            return (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2)
        },
        withinRange: function (value, min, max) {
            return (value >= min && value <= max)
        }
    };

    Crafty.math.Vector2D = (function () {
        function Vector2D(x, y) {
            if (x instanceof Vector2D) {
                this.x = x.x;
                this.y = x.y
            } else {
                if (arguments.length === 2) {
                    this.x = x;
                    this.y = y
                } else {
                    if (arguments.length > 0) {
                        throw "Unexpected number of arguments for Vector2D()"
                    }
                }
            }
        }
        Vector2D.prototype.x = 0;
        Vector2D.prototype.y = 0;
        Vector2D.prototype.add = function (vecRH) {
            this.x += vecRH.x;
            this.y += vecRH.y;
            return this
        };

        Vector2D.prototype.angleBetween = function (vecRH) {
            return Math.atan2(this.x * vecRH.y - this.y * vecRH.x, this.x * vecRH.x + this.y * vecRH.y)
        };

        Vector2D.prototype.angleTo = function (vecRH) {
            return Math.atan2(vecRH.y - this.y, vecRH.x - this.x)
        };

        Vector2D.prototype.clone = function () {
            return new Vector2D(this)
        };

        Vector2D.prototype.distance = function (vecRH) {
            return Math.sqrt((vecRH.x - this.x) * (vecRH.x - this.x) + (vecRH.y - this.y) * (vecRH.y - this.y))
        };

        Vector2D.prototype.distanceSq = function (vecRH) {
            return (vecRH.x - this.x) * (vecRH.x - this.x) + (vecRH.y - this.y) * (vecRH.y - this.y)
        };

        Vector2D.prototype.divide = function (vecRH) {
            this.x /= vecRH.x;
            this.y /= vecRH.y;
            return this
        };

        Vector2D.prototype.dotProduct = function (vecRH) {
            return this.x * vecRH.x + this.y * vecRH.y
        };

        Vector2D.prototype.equals = function (vecRH) {
            return vecRH instanceof Vector2D && this.x == vecRH.x && this.y == vecRH.y
        };

        Vector2D.prototype.getNormal = function (vecRH) {
            if (vecRH === undefined) {
                return new Vector2D(-this.y, this.x)
            }
            return new Vector2D(vecRH.y - this.y, this.x - vecRH.x).normalize()
        };

        Vector2D.prototype.isZero = function () {
            return this.x === 0 && this.y === 0
        };

        Vector2D.prototype.magnitude = function () {
            return Math.sqrt(this.x * this.x + this.y * this.y)
        };

        Vector2D.prototype.magnitudeSq = function () {
            return this.x * this.x + this.y * this.y
        };

        Vector2D.prototype.multiply = function (vecRH) {
            this.x *= vecRH.x;
            this.y *= vecRH.y;
            return this
        };

        Vector2D.prototype.negate = function () {
            this.x = -this.x;
            this.y = -this.y;
            return this
        };

        Vector2D.prototype.normalize = function () {
            var lng = Math.sqrt(this.x * this.x + this.y * this.y);
            if (lng === 0) {
                this.x = 1;
                this.y = 0
            } else {
                this.x /= lng;
                this.y /= lng
            }
            return this
        };

        Vector2D.prototype.scale = function (scalarX, scalarY) {
            if (scalarY === undefined) {
                scalarY = scalarX
            }
            this.x *= scalarX;
            this.y *= scalarY;
            return this
        };

        Vector2D.prototype.scaleToMagnitude = function (mag) {
            var k = mag / this.magnitude();
            this.x *= k;
            this.y *= k;
            return this
        };

        Vector2D.prototype.setValues = function (x, y) {
            if (x instanceof Vector2D) {
                this.x = x.x;
                this.y = x.y
            } else {
                this.x = x;
                this.y = y
            }
            return this
        };

        Vector2D.prototype.subtract = function (vecRH) {
            this.x -= vecRH.x;
            this.y -= vecRH.y;
            return this
        };

        Vector2D.prototype.toString = function () {
            return "Vector2D(" + this.x + ", " + this.y + ")"
        };

        Vector2D.prototype.translate = function (dx, dy) {
            if (dy === undefined) {
                dy = dx
            }
            this.x += dx;
            this.y += dy;
            return this
        };

        Vector2D.tripleProduct = function (a, b, c) {
            var ac = a.dotProduct(c);
            var bc = b.dotProduct(c);
            return new Crafty.math.Vector2D(b.x * ac - a.x * bc, b.y * ac - a.y * bc)
        };

        return Vector2D
    })();
    Crafty.math.Matrix2D = (function () {
        Matrix2D = function (a, b, c, d, e, f) {
            if (a instanceof Matrix2D) {
                this.a = a.a;
                this.b = a.b;
                this.c = a.c;
                this.d = a.d;
                this.e = a.e;
                this.f = a.f
            } else {
                if (arguments.length === 6) {
                    this.a = a;
                    this.b = b;
                    this.c = c;
                    this.d = d;
                    this.e = e;
                    this.f = f
                } else {
                    if (arguments.length > 0) {
                        throw "Unexpected number of arguments for Matrix2D()"
                    }
                }
            }
        };

        Matrix2D.prototype.a = 1;
        Matrix2D.prototype.b = 0;
        Matrix2D.prototype.c = 0;
        Matrix2D.prototype.d = 1;
        Matrix2D.prototype.e = 0;
        Matrix2D.prototype.f = 0;
        Matrix2D.prototype.apply = function (vecRH) {
            var tmpX = vecRH.x;
            vecRH.x = tmpX * this.a + vecRH.y * this.c + this.e;
            vecRH.y = tmpX * this.b + vecRH.y * this.d + this.f;
            return vecRH
        };

        Matrix2D.prototype.clone = function () {
            return new Matrix2D(this)
        };

        Matrix2D.prototype.combine = function (mtrxRH) {
            var tmp = this.a;
            this.a = tmp * mtrxRH.a + this.b * mtrxRH.c;
            this.b = tmp * mtrxRH.b + this.b * mtrxRH.d;
            tmp = this.c;
            this.c = tmp * mtrxRH.a + this.d * mtrxRH.c;
            this.d = tmp * mtrxRH.b + this.d * mtrxRH.d;
            tmp = this.e;
            this.e = tmp * mtrxRH.a + this.f * mtrxRH.c + mtrxRH.e;
            this.f = tmp * mtrxRH.b + this.f * mtrxRH.d + mtrxRH.f;
            return this
        };

        Matrix2D.prototype.equals = function (mtrxRH) {
            return mtrxRH instanceof Matrix2D && this.a == mtrxRH.a && this.b == mtrxRH.b && this.c == mtrxRH.c && this.d == mtrxRH.d && this.e == mtrxRH.e && this.f == mtrxRH.f
        };

        Matrix2D.prototype.determinant = function () {
            return this.a * this.d - this.b * this.c
        };

        Matrix2D.prototype.invert = function () {
            var det = this.determinant();
            if (det !== 0) {
                var old = {
                    a: this.a,
                    b: this.b,
                    c: this.c,
                    d: this.d,
                    e: this.e,
                    f: this.f
                };

                this.a = old.d / det;
                this.b = -old.b / det;
                this.c = -old.c / det;
                this.d = old.a / det;
                this.e = (old.c * old.f - old.e * old.d) / det;
                this.f = (old.e * old.b - old.a * old.f) / det
            }
            return this
        };

        Matrix2D.prototype.isIdentity = function () {
            return this.a === 1 && this.b === 0 && this.c === 0 && this.d === 1 && this.e === 0 && this.f === 0
        };

        Matrix2D.prototype.isInvertible = function () {
            return this.determinant() !== 0
        };

        Matrix2D.prototype.preRotate = function (rads) {
            var nCos = Math.cos(rads);
            var nSin = Math.sin(rads);
            var tmp = this.a;
            this.a = nCos * tmp - nSin * this.b;
            this.b = nSin * tmp + nCos * this.b;
            tmp = this.c;
            this.c = nCos * tmp - nSin * this.d;
            this.d = nSin * tmp + nCos * this.d;
            return this
        };

        Matrix2D.prototype.preScale = function (scalarX, scalarY) {
            if (scalarY === undefined) {
                scalarY = scalarX
            }
            this.a *= scalarX;
            this.b *= scalarY;
            this.c *= scalarX;
            this.d *= scalarY;
            return this
        };

        Matrix2D.prototype.preTranslate = function (dx, dy) {
            if (typeof dx === "number") {
                this.e += dx;
                this.f += dy
            } else {
                this.e += dx.x;
                this.f += dx.y
            }
            return this
        };

        Matrix2D.prototype.rotate = function (rads) {
            var nCos = Math.cos(rads);
            var nSin = Math.sin(rads);
            var tmp = this.a;
            this.a = nCos * tmp - nSin * this.b;
            this.b = nSin * tmp + nCos * this.b;
            tmp = this.c;
            this.c = nCos * tmp - nSin * this.d;
            this.d = nSin * tmp + nCos * this.d;
            tmp = this.e;
            this.e = nCos * tmp - nSin * this.f;
            this.f = nSin * tmp + nCos * this.f;
            return this
        };

        Matrix2D.prototype.scale = function (scalarX, scalarY) {
            if (scalarY === undefined) {
                scalarY = scalarX
            }
            this.a *= scalarX;
            this.b *= scalarY;
            this.c *= scalarX;
            this.d *= scalarY;
            this.e *= scalarX;
            this.f *= scalarY;
            return this
        };

        Matrix2D.prototype.setValues = function (a, b, c, d, e, f) {
            if (a instanceof Matrix2D) {
                this.a = a.a;
                this.b = a.b;
                this.c = a.c;
                this.d = a.d;
                this.e = a.e;
                this.f = a.f
            } else {
                this.a = a;
                this.b = b;
                this.c = c;
                this.d = d;
                this.e = e;
                this.f = f
            }
            return this
        };

        Matrix2D.prototype.toString = function () {
            return "Matrix2D([" + this.a + ", " + this.c + ", " + this.e + "] [" + this.b + ", " + this.d + ", " + this.f + "] [0, 0, 1])"
        };

        Matrix2D.prototype.translate = function (dx, dy) {
            if (typeof dx === "number") {
                this.e += this.a * dx + this.c * dy;
                this.f += this.b * dx + this.d * dy
            } else {
                this.e += this.a * dx.x + this.c * dx.y;
                this.f += this.b * dx.x + this.d * dx.y
            }
            return this
        };

        return Matrix2D
    })();
    Crafty.c("Delay", {
        init: function () {
            this._delays = [];
            this.bind("EnterFrame", function () {
                var now = new Date().getTime();
                for (var index in this._delays) {
                    var item = this._delays[index];
                    if (!item.triggered && item.start + item.delay + item.pause < now) {
                        item.triggered = true;
                        item.func.call(this)
                    }
                }
            });
            this.bind("Pause", function () {
                var now = new Date().getTime();
                for (var index in this._delays) {
                    this._delays[index].pauseBuffer = now
                }
            });
            this.bind("Unpause", function () {
                var now = new Date().getTime();
                for (var index in this._delays) {
                    var item = this._delays[index];
                    item.pause += now - item.pauseBuffer
                }
            })
        },
        delay: function (func, delay) {
            return this._delays.push({
                start: new Date().getTime(),
                func: func,
                delay: delay,
                triggered: false,
                pauseBuffer: 0,
                pause: 0
            })
        }
    })
})(Crafty, window, window.document);