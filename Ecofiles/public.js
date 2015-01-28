var PublicApp =  new Marionette.Application();

var GlobalModel =   Backbone.Model.extend({
    dataVisualization: 'CHART'
});

PublicApp.addInitializer(function(){
    this.globalModel = new GlobalModel();
});

var counterModel;

// DECLARATION DES REGIONS
PublicApp.addRegions({
    "region_map"        :   "#region-map",
    "region_title"      :   "#region-title",
    "region_lastDay"    :   "#region-lastDay",
    "region_total"      :   "#region-total",
    "region_chart"      :   "#region-chart",
    "region_table"      :   "#region-table",
    "region_message"    :   "#region-message"
});
var chartView;
var tableView;
var mapView;
var titleView;
var messageView;

// INITIALISATION DE LA PAGE
PublicApp.on("start", function(){
    //window.odometerOptions = {selector: '.header_value'};
    $('html').i18n();

    /*
    Highcharts.setOptions({
        global: { useUTC: false }
    });
    */

    var chartChannel = Backbone.Radio.channel('chart');
    chartChannel.reply('setLastDay', function (oLastDay){
        var lastDayView    =   new LastDayView({model:oLastDay});
        PublicApp.region_lastDay.show(lastDayView);

    });
    chartChannel.reply('setTotal', function (oTotal){
        var totalView    =   new TotalView({model:oTotal});
        PublicApp.region_total.show(totalView);
    });

    $(document).on('change', '.select-lang', function(){
        var _lang = $(this).val();

        $('#header-select-lang').val(_lang);
        $('#footer-select-lang').val(_lang);
        /*
        if ((_lang == 'sv') || (_lang == 'no')) numeral.language('en');
        else if (_lang == 'ca') numeral.language('es')
        else numeral.language(_lang);
        */
        i18n.init({lng:_lang, fallbackLng: 'en'}, function (){
            $(document).i18n();
            setLanguage(_lang);
            $('#serie-cumul').html( i18n.t('chart.cumul') );
            $('#serie-pratique').html( i18n.t('chart.pratique') );
            $('#serie-sens').html( i18n.t('chart.sens') );
        });
    });

    $(document).on('click', '.share-links', function(){
        var elt = $(this).attr('name');
        var link;
        switch (elt) {
            case 'fb_share':
                link = 'https://www.facebook.com/sharer/sharer.php?u=' + window.location;
                window.open(link);
                break;
            case 'tt_share':
                link = 'https://twitter.com/home?status=' + window.location;
                window.open(link);
                break;
            case 'gp_share':
                link = 'https://plus.google.com/share?url=' + window.location;
                window.open(link);
                break;
            case 'li_share':
                link = 'https://www.linkedin.com/shareArticle?mini=true&url=' + window.location + '&title=' + document.title + '&summary=&source=';
                window.open(link);
                break;
            case 'mail_share':
                link = 'mailto:?body='+ window.location + '&subject=' + document.title;
                window.location.href = link;
                break;
        }
    });

    counterModel    =   new CounterModel({id: window.counter_id});
    mapView         =   new MapView({model:counterModel});
    titleView       =   new TitleView({model:counterModel});
    messageView     =   new MessageView({model:counterModel});

    var language = window.navigator.userLanguage || window.navigator.language;
    var index = language.indexOf("-");
    if (index != -1) language = language.substring(0,index);

    counterModel.fetch({

        success: function(data){
            document.title = counterModel.get('titre');
            var lang = data.get('langue').toLowerCase();
            if (lang == 'us') lang = 'en';
            if (lang == 'ca') lang = 'en';

            i18n.init({lng:lang, fallbackLng: 'en'}, function (){
                $(document).i18n();
            });
            setLanguage( lang );

            $("#dateDebut").val(moment(counterModel.get('date'), "YYYY-MM-DD").hours(0).minutes(0).seconds(0).format("DD/MM/YYYY"));
            $("#dateFin").val(moment().format("DD/MM/YYYY"));

            // INITIALISATION DU MENU DU GRAPHIQUE
            initChartOptions(counterModel);

            // CREATION DU GRAPHIQUE
            makeChart(counterModel, 4);

            PublicApp.region_map.show(mapView);
            PublicApp.region_title.show(titleView);
            PublicApp.region_message.show(messageView);
        },
        error:function(a,b,c){
            console.log(a);
            console.log(b);
            console.log(c);
        }
    });

});


// DEFINITION DE LA LANGUE
function setLanguage(lang) {
    moment.lang(lang);
    var langFile;

    $.getScript('js/vendor/languages.min.js', function() {
        switch (lang.toLowerCase()) {
            case "fr":
                langFile = "locales/bootstrap-datepicker.fr";
                numeral.language(lang);
                break;
            case "ja":
                langFile = "locales/bootstrap-datepicker.ja";
                numeral.language(lang);
                break;
            case "de":
                langFile = "locales/bootstrap-datepicker.de";
                numeral.language(lang);
                break;
            case "pl":
                langFile = "locales/bootstrap-datepicker.pl";
                numeral.language(lang);
                break;
            case "no":
                langFile = "locales/bootstrap-datepicker.no";
                numeral.language("en");
                break;
            case "es":
                langFile = "locales/bootstrap-datepicker.es";
                numeral.language("es");
                break;
            case "ca":
                langFile = "locales/bootstrap-datepicker.es";
                numeral.language("es");
                break;
            case "sv":
                langFile = "locales/bootstrap-datepicker.se";
                numeral.language("en");
                break;
            case "hu":
                langFile = "locales/bootstrap-datepicker.hu";
                numeral.language(lang);
                break;
            default:
                numeral.language("en");
                break;
        }


        if (langFile == undefined) {
            $('.compDate').datepicker({
                format: "dd/mm/yyyy",
                todayBtn: "linked",
                autoclose: true,
                startDate: moment(counterModel.get('date'), "YYYY-MM-DD").format("DD/MM/YYYY"),
                endDate:moment().format("DD/MM/YYYY"),
                orientation: "top auto",
                todayHighlight: true
            }).on("hide", function(e){
                $(this).trigger('closeEvent');
            });
        } else {
            $.getScript('js/' + langFile + ".js", function () {
                $('.compDate').datepicker({
                    format: "dd/mm/yyyy",
                    todayBtn: "linked",
                    language: lang,
                    startDate: moment(counterModel.get('date'), "YYYY-MM-DD").format("DD/MM/YYYY"),
                    endDate:moment().format("DD/MM/YYYY"),
                    autoclose: true,
                    orientation: "top auto",
                    todayHighlight: true
                }).on("hide", function(){
                    $(this).trigger('closeEvent');
                });
            });
        }
    });
}


function makeTable(model) {
    $("#region-chart").hide();
    $("#region-table").show();

    PublicApp.globalModel.dataVisualization = 'TABLE';

    getTableData(model, function(d) {
        tableView = new TableView({model: d});
        PublicApp.region_table.show(tableView);
    });

}


// RECUPERATION DES DONNEES DEPUIS L'API, EN FONCTION DE L'INTERVALLE
function getData(step, model, callback) {
    var dataModel = new DataModel({id: model.get("id")});

    dataModel.fetch({
        data: {
            begin: model.get("date").replace(/[-]+/g, ''),
            end: moment().add('d', -1).format("YYYYMMDD"),
            step: step
        },
        success: function(d) {
            var array = $.map(d.attributes, function(value, index) {
                return [value];
            });
            array.splice((array.length-1),1); // Enlève le dernier élément qui est l'id
            callback(array);
        },
        error: function(a,b,c){
            console.log(a + " " + b + " " + c);
        }
    });
}

// RECUPERATION DES CHIFFRES CLES
function getTableData(model, callback) {
    var tableDataModel = new TableDataModel({id: model.get("id")});

    tableDataModel.fetch({
        data: {
            begin: moment( $('#dateDebut').val(), 'DD/MM/YYYY').unix() * 1000,
            end: moment( $('#dateFin').val(), 'DD/MM/YYYY').hours(23).minutes(59).unix() * 1000
        },
        success: function(d) {
            console.log(d)
            callback(d);
        },
        error: function(a,b,c){
            console.log(a + " " + b + " " + c);
        }
    });
}

function makeChart(model, step) {
    $("#region-table").hide();
    $("#region-chart").show();
    PublicApp.globalModel.dataVisualization = 'CHART';
    chartView    =   new ChartView({model:model, step:step});
    PublicApp.region_chart.show(chartView);

}

function initChartOptions(model) {
    $("#chartJ").click(function(){
        $("#region-table").hide();
        $("#region-chart").show();
    });
    $("#chartS").click(function(){
        $("#region-table").hide();
        $("#region-chart").show();
    });
    $("#chartM").click(function(){
        $("#region-table").hide();
        $("#region-chart").show();
    });

    $("#tableKey").click(function(){
        makeTable(model);
    });
}

(function(){

    var language = window.navigator.userLanguage || window.navigator.language;
    var index = language.indexOf("-");
    if (index != -1) language = language.substring(0,index);
    i18n.init({lng:language, fallbackLng: 'en'}, function (){
        if (language == 'ca') language = 'en';
        $('#footer-select-lang').val(language);
        if ($('#footer-select-lang').val() != language) $('#footer-select-lang').val('en');
        PublicApp.start();
    });
})();
