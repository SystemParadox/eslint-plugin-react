/**
 * @fileoverview Enforce event handler naming conventions in JSX
 * @author Jake Marsh
 */
'use strict';

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = function(context) {

  var configuration = context.options[0] || {};
  var eventHandlerPrefix = configuration.eventHandlerPrefix || 'handle';
  var eventHandlerPropPrefix = configuration.eventHandlerPropPrefix || 'on';

  var EVENT_HANDLER_REGEX = new RegExp('^((props\.' + eventHandlerPropPrefix + ')'
                                       + '|((.*\.)?' + eventHandlerPrefix + ')).+$');
  var PROP_EVENT_HANDLER_REGEX = new RegExp('^' + eventHandlerPropPrefix + '.+$');

  return {
    JSXAttribute: function(node) {
      if (!node.value || !node.value.expression || !node.value.expression.object) {
        return;
      }

      var propKey = typeof node.name === 'object' ? node.name.name : node.name;
      var propValue = context.getSource(node.value.expression).replace(/^this\./, '');

      var propIsEventHandler = PROP_EVENT_HANDLER_REGEX.test(propKey);
      var propFnIsNamedCorrectly = EVENT_HANDLER_REGEX.test(propValue);

      if (propIsEventHandler && !propFnIsNamedCorrectly) {
        context.report(
          node,
          'Handler function for ' + propKey + ' prop key must begin with \'' + eventHandlerPrefix + '\''
        );
      } else if (propFnIsNamedCorrectly && !propIsEventHandler) {
        context.report(
          node,
          'Prop key for ' + propValue + ' must begin with \'' + eventHandlerPropPrefix + '\''
        );
      }
    }
  };

};

module.exports.schema = [{
  type: 'object',
  properties: {
    eventHandlerPrefix: {
      type: 'string'
    },
    eventHandlerPropPrefix: {
      type: 'string'
    }
  },
  additionalProperties: false
}];
