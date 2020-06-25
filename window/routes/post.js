var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
const models = require('../models');
var resCode = require('../resultCode/code');
var CronJob = require('cron').CronJob; 


//자동제어 시 실행 될 함수
const auto = function(res) {
    models.outdust.findOne({
        where : {
            no : 1
        },
        order : [[ 'time' , 'DESC']]
        })
        .then( outdu =>{
            models.indust.findOne({
                where : {
                    no : 1
                },
                order : [[ 'time' , 'DESC']]
            })
            .then( indu => {
                console.log("자동제어중");
            if( outdu.dataValues.weather === 0 ) { //강수코드 0일때만 자동조절 온
                if( indu.dataValues.indust < outdu.dataValues.outdust){ // 실외 미세먼지가 더 높을때
                   models.window.update({
                        status : "close"
                    },{
                        where: {
                            no : 1
                        }
                    })
                    .then( statusclose =>{
                        console.log("실외미세먼지가 많아 창문을 닫습니다.");
                        return({
                                    success : statusclose,
                                    resultCode : resCode.SuccessCode,
                                    message : resCode.Windowclose
                            })
                        })
                        .catch( err => {
                            console.log(err);
                        })
                } else //실내 미세먼지가 더 높다면
                {
                    models.window.update({
                        status : "open"
                    },{
                        where: {
                            no : 1
                        }
                    })
                   .then( statusopen =>{
                        console.log("실내미세먼지가 많아 창문을 엽니다.");
                        return({
                            success : statusopen,
                            resultCode : resCode.SuccessCode,
                            message : resCode.Windowopen
                        })
                    })
                    .catch( err => {
                        console.log(err);
                        console.log("창문 열기 실패")
                        return({
                            resultCode : resCode.FailedCode,
                            message : resCode.UpdateError
                        })
                    })
                }
                } else // 강수코드가 1이상일 때
                {
                    models.window.update({
                        status : "close"
                    })
                    .then( statusopen =>{
                        console.log("실외의 강수코드가 1이상 이므로 창문을 닫습니다.");
                        return({
                            resultCode : resCode.SuccessCode,
                            message : resCode.WindowWeatherclose
                        })
                    })
                    .catch( err => {
                        console.log(err);
                        console.log("창문 닫기 실패");
                        return({
                            resultCode : resCode.FailedCode,
                            message : resCode.UpdateError
                        })
                    })
                }
            })
            .catch( err => {
                console.log(err);
                console.log("실내 데이터 조회 실패");
                return({
                    resultCode : resCode.ReadErrorCode,
                    message : resCode.ReadError
                })
            })
        })
        .catch( err => {
            console.log("실외 데이터 조회 실패");
            return({
                resultCode : resCode.ReadErrorCode,
                message : resCode.ReadError
            })
        });
    };

 // 스케줄 종료 시 메시지
const stopAlert = () => console.log("스케줄러 종료");

// 10분간격으로 실행 / auto함수 실행 / 종료시 메시지 / 자동시작여부 / TimeZone
const job = new CronJob('*/2 * * * * *', auto, stopAlert, false, 'Asia/Seoul');


//주소 저장 하기
router.post('/address', function(req,res, next) {
    let body = req.body;

    models.address.create({
        region : body.region
    })
    .then(address => {
        console.log("주소 저장");
        res.json({
            success : address,
            resultCode : resCode.SuccessCode,
            message : resCode.SuccessMessage
        })
    })
    .catch( err => {
        console.log(err);
        res.json({
            resultCode : resCode.FailedCode,
            message : resCode.CreateError
    })
    });
});

//창문 현재 값 가져오기
router.get('/window', function(req,res, next) {
    let body = req.body;

    models.window.findAll({
        attributes : [ status ]
    })
    .then(win => {
        console.log("창문 값 가져오기");
        res.json({
            success : win,
            resultCode : resCode.SuccessCode,
            message : resCode.SuccessMessage
        })
    })
    .catch( err => {
        console.log(err);
        res.json({
            resultCode : resCode.ReadErrorCode,
            message : resCode.ReadError
        })
    });
});

//블라인드 현재 값 가져오기
router.get('/blind', function(req,res, next) {

    models.blind.findAll({
    })
    .then(bli => {
        console.log("블라인드 값 가져오기");
        res.json({
            success : bli,
            resultCode : resCode.SuccessCode,
            message : resCode.SuccessMessage
        })
    })
    .catch( err => {
        console.log(err);
        res.json({
            resultCode : resCode.ReadErrorCode,
            message : resCode.ReadError
        })
    });
});

//실내 미세먼지 값 가져오기
router.get('/indust', function(req,res, next) {

    models.indust.findAll({
        attributes : [ indust],
        limit : 1,
        order : 'time desc'
    })
    .then(indu => {
        console.log("실내 미세먼지 가져오기");
        res.json({
            success : indu,
            resultCode : resCode.SuccessCode,
            message : resCode.SuccessMessage
        })
    })
    .catch( err => {
        console.log(err);
        res.json({
            resultCode : resCode.ReadErrorCode,
            message : resCode.ReadError
        })
    });
});

//실외 미세먼지 값 가져오기
router.get('/outdust', function(req,res, next) {
    let body = req.body;

    models.outdust.findAll({
        attributes : [ outdust],
        limit : 1,
        order : 'time desc'
    })
    .then(outdu => {
        console.log("실외 미세먼지 가져오기");
        res.json({
            success : outdu,
            resultCode : resCode.SuccessCode,
            message : resCode.SuccessMessage
        })
    })
    .catch( err => {
        console.log(err);
        res.json({
            resultCode : resCode.ReadErrorCode,
            message : resCode.ReadError
        })
    });
});

//창문 상태 Open
router.put('/windowopen', function(req, res, next) {
    
    models.window.update({
        status : "open"
    })
    .then( status => {
        console.log("창문 열기");
        res.json({
            success : status,
            resultCode : resCode.SuccessCode,
            message : resCode.SuccessMessage
        })
    })
    .catch( err => {
        console.log(err);
        res.json({
            resultCode : resCode.FailedCode,
            message : resCode.UpdateError
        })
    });
})

//창문 상태 Close
router.put('/windowclose', function(req, res, next) {
    
    models.window.update({
        status : "close"
    })
    .then( status => {
        console.log("창문 닫기");
        res.json({
            success : status,
            resultCode : resCode.SuccessCode,
            message : resCode.SuccessMessage
        })
    })
    .catch( err => {
        console.log(err);
        res.json({
            resultCode : resCode.FailedCode,
            message : resCode.UpdateError
        })
    });
})

// 블라인드 0%
router.put('/blind0', function(req, res, next) {
    
    models.blind.update({
        status : 0
    })
    .then( status => {
        console.log("블라인드 값 0으로 조절");
        res.json({
            success : status,
            resultCode : resCode.SuccessCode,
            message : resCode.SuccessMessage
        })
    })
    .catch( err => {
        console.log(err);
        res.json({
            resultCode : resCode.FailedCode,
            message : resCode.UpdateError
        })
    });
})

// 블라인드 25%
router.put('/blind25', function(req, res, next) {
    
    models.blind.update({
        status : 25
    })
    .then( status => {
        console.log("블라인드 값 25로 조절");
        res.json({
            success : status,
            resultCode : resCode.SuccessCode,
            message : resCode.SuccessMessage
        })
    })
    .catch( err => {
        console.log(err);
        res.json({
            resultCode : resCode.FailedCode,
            message : resCode.UpdateError
        })
    });
})

// 블라인드 50%
router.put('/blind50', function(req, res, next) {
    
    models.blind.update({
        status : 50
    })
    .then( status => {
        console.log("블라인드 값 50으로 조절");
        res.json({
            success : status,
            resultCode : resCode.SuccessCode,
            message : resCode.SuccessMessage
        })
    })
    .catch( err => {
        console.log(err);
        res.json({
            resultCode : resCode.FailedCode,
            message : resCode.UpdateError
        })
    });
})

// 블라인드 75%
router.put('/blind75', function(req, res, next) {
    
    models.blind.update({
        status : 75
    })
    .then( status => {
        console.log("블라인드 값 75으로 조절");
        res.json({
            success : status,
            resultCode : resCode.SuccessCode,
            message : resCode.SuccessMessage
        })
    })
    .catch( err => {
        console.log(err);
        res.json({
            resultCode : resCode.FailedCode,
            message : resCode.UpdateError
        })
    });
})

// 블라인드 100%
router.put('/blind100', function(req, res, next) {
    
    models.blind.update({
        status : 100
    })
    .then( status => {
        console.log("블라인드 값 100으로 조절");
        res.json({
            success : status,
            resultCode : resCode.SuccessCode,
            message : resCode.SuccessMessage
        })
    })
    .catch( err => {
        console.log(err);
        res.json({
            resultCode : resCode.FailedCode,
            message : resCode.UpdateError
        })
    });
})

//창문 자동조절 ON
router.put('/window/autoon', function(req, res, next) {
    
    models.window.update({
        auto : 1
    }, {
        where: { auto : 0 }
    })
    .then( result => {
        console.log("창문 자동제어를 시작합니다.");
        job.start();
        res.json({
            success : result,
            resultCode : resCode.SuccessCode,
            message : resCode.AutoOnMessage
        })
    })
    .catch( err => {
        console.log(err);
        res.json({
            resultCode : resCode.FailedCode,
            message : resCode.AutoSetfailMessage
        })
    })
})

//창문 자동조절 OFF
router.put('/window/autooff', function(req, res, next) {
    
    models.window.update({
        auto : 0
    },{
        where : { auto : 1 }
    })
    .then( result => {
        console.log("창문 자동제어를 종료합니다.");
        job.stop();
        res.json({
            success : result,
            resultCode : resCode.SuccessCode,
            message : resCode.AutoOffMessage
        })
    })
    .catch( err => {
        console.log(err);
        res.json({
            resultCode : resCode.FailedCode,
            message : resCode.AutoSetfailMessage
        })
    })
})


module.exports = router;
