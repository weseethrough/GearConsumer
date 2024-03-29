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
    name: 'views/page/gamestats1',
    requires: [
        'core/event',
        'models/game',
        'models/race',
        'models/timer',
        'models/settings',
        'helpers/timer',
        'helpers/units'
    ],
    def: function viewsPageGameStats1(req) {
        'use strict';

        var e = req.core.event,
            race = req.models.race,
            game = req.models.game,
            settings = req.models.settings,
            Timer = req.models.timer.Timer,
            Time = req.helpers.timer.Time,
            units = req.helpers.units,
            page = null,
            timer = null,
            ongoing = null,
            timeEl,
            paceEl,
            paceUnitsEl,
            distanceEl,
            distanceUnitsEl;

        function show() {
        }

        function onPageShow() {
            e.listen('race.new', reloadRace);
            e.listen('pedometer.step', tick);
            
            ongoing = race.getOngoingRace();
            tick();
            timer.run();
        }
        
        function onPageHide() {
            e.die('race.new', reloadRace);
            e.die('pedometer.step', tick);
            timer.reset();
        }
        
        function reloadRace() {
            ongoing = race.getOngoingRace();            
        }
        
        function tick() {
            if (!ongoing) return;
            
            timeEl.innerHTML = hmm(ongoing.getDuration()/1000);
            if(settings.getPaceUnits() == 'km/h') {
                paceEl.innerHTML = ~~ongoing.getSpeed();
                paceUnitsEl.innerHTML = ongoing.getSpeedUnits();
           } else {
                paceEl.innerHTML = mss(ongoing.getPace()*60);
                paceUnitsEl.innerHTML = ongoing.getPaceUnits();
            }
            distance(ongoing.getDistance());
        }
        
        function mss(seconds) {
            if (!isFinite(seconds)) return '--:--';
            
            var mins = ~~(seconds/60);
            var secs = ~~(seconds - mins*60);

            if (mins > 99) return '--:--';
            
            if (secs < 10) secs = '0' + secs;
            
            return mins + ':' + secs;
        }
        
        function hmm(seconds) {
            var hours = ~~(seconds/60/60)
            var mins = ~~((seconds - (hours*60*60))/60)
            
            if (mins < 10) mins = '0' + mins;
            
            return hours + ' ' + mins;
        }
        
        function distance() {
            var decimals = 0;
            var value = ongoing.getDistance();
            var u = ongoing.getDistanceUnits();
            
            if (value > 1000 && u == 'meters') {
                value = value / 1000;
                u = 'kilometers';
            }
            if (u == 'kilometers' || u == 'miles') {
                if(value < 10) {
                	decimals = 2;
                } else {
                	decimals = 1;
                }
            }
            
            distanceEl.innerHTML = Number(value).toFixed(decimals);
            distanceUnitsEl.innerHTML = u;
        }
        
        function bindEvents() {
            page.addEventListener('pageshow', onPageShow);
            page.addEventListener('pagehide', onPageHide);
        }

        function init() {
            page = document.getElementById('race-game');
            timeEl = document.getElementById('duration-stat');
            paceEl = document.getElementById('pace-stat');
            distanceEl = document.getElementById('distance-stat');
            paceUnitsEl = document.getElementById('pace-units');
            distanceUnitsEl = document.getElementById('distance-units');
            timer = new Timer(1000, 'views.page.gamestats1.tick');
            bindEvents();
        }

        e.listeners({
            'statsleft.show': show,
            'views.page.gamestats1.tick': tick
        });

        return {
            init: init
        };
    }

});
