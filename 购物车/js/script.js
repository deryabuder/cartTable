window.onload = function () {
    if (!document.getElementsByClassName) {
        document.getElementsByClassName = function (cls) {
            var ret = [];
            var els = document.getElementById('*');
            for (var i = 0; i < els.length; i++) {
                if (els[i].className == cls ||
                    els[i].className.indexOf(' ' + cls) >= 0 ||
                    els[i].className.indexOf(' ' + cls) >= 0 ||
                    els[i].className.indexOf(' ' + cls + ' ') >= 0) {
                    ret.push(els[i])
                }
            }
            return ret;
        }
    }

    var cartTable = document.getElementById('cartTable');
    var tr = cartTable.children[1].rows;
    var checkInputs = document.getElementsByClassName('check');
    var checkAllInputs = document.getElementsByClassName('check-all');
    var selectedTotal = document.getElementById('selectedTotal');
    var priceTotal = document.getElementById('priceTotal');
    var selected = document.getElementById('selected');
    var foot = document.getElementById('foot');
    var selectedViewList = document.getElementById('selectedViewList');
    var deleteAll = document.getElementById('deleteAll');

    //计算
    function getTotal() {
        var selected = 0;
        var price = 0;
        var HTMLstr = '';
        for (var i = 0; i < tr.length; i++) {
            var input = tr[i].getElementsByTagName('input')[0];
            if (input.checked) {
                tr[i].className = 'on';
                selected += parseInt(tr[i].getElementsByTagName('input')[1].value);
                price += parseFloat(tr[i].getElementsByTagName('td')[4].innerHTML);
                HTMLstr += '<div><img src="' + tr[i].getElementsByTagName('img')[0].src + '"><span class="del" index="' + i + '">取消选择</span></div>';
            } else {
                tr[i].className = '';
            }
        }
        selectedTotal.innerHTML = selected;
        priceTotal.innerHTML = price.toFixed(2);
        selectedViewList.innerHTML = HTMLstr;
        if (selected == 0) {
            foot.className = 'foot'
        }
    }

    //小计
    function getSubTotal(tr) {
        tds = tr.cells;
        var price = parseFloat(tds[2].innerHTML);
        var count = parseInt(tr.getElementsByTagName('input')[1].value);
        var subTotal = (price * count).toFixed(2);
        tds[4].innerHTML = subTotal;
    }

    for (var i = 0, len = checkInputs.length; i < len; i++) {
        checkInputs[i].onclick = function () {
            if (this.className === 'check-all check') {
                for (var j = 0; j < checkInputs.length; j++) {
                    checkInputs[j].checked = this.checked;
                }
            }
            if (this.checked == false) {
                for (var k = 0; k < checkAllInputs.length; k++) {
                    checkAllInputs[k].checked = false;
                }
            }
            getTotal();
        }
    }

    selected.onclick = function () {
        if (foot.className === 'foot') {
            foot.className = 'foot show';
        } else {
            foot.className = 'foot';
        }
    }

    selectedViewList.onclick = function (e) {
        e = e || window.event;
        var el = e.srcElement;
        if (el.className == 'del') {
            var index = el.getAttribute('index');
            var input = tr[index].getElementsByTagName('input')[0];
            input.checked = false;
            input.onclick();
        }
    }
    for (var i = 0; i < tr.length; i++) {
        tr[i].onclick = function (e) {
            e = e || window.event;
            var el = e.srcElement;
            var cls = el.className;
            var input = this.getElementsByTagName('input')[1]
            var val = parseInt(input.value);
            var reduce = this.getElementsByTagName('span')[1];
            switch (cls) {
                case 'add':
                    val = val + 1;
                    input.value = val;
                    reduce.innerHTML = '-';
                    getSubTotal(this);
                    break;
                case 'reduce':
                    if(val > 1) {
                        val = val - 1;
                        input.value = val;
                    }
                    if (val <= 1) {
                        reduce.innerHTML = '';
                    }   
                    getSubTotal(this);
                    break;
                case 'delete':
                    var conf = confirm('您确定要删除吗？');
                    if(conf) {
                        this.parentNode.removeChild(this);
                    }
                    break;
                default:
                    break;
            }
            getTotal();
        }
        tr[i].getElementsByTagName('input')[1].onkeyup = function () {
            var val = this.value;
            var tr = this.parentNode.parentNode;
            var reduce = tr.getElementsByTagName('span')[1];
            if (isNaN(val) || val < 0) {
                input.value = 1;
            }
            if (val <= 1) {
                reduce.innerHTML = '';
            } else {
                reduce.innerHTML = '-';
            }
            getSubTotal(tr);
            getTotal();
        }
    }

    deleteAll.onclick = function () {
        if (selectedTotal != '0') {
            var con = confirm('确定要删除吗');
            if (con) {
                for (var i = 0; i < tr.length; i++) {
                    var input = tr[i].getElementsByTagName('input')[0];
                    if (input.checked) {
                        tr[i].parentNode.removeChild(tr[i]);
                        i--;
                    }
                }
            }
        }
    }
    checkAllInputs[0].checked = true;
    checkAllInputs[0].onclick();
}