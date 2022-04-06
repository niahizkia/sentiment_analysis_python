
//------------------------------------------------------------------------------------
//--------------GET-VARIABLE-BY-ID----------------------------------------------------
//------------------------------------------------------------------------------------
var ID = function (elID) {
  return document.getElementById(elID);
};

var hide = function (id) {
  return id.classList.add("d-none");
};

var show = function (id) {
  return id.classList.remove("d-none");
};

var formPreprocess  = ID("formPreprocess");
var formTraining    = ID("formTraining");
var formTesting     = ID("formTesting");
var formPredict     = ID("formPredict");

var btnPreprocess   = ID("btnPreprocess");
var btnPrepReset    = ID("btnPrepReset");
var btnTrain        = ID("btnTrain");
var btnTrainReset   = ID("btnTrainReset");
var btnTest         = ID("btnTest");
var btnTestReset    = ID("btnTestReset");
var btnResTest      = ID("btnResTest");
var btnPredict      = ID("btnPredict");
var btnPredictReset = ID("btnPredictReset");

var spinnerPrep     = ID("spinnerPrep");
var spinnerTrain    = ID("spinnerTrain");
var spinnerTest     = ID("spinnerTest");
var spinnerPredict  = ID("spinnerPredict");

var resPreprocess   = ID("resPreprocess");
var resPrep         = ID("resPrep")
var resTrain        = ID("resTrain");
var resTest         = ID("resTest");
var resTestingReport= ID("resTestingReport");
var resPredict      = ID("resPredict");

var emptyPreprocess = ID("emptyPreprocess");
var emptyTrain      = ID("emptyTrain");
var emptyTest       = ID("emptyTest");

var tbTest          = ID("tbTest");

var markNegative    = ID("negative");
var markNeutral    = ID("neutral");
var markPositive    = ID("positive")

//------------------------------------------------------------------------------------
//-----------------PREPROCESSING------------------------------------------------------
//------------------------------------------------------------------------------------
$(formPreprocess).submit(function (e) {
  e.preventDefault();
  show(emptyPreprocess);
  hide(resPreprocess);
  hide(btnPreprocess);

  show(btnPrepReset);
  show(spinnerPrep);

  var formData = new FormData(this);
  var xhr = $.ajax({
    url: "/preprosessing",
    type: "POST",
    cache: false,
    contentType: false,
    processData: false,
    data: formData,
    success: function (data) {
      obj = $.parseJSON(data);

      hide(spinnerPrep);
      hide(emptyPreprocess);
      show(resPrep)
      show(resPreprocess);
      $('#resultPreprocess').text(obj["message"]);

      setupDataPreprocess();

    },
    error: function (xhr, ajaxOption, thrownError) {
      Swal.fire({
        icon: "error",
        title: "Proses Dibatalkan",
        confirmButtonColor: "#577EF4",
      });
      location.reload();
    },
  });

  btnPrepReset.onclick = function () {
    xhr.abort();
    $(formPreprocess)[0].reset();
    hide(btnPrepReset);
    hide(resPreprocess);
    hide(resPrep)
    hide(spinnerPrep);
    show(btnPreprocess);
  };
});

//------------------------------------------------------------------------------------
//------------------PREDICT SENTENCE--------------------------------------------------
//------------------------------------------------------------------------------------
$(formPredict).submit(function (e) {
  e.preventDefault();
  hide(resPredict);
  hide(btnPredict);
  hide(markNegative);
  hide(markNeutral);
  hide(markPositive);

  show(btnPredictReset);
  show(spinnerPredict);

  var formData = new FormData(this);
  var xhr = $.ajax({
    url: "/predictsentence",
    type: "POST",
    cache: false,
    contentType: false,
    processData: false,
    data: formData,
    success: function (data) {
      obj = $.parseJSON(data);

      hide(spinnerPredict);
      show(resPredict);

      if (obj["prediction"] == "__label__1"){
        show(markNegative);
      } else if (obj["prediction"] == "__label__3"){
        show(markNeutral);
      } else {
        show(markPositive);
      }

      $('#accuracy').text(obj["accuracy"]);
    },
    error: function (xhr, ajaxOption, thrownError) {
      // eslint-disable-next-line no-undef
      Swal.fire({
        icon: "error",
        title: "Proses Dibatalkan",
        confirmButtonColor: "#577EF4",
      });
      location.reload();
    },
  });

  btnPredictReset.onclick = function () {
    xhr.abort();
    $(formPredict)[0].reset();
    hide(btnPredictReset);
    hide(resPredict);
    hide(spinnerPredict);
    show(btnPredict);
  };
});



//------------------------------------------------------------------------------------
//------------------T R A I N I N G---------------------------------------------------
//------------------------------------------------------------------------------------
$(formTraining).submit(function (e) {
  e.preventDefault();
  show(emptyTrain);
  hide(resTrain);
  hide(btnTrain);

  show(btnTrainReset);
  show(spinnerTrain);

  var formData = new FormData(this);
  var xhr = $.ajax({
    url: "/training",
    type: "POST",
    cache: false,
    contentType: false,
    processData: false,
    data: formData,
    success: function (data) {
      obj = $.parseJSON(data);

      hide(spinnerTrain);
      hide(emptyTrain);
      show(resTrain);

      $('#resultTrain').text(obj["pesan"]);

    },
    error: function (xhr, ajaxOption, thrownError) {
      // eslint-disable-next-line no-undef
      Swal.fire({
        icon: "error",
        title: "Proses Dibatalkan",
        confirmButtonColor: "#577EF4",
      });
      location.reload();
    },
  });

  btnTrainReset.onclick = function () {
    xhr.abort();
    $(formTraining)[0].reset();
    hide(btnTrainReset);
    hide(resTrain);
    hide(spinnerTrain);
    show(btnTrain);
  };
});

//------------------------------------------------------------------------------------
//-------------------T E S T I N G----------------------------------------------------
//------------------------------------------------------------------------------------
$(formTesting).submit(function (e) {
  e.preventDefault();
  show(emptyTest);
  hide(resTest);
  hide(resTestingReport);
  hide(btnTest);

  show(btnTestReset);
  show(spinnerTest);

  var formData = new FormData(this);
  var xhr = $.ajax({
    url: "/testing",
    type: "POST",
    cache: false,
    contentType: false,
    processData: false,
    data: formData,
    success: function (data) {
      obj = $.parseJSON(data);

      hide(spinnerTest);
      hide(emptyTest);
      show(resTest);
      $('#resultTestAcc').text(obj["result"]);
      $('#resultTestNum').text(obj["number"]);
      btnResTest.onclick = function () {
        var fileobj = JSON.parse(data);
        var fileloc = fileobj.file;
        show(resTestingReport);
        setupResDataTest(fileloc);
      };

    },
    error: function (xhr, ajaxOption, thrownError) {
      // eslint-disable-next-line no-undef
      Swal.fire({
        icon: "error",
        title: "Proses Dibatalkan",
        confirmButtonColor: "#577EF4",
      });
      location.reload();
    },
  });

  btnTestReset.onclick = function () {
    xhr.abort();
    $(formTesting)[0].reset();
    $(tbTest).dataTable().fnDestroy(); //reset data table
    hide(btnTestReset);
    hide(resTest);
    hide(resTestingReport);
    hide(spinnerTest);
    show(btnTest);
  };

});

//------------------------------------------------------------------------------------
//-----------------FUCTION-FACTORY----------------------------------------------------
//------------------------------------------------------------------------------------

function setupDataPreprocess() {

  $('#tbPreprocess').DataTable({
    "ajax": {
      "url": '/preprocessres',
      "dataType": "json",
      "dataSrc": "data",
      "contentType": "application/json"
    },
    "columns": [
      {
        "data": "review"
      }
    ],

    "columnDefs": [{
        "className": "text-left",
        "targets": "_all"
      },
    ],
  });

}

function setupResDataTest(fileloc) {
  var urlFile = '/testres/' + fileloc
  $('#tbTest').DataTable({
    "ajax": {
      "url": urlFile,
      "dataType": "json",
      "dataSrc": "data",
      "contentType": "application/json"
    },
    "columns": [
      {
        "data": "review"
      },
      {
        "data": "prediction"
      }
    ],

    "columnDefs": [{
        "className": "text-left",
        "targets": "_all"
      },
    ],
  });

}
