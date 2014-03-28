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
    name: 'views/page/aboutheartrate',
    requires: [
        'core/event',
        'models/sapRaceYourself'
    ],
    def: function viewsPageAboutHeartRate(req) {
        'use strict';

        var e = req.core.event,
            provider = req.models.sapRaceYourself,
            page = null;

        function show() {
            gear.ui.changePage('#aboutheartrate');            
        }
        
        function onPageShow() {
            e.listen('tizen.back', onBack);
            
        }

        function onPageHide() {
            e.die('tizen.back', onBack);
        }
        
        function onBack() {
            history.back();
        }

        function bindEvents() {
            page.addEventListener('pageshow', onPageShow);
            page.addEventListener('pagehide', onPageHide);
            
            page.addEventListener('click', onBack);
        }

        function init() {
            page = document.getElementById('aboutheartrate');
            bindEvents();
        }
        
        e.listeners({
            'aboutheartrate.show': show
        });
        
        return {
            init: init
        };
    }

});
