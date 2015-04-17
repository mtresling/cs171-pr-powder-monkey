fs = require('fs');
request = require('request');

var file = fs.createWriteStream('data.json');
//file.write("[\n");

var bigdata = {
	"countries": [],
	"country_x": {}
};

var indicators = [
	{
		mnemonic: "population",
		source: "worldbank.org",
		source_id: "SP.POP.TOTL" 
	},
	{
		mnemonic: "health_expenditure",
		source: "worldbank.org",
		source_id: "SH.XPD.TOTL.CD"
	},
	{
		mnemonic: "gdp",
		source: "worldbank.org",
		source_id: "NY.GDP.MKTP.CD"
	},
	{
		mnemonic: "gross_savings",
		source: "worldbank.org",
		source_id: "NY.GNS.ICTR.ZS"
	},
	{
		mnemonic: "inflation",
		source: "worldbank.org",
		source_id: "FP.CPI.TOTL.ZG"
	},
	{
		mnemonic: "trade_per_gdp",
		source: "worldbank.org",
		source_id: "NE.TRD.GNFS.ZS"
	},
	{
		mnemonic: "foreign_direct_investment",
		source: "worldbank.org",
		source_id: "BX.KLT.DINV.WD.GD.ZS"
	},
	{
		mnemonic: "age_dependency_ratio",
		source: "worldbank.org",
		source_id: "SP.POP.DPND"
	},
	{
		mnemonic: "birth_rate",
		source: "worldbank.org",
		source_id: "SP.DYN.CBRT.IN"
	},
	{
		mnemonic: "death_rate",
		source: "worldbank.org",
		source_id: "SP.DYN.CDRT.IN"
	},
	{
		mnemonic: "fertility_rate",
		source: "worldbank.org",
		source_id: "SP.DYN.TFRT.IN"
	},
	{
		mnemonic: "net_migration",
		source: "worldbank.org",
		source_id: "SM.POP.NETM"
	},
	{
		mnemonic: "urban_population",
		source: "worldbank.org",
		source_id: "SP.URB.TOTL.IN.ZS"
	},
	{
		mnemonic: "public_spending_on_education",
		source: "worldbank.org",
		source_id: "SE.XPD.TOTL.GD.ZS"
	},
	{
		mnemonic: "literacy_rate",
		source: "worldbank.org",
		source_id: "SE.ADT.LITR.ZS"
	},
	{
		mnemonic: "primary_completion_rate",
		source: "worldbank.org",
		source_id: "SE.PRM.CMPT.ZS"
	},
	{
		mnemonic: "labor_force_participation_rate",
		source: "worldbank.org",
		source_id: "SL.TLF.ACTI.FE.ZS"
	},
	{
		mnemonic: "unemployment",
		source: "worldbank.org",
		source_id: "SL.UEM.TOTL.ZS"
	},
	{
		mnemonic: "gni_per_capita",
		source: "worldbank.org",
		source_id: "NY.GNP.PCAP.CD"
	},
	{
		mnemonic: "gini_index",
		source: "worldbank.org",
		source_id: "SI.POV.GINI"
	},
	{
		mnemonic: "poverty_headcount_ratio",
		source: "worldbank.org",
		source_id: "SI.POV.NAHC"
	},
	{
		mnemonic: "improved_water_source",
		source: "worldbank.org",
		source_id: "SH.H2O.SAFE.ZS"
	},
	{
		mnemonic: "improved_sanitation_facilities",
		source: "worldbank.org",
		source_id: "SH.STA.ACSN"
	},
	{
		mnemonic: "health_expenditure_per_gdp",
		source: "worldbank.org",
		source_id: "SH.XPD.TOTL.ZS"
	},
	{
		mnemonic: "health_expenditure_per_capita",
		source: "worldbank.org",
		source_id: "SH.XPD.PCAP"
	},
	{
		mnemonic: "health_expenditure_public",
		source: "worldbank.org",
		source_id: "SH.XPD.PUBL"
	},
	//{
	//	mnemonic: "health_expenditure_private",
	//	source: "worldbank.org",
	//	source_id: "SH.XPD.PRIV"
	//},
	{
		mnemonic: "out_of_pocket_health_exp",
		source: "worldbank.org",
		source_id: "SH.XPD.OOPC.TO.ZS"
	},
	{
		mnemonic: "physician_density",
		source: "worldbank.org",
		source_id: "SH.MED.PHYS.ZS"
	},
	{
		mnemonic: "hospital_bed_density",
		source: "worldbank.org",
		source_id: "SH.MED.BEDS.ZS"
	},
	{
		mnemonic: "tb_treatment_success_rate",
		source: "worldbank.org",
		source_id: "SH.TBS.CURE.ZS"
	},
	{
		mnemonic: "immunization_dpt",
		source: "worldbank.org",
		source_id: "SH.IMM.IDPT"
	},
	{
		mnemonic: "births_att_by_skilled_health_staff",
		source: "worldbank.org",
		source_id: "SH.STA.BRTC.ZS"
	}
];

function get_countries(page) {
	var url = "http://api.worldbank.org/countries?format=json&page=" + page;
	request(url, function (error, response, body) {
		if (error || response.statusCode != 200) {
      		console.error("Error: " + body); 
      		return;
    	};
    	try {
			var data = JSON.parse(body);
			if (data[0].page <= data[0].pages) {
				data[1].forEach(function(d){
		    		if(d.region.value != "Aggregates"){
		    			bigdata.countries.push({
		    				mnemonic: d.iso2Code,
		    				name: d.name,
		    				income_level: d.incomeLevel.value,
		    				capital: d.capitalCity,
		    				longitude: d.longitude,
		    				latitude: d.latitude
		    			});
		    		};
		    	});
		    	get_countries(page + 1);
		    } else {
		    	bigdata.countries.sort(function(a,b){
  					if(a.mnemonic < b.mnemonic) {return -1};
  					if(a.mnemonic > b.mnemonic) {return 1};
  					return 0;
				});
		    	bigdata.countries.forEach(function(d,i){
		    		indicators.forEach(function(dd){
		    			bigdata.countries[i][dd.mnemonic] = [];
		    		});	
		    		bigdata.country_x[d.mnemonic] = i;	
		    	});
		    	console.log(bigdata.countries.length + " countries loaded.");	    	
		    	get_country_indicators(0);
		    };		    
	    } catch (e) {
	   		console.error(e);
	    };
	});
};

function get_country_indicators(i) {
	if(indicators[i]) {
		get_world_bank_indicators(indicators[i]["mnemonic"], indicators[i]["source_id"], i, 1);	
	} else {
		var stringified = JSON.stringify(bigdata, null, '\t');
		file.write(stringified);
        //file.write("]");
        file.end();
		console.log("done!");
	};	
};

function get_world_bank_indicators(mnemonic, source_id, i, page) {
	var url = "http://api.worldbank.org/countries/all/indicators/" + source_id + "?format=json&page=" + page;
	request(url, function (error, response, body) {
		if (error || response.statusCode != 200) {
      		console.error("Error: " + body); 
      		return;
    	};
    	try {
			var data = JSON.parse(body);
			if (data[0].page <= data[0].pages) {
				data[1].forEach(function(d){
					if(bigdata.country_x.hasOwnProperty(d.country.id) && d.value) {
						bigdata.countries[bigdata.country_x[d.country.id]][mnemonic].push({
							year: d.date,
							value: d.value
						});
			    	};
		    	});
		    	get_world_bank_indicators(mnemonic, source_id, i, page + 1);
		    } else {
		    	bigdata.countries.forEach(function(d){
		    		d[mnemonic].sort(function(a,b){
  						if(a.year < b.year) {return -1};
  						if(a.year > b.year) {return 1};
  						return 0;
					});
				});
		    	console.log("'" + mnemonic + "' loaded.");
		    	get_country_indicators(i+1);
		    };		    
	    } catch (e) {
	   		console.error(e);
	    };
	});
};

get_countries(1);