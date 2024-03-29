/**
 * Copyright (c) 2014 RaceYourself Inc
 * All Rights Reserved
 *
 * No part of this application or any of its contents may be reproduced, copied, modified or 
 * adapted, without the prior written consent of the author, unless otherwise indicated.
 * 
 * Commercial use and distribution of the application or any part is not allowed without express 
 * and prior written consent of the author.
 * 
 * The application makes use of some publicly available libraries, some of which have their own 
 * copyright notices and licences. These notices are reproduced in the Open Source License 
 * Acknowledgement file included with this software.
 */

/*global define, $, console, window, history, document*/

/**
 * Main page module
 */

define({
    name: 'views/page/setdistance',
    requires: [
        'core/event',
        'models/race',
        'models/settings',
        'models/sap',
        'views/page/pregame',
        'views/page/no-bluetooth'
    ],
    def: function viewsPageSetDistance(req) {
        'use strict';

        var e = req.core.event,
            race = req.models.race,
            sap = req.models.sap,
            settings = req.models.settings,
            page = null,
            d = 100,
            holdInterval = false,
            increment = 100,
            valueEl = null;

        function show() {
            gear.ui.changePage('#setdistance');
        }

        function onPageShow() {
            d = settings.getDistance();
            var dsu = '&nbsp;km&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;m';
            if (settings.getDistanceUnits() == 'Miles') {
            	dsu = '&nbsp;miles';
            }
            document.getElementById('distance-setter-units').innerHTML = dsu;
            render();
            e.listen('tizen.back', onBack);
        }
        
        function onPageHide() {
        	e.die('tizen.back', onBack);
        }
        
        function onBack() {
            history.back();
        }
        
        function render() {
            d = Math.max(100, d);
            d = Math.min(99900, d);
            valueEl.innerHTML = Number(d/1000).toFixed(1);
        }
        
        function onMinus() {
            increment = 100;
            d -= increment;
            render();
            clearInterval(holdInterval);
            holdInterval = setInterval(function() {
                d -= increment;
                increment = Math.min(1000, increment + 100);
                render();
            }, 250);
        }

        function onPlus() {
            increment = 100;
            d += increment;
            render();
            clearInterval(holdInterval);
            holdInterval = setInterval(function() {
                d += increment;
                increment = Math.min(1000, increment + 100);
                render();
            }, 250);
        }
        
        function onHalt() {
            clearInterval(holdInterval);
        }
        
        function onOk() {
        	var distance = d;
            if (settings.getDistanceUnits() == 'Miles') {
            	distance = distance / 1000;
            }
            settings.setDistance(distance);
            if(sap.isConnected() || !sap.isAvailable()) {
            	e.fire('pregame.show');
            } else {
            	e.fire('no-bluetooth.show');
            }
            
        }

        function bindEvents() {
            var minusBtnEl = document.getElementById('distance-minus'),
                plusBtnEl = document.getElementById('distance-plus'),
                okBtnEl = document.getElementById('distance-ok');

            valueEl = document.getElementById('distance-value');
            
            page.addEventListener('pageshow', onPageShow);
            page.addEventListener('pagehide', onPageHide);
            minusBtnEl.addEventListener('mousedown', onMinus);
            plusBtnEl.addEventListener('mousedown', onPlus);
            minusBtnEl.addEventListener('mouseup', onHalt);
            plusBtnEl.addEventListener('mouseup', onHalt);
            minusBtnEl.addEventListener('touchstart', function(ev) { onMinus(ev); ev.stopPropagation(); ev.preventDefault(); });
            plusBtnEl.addEventListener('touchstart', function(ev) { onPlus(ev); ev.stopPropagation(); ev.preventDefault(); });
            minusBtnEl.addEventListener('touchend', onHalt);
            plusBtnEl.addEventListener('touchend', onHalt);
            minusBtnEl.addEventListener('touchcancel', onHalt);
            plusBtnEl.addEventListener('touchcancel', onHalt);
            okBtnEl.addEventListener('click', onOk);
        }

        function init() {
            page = document.getElementById('setdistance');
            bindEvents();
        }

        e.listeners({
            'setdistance.show': show
        });

        return {
            init: init
        };
    }

});
