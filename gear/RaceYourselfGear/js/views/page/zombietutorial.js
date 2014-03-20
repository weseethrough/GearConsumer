/*global define, $, console, window, history, document*/

/**
 * Main page module
 */

define({
    name: 'views/page/zombietutorial',
    requires: [
        'core/event',
        'models/race',
        'models/game',
        'models/settings',
        'views/page/pregame',
        'views/page/trainingtype'
    ],
    def: function viewsPageZombieTutorial(req) {
        'use strict';

        var e = req.core.event,
         	app = req.models.application,
         	page = null,
         	game = req.models.game,
         	settings = req.models.settings,
            changer,
            sectionChanger;

        function show() {
            gear.ui.changePage('#zombietutorial');
        }

        function onPageShow() {
            sectionChanger = new SectionChanger(changer, {
                circular: false,
                orientation: "horizontal",
                scrollbar: "bar"
            });
            
            e.listen('tizen.back', onBack);
        }
        
        function onBack() {
            history.back();
        }
        
        function onPageHide() {
            sectionChanger.destroy();
            e.die('tizen.back', onBack);
        }        
        
        function bindEvents() {
        	 page.addEventListener('pageshow', onPageShow);
             page.addEventListener('pagehide', onPageHide);
             
             document.getElementById('zombie-tutorial-end-btn').addEventListener('click', onZombieEndClick);
        }

        function onZombieEndClick() {
        	settings.setZombieTutorial(true);
        	e.fire('trainingtype.show');
        }
        
        
        function isScrolling() {
            if (!sectionChanger) return false;
            if (Math.abs(sectionChanger.lastTouchPointX - sectionChanger.startTouchPointX) > 5) return true;
            if (Math.abs(sectionChanger.lastTouchPointY - sectionChanger.startTouchPointY) > 5) return true;
            return false;
        }
        
        
        
        function init() {
            page = document.getElementById('zombietutorial');
            changer = document.getElementById("zombie-tutorial-sectionchanger");
            bindEvents();
        }

        e.listeners({
            'zombietutorial.show': show,
        });

        return {
            init: init
        };
    }

});