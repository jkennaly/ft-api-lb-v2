// date.js
const week = [
'Sunday',
'Monday',
'Tuesday',
'Wednesday',
'Thursday',
'Friday',
'Saturday'
]

module.exports = function(DateModel){



    DateModel.createWithDays = function(data, cb) {
      //console.log('DateModel.createWithDays ')
      //console.log(data.basedate)
    	//create the DateModel
      DateModel.create(data, function(err, date) {
        const basedate = new Date(data.basedate)
      //console.log(basedate)
        for(var i=0;i<data.dayCount;i++){
          var iDate = new Date(data.basedate)
          iDate.setDate(iDate.getDate() + i)
      //console.log(iDate)
          date.days.create({
            date: date.id,
            name: week[iDate.getUTCDay()],
            daysOffset: i,
            user: data.user
          })

        }
      cb(err, date);
      })
    }

    DateModel.remoteMethod('createWithDays', {
          accepts: { arg: 'data', type: 'object', http: { source: 'body' } },
        returns: {arg: 'data', type: 'object'}

    });
};

