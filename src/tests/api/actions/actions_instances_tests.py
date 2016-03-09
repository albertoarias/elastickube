"""
Copyright 2016 ElasticBox All rights reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
"""

import json
import logging
import uuid

from bson.objectid import ObjectId
from tornado import testing
from tornado.websocket import websocket_connect

from tests.api import wait_message, get_ws_request, validate_response


class ActionsInstancesTests(testing.AsyncTestCase):

    _multiprocess_can_split_ = True

    @testing.gen_test(timeout=60)
    def create_instances_test(self):
        logging.debug("Start create_instances_test")

        request = yield get_ws_request(self.io_loop)
        connection = yield websocket_connect(request)

        chart_id = str(ObjectId())
        correlation = str(uuid.uuid4())[:10]
        connection.write_message(json.dumps({
            "action": "instances",
            "operation": "create",
            "correlation": correlation,
            "body": dict(namespace="default", uid=chart_id)
        }))

        message = yield wait_message(connection, correlation)
        validate_response(
            self,
            message,
            dict(status_code=404, correlation=correlation, operation="create", action="instances", body_type=dict))

        expected_message = "Cannot find Chart %s" % chart_id
        self.assertTrue(message["body"]["message"] == expected_message,
                        "Message is %s instead of '%s'" % (message["body"]["message"], expected_message))

        connection.close()
        logging.debug("Completed create_instances_test")


if __name__ == "__main__":
    testing.main()
