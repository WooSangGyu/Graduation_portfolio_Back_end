let resultcodeObj = {
    //resultcode
    SuccessCode : 200,
    FailedCode : 400,
    ReadErrorCode : 404,
    SeverErrorCode : 500,

    //성공 및 실패
    SuccessMessage : "Success",
    FailedMessage : "Failed",
    Windowopen : "Open window because indust over",
    Windowclose : "Close window because outdust over",
    WindowWeatherclose : "weather code over",
    AutoOnMessage : "auto on success",
    AutoOffMessage : "auto off success",
    AutoSetfailMessage : "auto Set fail",

    //CRU 에러
    CreateError : "Create Error",
    ReadError : "Read Error",
    UpdateError : "Update Error",
};

module.exports = resultcodeObj