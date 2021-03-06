$(function() {
    function AlarmsModel() {
        var self = this;
        self.alarms = ko.observableArray([]);

        self.action_possib = ko.observableArray(['mail']);

        self.operators = [
          {'value': 'gt', 'text': '>'},
          {'value': 'gte', 'text': '≥'},
          {'value': 'lt', 'text': '<'},
          {'value': 'lte', 'text': '≤'},
          {'value': '==', 'text': '='},
          {'value': 'ne', 'text': '≠'},
          ];

        self.read_from_jsom_array = function(data) {
            alarms = $.map(data, function(alarm) {
                a = new Alarm();
                a.criteria($.map(alarm.criteria, function(criteria) {
                    return new Criteria(criteria.path,
                                        criteria.operator, criteria.value);
                }));
                a.action(new Action(alarm.action.type, alarm.action.parameters));
                a._id(alarm._id);
                return a;
            });
            self.alarms(alarms);
        }

        self.update_alarms = function() {
            $.getJSON('/api/v1/alarms/', self.read_from_jsom_array);
        }

        self.save_alarms = function() {
            console.log(ko.toJSON(self.alarms));
            /*
             *$.ajax("/api/v1/alarms/", {
             *    data: ko.toJSON(self.alarms),
             *    type: "post", contentType: "application/json",
             *    success: self.read_from_jsom_array
             *});
             */
        }

        self.add_alarm = function() {
            a = new Alarm()
            self.alarms.push(a);
        }

        self.remove_alarm = function(alarm) {
            self.alarms.destroy(alarm);// Doesn't actually delete, but marks for deletion
        }

        self.update_alarms();
    }

    ko.applyBindings(new AlarmsModel());
});

