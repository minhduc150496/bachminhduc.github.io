var isMouseDown = false,
    scratchJsFlashArray = [];

function percent(p) {
    document.getElementById("counter").innerHTML = p;
}

function callback(p, e) {
    $('#modalInfo').modal('show');
    isMouseDown = false;
}

$(document).on('show.bs.modal', '#modalInfo', function () {
    $('#giftName').html( "Giảm giá 100% cho nước ép dưa lê khi đặt ngay bây giờ");
    $('#giftImg').attr('src', "images/s-back.jpg");
});

$(document).on('submit', '#customer-info-form', function (e) {
    e.preventDefault();
    $('#btnSend').hide();
    $('input[name="GiftID"]').val(14);
    var formData = new FormData(document.getElementById('customer-info-form'));
    formData.append("code", $('#code-entered').val());
    formData.append("key", $('#game-key').val());
	formData.append("gender", $('#gender').val() == "1");
    $('#loading-image').fadeIn(40, function () {
        $.ajax({
            type: "POST",
            url: '/Home/SubmitInfo',
            data: formData,
            success: function (respond) {
                var isEnableShareFb = ($('#isEnableShareFb').val() == "true");
                var fbMess = "";
                var confirmBtn = "OK";
                if (isEnableShareFb) {
                    fbMess = "Hãy cùng chia sẻ với bạn nhé.";
                    confirmBtn = "Yes, share it!";
                }
                if (respond.success) {
                    swal({
                        title: "",
                        text: respond.message + ". " + fbMess,
                        type: "success",
                        showCancelButton: isEnableShareFb,
                        confirmButtonText: confirmBtn,
                        cancelButtonText: "No",
                        closeOnConfirm: false,
                        showLoaderOnConfirm: true,
                    }, function (isOk) {
                        if (!isOk) {
                            window.location.replace("http://www.uraetei-yakiniku.com.vn/");
                        } else {
                            setTimeout(function () {
                                if (isEnableShareFb) {
                                    FB.login(function (response) {
                                        swal({
                                            title: "",
                                            text: "Status của bạn là...",
                                            type: "input",
                                            showCancelButton: false,
                                            closeOnConfirm: false,
                                            animation: "slide-from-top",
                                            inputPlaceholder: "Write something"
                                        }, function (inputValue) {
                                            if (inputValue === false) return false;
                                            if (inputValue === "") {
                                                swal.showInputError("You need to write something!");
                                                return false;
                                            } else {
                                                postfb(inputValue);
                                            }


                                        });
                                    }, { scope: 'public_profile,email,publish_actions' });

                                } else {
                                    window.location.replace("http://www.uraetei-yakiniku.com.vn/");

                                }
                            }, 800);
                        }
                    });
                } else {
                    swal({
                        title: "",
                        text: respond.message,
                        type: "warning",
                        showCancelButton: false,
                        closeOnConfirm: false,
                        showLoaderOnConfirm: true,
                    }, function () {
                        setTimeout(function () {
                            window.location.replace("http://www.uraetei-yakiniku.com.vn/");
                        }, 800);
                    });
                }

                $('#btnSend').show();
                $('#loading-image').fadeOut(40);


            },
            async: false,
            cache: false,
            contentType: false,
            processData: false,
            error: function (error) {
                sweetAlert("Oops...", "Có lỗi xảy ra, vui lòng kiểm tra kết nối mạng.", "error");
                $('#modalInfo').modal('hide');
                setTimeout(function () { $('#modalInfo').modal('show'); }, 500);
            }
        });
    });

});

require.config({
    paths: {
        domReady: 'https://cdnjs.cloudflare.com/ajax/libs/require-domReady/2.0.1/domReady.min',
        scratchcard: 'dist/scratchcard-standalone'
    }
});