$(document).ready(function() {

    $('.council').each(function() {
        var curBlock = $(this);
        var selectVariants = [];
        curBlock.find('table tbody tr').each(function() {
            var curTR = $(this);
            var curID = curTR.data('group');
            if (!searchVariant(selectVariants, curID)) {
                var curName = curTR.data('group-name');
                selectVariants.push([curID, curName]);
            }
        });
        var curSelectHTML = '<form action="#" method="post"><div class="form-select"><select name="filter" data-placeholder="группа в совете"><option value="*" selected="selected">все группы</option>';
        for (var i = 0; i < selectVariants.length; i++) {
            curSelectHTML += '<option value="' + selectVariants[i][0] + '">' + selectVariants[i][1] + '</option>';
        }
        curSelectHTML    += '</select></form>';
        curBlock.prepend(curSelectHTML);
    });

    function searchVariant(curArray, curValue) {
        var result = false;
        for (var i = 0; i < curArray.length; i++) {
            if (curArray[i][0] == curValue) {
                result = true;
            }
        }
        return result;
    }

    $('.council select').change(function() {
        var curBlock = $(this).parents().filter('.council');
        var curID = $('.council select option:selected').attr('value');
        if (curID == '*') {
            curBlock.find('table tbody tr').fadeIn();
        } else {
            curBlock.find('table tbody tr[data-group="' + curID + '"]').fadeIn();
            curBlock.find('table tbody tr[data-group!="' + curID + '"]').fadeOut();
        }
    });

    $.validator.addMethod('maskPhone',
        function(value, element) {
            if (value == '') {
                return true;
            }
            return /^\+7 \(\d{3}\) \d{3}\-\d{2}\-\d{2}$/.test(value);
        },
        'Не соответствует формату'
    );

    $('form').each(function() {
        initForm($(this));
    });

    $('.header-menu-link').click(function(e) {
        $('html').addClass('header-menu-open');
        e.preventDefault();
    });

    $('.header-menu-close-link').click(function(e) {
        $('html').removeClass('header-menu-open');
        e.preventDefault();
    });

    var dateFormat = 'MM yy';
    $('#task-steps-month-calendar-datepicker').datepicker({
        changeMonth: true,
        changeYear: true,
        showButtonPanel: true,
        minDate: new Date(2018, 2, 1),
        maxDate: new Date(2020, 8, 1),
        dateFormat: dateFormat,
        onClose: function(dateText, inst) {
            var month = $('#ui-datepicker-div .ui-datepicker-month :selected').val();
            var year = $('#ui-datepicker-div .ui-datepicker-year :selected').val();
            $(this).datepicker('setDate', new Date(year, month, 1));
            var curForm = $('#task-steps-month-calendar-datepicker').parent();
            $.ajax({
                type: 'POST',
                url: curForm.attr('action'),
                dataType: 'html',
                data: 'month=' + month + '&year=' + year,
                cache: false
            }).done(function(html) {
                $('.task-steps-month-title, .task-steps-print-month').html($('#task-steps-month-calendar-datepicker').val());
                if ($('.task-steps-days-list').hasClass('slick-slider')) {
                    $('.task-steps-days-list').slick('unslick');
                }
                $('.task-steps-days-inner').html(html);
                $('.task-steps-days-list').slick({
                    dots: false,
                    infinite: false,
                    variableWidth: true,
                    prevArrow: '<button type="button" class="slick-prev"></button>',
                    nextArrow: '<button type="button" class="slick-next"></button>'
                });
            });
        }
    });

    var slickAnimation = false;
    $('.main-calendar-list-inner').slick({
        infinite: false,
        slidesToShow: 3,
        slidesToScroll: 3,
        initialSlide: 3,
        prevArrow: '<button type="button" class="slick-prev"></button>',
        nextArrow: '<button type="button" class="slick-next"></button>',
        dots: false,
        responsive: [
            {
                breakpoint: 1139,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    }).on('setPosition', function(event, slick) {
        if ($('.main-calendar-window').length > 0) {
            $('.main-calendar-window').remove();
        }
        $('.main-calendar-item-day.active').removeClass('active');
        if (!$('.main-calendar-list .slick-prev').hasClass('slick-disabled') && !$('.main-calendar-list .slick-next').hasClass('slick-disabled')) {
            slickAnimation = false;
            $('.main-calendar-list').removeClass('prevLoading nextLoading');
        }
        if ($('.main-calendar-list .slick-prev').hasClass('slick-disabled')) {
            if (!slickAnimation) {
                if (!$('.main-calendar-item:first').hasClass('last')) {
                    slickAnimation = true;
                    $('.main-calendar-list').addClass('prevLoading');
                    var loadURL = $('.main-calendar').data('prev-url');
                    var loadMonth = $('.main-calendar-item:first').data('month');
                    var loadYear = $('.main-calendar-item:first').data('year');
                    $.ajax({
                        type: 'POST',
                        url: loadURL,
                        dataType: 'html',
                        data: 'month=' + loadMonth + '&year=' + loadYear,
                        cache: false
                    }).done(function(html) {
                        var curLength = $('.main-calendar-item').length;
                        $('.main-calendar-list-inner').slick('slickAdd', html, true);
                        var curLength = $('.main-calendar-item').length - curLength;
                        $('.main-calendar-list-inner').slick('slickGoTo', curLength, true);
                    });
                }
            }
        }
        if ($('.main-calendar-list .slick-next').hasClass('slick-disabled')) {
            if (!slickAnimation) {
                if (!$('.main-calendar-item:last').hasClass('last')) {
                    slickAnimation = true;
                    $('.main-calendar-list').addClass('nextLoading');
                    var loadURL = $('.main-calendar').data('next-url');
                    var loadMonth = $('.main-calendar-item:last').data('month');
                    var loadYear = $('.main-calendar-item:last').data('year');
                    $.ajax({
                        type: 'POST',
                        url: loadURL,
                        dataType: 'html',
                        data: 'month=' + loadMonth + '&year=' + loadYear,
                        cache: false
                    }).done(function(html) {
                        $('.main-calendar-list-inner').slick('slickAdd', html);
                    });
                }
            }
        }
    });

    $('.task-steps-days-list').slick({
        dots: false,
        infinite: false,
        variableWidth: true,
        prevArrow: '<button type="button" class="slick-prev"></button>',
        nextArrow: '<button type="button" class="slick-next"></button>'
    });

    $('.task-menu a').click(function(e) {
        var curItem = $(this).parent();
        if (!curItem.hasClass('active')) {
            $('.task-menu li.active').removeClass('active');
            curItem.addClass('active');
            var curIndex = $('.task-menu li').index(curItem);
            $('.task-tab.active').removeClass('active');
            $('.task-tab').eq(curIndex).addClass('active');
            if ($('.task-menu ul').hasClass('slick-slider')) {
                $('.task-menu ul').slick('slickGoTo', curIndex);
            }

        }
        e.preventDefault();
    });

    $('.gallery-big').slick({
        infinite: false,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        adaptiveHeight: true,
        dots: false
    }).on('beforeChange', function(event, slick, currentSlide, nextSlide){
        $('.gallery-preview-item.active').removeClass('active');
        $('.gallery-preview-item').eq(nextSlide).addClass('active');
    });

    $('.gallery-preview-inner').slick({
        infinite: false,
        slidesToShow: 5,
        slidesToScroll: 5,
        prevArrow: '<button type="button" class="slick-prev"></button>',
        nextArrow: '<button type="button" class="slick-next"></button>',
        adaptiveHeight: true,
        dots: false,
        responsive: [
            {
                breakpoint: 1139,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3
                }
            }
        ]
    });

    $('.gallery-preview-item:first').addClass('active');

    $('.gallery-preview-item a').click(function(e) {
        var curItem = $(this).parent();
        if (!curItem.hasClass('active')) {
            $('.gallery-preview-item.active').removeClass('active');
            curItem.addClass('active');
            var curIndex = $('.gallery-preview-item').index(curItem);
            $('.gallery-big').slick('slickGoTo', curIndex);
        }
        e.preventDefault();
    });

    $('.up-link a').click(function(e) {
        $.scrollTo(0, {duration : 500});
        e.preventDefault();
    });

    $('body').on('click', '.window-link', function(e) {
        var curLink = $(this);
        windowOpen(curLink.attr('href'));
        e.preventDefault();
    });

    $('body').on('keyup', function(e) {
        if (e.keyCode == 27) {
            windowClose();
        }
    });

    $(document).click(function(e) {
        if ($(e.target).hasClass('window')) {
            windowClose();
        }
    });

    $(window).resize(function() {
        windowPosition();
    });

    $('body').on('click', '.window-close', function(e) {
        windowClose();
        e.preventDefault();
    });

    $('.challenges-item-header').click(function(e) {
        var curBlock = $(this).parents().filter('.challenges-item');
        curBlock.toggleClass('open');
        curBlock.find('.challenges-item-more').slideToggle();
        e.preventDefault();
    });

    $('.programms').each(function() {
        var curBlock = $(this);

        var curFilter = curBlock.find('.programms-menu li.active a').data('filter');
        curBlock.find('.programms-list').isotope({
            itemSelector: '.programms-item',
            filter: curFilter
        });
        if (curFilter != '*' && curBlock.find('.programms-item' + curFilter).length == 0) {
            curBlock.find('.programms-list-empty').show();
        } else {
            curBlock.find('.programms-list-empty').hide();
        }
    });

    $('.programms-menu li a').click(function(e) {
        var curLi = $(this).parent();
        var curBlock = curLi.parents().filter('.programms');
        if (!curLi.hasClass('active')) {
            curBlock.find('.programms-menu li.active').removeClass('active');
            var curFilter = $(this).data('filter');
            curBlock.find('.programms-list').isotope({
                filter: curFilter
            });
            curLi.addClass('active');
            if (curFilter != '*' && curBlock.find('.programms-item' + curFilter).length == 0) {
                curBlock.find('.programms-list-empty').show();
            } else {
                curBlock.find('.programms-list-empty').hide();
            }
        }
        e.preventDefault();
    });

    $('.similars-link a').click(function(e) {
        var curBlock = $(this).parents().filter('.similars');
        curBlock.toggleClass('open');
        curBlock.find('.similars-list').slideToggle();
        e.preventDefault();
    });

    $('.nioktr-item-link').click(function(e) {
        var curBlock = $(this).parent();
        if (curBlock.hasClass('open')) {
            curBlock.removeClass('open');
            curBlock.find('.nioktr-item-content').slideUp();
        } else {
            if ($('.nioktr-item.open').length > 0) {
                $('.nioktr-item.open').find('.nioktr-item-content').slideUp(function() {
                    $('.nioktr-item.open').removeClass('open');
                    curBlock.addClass('open');
                    curBlock.find('.nioktr-item-content').slideDown();
                });
            } else {
                curBlock.addClass('open');
                curBlock.find('.nioktr-item-content').slideDown();
            }
        }
        e.preventDefault();
    });

    $('body').on('click', '.main-calendar-item-day-link', function(e) {
        var curDay = $(this).parent();
        if (curDay.hasClass('active')) {
            if ($('.main-calendar-window').length > 0) {
                $('.main-calendar-window').remove();
            }
            curDay.removeClass('active');
        } else {
            if ($('.main-calendar-window').length > 0) {
                $('.main-calendar-window').remove();
            }
            $('.main-calendar-item-day.active').removeClass('active');
            curDay.addClass('active');
            $('.wrapper').append('<div class="main-calendar-window">' + curDay.find('.main-calendar-item-day-content').html() + '</div>');
            var curWindow = $('.main-calendar-window');
            curWindow.css({'left': curDay.offset().left, 'top': curDay.offset().top - $('.wrapper').offset().top});
            if (curWindow.offset().left + curWindow.outerWidth() > $('.wrapper').width()) {
                curWindow.addClass('right');
            }
            curWindow.find('.main-calendar-window-list-inner').jScrollPane({
                autoReinitialise: true
            });
        }
        e.preventDefault();
    });

    $(document).click(function(e) {
        if ($(e.target).parents().filter('.main-calendar-window').length == 0 && !$(e.target).hasClass('main-calendar-window') && !$(e.target).hasClass('main-calendar-item-day-link')) {
            if ($('.main-calendar-window').length > 0) {
                $('.main-calendar-window').remove();
            }
            $('.main-calendar-item-day.active').removeClass('active');
        }
    });

    $('.header-search-link').click(function(e) {
        $(this).parents().filter('.header-search').addClass('open');
        e.preventDefault();
    });

    $('.header-search-close').click(function(e) {
        $(this).parents().filter('.header-search').find('.header-search-input input').val('');
        $(this).parents().filter('.header-search').removeClass('open');
        e.preventDefault();
    });

    $(document).click(function(e) {
        if ($(e.target).parents().filter('.header-search').length == 0) {
            $('.header-search').removeClass('open');
        }
    });

    $('.indicators-group-header').click(function(e) {
        var curBlock = $(this).parents().filter('.indicators-group');
        curBlock.toggleClass('open');
        curBlock.find('.indicators-group-inner').slideToggle();
        e.preventDefault();
    });

    $('.indicators-group-inner-parent').click(function() {
        $(this).parent().find('ul').slideToggle();
    });

    $('a.indicators-tree-group-item-header-inner').click(function(e) {
        var curBlock = $(this).parents().filter('.indicators-tree-group-item').eq(0);
        curBlock.toggleClass('open');
        curBlock.find('.indicators-tree-group-item-list').eq(0).slideToggle();
        if (curBlock.hasClass('open')) {
            $.scrollTo(curBlock.find('.indicators-tree-group-item-list').eq(0), {duration : 500});
        }
        e.preventDefault();
    });

    $('.indicators-select-value').click(function(e) {
        $(this).parent().toggleClass('open');
    });

    $(document).click(function(e) {
        if ($(e.target).parents().filter('.indicators-select-field').length == 0) {
            $('.indicators-select-field').removeClass('open');
        }
    });

    $('.indicators-select-list a').click(function(e) {
        $('.indicators-select-field').removeClass('open');
        var curValue = $(this).attr('data-indicator-id');
        var curBlock = $('#indicators-item-' + curValue);
        if (curBlock.length > 0) {
            $('.indicators-tree-group-item.open').removeClass('open');
            $('.indicators-tree-group-item-list').hide();
            curBlock.addClass('open');
            curBlock.find('.indicators-tree-group-item-list').eq(0).show();
            curBlock.parents().filter('.indicators-tree-group-item').addClass('open');
            curBlock.parents().filter('.indicators-tree-group-item').each(function() {
                $(this).find('.indicators-tree-group-item-list').eq(0).show();
            });
            window.setTimeout(function() {
                $.scrollTo(curBlock, {duration : 500});
            }, 100);

        }
        e.preventDefault();
    });

    if (window.location.hash != '') {
        $('a[data-indicator-id="' + window.location.hash.replace('#', '') + '"]').click();
    }

    $('#indicator-select-other').change(function() {
        var curValue = $(this).find('option:selected').attr('value');
        window.location.href = curValue;
    });

    $('.main-subscribe-field .form-input input').focus(function() {
        $('.main-subscribe .form-checkbox').slideDown();
    });

    $('.header-menu-col-title a').click(function(e) {
        if ($(window).width() < 1140) {
            $(this).parent().toggleClass('open');
            e.preventDefault();
        }
    });

    $(window).on('load resize scroll', function() {
        $('.main-splash-item, .directions-item, .tasks-item, .challenges-item, .indicators-group').each(function() {
            var curBlock = $(this);
            if (!curBlock.hasClass('on-scroll-visible')) {
                if (curBlock.offset().top + curBlock.outerHeight() / 2 < $(window).scrollTop() + $(window).height()) {
                    curBlock.addClass('on-scroll-visible');
                }
            }
        });
    });

});

$(window).on('load resize scroll', function() {
    if ($(window).scrollTop() > $(window).height()) {
        $('.up-link').addClass('visible');
    } else {
        $('.up-link').removeClass('visible');
    }
    var curDiff = $(window).scrollTop() + $(window).height() - $('footer').offset().top - 60;
    if (curDiff > 0) {
        $('.up-link').css({'margin-bottom': curDiff});
    } else {
        $('.up-link').css({'margin-bottom': 0});
    }
});

$(window).on('load', function() {
    if ($('.header-submenu-2').length > 0) {
        if ($('.header-submenu-2-inner').hasClass('slick-slider')) {
            $('.header-submenu-2-inner').slick('unslick');
        }
        var curWidth = 0;
        $('.header-submenu-2-item').each(function() {
            curWidth += $(this).width();
        });
        if (curWidth > $('.header-submenu-2-wrap').width()) {
            var curIndex = $('.header-submenu-2-item').index($('.header-submenu-2-item.active'));
            if (curIndex < 0) {
                curIndex = 0;
            }
            $('.header-submenu-2-inner').slick({
                dots: false,
                infinite: false,
                variableWidth: true,
                prevArrow: '<button type="button" class="slick-prev"></button>',
                nextArrow: '<button type="button" class="slick-next"></button>',
                initialSlide: curIndex,
                responsive: [
                    {
                        breakpoint: 768,
                        settings: {
                            slidesToShow: 1,
                            slidesToScroll: 1,
                            variableWidth: false
                        }
                    }
                ]
            });
        }
    }
});

$(window).on('resize', function() {
    $('.form-select select').chosen('destroy');
    $('.form-select select').chosen({disable_search: true, placeholder_text_multiple: ' ', no_results_text: 'Нет результатов'});
    $('.form-select select').each(function() {
        var curSelect = $(this);
        if (curSelect.data('placeholder') != '') {
            curSelect.parent().find('.chosen-single').prepend('<strong>' + curSelect.data('placeholder') + '</strong>');
        }
    });
});

$(window).bind('load resize', function() {
    if ($('.task-menu').length > 0) {
        if ($(window).width() < 1140) {
            var curIndex = $('.task-menu ul li').index($('.task-menu ul li.active'));
            if (curIndex < 0) {
                curIndex = 0;
            }
            if (!$('.task-menu ul').hasClass('slick-slider')) {
                $('.task-menu ul').slick({
                    infinite: false,
                    arrows: false,
                    initialSlide: curIndex,
                    dots: false,
                    variableWidth: true
                });
            }
        } else {
            if ($('.task-menu ul').hasClass('slick-slider')) {
                $('.task-menu ul').slick('unslick');
            }
        }
    }
});

function initForm(curForm) {
    curForm.find('input.maskPhone').mask('+7 (999) 999-99-99');

    curForm.find('.form-input input, .form-input textarea').each(function() {
        if ($(this).val() != '') {
            $(this).parent().addClass('focus');
        }
    });

    curForm.find('.form-input input, .form-input textarea').focus(function() {
        $(this).parent().addClass('focus');
    });

    curForm.find('.form-input input, .form-input textarea').blur(function() {
        if ($(this).val() == '') {
            $(this).parent().removeClass('focus');
        }
    });

    curForm.find('.form-select select').chosen({disable_search: true, no_results_text: 'Нет результатов'});
    curForm.find('.form-select select').each(function() {
        var curSelect = $(this);
        if (curSelect.data('placeholder') != '') {
            curSelect.parent().find('.chosen-single').prepend('<strong>' + curSelect.data('placeholder') + '</strong>');
        }
    });


    curForm.find('.form-file input').change(function() {
        var curInput = $(this);
        var curField = curInput.parent().parent().parent().parent();
        curField.find('.form-file-name').html(curInput.val().replace(/.*(\/|\\)/, ''));
        curField.find('label.error').remove();
        curField.removeClass('error');
    });

    curForm.validate({
        ignore: '',
        invalidHandler: function(form, validatorcalc) {
            validatorcalc.showErrors();
            checkErrors();
        }
    });
}

function checkErrors() {
    $('.form-checkbox, .form-file').each(function() {
        var curField = $(this);
        if (curField.find('input.error').length > 0) {
            curField.addClass('error');
        } else {
            curField.removeClass('error');
        }
        if (curField.find('input.valid').length > 0) {
            curField.addClass('valid');
        } else {
            curField.removeClass('valid');
        }
    });

    $('.form-select').each(function() {
        var curField = $(this).parent().parent();
        if (curField.find('select.error').length > 0) {
            curField.addClass('error');
        } else {
            curField.removeClass('error');
        }
        if (curField.find('select.valid').length > 0) {
            curField.addClass('valid');
        } else {
            curField.removeClass('valid');
        }
    });
}

function windowOpen(linkWindow, dataWindow, callbackWindow) {
    $('html').addClass('window-open');

    if ($('.window').length == 0) {
        $('body').append('<div class="window"><div class="window-loading"></div></div>')
    }

    $.ajax({
        type: 'POST',
        url: linkWindow,
        dataType: 'html',
        data: dataWindow,
        cache: false
    }).done(function(html) {
        if ($('.window').length > 0) {
            $('.window').remove();
        }
        $('body').append('<div class="window"><div class="window-loading"></div></div>')

        $('.window').append('<div class="window-container window-container-load"><div class="window-content">' + html + '<a href="#" class="window-close"></a></div></div>')

        if ($('.window-container img').length > 0) {
            $('.window-container img').each(function() {
                $(this).attr('src', $(this).attr('src'));
            });
            $('.window-container').data('curImg', 0);
            $('.window-container img').one('load', function() {
                var curImg = $('.window-container').data('curImg');
                curImg++;
                $('.window-container').data('curImg', curImg);
                if ($('.window-container img').length == curImg) {
                    $('.window-container').removeClass('window-container-load');
                    windowPosition();
                }
            });
        } else {
            $('.window-container').removeClass('window-container-load');
            windowPosition();
        }

        if (typeof (callbackWindow) != 'undefined') {
            callbackWindow.call();
        }

        $('.window .gallery-big').slick({
            infinite: false,
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: false,
            adaptiveHeight: true,
            dots: false
        }).on('beforeChange', function(event, slick, currentSlide, nextSlide){
            $('.window .gallery-preview-item.active').removeClass('active');
            $('.window .gallery-preview-item').eq(nextSlide).addClass('active');
        });

        $('.window .gallery-preview-inner').slick({
            infinite: false,
            slidesToShow: 5,
            slidesToScroll: 5,
            prevArrow: '<button type="button" class="slick-prev"></button>',
            nextArrow: '<button type="button" class="slick-next"></button>',
            adaptiveHeight: true,
            dots: false,
            responsive: [
                {
                    breakpoint: 1139,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 3
                    }
                }
            ]
        });

        $('.window .gallery-preview-item:first').addClass('active');

        $('.window .gallery-preview-item a').click(function(e) {
            var curItem = $(this).parent();
            if (!curItem.hasClass('active')) {
                $('.window .gallery-preview-item.active').removeClass('active');
                curItem.addClass('active');
                var curIndex = $('.window .gallery-preview-item').index(curItem);
                $('.window .gallery-big').slick('slickGoTo', curIndex);
            }
            e.preventDefault();
        });

        $('.window form').each(function() {
            initForm($(this));
        });
    });
}

function windowPosition() {
    if ($('.window').length > 0) {
        $('.window-container').css({'left': '50%', 'margin-left': -$('.window-container').width() / 2});

        $('.window-container').css({'top': '50%', 'margin-top': -$('.window-container').height() / 2, 'padding-bottom': 0});
        if ($('.window-container').height() > $('.window').height() - 60) {
            $('.window-container').css({'top': '30px', 'margin-top': 0, 'padding-bottom': 30});
        }
    }
}

function windowClose() {
    if ($('.window').length > 0) {
        $('.window').remove();
        $('html').removeClass('window-open');
    }
}