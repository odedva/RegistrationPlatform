jQuery(document).ready(function () {
    //cancel enter
    $(window).keydown(function (event) {
        if (event.keyCode == 13) {
            event.preventDefault();
            return false;
        }
    });
    /*
     Fullscreen background
     */
    $.backstretch("assets/img/backgrounds/1.jpg");

    $('#top-navbar-1').on('shown.bs.collapse', function () {
        $.backstretch("resize");
    });
    $('#top-navbar-1').on('hidden.bs.collapse', function () {
        $.backstretch("resize");
    });

    /*
     Form validation
     */
    $('.registration-form input[type="text"], .registration-form textarea').on('focus', function () {
        $(this).removeClass('input-error');
    });

    $('.registration-form').on('submit', function (e) {

        $(this).find('input[type="text"], textarea').each(function () {
            if ($(this).val() == "") {
                e.preventDefault();
                $(this).addClass('input-error');
            }
            else {
                $(this).removeClass('input-error');
            }
        });

    });


//form JSON object wrapper
    $.fn.serializeObject = function () {
        var o = {};
        var a = this.serializeArray();
        $.each(a, function () {
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            }
            else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };


    // handle skill tags in form
    $(function () {

        $('#tags input').on('focusout', function () {
            var txt = this.value.replace(/[^a-zA-Z0-9\+\-\.\#]/g, ''); // allowed characters
            if (txt) {
                $(this).before('<span class="tag" data-tag=' + txt.toLowerCase() + '>' + txt.toLowerCase() + '<span class="form-rem-tag glyphicon glyphicon-remove"></span></span>');
            }
            this.value = "";
        }).on('keyup', function (e) {
            // if: comma,enter (delimit more keyCodes with | pipe)
            if (/(188|13)/.test(e.which)) $(this).focusout();

        });


        $('#tags').on('click', '.tag', function () {
            $(this).remove();
        });

    });
    $('[data-tooltip!=""]').qtip({ // Grab all elements with a non-blank data-tooltip attr.
        content: {
            attr: 'data-tooltip', // Tell qTip2 to look inside this attr for its content
        }
    });

    $('input[name=isAccepted]').click(function () {
        var email = $('#' + $(this)[0].id).data('email');
        console.log($(this).is(":checked"));
        $.ajax({
            url: '/users/' + $(this).attr('id'),
            type: 'PUT',
            data: {accepted: $(this).is(":checked")},
            success: function (data) {
                if (data.status === 'ok') {
                    alert("user changed");
                    $(this).attr("checked", $(this).is(":checked"));
                } else {
                    alert("cant update user");
                }
            },
            error: function (jqXHR) {
                console.log(jqXHR.responseText + ' :: ' + jqXHR.statusText);
            }
        });
    });

    $('input[name=isMember]').click(function () {
        $.ajax({
            url: '/users/' + $(this).data('uid'),
            type: 'PUT',
            data: {isMember: $(this).is(":checked")},
            success: function (data) {
                if (data.status === 'ok') {
                    alert("user changed");
                    $(this).attr("checked", $(this).is(":checked"));
                } else {
                    alert("cant update user");
                }
            },
            error: function (jqXHR) {
                console.log(jqXHR.responseText + ' :: ' + jqXHR.statusText);
            }
        });
    });


    $('#loginClk').on('click', function () {
        $(this).css("display", "none");
        $('#signinRow').css("display", "block");
    });

});
