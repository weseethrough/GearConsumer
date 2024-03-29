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
    name: 'views/page/games',
    requires: [
        'core/event',
        'models/application',
        'views/page/pregame',
        'views/page/lockedgame',
        'models/settings',
        'models/game'
    ],
    def: function viewsPageGames(req) {
        'use strict';

        var e = req.core.event,
            app = req.models.application,
            game = req.models.game,
            page = null;

        function show() {
            gear.ui.changePage('#games');
        }

        function onPageShow() {
            e.listen('tizen.back', onBack);
            // Mark (un)locked games
            var ryBtnEl = document.getElementById('ry-game-btn'),
                zombieBtnEl = document.getElementById('hrz-game-btn');
            
            zombieBtnEl.classList.toggle('locked-game', game.isLocked());
        }
        
        function onPageHide() {
            e.die('tizen.back', onBack);            
        }
        
        function onBack() {
            console.log("Closing application..");
            app.closeApplication();
        }

        
        function onRaceYourselfGameBtnClick() {
            game.setCurrentGame('racegame');
            e.fire('pregame.show');
        }

        function onHeartRateZombiesGameBtnClick() {
            game.setCurrentGame('hrzgame');
            if (game.isLocked()) e.fire('lockedgame.show');
            else e.fire('pregame.show');
        }

        function bindEvents() {
            var ryBtnEl = document.getElementById('ry-game-btn'),
                zombieBtnEl = document.getElementById('hrz-game-btn');

            page.addEventListener('pageshow', onPageShow);
            page.addEventListener('pagehide', onPageHide);
        }

        function init() {
            page = document.getElementById('games');
            bindEvents();
        }

        e.listeners({
            'games.show': show
        });

        return {
            init: init
        };
    }

});
