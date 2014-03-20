/*global define, $, console, window, history, document*/

/**
 * Main page module
 */

define({
    name: 'views/page/choosegoal',
    requires: [
        'core/event',
        'models/application',
        'models/settings',
        'views/page/setdistance',
        'views/page/settime'
    ],
    def: function viewsPageChooseGoal(req) {
        'use strict';

        var e = req.core.event,
            app = req.models.application,
            settings = req.models.settings,
            page = null;

        function show() {
            gear.ui.changePage('#racetype');            
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
        	var timeBtnEl = document.getElementById('time-run-btn'),
        		distanceBtnEl = document.getElementById('distance-run-btn'),
        		justRunBtnEl = document.getElementById('just-run-btn');
        	
            page.addEventListener('pageshow', onPageShow);
            page.addEventListener('pagehide', onPageHide);
            
            timeBtnEl.addEventListener('click', onTimeBtnClick);
            distanceBtnEl.addEventListener('click', onDistanceBtnClick);
            justRunBtnEl.addEventListener('click', onJustRunBtnClick);
        }
        
        function onTimeBtnClick() {
        	settings.setCurrentTarget('time');
        	e.fire('settime.show');
        }
        
        function onDistanceBtnClick() {
        	settings.setCurrentTarget('distance');
        	e.fire('setdistance.show');
        }
        
        function onJustRunBtnClick() {
        	settings.setCurrentTarget('none');
        	e.fire('pregame.show');
        }

        function init() {
            page = document.getElementById('racetype');
            bindEvents();
        }
        
        e.listeners({
            'choosegoal.show': show
        });
        
        return {
            init: init
        };
    }

});
