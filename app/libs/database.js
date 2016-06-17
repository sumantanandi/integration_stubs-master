var pg = require('pg');
pg.defaults.ssl = true;
process.env.DATABASE_URL_HEROKU = 'postgres://tlpxvockugymqf:J87lrFHL63Hbjx9RIrc_8p56O-@ec2-107-22-238-96.compute-1.amazonaws.com:5432/d8ca71bptq826m';
var Client = require('pg').Client;
var client = new Client(process.env.DATABASE_URL_HEROKU);
client.connect();

//process.env.DATABASE_URL = 'postgres://ythaatkhclsrbf:dpb30mSasjoou_bWUS2WeKjt0q@ec2-54-225-195-254.compute-1.amazonaws.com:5432/delv202g5ov939';

process.env.DATABASE_URL = 'postgres://ythaatkhclsrbf:dpb30mSasjoou_bWUS2WeKjt0q@ec2-54-225-195-254.compute-1.amazonaws.com:5432/delv202g5ov939';

//process.env.DATABASE_URL_HEROKU = 'postgres://tlpxvockugymqf:J87lrFHL63Hbjx9RIrc_8p56O@ec2-107-22-238-96.compute-1.amazonaws.com:5432/d8ca71bptq826m';
var rollback = function(client) {
  //terminating a client connection will
  //automatically rollback any uncommitted transactions
  //so while it's not technically mandatory to call
  //ROLLBACK it is cleaner and more correct
  client.query('ROLLBACK', function() {
    client.end();
  });
};
//exports.saveApplication = function(applicationData) {
client.query('BEGIN', function(err, result) {
  if(err) return rollback(client);
  console.log(" ERROR " ,err);
  /*client.query('INSERT INTO account(money) VALUES(100) WHERE id = $1', [1], function(err, result) {
   /*if(err) return rollback(client);
    client.query('INSERT INTO account(money) VALUES(-100) WHERE id = $1', [2], function(err, result) {
      if(err) return rollback(client); */
      //disconnect after successful commit
      /*client.query('COMMIT', client.end.bind(client));
    });*/
	console.log(" QUERY  ");
	client.query({
                    text: 'insert into salesforce.Application__c (Loan_Term_Months__c,Loan_Term__c,Payment_Frequency__c,Total_Loan_Amount__c,Application_Type__c,Channel__c,Application_Source__c,Higher_Approval_Consent__c,Mirror__c,Type_of_Product__c,Branch__c,Business_Source__c,X3rd_Party_Application_Number__c,X3rd_Party_Application_Source__c,Response_Code__c,name) values' +
                    '($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)',
                    values: [
                            /*result.id, 
                            result.first_name,
                            result.last_name,
                            1,
                            ip,
                            date_now.getFullYear() + "-" + month + "-" + date_now.getDate() + " " + date_now.getHours() + ":" + date_now.getMinutes() + ":" + date_now.getSeconds()*/
							36,
							'3.5 years',
							'Monthly',
							12344,
							'Single',
							'',
							'INTERNET',
							'false',
							'INTERNET',
							'Latitude',
							'a0AN0000005chwW',
							//'Personal Loan',
							//'a0AN0000005chwW',
							'INTERNET APPLICATION',
							'A0043',
							'Society One',
							'SC000',
							'A0043'
                            ],
							name: "insertQuery Application__c"
								
							//console.log(" QUERY  ");
  },function(i_err, i_result){
                    console.log("insert query result For Application Data : ",i_result);
                    console.log("insert query error For Application Data  : ",i_err);
					if(i_err) return rollback(client);
                });
  
  // For Applicant Data
  
  client.query({
                    text: 'insert into salesforce.Applicant__c (Is_Primary_Applicant__c,Interested_in_other_services__c,Meets_Eligibility_Criteria__c,Agrees_to_Fees__c,Agrees_to_Privacy_Policy__c,KB_HL_or_Graduate__c,Accept_Terms_and_Conditions__c,EIDV__c,Date_of_Birth__c,Date_of_Birth_WS__c,Work_WS__c,Home_WS__c,Work_Area_Code__c,Home_Area_Code__c,Title__c,First_Name__c,Middle_Name__c,Last_Name__c,Gender__c,Rel_Status__c,Drivers_Lic_Flg__c,Pref_Contact_Method__c,Mobile__c,Home__c,Work__c,Email_Address__c,Unit_No_Res__c,Street_No_Res__c,Street_Res__c,Street_Type_Res__c,Suburb_Res__c,City_Res__c,Postcode_Res__c,Country_Res__c,State_Res__c,Years_At_Addr__c,Months_At_Addr__c,No_of_Deps__c,X3rd_Party_Application_Number__c,Application__c__X3rd_Party_Application_Number__c,name) values' +
                    '($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31,$32,$33,$34,$35,$36,$37,$38,$39,$40,$41)',
                    values: [
                            //'A0043',
							true,
							true,
							true,
							true,
							false,
							true,
							true,
							false,
							'Yes',
							'1987-01-01',
							'1987-01-01',
							'',
							'',
							'',
							'Ms.',
							'abcdkjkj',
							'',
							'efgh',
							'Male',
							'Single',
							false,
							'Phone',
							'0434578717',
							'',
							'',
							'huhua@gmail.com',
							'23',
							'440',
							'St Kilda Road',
							'Road',
							'Melbourne',
							'Melbourne',
							'3004',
							'Australia',
							'VIC',
							'5',
							'5',
							2,
							'A0043',
							'A0043',
							'A0043'

							],
							name: "insertQuery Applicant__c"
								
							//console.log(" QUERY  ");
  },function(i_err, i_result){
                    console.log("insert query result For Applicant Data: ",i_result);
                    console.log("insert query error For Applicant Data: ",i_err);
					if(i_err) return rollback(client);
                });
  
  // For Loan Purpose
  
  client.query({
                    text: 'insert into salesforce.Loan_Purpose__c (Loan_Amount__c,Value__c,	Application__c__X3rd_Party_Application_Number__c,name) values' +
                    '($1,$2,$3,$4)',
                    values: [
							12344.33,
							'Home improvements',
							'A0043',
							'A0043'
							],
							name: "insertQuery Loan_Purpose__c"
								
							//console.log(" QUERY  ");
  },function(i_err, i_result){
                    console.log("insert query result For Loan Purpose: ",i_result);
                    console.log("insert query error For Loan Purpose: ",i_err);
					if(i_err) return rollback(client);
                });
  
  // For Income Purpose
  
  client.query({
                    text: 'insert into salesforce.Income__c (Income_Source__c,Income_Amount__c,Income_Interval__c,Occupation__c,Industry__c,Emp_Bus_Name__c,Employer_Business_Contact_No_Area_Code__c,Emp_Bus_Contact_No__c,Years_With_Employer__c,Months_With_Employer__c,Government_Benefit_Type__c,Total_Income__c,Applicant__c__X3rd_Party_Application_Number__c,name) values' +
                    '($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)',
                    values: [
                            'My permanent - full time job',
							8000,
							'Month',
							'Benefit',
							'Manufacturing',
							'Test Name',
							'03',
							'45677777',
							4,
							4,
							'Child Support',
							8000,
							'A0043',
							'A0043'
							],
							name: "insertQuery Income__c"
								
							//console.log(" QUERY  ");
  },function(i_err, i_result){
                    console.log("insert query result For Income Purpose: ",i_result);
                    console.log("insert query error For Income Purpose: ",i_err);
					if(i_err) return rollback(client);
                });
  
  
  
    // For Expense Purpose
  
  client.query({
                    text: 'insert into salesforce.Expense__c (Living_Exp__c,Living_Exp_Int__c,Rent_Board_Pay_Amt__c,Rent_Board_Pay_Int__c,Agent_Landlord_Name__c,I_Pay_All_Exp__c,Applicant__c__X3rd_Party_Application_Number__c,name) values' +
                    '($1,$2,$3,$4,$5,$6,$7,$8)',
                    values: [
                            333,
							'Month',
							44,
							'Week',
							'test Name',
							true,
							'A0043',
							'A0043'
							],
							name: "insertQuery Expense__c"

							//console.log(" QUERY  ");
  },function(i_err, i_result){
                    console.log("insert query result For Expense Purpose: ",i_result);
                    console.log("insert query error For Expense Purpose: ",i_err);
					if(i_err) return rollback(client);
                });
  
  
  // For Asset  Purpose
  
  client.query({
                    text: 'insert into salesforce.Asset__c (Asset_Category__c,Asset_Value__c,Ownership_Status__c,Vehicle_Make__c,Vehicle_Model__c,Vehicle_Year__c,Total_Assets__c,Applicant__c__X3rd_Party_Application_Number__c,name) values' +
                    '($1,$2,$3,$4,$5,$6,$7,$8,$9)',
                    values: [
                            'Car',
							3333.33,
							'Own outright',
							'Not Sure',
							'test Model',
							'2013',
							33333.33,
							'A0043',
							'A0043'
							],
							name: "insertQuery Asset__c"

							//console.log(" QUERY  ");
  },function(i_err, i_result){
                    console.log("insert query result For Asset  Purpose: ",i_result);
                    console.log("insert query error For Asset  Purpose: ",i_err);
					if(i_err) return rollback(client);
                });
  
  
  // For Debt  Purpose
  
  client.query({
                    text: 'insert into salesforce.Liability__c (Debt_Category__c,Type_of_Credit_Card__c,Financier_Name__c,Card_Overdraft_Bal_Amt__c,Overdraft_APR__c,Mortgage_Bal_Amt__c,Mortgage_Borrowed_Amt__c,Mortgage_Repayment_Amt__c,Mortgage_Repayment_Interval__c,Car_Personal_Bal_Amt__c,Car_Personal_Repay_Amt__c,Car_Personal_Repay_Int__c,Car_Personal_Borrowed_Amt__c,Other_Repay_Int__c,Acknowledge_Payout__c,Applicant__c__X3rd_Party_Application_Number__c,name) values' +
                    '($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)',
                    values: [
                            'Car Loan',
							'Others',
							'Financiar Name',
							777777,
							4445,
							3333,
							3333333.33,
							333.33,
							'Week',
							4443.44,
							223,
							'Week',
							44444.44,
							'Week',
							true,
							'A0043',
							'A0043'
							],
							name: "insertQuery Liability__c"
							
							//console.log(" QUERY  ");
  },function(i_err, i_result){
                    console.log("insert query result For Debt  Purpose: ",i_result);
                    console.log("insert query error For Debt  Purpose: ",i_err);
					if(i_err) return rollback(client);
                });
  client.query('COMMIT', client.end.bind(client));
  //console.log(" ERROR " ,err);
  // Retrieve Data Insert Status
  
   var query = client.query("SELECT _hc_err, _hc_lastop FROM salesforce.Application__c where name = 'A0043' "); //_trigger_log
   //var query = client.query("SELECT * FROM salesforce._trigger_log");
   // sleep.sleep(10); // sleep for ten seconds
	query.on("row", function (row, result) {
    result.addRow(row);
	//callback(row);
});

	query.on("end", function (result) {
    console.log(JSON.stringify(result.rows, null, "    "));
    client.end();
});
  
  
  
    });
	
//}
//});

/*
pg.connect(process.env.DATABASE_URL_HEROKU, function(err, client) {
  if (err) throw err;
  console.log('Connected to postgres! Getting schemas...');

  client
    .query('select * from salesforce.Application__c;') //'SELECT table_schema,table_name FROM information_schema.tables;'
    .on('row', function(row) {
      console.log(JSON.stringify(row));
    });
});*/