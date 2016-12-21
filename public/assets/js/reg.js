$(document).ready(function () {

    //change tags
    var $cs1 = $("<span class=tag data-tag='java'>JAVA<span class='form-rem-tag glyphicon glyphicon-remove'></span></span>")
    var $cs2 = $("<span class=tag data-tag='html'>HTML<span class='form-rem-tag glyphicon glyphicon-remove'></span></span>")
    var $cs3 = $("<span class=tag data-tag='nodejs'>node js<span class='form-rem-tag glyphicon glyphicon-remove'></span></span>")
    $('#tags').prepend($cs1, $cs2, $cs3);
    var $de1 = $("<span class=tag data-tag='photoshop'>Photoshop<span class='form-rem-tag glyphicon glyphicon-remove'></span></span>")
    var $de2 = $("<span class=tag data-tag='illustrator'>Illustrator<span class='form-rem-tag glyphicon glyphicon-remove'></span></span>")
    var $de3 = $("<span class=tag data-tag='after_effect'>After Effect<span class='form-rem-tag glyphicon glyphicon-remove'></span></span>")
    var $de4 = $("<span class=tag data-tag='solid_works'>Solid Works<span class='form-rem-tag glyphicon glyphicon-remove'></span></span>")
    $('#form-degs').on('change', function () {
        $('.tag').remove()
        if ($(this).val() === 'cs' || $(this).val() === 'eng') {
            $('#tags').prepend($cs1, $cs2, $cs3);
        } else if ($(this).val() === 'vis-comm' || $(this).val() === 'ind-design') {
            $('#tags').prepend($de1, $de2, $de3, $de4);
        } else if ($(this).val() === 'cs-design') {
            $('#tags').prepend($cs1, $cs2, $cs3);
        }
    });
//


    // On submit ajax to server
    $('form').on('submit', function (e) {
        e.preventDefault();
        $('#reg_but').prop('disabled', true);
        $('.reg-loader').css('display', 'inline-block');
        if ($('#form-gender').val() === "choose") {
            modal({
                type: 'error',
                title: 'Houston, We have a problem',
                text: "You forgot to choose gender",
                animate: true
            });
            $('.reg-loader').css('display', 'none');
            $('#reg_but').prop('disabled', false);
            //password check
        } else if ($('#form-pass-ver').val() !== $('#form-pass').val()) {
            modal({
                type: 'error',
                title: 'Houston, We have a problem',
                text: "The passwords you inserted does not match, Please fix and try again",
                animate: true
            });
            $('.reg-loader').css('display', 'none');
            $('#reg_but').prop('disabled', false);
        } else {
            var tags = $('.tag');
            var JTags = {};
            $.each(tags, function (key, value) {
                JTags[key] = $(value).attr('data-tag');
            });
            var STags = {
                "tags": JTags
            };
            var formData = $(this).serializeObject();
            formData.tags = JTags;
            formData.regDate = Date();
            $.ajax({
                type: "POST",
                cache: false,
                contentType: "application/json",
                url: $(this).attr('action'),
                data: JSON.stringify(formData),
                success: function (data) {
                    modal({
                        type: 'success',
                        title: 'Success',
                        text: "You registered successfully! You will now be redirected to our Team registration platform.",
                        animate: true,
                        callback: function () {
                            window.location.replace("/login");
                        }
                    });
                },
                error: function (data) {
                    if (data.status == 409) {
                        modal({
                            type: 'error',
                            title: 'Houston, We have a problem',
                            text: "A user with this email already exists.",
                            animate: true
                        });
                        $('.reg-loader').css('display', 'none');
                        $('#reg_but').prop('disabled', false);
                    }
                    else {
                        modal({
                            type: 'error',
                            title: 'Houston, We have a problem',
                            text: "We have a problem. Please try again or contact",
                            animate: true
                        });
                        $('.reg-loader').css('display', 'none');
                        $('#reg_but').prop('disabled', false);
                    }
                }
            });
        }

    });


    // cancel enter submit form

    $(window).keydown(function (event) {
        if (event.keyCode == 13) {
            event.preventDefault();
            return false;
        }
    });
});
