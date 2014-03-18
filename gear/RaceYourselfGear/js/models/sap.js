/*global define, $, console, tizen, webapis, alert*/
/*jslint regexp: true*/

/**
 * SAP module
 */

define({
    name: 'models/sap',
    requires: [
        'core/event'
    ],
    def: function modelsSAP(e) {
        'use strict';

        var socket = null;

        /**
         * Check if SAP socket is connected
         */
        function isConnected() {
            return (socket !== null);
        }

        /**
         * Parse message object to JSON and send to SAP socket
         * @param {object} params
         */
        function sendData(channel, params) {
            if (!socket) {
                console.error('Connect first!');
                return false;
            }

            socket.sendData(channel, JSON.stringify(params));
        }

        /**
         * On send data receive success
         * @param {number} channel
         * @param {object} messageJSON
         */
        function onSendDataSuccess(channel, messageJSON) {
            var message = JSON.parse(messageJSON);

            e.fire('models.sap.' + message.messageType, {
                channel: channel,
                message: message
            });
        }

        /**
         * On send data receive error
         * @param {object} err
         */
        function onSendDataError(err) {
            e.fire('models.sap.sendData.error', err);
        }

        /**
         * On service connection response
         * @param {object} sock
         */
        function onServiceConnect(sock) {
            sock.setDataReceiveListener(onSendDataSuccess);
            sock.setSocketStatusListener(onSendDataError);
            socket = sock;
            e.fire('models.sap.init', {status: true});
        }

        /**
         * On connect success
         * @param {object} agent
         */
        function onConnectSuccess(agents) {
            var agent = agents[0];

            agent.setServiceConnectionListener({
                onconnect: onServiceConnect
            });

            agent.setPeerAgentFindListener({
                onpeeragentfound: function onpeeragentfound(peerAgent) {
                    agent.requestServiceConnection(peerAgent);
                },
                onerror: function onerror() {
                    console.error('failed to find peerAgents');
                }
            });

            agent.findPeerAgents();
        }

        /**
         * On connect error
         * @param {object} err
         */
        function onConnectError(err) {
            e.fire('models.sap.init', {
                status: false,
                data: err
            });
        }

        /**
         * Connection init
         */
        function connect() {
            if (socket) {
                console.log('Already connected!');
                return false;
            }

            if (window.navigator.platform.indexOf('emulated') !== -1) {
                alert('SAP works only on Target. Please run this on Target.');
                tizen.application.getCurrentApplication().exit();
                return;
            }

            try {
                webapis.sa.requestSAAgent(onConnectSuccess, onConnectError);
            } catch (e) {
                console.warn('webapis.sa.requestSAAgent failed: ' + e.message);
            }
        }

        return {
            connect: connect,
            sendData: sendData,
            isConnected: isConnected
        };
    }

});
