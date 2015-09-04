$(document).ready(function() {

    /* EVENT: Submits user stockquote when the user presses the enter key from within the user input field. */
    $('#stockquote__user-input').keydown(function (e) {
        if (e.keyCode === 13) {
            $('#stockquote__user-submit').click();
            $('#stockquote__user-input').click();
        }
    });

    /* EVENT: Submits user stockquote on button click.
     *  Validates symbol and transforms symbol to uppercase. Passes symbol to fetchQuote function. */
    $('#stockquote__user-submit').click(function (e) {
        var symbol = $('#stockquote__user-input').val().toUpperCase();
        fetchQuote(symbol);
    });

    /* EVENT: Empties stockquote user input field when user clicks on field. */
    $('#stockquote__user-input:text').click(function (e) {
        $(this).val('');
    });

    /* EVENT: Hides API Error message when the user clicks on the user input field. */
    $('#stockquote__user-input').click(function(e){
        $('#stockquote__api-error').hide();
    });


    function fetchQuote(symbol){
        $.ajax({
            dataType: "jsonp",
            url: "http://dev.markitondemand.com/Api/v2/Quote/jsonp?symbol=" + symbol,
            error: function errorCallback (error) {
                if (error) {
                    console.log ('ERROR');
                }
            },
            success: function successCallback (data) {
                if (data.hasOwnProperty("Message")) {
                    $('#stockquote__api-error').show()
                        .html('The previous stock quote request for&#58;&#32;' + symbol + '&#32;ended in error.' +
                        '<br>' + 'Please re&#45;enter a valid stock quote symbol')
                        .css('color', 'red');
                } else {
                    negPos(data);
                    $('h1').html(data.Name);
                    $('#stockquote__name').html(splitName(data.Name));
                    $('#stockquote__last-price').html(data.LastPrice);
                    $('#stockquote__change').html(roundCurrency(data.Change));
                    $('#stockquote__change-percent').html(roundCurrency(data.ChangePercent));
                    $('#stockquote__range-low').html(roundCurrency(data.Low));
                    $('#stockquote__range-high').html(roundCurrency(data.High));
                    $('#stockquote__open').html(roundCurrency(data.Open));
                    $('#stockquote__volume').html(volumeAssess(data.Volume));
                    $('#stockquote__market-cap').html(volumeAssess(data.MarketCap));
                    $('#stockquote__time-stamp').html(momentConvert(data.Timestamp));

                }
            }
        });
    }

    /* NOTE: All 'data' arguments being passed into functions below are data retrieved from the Markit Stockquote API */

    /*FUNCTION: /splitName/
     *ARGUMENTS: data.Name from Markit Stockquote API.
     *DESCRIPTION: Splits company name on spaces, insert <br> tags per HTML Module Example.
     */
    function splitName(data){
        var splitResult = data.split(' ');
        return splitResult.join('<br>');
    }

    /*FUNCTION: /negPos/
     * ARGUMENTS: data.Change from Markit Stockquote API
     * DESCRIPTION: Uses the data.Change field to determine if the value is positive or negative.
     * Existing class is edited to display red or green color fonts based on the retrieved value.
     * This class applies color to the <td> element containing the retrieved values from data.Change, and
     * data.ChangePercent
     */
    function negPos (data){
        var changeNum = data.Change;
        if (changeNum > 0) {
            $('.stockquote__change--font').css('color', 'green');
        } else {
            $('.stockquote__change--font').css('color', 'red');
        }
    }

    /*FUNCTION: /roundCurrency/
     * DEPENDENCY: Accounting.js currency library.
     * This library was implemented to avoid known pitfalls with floating point integers in JavaScript.
     * This feature integration is necessary for a financial market web application.
     * ARGUMENTS: data.Change, data.PercentChange, data.Low, data.High; from Markit Stockquote API.
     * DESCRIPTION: Rounds currency values to 2 decimal places using the accounting.js library.
     */
    function roundCurrency(data) {
        return accounting.toFixed(data, [precision = 2]);
    }

    /*FUNCTION: /volumeAssess/
     * ARGUMENTS: data.Volume, data.MarketCap; from Markit Stockquote API
     * DESCRIPTION: Rounds Volume and MarketCap data, and assesses data volume in Millions, Billions, or returns a number if less
     * than 1 million.
     */
    function volumeAssess(data) {
        if (data <= 999999) {
            return data;
        } else if (data <= 999999999) {
            return (Math.round((data / 1000000) * 100) / 100) + 'M';
        } else {
            //(data > 999999999)
            return (Math.round((data / 1000000000) * 100) / 100) + 'B';
        }
    }

    /*FUNCTION: /momentConvert/
     * DEPENDENCY: Moment.js date library.  *****NOTE: Deprecation warning error in console.*****
     * ARGUMENTS:: data.Timestamp; from Markit Stockquote API
     * DESCRIPTION: Transforms UTC date and prepends reformatted date with HTML 'As of&#32;'
     */
    function momentConvert(data) {
        //var m = moment.utc(data);
        // return m.format('hh:mm:ss A');
        return 'As of&#32;' + moment.utc(data).format('hh:mm:ss A');
    }

});