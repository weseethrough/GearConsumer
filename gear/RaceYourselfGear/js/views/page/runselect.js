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
    name: 'views/page/runselect',
    requires: [
        'core/event',
        'models/race',
        'models/game',
        'models/settings',
        'models/sap',
        'models/sapRaceYourself',
        'views/page/pregame',
        'views/page/no-bluetooth',
        'views/page/trainingtype',
        'views/page/opponentselect',
        'views/page/eliminatortutorial'
    ],
    def: function viewsPageRunSelect(req) {
        'use strict';

        var e = req.core.event,
         	app = req.models.application,
         	page = null,
         	game = req.models.game,
         	race = req.models.race,
         	sap = req.models.sap,
         	settings = req.models.settings,
         	provider = req.models.sapRaceYourself,
            changer,
            sectionChanger;

        function show() {
            gear.ui.changePage('#runselect');
        }
        
        

        function onPageShow() {
            sectionChanger = new SectionChanger(changer, {
                circular: false,
                orientation: "horizontal",
                scrollbar: "bar"
            });
            
            e.listen('tizen.back', onBack);
            sectionChanger.setActiveSection(3, 0);

            document.getElementById('fitness-mode-btn').classList.toggle('locked-game', game.isLocked('Endurance'));
            document.getElementById('weight-mode-btn').classList.toggle('locked-game', game.isLocked('WeightLoss'));
            document.getElementById('strength-mode-btn').classList.toggle('locked-game', game.isLocked('Strength'));
            
            if(settings.getFirstTimeSelect()) {
            	setTimeout(function() {
            		sectionChanger.setActiveSection(0, 1000);
            	}, 1);
            	settings.setFirstTimeSelect(false);
            } else {
            	sectionChanger.setActiveSection(0, 0);
            }
        }
        
        function onPageHide() {
            e.die('tizen.back', onBack);
            sectionChanger.destroy();
        }   
        
        function onBack() {
            e.fire('newmain.show');
        }
        
        function bindEvents() {
        	var moreGamesEl = document.getElementById('moregames'),
        		elimBtnEl = document.getElementById('elim-mode-btn'),
        		fitnessBtnEl = document.getElementById('fitness-mode-btn'),
        		weightBtnEl = document.getElementById('weight-mode-btn'),
        		strengthBtnEl = document.getElementById('strength-mode-btn');
        	
        	 page.addEventListener('pageshow', onPageShow);
             page.addEventListener('pagehide', onPageHide);
             
             moreGamesEl.addEventListener('click', onMoreGames);
             elimBtnEl.addEventListener('click', onElimBtnClick);
             fitnessBtnEl.addEventListener('click', onHRRaceClick);
             weightBtnEl.addEventListener('click', onHRRaceClick);
             strengthBtnEl.addEventListener('click', onHRRaceClick);
        }
        
        function onHRRaceClick(event) {
        	if(isScrolling()) return;
        	switch(this.id) {
        	case 'fitness-mode-btn':
        		if (game.isLocked('Endurance')) return;
        		race.setGoal('Endurance');
        		break;
        		
        	case 'weight-mode-btn':
        		if (game.isLocked('WeightLoss')) return;
        		race.setGoal('WeightLoss');
        		break;
        		
        	case 'strength-mode-btn':
        		if (game.isLocked('Strength')) return;
        		race.setGoal('Strength');
        		break;
        		
        	default:
        		console.log('Button not found - ' + this.id);
        		break;
        	}
        	
        	e.fire('opponentselect.show');
        }

        function isScrolling() {
            if (!sectionChanger) return false;
            if (Math.abs(sectionChanger.lastTouchPointX - sectionChanger.startTouchPointX) > 5) return true;
            if (Math.abs(sectionChanger.lastTouchPointY - sectionChanger.startTouchPointY) > 5) return true;
            return false;
        }
       
        function onElimBtnClick(event) {
        	if(isScrolling()) return;
        	
        	game.setCurrentGame('racegame');
        	if(settings.getEliminatorTutorial()) {
        		if(sap.isConnected() || !sap.isAvailable()) {
                	e.fire('pregame.show');
                } else {
                	e.fire('no-bluetooth.show');
                }
        	} else {
        		e.fire('eliminatortutorial.show');
        	}
        	
        }
         
        function onMoreGames(event) {
            if (isScrolling()) return;
            provider.sendWebLinkReq('http://www.raceyourself.com/');
        }
        
        function init() {
            page = document.getElementById('runselect');
            changer = document.getElementById("run-select-sectionchanger");
            bindEvents();
        }

        e.listeners({
            'runselect.show': show,
        });

        return {
            init: init
        };
    }

});
