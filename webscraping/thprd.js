var request = require('request');
var cheerio = require('cheerio');

pools = {
    'Aloha': 3,
    'Beaverton': 15,
    'Conestoga': 12,
    'Harman': 11,
    'Raleigh': 6,
    //'Somerset': 22, // broken link - http://www.thprd.org/schedules/schedule.cfm?cs_id=22
    'Sunset': 5,
    'Tualatin Hills': 2
};
days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

for (pool in pools) {
    var url = 'http://www.thprd.org/schedules/schedule.cfm?cs_id=' + pools[pool];
    request(url, ( function(pool) {
        return function(err, resp, body) {
            if (err)
                throw err;
            $ = cheerio.load(body);
            
            $('#calendar .days td').each(function(day) {
                $(this).find('div').each(function() {
                    event = $(this).text().trim().replace(/\s\s+/g, ',').split(',');
                    if (event.length >= 2 && event[1].match(/open swim/i))
                        console.log(pool + ',' + days[day] + ',' + event[0] + ',' + event[1]);
                });
            });
        }
    })(pool));
}