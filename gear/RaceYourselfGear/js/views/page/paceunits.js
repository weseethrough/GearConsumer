/*global define, $, console, window, history, document*/

/**
 * Main page module
 */

define({
    name: 'views/page/paceunits',
    requires: [
        'core/event',
        'models/application',
        'models/race',
        'models/settings',
        'views/page/ageselect'
    ],
    def: function viewsPagePaceUnits(req) {
        'use strict';

        var e = req.core.event,
            app = req.models.application,
            race = req.models.race,
            settings = req.models.settings,
            page = null;

        function show() {
            gear.ui.changePage('#paceunits');            
        }
        
        function onPageShow() {
            e.listen('tizen.back', onBack);
            
            var radios = document.getElementsByName('radio-pace-units');
            for(var i=0, length = radios.length; i < length; i++) {
            	if(settings.getPaceUnits() == radios[i].value)
            	{
            		console.log('FOUND MATCHING RADIO - ' + radios[i].value + ", settings is " + settings.getPaceUnits());
            		radios[i].checked = true;
            	} else {
                    radios[i].checked = false;            	    
            	}
            }
            var pu = 'min/km'
            var su = 'km/h';
            if (settings.getDistanceUnits() == 'Miles') {
            	pu = 'min/mile';
            	su = 'mph';
            }
            document.getElementById('radio-pace-text').innerHTML = pu;
            document.getElementById('radio-speed-text').innerHTML = su;
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
        }
        
        function init() {
            page = document.getElementById('paceunits');
            
            var radios = document.getElementsByName('radio-pace-units');
            for(var i=0, length=radios.length; i<length; i++) {
            	radios[i].addEventListener('click', onRadioClick);
            }
            
            bindEvents();
        }
        
        function onRadioClick() {
        	var radios = document.getElementsByName('radio-pace-units');
            for(var i=0, length=radios.length; i<length; i++) {
         	   if(radios[i].checked == true) {
         		   console.log('FOUND MATCHING RADIO - ' + radios[i].value);
         		   settings.setPaceUnits(radios[i].value);
         		   break;
         	   }
         	   
            }
            e.fire('settingspage.show');
        }
        
        e.listeners({
            'paceunits.show': show
        });
        
        return {
            init: init
        };
    }

});
