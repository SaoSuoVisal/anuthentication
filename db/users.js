var records = [
    { id: 1, email: 'visal.s@ligercambodia.org', password: 'liger72724', displayName: 'VisalSao'}
  , { id: 2, email: 'vuthy.v@ligercambodia.org', password: 'liger72724', displayName: 'VuthyVey'}
];
/*
var records = [
    { id: 1, email: 'visal.s@ligercambodia.org', password: 'liger72724', displayName: 'VisalSao' },
  	{ id: 2, email: 'vuthy.v@ligercambodia.org', password: 'liger72724', displayName: 'VuthyVey' }
];

*/

exports.findById = function(id, done) {
  process.nextTick(function() {
    var idx = id - 1;
    if (records[idx]) {
      done(null, records[idx]);
    } else {
      done(new Error('User ' + id + ' does not exist'));
    }
  });
}

exports.findByUsername = function(username, done) {
  process.nextTick(function() {
    for (var i = 0, len = records.length; i < len; i++) {
      var record = records[i];
      if (record.email === username) {
        return done(null, record);
      }
    }
    return done(null, null);
  });
}