function MyCrop($myCropWrapper, info) {
    var _this = this;
    _this.info = {
        proportion: true,  //Լ������
        handleMinWidth: 20,
        handleMinHeight: 20
    };
    $.extend(_this.info, info);
    _this.$myCropWrapper = $myCropWrapper;
    _this.isMouseDown = false;
    _this.ordClickDown = false;
    _this.curOrdElementClass = null;

    var $orgimg = _this.$myCropWrapper.find("img");
    _this.orgimgW = $orgimg.width();
    _this.orgimgH = $orgimg.height();

    //��ʼ����
    _this.$myCropWrapper.append('<div class="cropWrapper"></div><div class="preview"><img src="' + $orgimg.attr("src") + '"/></div>');
    _this.$cropWrapper = _this.$myCropWrapper.find(".cropWrapper");
    _this.$preview = _this.$myCropWrapper.find(".preview");
    var str = '<div class="handleLayer">' +
        '<div class="nw ord"></div><div class="n ord"></div><div class="ne ord"></div>' +
        '<div class="w ord"></div><div class="e ord"></div>' +
        '<div class="sw ord"></div><div class="s ord"></div><div class="se ord"></div>' +
        '<div class="handleLayer_inside"></div>' +
        '</div>' +
        '<div class="clipLayer"><img src="' + $orgimg.attr("src") + '"/></div>' +
        '<div class="orginLayer"><img src="' + $orgimg.attr("src") + '"/></div>';
    $orgimg.remove();
    _this.$cropWrapper.append(str);

    var str2 = '<div class="myCropInputsW" style="clear:both;">' +
        '<input type="hidden" name="x1"/><input type="hidden" name="y1"/>' +
        '<input type="hidden" name="x2"/><input type="hidden" name="y2"/>' +
        '<input type="hidden" name="w"/><input type="hidden" name="h"/>' +
        '</div>';
    _this.$cropWrapper.parent().parent().append(str2);

    _this.$handleLayer = _this.$cropWrapper.find(".handleLayer");
    _this.$handleLayerInside = _this.$cropWrapper.find(".handleLayer_inside");
    _this.$clipLayer = _this.$cropWrapper.find(".clipLayer");
    _this.$orginLayer = _this.$cropWrapper.find(".orginLayer");
    _this.$clipLayerImg = _this.$cropWrapper.find(".clipLayer").find("img");
    _this.$orginLayerImg = _this.$cropWrapper.find(".orginLayer").find("img");
    _this.$previewImg = _this.$preview.find("img");
    _this.$nw = _this.$handleLayer.find(".nw");
    _this.$n = _this.$handleLayer.find(".n");
    _this.$ne = _this.$handleLayer.find(".ne");
    _this.$w = _this.$handleLayer.find(".w");
    _this.$e = _this.$handleLayer.find(".e");
    _this.$sw = _this.$handleLayer.find(".sw");
    _this.$s = _this.$handleLayer.find(".s");
    _this.$se = _this.$handleLayer.find(".se");
    _this.$myCropInputsW = $(".myCropInputsW");
    _this.$x1_input = _this.$myCropInputsW.find("[name='x1']");
    _this.$y1_input = _this.$myCropInputsW.find("[name='y1']");
    _this.$x2_input = _this.$myCropInputsW.find("[name='x2']");
    _this.$y2_input = _this.$myCropInputsW.find("[name='y2']");
    _this.$w_input = _this.$myCropInputsW.find("[name='w']");
    _this.$h_input = _this.$myCropInputsW.find("[name='h']");
    _this.$myCropWrapper.css({"height": _this.orgimgH});
    _this.$cropWrapper.css({"width": _this.orgimgW, "height": _this.orgimgH});
    _this.$clipLayer.css({"width": _this.orgimgW, "height": _this.orgimgH});
    _this.$orginLayer.css({"width": _this.orgimgW, "height": _this.orgimgH});
    _this.$preview.css({"marginLeft": _this.orgimgW + 20, "width": _this.info.previewWidth, "height": _this.info.previewHeight});
    _this.$orginLayerImg.css("opacity", 0.3);

    //��ʼ����ֵ!!!!!!
    var fir_x1 = _this.orgimgW / 2 - _this.info.previewWidth / 2;
    var fir_y1 = _this.orgimgH / 2 - _this.info.previewHeight / 2;
    var fir_x2 = fir_x1 + _this.info.previewWidth;
    var fir_y2 = fir_y1 + _this.info.previewHeight;
    _this.assign(fir_x1, fir_y1, fir_x2, fir_y2);

    //�����������ڼ�¼���㱻�����ѡ���״̬
    _this.curX1 = 0;
    _this.curY1 = 0;
    _this.curX2 = 0;
    _this.curY2 = 0;
    _this.curW = 0;
    _this.curH = 0;


    //ȡ��һЩĬ���¼�
    _this.$myCropWrapper.on("mousemove", function (e) {
        e.preventDefault();
        //e.stopPropagation();
    });
    _this.$orginLayerImg.on("mousemove", function (e) {
        e.preventDefault();
        //e.stopPropagation();
    });
    _this.$clipLayerImg.on("mousemove", function (e) {
        e.preventDefault();
        //e.stopPropagation();
    });

    //��handleLayerInside���¼�
    _this.$handleLayerInside.on("mousedown", function (e) {
        e.preventDefault();
        e.stopPropagation();
        /*eventToHandleY��eventToHandleXΪ������¼���handleLayer���Ͻǵľ���*/
        _this.eventToHandleY = e.clientY - (_this.$handleLayer.offset().top - $(document).scrollTop());  //�¼�������ӿڵ������� - handleLayer������ӿڵ�������
        _this.eventToHandleX = e.clientX - (_this.$handleLayer.offset().left - $(document).scrollLeft());  //�¼�������ӿڵĺ����� - handleLayer������ӿڵĺ�����
        _this.isMouseDown = true;
    });
    _this.$handleLayerInside.on("mousemove", function (e) {
        e.preventDefault();
        //e.stopPropagation();
        if (_this.isMouseDown) {
            /*top��leftΪѡ�����Ͻǵ�ͼƬ���Ͻǵľ���*/
            var top = e.clientY - (_this.$myCropWrapper.offset().top - $(document).scrollTop()) - _this.eventToHandleY;  //�¼�������ӿڵ������� - ����������ӿڵ������� - eventToHandleY
            var left = e.clientX - (_this.$myCropWrapper.offset().left - $(document).scrollLeft()) - _this.eventToHandleX;  //�¼�������ӿڵĺ����� - ����������ӿڵĺ����� - eventToHandleX
            var maxTop = _this.$cropWrapper.height() - _this.h;
            var maxLeft = _this.$cropWrapper.width() - _this.w;

            /*����*/
            top < 0 ? top = 0 : top;
            top > maxTop ? top = maxTop : top;
            left < 0 ? left = 0 : left;
            left > maxLeft ? left = maxLeft : left;

            /*��ֵ*/
            _this.assign(left, top, left + _this.w, top + _this.h);
        }
    });

    //��8��������¼�
    _this.$e.on("mousedown", function () {
        _this.curNote($(this));
    });
    _this.$w.on("mousedown", function () {
        _this.curNote($(this));
    });
    _this.$n.on("mousedown", function () {
        _this.curNote($(this));
    });
    _this.$s.on("mousedown", function () {
        _this.curNote($(this));
    });
    _this.$nw.on("mousedown", function () {
        _this.curNote($(this));
    });
    _this.$ne.on("mousedown", function () {
        _this.curNote($(this));
    });
    _this.$sw.on("mousedown", function () {
        _this.curNote($(this));
    });
    _this.$se.on("mousedown", function () {
        _this.curNote($(this));
    });
    _this.$cropWrapper.on("mousemove", function (e) {
        if (_this.ordClickDown) {
            var x1 = 0;
            var y1 = 0;
            var x2 = 0;
            var y2 = 0;
            var w = 0;
            var h = 0;
            //changeX�����ࣩ = ��ǰ�¼�������� - �ϴ������������
            //changeY�����ࣩ = ��ǰ�¼����Ͼ��� - �ϴ��������Ͼ���
            switch (_this.curOrdElementClass) {
                //��
                case "w ord":
                    if (!_this.info.proportion) {
                        var changeX = (e.clientX - (_this.$myCropWrapper.offset().left - $(document).scrollLeft())) - _this.curX1;
                        x1 = _this.curX1 + changeX;
                        y1 = _this.curY1;
                        x2 = _this.curX2;
                        y2 = _this.curY2;
                        w = _this.curW - changeX;
                        h = _this.curH;
                    } else {
                        var changeX = (e.clientX - (_this.$myCropWrapper.offset().left - $(document).scrollLeft())) - _this.curX1;
                        var changeY = changeX / _this.info.previewWidth * _this.info.previewHeight;
                        x1 = _this.curX1 + changeX;
                        y1 = _this.curY1;
                        x2 = _this.curX2;
                        y2 = _this.curY2 - changeY;
                        w = _this.curW - changeX;
                        h = _this.curH - changeY;
                    }
                    break;
                //��
                case "e ord":
                    if (!_this.info.proportion) {
                        var changeX = (e.clientX - (_this.$myCropWrapper.offset().left - $(document).scrollLeft())) - _this.curX2;
                        x1 = _this.curX1;
                        y1 = _this.curY1;
                        x2 = _this.curX2 + changeX;
                        y2 = _this.curY2;
                        w = _this.curW + changeX;
                        h = _this.curH;
                    } else {
                        var changeX = (e.clientX - (_this.$myCropWrapper.offset().left - $(document).scrollLeft())) - _this.curX2;
                        var changeY = changeX / _this.info.previewWidth * _this.info.previewHeight;
                        x1 = _this.curX1;
                        y1 = _this.curY1;
                        x2 = _this.curX2 + changeX;
                        y2 = _this.curY2 + changeY;
                        w = _this.curW + changeX;
                        h = _this.curH + changeY;
                    }
                    break;
                //��
                case "n ord":
                    if (!_this.info.proportion) {
                        var changeY = (e.clientY - (_this.$myCropWrapper.offset().top - $(document).scrollTop())) - _this.curY1;
                        x1 = _this.curX1;
                        y1 = _this.curY1 + changeY;
                        x2 = _this.curX2;
                        y2 = _this.curY2;
                        w = _this.curW;
                        h = _this.curH - changeY;
                    } else {
                        var changeY = (e.clientY - (_this.$myCropWrapper.offset().top - $(document).scrollTop())) - _this.curY1;
                        var changeX = changeY / _this.info.previewHeight * _this.info.previewWidth;
                        x1 = _this.curX1;
                        y1 = _this.curY1 + changeY;
                        x2 = _this.curX2 - changeX;
                        y2 = _this.curY2;
                        w = _this.curW - changeX;
                        h = _this.curH - changeY;
                    }
                    break;
                //��
                case "s ord":
                    if (!_this.info.proportion) {
                        var changeY = (e.clientY - (_this.$myCropWrapper.offset().top - $(document).scrollTop())) - _this.curY2;
                        x1 = _this.curX1;
                        y1 = _this.curY1;
                        x2 = _this.curX2;
                        y2 = _this.curY2 + changeY;
                        w = _this.curW;
                        h = _this.curH + changeY;
                    } else {
                        var changeY = (e.clientY - (_this.$myCropWrapper.offset().top - $(document).scrollTop())) - _this.curY2;
                        var changeX = changeY / _this.info.previewHeight * _this.info.previewWidth;
                        x1 = _this.curX1;
                        y1 = _this.curY1;
                        x2 = _this.curX2 + changeX;
                        y2 = _this.curY2 + changeY;
                        w = _this.curW + changeX;
                        h = _this.curH + changeY;
                    }
                    break;
                //����
                case "nw ord":
                    if (!_this.info.proportion) {
                        var changeX = (e.clientX - (_this.$myCropWrapper.offset().left - $(document).scrollLeft())) - _this.curX1;
                        var changeY = (e.clientY - (_this.$myCropWrapper.offset().top - $(document).scrollTop())) - _this.curY1;
                        x1 = _this.curX1 + changeX;
                        y1 = _this.curY1 + changeY;
                        x2 = _this.curX2;
                        y2 = _this.curY2;
                        w = _this.curW - changeX;
                        h = _this.curH - changeY;
                    } else {
                        var changeX = (e.clientX - (_this.$myCropWrapper.offset().left - $(document).scrollLeft())) - _this.curX1;
                        var changeY = changeX / _this.info.previewWidth * _this.info.previewHeight;
                        x1 = _this.curX1 + changeX;
                        y1 = _this.curY1 + changeY;
                        x2 = _this.curX2;
                        y2 = _this.curY2;
                        w = _this.curW - changeX;
                        h = _this.curH - changeY;
                    }
                    break;
                //����
                case "ne ord":
                    if (!_this.info.proportion) {
                        var changeX = (e.clientX - (_this.$myCropWrapper.offset().left - $(document).scrollLeft())) - _this.curX2;
                        var changeY = (e.clientY - (_this.$myCropWrapper.offset().top - $(document).scrollTop())) - _this.curY1;
                        x1 = _this.curX1;
                        y1 = _this.curY1 + changeY;
                        x2 = _this.curX2 + changeX;
                        y2 = _this.curY2;
                        w = _this.curW + changeX;
                        h = _this.curH - changeY;
                    } else {
                        var changeX = (e.clientX - (_this.$myCropWrapper.offset().left - $(document).scrollLeft())) - _this.curX2;
                        var changeY = changeX / _this.info.previewWidth * _this.info.previewHeight;
                        x1 = _this.curX1;
                        y1 = _this.curY1 - changeY;
                        x2 = _this.curX2 + changeX;
                        y2 = _this.curY2;
                        w = _this.curW + changeX;
                        h = _this.curH + changeY;
                    }
                    break;
                //����
                case "sw ord":
                    if (!_this.info.proportion) {
                        var changeX = (e.clientX - (_this.$myCropWrapper.offset().left - $(document).scrollLeft())) - _this.curX1;
                        var changeY = (e.clientY - (_this.$myCropWrapper.offset().top - $(document).scrollTop())) - _this.curY2;
                        x1 = _this.curX1 + changeX;
                        y1 = _this.curY1;
                        x2 = _this.curX2;
                        y2 = _this.curY2 + changeY;
                        w = _this.curW - changeX;
                        h = _this.curH + changeY;
                    } else {
                        var changeX = (e.clientX - (_this.$myCropWrapper.offset().left - $(document).scrollLeft())) - _this.curX1;
                        var changeY = changeX / _this.info.previewWidth * _this.info.previewHeight;
                        x1 = _this.curX1 + changeX;
                        y1 = _this.curY1;
                        x2 = _this.curX2;
                        y2 = _this.curY2 - changeY;
                        w = _this.curW - changeX;
                        h = _this.curH - changeY;
                    }
                    break;
                //����
                case "se ord":
                    if (!_this.info.proportion) {
                        var changeX = (e.clientX - (_this.$myCropWrapper.offset().left - $(document).scrollLeft())) - _this.curX2;
                        var changeY = (e.clientY - (_this.$myCropWrapper.offset().top - $(document).scrollTop())) - _this.curY2;
                        x1 = _this.curX1;
                        y1 = _this.curY1;
                        x2 = _this.curX2 + changeX;
                        y2 = _this.curY2 + changeY;
                        w = _this.curW + changeX;
                        h = _this.curH + changeY;
                    } else {
                        var changeX = (e.clientX - (_this.$myCropWrapper.offset().left - $(document).scrollLeft())) - _this.curX2;
                        var changeY = changeX / _this.info.previewWidth * _this.info.previewHeight;
                        x1 = _this.curX1;
                        y1 = _this.curY1;
                        x2 = _this.curX2 + changeX;
                        y2 = _this.curY2 + changeY;
                        w = _this.curW + changeX;
                        h = _this.curH + changeY;
                    }
                    break;
            }

            if (x1 < 0) {
                _this.ordClickDown = false;
                x1 = 0;
                x2 = x1 + w;
            }
            if (y1 < 0) {
                _this.ordClickDown = false;
                y1 = 0;
                y2 = y1 + h;
            }
            if (x2 > _this.orgimgW) {
                _this.ordClickDown = false;
                x2 = _this.orgimgW;
                x1 = x2 - w;
            }
            if (y2 > _this.orgimgH) {
                _this.ordClickDown = false;
                y2 = _this.orgimgH;
                y1 = y2 - h;
            }

            if (x2 - x1 < _this.info.handleMinWidth) {
                _this.ordClickDown = false;
                x2 = x1 + _this.info.handleMinWidth;
            }
            if (y2 - y1 < _this.info.handleMinHeight) {
                _this.ordClickDown = false;
                y2 = y1 + _this.info.handleMinHeight;
            }

            _this.assign(x1, y1, x2, y2);
        }
    });

    //���ֹر�״̬
    _this.$cropWrapper.on("mouseup", function () {
        _this.isMouseDown = false;
        _this.ordClickDown = false;
    });
    _this.$cropWrapper.on("mouseleave", function () {
        _this.isMouseDown = false;
        _this.ordClickDown = false;
    });
}

//��ֵ����
MyCrop.prototype.assign = function (x1, y1, x2, y2) {
    var _this = this;

    _this.x1 = Math.floor(x1 < 0 ? 0 : x1);
    _this.y1 = Math.floor(y1 < 0 ? 0 : y1);
    _this.x2 = Math.floor(x2 > _this.info.orgimgW ? _this.info.orgimgW : x2);
    _this.y2 = Math.floor(y2 > _this.info.orgimgH ? _this.info.orgimgH : y2);
    _this.w = _this.x2 - _this.x1;
    _this.h = _this.y2 - _this.y1;

    _this.$handleLayer.css({"top": _this.y1, "left": _this.x1, "width": _this.w, "height": _this.h});
    _this.$handleLayerInside.css({"width": _this.w, "height": _this.h});
    _this.$clipLayerImg.css("clip", "rect(" + _this.y1 + "px," + _this.x2 + "px," + _this.y2 + "px," + _this.x1 + "px)");

    _this.$previewImg.css({
        "top": -(_this.info.previewHeight / _this.h * _this.y1),
        "left": -(_this.info.previewWidth / _this.w * _this.x1),
        "width": _this.info.previewWidth / _this.w * _this.orgimgW,
        "height": _this.info.previewHeight / _this.h * _this.orgimgH
    });

    _this.$x1_input.val(_this.x1);
    _this.$y1_input.val(_this.y1);
    _this.$x2_input.val(_this.x2);
    _this.$y2_input.val(_this.y2);
    _this.$w_input.val(_this.w);
    _this.$h_input.val(_this.h);
};
//��¼���㱻����ʱ��һЩ��Ϣ
MyCrop.prototype.curNote = function ($ord) {
    var _this = this;
    _this.ordClickDown = true;
    _this.curOrdElementClass = $ord.attr("class");
    _this.curX1 = _this.x1;
    _this.curY1 = _this.y1;
    _this.curX2 = _this.x2;
    _this.curY2 = _this.y2;
    _this.curW = _this.w;
    _this.curH = _this.h;
};




