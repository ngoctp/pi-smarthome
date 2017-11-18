function replaceTemplate(string, replacements) {
    for (var key in replacements) {
        string = replaceAll(string, '${' + key + '}', replacements[key]);
    }

    return string;
};

function escapeRegExp(str) {
    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

(function ($) {
    var socket = io(); //load socket.io-client and connect to the host that serves the page
    socket.on('pin/list', function (data) { //get button status from client
        $('.pin-list .list').empty();
        var rowTemplate = $('#pin-list-row-template').text();
        data.forEach(function (pin) {
            var html = replaceTemplate(rowTemplate, {
                name: pin.name,
                pin: pin.pin,
                checked: pin.enabled ? 'checked' : ''
            });
            $('.pin-list .list').append(html);
        });
        $('.pin-list .list input[type="checkbox"]').bootstrapSwitch();
    });

    $('.pin-list .list').on('switchChange.bootstrapSwitch', 'input[type="checkbox"]', function(event, state) {
        var pin = $(this).data('pin');
        socket.emit('pin/enable', {
            pin: pin,
            enabled: this.checked
        });
    });

    // $('.pin-list .list').on('click', 'input[type="checkbox"]', function (e) {
    //     var pin = $(this).data('pin');
    //     socket.emit('pin/enable', {
    //         pin: pin,
    //         enabled: this.checked
    //     });
    // });

})(jQuery);