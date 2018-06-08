var db = require('../server/db')();
var pageRecordLength = 10;
module.exports = () => {

    async function get(req, res) {
        var r = req.body;
        if (r.paging == undefined)
            r.paging = await getPagingQuery();
        var pipeline = [{
                $group: {
                    _id: '$description',
                    sales: {
                        '$sum': '$nrc_amount'
                    }
                }
            },
            {
                $skip: (r.paging.page - 1) * pageRecordLength
            },
            {
                $limit: pageRecordLength
            }
        ];

        var options = db.getQueryObj({
            db: 'it-api',
            mongoUrl: 'mongodb://Justinkdeveloper:SilverBells2017$$@itasandbox-shard-00-00-51evd.mongodb.net:27017/',
            collection: 'order_contents',
            q: {
                pipeline: pipeline
            }
        });

        db.getAgrregatedData(options, function (r1) {
            if (r1 == undefined)
                r1 = [];
            r.data = r1;
            res.json(r);
        })
    }


    function getPagingQuery() {
        return new Promise(function (res, rej) {
            var options = db.getQueryObj({
                db: 'it-api',
                mongoUrl: 'mongodb://Justinkdeveloper:SilverBells2017$$@itasandbox-shard-00-00-51evd.mongodb.net:27017/',
                collection: 'order_contents',
                q: {
                    pipeline: [{
                        $group: {
                            _id: '$description',
                            count: {
                                '$sum': 1
                            }
                        }
                    }, {
                        $group: {
                            _id: '',
                            count: {
                                $sum: 1
                            }
                        }
                    }]
                }
            });

            db.getAgrregatedData(options, function (r) {
                if (r == undefined) {
                    r = {};
                    r.count = 0;
                    r = [r];
                }
                r = r[0];
                r.page = 1;
                res(r);
            })
        })
    }
    return {
        get: get
    }
}