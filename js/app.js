document.addEventListener('DOMContentLoaded', function () {
    let parsedData = [];
    let currentIndicators = [];
    let chart;
    let selectedTimeframe = 1000; 
    let selectedIndicatorType = null;

    function parseCSV(data) {
        const parsedData = [];
        const rows = data.trim().split('\n');
        const headers = rows[0].split(',');

        for (let i = 1; i < rows.length; i++) {
            const cells = rows[i].split(',');
            if (cells.length === headers.length) {
                const time = cells[0];
                const open = parseFloat(cells[1]);
                const high = parseFloat(cells[2]);
                const low = parseFloat(cells[3]);
                const close = parseFloat(cells[4]);

                parsedData.push([convertToIST(time), open, high, low, close]);
            }
        }
        return parsedData;
    }

    function convertToIST(dateStr) {
        const [datePart, timePart] = dateStr.split(' ');
        const [year, month, day] = datePart.split('-').map(Number);
        const [hour, minute, secondPart] = timePart.split(':');
        const [second, millisecond] = secondPart.split('.').map(Number);

        const localDate = new Date(year, month - 1, day, hour, minute, second, millisecond || 0);
        const istOffset = 5.5 * 60 * 60 * 1000;
        return localDate.getTime() + istOffset;
    }

    function aggregateData(data, timeframe) {
        const aggregatedData = [];
        let startTime = data[0][0];
        let endTime = startTime + timeframe;
        let ohlc = [data[0][1], data[0][2], data[0][3], data[0][4]];

        for (let i = 1; i < data.length; i++) {
            const currentTime = data[i][0];
            if (currentTime < endTime) {
                ohlc[1] = Math.max(ohlc[1], data[i][2]);
                ohlc[2] = Math.min(ohlc[2], data[i][3]);
                ohlc[3] = data[i][4];
            } else {
                aggregatedData.push([startTime, ...ohlc]);
                startTime = currentTime;
                endTime = startTime + timeframe;
                ohlc = [data[i][1], data[i][2], data[i][3], data[i][4]];
            }
        }
        aggregatedData.push([startTime, ...ohlc]);
        return aggregatedData;
    }

    function createOHLCSeries(data) {
        return {
            type: 'candlestick',
            name: 'OHLC',
            id: 'ohlc',
            data: data,
            tooltip: {
                valueDecimals: 2,
                xDateFormat: '%Y.%m.%d %H:%M:%S.%L'
            },
            color: 'red',
            upColor: 'green'
        };
    }

    function applyIndicators() {
        if (!chart) return;

        chart.series.forEach(series => {
            if (series.options.id && series.options.id !== 'ohlc') {
                series.remove(false); 
            }
        });

        const requiresSecondaryAxis = currentIndicators.some(indicator => indicator.useSecondaryAxis);

        const secondYAxis = chart.yAxis.find(axis => axis.options.id === 'indicator-axis');
        if (secondYAxis && !requiresSecondaryAxis) {
            secondYAxis.remove(false); 
        }

        if (requiresSecondaryAxis && !secondYAxis) {
            chart.addAxis({
                title: { text: 'Indicator' },
                top: '75%',
                height: '25%',
                offset: 0,
                id: 'indicator-axis'
            }, false);
        }

        currentIndicators.forEach(indicator => {
            const yAxisIndex = indicator.useSecondaryAxis ? 'indicator-axis' : 0;

            const existingSeries = chart.series.find(series => series.options.id === indicator.type);
            if (existingSeries) {
                existingSeries.update({
                    params: indicator.params,
                    yAxis: yAxisIndex
                }, false);
            } else {
                chart.addSeries({
                    id: indicator.type,
                    type: indicator.type,
                    params: indicator.params,
                    color: indicator.color,
                    yAxis: yAxisIndex,
                    linkedTo: 'ohlc',
					marker: { enabled: false }
                }, false); 
            }
        });

        const primaryYAxis = chart.yAxis[0];
        if (requiresSecondaryAxis) {
            primaryYAxis.update({
                height: '75%'
            }, false);
        } else {
            primaryYAxis.update({
                height: '100%' 
            }, false);
        }

        chart.redraw();
    }

    function plotChart(data) {

    chart = Highcharts.stockChart('container', {

        chart: {
            marginRight: 50,

            zooming: {
                type: 'x'
            },

            panning: {
                enabled: true,
                type: 'x'
            },

            panKey: 'shift',

            events: {
                load: function () {

                    const chart = this;

                    chart.container.addEventListener('dblclick', function () {
                        chart.xAxis[0].setExtremes(null, null);

                        chart.yAxis.forEach(axis => {
                            axis.setExtremes(null, null);
                        });
                    });

                    document.addEventListener('keydown', function (event) {

                        if (event.key === 'Delete') {

                            chart.series.forEach(series => {

                                if (series.options.id &&
                                    series.options.id !== 'ohlc') {

                                    series.remove(false);

                                    currentIndicators =
                                        currentIndicators.filter(
                                            indicator =>
                                                indicator.type !== series.options.id
                                        );
                                }

                            });

                            applyIndicators();

                        }

                    });

                }
            }

        },   

        rangeSelector: {
            enabled: false
        },

        yAxis: [{
            height: '100%',
            resize: {
                enabled: true
            }
        }],

        series: [
            createOHLCSeries(data)
        ]

    });

}
function removeIndicator() {
    if (!selectedIndicatorType) return;

    const seriesToRemove = chart.series.find(series => series.options.id === selectedIndicatorType);
    if (seriesToRemove) {
        seriesToRemove.remove(false); 

        currentIndicators = currentIndicators.filter(indicator => indicator.type !== selectedIndicatorType);

        applyIndicators();
    }
}
    function initializeChart() {
        if (parsedData.length > 0) {
		const aggregatedData = aggregateData(parsedData, 1000);

        plotChart(aggregatedData);


            const timeframeSelect = document.getElementById('timeframe');
			
timeframeSelect.addEventListener('change', function() {
    selectedTimeframe = parseInt(this.value);
    const aggregatedData = aggregateData(parsedData, selectedTimeframe);

    const ohlcSeries = chart.series.find(series => series.options.id === 'ohlc');
    
    if (ohlcSeries) {
        ohlcSeries.setData(aggregatedData, false); 
        
        ohlcSeries.update({
            pointStart: aggregatedData[0][0], 
            pointInterval: selectedTimeframe 
        }, true); 
    }
    
    applyIndicators(); 
});

            const indicatorSelect = document.getElementById('indicator');
            indicatorSelect.addEventListener('change', function() {
                const selectedIndicator = this.value;
                selectedIndicatorType = selectedIndicator; 
                const indicatorParametersDiv = document.getElementById('indicator-parameters');
                indicatorParametersDiv.innerHTML = '';

                if (indicatorsConfig[selectedIndicator]) {
								
								

                    const inputs = indicatorsConfig[selectedIndicator].inputs;
                    inputs.forEach(input => {
                        const label = document.createElement('label');
                        label.setAttribute('for', input.id);
                        label.innerText = `${input.label}:`;

                        const inputField = document.createElement('input');
                        inputField.setAttribute('id', input.id);
                        inputField.setAttribute('type', input.type);
                        inputField.setAttribute('value', input.defaultValue);

                        indicatorParametersDiv.appendChild(label);
                        indicatorParametersDiv.appendChild(inputField);
                    });
                }
            });

            const applyButton = document.getElementById('apply-indicator');
			    document.getElementById('remove-indicator').addEventListener('click', removeIndicator);

            applyButton.addEventListener('click', function() {
                const selectedIndicator = indicatorSelect.value;

                if (indicatorsConfig[selectedIndicator]) {
                    const params = {};
                    indicatorsConfig[selectedIndicator].inputs.forEach(input => {
                        const inputValue = parseInt(document.getElementById(input.id).value);
                        params[input.id] = inputValue;
                    });

                    const existingIndicator = currentIndicators.find(indicator => indicator.type === selectedIndicator);

                    if (existingIndicator) {
                        existingIndicator.params = params; 
                    } else {
                        const newIndicator = {
                            type: indicatorsConfig[selectedIndicator].type,
                            params: params,
                            color: indicatorsConfig[selectedIndicator].color,
                            useSecondaryAxis: indicatorsConfig[selectedIndicator].useSecondaryAxis
                        };

                        currentIndicators.push(newIndicator);
                    }

                    applyIndicators();
                }
            });
        }
    }

    document.getElementById('file-upload').addEventListener('change', function (event) {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = function (e) {
            const data = e.target.result;
            try {
                parsedData = parseCSV(data);
                initializeChart();
            } catch (error) {
                console.error("Error parsing CSV:", error);
            }
        };

        reader.onerror = function () {
            console.error("Error reading file.");
        };

        if (file) {
            reader.readAsText(file);
        }

        document.getElementById('file-upload-container').style.display = 'none';
        timeframe.disabled = false;
        indicator.disabled = false;
    });
});

