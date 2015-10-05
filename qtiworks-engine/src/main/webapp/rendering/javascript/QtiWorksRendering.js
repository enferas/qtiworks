/*
 *
 * Requirements:
 *
 * jquery.js
 * jquery-ui.js (incl. Draggable, Resizable, Sortable, Dialog, Slider)
 *
 * Author: David McKain
 * Modifications: Aboud Zakaria
 *
 * Copyright (c) 2012-2013, The University of Edinburgh
 * All Rights Reserved
 */

/************************************************************/

var QtiWorksRendering = (function() {

    var submitCallbacks = [];
    var resetCallbacks = [];

    var registerSubmitCallback = function(callback) {
        submitCallbacks.push(callback);
    };

    var registerResetCallback = function(callback) {
        resetCallbacks.push(callback);
    };

    var queryInputElements = function(responseIdentifier) {
        return $('input[name=qtiworks_response_' + responseIdentifier + ']');
    };

    /************************************************************/
    /* sliderInteraction */

    var SliderInteraction = function(responseIdentifier, configData) {
        this.responseIdentifier = responseIdentifier;
        this.sliderQuery = $('#qtiworks_id_slider_' + responseIdentifier);
        this.feedbackQuery = $('#qtiworks_id_slidervalue_' + responseIdentifier);
        this.inputElementQuery = $('input[name="qtiworks_response_' + responseIdentifier + '"]');
        this.min = configData.min;
        this.max = configData.max;
        this.step = configData.step;
        this.orientation = configData.orientation;
        this.isReversed = configData.isReversed;
        this.isDiscrete = configData.isDiscrete;
        this.initialValue = this.inputElementQuery.get(0).value || this.min;
        var interaction = this;

        this.init = function() {
            this.sliderQuery.slider({
                value: interaction.initialValue,
                step: interaction.step,
                orientation: interaction.orientation,
                /* (To handle 'reverse', we simply negate and swap min/max when mapping to/from the slider itself) */
                min: interaction.isReversed ? -interaction.max : interaction.min,
                max: interaction.isReversed ? -interaction.min : interaction.max,
                slide: function(event, ui) {
                    var value = interaction.isReversed ? -ui.value : ui.value;
                    interaction.setValue(value);
                }
            });
            this.reset();
        };

        this.setValue = function(value) {
            this.inputElementQuery.get(0).value = value;
            this.feedbackQuery.text(value);
            this.sliderQuery.slider('value', this.isReversed ? -value : value);
        };

        this.reset = function() {
            this.setValue(this.initialValue);
        };

        registerResetCallback(function() {
            interaction.reset();
        });
    };

    /************************************************************/
    /* matchInteraction */

    var MatchInteraction = function(responseIdentifier, maxAssociations, leftData, rightData) {
        this.responseIdentifier = responseIdentifier;
        this.maxAssociations = maxAssociations;
        this.matchCount = 0;
        this.leftMap = {};
        this.rightMap = {};
        this.matched = [];
        var interaction = this;

        for(var key in leftData){
            this.leftMap[key] = {
                matchMax: leftData[key],
                matchCount: 0
            };
        }
        for(var key in rightData){
            this.rightMap[key] = {
                matchMax: rightData[key],
                matchCount: 0
            };
        }

        this.withCheckbox = function(inputElement, callback) {
            var directedPair = inputElement.value;
            var splitPair = directedPair.split(" ");
            var left = interaction.leftMap[splitPair[0]];
            var right = interaction.rightMap[splitPair[1]];
            callback(inputElement, directedPair, left, right);
        };

        this.init = function() {
            queryInputElements(this.responseIdentifier).bind('click', function() {
                interaction.checkMatch(this);
            });
            this.recalculate();
            this.updateDisabledStates();
        };

        this.resetChecks = function() {
            queryInputElements(this.responseIdentifier).each(function() {
                if (interaction.matched[this.value]) {
                    this.checked = true;
                }
                else {
                    this.checked = false;
                }
            });
            this.recalculate();
            this.updateDisabledStates();
        };

        this.recalculate = function() {
            this.matchCount = 0;
            this.matched = {};
            for(var key in this.leftMap) {
                this.leftMap[key].matchCount = 0;
            }
            for(var key in this.rightMap) {
                this.rightMap[key].matchCount = 0;
            }

            queryInputElements(this.responseIdentifier).each(function() {
                interaction.withCheckbox(this, function(inputElement, directedPair, left, right) {
                    if (inputElement.checked) {
                        interaction.matchCount++;
                        left.matchCount++;
                        right.matchCount++;
                        interaction.matched[directedPair] = true;
                    }
                });
            });
        };

        this.updateDisabledStates = function() {
            queryInputElements(this.responseIdentifier).each(function() {
                interaction.withCheckbox(this, function(inputElement, directedPair, left, right) {
                    if (inputElement.checked) {
                        inputElement.disabled = false;
                    }
                    else if ((interaction.maxAssociations!=0 && interaction.matchCount >= interaction.maxAssociations)
                            || (left.matchMax!=0 && left.matchCount >= left.matchMax)
                            || (right.matchMax!=0 && right.matchCount >= right.matchMax)) {
                        inputElement.disabled = true;
                    }
                    else {
                        inputElement.disabled = false;
                    }
                });
            });
        };

        this.checkMatch = function(inputElement) {
            interaction.withCheckbox(inputElement, function(inputElement, directedPair, left, right) {
                if (inputElement.checked){
                    var incremented = false;
                    if (left.matchMax != 0 && left.matchMax <= left.matchCount) {
                        inputElement.checked = false;
                    }
                    else {
                        left.matchCount++;
                        interaction.matchCount++;
                        incremented = true;
                    }

                    if (right.matchMax != 0 && right.matchMax <= right.matchCount) {
                        inputElement.checked = false;
                    }
                    else {
                        right.matchCount++;
                        if (!incremented) {
                            interaction.matchCount++;
                        }
                    }
                }
                else {
                    interaction.matchCount--;
                    left.matchCount--;
                    right.matchCount--;
                }
                interaction.updateDisabledStates(responseIdentifier);
            });
        };

        registerResetCallback(function() {
            interaction.resetChecks();
        });
    };

    /************************************************************/
    /* gapMatchInteraction (NB: no JS validation of matchMin/required here) */

    var GapMatchInteraction = function(responseIdentifier, gapChoiceData, gapData) {
        this.responseIdentifier = responseIdentifier;
        this.gapChoiceMap = {};
        this.gapMap = {};
        this.matched = [];
        var interaction = this;

        for(var key in gapChoiceData){
            var query = $('#qtiworks_id_' + this.responseIdentifier + '_' + key);
            this.gapChoiceMap[key] = {
                matchMax: gapChoiceData[key],
                matchCount: 0,
                query: query,
                text: query.text()
            };
        }
        for(var key in gapData){
            var query = $('#qtiworks_id_' + this.responseIdentifier + '_' + key);
            this.gapMap[key] = {
                required: gapData[key], /* NB: This is not currently used in the JS */
                matched: false,
                matchedGapChoice: null,
                query: query,
                label: query.text()
            };
        }

        this.withCheckbox = function(inputElement, callback) {
            var directedPair = inputElement.value;
            var splitPair = directedPair.split(" ");
            var gapChoice = interaction.gapChoiceMap[splitPair[0]];
            var gap = interaction.gapMap[splitPair[1]];
            callback(inputElement, directedPair, gapChoice, gap);
        };


        this.init = function() {
            var checkboxes = queryInputElements(this.responseIdentifier);
            checkboxes.bind('click', function() {
                interaction.checkMatch(this);
            });
            this.recalculate();
            this.updateDisabledStates();
        };

        this.reset = function() {
            queryInputElements(this.responseIdentifier).each(function() {
                if (interaction.matched[this.value]) {
                    this.checked = true;
                }
                else {
                    this.checked = false;
                }
            });
            this.recalculate();
            this.updateDisabledStates();
        };

        this.recalculate = function() {
            this.matchCount = 0;
            for (var key in this.gapChoiceMap) {
                this.gapChoiceMap[key].matchCount = 0;
            }
            for (var key in this.gapMap) {
                this.gapMap[key].matched = false;
                this.gapMap[key].matchedGapChoice = null;
            }

            queryInputElements(this.responseIdentifier).each(function() {
                interaction.withCheckbox(this, function(inputElement, directedPair, gapChoice, gap) {
                    if (inputElement.checked) {
                        gapChoice.matchCount++;
                        gap.matched = true;
                        gap.matchedGapChoice = gapChoice;
                        interaction.matched[directedPair] = true;
                    }
                });
            });

            for (var key in this.gapMap) {
                var gap = this.gapMap[key];
                var gapText;
                if (gap.matched) {
                    gapText = gap.matchedGapChoice.text;
                }
                else {
                    gapText = gap.label;
                }
                gap.query.text(gapText);
            }
        };

        this.updateDisabledStates = function() {
            queryInputElements(this.responseIdentifier).each(function() {
                interaction.withCheckbox(this, function(inputElement, directedPair, gapChoice, gap) {
                    if (inputElement.checked) {
                        inputElement.disabled = false;
                    }
                    else if (gap.matched || (gapChoice.matchMax!=0 && gapChoice.matchCount >= gapChoice.matchMax)) {
                        inputElement.disabled = true;
                    }
                    else {
                        inputElement.disabled = false;
                    }
                });
            });
        };

        this.checkMatch = function(inputElement) {
            this.withCheckbox(inputElement, function(inputElement, directedPair, gapChoice, gap) {
                if (inputElement.checked){
                    if (gap.matched || (gapChoice.matchMax != 0 && gapChoice.matchMax <= gapChoice.matchCount)) {
                        inputElement.checked = false;
                    }
                    else {
                        gapChoice.matchCount++;
                        gap.matched = true;
                        gap.matchedGapChoice = gapChoice;
                    }
                    gap.query.text(gapChoice.text);
                }
                else{
                    gapChoice.matchCount--;
                    gap.matched = false;
                    gap.matchedGapChoice = null;
                    gap.query.text(gap.label);
                }
                interaction.updateDisabledStates(responseIdentifier);
            });
        };

        registerResetCallback(function() {
            interaction.reset();
        });
    };

    /************************************************************/
    /* orderInteraction */

    var OrderInteraction = function(responseIdentifier, initialSourceOrder, initialTargetOrder, minChoices, maxChoices) {
        this.responseIdentifier = responseIdentifier;
        this.initialSourceOrder = initialSourceOrder;
        this.initialTargetOrder = initialTargetOrder;
        this.minChoices = minChoices;
        this.maxChoices = maxChoices;
        this.containerQuery = $('#qtiworks_response_' + responseIdentifier);
        this.targetBox = $('#qtiworks_response_' + responseIdentifier + ' div.target');
        this.sourceList = $('#qtiworks_response_' + responseIdentifier + ' div.source ul');
        this.targetList = $('#qtiworks_response_' + responseIdentifier + ' div.target ul');
        this.hiddenInputContainer = $('#qtiworks_response_' + responseIdentifier + ' div.hiddenInputContainer');
        var interaction = this;

        this.reset = function() {
            /* Record items by their HTML ID */
            var itemsById = {};
            var sourceItems = this.sourceList.children('li');
            sourceItems.each(function() {
                itemsById[this.id] = this;
            });
            var targetItems = this.targetList.children('li');
            targetItems.each(function() {
                itemsById[this.id] = this;
            });

            /* Detach items from the page */
            sourceItems.detach();
            targetItems.detach();

            /* Then re-add them in the initial order */
            $.each(interaction.initialSourceOrder, function(index, responseIdentifier) {
                var item = itemsById['qtiworks_response_' + responseIdentifier];
                interaction.sourceList.append(item);
            });
            $.each(interaction.initialTargetOrder, function(index, responseIdentifier) {
                var item = itemsById['qtiworks_response_' + responseIdentifier];
                interaction.targetList.append(item);
            });
        };

        this.syncHiddenFormFields = function() {
            /* Store the current selected orders in the hidden inputs */
            interaction.hiddenInputContainer.empty();
            interaction.targetList.children('li').each(function(index) {
                var choiceId = this.id.substring('qtiworks_response_'.length); // Trim leading 'qtiworks_response_'
                var inputElement = $('<input type="hidden">');
                inputElement.attr('name', 'qtiworks_response_' + interaction.responseIdentifier);
                inputElement.attr('value', choiceId);
                interaction.hiddenInputContainer.append(inputElement);
            });
        };

        this.highlight = function(state) {
            this.targetBox.toggleClass('highlight', state);
        };

        this.init = function() {
            /* Add jQuery UI Sortable effect to sourceList */
            var listSelector = '#qtiworks_response_' + this.responseIdentifier + ' ul';
            this.sourceList.sortable({
                connectWith: listSelector
            });
            this.sourceList.disableSelection();
            this.targetList.sortable({
                connectWith: listSelector
            });
            this.targetList.disableSelection();

            /* Register callback to reset things when requested */
            registerResetCallback(function() {
                interaction.reset();
            });

            /* Sync selection into hidden form fields on submit */
            registerSubmitCallback(function() {
                var selectedCount = interaction.targetList.children('li').size();
                if (minChoices!=null && maxChoices!=null) {
                    if (selectedCount < minChoices || selectedCount > maxChoices) {
                        if (minChoices!=maxChoices) {
                            alert("You must select and order between " + minChoices + " and " + maxChoices + " items");
                        }
                        else {
                            alert("You must select and order exactly " + minChoices + " item"
                                + (minChoices>1 ? "s" : ""));
                        }
                        interaction.highlight(true);
                        return false;
                    }
                    else {
                        interaction.highlight(false);
                    }
                }
                interaction.syncHiddenFormFields();
                return true;
            });
        };
    };

    /************************************************************/
    /* Interactions using Applets.
     * (Recall that PositionObjectInteraction currently uses an applet for its stage,
     * so this class needs to be able to associate a single applet with multiple interactions)
     */
    
    var AppletBasedInteractionContainer = function(containerId, responseIdentifiers) {
        this.responseIdentifiers = responseIdentifiers;
        this.divContainerQuery = $('#' + containerId);
        this.appletQuery = this.divContainerQuery.find('object[type="application/x-java-applet"]');
        var interaction = this;

        this.reset = function() {
            this.appletQuery.each(function() {
                /* (Annoyingly, the reset() function in some of the applets is called reSet()!) */
                if (this.reset) {
                    this.reset();
                }
                else if (this.reSet) {
                    this.reSet();
                }
                interaction.setResponseData();
            });
        };

        this.extractResponseData = function() {
            this.appletQuery.each(function() {
                for (i in interaction.responseIdentifiers) {
                    var responseIdentifier = interaction.responseIdentifiers[i];
                    /* (NB: The following code portion includes JS->Java calls) */
                    var valuesVector = this.getValues(responseIdentifier);
                    var values = [];
                    if (valuesVector!=null) {
                        var valuesEnum = valuesVector.elements();
                        while (valuesEnum.hasMoreElements()) {
                            values.push(valuesEnum.nextElement());
                        }
                    }
                    /* (Back to JS only now) */
                    interaction.setResponseData(responseIdentifier, values);
                }
            });
        };

        this.setResponseData = function(responseIdentifier, values) {
            this.divContainerQuery.find('input').remove();
            for (var i in values) {
                var inputElement = $('<input type="hidden">');
                inputElement.attr('name', 'qtiworks_response_' + responseIdentifier);
                inputElement.attr('value', values[i]);
                this.divContainerQuery.append(inputElement);
            }
        };

        this.init = function() {
            registerSubmitCallback(function() {
                interaction.extractResponseData();
                return true;
            });
            registerResetCallback(function() {
                interaction.reset();
            });
        };
    };

    /*************************************************************/
    /* associationInteraction */
    
    var AssociationInteraction = function(containerId, responseIdentifier, maxAssociations, minAssociations, choices, responseValue){ 
        this.containerId = containerId;
        this.responseIdentifier = responseIdentifier;
        this.maxAssociations = maxAssociations;
        this.minAssociations = minAssociations;
        this.choices_count = choices.length;
        this.choices = choices;
        this.responseValue = responseValue;
        var interaction = this;
        
        this.reset = function() { 
            AssociationCanvas.reset();
        };
        
        this.syncHiddenFormFields = function() {
            AssociationCanvas.syncHiddenFormFields();
        };
        
        this.init = function() {
            AssociationCanvas.initialize(containerId, responseIdentifier, maxAssociations, minAssociations, choices, responseValue);
        
            /* Register callback to reset things when requested */
            registerResetCallback(function() {
                interaction.reset();
            });
            
            /* Sync selection into hidden form fields on submit */
            registerSubmitCallback(function() {
                interaction.syncHiddenFormFields();
            });
            
        };
    };
    
    /*************************************************************/
    /* graphicAssociationInteraction */
    
    var GraphicAssociationInteraction = function(containerId, responseIdentifier, maxAssociations, minAssociations, width, height, image, hotspots, responseValue) {
        this.containerId = containerId;
        this.responseIdentifier = responseIdentifier;
        this.maxAssociations = maxAssociations;
        this.minAssociations = minAssociations;
        this.width = width;
        this.height = height;
        this.image = image;
        this.hotspots = hotspots;
        this.responseValue = responseValue;
        var interaction = this;
        
        this.reset = function() { 
            GraphicAssociationCanvas.reset();
        };
        
        this.syncHiddenFormFields = function() {
            GraphicAssociationCanvas.syncHiddenFormFields();
        };
        
        this.init = function() {
            GraphicAssociationCanvas.initialize(containerId, responseIdentifier, maxAssociations, minAssociations, width, height, image, hotspots, responseValue);
            
            /* Register callback to reset things when requested */
            registerResetCallback(function() {
                interaction.reset();
            });
            
            /* Sync selection into hidden form fields on submit */
            registerSubmitCallback(function() {
                interaction.syncHiddenFormFields();
            });
            
        };
    };
    
    /*************************************************************/
    /* HotspotInteraction */
    
    var HotspotInteraction = function(containerId, responseIdentifier, maxAssociations, minAssociations, width, height, image, hotspots, responseValue) {
        this.containerId = containerId;
        this.responseIdentifier = responseIdentifier;
        this.maxAssociations = maxAssociations;
        this.minAssociations = minAssociations;
        this.width = width;
        this.height = height;
        this.image = image;
        this.hotspots = hotspots;
        this.responseValue = responseValue;
        var interaction = this;
        
        this.reset = function() { 
            HotspotCanvas.reset();
        };
        
        this.syncHiddenFormFields = function() {
            HotspotCanvas.syncHiddenFormFields();
        };
        
        this.init = function() {
            HotspotCanvas.initialize(containerId, responseIdentifier, maxAssociations, minAssociations, width, height, image, hotspots, responseValue);
            
            /* Register callback to reset things when requested */
            registerResetCallback(function() {
                interaction.reset();
            });
            
            /* Sync selection into hidden form fields on submit */
            registerSubmitCallback(function() {
                interaction.syncHiddenFormFields();
            });
            
        };
    };
    
    /*************************************************************/
    /* GraphicOrderInteraction */
    
    var GraphicOrderInteraction = function(containerId, responseIdentifier, width, height, image, hotspots, responseValue) { 
        this.containerId = containerId;
        this.responseIdentifier = responseIdentifier;
        this.width = width;
        this.height = height;
        this.image = image;
        this.hotspots = hotspots;
        this.responseValue = responseValue;
        var interaction = this;
        
        this.reset = function() { 
            GraphicOrderCanvas.reset();
        };
        
        this.syncHiddenFormFields = function() {
            GraphicOrderCanvas.syncHiddenFormFields();
        };
        
        this.isAllOrderd = function() {
            return GraphicOrderCanvas.isAllOrderd();
        }
        
        this.init = function() {
            GraphicOrderCanvas.initialize(containerId, responseIdentifier, width, height, image, hotspots, responseValue);
            
            /* Register callback to reset things when requested */
            registerResetCallback(function() {
                interaction.reset();
            });
            
            /* Sync selection into hidden form fields on submit */
            registerSubmitCallback(function() {
                if (interaction.isAllOrderd()) {
                    interaction.syncHiddenFormFields();
                } else {
                    alert("you must order all the hotspots.");
                    return false;
                }
            });
            
        };
    };
    
    /************************************************************/
    /* Public methods */

    return {
        maySubmit: function() {
            var allowSubmit = true;
            for (var i in submitCallbacks) {
                allowSubmit = submitCallbacks[i]();
                if (!allowSubmit) {
                    break;
                }
            }
            return allowSubmit;
        },

        reset: function() {
            for (var i in resetCallbacks) {
                resetCallbacks[i]();
            }
        },

        showInfoControlContent: function(inputElement) {
            $(inputElement).next('div').show();
            inputElement.disabled = true;
            return false;
        },

        registerSliderInteraction: function(responseIdentifier, configData) {
            new SliderInteraction(responseIdentifier, configData).init();
        },

        registerOrderInteraction: function(responseIdentifier, initialSourceOrder, initialTargetOrder, minChoices, maxChoices) {
            new OrderInteraction(responseIdentifier, initialSourceOrder, initialTargetOrder, minChoices, maxChoices).init();
        },

        registerMatchInteraction: function(responseIdentifier, maxAssociations, matchSet1, matchSet2) {
            new MatchInteraction(responseIdentifier, maxAssociations, matchSet1, matchSet2).init();
        },

        registerGapMatchInteraction: function(responseIdentifier, gapChoiceData, gapData) {
            new GapMatchInteraction(responseIdentifier, gapChoiceData, gapData).init();
        },

        registerAppletBasedInteractionContainer: function(containerId, responseIdentifiers) {
            new AppletBasedInteractionContainer(containerId, responseIdentifiers).init();
        },

        registerAssociationInteraction: function(containerId, responseIdentifier, maxAssociations, minAssociations, choices, responseValue) {
            new AssociationInteraction(containerId, responseIdentifier, maxAssociations, minAssociations, choices, responseValue).init();
        },
        
        registerGraphicAssociationInteraction: function(containerId, responseIdentifier, maxAssociations, minAssociations, width, height, image, hotspots, responseValue) {
            new GraphicAssociationInteraction(containerId, responseIdentifier, maxAssociations, minAssociations, width, height, image, hotspots, responseValue).init();
        },
 
        registerHotspotInteraction: function(containerId, responseIdentifier, maxAssociations, minAssociations, width, height, image, hotspots, responseValue) {
            new HotspotInteraction(containerId, responseIdentifier, maxAssociations, minAssociations, width, height, image, hotspots, responseValue).init();
        },
        
        registerGraphicOrderInteraction: function(containerId, responseIdentifier, width, height, image, hotspots, responseValue) {
            new GraphicOrderInteraction(containerId, responseIdentifier, width, height, image, hotspots, responseValue).init();
        },
        
        registerReadyCallback: function(callback) {
            $(document).ready(function() {
                if (typeof(MathJax) !== "undefined") {
                    MathJax.Hub.Queue(callback);
                }
                else {
                    callback();
                }
            });
        },

        validateInput: function(obj) {
            var errorMessage = '';
            var value = obj.value;
            for (var i=1; i<arguments.length; i++) {
                switch (arguments[i]) {
                    case 'float':
                        if (!value.match(/^-?[\d\.]+$/)){
                            errorMessage += 'This input must be a number!\n';
                        }
                        break;

                    case 'integer':
                        if (!value.match(/^-?\d+$/)){
                            errorMessage += 'This input must be an integer!\n';
                        }
                        break;

                    case 'regex':
                        var regex = arguments[++i];
                        if (!value.match(regex)) {
                            errorMessage += 'This input is not valid!\n';
                        }
                        break;
                }
            }
            if (errorMessage.length!=0) {
                alert(errorMessage);
                $(obj).addClass("badResponse");
                return false;
            }
            else {
                $(obj).removeClass("badResponse");
                return true;
            }
        },

        /* Used for <extendedTextInteraction/> */
        addNewTextBox: function(inputElement) {
            var input = $(inputElement);
            var newInput = input.clone(true);
            input.removeAttr('onkeyup');
            newInput.attr('value', '');

            var br = $("<br>");
            input.after(br);
            br.after(newInput);
        }
    };
})();
