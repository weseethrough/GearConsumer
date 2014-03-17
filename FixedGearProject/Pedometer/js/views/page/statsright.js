/*global define, $, console, window, history, document*/

/**
 * Main page module
 */

define({
    name: 'views/page/statsright',
    requires: [
        'core/event',
        'models/game',
        'models/race',
        'models/timer'
    ],
    def: function viewsPageStatsRight(req) {
        'use strict';

        var e = req.core.event,
            race = req.models.race,
            game = req.models.game,
            Timer = req.models.timer.Timer,
            page = null,
            timer = null,
            ongoing = null,
            paceEl,
            stepsEl;

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
            var pace = ongoing.getPace();
            if (isFinite(pace)) pace = pace.toFixed(2);
            else pace = '&infin;'
            paceEl.innerHTML = pace;
            stepsEl.innerHTML = ongoing.getSteps();
        }
        
        function bindEvents() {
            page.addEventListener('pageshow', onPageShow);
            page.addEventListener('pagehide', onPageHide);
        }

        function init() {
            page = document.getElementById('race-game');
            paceEl = document.getElementById('pace-stat');
            stepsEl = document.getElementById('steps-stat');
            timer = new Timer(1000, 'views.page.statsright.tick');
            bindEvents();
        }

        e.listeners({
            'statsright.show': show,
            'views.page.statsright.tick' : tick
        });

        return {
            init: init
        };
    }

});
