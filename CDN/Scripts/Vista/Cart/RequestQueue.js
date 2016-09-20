Vista.Cart.RequestQueue = function () {
    'use strict';

    var running;
    var stop;
    var requests = [];
    var priorityRequests = [];

    return {
        enqueue: function (request, isPriority) {
            if (stop) return;
            request = $.extend(new Vista.Cart.Request(), request);

            if (isPriority === true)
                priorityRequests.push(request);
            else
                requests.push(request);

            if (!running)
                processRequest();
        },

        stop: function () {
            /// <summary>Remove non-priority requests and stop accepting further requests.</summary>
            requests.length = 0;
            stop = true;
        }
    };

    function processRequest() {
        running = true;

        if (!requests.length && !priorityRequests.length) {
            running = false;
            return;
        }

        var request = priorityRequests.length ? priorityRequests.shift() : requests.shift();

        Vista.Utilities.orderUpdateAjax(request.url,
                                        request.data,
                                        request.success,
                                        request.error,
                                        function () {
                                            request.complete.apply(undefined, arguments);
                                            queueNextTask();
                                        });
    }

    function queueNextTask() {
        setTimeout(processRequest, 100);
    }
};

Vista.Cart.Request = function () {
    'use strict';

    this.url = '';
    this.data = {}; 
    // callbacks
    this.complete = function () { };
    this.success = function () { };
    this.error = function () { };
};
