$("input[type='text']").keypress(function (e) {
    var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    InputValueWasChanged(e, str, this.name);
});

$("input[type='text']").bind("paste", function (e) {
    var str = e.originalEvent.clipboardData.getData('Text');
    InputValueWasChanged(e, str, this.name);
});

$("input[type='email']").keypress(function (e) {
    var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    InputValueWasChanged(e, str, this.name);
});

$("input[type='email']").bind("paste", function (e) {
    var str = e.originalEvent.clipboardData.getData('Text');
    InputValueWasChanged(e, str, this.name);
});

$("input[type='tel']").keypress(function (e) {
    var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    InputValueWasChanged(e, str, this.name);
});

$("input[type='tel']").bind("paste", function (e) {
    var str = e.originalEvent.clipboardData.getData('Text');
    InputValueWasChanged(e, str, this.name);
});


$(".textarea").keypress(function (e) {
    var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    InputValueWasChanged(e, str, this.name);
});

$(".textarea").bind("paste", function (e) {
    var str = e.originalEvent.clipboardData.getData('Text');
    InputValueWasChanged(e, str, this.name);
});

$(".textarea-sm").keypress(function (e) {
    var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    InputValueWasChanged(e, str, this.name);
});

$(".textarea-sm").bind("paste", function (e) {
    var str = e.originalEvent.clipboardData.getData('Text');
    InputValueWasChanged(e, str, this.name);
});

function InputValueWasChanged(e, str, name) {
    var regex = new RegExp(name.toLowerCase().includes("firstname") || name.toLowerCase().includes("lastname") ? "^[a-zA-Z\-\\s[\u0600-\u06ff]|[\u0750-\u077f]|[\ufb50-\ufc3f]|[\ufe70-\ufefc]-]+$" :
        name.toLowerCase().includes("phone") ? "^[0-9\-\+-]+$"
            : "^[a-zA-Z0-9@:.,_#$%!*~?\-\\s[\u0600-\u06ff]|[\u0750-\u077f]|[\ufb50-\ufc3f]|[\ufe70-\ufefc]-]+$");
    if (regex.test(str)) {
        return true;
    }
    var allowedKeyCodes = [8, 46, 9, 37, 39, 38, 40];
    if (allowedKeyCodes.indexOf(e.keyCode) !== -1
        && !(name.toLowerCase().includes("firstname") || name.toLowerCase().includes("lastname") || name.toLowerCase().includes("phone")))
        return true;
    e.preventDefault();
    return false;
}