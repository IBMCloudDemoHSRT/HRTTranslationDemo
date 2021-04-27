const LanguageTranslatorV3 = require('ibm-watson/language-translator/v3');
const { IamAuthenticator } = require('ibm-watson/auth');


/**
 * Helper 
 * @param {*} errorMessage 
 * @param {*} defaultLanguage 
 */
function getTheErrorResponse(errorMessage, defaultLanguage) {
  return {
    statusCode: 200,
    body: {
      language: defaultLanguage || 'en',
      errorMessage: errorMessage
    }
  };
}

/**
  *
  * main() will be run when the action is invoked
  *
  * @param Cloud Functions actions accept a single parameter, which must be a JSON object.
  *
  * @return The output of this action, which must be a JSON object.
  *
  */
function main(params) {

  /*
   * The default language to choose in case of an error
   */
  const defaultLanguage = 'en';
  
  const LanguageTranslatorV3 = require('ibm-watson/language-translator/v3');
	const { IamAuthenticator } = require('ibm-watson/auth');

	const languageTranslator = new LanguageTranslatorV3({
	  version: '2018-05-01',
	  authenticator: new IamAuthenticator({
		apikey: 'erVQB65Csy6SLHjs81cFvFh6TfFOtEMYpviR9iBtFaiE',
	  }),
	  serviceUrl: 'https://api.eu-de.language-translator.watson.cloud.ibm.com/instances/942b7e56-9f66-49be-80b2-36f7f351b247',
	});

  return new Promise(function (resolve, reject) {

    try {
      
      // *******TODO**********
      // - Call the language identification API of the translation service
      // see: https://cloud.ibm.com/apidocs/language-translator?code=node#identify-language
      // - if successful, resolve exactly like shown below with the
      // language that is most probable the best one in the "language" property
      // and the confidence it got detected in the "confidence" property

      // in case of errors during the call resolve with an error message according to the pattern 
      // found in the catch clause below
	  
	  if(typeof params.text == "string"){
			
			languageTranslator.listIdentifiableLanguages()
			  .then(identifiedLanguages => {
				console.log(JSON.stringify(identifiedLanguages, null, 2));
				resolve({
			statusCode: 200,
			body: {
			  text: params.text, 
			  language: identifiedLanguages.result[0].languages,
			  confidence: identifiedLanguages.result[0].confidence,
			},
			headers: { 'Content-Type': 'application/json' }
		  });
			  })
			  .catch(err => {
				console.error('Error while initializing the AI service', err);
      resolve(getTheErrorResponse('Error while communicating with the language service', defaultLanguage));
			  });
			
		  
	  }


    } catch (err) {
      console.error('Error while initializing the AI service', err);
      resolve(getTheErrorResponse('Error while communicating with the language service', defaultLanguage));
    }
  });
}
