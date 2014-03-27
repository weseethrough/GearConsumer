/*global define, $, console, tizen, webapis*/
/*jslint regexp: true*/

/**
 * Application module
 */

define({
    name: 'models/config',
    requires: [
        'core/storage',
        'core/event',
        'helpers/units'
    ],
    def: function modelsConfig(req) {
        'use strict';

        var s = req.core.storage,
            e = req.core.event,
            units = req.helpers.units,
            defaults = {
        		version: 0,
                hrSmoothing: 0,				// 0 = no smoothing, 1 = extreme smoothing
                sprintDuration: 30, 		//seconds
                recoverDuration: 30,		//seconds
                warningPeriod: 10,			//seconds outside of HR zone before zombies start closing
                adaptPeriod: 10,			//seconds after change of zone before zombies can close
                warmupPeriod: 5*60,			//seconds
                dinoUnlockDist: 20,			//km
                catchupTime: 500,			//num ticks for zombies to catch up                
                lapLength: 100,  
                elimUnlockDist: 50,
                weightUnlockDist: 5,
                strengthUnlockDist: 10
            },
            config = {},
            STORAGE_KEY = 'config';

        /**
         * Returns unit.
         * @return {string} unit
         */
        function getHrSmoothing() {
			if (!isFinite(config.hrSmoothing)) return defaults.hrSmoothing;
            return config.hrSmoothing;
        }
        
        function getSprintDuration() {
        	if (!isFinite(config.sprintDuration)) return defaults.sprintDuration;
        	return config.sprintDuration;
		}

		function getRecoverDuration() {
			if(!isFinite(config.recoverDuration)) return defaults.recoverDuration;
			return config.recoverDuration;
		}

		function getWarningPeriod() {
			if(!isFinite(config.warningPeriod)) return defaults.warningPeriod;
			return config.warningPeriod;
		}			

		function getAdaptPeriod() {
			if(!isFinite(config.adaptPeriod)) return defaults.adaptPeriod;
			return config.adaptPeriod;
		}

		function getWarmupPeriod() {
			if(!isFinite(config.warmupPeriod)) return defaults.warmupPeriod;
			return config.warmupPeriod;
		}

		function getDinoUnlockDist() {
			if(!isFinite(config.dinoUnlockDist)) return defaults.dinoUnlockDist;
			return config.dinoUnlockDist;
		}
		
		function getElimUnlockDist() {
			if(!isFinite(config.elimUnlockDist)) return defaults.elimUnlockDist;
			return config.elimUnlockDist;
		}
		
		function getWeightUnlockDist() {
			if(!isFinite(config.weightUnlockDist)) return defaults.weightUnlockDist;
			return config.weightUnlockDist;
		}
		
		function getStrengthUnlockDist() {
			if(!isFinite(config.strengthUnlockDist)) return defaults.strengthUnlockDist;
			return config.strengthUnlockDist;
		}
		
		function getCatchupTime() {
			if(!isFinite(config.catchupTime)) return defaults.catchupTime;
			return config.catchupTime;
		}
		
		function getLapLength() {
			if(!isFinite(config.lapLength)) return defaults.lapLength;
			return defaults.lapLength;
		}
        
        function saveConfig(configuration) {
            if (s.add(STORAGE_KEY, configuration)) {
                return true;
            }
            return false;
        }		
		
        function onConfigurationUpdate(event) {
        	var configuration = event.detail;
        	saveConfig(configuration);
        }
        
        /**
         * Initializes module.
         */
        function init() {
            config = s.get(STORAGE_KEY);
            if (config === null) {
                config = defaults;
            }
            e.listen('configuration.update', onConfigurationUpdate);
        }

        return {
            init: init,
            getHrSmoothing : getHrSmoothing,
            getSprintDuration : getSprintDuration,
            getRecoverDuration : getRecoverDuration,
            getWarningPeriod : getWarningPeriod,
            getAdaptPeriod : getAdaptPeriod,
            getWarmupPeriod : getWarmupPeriod,
            getDinoUnlockDist : getDinoUnlockDist,
            getCatchupTime : getCatchupTime,
            getElimUnlockDist: getElimUnlockDist,
            getWeightUnlockDist: getWeightUnlockDist,
            getStrengthUnlockDist: getStrengthUnlockDist,
            getLapLength : getLapLength           
        };
    }

});
