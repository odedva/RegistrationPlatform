$(document).ready(function () {

    //cancel enter key
    $(window).keydown(function (event) {
        if (event.keyCode == 13) {
            event.preventDefault();
            return false;
        }
    });
    currentMember = [true, false, false, false, false];
    if ($('#members_list').data('amount') !== undefined) {
        for (var i = 0; i < $('#members_list').data('amount'); i++) {
            currentMember[i] = true;
        }
    }
    $('#add_mem').on('click', function () {
        for (var i = 0; i < maxMembers; i++) {
            if (!currentMember[i]) {
                $('#form-members-' + i).css('display', 'inline-block');
                $('#mem_rem_' + i).css('display', 'inline-block');
                currentMember[i] = true;
                break;
            }
        }
        if (i === maxMembers) {
            alert('There is a limit of overall ' + Number(maxMembers + 1) + ' team members.')
        }
    });

    $('.fa-user-times').on('click', function () {
        var mem_id = $(this).prop('id').slice(-1);
        $('#form-members-' + mem_id).css('display', 'none').val("");
        $('#mem_rem_' + mem_id).css('display', 'none');
        $('.mem-check' + mem_id).css('display', 'none');
        $('.mem-warn' + mem_id).css('display', 'none');
        $('.warn-text' + mem_id).text("");
        currentMember[mem_id] = false;
    });

    $('.form-member-name').focusout(function () {
        var mem_id = $(this).prop('id').slice(-1);
        $('.mem-check' + mem_id).css('display', 'none');
        $('.mem-warn' + mem_id).css('display', 'none');
        $('.warn-text' + mem_id).text("");
        if ($(this).val() !== "") {
            var mem = $(this).val();
            if ($(this).val() === $("input[name='team_admin_email']").val() || $(this).val() === $("input[name='admin_email']").val()) {
                $('.warn-text' + mem_id).text("You don't need to add your own email (You are the captain of this team).");
                $('.mem-loader' + mem_id).css('display', 'none');
                $('.mem-warn' + mem_id).css('display', 'inline-block');
                return;
            }
            $('.mem-loader' + mem_id).css('display', 'inline-block');
            $.ajax({
                url: "/users/" + $(this).val(), success: function (user) {
                    /*
                     if (!user.accepted){
                     $('.warn-text'+mem_id).text("This user does not exist.");
                     $('.mem-loader'+mem_id).css('display','none');
                     $('.mem-warn'+mem_id).css('display','inline-block');
                     }
                     */
                    if (user.isMember && user.team !== $("input[name='team_id']").val()) {
                        $('.warn-text' + mem_id).text("This user is already a member in a different team.");
                        $('.mem-loader' + mem_id).css('display', 'none');
                        $('.mem-warn' + mem_id).css('display', 'inline-block');
                    } else {
                        $('.mem-loader' + mem_id).css('display', 'none');
                        $('.mem-check' + mem_id).css('display', 'inline-block');
                    }
                }, error: function (err) {
                    $('.mem-loader' + mem_id).css('display', 'none');
                    $('.mem-warn' + mem_id).css('display', 'inline-block');
                    $('.warn-text' + mem_id).text("This user does not exist.");
                }
            });

        }

    });


    //create ajax call delete team
    $("#deleteTeamClk").click(function (e) {
        e.preventDefault();
        $('#deleteTeamClk').attr('disabled', true);
        $('#submit_update').attr('disabled', true);
        $('.mem-loader-form').css('display', 'inline-block');
        if (window.confirm("Are you sure?")) {
            var teamId = $('#deleteTeamClk').data('teamid');
            var userEmail = $('#deleteTeamClk').data('useremail');
            console.log({'admin_email': userEmail});
            $.ajax({
                data: {'admin_email': userEmail}, type: 'DELETE', url: "/teams/" + teamId, success: function (result) {
                    modal({
                        type: 'success',
                        title: 'Success',
                        text: "Your team was deleted. Click OK to redirect to homepage",
                        animate: true,
                        callback: function () {
                            location.reload();
                        }
                    });
                }, error: function (e) {
                    $('#deleteTeamClk').attr('disabled', false);
                    $('#submit_update').attr('disabled', false);
                    $('.mem-loader-form').css('display', 'none');
                    console.log(e);
                }
            });
        } else {
            $('#deleteTeamClk').attr('disabled', false);
            $('#submit_update').attr('disabled', false);
            $('.mem-loader-form').css('display', 'none');
        }
    });

    //create team ajax call Update team
    $('#submit_update').on('click', function (e) {
        var f = document.getElementsByTagName('form')[0];
        if (!f.checkValidity()) {
            f.find(':submit').click()
            return;
        }
        $('#submit_update').attr('disabled', true);
        $('#deleteTeamClk').attr('disabled', true);
        $('.mem-loader-form').css('display', 'inline-block');
        var form = $('#form-team-update');
        var tags = $('.tag');
        var JTags = {};
        $.each(tags, function (key, value) {
            JTags[key] = $(value).attr('data-tag');
        });
        var mems = $('.form-member-name');
        var Jmems = [];
        $.each(mems, function (key, value) {
            if ($(value).val() !== "") {
                Jmems.push($(value).val());
            }
        });
        var formData = form.serializeObject();
        Jmems.push(formData.admin_email);
        console.log(formData.isClosed);
        if (formData.isClosed == "true") {
            formData.isClosed = true;
        } else {
            formData.isClosed = false;
        }


        formData.tags = JTags;
        formData.members = Jmems;
        formData.openDate = Date();
        $.ajax({
            type: "PUT",
            cache: false,
            contentType: "application/json",
            url: form.attr('action'),
            data: JSON.stringify(formData),
            success: function (data) {
                modal({
                    type: 'success',
                    title: 'Success',
                    text: "Your Team has been updated successfully.",
                    animate: true,
                    callback: function () {
                        window.location.replace("/team-up");
                    }
                });
            },
            error: function (data) {
                console.log("in error")
                if (data.responseJSON.status !== undefined) {
                    modal({
                        type: 'error',
                        title: 'Houston, We have a problem',
                        text: data.responseJSON.status,
                        animate: true
                    });
                    $('#submit_update').attr('disabled', false);
                    $('#deleteTeamClk').attr('disabled', false);
                    $('.mem-loader-form').css('display', 'none');
                }
                else {
                    modal({
                        type: 'error',
                        title: 'Houston, We have a problem',
                        text: "We have a problem. Please try again or contact our support",
                        animate: true
                    });
                    $('#submit_update').attr('disabled', false);
                    $('#deleteTeamClk').attr('disabled', false);
                    $('.mem-loader-form').css('display', 'none');
                }
                console.log(data);
            }
        });
    });

    if ($('#isClosed').val() === 'true') {
        $('#wrap-lookingText').css('display', 'none');
        $('#moreMembersInfo').css('display', 'none')

    }

    $('#isClosed').on('change', function () {
        if ($(this).val() === 'false') {
            $('#wrap-lookingText').css('display', 'block');
            $('#moreMembersInfo').css('display', 'block');
            $('#form-lookingText').prop('required', true);
        } else {
            $('#wrap-lookingText').css('display', 'none');
            $('#moreMembersInfo').css('display', 'none');
            $('#form-lookingText').prop('required', false);
        }
    });
});