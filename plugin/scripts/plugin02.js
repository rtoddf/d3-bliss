(function($) {
    $.fn.sticky = function(options) {
        var default_options = {
                'enabled': true,
                'parent': '.parent_div',
                'object': '.object_div',
                'windowTopMin': 150,
                'windowTopMax': 200,
                'adjustPosition': 20
            }

        var extended_options = $.extend(default_options, options);

		var enabled = default_options.enabled,
            sticky = $(this),
			parent = $(default_options.parent),
			object = $(default_options.object),
            windowTopMin = default_options.windowTopMin,
            windowTopMax = default_options.windowTopMax,
			adjustPosition = default_options.adjustPosition;

        if(enabled) {
            $(window).load(function() {
                var objectHeight = object.height();

                if (!!sticky.offset() && objectHeight > parent.height()) {
                    var stickyHeight = sticky.height(),
                        objectTop = object.offset().top,
                        objectBottom = objectTop + objectHeight - stickyHeight - adjustPosition,
                        stickyTop = sticky.offset().top - adjustPosition;

                    $(window).scroll(function() {
                        var windowTop = $(window).scrollTop();

                        if (windowTop > windowTopMin && windowTop < windowTopMax) {
                            objectHeight = object.height();
                            objectBottom = objectTop + objectHeight - stickyHeight - adjustPosition;
                            stickyTop = sticky.offset().top - adjustPosition;
                        }

                        if (stickyTop <= windowTop) {
                            if (objectBottom > windowTop) {
                                sticky.css({position: 'fixed', top: adjustPosition + 'px', height: stickyHeight});
                            }
                            else {
                                parent.height(objectHeight);
                                sticky.css({position: 'absolute', top: 'auto', bottom: 0, height: 'auto'});
                            }
                        }
                        else {
                            sticky.css({position: 'relative'});
                        }
                    });
                }
            });
        }
    }
})(cmg.query);



// call it
// cmg.query('.category_list').sticky({'enabled': 'true', 'parent': '.sidebar', 'object': '.article'});