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
    name: 'views/page/gameachievements',
    requires: [
        'core/event',
        'models/game',
        'models/race',
        'models/achievements',
        'core/template'
    ],
    def: function viewsPageGameAchievements(req) {
        'use strict';

        var e = req.core.event,
            race = req.models.race,
            game = req.models.game,
            t = req.core.template,
            page = null,
            list = null,
            ongoing = null;

        function show() {
        }

        function onPageShow() {
            e.listen('race.new', reloadRace);
            e.listen('achievement.awarded', tick);
            
            tick();
        }
        
        function tick() {
            ongoing = race.getOngoingRace();
            if (!ongoing) return;
            var as = ongoing.getAchievements();
            var items = [];
            var clazz = 'new-achievement';
            for (var key in as) {
                var a = as[key];
                items.push(t.get('achievementRow', {
                            key: a.key,
                            title: a.title,
                            subtitle: a.points + ' sweat points',
                            classes: clazz
                }));
                clazz = '';
            }
            if (items.length > 0) list.innerHTML = items.join('');
            else list.innerHTML = '<center><small>Awards will appear here</small></center>';
            console.log(items.length);
        }
        
        function onPageHide() {
            e.die('race.new', reloadRace);
            e.die('achievement.awarded', tick);
        }
        
        function reloadRace() {
            ongoing = race.getOngoingRace();            
            tick();
        }
        
        function onItemTap(event) {
            // TODO: if (isScrolling()) return;
            var a = event.target;
            while (a && a.tagName && a.tagName.toLowerCase() !== 'a') {
                a = a.parentElement;
            }
            if (!a) return;
            event.preventDefault();
            event.stopPropagation();
//            e.fire('achievement.show', a.getAttribute('data-achievement'));
//            TODO: Fix hrzgames.onPageHide/onPageShow so this works            
        }
                
        function bindEvents() {
            page.addEventListener('pageshow', onPageShow);
            page.addEventListener('pagehide', onPageHide);
            list.addEventListener('click', onItemTap);
        }

        function init() {
//            page = document.getElementById('race-game');
//            list = document.getElementById('game-achievements-list');
//            bindEvents();
        }

        e.listeners({
            'statsleft.show': show,
        });

        return {
// View disabled        	
//          init: init
        };
    }

});
