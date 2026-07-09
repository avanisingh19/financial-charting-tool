    indicatorsConfig = {
        sma: {
            type: 'sma',
            color: 'blue',
            params: { period: 14 },
            inputs: [{ id: 'period', label: 'Period', type: 'number', defaultValue: 14 }]
        },
        ema: {
            type: 'ema',
            color: 'orange',
            params: { period: 14 },
            inputs: [{ id: 'period', label: 'Period', type: 'number', defaultValue: 14 }]
        },
 
        rsi: {
            type: 'rsi',
            color: 'purple',
            params: { period: 14 },
            inputs: [{ id: 'period', label: 'Period', type: 'number', defaultValue: 14 }],
            useSecondaryAxis: true
        },
        macd: {
            type: 'macd',
            color: 'green',
            params: { shortPeriod: 12, longPeriod: 26, signalPeriod: 9 },
            inputs: [
                { id: 'shortPeriod', label: 'Short Period', type: 'number', defaultValue: 12 },
                { id: 'longPeriod', label: 'Long Period', type: 'number', defaultValue: 26 },
                { id: 'signalPeriod', label: 'Signal Period', type: 'number', defaultValue: 9 }
            ],
            useSecondaryAxis: true
        },
        bb: {
            type: 'bb',
            color: 'red',
            params: { period: 20, standardDeviation: 2 },
            inputs: [
                { id: 'period', label: 'Period', type: 'number', defaultValue: 20 },
                { id: 'standardDeviation', label: 'Std Dev', type: 'number', defaultValue: 2 }
            ]
        },
		    wma: {
			type: 'wma',
			color: 'purple', 
			params: { period: 14 },
			inputs: [{ id: 'period', label: 'Period', type: 'number', defaultValue: 14 }]
		},

        atr: {
            type: 'atr',
            color: 'brown',
            params: { period: 14 },
			useSecondaryAxis: true,

            inputs: [{ id: 'period', label: 'Period', type: 'number', defaultValue: 14 }]
        },
        stochastic: {
            type: 'stochastic',
            color: 'cyan',
            params: { period: 14, kPeriod: 3, dPeriod: 3 },
            inputs: [
                { id: 'period', label: 'Period', type: 'number', defaultValue: 14 },
                { id: 'kPeriod', label: '%K Period', type: 'number', defaultValue: 3 },
                { id: 'dPeriod', label: '%D Period', type: 'number', defaultValue: 3 }
            ],
            useSecondaryAxis: true
        },
       
        cci: {
            type: 'cci',
            color: 'darkblue',
            params: { period: 20 },
            inputs: [{ id: 'period', label: 'Period', type: 'number', defaultValue: 20 }],
            useSecondaryAxis: true
        },
		momentum: {
		type: 'momentum',
		color: 'orange', 
		params: { period: 14 },
		inputs: [{ id: 'period', label: 'Period', type: 'number', defaultValue: 14 }],
		useSecondaryAxis: true

	},    
    williamsr: {
        type: 'williamsr',
        color: 'purple',
        params: { period: 14 },
        inputs: [{ id: 'period', label: 'Period', type: 'number', defaultValue: 14 }],
		useSecondaryAxis: true
		
    },
	 roc: {
        type: 'roc',
        color: 'orange', 
        params: { period: 14 },
        inputs: [{ id: 'period', label: 'Period', type: 'number', defaultValue: 14 }],
		useSecondaryAxis: true
		
    },
	    dmi: {
        type: 'dmi',
        color: 'purple',
        params: { period: 14 }, 
        inputs: [{ id: 'period', label: 'Period', type: 'number', defaultValue: 14 }],
				useSecondaryAxis: true

    },
    dema: {
        type: 'dema',
        color: 'blue',
        useSecondaryAxis: false,
        inputs: [
            { id: 'period', label: 'Period', type: 'number', defaultValue: 14 }
        ]
    },

    linearRegression: {
        type: 'linearregression',
        color: 'purple',
        inputs: [
            { id: 'period', label: 'Period', type: 'number', defaultValue: 14 },
            { id: 'index', label: 'Index', type: 'number', defaultValue: 0 }
        ],
        useSecondaryAxis: false
    }

    };

